import { test } from 'node:test'
import assert from 'node:assert/strict'
import { SelectionGesture } from '../src/scene/selection.ts'
test('primary tap is allowed, including minor pointer movement', () => {
  const gesture = new SelectionGesture()
  assert.equal(gesture.allows(0,0),false)
  gesture.down(1,10,10,0); gesture.up(1,12,11)
  assert.equal(gesture.allows(Math.sqrt(5),0),true)
})
test('drag returning to its starting point is still rejected', () => {
  const gesture = new SelectionGesture()
  gesture.down(1,0,0,0); gesture.move(1,20,0); gesture.up(1,0,0)
  assert.equal(gesture.allows(0,0),false)
  gesture.down(2,0,0,0); gesture.up(2,0,0)
  assert.equal(gesture.allows(0,0),true)
})
test('pinches, cancellations and nonprimary buttons do not select a body', () => {
  const gesture = new SelectionGesture()
  gesture.down(1,0,0,0); gesture.down(2,0,0,0); gesture.up(1,0,0); gesture.up(2,0,0)
  assert.equal(gesture.allows(0,0),false)
  gesture.down(3,0,0,0); gesture.cancel(3)
  assert.equal(gesture.allows(0,0),false)
  gesture.down(4,0,0,2); gesture.up(4,0,0)
  assert.equal(gesture.allows(0,2),false)
  gesture.down(5,0,0,0); gesture.up(5,0,0)
  for(const delta of [NaN,Infinity,-1,5]) assert.equal(gesture.allows(delta,0),false)
})
