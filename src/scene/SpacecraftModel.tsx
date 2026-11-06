import type {OrbiterId,MissionId} from '../data/spacecraft'
/** Original procedural geometry, created only when its topic is mounted. */
export function SpacecraftModel({id,simple=false}:{id:OrbiterId|MissionId;simple?:boolean}) {
 const satellite=id==='iss'||id==='hubble'
 return <group>
  <mesh rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[id==='hubble'?0.1:0.07,0.08,id==='iss'?0.5:0.32,simple?8:16]}/><meshBasicMaterial color={satellite?'#d5dce4':'#d8b56b'}/></mesh>
  {satellite ? <>{[-1,1].map(side=><group key={side} position={[side*0.23,0,0]}><mesh><boxGeometry args={[0.28,0.018,id==='iss'?0.36:0.2]}/><meshBasicMaterial color={id==='iss'?'#b5894e':'#3c6397'}/></mesh>{!simple && [0,1,2,3].map(i=><mesh key={i} position={[-0.12+i*0.08,-0.012,0]}><boxGeometry args={[0.007,0.006,id==='iss'?0.36:0.2]}/><meshBasicMaterial color="#c6d2df"/></mesh>)}</group>)}</> : <><mesh rotation={[Math.PI/2,0,0]} position={[0,0.16,0]}><coneGeometry args={[0.28,0.12,simple?12:24,1,true]}/><meshBasicMaterial color="#e5e2d7" side={2}/></mesh><mesh position={[0.3,0,0]}><boxGeometry args={[0.45,0.025,0.025]}/><meshBasicMaterial color="#c1c6cc"/></mesh></>}
  {!simple && id==='iss' && [-0.16,0,0.16].map(z=><mesh key={z} position={[0,0,z]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[0.045,0.045,0.25,12]}/><meshBasicMaterial color="#dfe3e8"/></mesh>)}
 </group>
}
