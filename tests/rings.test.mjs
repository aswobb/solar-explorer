import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { RingGeometry, SphereGeometry, Mesh, MeshBasicMaterial, DoubleSide, Raycaster, Vector3 } from 'three'
import { ringRadialU, mapRingUvs } from '../src/scene/ringGeometry.ts'
import { bodyDisplay, saturnRingConfig, bodyVisualRadius } from '../src/scene/displayConfig.ts'

test('radial strip maps every angle from inner to outer edge rather than stretching a square image', () => {
  const inner=bodyDisplay.saturn.radius*saturnRingConfig.innerScale,outer=bodyVisualRadius('saturn')
  const geometry=new RingGeometry(inner,outer,saturnRingConfig.segments,2)
  mapRingUvs(geometry,inner,outer)
  const p=geometry.getAttribute('position'),uv=geometry.getAttribute('uv')
  for(let i=0;i<p.count;i++) { const radius=Math.hypot(p.getX(i),p.getY(i)); assert.ok(Math.abs(uv.getX(i)-Math.max(0,Math.min(1,(radius-inner)/(outer-inner))))<1e-6);assert.equal(uv.getY(i),0.5) }
  assert.equal(ringRadialU(inner,inner,outer),0);assert.equal(ringRadialU(outer,inner,outer),1)
  for(const args of [[1,0,2],[1,2,1],[NaN,1,2]])assert.throws(()=>ringRadialU(...args),RangeError)
  geometry.dispose()
})
test('ring plane has foreground and background intersections with the opaque planet', () => {
  const ringGeometry=new RingGeometry(2.196,3.87,160),sphereGeometry=new SphereGeometry(1.8,48,32)
  const material=new MeshBasicMaterial({side:DoubleSide}),ring=new Mesh(ringGeometry,material),planet=new Mesh(sphereGeometry,material)
  ring.rotation.x=-Math.PI/2;ring.updateMatrixWorld(true);planet.updateMatrixWorld(true)
  const origin=new Vector3(0,3,8),ray=new Raycaster()
  for(const [z,first] of [[2.5,ring],[-2.5,planet]]) {
    ray.set(origin,new Vector3(0,0,z).sub(origin).normalize())
    const hits=ray.intersectObjects([ring,planet]);assert.ok(hits.some(hit=>hit.object===ring));assert.ok(hits.some(hit=>hit.object===planet));assert.equal(hits[0].object,first)
  }
  ringGeometry.dispose();sphereGeometry.dispose();material.dispose()
})
test('ring PNG has pinned RGBA radial data and attribution',()=>{
  const item=JSON.parse(readFileSync(new URL('../public/textures/ring-manifest.json',import.meta.url),'utf8'))
  const buf=readFileSync(new URL('../public/textures/'+item.file,import.meta.url))
  assert.equal(createHash('sha256').update(buf).digest('hex'),item.sha256);assert.equal(buf.length,item.bytes)
  assert.equal(buf.subarray(1,4).toString(),'PNG');assert.equal(buf.readUInt32BE(16),2048);assert.equal(buf.readUInt32BE(20),125)
  assert.equal(buf[25],6);assert.equal(item.license,'CC-BY-4.0')
})
