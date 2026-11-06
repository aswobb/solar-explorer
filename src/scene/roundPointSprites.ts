import type { PointsMaterial } from 'three'
export const roundDust: PointsMaterial['onBeforeCompile'] = shader => {
  shader.vertexShader = shader.vertexShader.replace('#include <fog_vertex>', 'gl_PointSize = min(gl_PointSize, 2.2);\n#include <fog_vertex>')
  shader.fragmentShader = shader.fragmentShader.replace('#include <clipping_planes_fragment>', '#include <clipping_planes_fragment>\nif (length(gl_PointCoord - vec2(0.5)) > 0.5) discard;')
}
