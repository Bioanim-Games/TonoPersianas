import { MapPin, Navigation } from 'lucide-react'
import { DEFAULT_CONTACT_CONFIG } from '@/config/contactConfig'
import { useTranslation } from '@/i18n'

export function LocationMapCard() {
  const { t } = useTranslation()
  const config = DEFAULT_CONTACT_CONFIG

  return (
    <section
      aria-label={t.contactPage.mapTitle}
      className="flex flex-col overflow-hidden rounded-2xl border border-[#DFD3C0] bg-[#FCF9F4] text-left shadow-[0_12px_30px_rgba(28,24,21,0.07)] dark:border-stone-800/90 dark:bg-[#25201C] dark:shadow-[0_14px_35px_rgba(0,0,0,0.35)]"
    >
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-heading flex items-center gap-2 text-2xl font-medium text-stone-900 dark:text-stone-100">
              <MapPin
                className="size-5 text-[#8C6A3E] dark:text-[#D6C3A5]"
                aria-hidden="true"
              />
              <span>{t.contactPage.mapTitle}</span>
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-stone-600 dark:text-stone-300/85">
              {t.contactPage.mapSubtitle}
            </p>
          </div>
        </div>

        {/* Direct Google Maps Selection Link */}
        <a
          href={config.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-stone-900 bg-stone-900 px-5 py-2.5 text-xs font-semibold tracking-[0.16em] text-[#F5EFE6] uppercase transition-all duration-200 hover:bg-stone-800 dark:border-[#D6C3A5]/45 dark:text-[#E8DAC2] dark:hover:border-[#D6C3A5] dark:hover:bg-[#D6C3A5] dark:hover:text-stone-950"
        >
          <Navigation className="size-3.5" aria-hidden="true" />
          <span>{t.contactPage.openMapsCta}</span>
        </a>
      </div>

      {/* Embedded Interactive Google Map Centered on Toño Persianas */}
      <div className="h-72 w-full border-t border-[#E5DAC8] bg-stone-200 sm:h-80 dark:border-stone-800 dark:bg-stone-900">
        <iframe
          title={t.contactPage.mapTitle}
          src={config.googleMapsEmbedUrl}
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </section>
  )
}
