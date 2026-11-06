import type { Quality } from './quality.ts'
/** Estimated AU bounds and artistic scene bounds are deliberately separate. */
export const oortConfig = {
 estimatedInnerAU: [2000,5000] as const, estimatedOuterAU: [10000,100000] as const,
 displayedRangeAU: [5000,100000] as const, displayRadius: 80, seed: 6172026,
 sources: ['https://science.nasa.gov/solar-system/oort-cloud/','https://science.nasa.gov/solar-system/oort-cloud/facts/'],
} as const
export const oortBudgets: Record<Quality,number> = {standard:8000,eco:2000}
/** Logarithmic radial mapping, independent of all near-scene coordinates. */
export function farRadius(au: number): number {
 if(!Number.isFinite(au)||au<0||au>100000) throw new RangeError('Invalid far distance')
 return oortConfig.displayRadius*Math.log1p(au/50)/Math.log1p(100000/50)
}
export function farAU(radius: number): number {
 if(!Number.isFinite(radius)||radius<0||radius>oortConfig.displayRadius) throw new RangeError('Invalid far radius')
 return 50*Math.expm1(radius/oortConfig.displayRadius*Math.log1p(100000/50))
}
export function createOortPositions(count: number, seed: number = oortConfig.seed): Float32Array {
 if(!Number.isInteger(count)||count<0||count>8000||!Number.isInteger(seed)||seed<0||seed>0xffffffff) throw new RangeError('Invalid Oort allocation')
 let state=seed>>>0
 const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296}
 const points=new Float32Array(count*3)
 for(let i=0;i<count;i++) {
  // Uniform solid angle; radial density is an illustrative logarithmic distribution.
  const az=random()*Math.PI*2, y=random()*2-1
  const radius=farRadius(5000*Math.pow(20,random())),flat=Math.sqrt(1-y*y)*radius
  points.set([Math.cos(az)*flat,y*radius,Math.sin(az)*flat],i*3)
 }
 return points
}
export function createFarDisk(count: number): Float32Array {
 if(!Number.isInteger(count)||count<0||count>1200) throw new RangeError('Invalid disk allocation')
 let state=1102;const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296}
 const points=new Float32Array(count*3)
 for(let i=0;i<count;i++) {const angle=random()*Math.PI*2,r=farRadius(30+20*random());points.set([r*Math.cos(angle),(random()-0.5)*0.5,r*Math.sin(angle)],i*3)}
 return points
}
