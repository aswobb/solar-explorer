import { useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import { createOrbitPositions } from './geometry'
import { createOortPositions, createFarDisk, farRadius, oortBudgets, oortConfig } from './oortField'
import type { Quality } from './quality'
import type { PointsMaterial } from 'three'
const softPoint: PointsMaterial['onBeforeCompile'] = shader => {
 shader.fragmentShader=shader.fragmentShader.replace('#include <clipping_planes_fragment>','#include <clipping_planes_fragment>\nfloat r=length(gl_PointCoord-vec2(0.5));if(r>0.5) discard;diffuseColor.a *= 1.0-smoothstep(0.15,0.5,r);')
}
function Guide({radius,rotation=[0,0,0],color='#526d8c'}:{radius:number;rotation?:[number,number,number];color?:string}) {
 const points=useMemo(()=>createOrbitPositions(radius,192),[radius])
 return <lineLoop rotation={rotation} raycast={()=>{}}><bufferGeometry><bufferAttribute attach="attributes-position" args={[points,3]}/></bufferGeometry><lineBasicMaterial color={color} transparent opacity={0.2} depthWrite={false}/></lineLoop>
}
/** Dedicated origin and bounded units: no physical AU values ever enter the camera coordinate system. */
export function OortCloud({quality}:{quality:Quality}) {
 const compact=useThree(state=>state.size.width<600)
 const budget=compact?'eco':quality
 const cloud=useMemo(()=>createOortPositions(oortBudgets[budget]),[budget])
 const disk=useMemo(()=>createFarDisk(budget==='eco'?300:1200),[budget])
 return <group name="oort-far-scene">
  <points name="oort-cloud" raycast={()=>{}}><bufferGeometry><bufferAttribute attach="attributes-position" args={[cloud,3]}/></bufferGeometry><pointsMaterial onBeforeCompile={softPoint} color="#adc9ed" size={budget==='eco'?0.65:0.48} transparent opacity={0.75} depthWrite={false} toneMapped={false}/></points>
  <points name="far-kuiper-disk" raycast={()=>{}}><bufferGeometry><bufferAttribute attach="attributes-position" args={[disk,3]}/></bufferGeometry><pointsMaterial onBeforeCompile={softPoint} color="#78dbd1" size={0.38} transparent opacity={0.8} depthWrite={false} toneMapped={false}/></points>
  <mesh name="far-sun-marker" raycast={()=>{}}><sphereGeometry args={[0.65,16,12]}/><meshBasicMaterial color="#ffd28d" toneMapped={false}/></mesh>
  <Guide radius={farRadius(30)} color="#7bdad1"/><Guide radius={farRadius(50)} color="#7bdad1"/>
  <Guide radius={farRadius(5000)}/><Guide radius={oortConfig.displayRadius}/>
  <Guide radius={oortConfig.displayRadius} rotation={[Math.PI/2,0,0]}/><Guide radius={oortConfig.displayRadius} rotation={[0,0,Math.PI/2]}/>
 </group>
}
