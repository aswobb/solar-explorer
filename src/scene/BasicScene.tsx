import { useReducedMotion } from '../components/useReducedMotion'
import type { OrbitAction } from './cameraControl'
import { qualitySettings, type Quality } from './quality'
import { DisplaySettings } from './DisplaySettings'
import { RendererReport } from './RendererReport'
import { solarVisual, type SolarGlow } from './solarVisual'
import type { TextureKey, TextureStatus } from './textureAssets'
import type { CameraMode } from './focus'
import { SelectionGesture } from './selection'
import type { BodyId } from '../data/types'
import type { CameraAction, CameraCommand } from './cameraControl'
import { isMotionSpeed, motionConfig, type MotionSpeed } from './motion'
import { SolarSystem } from './SolarSystem'
import { OverviewCamera } from './OverviewCamera'
import { bodyDisplay, sceneConfig } from './displayConfig'
import { bodyIds } from '../data/types'
import { useLocale } from '../locales/LocaleProvider'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import type { WebGLRenderer } from 'three'
import { BackgroundStars } from './BackgroundStars'

function SceneLifecycle({ onReady, onFailure }: { onReady: () => void; onFailure: () => void }) {
  const gl = useThree(state => state.gl)
  const camera = useThree(state => state.camera)
  const invalidate = useThree(state => state.invalidate)
  useEffect(() => {
    camera.lookAt(0, 0, 0)
    invalidate()
    const canvas = gl.domElement
    const lost = (event: Event) => {
      event.preventDefault()
      onFailure()
    }
    canvas.addEventListener('webglcontextlost', lost)
    onReady()
    return () => { canvas.removeEventListener('webglcontextlost', lost) }
  }, [camera, gl, invalidate, onReady, onFailure])
  return null
}

export default function BasicScene({ onFailure, fallback, loading, caption, onSelectionChange }: {
  onSelectionChange: (id: BodyId | null) => void
  onFailure: () => void
  fallback: ReactNode
  loading: ReactNode
  caption: string
}) {
  const { messages: t } = useLocale()
  const systemReduced = useReducedMotion()
  const [motionPreference, setMotionPreference] = useState(false)
  const reducedMotion = systemReduced || motionPreference
  const [quality, setQuality] = useState<Quality>('standard')
  const [texturesEnabled, setTexturesEnabled] = useState(true)
  const [earthEffects, setEarthEffects] = useState(true)
  const [saturnRings, setSaturnRings] = useState(true)
  const [solarEffects, setSolarEffects] = useState(true)
  const [solarGlow, setSolarGlow] = useState<SolarGlow>(solarVisual.defaultGlow)
  const [textureStatuses, setTextureStatuses] = useState<Partial<Record<TextureKey, TextureStatus>>>({})
  const onTextureStatus = useCallback((id: TextureKey, status: TextureStatus) => {
    setTextureStatuses(current => current[id] === status ? current : { ...current, [id]: status })
  }, [])
  const [selectedId, setSelectedId] = useState<BodyId | null>(null)
  useEffect(() => { onSelectionChange(selectedId) }, [selectedId, onSelectionChange])
  useEffect(() => () => onSelectionChange(null), [onSelectionChange])
  const selectionGesture = useRef(new SelectionGesture())
  const [cameraCommand, setCameraCommand] = useState<CameraCommand>({ id: 0, action: 'reset' })
  const [cameraMode, setCameraMode] = useState<CameraMode>('overview')
  const cameraBusy = cameraMode === 'focusing' || cameraMode === 'returning'
  function cameraAction(action: CameraAction) {
    if (action === 'reset') setSelectedId(null)
    setCameraCommand(current => ({ id: current.id + 1, action }))
  }
  function selectBody(bodyId: BodyId) {
    setSelectedId(bodyId)
    setCameraCommand(current => ({ id: current.id + 1, action: 'focus', bodyId }))
  }
  const resetButton = useRef<HTMLButtonElement | null>(null)
  function clearSelection() { cameraAction('reset'); resetButton.current?.focus() }
  const [paused, setPaused] = useState(systemReduced)
  useEffect(() => { if (reducedMotion) setPaused(true) }, [reducedMotion])
  const [speed, setSpeed] = useState<MotionSpeed>(1)
  const [visible, setVisible] = useState(() => !document.hidden)
  useEffect(() => {
    const update = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])
  const running = !paused && visible
  const [ready, setReady] = useState(false)
  const renderer = useRef<WebGLRenderer | null>(null)
  const debugOutput = useRef<HTMLOutputElement | null>(null)
  const cameraDebugOutput = useRef<HTMLOutputElement | null>(null)
  const debug = import.meta.env.DEV && new URLSearchParams(location.search).get('debugScene') === '1'
  // Stable callbacks keep language changes from re-running GPU lifecycle setup.
  const readyCallback = useRef(() => setReady(true)).current
  return (
    <div className="scene-composition" data-motion={running ? 'running' : 'paused'} data-speed={speed} data-camera-mode={cameraMode}><div className="scene-host" data-scene-ready={ready} data-selected-body={selectedId ?? ''}
      onPointerDownCapture={event => { if (event.target instanceof HTMLCanvasElement) selectionGesture.current.down(event.pointerId, event.clientX, event.clientY, event.button) }}
      onPointerMoveCapture={event => selectionGesture.current.move(event.pointerId, event.clientX, event.clientY)}
      onPointerUpCapture={event => selectionGesture.current.up(event.pointerId, event.clientX, event.clientY)}
      onPointerCancelCapture={event => selectionGesture.current.cancel(event.pointerId)}>
      <Canvas
        frameloop={running || cameraBusy ? 'always' : 'demand'} dpr={[1, qualitySettings[quality].maxDpr]}
        camera={{ position: [0, 100, 60], fov: sceneConfig.camera.fov, near: sceneConfig.camera.near, far: sceneConfig.camera.far }}
        gl={{ antialias: true, alpha: false, powerPreference: 'default' }}
        fallback={fallback}
        onCreated={({ gl }) => { renderer.current = gl }}
        aria-hidden="true"
      >
        <color attach="background" args={[sceneConfig.background]} />
        <ambientLight intensity={sceneConfig.light.ambient} />
        <pointLight name="sun-position-light" position={[0, 0, 0]} intensity={sceneConfig.light.sunIntensity} decay={sceneConfig.light.decay} />
        <BackgroundStars quality={quality} />
        {debug && <RendererReport />}
        <OverviewCamera reducedMotion={reducedMotion} command={cameraCommand} onModeChange={setCameraMode} debugOutput={debug ? cameraDebugOutput : undefined} />
        <SolarSystem quality={quality} solarEffects={solarEffects} solarGlow={solarGlow} saturnRings={saturnRings} earthEffects={earthEffects} texturesEnabled={texturesEnabled} onTextureStatus={onTextureStatus} running={running} speed={speed} debugOutput={debug ? debugOutput : undefined} selectedId={selectedId} onSelect={selectBody} selectionGesture={selectionGesture} />
        {debug && <mesh position={[0, 7, 0]}><boxGeometry args={[4, 4, 4]} /><meshStandardMaterial color="#c7b08a" /></mesh>}
        <SceneLifecycle onReady={readyCallback} onFailure={onFailure} />
      </Canvas>
      {ready && <div className="selection-status"><p role="status">{selectedId ? <>{t.selectionLabel}<strong>{t.bodies[selectedId].name}</strong></> : t.selectionHint}</p>{selectedId && <div className="selection-actions"><a href="#body-details">{t.details.read}</a><button type="button" onClick={clearSelection}>{t.selectionClear}</button></div>}</div>}
            {!ready && <div className="scene-loading">{loading}</div>}
      {debug && <output ref={cameraDebugOutput} className="camera-debug" aria-label="DEV camera sample" />}
      {debug && <output ref={debugOutput} className="motion-debug" aria-label="DEV motion sample" />}
      {debug && <button className="scene-debug" onClick={() => renderer.current?.forceContextLoss()}>DEV: lose WebGL context</button>}
    </div><ul className="body-legend" aria-label={t.bodyLegend}>{bodyIds.map(id => <li key={id}><button type="button" aria-pressed={selectedId === id} onClick={() => selectBody(id)}><span className="legend-dot" style={{ backgroundColor: bodyDisplay[id].color }} aria-hidden="true" />{t.bodies[id].name}</button></li>)}</ul>
    <div className="explorer-toolbar"><div className="keyboard-view" role="group" tabIndex={0} aria-label={t.keyboard.title} aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown" aria-disabled={cameraBusy} onKeyDown={event => { const actions: Record<string, OrbitAction | undefined> = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' }; const action = actions[event.key]; if (action && event.target === event.currentTarget) { event.preventDefault(); if (!cameraBusy) cameraAction(action) } }}><span>{t.keyboard.title}</span><p>{t.keyboard.hint}</p></div>{ready && <div className="camera-controls"><p><span role="status">{t.cameraModes[cameraMode]}</span><br />{cameraBusy ? t.cameraTransitionHint : t.cameraHint}</p><div><button type="button" disabled={cameraBusy} onClick={() => cameraAction('in')}>{t.cameraZoomIn}</button><button type="button" disabled={cameraBusy} onClick={() => cameraAction('out')}>{t.cameraZoomOut}</button><button ref={resetButton} type="button" onClick={() => cameraAction('reset')}>{selectedId || cameraMode !== 'overview' ? t.cameraOverview : t.cameraReset}</button></div></div>}{ready && <div className="motion-controls"><button type="button" onClick={() => setPaused(value => !value)}>{paused ? t.motionPlay : t.motionPause}</button><label>{t.motionSpeed}<select value={speed} onChange={event => { const value = Number(event.target.value); if (isMotionSpeed(value)) setSpeed(value) }}>{motionConfig.speeds.map(value => <option key={value} value={value}>{value}×</option>)}</select></label><span role="status">{running ? t.motionRunning : t.motionPaused}</span></div>}</div>
    {ready && <p className="scene-caption">{caption}</p>}
    <DisplaySettings reducedMotion={reducedMotion} systemReduced={systemReduced} setMotionPreference={setMotionPreference} quality={quality} setQuality={setQuality} texturesEnabled={texturesEnabled} earthEffects={earthEffects} saturnRings={saturnRings} solarEffects={solarEffects} solarGlow={solarGlow} textureStatuses={textureStatuses} setTexturesEnabled={setTexturesEnabled} setEarthEffects={setEarthEffects} setSaturnRings={setSaturnRings} setSolarEffects={setSolarEffects} setSolarGlow={setSolarGlow} />
    </div>
  )
}
