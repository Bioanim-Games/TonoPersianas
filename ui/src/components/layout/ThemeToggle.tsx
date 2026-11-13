import { cn } from 'cn'
import { Moon, Sun } from 'lucide-react'
import { useTranslation } from '@/i18n'
import { useTheme } from '@/theme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const { t } = useTranslation()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={t.theme.toggleAriaLabel}
      title={isDark ? t.theme.darkModeLabel : t.theme.lightModeLabel}
      onClick={toggleTheme}
      className={cn(
        'group relative inline-flex h-10 w-[78px] shrink-0 cursor-pointer items-center justify-between rounded-full p-1 transition-all duration-500 select-none',
        'border border-[#B89768]/50 bg-[#EFE8DC]/90 shadow-[inset_0_2px_6px_rgba(28,24,21,0.08)] backdrop-blur-md',
        'hover:border-[#9E7B4F] focus-visible:ring-2 focus-visible:ring-[#D6C3A5] focus-visible:outline-none',
        'dark:border-[#D6C3A5]/45 dark:bg-stone-950/75 dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.65)] dark:hover:border-[#D6C3A5]',
      )}
    >
      {/* Sliding Architectural Champagne / Espresso Orb */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute top-1 left-1 h-[30px] w-[34px] rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          isDark
            ? 'translate-x-[34px] border border-[#D6C3A5]/65 bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950 shadow-[0_0_16px_rgba(214,195,165,0.45)]'
            : 'translate-x-0 border border-[#C5A880]/70 bg-gradient-to-br from-[#FFFDF9] via-[#F5E9D4] to-[#DFC8A4] shadow-[0_3px_12px_rgba(166,131,84,0.38)]',
        )}
      />

      {/* Daylight Sun Icon */}
      <span className="relative z-10 flex h-[30px] w-[34px] items-center justify-center">
        <Sun
          aria-hidden="true"
          className={cn(
            'size-4 transition-all duration-500 ease-out',
            isDark
              ? 'scale-75 -rotate-90 text-stone-500 group-hover:text-stone-300'
              : 'scale-105 rotate-0 text-[#7A5930] drop-shadow-[0_0_6px_rgba(184,151,104,0.5)]',
          )}
        />
      </span>

      {/* Nocturnal Crescent Moon Icon */}
      <span className="relative z-10 flex h-[30px] w-[34px] items-center justify-center">
        <Moon
          aria-hidden="true"
          className={cn(
            'size-4 transition-all duration-500 ease-out',
            isDark
              ? 'scale-105 rotate-0 text-[#E8DAC2] drop-shadow-[0_0_8px_rgba(214,195,165,0.65)]'
              : 'scale-75 rotate-45 text-stone-500/80 group-hover:text-stone-800',
          )}
        />
      </span>
    </button>
  )
}
