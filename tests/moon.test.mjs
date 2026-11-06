import test from 'node:test'
import assert from 'node:assert/strict'
import { Vector3, PerspectiveCamera, Frustum, Matrix4 } from 'three'
import { moon, bodies } from '../src/data/bodies.ts'
import { anglesAt } from '../src/scene/motion.ts'
import { orbitPosition } from '../src/scene/geometry.ts'
import { composeWorldPosition, buildHierarchy } from '../src/scene/hierarchy.ts'
import { lockedMoonSpin } from '../src/scene/moonMotion.ts'
import { bodyDisplay, earthMoonSystemRadius } from '../src/scene/displayConfig.ts'
import { focusDistance } from '../src/scene/focus.ts'
import { parentView } from '../src/scene/exploration.ts'
test('Moon has a sourced Earth-relative orbit and follows its moving parent without inheriting spin', () => {
  assert.equal(moon.orbit.center, 'earth')
  assert.equal(moon.orbit.semiMajorAxis.value, 384400)
  assert.equal(moon.meanRadius.value, 1737.4)
  assert.equal(moon.rotationModel.kind, 'tidally-locked')
  const order = buildHierarchy(bodies).ordered.map(body => body.id)
  assert.ok(order.indexOf('earth') < order.indexOf('moon'))
  for (const t of [0, 3, 10, 40, 120]) {
    const earthAngle = anglesAt(t, bodyDisplay.earth.initialPhase, 365.2, 23.9).orbit
    const angle = anglesAt(t, bodyDisplay.moon.initialPhase, moon.orbit.siderealPeriod.value, moon.siderealRotation.value).orbit
    const earth = orbitPosition(bodyDisplay.earth.orbitRadius, earthAngle)
    const local = orbitPosition(bodyDisplay.moon.orbitRadius, angle)
    const absolute = composeWorldPosition(earth, local)
    assert.ok(Math.abs(new Vector3(...absolute).distanceTo(new Vector3(...earth)) - bodyDisplay.moon.orbitRadius) < 1e-10)
    const facing = new Vector3(1, 0, 0).applyAxisAngle(new Vector3(0, 1, 0), lockedMoonSpin(angle))
    const towardEarth = new Vector3(...earth).sub(new Vector3(...absolute)).normalize()
    assert.ok(facing.dot(towardEarth) > 1 - 1e-10)
  }
})
test('system framing encloses Earth and Moon at every phase in landscape and portrait', () => {
  for (const aspect of [0.45, 0.7, 1.5, 2]) {
    const camera = new PerspectiveCamera(45, aspect, 0.01, 1000)
    const distance = focusDistance(earthMoonSystemRadius, 45, aspect)
    camera.position.set(0, distance / Math.sqrt(2), distance / Math.sqrt(2))
    camera.lookAt(0, 0, 0); camera.updateMatrixWorld(true)
    const frustum = new Frustum().setFromProjectionMatrix(new Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse))
    for (let angle = 0; angle < 6.3; angle += 0.1) {
      const center = new Vector3(...orbitPosition(bodyDisplay.moon.orbitRadius, angle))
      for (const plane of frustum.planes) assert.ok(plane.distanceToPoint(center) > bodyDisplay.moon.radius)
    }
  }
})
test('Moon returns through system, Earth close-up, then overview', () => {
  let view = { kind: 'body', center: 'moon' }
  view = parentView(view); assert.deepEqual(view, { kind: 'system', center: 'earth' })
  view = parentView(view); assert.deepEqual(view, { kind: 'body', center: 'earth' })
  assert.deepEqual(parentView(view), { kind: 'overview' })
})
