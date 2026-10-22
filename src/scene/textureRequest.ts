/** Own one asynchronous resource. Late completions cannot resurrect a released texture. */
export function textureRequest<T extends { dispose(): void }>(
  load: (ready: (resource: T) => void, failed: () => void) => T,
  ready: (resource: T) => void,
  failed: () => void,
) {
  let active = true
  let settled = false
  let disposed = false
  let failedLoad = false
  let resource: T | undefined
  const dispose = () => { if (!disposed && resource) { disposed = true; resource.dispose() } }
  resource = load(value => {
    if (!active || settled) return
    settled = true
    ready(value)
  }, () => {
    if (!active || settled) return
    settled = true
    failedLoad = true
    dispose()
    failed()
  })
  if (failedLoad) dispose()
  return {
    cancel() { active = false; dispose() },
    timeout() { if (active && !settled) { settled = true; dispose(); failed() } },
  }
}
