import { DoubleSide } from 'three'
import { bodyDisplay, saturnRingConfig } from './displayConfig'
import { mapRingUvs } from './ringGeometry'
import { useBodyTexture } from './useBodyTexture'
import type { TextureKey, TextureStatus } from './textureAssets'

export function SaturnRings({ enabled, texturesEnabled, onStatus }: { enabled: boolean; texturesEnabled: boolean; onStatus: (id: TextureKey, status: TextureStatus) => void }) {
  const map = useBodyTexture('saturn-ring', enabled && texturesEnabled, onStatus)
  if (!enabled) return null
  const inner = bodyDisplay.saturn.radius * saturnRingConfig.innerScale
  const outer = bodyDisplay.saturn.radius * saturnRingConfig.outerScale
  return <mesh name="saturn-rings" rotation={[-Math.PI / 2, 0, 0]} raycast={() => {}}>
    <ringGeometry args={[inner, outer, saturnRingConfig.segments, 1]} onUpdate={geometry => mapRingUvs(geometry, inner, outer)} />
    {/* Opaque planet writes depth first; only ring fragments in front blend over it. */}
    <meshStandardMaterial key={map?.uuid ?? 'basic-ring'} map={map} color={map ? '#ffffff' : '#b9ad91'} emissive={map ? '#ffffff' : '#b9ad91'} emissiveMap={map} emissiveIntensity={0.65} side={DoubleSide} transparent opacity={map ? 1 : 0.62} alphaTest={0.025} depthTest depthWrite={false} roughness={1} forceSinglePass />
  </mesh>
}
