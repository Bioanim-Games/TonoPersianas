import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router'
import { useTranslation } from '@/i18n'

export function HeroSection() {
  const { t } = useTranslation()

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-6 pt-36 pb-12 sm:px-10 sm:pt-40 lg:px-12">
      <div className="max-w-2xl text-left">
        {/* Eyebrow Pill */}
        <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[#D6C3A5]/35 bg-stone-950/50 px-4 py-1.5 backdrop-blur-md">
          <Sparkles className="size-3.5 text-[#D6C3A5]" aria-hidden="true" />
          <span className="text-[11px] font-medium tracking-[0.26em] text-[#E8DAC2] uppercase">
            {t.hero.eyebrow}
          </span>
        </div>

        {/* Editorial Serif Headline */}
        <h1 className="font-heading text-4xl leading-[1.1] font-normal tracking-tight text-stone-50 drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)] sm:text-6xl lg:text-7xl">
          <span className="block">{t.hero.titleLine1}</span>
          <span className="mt-1 block italic text-[#E8DAC2]">
            {t.hero.titleAccent}
          </span>
        </h1>

        {/* Brand Description */}
        <p className="mt-6 max-w-xl text-base leading-relaxed font-light text-stone-200/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] sm:text-lg">
          {t.hero.description}
        </p>

        {/* Primary & Secondary Call-To-Action Links */}
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Link
            to="/productos"
            className="group inline-flex items-center gap-3 rounded-full bg-[#E8DAC2] px-7 py-3.5 text-xs font-semibold tracking-[0.2em] text-stone-950 uppercase shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all duration-300 hover:bg-[#F3E9D7] hover:shadow-[0_14px_34px_rgba(214,195,165,0.28)]"
          >
            <span>{t.hero.primaryCta}</span>
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>

          <Link
            to="/contacto"
            className="inline-flex items-center gap-2.5 rounded-full border border-stone-200/30 bg-stone-950/45 px-7 py-3.5 text-xs font-medium tracking-[0.2em] text-stone-100 uppercase backdrop-blur-md transition-all duration-300 hover:border-[#D6C3A5]/60 hover:bg-stone-900/70"
          >
            <span>{t.hero.secondaryCta}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
