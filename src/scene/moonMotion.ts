/** Keep the same local +X meridian facing Earth in the un-tilted display frame.
 * Three.js positive Y rotation maps +X toward -Z, opposite to orbitPosition's angle.
 */
export function lockedMoonSpin(orbitAngle: number): number {
  return Math.PI - orbitAngle
}
