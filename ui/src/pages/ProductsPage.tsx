import { useEffect, useMemo, useState } from 'react'
import { CategoryFilterBar } from '@/components/products/CategoryFilterBar'
import { ProductCard } from '@/components/products/ProductCard'
import { useTranslation } from '@/i18n'
import { fetchCategories, fetchProducts } from '@/services/catalogApi'
import type { CategoryItem, ProductItem } from '@/types/catalog'

export function ProductsPage() {
  const { t } = useTranslation()
  const [categories, setCategories] = useState<readonly CategoryItem[]>([])
  const [products, setProducts] = useState<readonly ProductItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    Promise.all([fetchCategories(), fetchProducts()]).then(([cats, prods]) => {
      if (!active) return
      setCategories(cats)
      setProducts(prods)
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
    <main className="min-h-svh w-full bg-[#1C1815] bg-gradient-to-b from-stone-950 via-[#1E1916] to-[#171311] pt-32 pb-20 text-stone-100 sm:pt-36">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        {/* Warm Espresso Showroom Editorial Header */}
        <header className="mb-10 max-w-3xl text-left">
          <span className="inline-block rounded-full border border-[#D6C3A5]/35 bg-stone-900/75 px-4 py-1 text-[11px] font-semibold tracking-[0.24em] text-[#E8DAC2] uppercase">
            {t.productsPage.eyebrow}
          </span>
          <h1 className="font-heading mt-4 text-4xl font-normal tracking-tight text-stone-50 sm:text-5xl">
            {t.productsPage.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-stone-300/85 sm:text-lg">
            {t.productsPage.subtitle}
          </p>
        </header>

        {/* Category Filter Pills */}
        <CategoryFilterBar
          categories={categories}
          selectedSlug={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Blinds Showroom Grid */}
        <section
          aria-label={t.productsPage.title}
          className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.slug} product={product} index={index} />
          ))}
        </section>
      </div>
    </main>
  )
}
