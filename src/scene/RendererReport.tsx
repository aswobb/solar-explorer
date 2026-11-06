import type { Points } from 'three'
import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

/** Development-only counters; samples the last completed render, not GPU timing. */
export function RendererReport({sampleKey}:{sampleKey?:string}) {
  const frames = useRef<number[]>([])
  useEffect(()=>{frames.current=[]},[sampleKey])
  useFrame((_, delta) => {
    if (delta > 0 && delta < 1) {
      frames.current.push(delta * 1000)
      if (frames.current.length > 120) frames.current.shift()
    }
  })
  const camera = useThree(state => state.camera)
  const scene = useThree(state => state.scene)
  const gl = useThree(state => state.gl)
  useEffect(() => {
    const report = (phase: string) => {
      const output = document.querySelector<HTMLOutputElement>('[data-renderer-report]')
      if (!output) return
      const kuiper = scene.getObjectByName('kuiper-belt')
      const kuiperPoints = kuiper?.children[0] as Points | undefined
      const kuiperOpacity = kuiperPoints && !Array.isArray(kuiperPoints.material) ? kuiperPoints.material.opacity : 0
      output.textContent = JSON.stringify({ phase, sampleCount: frames.current.length, p95FrameIntervalMs: frames.current.length ? [...frames.current].sort((a,b)=>a-b)[Math.min(frames.current.length-1,Math.floor(frames.current.length*0.95))] : null, oortPoints: (scene.getObjectByName('oort-cloud') as Points | undefined)?.geometry.getAttribute('position').count ?? 0, farScene: !!scene.getObjectByName('oort-far-scene'), kuiperVisible: kuiper?.visible ?? false, kuiperOpacity, kuiperDrawCount: kuiperPoints?.geometry.drawRange.count ?? 0, skyOffset: scene.getObjectByName('decorative-background-stars')?.position.distanceTo(camera.position) ?? null, frameIntervalMs: frames.current.length ? frames.current.reduce((sum, value) => sum + value, 0) / frames.current.length : null, contextLost: gl.getContext().isContextLost(), dpr: gl.getPixelRatio(), width: gl.domElement.width, height: gl.domElement.height, frame: gl.info.render.frame, calls: gl.info.render.calls, triangles: gl.info.render.triangles, points: gl.info.render.points, geometries: gl.info.memory.geometries, textures: gl.info.memory.textures, programs: gl.info.programs?.length ?? 0 })
    }
    const clearSamples=()=>{frames.current=[]}
    const reportNow=()=>report('manual')
    window.addEventListener('solar:report-renderer',reportNow)
    window.addEventListener('solar:reset-renderer-samples',clearSamples)
    const timer = window.setInterval(() => report('mounted'), 1000)
    return () => {
      window.removeEventListener('solar:report-renderer',reportNow)
      window.removeEventListener('solar:reset-renderer-samples',clearSamples)
      window.clearInterval(timer)
      // R3F disposes declarative objects asynchronously after removing the root.
      window.setTimeout(() => report('released'), 1000)
    }
  }, [gl, camera, scene])
  return null
}
