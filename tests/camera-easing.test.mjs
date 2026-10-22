import test from 'node:test'
import assert from 'node:assert/strict'
import { transitionProgress } from '../src/scene/focus.ts'

test('camera easing starts and stops with near-zero velocity and acceleration',()=>{
  const h=0.001
  const startSlope=(transitionProgress(h,1)-transitionProgress(0,1))/h
  const endSlope=(transitionProgress(1,1)-transitionProgress(1-h,1))/h
  const startAcceleration=(transitionProgress(2*h,1)-2*transitionProgress(h,1)+transitionProgress(0,1))/(h*h)
  const endAcceleration=(transitionProgress(1,1)-2*transitionProgress(1-h,1)+transitionProgress(1-2*h,1))/(h*h)
  assert.ok(Math.abs(startSlope)<0.0001 && Math.abs(endSlope)<0.0001)
  assert.ok(Math.abs(startAcceleration)<0.1 && Math.abs(endAcceleration)<0.1)
})
