import { CheckCircle2, Ruler, SunMedium } from 'lucide-react'
import { useTranslation } from '@/i18n'
import type { FeatureHighlightItem } from '@/i18n/types'

function getHighlightIcon(id: FeatureHighlightItem['id']) {
  const iconClass = 'size-4 text-[#8C6A3E] dark:text-[#D6C3A5]'
  switch (id) {
    case 'bespoke':
      return <Ruler className={iconClass} aria-hidden="true" />
    case 'light-control':
      return <SunMedium className={iconClass} aria-hidden="true" />
    case 'installation':
      return <CheckCircle2 className={iconClass} aria-hidden="true" />
  }
}

export function FeatureHighlights() {
  const { t } = useTranslation()

  return (
    <section
      aria-label={t.brand.tagline}
      className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-8 sm:px-10 lg:px-12"
    >
      <div className="grid grid-cols-1 gap-4 rounded-2xl border border-[#D5C7B2]/85 bg-[#FAF6EE]/85 p-5 shadow-[0_14px_36px_rgba(28,24,21,0.12)] backdrop-blur-xl md:grid-cols-3 md:gap-6 md:p-6 dark:border-stone-200/15 dark:bg-stone-950/55 dark:shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
        {t.highlights.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3.5 border-stone-300/80 md:not-first:border-l md:not-first:pl-6 dark:border-stone-200/10"
          >
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#9E7B4F]/40 bg-[#EFE8DC] dark:border-[#D6C3A5]/30 dark:bg-stone-900/80">
              {getHighlightIcon(item.id)}
            </div>
            <div className="text-left">
              <h2 className="font-heading text-base font-medium tracking-wide text-stone-900 dark:text-stone-100">
                {item.title}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-stone-700 sm:text-sm dark:text-stone-300/80">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
