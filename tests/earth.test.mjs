import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { cloudDrift, setEarthSunDirection, earthVisual } from '../src/scene/earthVisual.ts'
import { simulationStep } from '../src/scene/motion.ts'
import { earthTextureFiles } from '../src/scene/textureAssets.ts'

test('solar direction points from the moving Earth to the Sun in world space', () => {
  const target={x:0,y:0,z:0}
  for(const center of [{x:10.5,y:0,z:0},{x:0,y:0,z:-10.5},{x:-3,y:4,z:5}]){
    setEarthSunDirection(center,target)
    assert.ok(Math.abs(Math.hypot(target.x,target.y,target.z)-1)<1e-12)
    const length=Math.hypot(center.x,center.y,center.z)
    assert.ok(Math.abs(target.x*length+center.x)<1e-12)
    assert.ok(Math.abs(target.y*length+center.y)<1e-12)
    assert.ok(Math.abs(target.z*length+center.z)<1e-12)
  }
  assert.throws(()=>setEarthSunDirection({x:0,y:0,z:0},target),RangeError)
  assert.throws(()=>setEarthSunDirection({x:NaN,y:0,z:1},target),RangeError)
})
test('cloud drift follows simulation time at different frame rates, pauses, and speed changes', () => {
  const run = hz => { let seconds=0; for(let i=0;i<hz*3;i++) seconds+=simulationStep(1/hz,2,true); return cloudDrift(seconds) }
  assert.ok(Math.abs(run(30)-run(144))<1e-10)
  let seconds=4; const before=cloudDrift(seconds)
  seconds+=simulationStep(0.1,5,false); assert.equal(cloudDrift(seconds),before)
  seconds+=simulationStep(0.1,5,true); assert.ok(Math.abs(cloudDrift(seconds)-before-0.5*earthVisual.cloudRadiansPerSecond)<1e-10)
  assert.equal(cloudDrift(0),0); assert.throws(()=>cloudDrift(-1),RangeError)
  assert.ok(earthVisual.cloudScale>1 && earthVisual.atmosphereScale>earthVisual.cloudScale && earthVisual.atmosphereScale<1.18)
})
test('Earth layer files have pinned content, JPEG dimensions and attribution', () => {
  const manifest=JSON.parse(readFileSync(new URL('../public/textures/earth-manifest.json',import.meta.url),'utf8'))
  assert.deepEqual(manifest.map(m=>m.id).sort(),Object.keys(earthTextureFiles).sort())
  for(const item of manifest) {
    const buf=readFileSync(new URL('../public/textures/'+item.file,import.meta.url))
    assert.equal(createHash('sha256').update(buf).digest('hex'),item.sha256)
    assert.equal(buf.length,item.bytes); assert.equal(item.license,'CC-BY-4.0')
    assert.equal(buf.readUInt16BE(0),0xffd8)
    let dimensions
    for(let pos=2;pos<buf.length;){const marker=buf[pos+1],size=buf.readUInt16BE(pos+2);if([0xc0,0xc1,0xc2].includes(marker)){dimensions=[buf.readUInt16BE(pos+7),buf.readUInt16BE(pos+5)];break}pos+=size+2}
    assert.deepEqual(dimensions,[2048,1024]);assert.equal(earthTextureFiles[item.id],item.file)
  }
})
