# Specification: React Router, Products Showroom & Contact Page (`ui/`)

## 1. Scope & Impact Summary
- **Target Subproject**: `ui/` (strictly 1 folder at a time — Rule 6)
- **New Dependencies**: `react-router` (installed via `yarn --cwd ui add react-router`)
- **Total Files Affected**: **19 files** in `ui/` (`11` new source files, `8` modified files including `package.json` & `yarn.lock`)
- **File List & Estimated Line Counts (Max 400 lines/file — Rule 5)**:
  1. `[MODIFY]` `ui/package.json` — Add `react-router`.
  2. `[NEW]` `ui/src/config/contactConfig.ts` — Default/fallback contact info (`+52 33 3377 3415`, `tpersianas@gmail.com`, Facebook URL, Instagram URL, Google Maps URL & Embed URL, and `VITE_WHATSAPP_TEST_PHONE`), structured to be replaced/hydrated by `/api/contact-info` from the SQLite DB in the next `api/` task.
  3. `[NEW]` `ui/src/types/catalog.ts` — Frontend TypeScript interfaces matching the FastAPI `/api/categories` and `/api/products` responses (`CategoryItem`, `ProductItem`, `LightControlType`).
  4. `[NEW]` `ui/src/types/chat.ts` — TypeScript interfaces for `ChatMessage` and `ChatSender` (`'client' | 'advisor'`), ready for SQLite DB & WhatsApp Cloud API webhook integration.
  5. `[NEW]` `ui/src/services/catalogApi.ts` — Fetches `/api/categories` and `/api/products` from FastAPI with automatic offline fallback to the 4 categories and 6 **Toño Persianas** products.
  6. `[MODIFY]` `ui/src/i18n/types.ts` — Extend `TranslationDictionary` with `productsPage` and `contactPage` sections.
  7. `[MODIFY]` `ui/src/i18n/locales/es.ts` — Spanish copy for the Products Showroom, Contact Info, Google Maps card, and Live Chat widget.
  8. `[MODIFY]` `ui/src/components/layout/NavButton.tsx` — Use `<NavLink to={path}>` from `react-router` with adaptive light/dark styling and the animated champagne underline indicator.
  9. `[MODIFY]` `ui/src/components/layout/Navbar.tsx` — Use `<Link to="/">` and `useLocation()` to adapt surface contrast seamlessly between the dark Home hero (`/`) and the Warm Alabaster Showroom (`/productos`, `/contacto`).
  10. `[MODIFY]` `ui/src/components/home/HeroSection.tsx` — Use `<Link to="/productos">` and `<Link to="/contacto">` on the primary and secondary hero CTA buttons.
  11. `[MODIFY]` `ui/src/pages/HomePage.tsx` — Remove manual `onNavigate` prop now that `react-router` handles routing.
  12. `[NEW]` `ui/src/components/products/CategoryFilterBar.tsx` — Interactive category filter pills (*Todas las Colecciones* + each category from `/api/categories`).
  13. `[NEW]` `ui/src/components/products/ProductCard.tsx` — High-contrast **Warm Alabaster Showroom** blind card displaying blind imagery, architectural slat visual badge, light-control level, dimension limits, price per $m^2$ in MXN, and a *"Cotizar / Preguntar en Chat"* `<Link to="/contacto?producto=...">` button.
  14. `[NEW]` `ui/src/pages/ProductsPage.tsx` — `/productos` showroom page fetching categories & products, filtering by category, and rendering the responsive gallery.
  15. `[NEW]` `ui/src/components/contact/ContactInfoPanel.tsx` — Displays clickable phone (`+52 33 3377 3415`), email (`tpersianas@gmail.com`), Facebook (`@tonopersianas`), Instagram (`@tonopersianas`), and showroom consultation details.
  16. `[NEW]` `ui/src/components/contact/LocationMapCard.tsx` — Renders the interactive Google Maps `<iframe>` (`cid=4803935933737513008`) and direct **"Abrir en Google Maps"** button.
  17. `[NEW]` `ui/src/components/contact/LiveChatBox.tsx` — Interactive on-site chat widget with pre-selected product tag support (`?producto=...`), message thread, instant WhatsApp (`wa.me`) hand-off button, and a collapsible **Modo Prueba WhatsApp** input in dev mode so you can enter your personal phone number for testing.
  18. `[NEW]` `ui/src/pages/ContactPage.tsx` — `/contacto` page combining `ContactInfoPanel`, `LocationMapCard`, and `LiveChatBox`.
  19. `[MODIFY]` `ui/src/App.tsx` — Wrap application in `<I18nProvider>` and `<BrowserRouter>`, rendering `<Navbar />` and `<Routes>` for `/`, `/productos`, and `/contacto`.
