import {
  fetchWithOfflineCache,
  readCachedData,
} from '@/services/offlineCache'
import type { CategoryItem, ProductItem } from '@/types/catalog'

const FALLBACK_CATEGORIES: readonly CategoryItem[] = [
  {
    id: 1,
    slug: 'sheer-elegance',
    name: 'Persianas Sheer Elegance (Dúo)',
    description:
      'Franjas horizontales alternadas que permiten modular la luz natural y la privacidad con total suavidad.',
    display_order: 1,
    is_active: true,
  },
  {
    id: 2,
    slug: 'enrollables-blackout',
    name: 'Persianas Enrollables Blackout',
    description:
      'Bloqueo total de luz y aislamiento térmico ideal para recámaras principales y salas de proyección.',
    display_order: 2,
    is_active: true,
  },
  {
    id: 3,
    slug: 'enrollables-traslucidas',
    name: 'Persianas Enrollables Traslúcidas',
    description:
      'Tejidos arquitectónicos con filtro solar que iluminan tus espacios protegiendo tus muebles de los rayos UV.',
    display_order: 3,
    is_active: true,
  },
  {
    id: 4,
    slug: 'shangri-la-romanas',
    name: 'Persianas Shangri-La y Romanas',
    description:
      'Acabados textiles de alta costura que combinan la calidez de una cortina con la precisión de una persiana.',
    display_order: 4,
    is_active: true,
  },
]

const FALLBACK_PRODUCTS: readonly ProductItem[] = [
  {
    id: 1,
    category_id: 1,
    category_slug: 'sheer-elegance',
    category_name: 'Persianas Sheer Elegance (Dúo)',
    sku: 'TP-SHEER-001',
    slug: 'persiana-sheer-elegance-imperial',
    name: 'Persiana Sheer Elegance Imperial',
    short_description:
      'Doble tejido en tono espresso y lino cálido con control milimétrico de luz.',
    description:
      'Nuestra persiana insignia de Toño Persianas. Combina franjas opacas de tejido texturizado con malla traslúcida de alta definición para lograr ambientes serenos y sofisticados.',
    light_control: 'duo',
    base_price_m2: 1450,
    currency: 'MXN',
    min_width_cm: 40,
    max_width_cm: 300,
    min_height_cm: 40,
    max_height_cm: 350,
    image_url: '/assets/sheer-elegance-imperial.jpg',
    is_featured: true,
    is_active: true,
  },
  {
    id: 2,
    category_id: 1,
    category_slug: 'sheer-elegance',
    category_name: 'Persianas Sheer Elegance (Dúo)',
    sku: 'TP-SHEER-002',
    slug: 'persiana-sheer-elegance-arena',
    name: 'Persiana Sheer Elegance Arena',
    short_description:
      'Acabado en tonos alabastro y champaña para estancias luminosas.',
    description:
      'Diseñada para integrarse en muros claros y maderas naturales, ofreciendo transición suave entre vista exterior e intimidad interior.',
    light_control: 'duo',
    base_price_m2: 1390,
    currency: 'MXN',
    min_width_cm: 40,
    max_width_cm: 300,
    min_height_cm: 40,
    max_height_cm: 350,
    image_url: '/assets/sheer-elegance-arena.jpg',
    is_featured: true,
    is_active: true,
  },
  {
    id: 3,
    category_id: 2,
    category_slug: 'enrollables-blackout',
    category_name: 'Persianas Enrollables Blackout',
    sku: 'TP-BLK-001',
    slug: 'persiana-enrollable-blackout-nocturna',
    name: 'Persiana Enrollable Blackout Nocturna',
    short_description:
      'Oscuridad total al 100% con recubrimiento térmico acústico.',
    description:
      'Ideal para un descanso profundo en recámaras. Su tejido multicapa bloquea el paso de luz solar y reduce el calor interior.',
    light_control: 'blackout',
    base_price_m2: 1250,
    currency: 'MXN',
    min_width_cm: 40,
    max_width_cm: 300,
    min_height_cm: 40,
    max_height_cm: 350,
    image_url: '/assets/enrollable-blackout-nocturna.jpg',
    is_featured: true,
    is_active: true,
  },
  {
    id: 4,
    category_id: 2,
    category_slug: 'enrollables-blackout',
    category_name: 'Persianas Enrollables Blackout',
    sku: 'TP-BLK-002',
    slug: 'persiana-enrollable-blackout-lino',
    name: 'Persiana Enrollable Blackout Textura Lino',
    short_description:
      'Bloqueo total de luz con elegante textura orgánica tipo lino.',
    description:
      'Une la funcionalidad absoluta del blackout con una cara interior cálida y textil que viste tus ventanales con distinción.',
    light_control: 'blackout',
    base_price_m2: 1320,
    currency: 'MXN',
    min_width_cm: 40,
    max_width_cm: 300,
    min_height_cm: 40,
    max_height_cm: 350,
    image_url: '/assets/enrollable-blackout-lino.jpg',
    is_featured: false,
    is_active: true,
  },
  {
    id: 5,
    category_id: 3,
    category_slug: 'enrollables-traslucidas',
    category_name: 'Persianas Enrollables Traslúcidas',
    sku: 'TP-TRS-001',
    slug: 'persiana-screen-solar-arquitectonica',
    name: 'Persiana Screen Solar Arquitectónica 5%',
    short_description:
      'Control solar inteligente que conserva la vista hacia el exterior.',
    description:
      'Tejido técnico microperforado que filtra el deslumbramiento y bloquea hasta el 95% de los rayos UV sin perder conexión visual con tu jardín o terraza.',
    light_control: 'traslucida',
    base_price_m2: 1180,
    currency: 'MXN',
    min_width_cm: 40,
    max_width_cm: 300,
    min_height_cm: 40,
    max_height_cm: 350,
    image_url: '/assets/screen-solar-arquitectonica.jpg',
    is_featured: true,
    is_active: true,
  },
  {
    id: 6,
    category_id: 4,
    category_slug: 'shangri-la-romanas',
    category_name: 'Persianas Shangri-La y Romanas',
    sku: 'TP-SHG-001',
    slug: 'persiana-shangri-la-seda-real',
    name: 'Persiana Shangri-La Seda Real',
    short_description:
      'Láminas textiles suspendidas entre dos velos traslúcidos.',
    description:
      'La máxima expresión de elegancia para salas y comedores de lujo, suavizando la entrada de luz con un efecto etéreo inigualable.',
    light_control: 'semi-opaca',
    base_price_m2: 1890,
    currency: 'MXN',
    min_width_cm: 40,
    max_width_cm: 300,
    min_height_cm: 40,
    max_height_cm: 350,
    image_url: '/assets/shangri-la-seda-real.jpg',
    is_featured: true,
    is_active: true,
  },
]

const CATEGORIES_CACHE_KEY = 'catalog_categories'
const PRODUCTS_CACHE_KEY = 'catalog_products'

export function getCachedCategories(): readonly CategoryItem[] | null {
  return readCachedData<readonly CategoryItem[]>(CATEGORIES_CACHE_KEY)
}

export function getCachedProducts(): readonly ProductItem[] | null {
  return readCachedData<readonly ProductItem[]>(PRODUCTS_CACHE_KEY)
}

export async function fetchCategories(): Promise<readonly CategoryItem[]> {
  return fetchWithOfflineCache<readonly CategoryItem[]>(
    CATEGORIES_CACHE_KEY,
    '/bff/catalog/categories',
    FALLBACK_CATEGORIES,
  )
}

export async function fetchProducts(): Promise<readonly ProductItem[]> {
  return fetchWithOfflineCache<readonly ProductItem[]>(
    PRODUCTS_CACHE_KEY,
    '/bff/catalog/products',
    FALLBACK_PRODUCTS,
  )
}
