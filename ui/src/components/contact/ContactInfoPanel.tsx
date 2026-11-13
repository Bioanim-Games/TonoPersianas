import { ExternalLink, Mail, Phone } from 'lucide-react'
import { DEFAULT_CONTACT_CONFIG } from '@/config/contactConfig'
import { useTranslation } from '@/i18n'

export function ContactInfoPanel() {
  const { t } = useTranslation()
  const config = DEFAULT_CONTACT_CONFIG

  return (
    <section
      aria-label={t.contactPage.directChannelsTitle}
      className="rounded-2xl border border-stone-800/90 bg-[#25201C] p-6 text-left shadow-[0_14px_35px_rgba(0,0,0,0.35)] sm:p-7"
    >
      <h2 className="font-heading text-2xl font-medium text-stone-100">
        {t.contactPage.directChannelsTitle}
      </h2>

      {/* Direct Phone & Email Cards */}
      <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <a
          href={config.phoneHref}
          className="group flex items-start gap-3.5 rounded-xl border border-stone-800 bg-stone-900/70 p-4 transition-all duration-200 hover:border-[#D6C3A5]/50 hover:bg-stone-900"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D6C3A5]/30 bg-stone-950 text-[#D6C3A5]">
            <Phone className="size-4" aria-hidden="true" />
          </span>
          <div>
            <span className="block text-[11px] font-medium tracking-wider text-stone-400 uppercase">
              {t.contactPage.phoneLabel}
            </span>
            <span className="mt-1 block text-sm font-semibold text-stone-100 group-hover:text-[#E8DAC2]">
              {config.displayPhone}
            </span>
          </div>
        </a>

        <a
          href={config.emailHref}
          className="group flex items-start gap-3.5 rounded-xl border border-stone-800 bg-stone-900/70 p-4 transition-all duration-200 hover:border-[#D6C3A5]/50 hover:bg-stone-900"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D6C3A5]/30 bg-stone-950 text-[#D6C3A5]">
            <Mail className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <span className="block text-[11px] font-medium tracking-wider text-stone-400 uppercase">
              {t.contactPage.emailLabel}
            </span>
            <span className="mt-1 block truncate text-sm font-semibold text-stone-100 group-hover:text-[#E8DAC2]">
              {config.email}
            </span>
          </div>
        </a>
      </div>

      {/* Official Social Media Links */}
      <div className="mt-6 border-t border-stone-800 pt-5">
        <h3 className="text-xs font-semibold tracking-[0.2em] text-stone-400 uppercase">
          {t.contactPage.socialTitle}
        </h3>

        <div className="mt-3.5 flex flex-wrap items-center gap-3">
          <a
            href={config.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full border border-stone-700 bg-stone-900/80 px-5 py-2.5 text-xs font-semibold tracking-[0.14em] text-stone-200 uppercase transition-all duration-200 hover:border-[#D6C3A5] hover:bg-[#D6C3A5] hover:text-stone-950"
          >
            <span>{t.contactPage.facebookLabel}</span>
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>

          <a
            href={config.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full border border-stone-700 bg-stone-900/80 px-5 py-2.5 text-xs font-semibold tracking-[0.14em] text-stone-200 uppercase transition-all duration-200 hover:border-[#D6C3A5] hover:bg-[#D6C3A5] hover:text-stone-950"
          >
            <span>{t.contactPage.instagramLabel}</span>
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
