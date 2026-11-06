import {orbiters,type OrbiterId,missions,type MissionId} from '../data/spacecraft.ts'
import {inclinedOrbitPosition} from './geometry.ts'
export function orbiterPosition(id:OrbiterId,seconds:number):[number,number,number] {
 if(!Number.isFinite(seconds)||seconds<0)throw new RangeError('Invalid orbiter time')
 const o=orbiters[id]
 return inclinedOrbitPosition(o.radius,o.phase-seconds/o.displaySeconds*Math.PI*2,o.inclinationDeg)
}
export function missionDuration(id:MissionId){return (missions[id].nodes.length-1)*12}
export function missionPosition(id:MissionId,progress:number):[number,number,number] {
 if(!Number.isFinite(progress)||progress<0||progress>1)throw new RangeError('Invalid mission progress')
 const nodes=missions[id].nodes,scaled=progress*(nodes.length-1),i=Math.min(nodes.length-2,Math.floor(scaled)),t=scaled-i
 const a=nodes[Math.max(0,i-1)].position,b=nodes[i].position,c=nodes[i+1].position,d=nodes[Math.min(nodes.length-1,i+2)].position
 return [0,1,2].map(k=>0.5*((2*b[k])+(-a[k]+c[k])*t+(2*a[k]-5*b[k]+4*c[k]-d[k])*t*t+(-a[k]+3*b[k]-3*c[k]+d[k])*t*t*t)) as [number,number,number]
}
export function missionDate(id:MissionId,progress:number):string {
 if(!Number.isFinite(progress)||progress<0||progress>1)throw new RangeError('Invalid mission progress')
 const nodes=missions[id].nodes,s=progress*(nodes.length-1),i=Math.min(nodes.length-2,Math.floor(s)),t=s-i
 const a=Date.parse(nodes[i].date+'T00:00:00Z'),b=Date.parse(nodes[i+1].date+'T00:00:00Z')
 return new Date(a+(b-a)*t).toISOString().slice(0,10)
}
/** Segment/sphere test for native labels, including observer inside the Earth. */
export function sphereOccludes(camera:readonly number[],target:readonly number[],center:readonly number[],radius:number) {
 const ray=target.map((v,i)=>v-camera[i]),toCenter=center.map((v,i)=>v-camera[i]),lengthSq=ray.reduce((s,v)=>s+v*v,0)
 if(lengthSq===0)return false
 const along=toCenter.reduce((s,v,i)=>s+v*ray[i],0)/lengthSq
 if(along<=0||along>=1)return false
 return toCenter.reduce((s,v,i)=>s+(v-along*ray[i])**2,0)<radius*radius
}

/** Frame the route around its own bounds, keeping the Sun and all curved sections visible. */
export function missionFraming(id:MissionId):{center:[number,number,number];radius:number} {
 const points=Array.from({length:257},(_,i)=>missionPosition(id,i/256));points.push([0,0,0])
 const center=[0,1,2].map(k=>(Math.min(...points.map(p=>p[k]))+Math.max(...points.map(p=>p[k])))/2) as [number,number,number]
 const radius=Math.max(...points.map(p=>Math.hypot(...p.map((v,k)=>v-center[k]))))+1
 return {center,radius}
}
