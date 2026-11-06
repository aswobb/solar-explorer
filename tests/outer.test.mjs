import test from 'node:test'
import assert from 'node:assert/strict'
import { PerspectiveCamera,Vector3,Frustum,Matrix4 } from 'three'
import { filterCatalog } from '../src/data/catalog.ts'
import { bodies,outerDwarfs } from '../src/data/bodies.ts'
import { textureFiles } from '../src/scene/textureAssets.ts'
import { kuiperConfig,kuiperOpacity,kuiperDrawCount,createKuiperPositions } from '../src/scene/outerScene.ts'
import { bodyDisplay,bodyVisualRadius,overviewRadius,outerOverviewRadius,bodyShape } from '../src/scene/displayConfig.ts'
import { overviewDistance,inclinedOrbitPosition } from '../src/scene/geometry.ts'
import { visibleBodyIds } from '../src/scene/satelliteSystems.ts'
import { parentView } from '../src/scene/exploration.ts'
test('catalog filters include exactly five dwarf planets and retain cross-language names and moon parents',()=>{
  assert.equal(filterCatalog('all','').length,28)
  assert.equal(filterCatalog('planet','').length,8)
  assert.equal(filterCatalog('moon','').length,12)
  assert.equal(filterCatalog('dwarf-planet','').length,5)
  assert.equal(filterCatalog('asteroid','').length,1)
  for(const query of ['Eris','阋神星','エリス','ＥＲＩＳ']) assert.deepEqual(filterCatalog('dwarf-planet',query).map(body=>body.id),['eris'])
  assert.equal(filterCatalog('planet','pluto').length,0)
  assert.equal(filterCatalog('all','no-such-body').length,0)
  assert.equal(filterCatalog('moon','Europa')[0].orbit.center,'jupiter')
  assert.equal(bodies.filter(body=>body.id==='ceres').length,1)
})
test('outer targets distinguish scattered disk and illustrative appearances without fake texture files',()=>{
  const eris=outerDwarfs.find(body=>body.id==='eris')
  assert.equal(eris.population,'scattered-disk')
  assert.ok(eris.orbit.inclination.value>40)
  assert.ok(bodyDisplay.eris.orbitRadius>kuiperConfig.outerRadius)
  for(const id of ['eris','haumea','makemake']) assert.equal(textureFiles[id],null)
  assert.equal(textureFiles.pluto,'pluto.jpg')
  assert.ok(bodyShape('haumea')[1]<bodyShape('haumea')[0])
  for(const body of outerDwarfs) assert.deepEqual(parentView({kind:'body',center:body.id}),{kind:'outer',region:'kuiper'})
  assert.ok(!visibleBodyIds(null,true,true,false).includes('eris'))
  assert.equal(visibleBodyIds(null,true,true,true).length,27)
  assert.ok(!visibleBodyIds('saturn',true,true,true).includes('pluto'))
})
test('Kuiper field is deterministic, disk-shaped, outside Neptune and smoothly distance-faded',()=>{
  const a=createKuiperPositions(2400)
  assert.deepEqual(createKuiperPositions(600),a.slice(0,1800))
  assert.notDeepEqual(createKuiperPositions(6,1),a.slice(0,18))
  for(let i=0;i<a.length;i+=3){
    const r=Math.hypot(a[i],a[i+2]);assert.ok(r>=kuiperConfig.innerRadius-1e-5&&r<=kuiperConfig.outerRadius+1e-5)
    assert.ok(Math.abs(a[i+1])<=kuiperConfig.halfThickness)
  }
  assert.ok(kuiperConfig.innerRadius>bodyDisplay.neptune.orbitRadius+bodyVisualRadius('neptune'))
  assert.equal(kuiperOpacity(100),0);assert.equal(kuiperOpacity(210),1)
  let previous=0;for(let distance=115;distance<=205;distance+=1){const next=kuiperOpacity(distance);assert.ok(next>=previous);previous=next}
  assert.ok(kuiperOpacity(115.01)<1e-6)
  assert.throws(()=>createKuiperPositions(6001),RangeError);assert.throws(()=>kuiperOpacity(NaN),RangeError)
})
test('outer framing encloses inclined paths in portrait without shrinking the default planetary overview',()=>{
  assert.ok(overviewRadius<40)
  assert.ok(outerOverviewRadius>75)
  for(const aspect of [.45,.7,1,1.5,2]){
    const camera=new PerspectiveCamera(45,aspect,.01,3000)
    const distance=overviewDistance(outerOverviewRadius,45,aspect,1.18)
    assert.ok(distance<900)
    camera.position.set(0,distance/Math.sqrt(2),distance/Math.sqrt(2));camera.lookAt(0,0,0);camera.updateMatrixWorld(true)
    const frustum=new Frustum().setFromProjectionMatrix(new Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse))
    for(const body of outerDwarfs)for(let angle=0;angle<6.3;angle+=.1){
      const point=new Vector3(...inclinedOrbitPosition(bodyDisplay[body.id].orbitRadius,angle,body.orbit.inclination.value))
      for(const plane of frustum.planes)assert.ok(plane.distanceToPoint(point)>bodyVisualRadius(body.id))
      assert.ok(Math.abs(point.length()-bodyDisplay[body.id].orbitRadius)<1e-10)
    }
  }
  assert.throws(()=>inclinedOrbitPosition(20,0,181),RangeError)
})

test('distance detail reveals a stable prefix within the quality budget',()=>{
  assert.equal(kuiperDrawCount(2400,0),600)
  assert.equal(kuiperDrawCount(2400,.5),1500)
  assert.equal(kuiperDrawCount(2400,1),2400)
  assert.equal(kuiperDrawCount(600,1),600)
  assert.throws(()=>kuiperDrawCount(600,1.1),RangeError)
})
