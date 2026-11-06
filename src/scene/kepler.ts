/** Elliptic two-body demonstration; angles in radians, independent of calendar epochs. */
export interface Ellipse { a: number; e: number; inclination: number; node: number; periapsis: number; phase: number; direction: 1 | -1; period: number }
const tau = Math.PI * 2
export function solveKepler(mean: number, e: number): number {
  if (!Number.isFinite(mean) || !Number.isFinite(e) || e < 0 || e >= 1) throw new RangeError('Invalid elliptic orbit')
  const m = ((mean + Math.PI) % tau + tau) % tau - Math.PI
  let low = -Math.PI, high = Math.PI, x = e < 0.8 ? m : (m < 0 ? -Math.PI : Math.PI)
  for (let n = 0; n < 80; n++) {
    const f = x - e * Math.sin(x) - m
    if (Math.abs(f) < 1e-13) return x
    if (f > 0) high = x; else low = x
    const next = x - f / (1 - e * Math.cos(x))
    x = next > low && next < high ? next : (low + high) / 2
  }
  return x
}
export function ellipsePoint(orbit: Ellipse, eccentric: number): [number, number, number] {
  if (!(orbit.a > 0) || !Number.isFinite(orbit.a) || orbit.e < 0 || orbit.e >= 1 || ![orbit.inclination, orbit.node, orbit.periapsis, eccentric].every(Number.isFinite)) throw new RangeError('Invalid ellipse')
  const x = orbit.a * (Math.cos(eccentric) - orbit.e), z = -orbit.a * Math.sqrt(1-orbit.e**2) * Math.sin(eccentric)
  const px = x*Math.cos(orbit.periapsis)-z*Math.sin(orbit.periapsis), pz=x*Math.sin(orbit.periapsis)+z*Math.cos(orbit.periapsis)
  const y=pz*Math.sin(orbit.inclination), iz=pz*Math.cos(orbit.inclination)
  return [px*Math.cos(orbit.node)-iz*Math.sin(orbit.node), y, px*Math.sin(orbit.node)+iz*Math.cos(orbit.node)]
}
export function eccentricAt(orbit: Ellipse, seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0 || !(orbit.period > 0) || !Number.isFinite(orbit.period) || !Number.isFinite(orbit.phase) || ![1,-1].includes(orbit.direction)) throw new RangeError('Invalid orbit time')
  return solveKepler(orbit.phase + orbit.direction * seconds / orbit.period * tau, orbit.e)
}
export function ellipseAt(orbit: Ellipse, seconds: number) { return ellipsePoint(orbit, eccentricAt(orbit, seconds)) }
export function ellipsePath(orbit: Ellipse, segments: number) {
  if (!Number.isInteger(segments) || segments < 3) throw new RangeError('Invalid segment count')
  return new Float32Array(Array.from({length:segments}, (_,i)=>ellipsePoint(orbit,i/segments*tau)).flat())
}
export function apsisTime(orbit: Ellipse, apsis: 'perihelion' | 'aphelion') {
  const phase = apsis === 'perihelion' ? 0 : Math.PI
  return (((phase - orbit.phase) / orbit.direction % tau + tau) % tau) / tau * orbit.period
}
