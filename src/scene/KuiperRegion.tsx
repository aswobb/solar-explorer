import { useMemo, useRef, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { Group, Points, PointsMaterial } from 'three'
import { qualitySettings, type Quality } from './quality'
import { createKuiperPositions, kuiperOpacity, kuiperDrawCount } from './outerScene'
import { roundDust } from './roundPointSprites'
export function KuiperRegion({ quality, time, reducedMotion = false }: { reducedMotion?:boolean;quality: Quality; time: RefObject<number> }) {
  const camera = useThree(state => state.camera)
  const points = useRef<Points>(null)
  const root = useRef<Group>(null)
  const material = useRef<PointsMaterial>(null)
  const count = Math.floor(qualitySettings[quality].regionPoints * 0.4)
  const positions = useMemo(() => createKuiperPositions(count), [count])
  useFrame(() => {
    const alpha = kuiperOpacity(camera.position.length(),reducedMotion)
    if (root.current) { root.current.visible = alpha > 0.001; root.current.rotation.y = time.current / 350 }
    points.current?.geometry.setDrawRange(0, kuiperDrawCount(count, alpha))
    if (material.current) material.current.opacity = alpha * 0.42
  })
  return <group ref={root} name="kuiper-belt" visible={false}>
    <points ref={points} raycast={() => {}}><bufferGeometry key={count}><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial ref={material} onBeforeCompile={roundDust} customProgramCacheKey={() => 'belt-round-dust-v1'} color="#91b5cd" size={0.2} sizeAttenuation transparent opacity={0} depthWrite={false} toneMapped={false} />
    </points>
  </group>
}
