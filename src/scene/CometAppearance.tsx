import { useMemo, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, DoubleSide, Vector3, type Group, type ShaderMaterial, Quaternion, type MeshBasicMaterial } from 'three'
import { ellipseAt } from './kepler'
import { cometActivity, cometBudget, cometDistance, halleyDisplayOrbit } from './comet'
import type { Quality } from './quality'

/** Sun-away ion ribbon and a bent dust ribbon; all vertices are in the world-aligned local frame. */
function ribbon(segments: number, dust: boolean) {
  const positions: number[] = [], colors: number[] = [], uv: number[] = []
  for (let i=0;i<segments;i++) {
    for (const [u,side] of [[i/segments,-1],[(i+1)/segments,-1],[i/segments,1],[i/segments,1],[(i+1)/segments,-1],[(i+1)/segments,1]]) {
      const width=(dust ? 0.09+u*0.35 : 0.025+u*0.08)
      positions.push(dust ? u*u*1.6+width*side : width*side, dust ? u*3.2 : u*4.6, 0)
      const fade=(1-u)**1.4
      colors.push(fade,fade,fade); uv.push(side*0.5+0.5,u)
    }
  }
  return {positions:new Float32Array(positions),colors:new Float32Array(colors),uv:new Float32Array(uv)}
}
const softTail: MeshBasicMaterial['onBeforeCompile'] = shader => {
 shader.vertexShader = 'varying vec2 vTailUV;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvTailUV = uv;')
 shader.fragmentShader = 'varying vec2 vTailUV;\n'+shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\ndiffuseColor.a *= pow(max(0.0, 1.0-abs(vTailUV.x*2.0-1.0)), 2.0) * (1.0-smoothstep(0.7,1.0,vTailUV.y));')
}
export function CometAppearance({time,quality}: {time: RefObject<number>;quality:Quality}) {
  const ion=useRef<Group>(null), dust=useRef<Group>(null), coma=useRef<Group>(null)
  const ionMaterial=useRef<MeshBasicMaterial>(null), dustMaterial=useRef<MeshBasicMaterial>(null), comaMaterial=useRef<ShaderMaterial>(null)
  const buffers=useMemo(()=>[ribbon(cometBudget[quality],false),ribbon(cometBudget[quality],true)],[quality])
  const v=useMemo(()=>({away:new Vector3(),tangent:new Vector3(),next:new Vector3(),axis:new Vector3(0,1,0),normal:new Vector3(),position:new Vector3(),inverse:new Quaternion()}),[])
  useFrame(()=>{
    const p=ellipseAt(halleyDisplayOrbit,time.current), next=ellipseAt(halleyDisplayOrbit,time.current+0.01)
    v.away.set(...p).normalize();v.next.set(...next);v.tangent.copy(v.next).sub(v.position.set(...p)).normalize()
    const activity=cometActivity(cometDistance(time.current))
    for(const group of [ion.current,dust.current]) if(group) {group.visible=activity>0.001;group.quaternion.setFromUnitVectors(v.axis,v.away);group.scale.setScalar(0.3+0.7*activity)}
    // Rotate the dust ribbon around the radial axis to bend against the orbital tangent.
    if(dust.current) {
      v.normal.copy(v.tangent).addScaledVector(v.away,-v.tangent.dot(v.away)).negate().applyQuaternion(v.inverse.copy(dust.current.quaternion).invert())
      dust.current.rotateY(Math.atan2(-v.normal.z,v.normal.x))
    }
    if(coma.current) {coma.current.visible=activity>0.001;coma.current.scale.setScalar(0.4+activity*0.45)}
    if(ionMaterial.current) ionMaterial.current.opacity=activity*0.75
    if(dustMaterial.current) dustMaterial.current.opacity=activity*0.48
    if(comaMaterial.current) comaMaterial.current.uniforms.opacity.value=activity*0.32
  },-1)
  return <group name="comet-effects" raycast={()=>{}}>
    <group ref={coma} name="comet-coma"><mesh raycast={()=>{}}><sphereGeometry args={[1,16,12]}/><shaderMaterial ref={comaMaterial} uniforms={{opacity:{value:0}}} vertexShader="varying vec3 n; varying vec3 p; void main(){n=normalize(normalMatrix*normal);vec4 v=modelViewMatrix*vec4(position,1.0);p=v.xyz;gl_Position=projectionMatrix*v;}" fragmentShader="uniform float opacity; varying vec3 n; varying vec3 p; void main(){float a=pow(abs(dot(normalize(n),normalize(p))),3.0)*opacity;gl_FragColor=vec4(0.55,0.85,0.82,a);}" transparent depthWrite={false} blending={AdditiveBlending}/></mesh></group>
    {buffers.map((buffer,i)=><group key={i} ref={i===0?ion:dust} name={i===0?'comet-ion-tail':'comet-dust-tail'}><mesh raycast={()=>{}}><bufferGeometry><bufferAttribute attach="attributes-position" args={[buffer.positions,3]}/><bufferAttribute attach="attributes-color" args={[buffer.colors,3]}/><bufferAttribute attach="attributes-uv" args={[buffer.uv,2]}/></bufferGeometry><meshBasicMaterial ref={i===0?ionMaterial:dustMaterial} color={i===0?'#6bbcff':'#f3cf90'} onBeforeCompile={softTail} transparent vertexColors side={DoubleSide} depthWrite={false} blending={AdditiveBlending}/></mesh></group>)}
  </group>
}
