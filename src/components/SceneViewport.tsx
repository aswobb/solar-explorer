import type { BodyId } from '../data/types'
import { Component, lazy, Suspense, useCallback, useEffect, useState, type ReactNode } from 'react'
import { useLocale } from '../locales/LocaleProvider'

const BasicScene = lazy(() => import('../scene/BasicScene'))

type Preview = 'loading' | 'error' | 'unsupported' | null

function getPreview(): Preview {
  // Deliberate failure injection is excluded from the production build.
  if (!import.meta.env.DEV) return null
  const value = new URLSearchParams(window.location.search).get('preview')
  return value === 'loading' || value === 'error' || value === 'unsupported' ? value : null
}

export function SceneStatus({ kind, onRetry }: {
  kind: 'loading' | 'error' | 'unsupported'
  onRetry?: () => void
}) {
  const { messages: t } = useLocale()
  const title = t[kind]
  const body = t[`${kind}Body`]
  return (
    <div className="scene-status" role={kind === 'error' ? 'alert' : 'status'} aria-live="polite" aria-busy={kind === 'loading'}>
      <span className={`status-symbol ${kind === 'loading' ? 'is-loading' : ''}`} aria-hidden="true">{kind === 'loading' ? '' : '!'}</span>
      <h2>{title}</h2>
      <p>{body}</p>
      {onRetry && <button className="retry-button" onClick={onRetry}>{t.retry}<span aria-hidden="true"> ↻</span></button>}
    </div>
  )
}

class SceneErrorBoundary extends Component<{ children: ReactNode; onRetry: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    return this.state.failed ? <SceneStatus kind="error" onRetry={this.props.onRetry} /> : this.props.children
  }
}

function SceneContent({ preview, onRetry, onSelectionChange }: { preview: Preview; onRetry: () => void; onSelectionChange: (id: BodyId | null) => void }) {
  const { messages: t } = useLocale()
  const [failed, setFailed] = useState(false)
  const fail = useCallback(() => setFailed(true), [])
  const [support, setSupport] = useState<'checking' | 'supported' | 'unsupported'>('checking')
  useEffect(() => {
    if (preview) return
    const canvas = document.createElement('canvas')
    let context: WebGL2RenderingContext | null = null
    try {
      context = canvas.getContext('webgl2')
      setSupport(context ? 'supported' : 'unsupported')
    } catch {
      setSupport('unsupported')
    } finally {
      // This probe is not a renderer. Release its temporary GPU context immediately.
      context?.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [preview])

  if (failed) throw new Error('WebGL context lost')
  if (preview === 'error') throw new Error('Development preview: scene render failure')
  if (preview === 'loading' || (!preview && support === 'checking')) return <SceneStatus kind="loading" />
  if (preview === 'unsupported' || support === 'unsupported') return <SceneStatus kind="unsupported" onRetry={onRetry} />
  return (
    <Suspense fallback={<SceneStatus kind="loading" />}>
      <BasicScene onSelectionChange={onSelectionChange} onFailure={fail} loading={<SceneStatus kind="loading" />} fallback={<p>{t.unsupportedBody}</p>} caption={t.sceneCaption} />
    </Suspense>
  )
}

export function SceneViewport({ onSelectionChange }: { onSelectionChange: (id: BodyId | null) => void }) {
  const [preview, setPreview] = useState(getPreview)
  const [attempt, setAttempt] = useState(0)
  const [mounted, setMounted] = useState(true)
  const debug = import.meta.env.DEV && new URLSearchParams(location.search).get('debugScene') === '1'
  function retry() {
    setPreview(null)
    setAttempt(value => value + 1)
  }
  return <>{mounted && <SceneErrorBoundary key={attempt} onRetry={retry}><SceneContent preview={preview} onRetry={retry} onSelectionChange={onSelectionChange} /></SceneErrorBoundary>}{debug && <><button className="scene-debug-toggle" onClick={() => setMounted(value => !value)}>DEV: {mounted ? 'unmount scene' : 'mount scene'}</button><output data-renderer-report className="renderer-report" aria-label="DEV renderer counters" /></>}</>
}
