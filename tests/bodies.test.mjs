import { test } from 'node:test'
import assert from 'node:assert/strict'
import { bodies, planets, sun } from '../src/data/bodies.ts'
import { bodyIds, planetIds } from '../src/data/types.ts'
import { scienceSources } from '../src/data/sources.ts'
import { bodyTexts as ja } from '../src/locales/bodies/ja.ts'
import { bodyTexts as zh } from '../src/locales/bodies/zh.ts'
import { bodyTexts as en } from '../src/locales/bodies/en.ts'

test('scope is exactly one Sun, eight ordered planets and twelve moons and six small/dwarf bodies and one comet with unique stable IDs', () => {
  assert.equal(bodies.length, 28)
  assert.equal(new Set(bodies.map(body => body.id)).size, 28)
  assert.deepEqual(bodies.map(body => body.id), bodyIds)
  assert.deepEqual(planets.map(body => body.id), planetIds)
  assert.deepEqual(bodies.filter(body => body.kind === 'star').map(body => body.id), ['sun'])
  assert.equal(sun.orbit, null)
  assert.deepEqual(planets.map(body => body.classification), ['terrestrial','terrestrial','terrestrial','terrestrial','gas-giant','gas-giant','ice-giant','ice-giant'])
})
test('all quantities are finite, carry expected units and resolvable official sources', () => {
  function check(quantity, unit) {
    assert.ok(Number.isFinite(quantity.value))
    assert.equal(quantity.unit, unit)
    const source = scienceSources[quantity.source]
    assert.ok(source)
    assert.equal(new URL(source.url).protocol, 'https:')
    assert.ok(new URL(source.url).hostname.endsWith('.nasa.gov'))
    assert.match(source.accessedOn, /^\d{4}-\d{2}-\d{2}$/)
  }
  for (const body of bodies) {
    check(body.meanRadius, 'km')
    if (body.siderealRotation) check(body.siderealRotation, 'h')
    assert.ok(body.meanRadius.value > 0)
    if (body.siderealRotation) assert.notEqual(body.siderealRotation.value, 0)
    assert.ok(body.descriptionSources.length > 0)
    for (const id of body.descriptionSources) assert.ok(scienceSources[id])
    if (body.kind === 'planet') {
      assert.equal(body.orbit.center, 'sun')
      check(body.orbit.semiMajorAxis, 'km')
      check(body.orbit.siderealPeriod, 'd')
      check(body.orbit.obliquity, 'deg')
      assert.ok(body.orbit.semiMajorAxis.value > 0)
      assert.ok(body.orbit.siderealPeriod.value > 0)
      assert.ok(body.orbit.obliquity.value >= 0 && body.orbit.obliquity.value <= 180)
    }
  }
  for (let i = 1; i < planets.length; i++) {
    assert.ok(planets[i].orbit.semiMajorAxis.value > planets[i - 1].orbit.semiMajorAxis.value)
    assert.ok(planets[i].orbit.siderealPeriod.value > planets[i - 1].orbit.siderealPeriod.value)
  }
})
test('unit normalization, retrograde signs and differential solar rotation are preserved', () => {
  assert.equal(planets.find(body => body.id === 'earth').orbit.semiMajorAxis.value, 149600000)
  assert.deepEqual(planets.filter(body => body.siderealRotation.value < 0).map(body => body.id), ['venus', 'uranus'])
  assert.equal(sun.rotationModel.kind, 'differential')
  assert.equal(sun.rotationModel.referenceLatitude.value, 16)
  assert.equal(sun.siderealRotation.value, 609.12)
  assert.ok(planets.find(body => body.id === 'jupiter').meanRadius.value < sun.meanRadius.value)
})
test('every supported language has exactly the same twenty-eight nonempty body descriptions', () => {
  for (const dictionary of [ja, zh, en]) {
    assert.deepEqual(Object.keys(dictionary).sort(), [...bodyIds].sort())
    for (const id of bodyIds) {
      assert.ok(dictionary[id].name.trim())
      assert.ok(dictionary[id].summary.trim())
    }
  }
})
