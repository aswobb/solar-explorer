import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import ts from 'typescript'

const source = await readFile(new URL('../src/locales/types.ts', import.meta.url), 'utf8')
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } })
const { resolveLocale, localeTags } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)
test('supported preferences retain their language', () => {
  for (const locale of ['ja', 'zh', 'en']) assert.equal(resolveLocale(locale), locale)
  assert.deepEqual(Object.values(localeTags), ['ja-JP', 'zh-CN', 'en-US'])
})
test('missing or invalid preferences fall back to Japanese', () => {
  for (const locale of [null, '', 'fr', '__proto__', 'zh-CN']) assert.equal(resolveLocale(locale), 'ja')
})
