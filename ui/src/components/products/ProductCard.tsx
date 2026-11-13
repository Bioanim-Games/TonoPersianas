import { ArrowUpRight, Maximize2, SunMedium } from 'lucide-react'
import { Link } from 'react-router'
import blindCustomerPhoto from '@/assets/495031512_18506527366010357_2839919073663869084_n.jpg'
import blindRoomPhoto from '@/assets/Gemini_Generated_Image_866yuw866yuw866y.jpg'
import { useTranslation } from '@/i18n'
import type { ProductItem } from '@/types/catalog'

export interface ProductCardProps {
  product: ProductItem
  index: number
}

export function ProductCard({ product, index }: ProductCardProps) {
  const { t } = useTranslation()
  const previewImage = index % 2 === 0 ? blindRoomPhoto : blindCustomerPhoto
  const lightLabel = t.productsPage.lightControlLabels[product.light_control]
  const formattedPrice = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: product.currency,
    maximumFractionDigits: 0,
  }).format(product.base_price_m2)

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-stone-800/90 bg-[#25201C] shadow-[0_14px_35px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D6C3A5]/55 hover:shadow-[0_20px_45px_rgba(0,0,0,0.5)]">
      {/* Blind Visual Showcase Frame */}
      <div className="relative h-64 w-full overflow-hidden bg-stone-900">
        <img
          src={previewImage}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#25201C] via-transparent to-stone-950/35" />

        {/* Top Badges */}
        <div className="absolute top-3.5 right-3.5 left-3.5 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-700/60 bg-stone-950/80 px-3 py-1 text-[11px] font-medium tracking-[0.14em] text-[#E8DAC2] uppercase backdrop-blur-md">
            <SunMedium className="size-3.5 text-[#D6C3A5]" aria-hidden="true" />
            {lightLabel}
          </span>

          {product.is_featured && (
            <span className="rounded-full bg-[#D6C3A5] px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-stone-950 uppercase">
              {t.productsPage.featuredBadge}
            </span>
          )}
        </div>

        {/* Bottom SKU & Category Tag */}
        <div className="absolute right-4 bottom-3 left-4 flex items-center justify-between text-xs text-stone-200">
          <span className="font-medium tracking-wider text-[#E8DAC2] uppercase">
            {product.category_name}
          </span>
          <span className="rounded border border-stone-700/70 bg-stone-950/75 px-2 py-0.5 font-mono text-[11px] text-stone-300">
            {product.sku}
          </span>
        </div>
      </div>

      {/* Warm Taupe Card Body */}
      <div className="flex flex-1 flex-col justify-between p-6 text-left">
        <div>
          <h2 className="font-heading text-2xl font-medium text-stone-100 group-hover:text-[#E8DAC2]">
            {product.name}
          </h2>
          <p className="mt-2 text-sm font-medium text-stone-300">
            {product.short_description}
          </p>
          <p className="mt-2.5 text-xs leading-relaxed text-stone-400">
            {product.description}
          </p>
        </div>

        <div className="mt-6 border-t border-stone-800 pt-4">
          {/* Dimensions & Price Row */}
          <div className="flex items-end justify-between gap-3">
            <div>
              <span className="flex items-center gap-1 text-[11px] tracking-wider text-stone-400 uppercase">
                <Maximize2
                  className="size-3 text-[#D6C3A5]"
                  aria-hidden="true"
                />
                {t.productsPage.dimensionsLabel}
              </span>
              <span className="mt-0.5 block text-xs font-medium text-stone-200">
                {product.min_width_cm}–{product.max_width_cm} cm ×{' '}
                {product.min_height_cm}–{product.max_height_cm} cm
              </span>
            </div>

            <div className="text-right">
              <span className="block text-[11px] tracking-wider text-stone-400 uppercase">
                {t.productsPage.priceUnitLabel}
              </span>
              <span className="font-heading text-xl font-semibold text-[#E8DAC2]">
                {formattedPrice}{' '}
                <span className="font-sans text-xs font-normal text-stone-400">
                  {product.currency}
                </span>
              </span>
            </div>
          </div>

          {/* Action Link to Contact Live Chat with Pre-selected Blind */}
          <Link
            to={`/contacto?producto=${product.slug}`}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#D6C3A5]/40 bg-stone-900/90 px-4 py-3 text-xs font-semibold tracking-[0.18em] text-[#E8DAC2] uppercase transition-all duration-200 hover:border-[#D6C3A5] hover:bg-[#D6C3A5] hover:text-stone-950"
          >
            <span>{t.productsPage.inquireCta}</span>
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}
