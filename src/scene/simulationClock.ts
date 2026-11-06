import { simulationStep, type MotionSpeed } from './motion.ts'
export class SimulationClock {
  seconds = 0
  private primed = false
  private wasRunning = false
  setTime(seconds: number) {
    if (!Number.isFinite(seconds) || seconds < 0) throw new RangeError('Invalid simulation time')
    this.seconds = seconds
    this.primed = false
  }
  advance(delta: number, speed: MotionSpeed, running: boolean) {
    if (!running) { this.wasRunning = false; return this.seconds }
    if (!this.wasRunning || !this.primed) {
      this.wasRunning = true
      this.primed = true
      return this.seconds
    }
    this.seconds += simulationStep(delta, speed, true)
    return this.seconds
  }
}
