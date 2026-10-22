import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const root = new URL('../', import.meta.url)
const read = path => readFile(new URL(path, root))
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const html = (await read('dist/index.html')).toString('utf8')
const entries = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(match => match[1])
assert.ok(entries.some(path => path.endsWith('.js')), 'Missing script entry')
assert.ok(entries.some(path => path.endsWith('.css')), 'Missing stylesheet')
for (const path of entries) {
  assert.match(path, /^\.\/assets\/[\w.-]+\.(?:js|css)$/, `Nonportable asset path: ${path}`)
  assert.ok((await stat(new URL(`dist/${path}`, root))).isFile(), `Missing ${path}`)
}

const manifests = ['manifest.json', 'earth-manifest.json', 'ring-manifest.json']
const textures = []
for (const name of [...manifests, 'ATTRIBUTION.md']) {
  const source = await read(`public/textures/${name}`)
  const output = await read(`dist/textures/${name}`)
  assert.equal(hash(output), hash(source), `Changed or missing distribution credit: ${name}`)
  if (manifests.includes(name)) {
    const record = JSON.parse(source.toString('utf8').replace(/^\uFEFF/, ''))
    textures.push(...(Array.isArray(record) ? record : [record]))
  }
}
assert.equal(textures.length, 12)
assert.equal(new Set(textures.map(texture => texture.file)).size, 12)
for (const texture of textures) {
  assert.match(texture.file, /^[\w.-]+\.(?:jpg|png)$/)
  const output = await read(`dist/textures/${texture.file}`)
  assert.equal(output.length, texture.bytes, `Wrong size: ${texture.file}`)
  assert.equal(hash(output), texture.sha256, `Wrong hash: ${texture.file}`)
}
console.log(`Verified ${fileURLToPath(new URL('dist/', root))}: relative entries, 12 textures and 4 unchanged credit/manifest files.`)
