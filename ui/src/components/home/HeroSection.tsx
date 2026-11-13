import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router'
import { useTranslation } from '@/i18n'

export function HeroSection() {
  const { t } = useTranslation()

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-6 pt-36 pb-12 sm:px-10 sm:pt-40 lg:px-12">
      <div className="max-w-2xl text-left">
        {/* Eyebrow Pill */}
        <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[#9E7B4F]/45 bg-[#FAF6EE]/85 px-4 py-1.5 shadow-sm backdrop-blur-md dark:border-[#D6C3A5]/35 dark:bg-stone-950/50">
          <Sparkles
            className="size-3.5 text-[#8C6A3E] dark:text-[#D6C3A5]"
            aria-hidden="true"
          />
          <span className="text-[11px] font-medium tracking-[0.26em] text-stone-800 uppercase dark:text-[#E8DAC2]">
            {t.hero.eyebrow}
          </span>
        </div>

        {/* Editorial Serif Headline */}
        <h1 className="font-heading text-4xl leading-[1.1] font-normal tracking-tight text-stone-950 [text-shadow:0_1px_2px_rgba(250,246,238,1),0_0_16px_rgba(250,246,238,0.95),0_0_30px_rgba(245,240,230,0.9)] sm:text-6xl lg:text-7xl dark:text-stone-50 dark:[text-shadow:none] dark:drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)] max-md:dark:[text-shadow:0_2px_12px_rgba(0,0,0,0.9),0_0_24px_rgba(0,0,0,0.75)]">
          <span className="block">{t.hero.titleLine1}</span>
          <span className="mt-1 block italic text-[#634520] dark:text-[#E8DAC2]">
            {t.hero.titleAccent}
          </span>
        </h1>

        {/* Brand Description */}
        <p className="mt-6 max-w-xl text-base leading-relaxed font-light text-stone-950 [text-shadow:0_1px_2px_rgba(250,246,238,1),0_0_12px_rgba(250,246,238,0.98),0_0_24px_rgba(250,246,238,0.92)] sm:text-lg dark:text-stone-200/90 dark:[text-shadow:none] dark:drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] max-md:dark:text-stone-100 max-md:dark:[text-shadow:0_2px_10px_rgba(0,0,0,0.9),0_0_20px_rgba(0,0,0,0.8)]">
          {t.hero.description}
        </p>

        {/* Primary & Secondary Call-To-Action Links */}
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Link
            to="/productos"
            className="group inline-flex items-center gap-3 rounded-full bg-stone-900 px-7 py-3.5 text-xs font-semibold tracking-[0.2em] text-[#F5EFE6] uppercase shadow-[0_10px_28px_rgba(28,24,21,0.22)] transition-all duration-300 hover:bg-stone-800 dark:bg-[#E8DAC2] dark:text-stone-950 dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] dark:hover:bg-[#F3E9D7]"
          >
            <span>{t.hero.primaryCta}</span>
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>

          <Link
            to="/contacto"
            className="inline-flex items-center gap-2.5 rounded-full border border-stone-400/70 bg-[#FAF6EE]/85 px-7 py-3.5 text-xs font-medium tracking-[0.2em] text-stone-900 uppercase shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[#8C6A3E] hover:bg-white dark:border-stone-200/30 dark:bg-stone-950/45 dark:text-stone-100 dark:hover:border-[#D6C3A5]/60 dark:hover:bg-stone-900/70"
          >
            <span>{t.hero.secondaryCta}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
