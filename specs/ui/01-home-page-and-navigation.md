# Specification: Toño Persianas — Home Page, Navigation & i18n Foundation

## 1. Scope & Impact Summary
- **Target Subproject**: `ui/` (strictly 1 folder at a time)
- **Total Files Affected**: **13 files** (`9` new, `3` modified, `1` deleted)
- **New Dependencies**: **0** (`react-router` will be installed in a separate future task)
- **File List & Estimated Line Counts (Max 400 lines/file)**:
  1. `[NEW]` `ui/src/types/navigation.ts` — ASCII route IDs and `react-router`-ready path definitions (`'/'`, `'/productos'`, `'/contacto'`).
  2. `[NEW]` `ui/src/i18n/types.ts` — TypeScript interfaces for `Locale` and `TranslationDictionary`.
  3. `[NEW]` `ui/src/i18n/locales/es.ts` — Spanish dictionary containing `"Toño Persianas"` (with `ñ`) and all display strings.
  4. `[NEW]` `ui/src/i18n/index.tsx` — `I18nProvider` context component and `useTranslation()` hook.
  5. `[NEW]` `ui/src/components/layout/NavButton.tsx` — Custom **Architectural Underline Pill** navigation button component.
  6. `[NEW]` `ui/src/components/layout/Navbar.tsx` — Floating frosted-glass top navigation bar with brand wordmark and navigation buttons.
  7. `[NEW]` `ui/src/components/home/HeroSection.tsx` — Editorial hero overlay with eyebrow badge, Playfair Display headline, description, and CTA buttons.
  8. `[NEW]` `ui/src/components/home/FeatureHighlights.tsx` — Translucent bottom architectural feature strip on the Home hero.
  9. `[NEW]` `ui/src/pages/HomePage.tsx` — Home page container scoping `Gemini_Generated_Image_866yuw866yuw866y.jpg` as a full-bleed background with a warm espresso gradient veil.
  10. `[MODIFY]` `ui/index.html` — Update `<html lang="es">` and `<title>Toño Persianas | Diseño y Elegancia en Persianas</title>`.
  11. `[MODIFY]` `ui/src/index.css` — Remove default Vite `#root` width/border boxing so full-bleed layouts work cleanly while preserving Tailwind v4, Playfair Display, Noto Sans, and shadcn tokens.
  12. `[MODIFY]` `ui/src/App.tsx` — Wrap app in `I18nProvider` and render `Navbar` + `HomePage`.
  13. `[DELETE]` `ui/src/App.css` — Remove unused starter template CSS.

---

## 2. Functional Requirements & Acceptance Criteria

| ID | Requirement | Acceptance Criteria |
| :--- | :--- | :--- |
| **REQ-1** | **Safe `ñ` & Accent Usage** | `"Toño Persianas"` and accented Spanish words appear **only** inside user-facing display strings (`es.ts` and `index.html` `<title>`). All route paths (`'/'`, `'/productos'`, `'/contacto'`), IDs (`'home'`, `'products'`, `'contact'`), filenames, and code identifiers use pure ASCII. |
| **REQ-2** | **Home-Scoped Background Image** | `HomePage.tsx` renders `Gemini_Generated_Image_866yuw866yuw866y.jpg` full-bleed with a warm espresso gradient veil so left-aligned hero typography is crisp while the sheer zebra blinds on the right remain clearly visible. |
| **REQ-3** | **Architectural Underline Pill Navigation** | `Navbar.tsx` and `NavButton.tsx` render custom translucent glass pill buttons for **Inicio**, **Productos**, and **Contacto** with uppercase tracking, subtle border, and an animated warm-champagne bottom indicator bar (`#D6C3A5`) on hover and active state. |
| **REQ-4** | **`react-router` Readiness** | Navigation items define standard route paths (`'/'`, `'/productos'`, `'/contacto'`) without installing `react-router` yet. Clicking a nav button updates the active visual state in `App.tsx` while keeping `HomePage` rendered. |
| **REQ-5** | **Internationalization (`I18nProvider`)** | `I18nProvider` provides the active locale (`'es'` by default) and typed `t` dictionary to all components via `useTranslation()`. |
| **REQ-6** | **400-Line Limit & Modular Structure** | Every file in `ui/src/` is modular, single-responsibility, and well under 400 lines. |
