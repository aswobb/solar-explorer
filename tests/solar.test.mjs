import test from 'node:test'
import assert from 'node:assert/strict'
import { solarPhase, solarVisual, solarGlowLevels, isSolarGlow } from '../src/scene/solarVisual.ts'
import { simulationStep } from '../src/scene/motion.ts'

test('solar effect phase follows the shared simulation clock across frame rates, pause and speed',()=>{
  const samples=[30,60,144].map(hz=>{let seconds=0;for(let i=0;i<hz*4;i++)seconds+=simulationStep(1/hz,2,true);return solarPhase(seconds)})
  for(const phase of samples)assert.ok(Math.abs(phase-samples[0])<1e-10)
  let seconds=3;const before=solarPhase(seconds)
  seconds+=simulationStep(0.2,5,false);assert.equal(solarPhase(seconds),before)
  seconds+=simulationStep(0.2,5,true);assert.ok(Math.abs(solarPhase(seconds)-before-solarVisual.phaseRate)<1e-12)
  for(const value of [-1,NaN,Infinity])assert.throws(()=>solarPhase(value),RangeError)
})
test('bounded shader phase has a continuous periodic sin/cos trajectory and valid glow levels',()=>{
  const period=2*Math.PI/solarVisual.phaseRate
  for(const multiple of [1,2,3]){
    const before=solarPhase(period-1e-7),after=solarPhase(period+1e-7)
    assert.ok(Math.abs(Math.sin(multiple*before)-Math.sin(multiple*after))<1e-6)
    assert.ok(Math.abs(Math.cos(multiple*before)-Math.cos(multiple*after))<1e-6)
  }
  for(const seconds of [0,12,1e6])assert.ok(solarPhase(seconds)>=0 && solarPhase(seconds)<2*Math.PI)
  assert.equal(solarGlowLevels[0],0);assert.equal(solarGlowLevels.at(-1),1)
  assert.ok(isSolarGlow(solarVisual.defaultGlow))
  for(const value of solarGlowLevels)assert.ok(isSolarGlow(value))
  for(const value of [-1,0.5,2,NaN,Infinity])assert.equal(isSolarGlow(value),false)
})
