# Specification: Full-Width Contact Map, Shared Global Chat & In-Page Product Inquiry Popup (`ui/`)

- **Status**: Approved
- **Target Subproject**: `ui/`
- **Spec Path**: `specs/ui/07-global-chat-popup-and-contact-layout.md`

---

## 1. Objective & Scope
1. **Full-Width Contact Map Layout (`ContactPage.tsx`)**:
   - Arrange `ContactInfoPanel` (left column, `lg:col-span-6`) and `LiveChatBox` (right column, `lg:col-span-6`) in the top 12-column grid row.
   - Place `LocationMapCard` below the two-column row spanning the **full width** (`w-full`) of the `max-w-7xl` container while preserving its `h-72 sm:h-80` map frame height.
2. **Application-Wide Shared Chat State (`ChatContext.tsx`)**:
   - Provide a single global `ChatProvider` (`useChat()`) wrapping the router in `App.tsx`.
   - Maintain a single shared conversation thread (`messages`), client name (`clientName`), message input draft (`inputText`), selected blind model (`selectedProduct`), and WhatsApp configuration across all routes (`/`, `/productos`, `/contacto`).
3. **In-Page Floating Chat Popup (`ChatPopupWidget.tsx`) & Product Inquiry Pre-Fill (`ProductCard.tsx`)**:
   - Clicking **"Consultar este modelo"** on any `ProductCard` stays on `/productos` (keeping the product card in view), opens the floating in-page `ChatPopupWidget` in the bottom-right corner, attaches the product pill (`product.name · product.sku`), and populates the message input field (`inputText`) with:
     `"Hola, me interesa cotizar el modelo ${product.name} (${product.sku}). ¿Me podrían brindar más información?"`
   - Navigating between `/productos` and `/contacto` preserves the exact same messages, selected product, and draft input text.

---

## 2. Component & Context Contracts

### 2.1 `ui/src/context/ChatContext.tsx`
```ts
export interface ChatContextValue {
  readonly messages: readonly ChatMessage[]
  readonly clientName: string
  readonly setClientName: (name: string) => void
  readonly inputText: string
  readonly setInputText: (text: string) => void
  readonly selectedProduct: ProductItem | null
  readonly clearSelectedProduct: () => void
  readonly isPopupOpen: boolean
  readonly setIsPopupOpen: (open: boolean) => void
  readonly showTestConfig: boolean
  readonly setShowTestConfig: (show: boolean | ((prev: boolean) => boolean)) => void
  readonly targetWhatsappPhone: string
  readonly setTargetWhatsappPhone: (phone: string) => void
  readonly contactInfo: ContactInfoData
  readonly openProductInquiry: (product: ProductItem) => void
  readonly sendMessage: () => void
  readonly buildWhatsappHref: () => string
}
```

### 2.2 `ui/src/components/contact/LiveChatBox.tsx`
```ts
export interface LiveChatBoxProps {
  isPopup?: boolean
  onClosePopup?: () => void
}
```
- Consumes shared state from `useChat()` and offline state from `useNetworkStatus()`.
- When `isPopup` is `true`:
  - Renders a minimize/close icon button (`X`) in the top-right header controls alongside the `"Prueba WA"` button.
  - Uses a compact message list height (`h-64 sm:h-72`) suited for a floating window.
  - Auto-focuses the message text input when `selectedProduct` is selected or when opened.
- Displays a dismissible (`×`) selected product context bar showing `selectedProduct.name` and `selectedProduct.sku` whenever `selectedProduct` is non-null.

### 2.3 `ui/src/components/contact/ChatPopupWidget.tsx`
- Mounted globally inside `BrowserRouter` in `App.tsx`.
- Hidden when `useLocation().pathname === '/contacto'` (since `ContactPage` renders the inline `LiveChatBox`).
- **Closed State (`isPopupOpen === false`)**:
  - Bottom-right floating trigger button (`fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6`) with live online/offline status dot, `MessageCircle` icon, and `"Chat en Línea"` label.
- **Open State (`isPopupOpen === true`)**:
  - Floating card container (`fixed right-4 bottom-4 z-50 w-[calc(100vw-2rem)] max-w-md sm:right-6 sm:bottom-6`) rendering `<LiveChatBox isPopup onClosePopup={() => setIsPopupOpen(false)} />`.

### 2.4 `ui/src/components/products/ProductCard.tsx`
- Replaces `<Link to="/contacto?producto=...">` with:
  ```tsx
  <button
    type="button"
    onClick={() => openProductInquiry(product)}
    className="..."
  >
    <span>{t.productsPage.inquireCta}</span>
    <MessageCircle className="size-4" aria-hidden="true" />
  </button>
  ```

### 2.5 `ui/src/pages/ContactPage.tsx`
- Reads `contactInfo` from `useChat()`.
- Renders `ContactInfoPanel` and `LiveChatBox` in the top row (`lg:col-span-6` each) and `LocationMapCard` full-width (`mt-8 w-full`) below them.
