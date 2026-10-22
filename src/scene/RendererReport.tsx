import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'

/** Development-only counters; samples the last completed render, not GPU timing. */
export function RendererReport() {
  const gl = useThree(state => state.gl)
  useEffect(() => {
    const report = (phase: string) => {
      const output = document.querySelector<HTMLOutputElement>('[data-renderer-report]')
      if (!output) return
      output.textContent = JSON.stringify({ phase, contextLost: gl.getContext().isContextLost(), dpr: gl.getPixelRatio(), width: gl.domElement.width, height: gl.domElement.height, frame: gl.info.render.frame, calls: gl.info.render.calls, triangles: gl.info.render.triangles, points: gl.info.render.points, geometries: gl.info.memory.geometries, textures: gl.info.memory.textures, programs: gl.info.programs?.length ?? 0 })
    }
    const timer = window.setInterval(() => report('mounted'), 1000)
    return () => {
      window.clearInterval(timer)
      // R3F disposes declarative objects asynchronously after removing the root.
      window.setTimeout(() => report('released'), 1000)
    }
  }, [gl])
  return null
}
