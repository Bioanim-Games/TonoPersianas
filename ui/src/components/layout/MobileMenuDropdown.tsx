import { cn } from 'cn'
import { ArrowUpRight } from 'lucide-react'
import { NavLink } from 'react-router'
import { useTranslation } from '@/i18n'
import { NAV_ITEMS } from '@/types/navigation'

export interface MobileMenuDropdownProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenuDropdown({
  isOpen,
  onClose,
}: MobileMenuDropdownProps) {
  const { t } = useTranslation()

  return (
    <div
      id="mobile-navigation-menu"
      aria-hidden={!isOpen}
      className={cn(
        'mx-auto grid max-w-7xl transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden',
        isOpen
          ? 'mt-2.5 grid-rows-[1fr] translate-y-0 opacity-100'
          : 'pointer-events-none mt-0 grid-rows-[0fr] -translate-y-2 opacity-0',
      )}
    >
      <div className="overflow-hidden">
        <div
          className={cn(
            'rounded-3xl border p-4 backdrop-blur-2xl transition-colors duration-300',
            'border-[#D5C7B2]/90 bg-[#FAF6EE]/95 shadow-[0_24px_48px_rgba(28,24,21,0.16)]',
            'dark:border-[#D6C3A5]/25 dark:bg-[#1C1815]/95 dark:shadow-[0_24px_50px_rgba(0,0,0,0.68)]',
          )}
        >
          {/* Architectural Section Eyebrow */}
          <div className="mb-2.5 flex items-center justify-between px-3 pt-1">
            <span className="text-[10px] font-semibold tracking-[0.28em] text-[#8C6A3E] uppercase dark:text-[#D6C3A5]/80">
              {t.mobileMenu.sectionTitle}
            </span>
            <span
              aria-hidden="true"
              className="h-px flex-1 ml-3 bg-gradient-to-r from-[#D5C7B2]/80 to-transparent dark:from-[#D6C3A5]/25"
            />
          </div>

          {/* Collapsible Navigation Links */}
          <nav aria-label={t.mobileMenu.sectionTitle} className="flex flex-col gap-2">
            {NAV_ITEMS.map((item, idx) => {
              const stepNumber = `0${idx + 1}`
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  end={item.path === '/'}
                  tabIndex={isOpen ? 0 : -1}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'group relative flex items-center justify-between rounded-2xl border px-4 py-3.5 transition-all duration-200 select-none',
                      isActive
                        ? 'border-[#9E7B4F]/65 bg-stone-900 text-[#F6EFE4] shadow-[0_10px_24px_rgba(28,24,21,0.18)] dark:border-[#D6C3A5]/55 dark:bg-stone-900/90 dark:text-stone-50 dark:shadow-[0_10px_28px_rgba(0,0,0,0.45)]'
                        : 'border-[#E2D6C3]/80 bg-[#FCF9F4]/85 text-stone-800 hover:border-[#9E7B4F]/60 hover:bg-white hover:text-stone-950 dark:border-stone-800/80 dark:bg-[#25201C]/75 dark:text-stone-200 dark:hover:border-[#D6C3A5]/40 dark:hover:bg-stone-900/75 dark:hover:text-stone-50',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="flex items-center gap-3.5">
                        <span
                          className={cn(
                            'font-mono text-[11px] tracking-widest transition-colors',
                            isActive
                              ? 'text-[#D6C3A5]'
                              : 'text-[#8C6A3E] dark:text-[#D6C3A5]/70',
                          )}
                        >
                          {stepNumber}
                        </span>
                        <span className="text-xs font-semibold tracking-[0.22em] uppercase">
                          {t.nav[item.id]}
                        </span>
                      </span>

                      <span className="flex items-center gap-2.5">
                        {isActive && (
                          <span
                            aria-hidden="true"
                            className="h-1.5 w-1.5 rounded-full bg-[#D6C3A5] shadow-[0_0_8px_#D6C3A5]"
                          />
                        )}
                        <ArrowUpRight
                          aria-hidden="true"
                          className={cn(
                            'size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
                            isActive
                              ? 'text-[#D6C3A5]'
                              : 'text-stone-400 group-hover:text-[#8C6A3E] dark:text-stone-500 dark:group-hover:text-[#D6C3A5]',
                          )}
                        />
                      </span>
                    </>
                  )}
                </NavLink>
              )
            })}
          </nav>

          {/* Subtle Editorial Tagline Footer */}
          <div className="mt-3.5 flex items-center justify-between border-t border-[#E2D6C3]/80 px-3 pt-3 text-[11px] text-stone-600 dark:border-stone-800/80 dark:text-stone-400">
            <span className="font-heading italic">{t.brand.tagline}</span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#8C6A3E] uppercase dark:text-[#D6C3A5]">
              {t.brand.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
