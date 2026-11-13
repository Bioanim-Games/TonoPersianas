import { useSearchParams } from 'react-router'
import { ContactInfoPanel } from '@/components/contact/ContactInfoPanel'
import { LiveChatBox } from '@/components/contact/LiveChatBox'
import { LocationMapCard } from '@/components/contact/LocationMapCard'
import { useTranslation } from '@/i18n'

export function ContactPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const selectedProductSlug = searchParams.get('producto')

  return (
    <main className="min-h-svh w-full bg-[#1C1815] bg-gradient-to-b from-stone-950 via-[#1E1916] to-[#171311] pt-32 pb-20 text-stone-100 sm:pt-36">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        {/* Warm Espresso Contact Header */}
        <header className="mb-10 max-w-3xl text-left">
          <span className="inline-block rounded-full border border-[#D6C3A5]/35 bg-stone-900/75 px-4 py-1 text-[11px] font-semibold tracking-[0.24em] text-[#E8DAC2] uppercase">
            {t.contactPage.eyebrow}
          </span>
          <h1 className="font-heading mt-4 text-4xl font-normal tracking-tight text-stone-50 sm:text-5xl">
            {t.contactPage.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-stone-300/85 sm:text-lg">
            {t.contactPage.subtitle}
          </p>
        </header>

        {/* Two-Column Studio Layout aligned at top so Chat Box hugs its bottom button cleanly */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="flex flex-col gap-8 lg:col-span-6">
            <ContactInfoPanel />
            <LocationMapCard />
          </div>

          <div className="lg:col-span-6">
            <LiveChatBox selectedProductSlug={selectedProductSlug} />
          </div>
        </div>
      </div>
    </main>
  )
}
