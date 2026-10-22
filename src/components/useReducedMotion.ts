import { useSyncExternalStore } from 'react'
import { motionPreference } from './motionPreference'

const query = '(prefers-reduced-motion: reduce)'
const snapshot = () => window.matchMedia(query).matches
const subscribe = (notify: () => void) => {
  return motionPreference(window.matchMedia(query)).subscribe(notify)
}
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, snapshot, () => false)
}
