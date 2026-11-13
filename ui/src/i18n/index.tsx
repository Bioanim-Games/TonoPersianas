import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { es } from '@/i18n/locales/es'
import type { Locale, TranslationDictionary } from '@/i18n/types'

const dictionaries: Record<Locale, TranslationDictionary> = {
  es,
  // Ready for future English localization without changing components
  en: es,
}

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: TranslationDictionary
}

const I18nContext = createContext<I18nContextValue | null>(null)

export interface I18nProviderProps {
  defaultLocale?: Locale
  children: ReactNode
}

export function I18nProvider({
  defaultLocale = 'es',
  children,
}: I18nProviderProps) {
  const [locale, setLocale] = useState<Locale>(defaultLocale)

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t: dictionaries[locale],
    }),
    [locale],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useTranslation(): I18nContextValue {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider')
  }
  return context
}
