import test from 'node:test'
import assert from 'node:assert/strict'
import {orbiterIds,orbiters,missionIds,missions} from '../src/data/spacecraft.ts'
import {orbiterPosition,missionDuration,missionPosition,missionDate,sphereOccludes,missionFraming} from '../src/scene/spacecraftMotion.ts'
import {SimulationClock} from '../src/scene/simulationClock.ts'
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} vs ${b}`)
test('orbiters remain outside Earth and preserve sourced equatorial inclination and period ratios',()=>{
 assert.equal(orbiters.iss.inclinationDeg,51.6);assert.equal(orbiters.hubble.inclinationDeg,28.5)
 near(orbiters.hubble.displaySeconds/orbiters.iss.displaySeconds,95/92)
 for(const id of orbiterIds){const o=orbiters[id];assert.equal(o.kind,'earth-satellite');assert.ok(o.radius-0.42>0.9)
  for(let i=0;i<72;i++){const p=orbiterPosition(id,i);near(Math.hypot(...p),o.radius);const normal=[0,Math.cos(o.inclinationDeg*Math.PI/180),-Math.sin(o.inclinationDeg*Math.PI/180)];near(p.reduce((s,v,k)=>s+v*normal[k],0),0)}
  orbiterPosition(id,0).forEach((v,i)=>near(v,orbiterPosition(id,o.displaySeconds)[i]))
 }
 assert.throws(()=>orbiterPosition('iss',-1),RangeError)
})
test('mission reference dates are chronological, endpoint exact, and all spatial segments are explicitly illustrative',()=>{
 for(const id of missionIds){const frame=missionFraming(id);for(let i=0;i<=100;i++)assert.ok(Math.hypot(...missionPosition(id,i/100).map((v,k)=>v-frame.center[k]))<frame.radius)
  const m=missions[id];assert.equal(m.routeKind,'artistic-interpolation');assert.equal(m.coordinateFrame,'heliocentric-schematic-not-J2000');assert.ok(m.source.startsWith('https://science.nasa.gov/'))
  for(let i=0;i<m.nodes.length;i++){const p=i/(m.nodes.length-1);assert.equal(m.nodes[i].positionKind,'illustrative');missionPosition(id,p).forEach((v,k)=>near(v,m.nodes[i].position[k]));assert.equal(missionDate(id,p),m.nodes[i].date);if(i)assert.ok(m.nodes[i].date>m.nodes[i-1].date)}
  let previous='';for(let i=0;i<=100;i++){const p=i/100;assert.ok(missionDate(id,p)>=previous);previous=missionDate(id,p);assert.ok(missionPosition(id,p).every(Number.isFinite));assert.ok(Math.hypot(...missionPosition(id,p))<50)}
 }
 assert.equal(missionDate('newhorizons',2/3),'2015-07-14');assert.equal(missionDate('voyager1',1),'2012-08-25')
 for(const p of [NaN,-1,2])assert.throws(()=>missionPosition('voyager1',p),RangeError)
})
test('independent topic clock seeking cannot change frozen main clock, and resume discards inactive delta',()=>{
 const main=new SimulationClock(),topic=new SimulationClock();main.setTime(42);topic.setTime(missionDuration('voyager1')/2)
 for(let i=0;i<20;i++){main.advance(0.1,5,false);topic.advance(0.1,2,true)}
 near(main.seconds,42);assert.ok(topic.seconds>24)
 topic.setTime(missionDuration('newhorizons'));near(main.seconds,42)
 near(main.advance(60,1,true),42);near(main.advance(0.1,1,true),42.1)
})
test('Earth hides a far-side craft label while front-side and limb-clear craft remain visible',()=>{
 assert.equal(sphereOccludes([0,0,4],[0,0,-2],[0,0,0],0.9),true)
 assert.equal(sphereOccludes([0,0,4],[0,0,2],[0,0,0],0.9),false)
 assert.equal(sphereOccludes([0,0,4],[2,0,-2],[0,0,0],0.9),false)
 assert.equal(sphereOccludes([0,0,4],[0,0,4],[0,0,0],0.9),false)
})
