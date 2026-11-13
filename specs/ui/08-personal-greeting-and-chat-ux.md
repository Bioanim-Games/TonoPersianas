# Specification: Personal Greeting Modal, Chat Name Session Locking & 4-Line Auto-Expanding Editor (`ui/`)

- **Status**: Approved
- **Target Subproject**: `ui/`
- **Spec Path**: `specs/ui/08-personal-greeting-and-chat-ux.md`

---

## 1. Objective & Scope
1. **Optional First-Visit Personal Greeting Modal (`VisitorNameModal.tsx`)**:
   - The first time the user navigates to `/productos` or `/contacto` (tracked via `sessionStorage` key `tp_visitor_prompted_v1`), display a non-intrusive architectural modal asking if they would like to share their name.
   - **Never Mandatory**: If the user clicks **"Omitir por ahora"**, the close `×` button, presses `Escape`, or clicks the backdrop, the modal closes and all page/chat texts remain the default general strings.
   - **Personalized Experience**: When a name is provided (either in the modal or typed into the chat name field before the first message), personalize:
     - **Products Page (`ProductsPage.tsx`)**: Prepends `"Bienvenido, {name}. "` to the showroom subtitle.
     - **Contact Page (`ContactPage.tsx`)**: Displays `"{name}, hablemos de tu proyecto"` as the page title.
     - **Chat Welcome Message (`ChatContext.tsx`)**: Displays `"¡Hola {name}! Bienvenido a Toño Persianas. ¿En qué modelo o medidas podemos asesorarte hoy?"`.
2. **First-Message Name Locking & Session Reset (`ChatContext.tsx` & `LiveChatBox.tsx` — Flow A)**:
   - Before the first client message is sent (`isChatStarted === false`), the Name input field (`clientName`) is editable alongside the message box.
   - As soon as the user hits **"Enviar"** on their first message (`isChatStarted` becomes `true`):
     - The Name locks permanently for the active chat session (rendered as a read-only session bar showing `"Chateando como: {name}"`).
     - A **"Finalizar chat"** button is displayed in the session bar so the user can end the current chat, reset the conversation thread, and unlock the Name field to start a new chat.
3. **Auto-Expanding 1-to-4 Line Wrapping Message Editor (`LiveChatBox.tsx`)**:
   - Replace the single-line `<input type="text">` message input with a `<textarea rows={1}>`:
     - Wraps text onto the next line automatically (`whitespace-pre-wrap break-words resize-none`) whenever text reaches the right edge of the box.
     - Dynamically recalculates its height (`scrollHeight`) as lines wrap, expanding smoothly from **1 line (`42px`) up to a maximum of 4 lines (`106px`)**, and scrolling vertically inside the box only after exceeding 4 lines.
     - Pressing `Enter` (without `Shift`) sends the message; pressing `Shift + Enter` inserts a newline.

---

## 2. Component & Interface Contracts

### 2.1 `ui/src/i18n/types.ts` & `ui/src/i18n/locales/es.ts`
Extend `TranslationDictionary`:
```ts
visitorModal: {
  eyebrow: string
  title: string
  description: string
  inputPlaceholder: string
  confirmButton: string
  skipButton: string
}
```
Extend `productsPage`:
```ts
personalizedSubtitlePrefix: string // 'Bienvenido, {name}. '
```
Extend `contactPage`:
```ts
personalizedTitle: string // '{name}, hablemos de tu proyecto'
```
Extend `contactPage.chat`:
```ts
personalizedWelcomeMessage: string // '¡Hola {name}! Bienvenido a Toño Persianas. ¿En qué modelo o medidas podemos asesorarte hoy?'
lockedNameLabel: string // 'Chateando como:'
endChatButton: string // 'Finalizar chat'
anonymousClientLabel: string // 'Invitado'
```

### 2.2 `ui/src/context/ChatContext.tsx`
Extend `ChatContextValue`:
```ts
readonly isChatStarted: boolean
readonly hasPromptedName: boolean
readonly dismissNamePrompt: (submittedName?: string) => void
readonly endChatSession: () => void
```

### 2.3 `ui/src/components/layout/VisitorNameModal.tsx`
- Observes `useLocation().pathname`:
  - Opens when `pathname === '/productos' || pathname === '/contacto'` and `!hasPromptedName`.
- Renders a centered glassmorphic dialog (`role="dialog" aria-modal="true"`) with primary button (`Continuar`) and secondary button (`Omitir por ahora`).

### 2.4 `ui/src/components/contact/LiveChatBox.tsx`
- **Top of Form Composer**:
  - If `!isChatStarted`: renders the editable `clientName` `<input>`.
  - If `isChatStarted`: renders the locked session strip with `UserCheck` icon, `"Chateando como: {clientName.trim() || t.contactPage.chat.anonymousClientLabel}"`, and the `"Finalizar chat"` button calling `endChatSession()`.
- **Message `<textarea>` Auto-Resize**:
  - `const MIN_TEXTAREA_HEIGHT_PX = 42`
  - `const MAX_FOUR_LINES_HEIGHT_PX = 106`
  - Dynamically sizes height on every `inputText` change.
