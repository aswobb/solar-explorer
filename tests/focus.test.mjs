import { test } from 'node:test'
import assert from 'node:assert/strict'
import { PerspectiveCamera, Frustum, Matrix4, Vector3 } from 'three'
import { focusDistance, focusLimits, transitionProgress, focusConfig } from '../src/scene/focus.ts'
import { bodyDisplay, bodyVisualRadius } from '../src/scene/displayConfig.ts'
import { zoomDistance } from '../src/scene/cameraControl.ts'

test('focus framing includes the outline of every body on portrait and landscape screens', () => {
  for(const id of Object.keys(bodyDisplay)) for(const aspect of [0.5,0.75,1,2]) {
    const radius=bodyVisualRadius(id)
    const distance=focusDistance(radius,45,aspect)
    const camera=new PerspectiveCamera(45,aspect,0.1,1000)
    const target=new Vector3(12,0,-20)
    camera.position.copy(target).add(new Vector3(0,0.6,0.8).multiplyScalar(distance))
    camera.lookAt(target); camera.updateMatrixWorld(true)
    const frustum=new Frustum().setFromProjectionMatrix(new Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse))
    for(const plane of frustum.planes) assert.ok(plane.distanceToPoint(target)>=radius*focusConfig.outlineScale)
    const limits=focusLimits(radius,distance)
    assert.ok(distance>=limits.min && distance<=limits.max)
  }
})
test('focus zoom bounds permit small-body closeups without entering the sphere', () => {
  const radius=bodyDisplay.mercury.radius
  const limits=focusLimits(radius,focusDistance(radius,45,1))
  let distance=2
  for(let i=0;i<40;i++) distance=zoomDistance(distance,'in',limits.min,limits.max)
  assert.equal(distance,limits.min)
  assert.ok(distance-radius*focusConfig.outlineScale>0.1)
})
test('camera easing has stable endpoints, monotonic progress and immediate reduced motion', () => {
  assert.equal(transitionProgress(0,1.2),0)
  assert.equal(transitionProgress(1.2,1.2),1)
  assert.equal(transitionProgress(10,1.2),1)
  assert.equal(transitionProgress(0,0),1)
  let previous=0
  for(let i=0;i<=120;i++) { const next=transitionProgress(i/100,1.2); assert.ok(next>=previous && next<=1); previous=next }
  const samples=[30,60,144].map(fps=>{let elapsed=0;for(let i=0;i<fps;i++)elapsed+=1/fps;return transitionProgress(elapsed,1.2)})
  for(const sample of samples) assert.ok(Math.abs(sample-samples[0])<1e-10)
})
test('invalid target and transition values fail explicitly', () => {
  for(const args of [[0,45,1],[1,0,1],[1,45,0]]) assert.throws(()=>focusDistance(...args),RangeError)
  for(const args of [[0,2],[1,1],[1,NaN]]) assert.throws(()=>focusLimits(...args),RangeError)
  for(const args of [[-1,1],[1,-1],[NaN,1]]) assert.throws(()=>transitionProgress(...args),RangeError)
})
