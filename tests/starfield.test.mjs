import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createStarPositions } from '../src/scene/starfield.ts'

test('decorative sky is deterministic and stays inside its configured shell', () => {
  const positions = createStarPositions(2400, 160, 260)
  assert.equal(positions.length, 7200)
  assert.deepEqual(positions, createStarPositions(2400, 160, 260))
  assert.notDeepEqual(positions, createStarPositions(2400, 160, 260, 74))
  for (let i = 0; i < positions.length; i += 3) {
    const radius = Math.hypot(positions[i], positions[i + 1], positions[i + 2])
    assert.ok(Number.isFinite(radius) && radius >= 160 - 0.0001 && radius <= 260 + 0.0001)
  }
})
test('sky generator rejects invalid allocation and radius inputs', () => {
  for (const count of [-1, 0.5, NaN, Infinity, 10001]) assert.throws(() => createStarPositions(count, 160, 260), RangeError)
  for (const [inner, outer] of [[0, 2], [2, 2], [3, 2], [NaN, 2], [1, Infinity]]) assert.throws(() => createStarPositions(10, inner, outer), RangeError)
  assert.equal(createStarPositions(0, 160, 260).length, 0)
})
