import { qualitySettings, type Quality } from './quality'
import { solarVisual, type SolarGlow } from './solarVisual'
import { BackSide } from 'three'
import { SaturnRings } from './SaturnRings'
import { earthVisual } from './earthVisual'
import { BodyMaterial } from './BodyMaterial'
import type { TextureKey, TextureStatus } from './textureAssets'
import type { SelectionGesture } from './selection'
import { useEffect, useMemo, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group, Mesh } from 'three'
import { bodies } from '../data/bodies'
import type { BodyId } from '../data/types'
import { bodyDisplay, sceneConfig } from './displayConfig'
import { createOrbitPositions, orbitPosition } from './geometry'
import { anglesAt, displayTilt, simulationStep, type MotionSpeed } from './motion'

function Orbit({ radius, focused }: { radius: number; focused: boolean }) {
  const positions = useMemo(() => createOrbitPositions(radius, sceneConfig.orbitSegments), [radius])
  return <lineLoop name="display-orbit" raycast={() => {}}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><lineBasicMaterial color={sceneConfig.orbitColor} transparent opacity={focused ? sceneConfig.focusedOrbitOpacity : sceneConfig.orbitOpacity} depthWrite={false} /></lineLoop>
}

export function SolarSystem({ quality, running, speed, debugOutput, selectedId, onSelect, selectionGesture, texturesEnabled, onTextureStatus, earthEffects, saturnRings, solarEffects, solarGlow }: { quality: Quality; running: boolean; speed: MotionSpeed; debugOutput?: RefObject<HTMLOutputElement | null>; selectedId: BodyId | null; onSelect: (id: BodyId) => void; selectionGesture: RefObject<SelectionGesture>; texturesEnabled: boolean; onTextureStatus: (id: TextureKey, status: TextureStatus) => void; earthEffects: boolean; saturnRings: boolean; solarEffects: boolean; solarGlow: SolarGlow }) {
  const positions = useRef<Partial<Record<BodyId, Group>>>({})
  const meshes = useRef<Partial<Record<BodyId, Mesh>>>({})
  const time = useRef(0)
  const primeFrame = useRef(true)
  useEffect(() => { primeFrame.current = true }, [running])
  useFrame((_, delta) => {
    if (!running) return
    // The first frame after resume may include time spent paused; do not integrate it.
    if (primeFrame.current) { primeFrame.current = false; return }
    time.current += simulationStep(delta, speed, true)
    for (const body of bodies) {
      const display = bodyDisplay[body.id]
      const angles = anglesAt(time.current, display.initialPhase, body.orbit?.siderealPeriod.value ?? null, body.siderealRotation.value)
      const position = positions.current[body.id]
      const mesh = meshes.current[body.id]
      if (position) position.position.set(...orbitPosition(display.orbitRadius, angles.orbit))
      if (mesh) mesh.rotation.y = angles.spin
    }
    if (debugOutput?.current) debugOutput.current.textContent = JSON.stringify({ seconds: time.current, earth: positions.current.earth?.position.toArray(), spin: meshes.current.earth?.rotation.y, venusSpin: meshes.current.venus?.rotation.y })
  }, -2)
  return <group name="solar-system">
    {bodies.map(body => {
      const display = bodyDisplay[body.id]
      const tilt = body.orbit ? displayTilt(body.orbit.obliquity.value) : 0
      return <group key={body.id} name={`body-${body.id}`}>
        {body.kind === 'planet' && <Orbit radius={display.orbitRadius} focused={selectedId !== null} />}
        <group ref={node => { if (node) positions.current[body.id] = node; else delete positions.current[body.id] }} position={orbitPosition(display.orbitRadius, display.initialPhase)}>
          <group rotation={[0, 0, tilt]}>
            {body.id === 'saturn' && <SaturnRings enabled={saturnRings} texturesEnabled={texturesEnabled} onStatus={onTextureStatus} />}
            <mesh name={body.id} onClick={event => { event.stopPropagation(); if (selectionGesture.current.allows(event.delta, event.button)) onSelect(body.id) }} ref={node => { if (node) meshes.current[body.id] = node; else delete meshes.current[body.id] }}>
              <sphereGeometry args={[display.radius, ...(body.id === 'earth' || body.id === 'sun' ? qualitySettings[quality].detailSphere : qualitySettings[quality].sphere)]} />
              <BodyMaterial solarEffects={solarEffects} solarGlow={solarGlow} earthEffects={earthEffects} time={time} id={body.id} enabled={texturesEnabled} onStatus={onTextureStatus} />
              {/* A subtle meridian is a temporary rotation guide, not a planetary surface feature. */}
              {!texturesEnabled && <mesh raycast={() => {}}>
                <torusGeometry args={[display.radius * 1.003, display.radius * 0.012, 4, 64]} />
                <meshBasicMaterial color={body.kind === 'star' ? '#a87237' : '#d2dce7'} transparent opacity={0.32} depthWrite={false} />
              </mesh>}
            </mesh>
          </group>
          {selectedId === body.id && <mesh name="selection-outline" raycast={() => {}}><sphereGeometry args={[display.radius * (body.id === 'earth' ? earthVisual.outlineScale : body.id === 'sun' ? solarVisual.outlineScale : sceneConfig.selectionOutlineScale), ...sceneConfig.sphereSegments]} /><meshBasicMaterial color="#f5d49b" side={BackSide} depthWrite={false} /></mesh>}
        </group>
      </group>
    })}
  </group>
}
