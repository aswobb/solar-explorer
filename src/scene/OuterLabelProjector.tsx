import { useEffect, useRef, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, Vector3 } from 'three'
import { outerBodyIds, type OuterBodyId } from '../data/types'
import { bodyDisplay } from './displayConfig'
import { kuiperOpacity } from './outerScene'
import { layoutLabels, type LabelCandidate, type LabelObstacle } from './labelLayout'
export type OuterLabelElements = Partial<Record<OuterBodyId, HTMLButtonElement>>
export function OuterLabelProjector({ enabled, elements }: { enabled: boolean; elements: RefObject<OuterLabelElements> }) {
  const { camera, scene, size, invalidate } = useThree()
  const projected = useRef(new Vector3())
  const world = useRef(new Vector3())
  useEffect(() => { invalidate() }, [enabled, invalidate])
  useFrame(() => {
    for (const element of Object.values(elements.current)) if (element) element.style.visibility = 'hidden'
    if (!enabled || !(camera instanceof PerspectiveCamera)) return
    const alpha = kuiperOpacity(camera.position.length())
    if (alpha < 0.05) return
    const candidates: LabelCandidate[] = []
    const obstacles: LabelObstacle[] = []
    for (const id of outerBodyIds) {
      const object = scene.getObjectByName(id)
      const element = elements.current[id]
      if (!object || !element) continue
      object.getWorldPosition(world.current)
      projected.current.copy(world.current).project(camera)
      if (projected.current.z < -1 || projected.current.z > 1) continue
      const pixels = bodyDisplay[id].radius / camera.position.distanceTo(world.current) * size.height / (2 * Math.tan(camera.fov * Math.PI / 360))
      if (pixels < 0.5) continue
      const x = (projected.current.x + 1) * size.width / 2
      const y = (1 - projected.current.y) * size.height / 2
      obstacles.push({ x, y, radius: pixels })
      candidates.push({ id, x: x + pixels + 8, y: y - 12, width: element.offsetWidth, height: element.offsetHeight })
    }
    for (const label of layoutLabels(candidates, size.width, size.height, 4, obstacles)) {
      const element = elements.current[label.id as OuterBodyId]
      if (element) { element.style.transform = `translate(${label.x}px, ${label.y}px)`; element.style.opacity = String(alpha); element.style.visibility = 'visible' }
    }
  })
  return null
}
