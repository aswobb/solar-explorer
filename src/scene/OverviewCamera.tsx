import { useCallback, useLayoutEffect, useRef, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei/core/OrbitControls'
import { PerspectiveCamera, MOUSE, TOUCH, Vector3, type Object3D } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { bodyVisualRadius, overviewRadius, sceneConfig } from './displayConfig'
import { overviewDistance } from './geometry'
import { controlLimits, orbitAngles, zoomDistance, type CameraCommand } from './cameraControl'
import { focusConfig, focusDistance, focusLimits, transitionProgress, type CameraMode } from './focus'

/** Single camera owner: motion (-2), OrbitControls (-1), follow/transition (0). */
export function OverviewCamera({ reducedMotion, command, onModeChange, debugOutput }: {
  reducedMotion: boolean
  command: CameraCommand
  onModeChange: (mode: CameraMode) => void
  debugOutput?: RefObject<HTMLOutputElement | null>
}) {
  const controls = useRef<OrbitControlsImpl | null>(null)
  const manual = useRef(false)
  const previousCommand = useRef(-1)
  const mode = useRef<CameraMode>('overview')
  const body = useRef<Object3D | null>(null)
  const transition = useRef({ elapsed: 0, duration: focusConfig.duration as number })
  const vectors = useRef({ startPosition: new Vector3(), startTarget: new Vector3(), target: new Vector3(), destination: new Vector3(), offset: new Vector3(), previousTarget: new Vector3(), movement: new Vector3() })
  const camera = useThree(state => state.camera)
  const scene = useThree(state => state.scene)
  const size = useThree(state => state.size)
  const invalidate = useThree(state => state.invalidate)
  const report = useCallback(() => {
    const control = controls.current
    if (control && debugOutput?.current) debugOutput.current.textContent = JSON.stringify({ mode: mode.current, enabled: control.enabled, position: camera.position.toArray(), target: control.target.toArray(), body: body.current?.name ?? null, bodyPosition: body.current ? body.current.getWorldPosition(vectors.current.target).toArray() : null, distance: camera.position.distanceTo(control.target), polar: control.getPolarAngle() })
  }, [camera, debugOutput])
  const changeMode = useCallback((next: CameraMode) => { mode.current = next; onModeChange(next) }, [onModeChange])

  useLayoutEffect(() => {
    const control = controls.current
    if (!control || !(camera instanceof PerspectiveCamera) || size.width <= 0 || size.height <= 0) return
    const v = vectors.current
    const fresh = previousCommand.current === -1
    const newCommand = previousCommand.current !== command.id
    const overviewPose = () => {
      const distance = Math.min(controlLimits.maxDistance, overviewDistance(overviewRadius, camera.fov, size.width / size.height, sceneConfig.camera.framingMargin))
      v.destination.set(0, Math.sin(sceneConfig.camera.elevation) * distance, Math.cos(sceneConfig.camera.elevation) * distance)
      v.target.set(0, 0, 0)
    }
    if (fresh || newCommand) {
      // Remove residual damping before another camera operation takes ownership.
      if (control.enabled) {
        const damping = control.enableDamping
        control.enableDamping = false
        control.update()
        control.enableDamping = damping
      }
      if (command.action === 'focus') {
        const targetBody = scene.getObjectByName(command.bodyId)
        if (!targetBody) return
        body.current = targetBody
        const radius = bodyVisualRadius(command.bodyId)
        const distance = focusDistance(radius, camera.fov, size.width / size.height)
        const limits = focusLimits(radius, distance)
        control.minDistance = limits.min
        control.maxDistance = limits.max
        v.offset.copy(camera.position).sub(control.target).normalize().multiplyScalar(distance)
        body.current.getWorldPosition(v.target)
        v.destination.copy(v.target).add(v.offset)
        changeMode('focusing')
      } else if (command.action === 'reset') {
        body.current = null
        control.minDistance = controlLimits.minDistance
        control.maxDistance = controlLimits.maxDistance
        overviewPose()
        changeMode(fresh ? 'overview' : 'returning')
      } else {
        if (mode.current === 'focusing' || mode.current === 'returning') return
        manual.current = true
        v.offset.copy(camera.position).sub(control.target)
        if (command.action === 'in' || command.action === 'out') {
          v.offset.setLength(zoomDistance(v.offset.length(), command.action, control.minDistance, control.maxDistance))
        } else {
          const angles = orbitAngles(control.getAzimuthalAngle(), control.getPolarAngle(), command.action)
          v.offset.setFromSphericalCoords(v.offset.length(), angles.polar, angles.azimuth)
        }
        camera.position.copy(control.target).add(v.offset)
        control.update()
      }
      if (command.action === 'focus' || command.action === 'reset') {
        manual.current = false
        v.startPosition.copy(camera.position)
        v.startTarget.copy(control.target)
        transition.current = { elapsed: 0, duration: fresh || reducedMotion ? 0 : focusConfig.duration }
        if (fresh) {
          camera.position.copy(v.destination)
          control.target.copy(v.target)
          camera.lookAt(control.target)
          control.update()
        } else control.enabled = false
      }
      previousCommand.current = command.id
    } else if (mode.current === 'returning') {
      overviewPose()
    } else if (mode.current === 'overview' && !manual.current) {
      overviewPose()
      camera.position.copy(v.destination)
      control.target.set(0,0,0)
      control.update()
    }
    report()
    invalidate()
  }, [camera, command, size.width, size.height, invalidate, report, scene, changeMode, reducedMotion])

  useFrame((_, delta) => {
    const control = controls.current
    if (!control) return
    const v = vectors.current
    if (mode.current === 'focusing' || mode.current === 'returning') {
      transition.current.elapsed += Math.min(delta, focusConfig.maxDelta)
      const progress = transitionProgress(transition.current.elapsed, reducedMotion ? 0 : transition.current.duration)
      if (mode.current === 'focusing' && body.current) {
        body.current.getWorldPosition(v.target)
        v.destination.copy(v.target).add(v.offset)
      }
      camera.position.lerpVectors(v.startPosition, v.destination, progress)
      control.target.lerpVectors(v.startTarget, v.target, progress)
      camera.lookAt(control.target)
      if (progress === 1) {
        v.previousTarget.copy(control.target)
        control.enabled = true
        control.update()
        changeMode(mode.current === 'focusing' ? 'following' : 'overview')
      }
      invalidate()
      report()
    } else if (mode.current === 'following' && body.current) {
      body.current.getWorldPosition(v.target)
      v.movement.copy(v.target).sub(v.previousTarget)
      camera.position.add(v.movement)
      control.target.copy(v.target)
      v.previousTarget.copy(v.target)
      report()
    }
  })
  return <OrbitControls ref={controls} makeDefault enablePan={false} enableDamping={!reducedMotion} dampingFactor={0.1} minPolarAngle={controlLimits.minPolar} maxPolarAngle={controlLimits.maxPolar} rotateSpeed={0.65} zoomSpeed={0.7} mouseButtons={{ LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.ROTATE }} touches={{ ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_ROTATE }} onStart={() => { manual.current = true }} onChange={report} />
}
