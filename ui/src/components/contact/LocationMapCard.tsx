import { MapPin, Navigation, WifiOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { ContactInfoData } from '@/config/contactConfig'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'
import { useTranslation } from '@/i18n'

export interface LocationMapCardProps {
  contactInfo: ContactInfoData
}

export function LocationMapCard({ contactInfo }: LocationMapCardProps) {
  const { t } = useTranslation()
  const { isOnline, isOffline } = useNetworkStatus()
  const [reloadKey, setReloadKey] = useState(0)
  const config = contactInfo

  useEffect(() => {
    if (isOnline) {
      setReloadKey((prev) => prev + 1)
    }
  }, [isOnline])

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

      {/* Embedded Interactive Google Map Centered on Toño Persianas (Theme-Adaptive + Auto-Reload on Reconnect) */}
      <div className="h-72 w-full border-t border-[#E5DAC8] bg-stone-200 sm:h-80 dark:border-stone-800 dark:bg-stone-900">
        {isOffline ? (
          <div
            role="status"
            aria-live="polite"
            className="flex h-full w-full flex-col items-center justify-center gap-2.5 bg-gradient-to-b from-[#332B24] via-[#27211C] to-[#1D1814] px-6 text-center dark:from-stone-900 dark:via-[#1E1916] dark:to-stone-950"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D6C3A5]/35 bg-stone-950/60 shadow-inner">
              <WifiOff
                className="size-5 text-[#D6C3A5]"
                aria-hidden="true"
              />
            </span>
            <span className="text-[11px] font-medium tracking-[0.18em] text-[#E8DAC2]/85 uppercase">
              {t.contactPage.mapOfflineLabel}
            </span>
          </div>
        ) : (
          <iframe
            key={reloadKey}
            title={t.contactPage.mapTitle}
            src={config.googleMapsEmbedUrl}
            className="h-full w-full border-0 transition-[filter] duration-500 [filter:sepia(8%)_contrast(98%)] dark:[filter:invert(92%)_hue-rotate(180deg)_brightness(92%)_contrast(90%)_sepia(14%)]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        )}
      </div>
    </section>
  )
}
