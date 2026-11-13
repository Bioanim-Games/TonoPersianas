import { cn } from 'cn'
import { Link, useLocation } from 'react-router'
import { NavButton } from '@/components/layout/NavButton'
import { useTranslation } from '@/i18n'
import { NAV_ITEMS } from '@/types/navigation'

export function Navbar() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const isHomeHero = pathname === '/'

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-8 sm:pt-6">
      <div
        className={cn(
          'mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 rounded-2xl border px-5 py-3.5 backdrop-blur-xl transition-colors duration-300 sm:flex-row sm:rounded-full sm:px-8 sm:py-3',
          isHomeHero
            ? 'border-stone-200/15 bg-stone-950/45 shadow-[0_12px_40px_rgba(0,0,0,0.35)]'
            : 'border-stone-800/40 bg-stone-950/88 shadow-[0_12px_36px_rgba(28,24,21,0.22)]',
        )}
      >
        {/* Brand Identity */}
        <Link
          to="/"
          aria-label={t.brand.name}
          className="group flex items-center gap-3.5 text-left focus-visible:outline-none"
        >
          {/* Architectural Blind Slats Emblem */}
          <span
            aria-hidden="true"
            className="flex h-9 w-9 flex-col items-center justify-center gap-1 rounded-full border border-[#D6C3A5]/45 bg-stone-900/80 p-2 transition-transform duration-300 group-hover:scale-105"
          >
            <span className="h-[1.5px] w-4 rounded-full bg-[#D6C3A5]" />
            <span className="h-[1.5px] w-3.5 rounded-full bg-stone-200/80" />
            <span className="h-[1.5px] w-4 rounded-full bg-[#D6C3A5]" />
          </span>

          <span className="flex flex-col">
            <span className="font-heading text-xl leading-none font-semibold tracking-[0.14em] text-stone-50 sm:text-2xl">
              {t.brand.monogram}
            </span>
            <span className="mt-1 text-[10px] font-medium tracking-[0.34em] text-[#D6C3A5] uppercase">
              {t.brand.category}
            </span>
          </span>
        </Link>

        {/* Architectural Underline Pill Navigation */}
        <nav
          aria-label={t.brand.name}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
        >
          {NAV_ITEMS.map((item) => (
            <NavButton
              key={item.id}
              id={item.id}
              path={item.path}
              label={t.nav[item.id]}
            />
          ))}
        </nav>
      </div>
    </header>
  )
}
