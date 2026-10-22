import { useMemo, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, BackSide, type Texture } from 'three'
import { bodyDisplay } from './displayConfig'
import { solarPhase, solarVisual, type SolarGlow } from './solarVisual'
import { solarCoronaFragment, solarSurfaceFragment, solarVertex } from './solarShaders'

export function SunAppearance({ map, enabled, glow, time }: { map: Texture | null; enabled: boolean; glow: SolarGlow; time: RefObject<number> }) {
  const active = enabled && !!map
  const radius = bodyDisplay.sun.radius
  const uniforms = useMemo(() => ({ surfaceMap: { value: map }, phase: { value: 0 }, glow: { value: glow }, radius: { value: radius }, coronaScale: { value: solarVisual.coronaScale } }), [map, radius, glow])
  useFrame(() => { if (active) uniforms.phase.value = solarPhase(time.current) }, -1.5)
  return <>
    {active ? <shaderMaterial key={`solar-${map.uuid}`} vertexShader={solarVertex} fragmentShader={solarSurfaceFragment} uniforms={uniforms} /> : <meshBasicMaterial key={map?.uuid ?? 'basic-sun'} map={map} color={map ? '#ffffff' : bodyDisplay.sun.color} />}
    {active && <mesh name="sun-corona" raycast={() => {}}>
      <sphereGeometry args={[radius * solarVisual.coronaScale, 64, 40]} />
      <shaderMaterial vertexShader={solarVertex} fragmentShader={solarCoronaFragment} uniforms={uniforms} side={BackSide} transparent depthTest depthWrite={false} blending={AdditiveBlending} />
    </mesh>}
  </>
}
