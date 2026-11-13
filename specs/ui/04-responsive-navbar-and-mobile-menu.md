# Specification: Responsive Navbar & Architectural Mobile Menu Dropdown

- **Status**: Approved
- **Target Subproject**: `ui/`
- **Spec Path**: `specs/ui/04-responsive-navbar-and-mobile-menu.md`

---

## 1. Objective & Scope
Adapt the top navigation bar (`Navbar.tsx`) for distinct desktop and mobile experiences while preserving the dual-theme (Light & Dark) architectural luxury aesthetic:
- **Desktop (`md: ≥ 768px`)**:
  - Hide the circular 3-slat emblem button on the left of the business name (`TOÑO PERSIANAS`) so only the typographic brand mark is displayed on the left.
  - Display the horizontal navigation pills (`Inicio`, `Productos`, `Contacto`), vertical separator, and `ThemeToggle` on the right.
- **Mobile (`< 768px`)**:
  - Display the circular 3-slat button to the left of `TOÑO PERSIANAS` as an interactive **Mobile Menu Button** (`button[aria-expanded][aria-controls="mobile-navigation-menu"]`).
  - Hide the inline horizontal navigation pills (`Inicio`, `Productos`, `Contacto`) from the top bar so the mobile header stays a compact single row (`[Menu Button + Brand]` on the left, `[ThemeToggle]` on the right).
  - Render an architectural collapsible dropdown (`MobileMenuDropdown.tsx`) directly beneath the header pill containing the navigation links with smooth open/close transitions.

---

## 2. Breakpoint & Visual Specification

| Element | Mobile (`< 768px`) | Desktop (`md: ≥ 768px`) |
| :--- | :--- | :--- |
| **Circular 3-Slat Menu Button** | Visible (`flex md:hidden`) on the left of `TOÑO PERSIANAS`. Morphs into `×` when open. | Hidden (`md:hidden`). |
| **Brand Typography (`TOÑO PERSIANAS`)** | Visible immediately to the right of the Mobile Menu Button. | Visible at the far left of the navbar. |
| **Inline Navigation Pills (`NavButton`)** | Hidden (`hidden md:flex`). | Visible (`hidden md:flex`) on the right. |
| **Sun/Moon `ThemeToggle`** | Visible at the far right of the top bar. | Visible at the far right of the top bar (after vertical divider). |
| **Collapsible Dropdown (`MobileMenuDropdown`)** | Mounted below the navbar pill (`md:hidden`), expands/collapses smoothly. | Hidden (`md:hidden`). |

---

## 3. Component & Interface Contracts

### 3.1 `ui/src/i18n/types.ts` & `ui/src/i18n/locales/es.ts`
Extend `TranslationDictionary` with `mobileMenu`:
```ts
mobileMenu: {
  openAriaLabel: string
  closeAriaLabel: string
  sectionTitle: string
}
```
Spanish (`es.ts`) values:
- `openAriaLabel`: `'Abrir menú de navegación'`
- `closeAriaLabel`: `'Cerrar menú de navegación'`
- `sectionTitle`: `'Navegación Principal'`

### 3.2 `ui/src/components/layout/MobileMenuDropdown.tsx`
```ts
export interface MobileMenuDropdownProps {
  isOpen: boolean
  onClose: () => void
}
```
- **Animated Collapse Wrapper**:
  - Uses CSS Grid row animation (`grid transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]`) switching between:
    - Open: `mt-2.5 grid-rows-[1fr] translate-y-0 opacity-100`
    - Closed: `mt-0 grid-rows-[0fr] -translate-y-2 opacity-0 pointer-events-none`
- **Glassmorphic Panel Styling**:
  - **Light Mode**: `border-[#D5C7B2]/90 bg-[#FAF6EE]/95 shadow-[0_24px_48px_rgba(28,24,21,0.16)] backdrop-blur-2xl`
  - **Dark Mode**: `dark:border-[#D6C3A5]/25 dark:bg-[#1C1815]/95 dark:shadow-[0_24px_50px_rgba(0,0,0,0.68)]`
- **Dropdown Items**:
  - Maps over `NAV_ITEMS` (`home`, `products`, `contact`), displaying:
    - Editorial index (`01`, `02`, `03`)
    - Uppercase tracked label (`Inicio`, `Productos`, `Contacto`)
    - Active indicator badge + right arrow (`ArrowUpRight`)
  - Clicking any link triggers `onClose()`.
- **Editorial Footer inside Dropdown**:
  - Displays a subtle top-bordered strip with `t.brand.tagline` (`"Diseño arquitectónico en control de luz"`).

### 3.3 `ui/src/components/layout/Navbar.tsx`
- **State & Dismissal**:
  - `const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)`
  - Closes automatically when `location.pathname` changes, when pressing `Escape`, or when clicking/tapping outside `headerRef`.
- **Animated 3-Slat Menu Button (`md:hidden`)**:
  - `h-10 w-10 rounded-full border border-[#9E7B4F]/50 bg-stone-900 dark:border-[#D6C3A5]/50 dark:bg-stone-900/85`
  - Contains 3 horizontal bars (`bg-[#D6C3A5]` and `bg-stone-200/85`):
    - Top bar: rotates `45deg` and translates to center when open.
    - Middle bar: scales/fades out (`opacity-0 scale-x-0`) when open.
    - Bottom bar: rotates `-45deg` and translates to center when open.
