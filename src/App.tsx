import {releaseTexts} from './locales/release'
import {spaceTexts} from './locales/spacecraft'
import { oortTexts } from './locales/oort'
import type { ExplorationView } from './scene/exploration'
import { explorationTexts } from './locales/exploration'
import type { SatelliteSystemId } from './data/types'
import type { SystemRequest } from './scene/satelliteSystems'
import { useLayoutEffect, useRef, useState } from 'react'
import type { BodyId } from './data/types'
import { BodyDetails } from './components/BodyDetails'
import { SceneViewport } from './components/SceneViewport'
import { useLocale } from './locales/LocaleProvider'
import { resolveLocale } from './locales/types'

export function App() {
  const { messages: t, locale, setLocale } = useLocale()
  const [sceneView, setSceneView] = useState<ExplorationView['kind']>('overview')
  const [selectedBody, setSelectedBody] = useState<BodyId | null>(null)
  const [systemRequest, setSystemRequest] = useState<SystemRequest>(null)
  const profile = useRef<HTMLDivElement | null>(null)
  useLayoutEffect(() => {
    if (profile.current) profile.current.scrollTop = 0
  }, [selectedBody])
  return (
    <div className="app">
      <a className="skip-link" href="#main">{t.skip}</a>
      <header className="site-header">
        <a className="brand" href="./"><span className="brand-mark" aria-hidden="true">◉</span>{t.brand}</a>
        <div className="header-actions"><span className="header-label">{t.eyebrow}</span><label className="language-picker"><span>{t.language}</span><select aria-label={t.language} value={locale} onChange={event => setLocale(resolveLocale(event.target.value))}><option value="ja" lang="ja">日本語</option><option value="zh" lang="zh-CN">中文</option><option value="en" lang="en">English</option></select></label></div>
      </header>
      <main id="main" tabIndex={-1}>
        <div className="intro"><div><p className="eyebrow">{t.eyebrow}</p><h1>{t.title}</h1></div><p className="intro-description">{t.description}</p></div>
        <div className="explorer-layout">
          <section id="explorer" tabIndex={-1} className="viewport" aria-label={t.stageLabel}>
            <div className="viewport-heading"><span className="view-label"><span className="status-dot" aria-hidden="true" />{selectedBody ? `${t.bodies[selectedBody].name} · ${t.viewCloseup}` : sceneView === 'mission' ? spaceTexts[locale].probeTitle : sceneView==='earth-orbit' ? spaceTexts[locale].orbitTitle : sceneView === 'oort' ? oortTexts[locale].stage : sceneView === 'outer' ? explorationTexts[locale].outerTitle : t.overview}</span><span className="stage-badge">{releaseTexts[locale].ready}</span></div>
            <SceneViewport onViewChange={setSceneView} systemRequest={systemRequest} onSelectionChange={setSelectedBody} />
          </section>
          <aside id="body-details" tabIndex={-1} className="info-panel" aria-labelledby={selectedBody ? 'body-profile-name' : 'about-title'}>
            <div ref={profile} className="info-panel-content" tabIndex={0} role="region" aria-label={t.profileRegion}>
            <a className="back-to-scene" href="#explorer">{t.backToScene}</a>
            {selectedBody ? <BodyDetails onExploreSystem={(center: SatelliteSystemId) => { setSystemRequest(current => ({ id: (current?.id ?? 0) + 1, center })); document.getElementById('explorer')?.focus() }} key={selectedBody} bodyId={selectedBody} /> : <>
            <p className="eyebrow">{t.brand}</p><h2 id="about-title">{t.about}</h2><p>{releaseTexts[locale].about}</p>
            <div className="upcoming"><h3>{t.upcoming}</h3><ol>{t.features.map(feature => <li key={feature}>{feature}</li>)}</ol><p className="muted">{releaseTexts[locale].hint}</p></div>
            <div className="scale-note"><h3>{t.scaleTitle}</h3><p>{t.scaleBody}</p></div>
            </>}
            </div>
          </aside>
        </div>
      </main>
      <footer><span>{t.brand}</span><div><p>{t.footer}</p><p>{t.textures.credit}<a href="https://www.solarsystemscope.com/textures/" target="_blank" rel="noopener noreferrer">Solar System Scope</a> / <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a></p><p>{t.textures.changes}</p><p>{explorationTexts[locale].satelliteCredit}</p><p>{explorationTexts[locale].beltCredit}</p><p>{explorationTexts[locale].plutoCredit}</p></div></footer>
    </div>
  )
}
