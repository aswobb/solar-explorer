import { useRef, useEffect, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, Vector3 } from 'three'
import { moons } from '../data/bodies'
import type { MoonId, SatelliteSystemId } from '../data/types'
import { bodyDisplay, bodyVisualRadius } from './displayConfig'
import { systemVisualRadius } from './satelliteSystems'
import { qualitySettings, type Quality } from './quality'
import { layoutLabels, type LabelCandidate, type LabelObstacle } from './labelLayout'
export type SatelliteLabelElements = Partial<Record<MoonId, HTMLButtonElement>>
/** Updates native DOM buttons without React state updates or GPU text meshes. */
export function SatelliteLabelProjector({ center, enabled, elements, quality }: {
  center: SatelliteSystemId | null; enabled: boolean; elements: RefObject<SatelliteLabelElements>; quality: Quality
}) {
  const { scene, camera, size, invalidate } = useThree()
  useEffect(() => { invalidate() }, [enabled, center, quality, invalidate])
  const vectors = useRef({ parent: new Vector3(), position: new Vector3(), projected: new Vector3(), ray: new Vector3(), toParent: new Vector3() })
  useFrame(() => {
    for (const element of Object.values(elements.current)) if (element) element.style.visibility = 'hidden'
    if (!enabled || !center || !(camera instanceof PerspectiveCamera)) return
    const parent = scene.getObjectByName(center)
    if (!parent) return
    const v = vectors.current
    parent.getWorldPosition(v.parent)
    if (camera.position.distanceTo(v.parent) > systemVisualRadius(center) * 14) return
    v.toParent.copy(v.parent).sub(camera.position)
    const candidates: LabelCandidate[] = []
    const projectionScale = size.height / (2 * Math.tan(camera.fov * Math.PI / 360))
    v.projected.copy(v.parent).project(camera)
    const obstacles: LabelObstacle[] = [{ x: (v.projected.x + 1) * size.width / 2, y: (1 - v.projected.y) * size.height / 2, radius: bodyVisualRadius(center) / camera.position.distanceTo(v.parent) * projectionScale }]
    for (const moon of moons.filter(moon => moon.orbit.center === center)) {
      const element = elements.current[moon.id]
      const object = scene.getObjectByName(moon.id)
      if (!element || !object) continue
      object.getWorldPosition(v.position)
      v.ray.copy(v.position).sub(camera.position)
      const distance = v.ray.length()
      v.ray.normalize()
      const along = v.toParent.dot(v.ray)
      const acrossSquared = v.toParent.lengthSq() - along * along
      if (along > 0 && along < distance && acrossSquared < bodyDisplay[center].radius ** 2) continue
      const pixelRadius = bodyDisplay[moon.id].radius / distance * projectionScale
      v.projected.copy(v.position).project(camera)
      if (v.projected.z < -1 || v.projected.z > 1) continue
      obstacles.push({ x: (v.projected.x + 1) * size.width / 2, y: (1 - v.projected.y) * size.height / 2, radius: pixelRadius })
      if (pixelRadius < 2) continue
      candidates.push({ id: moon.id, x: (v.projected.x + 1) * size.width / 2 + pixelRadius + 8, y: (1 - v.projected.y) * size.height / 2 - 12, width: element.offsetWidth, height: element.offsetHeight })
    }
    for (const label of layoutLabels(candidates, size.width, size.height, qualitySettings[quality].labelLimit, obstacles)) {
      const element = elements.current[label.id as MoonId]
      if (element) { element.style.transform = `translate(${label.x}px, ${label.y}px)`; element.style.visibility = 'visible' }
    }
  })
  return null
}
