import { cn } from 'cn'
import { useTranslation } from '@/i18n'
import type { CategoryItem } from '@/types/catalog'

export interface CategoryFilterBarProps {
  categories: readonly CategoryItem[]
  selectedSlug: string | null
  onSelectCategory: (slug: string | null) => void
  isLoading?: boolean
}

const SKELETON_PILL_WIDTHS = ['w-56', 'w-52', 'w-56', 'w-52'] as const

export function CategoryFilterBar({
  categories,
  selectedSlug,
  onSelectCategory,
  isLoading = false,
}: CategoryFilterBarProps) {
  const { t } = useTranslation()

  return (
    <div
      role="tablist"
      aria-label={t.productsPage.title}
      className="flex flex-wrap items-center gap-2.5 border-b border-[#D8CBB8] pb-6 dark:border-stone-800/90"
    >
      <button
        type="button"
        role="tab"
        aria-selected={selectedSlug === null}
        onClick={() => onSelectCategory(null)}
        className={cn(
          'rounded-full px-5 py-2.5 text-xs font-medium tracking-[0.18em] uppercase transition-all duration-200',
          selectedSlug === null
            ? 'border border-stone-900 bg-stone-900 text-[#F5EFE6] shadow-md dark:border-[#D6C3A5]/60 dark:bg-[#D6C3A5] dark:text-stone-950'
            : 'border border-[#D5C7B2] bg-[#FCF9F4] text-stone-700 hover:border-[#9E7B4F] hover:bg-white hover:text-stone-950 dark:border-stone-700/80 dark:bg-[#26211D]/90 dark:text-stone-300 dark:hover:border-[#D6C3A5]/45 dark:hover:bg-stone-800 dark:hover:text-stone-100',
        )}
      >
        {t.productsPage.allCategoriesLabel}
      </button>

      {isLoading && categories.length === 0
        ? SKELETON_PILL_WIDTHS.map((widthClass, idx) => (
            <span
              key={`category-skeleton-${idx}`}
              aria-hidden="true"
              className={cn(
                'h-[38px] animate-pulse rounded-full border border-[#D5C7B2]/60 bg-[#ECE2D0] dark:border-stone-800 dark:bg-stone-800/75',
                widthClass,
              )}
            />
          ))
        : categories.map((category) => {
            const isActive = selectedSlug === category.slug
            return (
              <button
                key={category.slug}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectCategory(category.slug)}
                className={cn(
                  'rounded-full px-5 py-2.5 text-xs font-medium tracking-[0.16em] uppercase transition-all duration-200',
                  isActive
                    ? 'border border-stone-900 bg-stone-900 text-[#F5EFE6] shadow-md dark:border-[#D6C3A5]/60 dark:bg-[#D6C3A5] dark:text-stone-950'
                    : 'border border-[#D5C7B2] bg-[#FCF9F4] text-stone-700 hover:border-[#9E7B4F] hover:bg-white hover:text-stone-950 dark:border-stone-700/80 dark:bg-[#26211D]/90 dark:text-stone-300 dark:hover:border-[#D6C3A5]/45 dark:hover:bg-stone-800 dark:hover:text-stone-100',
                )}
              >
                {category.name}
              </button>
            )
          })}
    </div>
  )
}
