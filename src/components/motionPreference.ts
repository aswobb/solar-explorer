type MotionMedia = Pick<MediaQueryList, 'matches' | 'addEventListener' | 'removeEventListener'>
export function motionPreference(media: MotionMedia) {
  return {
    snapshot: () => media.matches,
    subscribe(notify: () => void) {
      media.addEventListener('change', notify)
      return () => media.removeEventListener('change', notify)
    },
  }
}
