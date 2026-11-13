import { useEffect, useMemo, useState } from 'react'
import { CategoryFilterBar } from '@/components/products/CategoryFilterBar'
import { ProductCard } from '@/components/products/ProductCard'
import { ProductCardSkeleton } from '@/components/products/ProductCardSkeleton'
import { useTranslation } from '@/i18n'
import {
  fetchCategories,
  fetchProducts,
  getCachedCategories,
  getCachedProducts,
} from '@/services/catalogApi'
import type { CategoryItem, ProductItem } from '@/types/catalog'

const SKELETON_CARD_COUNT = 6

export function ProductsPage() {
  const { t } = useTranslation()
  const [categories, setCategories] = useState<readonly CategoryItem[]>(
    () => getCachedCategories() ?? [],
  )
  const [products, setProducts] = useState<readonly ProductItem[]>(
    () => getCachedProducts() ?? [],
  )
  const [isLoading, setIsLoading] = useState<boolean>(
    () => getCachedCategories() === null || getCachedProducts() === null,
  )
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    let active = true
    Promise.all([fetchCategories(), fetchProducts()]).then(([cats, prods]) => {
      if (!active) return
      setCategories(cats)
      setProducts(prods)
      setIsLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return products
    return products.filter((item) => item.category_slug === selectedCategory)
  }, [products, selectedCategory])

  return (
    <main className="min-h-svh w-full bg-[#F5F0E6] bg-gradient-to-b from-[#FAF6EE] via-[#F4EFE4] to-[#EDE5D7] pt-32 pb-20 text-stone-900 transition-colors duration-300 sm:pt-36 dark:bg-[#1C1815] dark:from-stone-950 dark:via-[#1E1916] dark:to-[#171311] dark:text-stone-100">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        {/* Dual-Theme Showroom Editorial Header */}
        <header className="mb-10 max-w-3xl text-left">
          <span className="inline-block rounded-full border border-[#B89768]/45 bg-[#FCF9F4] px-4 py-1 text-[11px] font-semibold tracking-[0.24em] text-[#7A5930] uppercase dark:border-[#D6C3A5]/35 dark:bg-stone-900/75 dark:text-[#E8DAC2]">
            {t.productsPage.eyebrow}
          </span>
          <h1 className="font-heading mt-4 text-4xl font-normal tracking-tight text-stone-900 sm:text-5xl dark:text-stone-50">
            {t.productsPage.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-stone-700 sm:text-lg dark:text-stone-300/85">
            {t.productsPage.subtitle}
          </p>
        </header>

        {/* Category Filter Pills */}
        <CategoryFilterBar
          categories={categories}
          selectedSlug={selectedCategory}
          onSelectCategory={setSelectedCategory}
          isLoading={isLoading}
        />

        {/* Blinds Showroom Grid */}
        <section
          aria-label={t.productsPage.title}
          aria-busy={isLoading}
          className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {isLoading && products.length === 0
            ? Array.from({ length: SKELETON_CARD_COUNT }).map((_, index) => (
                <ProductCardSkeleton key={`product-skeleton-${index}`} />
              ))
            : filteredProducts.map((product, index) => (
                <ProductCard key={product.slug} product={product} index={index} />
              ))}
        </section>
      </div>
    </main>
  )
}
