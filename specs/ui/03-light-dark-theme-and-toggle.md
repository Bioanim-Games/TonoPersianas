# Specification: Light & Dark Theme System + Luxury Sun/Moon Toggle (`ui/`)

## 1. Scope & Impact Summary
- **Target Subproject**: `ui/` (strictly 1 folder at a time — Rule 6)
- **New Dependencies**: **0**
- **Total Files Affected**: **17 files** in `ui/src/` (`2` new files, `15` modified files)
- **File List & Estimated Line Counts (Max 400 lines/file — Rule 5)**:
  1. `[NEW]` `ui/src/theme/index.tsx` — `ThemeProvider` and `useTheme()` managing `'light' | 'dark'`, syncing the `.dark` class on `<html>` (`document.documentElement`), and persisting in `localStorage`.
  2. `[NEW]` `ui/src/components/layout/ThemeToggle.tsx` — Luxury sliding-orb architectural Sun/Moon toggle switch with champagne border, dual icons, and smooth cubic-bezier transition.
  3. `[MODIFY]` `ui/src/i18n/types.ts` — Add `theme` labels (`lightModeLabel`, `darkModeLabel`, `toggleAriaLabel`) to `TranslationDictionary`.
  4. `[MODIFY]` `ui/src/i18n/locales/es.ts` — Add Spanish theme toggle strings (`"Luz de Día"`, `"Modo Nocturno"`, `"Cambiar entre modo claro y oscuro"`).
  5. `[MODIFY]` `ui/src/App.tsx` — Wrap `<BrowserRouter>` inside `<ThemeProvider defaultTheme="light">`.
  6. `[MODIFY]` `ui/src/components/layout/NavButton.tsx` — Dual-theme pill classes (warm frosted cream in Light Mode; dark espresso with champagne glow in Dark Mode).
  7. `[MODIFY]` `ui/src/components/layout/Navbar.tsx` — Dual-theme floating header bar + integrate `<ThemeToggle />`.
  8. `[MODIFY]` `ui/src/pages/HomePage.tsx` — Remove the heavy dark veil in Light Mode so `Gemini_Generated_Image_866yuw866yuw866y.jpg` stays bright and natural, while keeping `dark:from-stone-950/85 dark:via-stone-950/50 dark:to-stone-950/15` in Dark Mode.
  9. `[MODIFY]` `ui/src/components/home/HeroSection.tsx` — Dual-theme hero typography and CTA buttons.
  10. `[MODIFY]` `ui/src/components/home/FeatureHighlights.tsx` — Dual-theme bottom glass feature bar.
  11. `[MODIFY]` `ui/src/pages/ProductsPage.tsx` — Warm cream showroom background (`bg-[#F5F0E6] text-stone-900`) in Light Mode; preserves `dark:bg-[#1C1815] dark:text-stone-100` in Dark Mode.
  12. `[MODIFY]` `ui/src/components/products/CategoryFilterBar.tsx` — Dual-theme category filter pills.
  13. `[MODIFY]` `ui/src/components/products/ProductCard.tsx` — Warm ivory cards (`bg-[#FCF9F4] border-[#E2D7C5]`) in Light Mode; preserves `dark:bg-[#25201C] dark:border-stone-800/90` in Dark Mode.
  14. `[MODIFY]` `ui/src/pages/ContactPage.tsx` — Dual-theme contact page container.
  15. `[MODIFY]` `ui/src/components/contact/ContactInfoPanel.tsx`, `ui/src/components/contact/LocationMapCard.tsx`, & `ui/src/components/contact/LiveChatBox.tsx` — Dual-theme contact, map, and chat cards.
