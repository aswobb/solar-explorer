import { test } from 'node:test'
import assert from 'node:assert/strict'
import { formatRotationHours, formatScientificValue } from '../src/data/format.ts'
import { bodySourceIds } from '../src/data/bodyDetails.ts'
import { bodies, sun } from '../src/data/bodies.ts'
import { scienceSources } from '../src/data/sources.ts'

test('scientific formatting groups values and rounds without converting units', () => {
  assert.equal(formatScientificValue(6371.0084,'km','en'),'6,371 km')
  assert.equal(formatScientificValue(4515000000,'km','en',0),'4,515,000,000 km')
  assert.match(formatScientificValue(365.2,'d','en'),/^365\.2\s*days?$/)
  assert.match(formatScientificValue(0.034,'deg','en'),/^0\.034\s*(deg|°)$/)
  assert.match(formatScientificValue(609.12,'h','en'),/^609\.12\s*(hr|h)$/)
})
test('Japanese and Chinese durations use localized units and keep retrograde duration positive', () => {
  assert.match(formatScientificValue(365.2,'d','ja'),/365\.2.*日/)
  assert.match(formatScientificValue(365.2,'d','zh'),/365\.2.*天/)
  for(const locale of ['ja','zh','en']) {
    assert.equal(formatRotationHours(-5832.5,locale),formatRotationHours(5832.5,locale))
    assert.ok(!formatRotationHours(-17.2,locale).includes('-'))
    assert.ok(formatScientificValue(0.034,'deg',locale).includes('0.034'))
  }
})
test('every displayed quantity and description has a unique resolvable citation', () => {
  for(const body of bodies) {
    const sources=bodySourceIds(body)
    assert.equal(sources.length,new Set(sources).size)
    assert.ok(sources.includes('nasa-notes'))
    const required=[body.meanRadius.source,...(body.siderealRotation ? [body.siderealRotation.source] : []),...body.descriptionSources]
    if(body.orbit) required.push(body.orbit.semiMajorAxis.source,body.orbit.siderealPeriod.source)
    if(body.orbit?.obliquity) required.push(body.orbit.obliquity.source)
    if(body.orbit?.inclination) required.push(body.orbit.inclination.source)
    for(const source of required) assert.ok(sources.includes(source))
    for(const source of sources) assert.ok(scienceSources[source])
  }
  assert.equal(sun.orbit,null)
  assert.deepEqual(bodySourceIds(sun),['nasa-sun','nasa-system','nasa-notes'])
})
test('invalid numerical inputs fail explicitly instead of showing NaN or infinity', () => {
  for(const value of [NaN,Infinity,-Infinity]) assert.throws(()=>formatScientificValue(value,'km','en'),RangeError)
  for(const digits of [-1,1.5,7]) assert.throws(()=>formatScientificValue(1,'km','ja',digits),RangeError)
  assert.throws(()=>formatRotationHours(0,'ja'),RangeError)
})
