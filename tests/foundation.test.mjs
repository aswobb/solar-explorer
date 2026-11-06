import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildHierarchy, composeWorldPosition } from '../src/scene/hierarchy.ts'
import { SimulationClock } from '../src/scene/simulationClock.ts'
import { parentView, visibleSelection, viewDisplay } from '../src/scene/exploration.ts'
const sun = { id: 'sun', kind: 'star', orbit: null }
const earth = { id: 'earth', kind: 'planet', orbit: { center: 'sun' } }
const moon = { id: 'moon', kind: 'moon', orbit: { center: 'earth' } }
test('unsorted catalog resolves parents before descendants and rejects invalid graphs', () => {
  const graph = buildHierarchy([moon, earth, sun])
  assert.deepEqual(graph.ordered.map(body => body.id), ['sun', 'earth', 'moon'])
  assert.deepEqual(graph.children.get('earth'), [moon])
  assert.throws(() => buildHierarchy([sun, sun]), /Duplicate/)
  assert.throws(() => buildHierarchy([moon]), /Missing parent/)
  assert.throws(() => buildHierarchy([{ ...earth, orbit: { center: 'moon' } }, moon]), /cycle/)
  assert.deepEqual(composeWorldPosition([10, 0, 5], [2, 0, 1]), [12, 0, 6])
})
test('shared clock excludes resume delta, supports seeking while paused and clamps steps', () => {
  const clock = new SimulationClock()
  assert.equal(clock.advance(50, 1, true), 0)
  assert.equal(clock.advance(1, 2, true), 0.5)
  assert.equal(clock.advance(50, 1, false), 0.5)
  assert.equal(clock.advance(50, 1, true), 0.5)
  clock.setTime(100)
  assert.equal(clock.advance(20, 1, false), 100)
  assert.equal(clock.advance(20, 1, true), 100)
  assert.equal(clock.advance(0.1, 1, true), 100.1)
  assert.throws(() => clock.setTime(-1), /Invalid/)
})
test('view and selection are independent and hidden targets clear safely', () => {
  assert.deepEqual(parentView({ kind: 'system', center: 'earth' }), { kind: 'body', center: 'earth' })
  assert.deepEqual(parentView({ kind: 'outer', region: 'oort' }), { kind: 'overview' })
  assert.equal(visibleSelection('moon', new Set(['earth'])), null)
  assert.equal(visibleSelection('earth', new Set(['earth'])), 'earth')
  assert.ok(viewDisplay(10000).far > viewDisplay(40).far)
  assert.throws(() => viewDisplay(0), /Invalid/)
})
