import { test } from 'node:test'
import assert from 'node:assert/strict'
import { PerspectiveCamera } from 'three'
import { OrbitControls } from 'three-stdlib'
import { controlLimits, zoomDistance } from '../src/scene/cameraControl.ts'

test('button zoom is reversible away from bounds and clamps at both ends', () => {
  assert.equal(zoomDistance(100, 'in'), 80)
  assert.equal(zoomDistance(80, 'out'), 100)
  let near = 100, far = 100
  for(let i=0;i<100;i++) { near = zoomDistance(near,'in'); far = zoomDistance(far,'out') }
  assert.equal(near, controlLimits.minDistance)
  assert.equal(far, controlLimits.maxDistance)
  for(const value of [0,-1,NaN,Infinity]) assert.throws(()=>zoomDistance(value,'in'),RangeError)
})
test('installed OrbitControls enforces distance and polar constraints', () => {
  const camera = new PerspectiveCamera(45,1,0.1,1000)
  camera.position.set(0,50,70)
  const controls = new OrbitControls(camera)
  controls.enableDamping = false
  controls.minDistance = controlLimits.minDistance
  controls.maxDistance = controlLimits.maxDistance
  controls.minPolarAngle = controlLimits.minPolar
  controls.maxPolarAngle = controlLimits.maxPolar
  camera.position.set(0,0.001,0)
  controls.update()
  assert.ok(Math.abs(controls.getDistance() - controlLimits.minDistance)<1e-8)
  assert.ok(controls.getPolarAngle() >= controlLimits.minPolar - 1e-8)
  camera.position.set(0,-1000,0.001)
  controls.update()
  assert.ok(Math.abs(controls.getDistance() - controlLimits.maxDistance)<1e-8)
  assert.ok(controls.getPolarAngle() <= controlLimits.maxPolar + 1e-8)
})
