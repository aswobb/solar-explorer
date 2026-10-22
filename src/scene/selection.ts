/** Distinguishes taps from drags/pinches without interfering with OrbitControls. */
export class SelectionGesture {
  private pointers = new Map<number, { x: number; y: number }>()
  private blocked = true
  readonly threshold = 4
  down(id: number, x: number, y: number, button: number) {
    if (this.pointers.size === 0) this.blocked = button !== 0
    if (this.pointers.size > 0) this.blocked = true
    this.pointers.set(id, { x, y })
  }
  move(id: number, x: number, y: number) {
    const start = this.pointers.get(id)
    if (start && Math.hypot(x - start.x, y - start.y) > this.threshold) this.blocked = true
  }
  up(id: number, x: number, y: number) {
    this.move(id, x, y)
    this.pointers.delete(id)
  }
  cancel(id: number) { this.pointers.delete(id); this.blocked = true }
  allows(delta: number, button: number) {
    return !this.blocked && this.pointers.size === 0 && button === 0 && Number.isFinite(delta) && delta >= 0 && delta <= this.threshold
  }
}
