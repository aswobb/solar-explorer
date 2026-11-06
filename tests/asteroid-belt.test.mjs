import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createBeltParticles, asteroidBeltConfig, beltRotation } from '../src/scene/asteroidField.ts'
import { bodyDisplay, bodyVisualRadius } from '../src/scene/displayConfig.ts'
import { smallBodies } from '../src/data/bodies.ts'
import { visibleBodyIds } from '../src/scene/satelliteSystems.ts'
import { qualitySettings } from '../src/scene/quality.ts'
import { parentView } from '../src/scene/exploration.ts'
test('seeded belt has stable prefixes, thickness, size variation and clear planet bands', () => {
  const particles=createBeltParticles(6000)
  assert.deepEqual(createBeltParticles(300),particles.slice(0,300))
  assert.notDeepEqual(createBeltParticles(3,2),particles.slice(0,3))
  assert.ok(particles.some(p=>p.y>0.1) && particles.some(p=>p.y<-.1))
  assert.ok(particles.some(p=>p.scale>.07) && particles.some(p=>p.scale<.02))
  for(const particle of particles) {
    assert.ok(particle.radius>=asteroidBeltConfig.innerRadius && particle.radius<=asteroidBeltConfig.outerRadius)
    assert.ok(Math.abs(particle.y)<=asteroidBeltConfig.halfThickness)
    assert.ok(Math.abs(Math.hypot(particle.x,particle.z)-particle.radius)<1e-10)
    assert.ok(particle.scale<=asteroidBeltConfig.maxRockRadius)
  }
  assert.ok(asteroidBeltConfig.innerRadius-asteroidBeltConfig.maxRockRadius>bodyDisplay.mars.orbitRadius+bodyVisualRadius('mars'))
  assert.ok(asteroidBeltConfig.outerRadius+asteroidBeltConfig.maxRockRadius<bodyDisplay.jupiter.orbitRadius-bodyVisualRadius('jupiter'))
  assert.ok(qualitySettings.eco.regionInstances<qualitySettings.standard.regionInstances)
  assert.ok(qualitySettings.eco.regionPoints<qualitySettings.standard.regionPoints)
  for(const args of [[-1],[6001],[1.5],[1,-1],[1,NaN]])assert.throws(()=>createBeltParticles(...args),RangeError)
})
test('Ceres classification and converted values match the recorded JPL snapshot', () => {
  const snapshots=JSON.parse(readFileSync(new URL('../docs/data/small-bodies-snapshot.json',import.meta.url),'utf8'))
  assert.deepEqual(smallBodies.map(body=>[body.id,body.kind]),[['ceres','dwarf-planet'],['vesta','asteroid']])
  for(const body of smallBodies) {
    const snapshot=snapshots.find(item=>item.id===body.id).response
    const physical=Object.fromEntries(snapshot.phys_par.map(item=>[item.name,Number(item.value)]))
    const orbit=Object.fromEntries(snapshot.orbit.elements.map(item=>[item.name,Number(item.value)]))
    assert.equal(body.meanRadius.value,physical.diameter/2)
    assert.equal(body.siderealRotation.value,physical.rot_per)
    assert.equal(body.orbit.semiMajorAxis.value,orbit.a*149597870.7)
    assert.equal(body.orbit.siderealPeriod.value,orbit.per)
    assert.deepEqual(parentView({kind:'body',center:body.id}),{kind:'overview'})
    assert.ok(bodyDisplay[body.id].orbitRadius>asteroidBeltConfig.innerRadius)
    assert.ok(bodyDisplay[body.id].orbitRadius<asteroidBeltConfig.outerRadius)
  }
})
test('belt layer owns representative visibility and does not leak into satellite systems', () => {
  assert.equal(visibleBodyIds(null,false,true).length,11)
  assert.equal(visibleBodyIds(null,true,true).length,23)
  assert.ok(!visibleBodyIds(null,true,false).includes('ceres'))
  assert.ok(!visibleBodyIds('jupiter',true,true).includes('vesta'))
  assert.ok(beltRotation(10)>beltRotation(1))
  assert.equal(beltRotation(10),beltRotation(10))
  assert.throws(()=>beltRotation(-1),RangeError)
})
