import { useMemo, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, BackSide, Vector3, type Mesh, type Texture } from 'three'
import { useBodyTexture } from './useBodyTexture'
import type { TextureKey, TextureStatus } from './textureAssets'
import { bodyDisplay } from './displayConfig'
import { cloudDrift, earthVisual, setEarthSunDirection } from './earthVisual'
import { atmosphereFragment, earthFragment, earthVertex } from './earthShaders'

export function EarthAppearance({ day, enabled, onStatus, time }: { day: Texture | null; enabled: boolean; onStatus: (id: TextureKey, status: TextureStatus) => void; time: RefObject<number> }) {
  const active = enabled && !!day
  const night = useBodyTexture('earth-night', active, onStatus)
  const clouds = useBodyTexture('earth-clouds', active, onStatus)
  const cloudMesh = useRef<Mesh | null>(null)
  const atmosphere = useRef<Mesh | null>(null)
  const center = useRef(new Vector3())
  const uniforms = useMemo(() => ({ dayMap: { value: day }, nightMap: { value: night }, twilight: { value: earthVisual.twilight }, sunDirection: { value: new Vector3(1, 0, 0) } }), [day, night])
  useFrame(() => {
    if (cloudMesh.current) cloudMesh.current.rotation.y = cloudDrift(time.current)
    if (atmosphere.current) {
      atmosphere.current.getWorldPosition(center.current)
      setEarthSunDirection(center.current, uniforms.sunDirection.value)
    }
  }, -1.5)
  const radius = bodyDisplay.earth.radius
  return <>
    {active && night ? <shaderMaterial key={`${day.uuid}-${night.uuid}`} vertexShader={earthVertex} fragmentShader={earthFragment} uniforms={uniforms} /> : <meshStandardMaterial key={day?.uuid ?? 'basic'} map={day} color={day ? '#ffffff' : bodyDisplay.earth.color} roughness={1} />}
    {active && clouds && <mesh ref={cloudMesh} name="earth-cloud-layer" raycast={() => {}} renderOrder={1}>
      <sphereGeometry args={[radius * earthVisual.cloudScale, 48, 32]} />
      <meshStandardMaterial alphaMap={clouds} color="#ffffff" transparent opacity={0.82} depthWrite={false} roughness={1} />
    </mesh>}
    {active && <mesh ref={atmosphere} name="earth-atmosphere" raycast={() => {}} renderOrder={2}>
      <sphereGeometry args={[radius * earthVisual.atmosphereScale, 48, 32]} />
      <shaderMaterial vertexShader={earthVertex} fragmentShader={atmosphereFragment} uniforms={uniforms} transparent depthWrite={false} side={BackSide} blending={AdditiveBlending} />
    </mesh>}
  </>
}
