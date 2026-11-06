import test from 'node:test'
import assert from 'node:assert/strict'
import { PerspectiveCamera, Vector3, Frustum, Matrix4 } from 'three'
import { moons } from '../src/data/bodies.ts'
import { moonIds } from '../src/data/types.ts'
import { satelliteParent, satelliteSystemIds, systemVisualRadius, visibleBodyIds } from '../src/scene/satelliteSystems.ts'
import { bodyDisplay, bodyVisualRadius, orbitalEnvelope, overviewRadius } from '../src/scene/displayConfig.ts'
import { focusDistance } from '../src/scene/focus.ts'
import { parentView } from '../src/scene/exploration.ts'
import { anglesAt } from '../src/scene/motion.ts'
import { lockedMoonSpin } from '../src/scene/moonMotion.ts'
import { orbitPosition } from '../src/scene/geometry.ts'
import { layoutLabels } from '../src/scene/labelLayout.ts'
test('twelve satellites have correct parent systems, periods and synchronous spin', () => {
  assert.deepEqual(moons.map(moon => moon.id), moonIds)
  assert.deepEqual(moons.map(moon => moon.orbit.center), ['earth','jupiter','jupiter','jupiter','jupiter','saturn','saturn','saturn','saturn','saturn','saturn','saturn'])
  assert.equal(satelliteParent('jupiter'), null)
  for (const moon of moons) {
    assert.equal(satelliteParent(moon.id), moon.orbit.center)
    if (moon.id !== 'moon') assert.equal(moon.siderealRotation.value, moon.orbit.siderealPeriod.value * 24)
    assert.equal(moon.rotationModel.kind, 'tidally-locked')
    assert.deepEqual(parentView({kind:'body',center:moon.id}), {kind:'system',center:moon.orbit.center})
    for (const t of [0, 2, 37, 120]) {
      const angle = anglesAt(t, bodyDisplay[moon.id].initialPhase, moon.orbit.siderealPeriod.value, moon.siderealRotation.value).orbit
      const facing = new Vector3(1,0,0).applyAxisAngle(new Vector3(0,1,0), lockedMoonSpin(angle))
      const towardParent = new Vector3(...orbitPosition(bodyDisplay[moon.id].orbitRadius,angle)).negate().normalize()
      assert.ok(facing.dot(towardParent) > 1-1e-10)
    }
  }
})
test('system filtering excludes unrelated moons and clears hidden targets through parent navigation', () => {
  assert.equal(visibleBodyIds(null,false).length,9)
  assert.equal(visibleBodyIds(null,true).length,21)
  assert.deepEqual(visibleBodyIds('jupiter',true),['jupiter','io','europa','ganymede','callisto'])
  assert.deepEqual(visibleBodyIds('saturn',true),['saturn','mimas','enceladus','tethys','dione','rhea','titan','iapetus'])
  assert.deepEqual(visibleBodyIds('jupiter',false),['jupiter'])
  for (const center of satelliteSystemIds) assert.deepEqual(parentView({kind:'system',center}),{kind:'body',center})
})
test('all system extents include satellite tracks, parent spheres and Saturn rings in portrait and landscape', () => {
  for (const center of satelliteSystemIds) {
    const radius = systemVisualRadius(center)
    assert.ok(radius >= bodyVisualRadius(center))
    for (const aspect of [0.45,0.7,1.5,2]) {
      const camera = new PerspectiveCamera(45,aspect,0.01,1000)
      const distance=focusDistance(radius,45,aspect)
      camera.position.set(0,distance/Math.sqrt(2),distance/Math.sqrt(2))
      camera.lookAt(0,0,0);camera.updateMatrixWorld(true)
      const frustum=new Frustum().setFromProjectionMatrix(new Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse))
      for (const moon of moons.filter(moon=>moon.orbit.center===center)) {
        assert.ok(bodyDisplay[moon.id].orbitRadius-bodyDisplay[moon.id].radius>bodyVisualRadius(center))
        for(let angle=0;angle<6.3;angle+=0.15) {
          const pos=new Vector3(...orbitPosition(bodyDisplay[moon.id].orbitRadius,angle))
          for(const plane of frustum.planes) assert.ok(plane.distanceToPoint(pos)>bodyDisplay[moon.id].radius)
        }
      }
    }
  }
})
test('label layout hides overlapping, clipped and over-budget labels', () => {
  const candidates=[{id:'io',x:10,y:10,width:80,height:24},{id:'europa',x:40,y:10,width:80,height:24},{id:'ganymede',x:140,y:10,width:90,height:24},{id:'callisto',x:240,y:10,width:90,height:24}]
  assert.deepEqual(layoutLabels(candidates,300,100,10).map(label=>label.id),['io','ganymede'])
  assert.deepEqual(layoutLabels(candidates,300,100,1).map(label=>label.id),['io'])
})

test('Saturn includes seven ordered moons with separate display bands and a complete overview envelope', () => {
  const saturnMoons = moons.filter(moon=>moon.orbit.center==='saturn')
  assert.deepEqual(saturnMoons.map(moon=>moon.id), ['mimas','enceladus','tethys','dione','rhea','titan','iapetus'])
  let previousOuter=bodyVisualRadius('saturn')
  let previousScienceDistance=0
  for(const moon of saturnMoons) {
    const display=bodyDisplay[moon.id]
    assert.ok(display.orbitRadius-display.radius>previousOuter)
    assert.ok(moon.orbit.semiMajorAxis.value>previousScienceDistance)
    assert.equal(orbitalEnvelope(moon.id), bodyDisplay.saturn.orbitRadius+display.orbitRadius)
    assert.ok(orbitalEnvelope(moon.id)+bodyVisualRadius(moon.id)<=overviewRadius)
    assert.ok(moon.meanRadius.value>0)
    previousOuter=display.orbitRadius+display.radius
    previousScienceDistance=moon.orbit.semiMajorAxis.value
  }
  assert.equal(saturnMoons[0].meanRadius.source,'jpl-satellite-physical')
  assert.equal(saturnMoons.at(-1).meanRadius.value,734.3)
})

test('satellite labels never cover another satellite or the parent planet', () => {
  const labels=[{id:'enceladus',x:100,y:100,width:90,height:24},{id:'rhea',x:230,y:100,width:60,height:24}]
  const obstacles=[{x:160,y:110,radius:8}]
  assert.deepEqual(layoutLabels(labels,400,300,10,obstacles).map(label=>label.id),['rhea'])
})
