import { test } from 'node:test'
import assert from 'node:assert/strict'
import { PerspectiveCamera, Frustum, Matrix4, Vector3 } from 'three'
import { bodyDisplay, bodyVisualRadius, overviewRadius, outerOverviewRadius, sceneConfig } from '../src/scene/displayConfig.ts'
import { orbitPosition, createOrbitPositions, overviewDistance } from '../src/scene/geometry.ts'
import { bodyIds, planetIds, outerBodyIds } from '../src/data/types.ts'

test('display configuration covers all registered bodies with separate, nonintersecting radial bands', () => {
  assert.deepEqual(Object.keys(bodyDisplay), bodyIds)
  assert.equal(bodyDisplay.sun.orbitRadius, 0)
  for (const id of bodyIds) {
    const display = bodyDisplay[id]
    assert.ok(display.radius > 0 && Number.isFinite(display.radius))
    assert.ok(Number.isFinite(display.initialPhase))
    assert.match(display.color, /^#[0-9a-f]{6}$/i)
    assert.ok(display.orbitRadius + bodyVisualRadius(id) <= (outerBodyIds.includes(id) ? outerOverviewRadius : overviewRadius))
  }
  let previousOuter = bodyVisualRadius('sun')
  for (const id of planetIds) {
    const display = bodyDisplay[id]
    assert.ok(display.orbitRadius - bodyVisualRadius(id) > previousOuter, `${id} radial clearance`)
    previousOuter = display.orbitRadius + display.radius
  }
})
test('circular display positions preserve radius, coordinate plane and angular convention', () => {
  assert.deepEqual(orbitPosition(10, 0), [10, 0, 0])
  const quarter = orbitPosition(10, Math.PI / 2)
  assert.ok(Math.abs(quarter[0]) < 1e-10)
  assert.equal(quarter[2], 10)
  const positions = createOrbitPositions(32.5, 192)
  assert.equal(positions.length, 192 * 3)
  for (let i = 0; i < positions.length; i += 3) {
    assert.equal(positions[i + 1], 0)
    assert.ok(Math.abs(Math.hypot(positions[i], positions[i + 2]) - 32.5) < 0.00001)
  }
})
test('overview framing fully encloses every sphere across portrait and landscape aspects', () => {
  for (const aspect of [0.5, 0.7, 1, 1.6, 2.4]) {
    const config = sceneConfig.camera
    const camera = new PerspectiveCamera(config.fov, aspect, config.near, config.far)
    const distance = overviewDistance(overviewRadius, config.fov, aspect, config.framingMargin)
    camera.position.set(0, Math.sin(config.elevation) * distance, Math.cos(config.elevation) * distance)
    camera.lookAt(0, 0, 0)
    camera.updateMatrixWorld(true)
    const frustum = new Frustum().setFromProjectionMatrix(new Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse))
    for (const id of bodyIds.filter(id => !outerBodyIds.includes(id))) {
      const display = bodyDisplay[id]
      const center = new Vector3(...orbitPosition(display.orbitRadius, display.initialPhase))
      for (const plane of frustum.planes) assert.ok(plane.distanceToPoint(center) >= bodyVisualRadius(id), `${id} clipped at aspect ${aspect}`)
    }
  }
  assert.ok(overviewDistance(overviewRadius, 45, 0.5, 1.18) > overviewDistance(overviewRadius, 45, 2, 1.18))
})
test('geometry and framing reject invalid inputs rather than returning NaN', () => {
  for (const [radius, angle] of [[-1, 0], [NaN, 0], [1, Infinity]]) assert.throws(() => orbitPosition(radius, angle), RangeError)
  for (const count of [2, 2.5, 4097, NaN]) assert.throws(() => createOrbitPositions(10, count), RangeError)
  for (const args of [[0,45,1,1.18],[10,180,1,1.18],[10,45,0,1.18],[10,45,1,0.9],[10,45,Infinity,1.18]]) assert.throws(() => overviewDistance(...args), RangeError)
})
