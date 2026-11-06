import {ExplorerNavigation,ExplorerLayers,type LayerOption} from '../components/ExplorerNavigation'
import {releaseTexts} from '../locales/release'
import {missionFraming} from './spacecraftMotion'
import {OrbiterPanel,MissionPanel} from '../components/SpacecraftPanel'
import {spaceTexts} from '../locales/spacecraft'
import {orbiterIds,missions,type OrbiterId,type MissionId} from '../data/spacecraft'
import {EarthOrbiters,type OrbiterLabels} from './EarthOrbiters'
import {MissionScene,type MissionSeek,type MissionLabels} from './MissionScene'
import type {CameraSnapshot} from './cameraControl'
import { DistanceScale } from '../components/DistanceScale'
import { OortCloud } from './OortCloud'
import { oortTexts } from '../locales/oort'
import { cometTexts } from '../locales/comet'
import { halleyDisplayOrbit, type TimeRequest } from './comet'
import { apsisTime } from './kepler'
import { BodyCatalog } from '../components/BodyCatalog'
import { isOuterBody } from './outerScene'
import { outerBodyIds } from '../data/types'
import { OuterLabelProjector, type OuterLabelElements } from './OuterLabelProjector'
import { smallBodyIds } from '../data/types'
import { SatelliteLabelProjector, type SatelliteLabelElements } from './SatelliteLabelProjector'
import { moons } from '../data/bodies'
import { satelliteParent, isSatelliteSystem, visibleBodyIds, type SystemRequest } from './satelliteSystems'
import type { SatelliteSystemId } from '../data/types'
import { defaultLayers, parentView, type ExplorationView } from './exploration'
import { explorationTexts } from '../locales/exploration'
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

export default function BasicScene({ onFailure, fallback, loading, caption, onSelectionChange, systemRequest, onViewChange }: {
  onViewChange: (view: ExplorationView['kind']) => void
  systemRequest: SystemRequest
  onSelectionChange: (id: BodyId | null) => void
  onFailure: () => void
  fallback: ReactNode
  loading: ReactNode
  caption: string
}) {
  const { messages: t, locale } = useLocale()
  const exploration = explorationTexts[locale]
  const comet = cometTexts[locale]
  const oort = oortTexts[locale]
  const space=spaceTexts[locale]
  const ui=releaseTexts[locale]
  const mainTime=useRef(0)
  const cameraPose=useRef<CameraSnapshot|null>(null)
  const topicReturn=useRef<{view:ExplorationView;selected:BodyId|null;craft:OrbiterId|null;pose:CameraSnapshot|null}|null>(null)
  const [mission,setMission]=useState<MissionId|null>(null)
  const [missionRunning,setMissionRunning]=useState(false)
  const [missionProgress,setMissionProgress]=useState(0)
  const [missionSeek,setMissionSeek]=useState<MissionSeek>({id:0,progress:0})
  const [missionSpeed,setMissionSpeed]=useState<MotionSpeed>(1)
  const [showRoute,setShowRoute]=useState(true)
  const [showOrbiters,setShowOrbiters]=useState(true)
  const [orbiterOrbits,setOrbiterOrbits]=useState(true)
  const [simpleCraft,setSimpleCraft]=useState(false)
  const [selectedCraft,setSelectedCraft]=useState<OrbiterId|null>(null)
  const craftLabels=useRef<OrbiterLabels>({})
  const missionLabels=useRef<MissionLabels>({})
  const previousNearView = useRef<{view:ExplorationView;craft:OrbiterId|null}>({view:{kind:'overview'},craft:null})
  const [showComet, setShowComet] = useState(false)
  const [cometEffects, setCometEffects] = useState(true)
  const [timeRequest, setTimeRequest] = useState<TimeRequest>(null)
  const timeOutput = useRef<HTMLOutputElement | null>(null)
  const [layers, setLayers] = useState(defaultLayers)
  const [view, setView] = useState<ExplorationView>({ kind: 'overview' })
  const oortView = view.kind === 'oort'
  const earthOrbitView=view.kind==='earth-orbit'
  useEffect(() => { onViewChange(view.kind) }, [view.kind, onViewChange])
  useEffect(() => () => onViewChange('overview'), [onViewChange])
  const systemReduced = useReducedMotion()
  const [motionPreference, setMotionPreference] = useState<boolean>(false)
  const reducedMotion = motionPreference
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
  const previousInnerTarget = useRef<BodyId | null>(null)
  const outerLabelElements = useRef<OuterLabelElements>({})
  const labelElements = useRef<SatelliteLabelElements>({})
  const selectionGesture = useRef(new SelectionGesture())
  const [cameraCommand, setCameraCommand] = useState<CameraCommand>({ id: 0, action: 'reset' })
  const [cameraMode, setCameraMode] = useState<CameraMode>('overview')
  const cameraBusy = cameraMode === 'focusing' || cameraMode === 'returning'
  function cameraAction(action: CameraAction) {
    if(['reset','oort','outer'].includes(action))setSelectedCraft(null)
    if (action === 'reset') { setSelectedId(null); setView({ kind: 'overview' }); setLayers(current => ({ ...current, kuiper: false })) }
    if (action === 'oort') { setSelectedId(null); setView({kind:'oort'}); setLayers(current=>({...current,kuiper:false})) }
    if (action === 'outer') { setSelectedId(null); setView({ kind: 'outer', region: 'kuiper' }); setLayers(current => ({ ...current, kuiper: true })) }
    setCameraCommand(current => ({ id: current.id + 1, action }))
  }
  function selectBody(bodyId: BodyId) {
    if(mission){setMission(null);setMissionRunning(false)}
    setSelectedCraft(null)
    if (bodyId === 'halley') setShowComet(true)
    if (isOuterBody(bodyId)) {
      if (!outerView && !oortView) previousNearView.current = {view,craft:selectedCraft}
      if (!outerView) previousInnerTarget.current = selectedId && !isOuterBody(selectedId) ? selectedId : null
      setLayers(current => ({ ...current, kuiper: true }))
    } else setLayers(current => ({ ...current, kuiper: false }))
    setSelectedId(bodyId)
    setView({ kind: 'body', center: bodyId })
    if (smallBodyIds.some(id => id === bodyId)) setLayers(current => ({ ...current, regions: true }))
    if (satelliteParent(bodyId)) setLayers(current => ({ ...current, moons: true }))
    setCameraCommand(current => ({ id: current.id + 1, action: 'focus', bodyId }))
  }
  const enterSystem = useCallback((center: SatelliteSystemId) => {
    setSelectedCraft(null)
    setLayers(current => ({ ...current, moons: true, kuiper: false }))
    setView({ kind: 'system', center })
    setSelectedId(center)
    setCameraCommand(current => ({ id: current.id + 1, action: 'focus', bodyId: center, framing: 'satellite-system' }))
  }, [])
  const previousSystemRequest = useRef(0)
  useEffect(() => {
    if (systemRequest && systemRequest.id > previousSystemRequest.current) {
      enterSystem(systemRequest.center)
      previousSystemRequest.current = systemRequest.id
    }
  }, [systemRequest, enterSystem])
  function enterOuter() {
    if (!outerView && !oortView) previousNearView.current = {view,craft:selectedCraft}
    if (!outerView) previousInnerTarget.current = selectedId && !isOuterBody(selectedId) ? selectedId : null
    cameraAction('outer')
  }
  function enterOort() {
    if (!outerView && !oortView) previousNearView.current = {view,craft:selectedCraft}
    cameraAction('oort')
  }
  function restoreNearView() {
    const saved = previousNearView.current.view
    if(saved.kind==='earth-orbit'){if(previousNearView.current.craft)selectOrbiter(previousNearView.current.craft);else orbitOverview();return}
    if (saved.kind === 'body') selectBody(saved.center)
    else if (saved.kind === 'system') enterSystem(saved.center)
    else cameraAction('reset')
  }
  function returnInner() {
    restoreNearView()
  }
  function toggleKuiper(value: boolean) {
    if (value) enterOuter()
    else { setLayers(current => ({ ...current, kuiper: false })); returnInner() }
  }
  function returnToParent() {
    if(mission){exitMission();return}
    if(earthOrbitView&&selectedCraft){orbitOverview();return}
    const parent = parentView(view)
    if (oortView) { cameraAction('outer'); return }
    if (view.kind === 'outer') { returnInner(); return }
    if (parent.kind === 'outer') { cameraAction('outer'); return }
    if (parent.kind === 'system' && isSatelliteSystem(parent.center)) enterSystem(parent.center)
    else if (parent.kind === 'body') selectBody(parent.center)
    else cameraAction('reset')
  }
  const activeSystem = earthOrbitView ? 'earth' : view.kind === 'system' && isSatelliteSystem(view.center) ? view.center : view.kind === 'body' ? satelliteParent(view.center) : null
  const moonsVisible = !earthOrbitView && (layers.moons || activeSystem !== null)
  const outerView = view.kind === 'outer' || view.kind === 'body' && isOuterBody(view.center)
  const outerVisible = layers.kuiper && outerView
  const visibleIds = oortView || mission ? [] : visibleBodyIds(activeSystem, moonsVisible, layers.regions, outerVisible, showComet)
  function toggleMoons(value: boolean) {
    setLayers(current => ({ ...current, moons: value }))
    if (!value && activeSystem) selectBody(activeSystem)
  }
  function toggleBelt(value: boolean) {
    setLayers(current => ({ ...current, regions: value }))
    if (!value && selectedId && smallBodyIds.some(id => id === selectedId)) cameraAction('reset')
  }
  const resetButton = useRef<HTMLButtonElement | null>(null)
  function clearSelection() { cameraAction('reset'); resetButton.current?.focus() }
  const [paused, setPaused] = useState(false)
  useEffect(() => { if (reducedMotion) setPaused(true) }, [reducedMotion])
  const [speed, setSpeed] = useState<MotionSpeed>(1)
  const [visible, setVisible] = useState(() => !document.hidden)
  useEffect(() => {
    const update = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])
  function jumpComet(apsis: 'perihelion' | 'aphelion') {
    setPaused(true)
    setTimeRequest(current => ({ id: (current?.id ?? 0) + 1, seconds: apsisTime(halleyDisplayOrbit, apsis) }))
    selectBody('halley')
  }
  function orbitOverview() {
    setSelectedId(null);setSelectedCraft(null);setView({kind:'earth-orbit'});setLayers(current=>({...current,kuiper:false}))
    setCameraCommand(c=>({id:c.id+1,action:'track',objectName:'earth',radius:2.7}))
  }
  function selectOrbiter(id:OrbiterId) {
    if(mission){setMission(null);setMissionRunning(false)}
    setShowOrbiters(true);setSelectedId(null);setSelectedCraft(id);setView({kind:'earth-orbit'});setLayers(current=>({...current,kuiper:false}))
    setCameraCommand(c=>({id:c.id+1,action:'track',objectName:id,radius:0.5}))
  }
  function enterMission(id:MissionId) {
    if(!mission)topicReturn.current={view,selected:selectedId,craft:selectedCraft,pose:cameraPose.current}
    setMission(id);setView({kind:'mission'});setSelectedId(null);setSelectedCraft(null)
    setMissionProgress(0);setMissionSeek(c=>({id:c.id+1,progress:0}));setMissionRunning(false);setMissionSpeed(1)
    setCameraCommand(c=>({id:c.id+1,action:'track',objectName:'mission-origin',radius:missionFraming(id).radius}))
  }
  function exitMission() {
    const saved=topicReturn.current
    setMission(null);setMissionRunning(false)
    if(saved){setView(saved.view);setSelectedId(saved.selected);setSelectedCraft(saved.craft)
      if(saved.pose)setCameraCommand(c=>({id:c.id+1,action:'restore',snapshot:saved.pose!}))
      else cameraAction('reset')
    }else cameraAction('reset')
  }
  function seekMission(progress:number) {
    setMissionRunning(false);setMissionProgress(progress);setMissionSeek(c=>({id:c.id+1,progress}))
    setCameraCommand(c=>({id:c.id+1,action:'track',objectName:'mission-probe',radius:1.8}))
  }
  useEffect(()=>{if(reducedMotion)setMissionRunning(false)},[reducedMotion])
  const running = !paused && visible && !mission
  const topicRunning=!!mission&&missionRunning&&visible&&!reducedMotion
  function home() {setMission(null);setMissionRunning(false);cameraAction('reset')}
  const layerOptions:LayerOption[]=[{id:'labels',label:exploration.labels,checked:layers.labels,onChange:value=>setLayers(c=>({...c,labels:value}))}]
  if(mission)layerOptions.push({id:'route',label:space.route,checked:showRoute,onChange:setShowRoute},{id:'simple',label:space.simple,checked:simpleCraft,onChange:setSimpleCraft})
  else if(earthOrbitView)layerOptions.push({id:'craft',label:space.showOrbiters,checked:showOrbiters,onChange:v=>{setShowOrbiters(v);if(!v&&selectedCraft)orbitOverview()}},{id:'craft-orbits',label:space.orbits,checked:orbiterOrbits,onChange:setOrbiterOrbits},{id:'simple',label:space.simple,checked:simpleCraft,onChange:setSimpleCraft})
  else if(!oortView)layerOptions.push(
    {id:'orbits',label:exploration.orbits,checked:layers.orbits,onChange:value=>setLayers(c=>({...c,orbits:value}))},
    {id:'moons',label:exploration.moons,checked:moonsVisible,onChange:toggleMoons},
    {id:'regions',label:exploration.regions,checked:layers.regions,onChange:toggleBelt},
    {id:'kuiper',label:exploration.kuiper,checked:outerVisible,onChange:toggleKuiper},
    {id:'comet',label:comet.show,checked:showComet,onChange:v=>{setShowComet(v);if(!v&&selectedId==='halley')cameraAction('reset')}},
    {id:'tails',label:comet.effects,checked:cometEffects,onChange:setCometEffects})
  const scaleText=mission?ui.missionScale:oortView?oort.context:earthOrbitView?space.orbitScale:outerView?exploration.outerScale:activeSystem?ui.systemScale:ui.planetScale
  const [ready, setReady] = useState(false)
  const renderer = useRef<WebGLRenderer | null>(null)
  const debugOutput = useRef<HTMLOutputElement | null>(null)
  const cameraDebugOutput = useRef<HTMLOutputElement | null>(null)
  const debug = import.meta.env.DEV && new URLSearchParams(location.search).get('debugScene') === '1'
  // Stable callbacks keep language changes from re-running GPU lifecycle setup.
  const readyCallback = useRef(() => setReady(true)).current
  const navigationStarted=useRef(false)
  useEffect(()=>{
    if(!navigationStarted.current){navigationStarted.current=true;return}
    const active=document.activeElement
    if(active===document.body||active instanceof HTMLButtonElement&&active.disabled)document.querySelector<HTMLButtonElement>('.overview-entry')?.focus({preventScroll:true})
  },[view.kind,selectedId,selectedCraft,mission])
  return (
    <div className="scene-composition" data-view={view.kind} data-scale={oortView ? 'logarithmic-au' : 'schematic'} data-motion={running ? 'running' : 'paused'} data-selected-craft={selectedCraft??''} data-speed={speed} data-camera-mode={cameraMode}><div className="scene-host" data-scene-ready={ready} data-selected-body={selectedId ?? ''}
      onPointerDownCapture={event => { if (event.target instanceof HTMLCanvasElement) selectionGesture.current.down(event.pointerId, event.clientX, event.clientY, event.button) }}
      onPointerMoveCapture={event => selectionGesture.current.move(event.pointerId, event.clientX, event.clientY)}
      onPointerUpCapture={event => selectionGesture.current.up(event.pointerId, event.clientX, event.clientY)}
      onPointerCancelCapture={event => selectionGesture.current.cancel(event.pointerId)}>
      <Canvas
        frameloop={running || topicRunning || cameraBusy ? 'always' : 'demand'} dpr={[1, qualitySettings[quality].maxDpr]}
        camera={{ position: [0, 100, 60], fov: sceneConfig.camera.fov, near: sceneConfig.camera.near, far: sceneConfig.camera.far }}
        gl={{ antialias: true, alpha: false, powerPreference: 'default' }}
        fallback={fallback}
        onCreated={({ gl }) => { renderer.current = gl }}
        aria-hidden="true"
      >
        <color attach="background" args={[sceneConfig.background]} />
        <ambientLight intensity={sceneConfig.light.ambient} />
        <pointLight name="sun-position-light" position={[0, 0, 0]} intensity={sceneConfig.light.sunIntensity} decay={sceneConfig.light.decay} />
        {debug && <RendererReport sampleKey={`${view.kind}:${quality}:${selectedId??''}:${mission??''}`}/>}
        <OverviewCamera poseRef={cameraPose} reducedMotion={reducedMotion} command={cameraCommand} onModeChange={setCameraMode} debugOutput={debug ? cameraDebugOutput : undefined} />
        {!oortView && <BackgroundStars quality={quality} />}
        {oortView && <OortCloud quality={quality} />}
        <group visible={!oortView && !mission}>
        <SolarSystem reducedMotion={reducedMotion} sharedTime={mainTime} showComet={showComet} cometEffects={cometEffects} timeRequest={timeRequest} timeOutput={timeOutput} showOuter={outerVisible} showBelt={layers.regions} activeSystem={activeSystem} moonsVisible={moonsVisible} showOrbits={layers.orbits} quality={quality} solarEffects={solarEffects} solarGlow={solarGlow} saturnRings={saturnRings} earthEffects={earthEffects} texturesEnabled={texturesEnabled} onTextureStatus={onTextureStatus} running={running} speed={speed} debugOutput={debug ? debugOutput : undefined} selectedId={selectedId} onSelect={oortView || mission ? () => {} : selectBody} selectionGesture={selectionGesture} />
        </group>
        {earthOrbitView && showOrbiters && <EarthOrbiters time={mainTime} showOrbits={orbiterOrbits} simple={simpleCraft||quality==='eco'} selected={selectedCraft} onSelect={selectOrbiter} gesture={selectionGesture} labels={craftLabels} showLabels={layers.labels}/>}
        {mission && <MissionScene labels={missionLabels} key={mission} id={mission} running={topicRunning} speed={missionSpeed} seek={missionSeek} showRoute={showRoute} simple={simpleCraft||quality==='eco'} onProgress={setMissionProgress} onEnd={()=>setMissionRunning(false)} onNode={index=>seekMission(index/(missions[mission].nodes.length-1))} gesture={selectionGesture}/>}
        <OuterLabelProjector enabled={layers.labels && outerVisible && view.kind === 'outer'} elements={outerLabelElements} />
        <SatelliteLabelProjector center={activeSystem} enabled={layers.labels && view.kind === 'system'} elements={labelElements} quality={quality} />
        {debug && !oortView && !mission && <mesh position={[0, 7, 0]}><boxGeometry args={[4, 4, 4]} /><meshStandardMaterial color="#c7b08a" /></mesh>}
        <SceneLifecycle onReady={readyCallback} onFailure={onFailure} />
      </Canvas>
      <div className="satellite-labels" hidden={!layers.labels || !outerVisible || view.kind !== 'outer'}>{outerBodyIds.map(id => <button key={id} type="button" style={{ visibility: 'hidden' }} ref={node => { if (node) outerLabelElements.current[id] = node; else delete outerLabelElements.current[id] }} onClick={() => selectBody(id)}>{t.bodies[id].name}</button>)}</div>
      <div className="satellite-labels" hidden={!layers.labels || view.kind !== 'system'}>{moons.map(moon => <button key={moon.id} type="button" style={{ visibility: 'hidden' }} ref={node => { if (node) labelElements.current[moon.id] = node; else delete labelElements.current[moon.id] }} onClick={() => selectBody(moon.id)}>{t.bodies[moon.id].name}</button>)}</div>
      {mission && layers.labels && <div className="satellite-labels mission-labels">{missions[mission].nodes.map((node,i)=><button key={node.id} type="button" style={{visibility:'hidden'}} ref={element=>{if(element)missionLabels.current[node.id]=element;else delete missionLabels.current[node.id]}} onClick={()=>seekMission(i/(missions[mission].nodes.length-1))}>{space[node.id]}</button>)}</div>}
      {earthOrbitView && showOrbiters && layers.labels && <div className="satellite-labels">{orbiterIds.map(id=><button key={id} type="button" style={{visibility:'hidden'}} ref={node=>{if(node)craftLabels.current[id]=node;else delete craftLabels.current[id]}} onClick={()=>selectOrbiter(id)}>{space[id]}</button>)}</div>}
      {(mission||earthOrbitView) && <div className="spacecraft-overlay"><strong>{mission?space[mission]:selectedCraft?space[selectedCraft]:space.orbitTitle}</strong><span>{mission?space.mainTime:space.orbitScale}</span>{mission&&<button type="button" onClick={exitMission}>{space.exit}</button>}{earthOrbitView&&selectedCraft&&<button type="button" onClick={orbitOverview}>{space.backEarth}</button>}</div>}
      {oortView && <div className="oort-overlay"><strong>{oort.title}</strong><span>{oort.model}</span><span>☀ · 30–50 AU · 5,000–100,000 AU</span></div>}
      {ready && !mission && !earthOrbitView && <div className="selection-status"><p role="status">{selectedId ? <>{t.selectionLabel}<strong>{t.bodies[selectedId].name}</strong></> : oortView ? oort.context : t.selectionHint}</p>{selectedId && <div className="selection-actions">{isSatelliteSystem(selectedId) && !activeSystem && <button type="button" onClick={() => enterSystem(selectedId as SatelliteSystemId)}>{exploration.exploreSystem}</button>}{view.kind !== 'overview' && <button type="button" onClick={returnToParent}>{exploration.back}</button>}<a href="#body-details">{t.details.read}</a><button type="button" onClick={clearSelection}>{t.selectionClear}</button></div>}</div>}
            {!ready && <div className="scene-loading">{loading}</div>}
      {debug && <output ref={cameraDebugOutput} className="camera-debug" aria-label="DEV camera sample" />}
      {debug && <output ref={debugOutput} className="motion-debug" aria-label="DEV motion sample" />}
      {debug && <button className="scene-debug" onClick={() => renderer.current?.forceContextLoss()}>DEV: lose WebGL context</button>}
    </div>
    <ExplorerNavigation onHome={home} onBack={returnToParent} onRestore={restoreNearView} canBack={view.kind!=='overview'} canRestore={outerView||oortView} onSystem={enterSystem} onOrbit={orbitOverview} onMission={enterMission} onComet={()=>selectBody('halley')} onOuter={enterOuter} onOort={enterOort} mission={mission} outer={outerView} oort={oortView}/>
    <BodyCatalog onSelect={selectBody} onOrbiter={selectOrbiter} onMission={enterMission}/>
    <ExplorerLayers options={layerOptions}/>
    <DisplaySettings sceneVisible={!mission&&!oortView} outerVisible={outerVisible} beltVisible={layers.regions} activeSystem={activeSystem} moonsVisible={moonsVisible} reducedMotion={reducedMotion} systemReduced={systemReduced} setMotionPreference={setMotionPreference} quality={quality} setQuality={setQuality} texturesEnabled={texturesEnabled} earthEffects={earthEffects} saturnRings={saturnRings} solarEffects={solarEffects} solarGlow={solarGlow} textureStatuses={textureStatuses} setTexturesEnabled={setTexturesEnabled} setEarthEffects={setEarthEffects} setSaturnRings={setSaturnRings} setSolarEffects={setSolarEffects} setSolarGlow={setSolarGlow} />
    <p className="current-scale"><strong>{ui.scale}</strong> · {scaleText}</p>
    {mission && <MissionPanel id={mission} progress={missionProgress} running={topicRunning} setRunning={v=>{if(v&&reducedMotion)setMotionPreference(false);setMissionRunning(v)}} speed={missionSpeed} setSpeed={setMissionSpeed} onSeek={seekMission} onFollow={()=>setCameraCommand(c=>({id:c.id+1,action:'track',objectName:'mission-probe',radius:1.8}))} onOverview={()=>setCameraCommand(c=>({id:c.id+1,action:'track',objectName:'mission-origin',radius:missionFraming(mission).radius}))} onExit={exitMission} route={showRoute} setRoute={setShowRoute} simple={simpleCraft} setSimple={setSimpleCraft}/>}
    {!mission && <>
    {earthOrbitView && <OrbiterPanel selected={selectedCraft} onSelect={selectOrbiter} show={showOrbiters} setShow={v=>{setShowOrbiters(v);if(!v&&selectedCraft)orbitOverview()}} orbits={orbiterOrbits} setOrbits={setOrbiterOrbits} simple={simpleCraft} setSimple={setSimpleCraft} onOverview={orbitOverview}/>}
    <ul hidden={!layers.labels} className="body-legend" aria-label={t.bodyLegend}>{visibleIds.map(id => <li key={id}><button type="button" aria-pressed={selectedId === id} onClick={() => selectBody(id)}><span className="legend-dot" style={{ backgroundColor: bodyDisplay[id].color }} aria-hidden="true" />{t.bodies[id].name}</button></li>)}</ul>
    <div className="explorer-toolbar"><div className="keyboard-view" role="group" tabIndex={0} aria-label={t.keyboard.title} aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown" aria-disabled={cameraBusy} onKeyDown={event => { const actions: Record<string, OrbitAction | undefined> = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' }; const action = actions[event.key]; if (action && event.target === event.currentTarget) { event.preventDefault(); if (!cameraBusy) cameraAction(action) } }}><span>{t.keyboard.title}</span><p>{t.keyboard.hint}</p></div>{ready && <div className="camera-controls"><p><span role="status">{t.cameraModes[cameraMode]}</span><br />{cameraBusy ? t.cameraTransitionHint : t.cameraHint}</p><div><button type="button" disabled={cameraBusy} onClick={() => cameraAction('in')}>{t.cameraZoomIn}</button><button type="button" disabled={cameraBusy} onClick={() => cameraAction('out')}>{t.cameraZoomOut}</button><button ref={resetButton} type="button" onClick={() => cameraAction('reset')}>{selectedId || cameraMode !== 'overview' ? t.cameraOverview : t.cameraReset}</button></div></div>}{ready && <div className="motion-controls"><button type="button" onClick={() => { if (paused) { setMotionPreference(false); setPaused(false) } else setPaused(true) }}>{paused ? t.motionPlay : t.motionPause}</button><label>{t.motionSpeed}<select value={speed} onChange={event => { const value = Number(event.target.value); if (isMotionSpeed(value)) setSpeed(value) }}>{motionConfig.speeds.map(value => <option key={value} value={value}>{value}×</option>)}</select></label><span role="status">{running ? t.motionRunning : t.motionPaused}</span></div>}</div>
    {ready && <p className="scene-caption">{earthOrbitView ? space.orbiterNote : oortView ? oort.note : caption}</p>}
    {!activeSystem && !oortView && layers.regions && (view.kind==='overview'||selectedId==='ceres'||selectedId==='vesta') && <section className="belt-info" aria-labelledby="belt-title"><h3 id="belt-title">{exploration.beltTitle}</h3><p>{exploration.beltDescription}</p><p>{exploration.beltNote}</p><a href="https://science.nasa.gov/solar-system/asteroids/facts/" target="_blank" rel="noopener noreferrer">{exploration.beltSource}</a></section>}
    {outerView && <section className="belt-info outer-info" aria-labelledby="outer-title"><h3 id="outer-title">{exploration.outerTitle}</h3><p>{exploration.outerDescription}</p><p>{exploration.outerScale}</p><a href="https://science.nasa.gov/solar-system/kuiper-belt/facts/" target="_blank" rel="noopener noreferrer">NASA · Kuiper Belt</a></section>}
    {(selectedId==='halley'||showComet)&&!earthOrbitView&&!oortView&&<section className="belt-info comet-info" aria-labelledby="comet-title"><h3 id="comet-title">{comet.title}</h3><div className="comet-controls"><button type="button" onClick={() => jumpComet('perihelion')}>{comet.peri}</button><button type="button" onClick={() => jumpComet('aphelion')}>{comet.apo}</button></div><p>{comet.clock}: <output ref={timeOutput} aria-live="off">0.0</output></p><p>{comet.note}</p><details><summary>{t.details.sources}</summary><p>{comet.science}</p><a href="https://science.nasa.gov/solar-system/comets/1p-halley/" target="_blank" rel="noopener noreferrer">NASA · 1P/Halley</a></details></section>}
    {oortView && <section className="belt-info oort-info" aria-labelledby="oort-title"><h3 id="oort-title">{oort.title}</h3><p>{oort.description}</p><p>{oort.sample}</p><DistanceScale/><a href="https://science.nasa.gov/solar-system/oort-cloud/" target="_blank" rel="noopener noreferrer">{oort.source}</a></section>}

    </>}
    </div>
  )
}
