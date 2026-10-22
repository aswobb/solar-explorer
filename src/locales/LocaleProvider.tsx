import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { ja } from './ja'
import { zh } from './zh'
import { en } from './en'
import { defaultLocale, localeTags, resolveLocale, type Locale, type Messages } from './types'

const dictionaries: Record<Locale, Messages> = { ja, zh, en }
const storageKey = 'solar-explorer.locale'
function readPreference(): Locale {
  try { return resolveLocale(localStorage.getItem(storageKey)) } catch { return defaultLocale }
}
const LocaleContext = createContext<{ locale: Locale; messages: Messages; setLocale: (locale: Locale) => void } | null>(null)
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(readPreference)
  useEffect(() => {
    document.documentElement.lang = localeTags[locale]
    document.querySelector('meta[name="description"]')?.setAttribute('content', dictionaries[locale].description)
    try { localStorage.setItem(storageKey, locale) } catch { /* Storage may be disabled; switching still works. */ }
  }, [locale])
  return <LocaleContext.Provider value={{ locale, messages: dictionaries[locale], setLocale }}>{children}</LocaleContext.Provider>
}
export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) throw new Error('useLocale requires LocaleProvider')
  return context
}
