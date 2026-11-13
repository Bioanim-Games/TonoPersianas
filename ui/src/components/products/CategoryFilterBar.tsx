import { cn } from 'cn'
import { useTranslation } from '@/i18n'
import type { CategoryItem } from '@/types/catalog'

export interface CategoryFilterBarProps {
  categories: readonly CategoryItem[]
  selectedSlug: string | null
  onSelectCategory: (slug: string | null) => void
}

export function CategoryFilterBar({
  categories,
  selectedSlug,
  onSelectCategory,
}: CategoryFilterBarProps) {
  const { t } = useTranslation()

  return (
    <div
      role="tablist"
      aria-label={t.productsPage.title}
      className="flex flex-wrap items-center gap-2.5 border-b border-stone-800/90 pb-6"
    >
      <button
        type="button"
        role="tab"
        aria-selected={selectedSlug === null}
        onClick={() => onSelectCategory(null)}
        className={cn(
          'rounded-full px-5 py-2.5 text-xs font-medium tracking-[0.18em] uppercase transition-all duration-200',
          selectedSlug === null
            ? 'border border-[#D6C3A5]/60 bg-[#D6C3A5] text-stone-950 shadow-[0_6px_20px_rgba(214,195,165,0.2)]'
            : 'border border-stone-700/80 bg-[#26211D]/90 text-stone-300 hover:border-[#D6C3A5]/45 hover:bg-stone-800 hover:text-stone-100',
        )}
      >
        {t.productsPage.allCategoriesLabel}
      </button>

      {categories.map((category) => {
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
                ? 'border border-[#D6C3A5]/60 bg-[#D6C3A5] text-stone-950 shadow-[0_6px_20px_rgba(214,195,165,0.2)]'
                : 'border border-stone-700/80 bg-[#26211D]/90 text-stone-300 hover:border-[#D6C3A5]/45 hover:bg-stone-800 hover:text-stone-100',
            )}
          >
            {category.name}
          </button>
        )
      })}
    </div>
  )
}
