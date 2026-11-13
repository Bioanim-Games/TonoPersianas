import { MapPin, Navigation } from 'lucide-react'
import { DEFAULT_CONTACT_CONFIG } from '@/config/contactConfig'
import { useTranslation } from '@/i18n'

export function LocationMapCard() {
  const { t } = useTranslation()
  const config = DEFAULT_CONTACT_CONFIG

  return (
    <section
      aria-label={t.contactPage.mapTitle}
      className="flex flex-col overflow-hidden rounded-2xl border border-stone-800/90 bg-[#25201C] text-left shadow-[0_14px_35px_rgba(0,0,0,0.35)]"
    >
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-heading flex items-center gap-2 text-2xl font-medium text-stone-100">
              <MapPin className="size-5 text-[#D6C3A5]" aria-hidden="true" />
              <span>{t.contactPage.mapTitle}</span>
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-stone-300/85">
              {t.contactPage.mapSubtitle}
            </p>
          </div>
        </div>

        {/* Direct Google Maps Selection Link */}
        <a
          href={config.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#D6C3A5]/45 bg-stone-900 px-5 py-2.5 text-xs font-semibold tracking-[0.16em] text-[#E8DAC2] uppercase transition-all duration-200 hover:border-[#D6C3A5] hover:bg-[#D6C3A5] hover:text-stone-950"
        >
          <Navigation className="size-3.5" aria-hidden="true" />
          <span>{t.contactPage.openMapsCta}</span>
        </a>
      </div>

      {/* Embedded Interactive Google Map Centered on Toño Persianas (Zapopan, Jalisco) */}
      <div className="h-72 w-full border-t border-stone-800 bg-stone-900 sm:h-80">
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
