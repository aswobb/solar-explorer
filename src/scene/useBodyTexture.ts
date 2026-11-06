import { useEffect, useState } from 'react'
import { useThree } from '@react-three/fiber'
import { NoColorSpace, SRGBColorSpace, TextureLoader, type Texture } from 'three'
import { textureFiles, earthTextureFiles, ringTextureFiles, type TextureKey, type TextureStatus } from './textureAssets'
import { textureRequest } from './textureRequest'
const allTextureFiles = { ...textureFiles, ...earthTextureFiles, ...ringTextureFiles }
export function useBodyTexture(id: TextureKey, enabled: boolean, onStatus: (id: TextureKey, status: TextureStatus) => void) {
  const [texture, setTexture] = useState<Texture | null>(null)
  const invalidate = useThree(state => state.invalidate)
  const gl = useThree(state => state.gl)
  useEffect(() => {
    setTexture(null)
    if (!enabled || !allTextureFiles[id]) { onStatus(id, 'off'); invalidate(); return }
    onStatus(id, 'loading')
    const forceFailure = import.meta.env.DEV && new URLSearchParams(location.search).get('textureFailure') === id
    const url = `${import.meta.env.BASE_URL}textures/${forceFailure ? 'missing-texture.jpg' : allTextureFiles[id]}`
    const request = textureRequest<Texture>(
      (ready, failed) => new TextureLoader().load(url, ready, undefined, failed),
      loaded => {
        loaded.colorSpace = id === 'earth-clouds' ? NoColorSpace : SRGBColorSpace
        loaded.anisotropy = Math.min(4, gl.capabilities.getMaxAnisotropy())
        setTexture(loaded); onStatus(id, 'ready'); invalidate()
      },
      () => { setTexture(null); onStatus(id, 'failed'); invalidate() },
    )
    const timer = window.setTimeout(() => request.timeout(), 15000)
    return () => { window.clearTimeout(timer); request.cancel() }
  }, [id, enabled, gl, invalidate, onStatus])
  return enabled ? texture : null
}
