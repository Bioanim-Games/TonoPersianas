export type LightControlType = 'traslucida' | 'semi-opaca' | 'blackout' | 'duo'

export interface CategoryItem {
  id: number
  slug: string
  name: string
  description: string
  display_order: number
  is_active: boolean
}

export interface ProductItem {
  id: number
  category_id: number
  category_slug: string
  category_name: string
  sku: string
  slug: string
  name: string
  short_description: string
  description: string
  light_control: LightControlType
  base_price_m2: number
  currency: string
  min_width_cm: number
  max_width_cm: number
  min_height_cm: number
  max_height_cm: number
  image_url: string
  is_featured: boolean
  is_active: boolean
}
