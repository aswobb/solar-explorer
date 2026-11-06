import {useRef,useMemo,type RefObject} from 'react'
import {useFrame,useThree} from '@react-three/fiber'
import {Vector3,PerspectiveCamera,type Group} from 'three'
import {orbiterIds,orbiters,type OrbiterId} from '../data/spacecraft'
import {orbiterPosition,sphereOccludes} from './spacecraftMotion'
import {planets} from '../data/bodies'
import {displayTilt} from './motion'
import {bodyDisplay} from './displayConfig'
import {createOrbitPositions} from './geometry'
import {SpacecraftModel} from './SpacecraftModel'
import type {SelectionGesture} from './selection'
import {layoutLabels,type LabelCandidate} from './labelLayout'
export type OrbiterLabels=Partial<Record<OrbiterId,HTMLButtonElement>>
export function EarthOrbiters({time,showOrbits,simple,selected,onSelect,gesture,labels,showLabels}:{time:RefObject<number>;showOrbits:boolean;simple:boolean;selected:OrbiterId|null;onSelect:(id:OrbiterId)=>void;gesture:RefObject<SelectionGesture>;labels:RefObject<OrbiterLabels>;showLabels:boolean}) {
 const {scene,camera,size}=useThree(),root=useRef<Group>(null),objects=useRef<Partial<Record<OrbiterId,Group>>>({})
 const v=useMemo(()=>({center:new Vector3(),point:new Vector3(),projected:new Vector3()}),[])
 const paths=useMemo(()=>orbiterIds.map(id=>createOrbitPositions(orbiters[id].radius,128)),[])
 useFrame(()=>{
  const earth=scene.getObjectByName('earth');if(!earth||!root.current)return
  earth.getWorldPosition(v.center);root.current.position.copy(v.center)
  for(const id of orbiterIds) objects.current[id]?.position.set(...orbiterPosition(id,time.current))
 },-1.5)
 useFrame(()=>{
  for(const e of Object.values(labels.current))if(e)e.style.visibility='hidden'
  if(!showLabels||!(camera instanceof PerspectiveCamera))return
  const candidates:LabelCandidate[]=[]
  for(const id of orbiterIds){const e=labels.current[id],o=objects.current[id];if(!e||!o)continue
   o.getWorldPosition(v.point)
   if(sphereOccludes(camera.position.toArray(),v.point.toArray(),v.center.toArray(),bodyDisplay.earth.radius))continue
   v.projected.copy(v.point).project(camera);if(v.projected.z<-1||v.projected.z>1)continue
   candidates.push({id,x:(v.projected.x+1)*size.width/2+12,y:(1-v.projected.y)*size.height/2-12,width:e.offsetWidth,height:e.offsetHeight})
  }
  for(const label of layoutLabels(candidates,size.width,size.height,2)){const e=labels.current[label.id as OrbiterId];if(e){e.style.transform=`translate(${label.x}px, ${label.y}px)`;e.style.visibility='visible'}}
 })
 return <group ref={root} name="earth-orbiters" rotation={[0,0,displayTilt(planets.find(p=>p.id==='earth')!.orbit.obliquity.value)]}>
  {orbiterIds.map((id,i)=><group key={id}>
   {showOrbits&&<lineLoop rotation={[-orbiters[id].inclinationDeg*Math.PI/180,0,0]} raycast={()=>{}}><bufferGeometry><bufferAttribute attach="attributes-position" args={[paths[i],3]}/></bufferGeometry><lineBasicMaterial color={orbiters[id].color} transparent opacity={0.5}/></lineLoop>}
   <group ref={node=>{if(node)objects.current[id]=node;else delete objects.current[id]}} name={id} position={orbiterPosition(id,time.current)} onClick={e=>{e.stopPropagation();if(gesture.current.allows(e.delta,e.button))onSelect(id)}}>
    <SpacecraftModel id={id} simple={simple}/>
    {selected===id&&<mesh raycast={()=>{}}><sphereGeometry args={[0.42,24,16]}/><meshBasicMaterial color="#f5cf8b" wireframe transparent opacity={0.16} depthWrite={false}/></mesh>}
   </group>
  </group>)}
 </group>
}
