import test from 'node:test'
import assert from 'node:assert/strict'
import {filterExplorerCatalog,explorerTargetCount} from '../src/data/explorerCatalog.ts'
import {kuiperOpacity,kuiperConfig} from '../src/scene/outerScene.ts'
import {parentView} from '../src/scene/exploration.ts'
test('unified catalog searches natural and artificial targets across all three languages without mixing categories',()=>{
 const all=filterExplorerCatalog('all','');assert.equal(all.bodies.length+all.crafts.length,32);assert.equal(explorerTargetCount,32)
 for(const q of ['哈勃','ハッブル','Ｈｕｂｂｌｅ'])assert.deepEqual(filterExplorerCatalog('earth-satellite',q).crafts,['hubble'])
 for(const q of ['旅行者','ボイジャー','voyager'])assert.deepEqual(filterExplorerCatalog('deep-space-probe',q).crafts,['voyager1'])
 assert.equal(filterExplorerCatalog('moon','').bodies.length,12);assert.deepEqual(filterExplorerCatalog('moon','').crafts,[])
 assert.equal(filterExplorerCatalog('earth-satellite','').bodies.length,0);assert.equal(filterExplorerCatalog('earth-satellite','').crafts.length,2)
 assert.equal(filterExplorerCatalog('deep-space-probe','').crafts.length,2)
 assert.deepEqual(filterExplorerCatalog('all','nothing matches'),{bodies:[],crafts:[]})
})
test('reduced-motion Kuiper presentation has no intermediate fade or growing detail',()=>{
 for(let distance=0;distance<=300;distance++){const alpha=kuiperOpacity(distance,true);assert.ok(alpha===0||alpha===1)}
 assert.equal(kuiperOpacity(kuiperConfig.fadeStart-0.01,true),0);assert.equal(kuiperOpacity(kuiperConfig.fadeStart,true),1)
 const half=(kuiperConfig.fadeStart+kuiperConfig.fadeEnd)/2;assert.ok(kuiperOpacity(half)>0&&kuiperOpacity(half)<1)
 assert.deepEqual(parentView({kind:'earth-orbit'}),{kind:'body',center:'earth'})
})
