import { SunAppearance } from './SunAppearance'
import type { SolarGlow } from './solarVisual'
import type { RefObject } from 'react'
import type { BodyId } from '../data/types'
import { bodyDisplay } from './displayConfig'
import type { TextureKey, TextureStatus } from './textureAssets'
import { useBodyTexture } from './useBodyTexture'
import { EarthAppearance } from './EarthAppearance'
export function BodyMaterial({ id, enabled, onStatus, earthEffects, time, solarEffects, solarGlow }: { id: BodyId; enabled: boolean; onStatus: (id: TextureKey, status: TextureStatus) => void; earthEffects: boolean; time: RefObject<number>; solarEffects: boolean; solarGlow: SolarGlow }) {
  const map = useBodyTexture(id, enabled, onStatus)
  if (id === 'sun') return <SunAppearance map={map} enabled={enabled && solarEffects} glow={solarGlow} time={time} />
  const color = map ? id === 'titan' ? '#d8b579' : '#ffffff' : bodyDisplay[id].color
  if (id === 'earth') return <EarthAppearance day={map} enabled={enabled && earthEffects} onStatus={onStatus} time={time} />
  // A mapped/unmapped transition requires the corresponding shader variant.
  return <meshStandardMaterial key={map?.uuid ?? 'basic'} map={map} color={color} roughness={1} metalness={0} />
}
