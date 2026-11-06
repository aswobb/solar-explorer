import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { textureRequest } from '../src/scene/textureRequest.ts'
import { textureFiles } from '../src/scene/textureAssets.ts'

function pending() {
  let resolve, reject, disposed = 0
  const resource = { dispose() { disposed++ } }
  let ready = 0, failed = 0
  const request = textureRequest((yes, no) => { resolve = yes; reject = no; return resource }, () => ready++, () => failed++)
  return { request, resolve: () => resolve(resource), reject: () => reject(), stats: () => ({ ready, failed, disposed }) }
}
test('texture completion and release happen once; late callbacks do not resurrect resources', () => {
  const job = pending(); job.resolve(); job.resolve(); job.request.cancel(); job.request.cancel(); job.resolve()
  assert.deepEqual(job.stats(), { ready: 1, failed: 0, disposed: 1 })
  const abandoned = pending(); abandoned.request.cancel(); abandoned.resolve(); abandoned.reject()
  assert.deepEqual(abandoned.stats(), { ready: 0, failed: 0, disposed: 1 })
})
test('texture failure or timeout releases resource and preserves one fallback notification', () => {
  for (const fail of [job => job.reject(), job => job.request.timeout()]) {
    const job = pending(); fail(job); job.resolve(); job.reject(); job.request.cancel()
    assert.deepEqual(job.stats(), { ready: 0, failed: 1, disposed: 1 })
  }
  const ready = pending(); ready.resolve(); ready.request.timeout()
  assert.deepEqual(ready.stats(), { ready: 1, failed: 0, disposed: 0 }); ready.request.cancel()
})
test('all twenty-four bundled maps match recorded hashes, dimensions, JPEG type and license', () => {
  const manifest = ['manifest.json', 'satellites-manifest.json', 'small-bodies-manifest.json', 'outer-manifest.json'].flatMap(file => JSON.parse(readFileSync(new URL(`../public/textures/${file}`, import.meta.url), 'utf8')))
  assert.deepEqual(manifest.map(item => item.id).sort(), Object.keys(textureFiles).filter(id=>textureFiles[id]!==null).sort())
  for (const item of manifest) {
    const buf = readFileSync(new URL(`../public/textures/${item.file}`, import.meta.url))
    assert.equal(createHash('sha256').update(buf).digest('hex'), item.sha256)
    assert.equal(buf.length, item.bytes); assert.equal(buf.readUInt16BE(0), 0xffd8)
    let dimensions
    for (let offset = 2; offset < buf.length;) {
      assert.equal(buf[offset], 0xff)
      const marker = buf[offset + 1], length = buf.readUInt16BE(offset + 2)
      if ([0xc0, 0xc1, 0xc2].includes(marker)) { dimensions = [buf.readUInt16BE(offset + 7), buf.readUInt16BE(offset + 5)]; break }
      offset += 2 + length
    }
    assert.deepEqual(dimensions, [item.width, item.height]); assert.ok(['CC-BY-4.0', 'Public-Domain'].includes(item.license))
    assert.equal(item.file, textureFiles[item.id])
  }
})
