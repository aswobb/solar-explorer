import test from 'node:test'
import assert from 'node:assert/strict'
import {PerspectiveCamera,Frustum,Matrix4,Vector3} from 'three'
import {farRadius,farAU,createOortPositions,createFarDisk,oortConfig,oortBudgets} from '../src/scene/oortField.ts'
import {overviewDistance} from '../src/scene/geometry.ts'
import {parentView,viewDisplay} from '../src/scene/exploration.ts'
test('far logarithmic mapping is monotonic, bounded, reversible and independent of estimated boundaries',()=>{
 let previous=-1
 for(const au of [0,1,30,50,100,2000,5000,10000,100000]) {const radius=farRadius(au);assert.ok(radius>previous);assert.ok(Math.abs(farAU(radius)-au)<1e-8);previous=radius}
 assert.equal(farRadius(100000),80);assert.deepEqual(oortConfig.estimatedInnerAU,[2000,5000]);assert.deepEqual(oortConfig.displayedRangeAU,[5000,100000])
 for(const value of [-1,NaN,Infinity,100001])assert.throws(()=>farRadius(value),RangeError)
 assert.throws(()=>farAU(81),RangeError)
})
test('cloud is deterministic with stable quality prefixes, finite spherical bounds and no disk bias',()=>{
 const all=createOortPositions(oortBudgets.standard),eco=createOortPositions(oortBudgets.eco)
 assert.deepEqual(all.slice(0,eco.length),eco)
 let x2=0,y2=0,z2=0
 for(let i=0;i<all.length;i+=3) {const [x,y,z]=all.slice(i,i+3),r=Math.hypot(x,y,z);assert.ok(r>=farRadius(5000)-1e-5&&r<=80+1e-5);x2+=x*x;y2+=y*y;z2+=z*z}
 assert.ok(y2/x2>0.9&&y2/x2<1.1);assert.ok(z2/x2>0.9&&z2/x2<1.1)
 assert.notDeepEqual(createOortPositions(3,1),createOortPositions(3,2))
 for(const count of [-1,8001,1.1]) assert.throws(()=>createOortPositions(count),RangeError)
})
test('Kuiper disk remains small, thin and radially separate from the surrounding cloud',()=>{
 const disk=createFarDisk(1200)
 for(let i=0;i<disk.length;i+=3) {const [x,y,z]=disk.slice(i,i+3);assert.ok(Math.abs(y)<=0.25);const r=Math.hypot(x,z);assert.ok(r>=farRadius(30)-1e-5&&r<=farRadius(50)+1e-5);assert.ok(r<farRadius(5000)/5)}
 assert.deepEqual(parentView({kind:'oort'}),{kind:'outer',region:'kuiper'})
})
test('far camera framing encloses full shell in portrait and landscape without large physical coordinates',()=>{
 for(const aspect of [0.4,0.7,1,1.6,2.4]) {
  const distance=overviewDistance(80,45,aspect,1.18);assert.ok(distance<900)
  const c=new PerspectiveCamera(45,aspect,viewDisplay(80).near,viewDisplay(80).far);c.position.set(0,distance/Math.sqrt(2),distance/Math.sqrt(2));c.lookAt(0,0,0);c.updateMatrixWorld(true)
  const frustum=new Frustum().setFromProjectionMatrix(new Matrix4().multiplyMatrices(c.projectionMatrix,c.matrixWorldInverse))
  for(let i=0;i<300;i++){const a=i*2.399963,r=Math.sqrt(1-(i/150-1)**2)*80;assert.ok(frustum.containsPoint(new Vector3(Math.cos(a)*r,(i/150-1)*80,Math.sin(a)*r)))}
 }
})
