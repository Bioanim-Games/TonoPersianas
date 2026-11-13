import { cn } from 'cn'
import { NavLink } from 'react-router'
import type { NavRouteId } from '@/types/navigation'

export interface NavButtonProps {
  id: NavRouteId
  label: string
  path: string
}

export function NavButton({ id, label, path }: NavButtonProps) {
  return (
    <NavLink
      to={path}
      end={path === '/'}
      data-route-id={id}
      className={({ isActive }) =>
        cn(
          'group relative inline-flex items-center justify-center overflow-hidden rounded-full px-5 py-2.5 sm:px-6',
          'text-xs font-medium tracking-[0.22em] uppercase transition-all duration-300 select-none',
          'backdrop-blur-md focus-visible:ring-2 focus-visible:ring-[#D6C3A5]/60 focus-visible:outline-none',
          isActive
            ? 'border border-[#9E7B4F]/60 bg-stone-900 text-[#F6EFE4] shadow-[0_6px_20px_rgba(28,24,21,0.18)] dark:border-[#D6C3A5]/55 dark:bg-stone-900/85 dark:text-stone-50 dark:shadow-[0_8px_28px_rgba(0,0,0,0.35)]'
            : 'border border-stone-400/45 bg-white/70 text-stone-800 hover:border-[#9E7B4F]/60 hover:bg-white hover:text-stone-950 dark:border-stone-200/20 dark:bg-stone-950/35 dark:text-stone-200/85 dark:hover:border-[#D6C3A5]/40 dark:hover:bg-stone-900/60 dark:hover:text-stone-50',
        )
      }
    >
      {({ isActive }) => (
        <>
          <span className="relative z-10">{label}</span>

          {/* Architectural Underline Pill Champagne Indicator */}
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute bottom-1.5 left-1/2 h-[2px] w-7 -translate-x-1/2 rounded-full bg-[#D6C3A5] transition-all duration-300 ease-out',
              isActive
                ? 'w-9 scale-x-100 opacity-100 shadow-[0_0_10px_#D6C3A5]'
                : 'scale-x-0 bg-[#9E7B4F] opacity-0 group-hover:scale-x-100 group-hover:opacity-85 dark:bg-[#D6C3A5]',
            )}
          />
        </>
      )}
    </NavLink>
  )
}
