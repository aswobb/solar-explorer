import test from 'node:test'
import assert from 'node:assert/strict'
import { solveKepler, ellipseAt, ellipsePoint, ellipsePath, apsisTime } from '../src/scene/kepler.ts'
import { halleyDisplayOrbit as orbit, halleyScienceOrbit, cometActivity, cometDistance, cometBudget } from '../src/scene/comet.ts'
import { SimulationClock } from '../src/scene/simulationClock.ts'
import { halley } from '../src/data/bodies.ts'
import { filterCatalog } from '../src/data/catalog.ts'
import { visibleBodyIds } from '../src/scene/satelliteSystems.ts'
import { anglesAt } from '../src/scene/motion.ts'
import { inclinedOrbitPosition } from '../src/scene/geometry.ts'
const near=(a,b,tolerance=1e-9)=>assert.ok(Math.abs(a-b)<tolerance,`${a} != ${b}`)
const length=p=>Math.hypot(...p)
test('Kepler residual converges even near parabolic eccentricities and wraps negative phases',()=>{
 for(const e of [0,0.5,0.967936,0.999999]) for(const mean of [-100,-Math.PI,-0.001,0,0.001,1,Math.PI,100]) {
  const E=solveKepler(mean,e), m=((mean+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI
  near(E-e*Math.sin(E),m,2e-12)
 }
 for(const e of [-1,1,NaN]) assert.throws(()=>solveKepler(0,e),RangeError)
})
test('ellipse closes, matches apsidal distances, inclination and legacy circular convention',()=>{
 const peri=ellipseAt(orbit,apsisTime(orbit,'perihelion')),apo=ellipseAt(orbit,apsisTime(orbit,'aphelion'))
 near(length(peri),orbit.a*(1-orbit.e));near(length(apo),orbit.a*(1+orbit.e))
 ellipseAt(orbit,0).forEach((v,i)=>near(v,ellipseAt(orbit,orbit.period)[i]))
 const polar={...orbit,node:0,periapsis:0,inclination:Math.PI/2,e:0}
 near(ellipsePoint(polar,Math.PI/2)[1],-orbit.a)
 const circle={...orbit,e:0,node:0,periapsis:0,phase:-0.7,inclination:0.3}
 for(const seconds of [0,1,50]) {
  const expected=inclinedOrbitPosition(circle.a,0.7-seconds/circle.period*2*Math.PI,0.3*180/Math.PI)
  ellipseAt(circle,seconds).forEach((v,i)=>near(v,expected[i]))
 }
 assert.equal(ellipsePath(orbit,192).length,576)
 const reverse={...circle,direction:-1}
 ellipseAt(reverse,1).forEach((v,i)=>near(v,ellipseAt({...circle,phase:circle.phase-2*Math.PI/circle.period},0)[i]))
 // Kepler speed increases near perihelion rather than traversing at constant angle.
 const travel=t=>Math.hypot(...ellipseAt(orbit,t+0.01).map((v,i)=>v-ellipseAt(orbit,t)[i]))
 assert.ok(travel(0)>travel(orbit.period/2)*5)
})
test('scientific reference remains separate from artistic compression and effective radius',()=>{
 near(halleyScienceOrbit.e,halley.orbit.eccentricity.value)
 near(cometDistance(0),0.5748638313743413,1e-10)
 near(cometDistance(orbit.period/2),35.28240626576412,1e-9)
 assert.equal(halley.orbit.epochJD,2439875.5)
 assert.equal(halley.siderealRotation,null)
 assert.equal(halley.meanRadius.value,5.5)
 assert.equal(filterCatalog('comet','哈雷')[0].id,'halley')
 assert.ok(!visibleBodyIds(null,false,true,true).includes('halley'))
 assert.ok(visibleBodyIds(null,false,true,true,true).includes('halley'))
 assert.ok(!visibleBodyIds('earth',true,true,true,true).includes('halley'))
})
test('shared seek, pause, resume and speed update comet, other bodies and activity coherently',()=>{
 const clock=new SimulationClock();clock.setTime(apsisTime(orbit,'aphelion'))
 const seconds=clock.advance(0.2,5,false)
 near(seconds,orbit.period/2);near(cometActivity(cometDistance(seconds)),0)
 const earthAtApo=anglesAt(seconds,4.2,365.2,23.9)
 clock.setTime(apsisTime(orbit,'perihelion'))
 near(clock.advance(0.2,1,false),0);assert.ok(cometActivity(cometDistance(clock.seconds))>0.99)
 assert.notEqual(earthAtApo.orbit,anglesAt(clock.seconds,4.2,365.2,23.9).orbit)
 near(clock.advance(0.1,2,true),0);near(clock.advance(0.1,2,true),0.2)
 for(let d=0;d<=5;d+=0.05) assert.ok(cometActivity(d)>=cometActivity(d+0.05))
 assert.ok(cometBudget.eco<cometBudget.standard)
})
