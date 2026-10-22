import type { ja } from './ja'

// Preserve keys and tuple lengths while widening translated text to string.
type TranslationShape<T> = T extends string ? string : { [K in keyof T]: TranslationShape<T[K]> }
export type Messages = TranslationShape<typeof ja>
export type Locale = 'ja' | 'zh' | 'en'
export const defaultLocale: Locale = 'ja'
export const localeTags: Record<Locale, string> = { ja: 'ja-JP', zh: 'zh-CN', en: 'en-US' }
export function resolveLocale(value: string | null): Locale {
  return value === 'ja' || value === 'zh' || value === 'en' ? value : defaultLocale
}
