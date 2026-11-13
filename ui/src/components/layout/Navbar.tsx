import { cn } from 'cn'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { MobileMenuDropdown } from '@/components/layout/MobileMenuDropdown'
import { NavButton } from '@/components/layout/NavButton'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { useTranslation } from '@/i18n'
import { NAV_ITEMS } from '@/types/navigation'

export function Navbar() {
  const { t } = useTranslation()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!isMobileMenuOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        headerRef.current &&
        event.target instanceof Node &&
        !headerRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('pointerdown', handlePointerDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isMobileMenuOpen])

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-8 sm:pt-6"
    >
      <div
        className={cn(
          'mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border px-4 py-2.5 backdrop-blur-xl transition-colors duration-300 sm:px-8 sm:py-3',
          'border-[#D5C7B2]/80 bg-[#FAF6EE]/85 shadow-[0_12px_36px_rgba(28,24,21,0.1)]',
          'dark:border-stone-200/15 dark:bg-stone-950/60 dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)]',
        )}
      >
        {/* Left Side: Mobile 3-Slat Menu Button (Mobile Only) + Brand Identity */}
        <div className="flex items-center gap-3">
          {/* Interactive Architectural Blind Slats Menu Button — Mobile Only */}
          <button
            type="button"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation-menu"
            aria-label={
              isMobileMenuOpen
                ? t.mobileMenu.closeAriaLabel
                : t.mobileMenu.openAriaLabel
            }
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className={cn(
              'group relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-all duration-300 md:hidden',
              'border-[#9E7B4F]/55 bg-stone-900 shadow-sm hover:border-[#D6C3A5] focus-visible:ring-2 focus-visible:ring-[#D6C3A5] focus-visible:outline-none',
              'dark:border-[#D6C3A5]/50 dark:bg-stone-900/85 dark:hover:border-[#D6C3A5]',
              isMobileMenuOpen &&
                'border-[#D6C3A5] ring-2 ring-[#D6C3A5]/35 dark:border-[#D6C3A5]',
            )}
          >
            <span className="relative flex h-3.5 w-4 flex-col items-center justify-between">
              <span
                aria-hidden="true"
                className={cn(
                  'h-[1.5px] w-4 rounded-full bg-[#D6C3A5] transition-all duration-300 ease-out',
                  isMobileMenuOpen && 'translate-y-[6px] rotate-45',
                )}
              />
              <span
                aria-hidden="true"
                className={cn(
                  'h-[1.5px] w-3.5 rounded-full bg-stone-200/85 transition-all duration-200 ease-out',
                  isMobileMenuOpen && 'scale-x-0 opacity-0',
                )}
              />
              <span
                aria-hidden="true"
                className={cn(
                  'h-[1.5px] w-4 rounded-full bg-[#D6C3A5] transition-all duration-300 ease-out',
                  isMobileMenuOpen && '-translate-y-[6.5px] -rotate-45',
                )}
              />
            </span>
          </button>

          {/* Brand Typography Link (Clean on Desktop without left button) */}
          <Link
            to="/"
            aria-label={t.brand.name}
            onClick={() => setIsMobileMenuOpen(false)}
            className="group flex flex-col text-left focus-visible:outline-none"
          >
            <span className="font-heading text-xl leading-none font-semibold tracking-[0.14em] text-stone-900 transition-colors group-hover:text-[#7A5930] sm:text-2xl dark:text-stone-50 dark:group-hover:text-[#E8DAC2]">
              {t.brand.monogram}
            </span>
            <span className="mt-1 text-[10px] font-medium tracking-[0.34em] text-[#8C6A3E] uppercase dark:text-[#D6C3A5]">
              {t.brand.category}
            </span>
          </Link>
        </div>

        {/* Right Side: Desktop Navigation Pills (Desktop Only) + Luxury Sun/Moon Theme Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <nav
            aria-label={t.brand.name}
            className="hidden items-center gap-2.5 md:flex lg:gap-3"
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

          <span
            aria-hidden="true"
            className="hidden h-6 w-px bg-stone-300/80 md:block dark:bg-stone-700/80"
          />

          <ThemeToggle />
        </div>
      </div>

      {/* Collapsible Architectural Mobile Menu Dropdown */}
      <MobileMenuDropdown
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  )
}
