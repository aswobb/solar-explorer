export interface LabelCandidate {
  id: string; x: number; y: number; width: number; height: number
}
export interface LabelObstacle { x: number; y: number; radius: number }
/** Stable catalog order; reject overlapping labels, covered bodies and clipped labels. */
export function layoutLabels(candidates: readonly LabelCandidate[], width: number, height: number, limit: number, obstacles: readonly LabelObstacle[] = []) {
  const visible: LabelCandidate[] = []
  for (const label of candidates) {
    if (visible.length >= limit) break
    if (label.x < 8 || label.y < 8 || label.x + label.width > width - 8 || label.y + label.height > height - 8) continue
    if (visible.some(other => label.x < other.x + other.width + 8 && label.x + label.width + 8 > other.x && label.y < other.y + other.height + 8 && label.y + label.height + 8 > other.y)) continue
    if (obstacles.some(body => {
      const x = Math.max(label.x, Math.min(body.x, label.x + label.width))
      const y = Math.max(label.y, Math.min(body.y, label.y + label.height))
      return (x - body.x) ** 2 + (y - body.y) ** 2 < (body.radius + 4) ** 2
    })) continue
    visible.push(label)
  }
  return visible
}
