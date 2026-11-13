import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { ContactInfoPanel } from '@/components/contact/ContactInfoPanel'
import { LiveChatBox } from '@/components/contact/LiveChatBox'
import { LocationMapCard } from '@/components/contact/LocationMapCard'
import {
  DEFAULT_CONTACT_CONFIG,
  type ContactInfoData,
} from '@/config/contactConfig'
import { useTranslation } from '@/i18n'
import { fetchContactInfo, getCachedContactInfo } from '@/services/contactApi'

export function ContactPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const selectedProductSlug = searchParams.get('producto')
  const [contactInfo, setContactInfo] = useState<ContactInfoData>(
    () => getCachedContactInfo() ?? DEFAULT_CONTACT_CONFIG,
  )

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    let active = true
    fetchContactInfo().then((data) => {
      if (!active) return
      setContactInfo(data)
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <main className="min-h-svh w-full bg-[#F5F0E6] bg-gradient-to-b from-[#FAF6EE] via-[#F4EFE4] to-[#EDE5D7] pt-32 pb-20 text-stone-900 transition-colors duration-300 sm:pt-36 dark:bg-[#1C1815] dark:from-stone-950 dark:via-[#1E1916] dark:to-[#171311] dark:text-stone-100">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        {/* Dual-Theme Contact Header */}
        <header className="mb-10 max-w-3xl text-left">
          <span className="inline-block rounded-full border border-[#B89768]/45 bg-[#FCF9F4] px-4 py-1 text-[11px] font-semibold tracking-[0.24em] text-[#7A5930] uppercase dark:border-[#D6C3A5]/35 dark:bg-stone-900/75 dark:text-[#E8DAC2]">
            {t.contactPage.eyebrow}
          </span>
          <h1 className="font-heading mt-4 text-4xl font-normal tracking-tight text-stone-900 sm:text-5xl dark:text-stone-50">
            {t.contactPage.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-stone-700 sm:text-lg dark:text-stone-300/85">
            {t.contactPage.subtitle}
          </p>
        </header>

        {/* Two-Column Studio Layout */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="flex flex-col gap-8 lg:col-span-6">
            <ContactInfoPanel contactInfo={contactInfo} />
            <LocationMapCard contactInfo={contactInfo} />
          </div>

          <div className="lg:col-span-6">
            <LiveChatBox
              selectedProductSlug={selectedProductSlug}
              contactInfo={contactInfo}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
