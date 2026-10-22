import { bodyIds } from '../data/types'
import { isQuality, qualityLevels, type Quality } from './quality'
import { useLocale } from '../locales/LocaleProvider'
import { isSolarGlow, solarGlowLevels, type SolarGlow } from './solarVisual'
import type { TextureKey, TextureStatus } from './textureAssets'
interface Props {
  reducedMotion: boolean
  systemReduced: boolean
  setMotionPreference: (value: boolean) => void
  quality: Quality
  setQuality: (value: Quality) => void
  texturesEnabled: boolean
  earthEffects: boolean
  saturnRings: boolean
  solarEffects: boolean
  solarGlow: SolarGlow
  textureStatuses: Partial<Record<TextureKey, TextureStatus>>
  setTexturesEnabled: (value: boolean) => void
  setEarthEffects: (value: boolean) => void
  setSaturnRings: (value: boolean) => void
  setSolarEffects: (value: boolean) => void
  setSolarGlow: (value: SolarGlow) => void
}
/** Native details preserves child resource/state ownership while visually collapsed. */
export function DisplaySettings({ reducedMotion, systemReduced, setMotionPreference, quality, setQuality, texturesEnabled, earthEffects, saturnRings, solarEffects, solarGlow, textureStatuses, setTexturesEnabled, setEarthEffects, setSaturnRings, setSolarEffects, setSolarGlow }: Props) {
  const { messages: t } = useLocale()
  const textureFailed = bodyIds.filter(id => textureStatuses[id] === 'failed').length
  const textureReady = bodyIds.filter(id => textureStatuses[id] === 'ready').length
  const hasFailure = Object.values(textureStatuses).some(status => status === 'failed')
  const loading = Object.values(textureStatuses).some(status => status === 'loading')
  return <details className="display-settings">
    <summary><span>{t.display.title}</span><span className={hasFailure ? 'settings-badge has-failure' : 'settings-badge'} role="status">{hasFailure ? t.display.failed : loading ? t.display.loading : t.display.hint}</span></summary>
    <div className="settings-grid">
      <div className="texture-controls motion-preference"><label><input type="checkbox" checked={reducedMotion} disabled={systemReduced} onChange={event => setMotionPreference(event.target.checked)} />{t.accessibility.reduce}</label><p>{systemReduced ? t.accessibility.system : t.accessibility.note}</p></div>
      <div className="texture-controls quality-controls"><label>{t.quality.title}<select aria-label={t.quality.title} value={quality} onChange={event => { if (isQuality(event.target.value)) setQuality(event.target.value) }}>{qualityLevels.map(level => <option key={level} value={level}>{t.quality[level]}</option>)}</select></label><p>{t.quality.note}</p></div>
      <div className="texture-controls" data-textures={texturesEnabled ? 'on' : 'off'} data-texture-ready={textureReady} data-texture-failed={textureFailed}><label><input type="checkbox" checked={texturesEnabled} onChange={event => setTexturesEnabled(event.target.checked)} />{t.textures.enabled}</label><span role="status">{!texturesEnabled ? t.textures.off : textureFailed ? t.textures.failed : textureReady === bodyIds.length ? t.textures.ready : t.textures.loading}</span>{textureFailed > 0 && texturesEnabled && <button type="button" onClick={() => setTexturesEnabled(false)}>{t.textures.useBasic}</button>}<p>{t.textures.note}</p></div>
      <div className="texture-controls earth-controls" data-earth-effects={earthEffects && texturesEnabled ? 'on' : 'off'} data-earth-night={textureStatuses['earth-night'] ?? 'off'} data-earth-clouds={textureStatuses['earth-clouds'] ?? 'off'}><label><input type="checkbox" checked={earthEffects} disabled={!texturesEnabled} onChange={event => setEarthEffects(event.target.checked)} />{t.earthEffects.enabled}</label><span role="status">{!earthEffects || !texturesEnabled ? t.earthEffects.off : textureStatuses.earth === 'failed' || ['earth-night', 'earth-clouds'].some(id => textureStatuses[id as TextureKey] === 'failed') ? t.earthEffects.failed : textureStatuses['earth-night'] === 'ready' && textureStatuses['earth-clouds'] === 'ready' ? t.earthEffects.ready : t.earthEffects.loading}</span><p>{t.earthEffects.note}</p></div>
      <div className="texture-controls ring-controls" data-ring-enabled={saturnRings} data-ring-texture={textureStatuses['saturn-ring'] ?? 'off'}><label><input type="checkbox" checked={saturnRings} onChange={event => setSaturnRings(event.target.checked)} />{t.rings.enabled}</label><span role="status">{!saturnRings ? t.rings.off : !texturesEnabled ? t.rings.basic : textureStatuses['saturn-ring'] === 'failed' ? t.rings.failed : textureStatuses['saturn-ring'] === 'ready' ? t.rings.ready : t.rings.loading}</span><p>{t.rings.note}</p></div>
      <div className="texture-controls solar-controls" data-solar-active={solarEffects && texturesEnabled && textureStatuses.sun === 'ready'} data-solar-glow={solarGlow}><label><input type="checkbox" checked={solarEffects} disabled={!texturesEnabled} onChange={event => setSolarEffects(event.target.checked)} />{t.sunEffects.enabled}</label><span role="status">{!solarEffects || !texturesEnabled ? t.sunEffects.off : textureStatuses.sun === 'failed' ? t.sunEffects.failed : textureStatuses.sun === 'ready' ? t.sunEffects.ready : t.sunEffects.loading}</span><label className="solar-glow-picker">{t.sunEffects.glow}<select value={solarGlow} disabled={!solarEffects || !texturesEnabled || textureStatuses.sun === 'failed'} onChange={event => { const value = Number(event.target.value); if (isSolarGlow(value)) setSolarGlow(value) }}>{solarGlowLevels.map((value, index) => <option key={value} value={value}>{t.sunEffects.levels[index]}</option>)}</select></label><p>{t.sunEffects.note}</p></div>
    </div>
  </details>
}
