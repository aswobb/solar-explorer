import { qualitySettings, type Quality } from './quality'
import { sceneConfig } from './displayConfig'
import { useMemo } from 'react'
import { createStarPositions } from './starfield'
import { Color } from 'three'

export function BackgroundStars({ quality }: { quality: Quality }) {
  const { stars: count, brightStars: brightCount } = qualitySettings[quality]
  const positions = useMemo(() => createStarPositions(count, sceneConfig.starfield.innerRadius, sceneConfig.starfield.outerRadius), [count])
  const colors = useMemo(() => {
    const palette = ['#bacde6', '#e5d8bb', '#e5ecf6'].map(hex => new Color(hex))
    const result = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) result.set(palette[i % palette.length].toArray(), i * 3)
    return result
  }, [count])
  const brightPositions = useMemo(() => positions.slice(0, brightCount * 3), [positions, brightCount])
  const brightColors = useMemo(() => colors.slice(0, brightCount * 3), [colors, brightCount])
  return (
    <group name="decorative-background-stars">
      <points raycast={() => {}}>
        <bufferGeometry key={count}><bufferAttribute attach="attributes-position" args={[positions, 3]} /><bufferAttribute attach="attributes-color" args={[colors, 3]} /></bufferGeometry>
        <pointsMaterial vertexColors size={sceneConfig.starfield.faintSize} sizeAttenuation transparent opacity={sceneConfig.starfield.faintOpacity} depthWrite={false} toneMapped={false} />
      </points>
      <points raycast={() => {}}>
        <bufferGeometry key={brightCount}><bufferAttribute attach="attributes-position" args={[brightPositions, 3]} /><bufferAttribute attach="attributes-color" args={[brightColors, 3]} /></bufferGeometry>
        <pointsMaterial vertexColors size={sceneConfig.starfield.brightSize} sizeAttenuation transparent opacity={sceneConfig.starfield.brightOpacity} depthWrite={false} toneMapped={false} />
      </points>
    </group>
  )
}
