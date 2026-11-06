import {useRef,useMemo,useEffect} from 'react'
import {useFrame,useThree} from '@react-three/fiber'
import {Vector3,type Group} from 'three'
import {layoutLabels,type LabelCandidate} from './labelLayout'
import {missions,type MissionId} from '../data/spacecraft'
import {missionDuration,missionPosition,missionFraming} from './spacecraftMotion'
import {SimulationClock} from './simulationClock'
import type {MotionSpeed} from './motion'
import type {SelectionGesture} from './selection'
import type {RefObject} from 'react'
import {SpacecraftModel} from './SpacecraftModel'
export type MissionLabels=Record<string,HTMLButtonElement>
export type MissionSeek={id:number;progress:number}
export function MissionScene({id,running,speed,seek,showRoute,simple,onProgress,onEnd,onNode,gesture,labels}:{id:MissionId;running:boolean;speed:MotionSpeed;seek:MissionSeek;showRoute:boolean;simple:boolean;onProgress:(p:number)=>void;onEnd:()=>void;onNode:(index:number)=>void;gesture:RefObject<SelectionGesture>;labels:RefObject<MissionLabels>}) {
 const clock=useRef(new SimulationClock()),applied=useRef(-1),throttle=useRef(0),probe=useRef<Group>(null)
 const {invalidate,camera,size}=useThree(),duration=missionDuration(id)
 const framing=useMemo(()=>missionFraming(id),[id])
 const projected=useMemo(()=>new Vector3(),[])
 const route=useMemo(()=>new Float32Array(Array.from({length:256},(_,i)=>[...missionPosition(id,i/256),...missionPosition(id,(i+1)/256)]).flat()),[id])
 useEffect(()=>{invalidate()},[seek,running,showRoute,simple,invalidate])
 useFrame((_,delta)=>{
  let publish=false
  if(applied.current!==seek.id){clock.current.setTime(seek.progress*duration);applied.current=seek.id;publish=true}
  const seconds=Math.min(duration,clock.current.advance(delta,speed,running)),progress=seconds/duration
  probe.current?.position.set(...missionPosition(id,progress))
  throttle.current+=delta
  if(publish||throttle.current>=0.1||progress===1){onProgress(progress);throttle.current=0}
  if(progress===1&&running)onEnd()
 },-1.5)
 useFrame(()=>{
  const candidates:LabelCandidate[]=[]
  for(const e of Object.values(labels.current))e.style.visibility='hidden'
  for(const node of missions[id].nodes){const element=labels.current[node.id];if(!element)continue
   projected.set(...node.position).project(camera);if(projected.z<-1||projected.z>1)continue
   candidates.push({id:node.id,x:(projected.x+1)*size.width/2+10,y:(1-projected.y)*size.height/2-12,width:element.offsetWidth,height:element.offsetHeight})
  }
  for(const p of layoutLabels(candidates,size.width,size.height,5)){const e=labels.current[p.id];e.style.transform=`translate(${p.x}px, ${p.y}px)`;e.style.visibility='visible'}
 })
 return <group name="mission-scene">
  <group name="mission-origin" position={framing.center}/>
  <mesh raycast={()=>{}}><sphereGeometry args={[0.8,24,16]}/><meshBasicMaterial color="#ffd18a"/></mesh>
  {showRoute&&<lineSegments name="mission-artistic-route" raycast={()=>{}}><bufferGeometry><bufferAttribute attach="attributes-position" args={[route,3]}/></bufferGeometry><lineBasicMaterial color="#e7b975" transparent opacity={0.7}/></lineSegments>}
  {missions[id].nodes.map((node,index)=><mesh key={node.id} name={`mission-node-${node.id}`} position={[...node.position]} onClick={e=>{e.stopPropagation();if(gesture.current.allows(e.delta,e.button))onNode(index)}}><sphereGeometry args={[index===0?0.35:node.id==='jupiter'?0.65:node.id==='saturn'?0.55:0.4,24,16]}/><meshBasicMaterial color={index===0?'#659bdb':node.id==='jupiter'?'#bb9d7b':'#9ec6da'}/></mesh>)}
  <group ref={probe} name="mission-probe" position={missionPosition(id,seek.progress)} scale={1.5}><SpacecraftModel id={id} simple={simple}/></group>
 </group>
}
