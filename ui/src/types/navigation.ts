export type NavRouteId = 'home' | 'products' | 'contact'

export interface NavItemConfig {
  id: NavRouteId
  path: '/' | '/productos' | '/contacto'
}

export const NAV_ITEMS: readonly NavItemConfig[] = [
  { id: 'home', path: '/' },
  { id: 'products', path: '/productos' },
  { id: 'contact', path: '/contacto' },
] as const
