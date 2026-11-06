import { CometAppearance } from './CometAppearance'
import { halleyDisplayOrbit, cometDistance, cometActivity, type TimeRequest } from './comet'
import { ellipseAt, ellipsePath } from './kepler'
import { KuiperRegion } from './KuiperRegion'
import { AsteroidBelt } from './AsteroidBelt'
import { visibleBodyIds } from './satelliteSystems'
import type { SatelliteSystemId } from '../data/types'
import { lockedMoonSpin } from './moonMotion'
import { buildHierarchy, composeWorldPosition } from './hierarchy'
import { SimulationClock } from './simulationClock'
import { qualitySettings, type Quality } from './quality'
import { solarVisual, type SolarGlow } from './solarVisual'
import { BackSide } from 'three'
import { SaturnRings } from './SaturnRings'
import { earthVisual } from './earthVisual'
import { BodyMaterial } from './BodyMaterial'
import type { TextureKey, TextureStatus } from './textureAssets'
import type { SelectionGesture } from './selection'
import { useMemo, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group, Mesh } from 'three'
import { bodies } from '../data/bodies'
import type { BodyId } from '../data/types'
import { bodyDisplay, bodyShape, sceneConfig } from './displayConfig'
import { createOrbitPositions, inclinedOrbitPosition } from './geometry'
import { anglesAt, displayTilt, type MotionSpeed } from './motion'

function Orbit({ radius, focused, inclination = 0, comet = false }: { radius: number; focused: boolean; inclination?: number; comet?: boolean }) {
  const positions = useMemo(() => comet ? ellipsePath(halleyDisplayOrbit, sceneConfig.orbitSegments) : createOrbitPositions(radius, sceneConfig.orbitSegments), [radius, comet])
  return <lineLoop rotation={[comet ? 0 : -inclination * Math.PI / 180, 0, 0]} name="display-orbit" raycast={() => {}}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><lineBasicMaterial color={sceneConfig.orbitColor} transparent opacity={focused ? sceneConfig.focusedOrbitOpacity : sceneConfig.orbitOpacity} depthWrite={false} /></lineLoop>
}

const hierarchy = buildHierarchy(bodies)

export function SolarSystem({ quality, running, speed, debugOutput, selectedId, onSelect, selectionGesture, texturesEnabled, onTextureStatus, earthEffects, saturnRings, solarEffects, solarGlow, sharedTime, reducedMotion = false, showComet = false, cometEffects = true, timeRequest = null, timeOutput, showOuter = false, showBelt = false, showOrbits = true, moonsVisible = false, activeSystem = null }: { reducedMotion?:boolean;sharedTime?: RefObject<number>; showComet?: boolean; cometEffects?: boolean; timeRequest?: TimeRequest; timeOutput?: RefObject<HTMLOutputElement | null>; showOuter?: boolean; showBelt?: boolean; moonsVisible?: boolean; activeSystem?: SatelliteSystemId | null; showOrbits?: boolean; quality: Quality; running: boolean; speed: MotionSpeed; debugOutput?: RefObject<HTMLOutputElement | null>; selectedId: BodyId | null; onSelect: (id: BodyId) => void; selectionGesture: RefObject<SelectionGesture>; texturesEnabled: boolean; onTextureStatus: (id: TextureKey, status: TextureStatus) => void; earthEffects: boolean; saturnRings: boolean; solarEffects: boolean; solarGlow: SolarGlow }) {
  const positions = useRef<Partial<Record<BodyId, Group>>>({})
  const outlines = useRef<Partial<Record<BodyId, Mesh>>>({})
  const meshes = useRef<Partial<Record<BodyId, Mesh>>>({})
  const orbitFrames = useRef<Partial<Record<BodyId, Group>>>({})
  const world = useRef(new Map<string, [number, number, number]>())
  const localTime = useRef(0)
  const time = sharedTime ?? localTime
  const clock = useRef(new SimulationClock())
  const appliedRequest = useRef(-1)
  useFrame((_, delta) => {
    if (timeRequest && timeRequest.id !== appliedRequest.current) { clock.current.setTime(timeRequest.seconds); appliedRequest.current = timeRequest.id }
    time.current = clock.current.advance(delta, speed, running)
    world.current.clear()
    for (const body of hierarchy.ordered) {
      const display = bodyDisplay[body.id]
      const angles = anglesAt(time.current, display.initialPhase, body.orbit?.siderealPeriod.value ?? null, body.siderealRotation?.value ?? 24)
      const position = positions.current[body.id]
      const mesh = meshes.current[body.id]
      const inclination = body.orbit && 'inclination' in body.orbit ? body.orbit.inclination.value : 0
      const local = body.kind === 'comet' ? ellipseAt(halleyDisplayOrbit, time.current) : inclinedOrbitPosition(display.orbitRadius, angles.orbit, inclination)
      const center: [number, number, number] = body.orbit ? world.current.get(body.orbit.center)! : [0, 0, 0]
      const absolute = composeWorldPosition(center, local)
      world.current.set(body.id, absolute)
      orbitFrames.current[body.id]?.position.set(...center)
      if (position) position.position.set(...absolute)
      if (mesh) mesh.rotation.y = body.kind === 'moon' ? lockedMoonSpin(angles.orbit) : angles.spin
      if (outlines.current[body.id]) outlines.current[body.id]!.rotation.y = angles.spin
    }
    if (timeOutput?.current) timeOutput.current.textContent = time.current.toFixed(1)
    if (debugOutput?.current) debugOutput.current.textContent = JSON.stringify({ seconds: time.current, cometDistance: cometDistance(time.current), cometActivity: cometActivity(cometDistance(time.current)), earth: positions.current.earth?.position.toArray(), spin: meshes.current.earth?.rotation.y, venusSpin: meshes.current.venus?.rotation.y, moon: positions.current.moon?.position.toArray(), moonSpin: meshes.current.moon?.rotation.y, satellites: Object.fromEntries(Object.entries(positions.current).map(([id, group]) => [id, group?.position.toArray()])) })
  }, -2)
  const visibleIds = visibleBodyIds(activeSystem, moonsVisible, showBelt, showOuter, showComet)
  return <group name="solar-system">
    {showOuter && !activeSystem && <KuiperRegion reducedMotion={reducedMotion} quality={quality} time={time} />}
    {showBelt && !activeSystem && <AsteroidBelt quality={quality} time={time} selectedId={selectedId} />}
    {bodies.filter(body => visibleIds.includes(body.id)).map(body => {
      const display = bodyDisplay[body.id]
      const tilt = body.kind !== 'moon' && body.orbit && 'obliquity' in body.orbit && body.orbit.obliquity ? displayTilt(body.orbit.obliquity.value) : 0
      const inclination = body.orbit && 'inclination' in body.orbit ? body.orbit.inclination.value : 0
      return <group key={body.id} name={`body-${body.id}`}>
        {showOrbits && body.orbit && (!activeSystem || body.kind === 'moon') && <group ref={node => { if (node) orbitFrames.current[body.id] = node; else delete orbitFrames.current[body.id] }}><Orbit comet={body.kind === 'comet'} inclination={inclination} radius={display.orbitRadius} focused={selectedId !== null} /></group>}
        <group ref={node => { if (node) positions.current[body.id] = node; else delete positions.current[body.id] }} position={body.kind === 'comet' ? ellipseAt(halleyDisplayOrbit, 0) : inclinedOrbitPosition(display.orbitRadius, display.initialPhase, inclination)}>
          {body.kind === 'comet' && cometEffects && <CometAppearance quality={quality} time={time} />}
          <group rotation={[0, 0, tilt]}>
            {body.id === 'saturn' && <SaturnRings enabled={saturnRings} texturesEnabled={texturesEnabled} onStatus={onTextureStatus} />}
            <mesh scale={bodyShape(body.id)} name={body.id} onClick={event => { event.stopPropagation(); if (selectionGesture.current.allows(event.delta, event.button)) onSelect(body.id) }} ref={node => { if (node) meshes.current[body.id] = node; else delete meshes.current[body.id] }}>
              <sphereGeometry args={[display.radius, ...(body.id === 'earth' || body.id === 'sun' ? qualitySettings[quality].detailSphere : qualitySettings[quality].sphere)]} />
              <BodyMaterial solarEffects={solarEffects} solarGlow={solarGlow} earthEffects={earthEffects} time={time} id={body.id} enabled={texturesEnabled} onStatus={onTextureStatus} />
              {/* A subtle meridian is a temporary rotation guide, not a planetary surface feature. */}
              {!texturesEnabled && <mesh raycast={() => {}}>
                <torusGeometry args={[display.radius * 1.003, display.radius * 0.012, 4, 64]} />
                <meshBasicMaterial color={body.kind === 'star' ? '#a87237' : '#d2dce7'} transparent opacity={0.32} depthWrite={false} />
              </mesh>}
            </mesh>
          </group>
          {selectedId === body.id && <mesh ref={node => { if (node) outlines.current[body.id] = node; else delete outlines.current[body.id] }} scale={bodyShape(body.id)} name="selection-outline" raycast={() => {}}><sphereGeometry args={[display.radius * (body.id === 'earth' ? earthVisual.outlineScale : body.id === 'sun' ? solarVisual.outlineScale : sceneConfig.selectionOutlineScale), ...sceneConfig.sphereSegments]} /><meshBasicMaterial color="#f5d49b" side={BackSide} depthWrite={false} /></mesh>}
        </group>
      </group>
    })}
  </group>
}
