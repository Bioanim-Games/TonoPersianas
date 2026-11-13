import { cn } from 'cn'
import {
  MessageCircle,
  Minimize2,
  Send,
  Settings2,
  Sparkles,
  WifiOff,
  X,
} from 'lucide-react'
import { useEffect, useRef, type FormEvent } from 'react'
import { useChat } from '@/context/ChatContext'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'
import { useTranslation } from '@/i18n'

export interface LiveChatBoxProps {
  isPopup?: boolean
  onClosePopup?: () => void
}

export function LiveChatBox({
  isPopup = false,
  onClosePopup,
}: LiveChatBoxProps) {
  const { t } = useTranslation()
  const { isOffline } = useNetworkStatus()
  const {
    messages,
    clientName,
    setClientName,
    inputText,
    setInputText,
    selectedProduct,
    clearSelectedProduct,
    showTestConfig,
    setShowTestConfig,
    targetWhatsappPhone,
    setTargetWhatsappPhone,
    sendMessage,
    buildWhatsappHref,
  } = useChat()

  const messageInputRef = useRef<HTMLInputElement | null>(null)
  const threadContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (selectedProduct && !isOffline) {
      messageInputRef.current?.focus()
    }
  }, [selectedProduct, isOffline])

  useEffect(() => {
    const el = threadContainerRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [messages.length])

  function handleSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isOffline) return
    sendMessage()
  }

  return (
    <section
      aria-label={t.contactPage.chat.title}
      className={cn(
        'flex flex-col overflow-hidden rounded-2xl border border-[#DFD3C0] bg-[#FCF9F4] text-left text-stone-900 transition-colors dark:border-stone-800/90 dark:bg-[#25201C] dark:text-stone-100',
        isPopup
          ? 'shadow-[0_24px_60px_rgba(28,24,21,0.28)] dark:border-[#D6C3A5]/35 dark:shadow-[0_24px_65px_rgba(0,0,0,0.75)]'
          : 'shadow-[0_14px_36px_rgba(28,24,21,0.09)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.4)]',
      )}
    >
      {/* Chat Header */}
      <div className="flex items-center justify-between gap-3 border-b border-[#E5DAC8] bg-[#F3ECE0] px-5 py-3.5 sm:px-6 sm:py-4 dark:border-stone-800 dark:bg-stone-900/90">
        <div className="min-w-0">
          <h2 className="font-heading truncate text-lg font-medium text-stone-900 sm:text-xl dark:text-stone-50">
            {t.contactPage.chat.title}
          </h2>
          <p
            className={cn(
              'mt-1 flex items-center gap-2 text-xs font-medium',
              isOffline
                ? 'text-amber-700 dark:text-amber-400'
                : 'text-emerald-700 dark:text-emerald-400',
            )}
          >
            <span
              className={cn(
                'h-2 w-2 shrink-0 rounded-full',
                isOffline
                  ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b] dark:bg-amber-400'
                  : 'bg-emerald-500 shadow-[0_0_8px_#10b981] dark:bg-emerald-400',
              )}
            />
            <span className="truncate">
              {isOffline
                ? t.contactPage.chat.statusOffline
                : t.contactPage.chat.statusOnline}
            </span>
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setShowTestConfig((v) => !v)}
            title={t.contactPage.chat.testModeTitle}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#C8B89E] bg-white px-3 py-1.5 text-[11px] font-medium text-stone-700 transition-colors hover:border-[#8C6A3E] hover:text-stone-950 dark:border-stone-700 dark:bg-stone-800/80 dark:text-stone-300 dark:hover:border-[#D6C3A5] dark:hover:text-stone-100"
          >
            <Settings2
              className="size-3.5 text-[#8C6A3E] dark:text-[#D6C3A5]"
              aria-hidden="true"
            />
            <span>Prueba WA</span>
          </button>

          {isPopup && onClosePopup && (
            <button
              type="button"
              onClick={onClosePopup}
              aria-label={t.contactPage.chat.closePopupAriaLabel}
              title={t.contactPage.chat.closePopupAriaLabel}
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#C8B89E] bg-white text-stone-700 transition-colors hover:border-[#8C6A3E] hover:text-stone-950 dark:border-stone-700 dark:bg-stone-800/80 dark:text-stone-300 dark:hover:border-[#D6C3A5] dark:hover:text-stone-100"
            >
              <Minimize2 className="size-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Offline Mode Guard Banner (Blocks Online Chat when Offline) */}
      {isOffline && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-start gap-3 border-b border-amber-500/35 bg-amber-50/90 px-5 py-3 text-xs text-amber-950 dark:border-amber-500/30 dark:bg-amber-950/35 dark:text-amber-200"
        >
          <WifiOff
            className="mt-0.5 size-4 shrink-0 text-amber-700 dark:text-amber-400"
            aria-hidden="true"
          />
          <div>
            <p className="font-semibold">
              {t.contactPage.chat.offlineBannerTitle}
            </p>
            <p className="mt-0.5 leading-relaxed text-amber-900/90 dark:text-amber-200/85">
              {t.contactPage.chat.offlineBannerDescription}
            </p>
          </div>
        </div>
      )}

      {/* Collapsible Personal Phone Test Mode Bar */}
      {showTestConfig && (
        <div className="border-b border-[#E5DAC8] bg-[#F7F2E8] px-5 py-3 text-xs dark:border-stone-800 dark:bg-stone-900/70">
          <p className="font-semibold text-[#7A5930] dark:text-[#E8DAC2]">
            {t.contactPage.chat.testModeTitle}
          </p>
          <p className="mt-1 text-stone-600 dark:text-stone-400">
            {t.contactPage.chat.testModeDescription}
          </p>
          <input
            type="tel"
            value={targetWhatsappPhone}
            onChange={(e) => setTargetWhatsappPhone(e.target.value)}
            placeholder={t.contactPage.chat.testPhonePlaceholder}
            className="mt-2 w-full rounded-lg border border-[#D5C7B2] bg-white px-3 py-2 font-mono text-xs text-stone-900 focus:border-[#8C6A3E] focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:focus:border-[#D6C3A5]"
          />
        </div>
      )}

      {/* Selected Product Context Pill */}
      {selectedProduct && (
        <div className="flex items-center justify-between gap-2 border-b border-[#E5DAC8] bg-[#F5EFE4] px-5 py-2.5 text-xs text-[#7A5930] dark:border-stone-800/80 dark:bg-stone-900/50 dark:text-[#E8DAC2]">
          <div className="flex min-w-0 items-center gap-2">
            <Sparkles
              className="size-3.5 shrink-0 text-[#8C6A3E] dark:text-[#D6C3A5]"
              aria-hidden="true"
            />
            <span className="shrink-0">
              {t.contactPage.chat.selectedProductPrefix}
            </span>
            <span className="truncate font-semibold">
              {selectedProduct.name}
            </span>
            <span className="shrink-0 rounded bg-stone-900/10 px-1.5 py-0.5 font-mono text-[10px] dark:bg-stone-800">
              {selectedProduct.sku}
            </span>
          </div>

          <button
            type="button"
            onClick={clearSelectedProduct}
            aria-label="Quitar modelo seleccionado"
            className="shrink-0 cursor-pointer rounded-full p-1 text-stone-500 hover:bg-stone-900/10 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Message Thread */}
      <div
        ref={threadContainerRef}
        className={cn(
          'flex flex-col gap-3.5 overflow-y-auto p-5 sm:p-6',
          isPopup ? 'h-60 sm:h-64' : 'h-80',
        )}
      >
        {messages.map((msg) => {
          const isClient = msg.sender === 'client'
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}
            >
              <span className="mb-1 text-[11px] text-stone-500 dark:text-stone-400">
                {msg.senderName} · {msg.createdAt}
              </span>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  isClient
                    ? 'bg-stone-900 text-[#F5EFE6] dark:bg-[#D6C3A5] dark:text-stone-950'
                    : 'border border-[#E2D6C3] bg-[#F3ECE0]/90 text-stone-900 dark:border-stone-800 dark:bg-stone-900/90 dark:text-stone-100'
                }`}
              >
                {msg.text}
              </div>
            </div>
          )
        })}
      </div>

      {/* Chat Composer & Direct WhatsApp Bridge CTA */}
      <form
        onSubmit={handleSendMessage}
        className="border-t border-[#E5DAC8] bg-[#F3ECE0]/85 p-4 sm:p-5 dark:border-stone-800 dark:bg-stone-900/75"
      >
        <input
          type="text"
          disabled={isOffline}
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder={t.contactPage.chat.namePlaceholder}
          className="mb-2.5 w-full rounded-xl border border-[#D5C7B2] bg-white px-4 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#8C6A3E] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-[#D6C3A5]"
        />

        <div className="flex items-center gap-2">
          <input
            ref={messageInputRef}
            type="text"
            disabled={isOffline}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isOffline
                ? t.contactPage.chat.statusOffline
                : t.contactPage.chat.messagePlaceholder
            }
            className="flex-1 rounded-xl border border-[#D5C7B2] bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#8C6A3E] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-[#D6C3A5]"
          />
          <button
            type="submit"
            disabled={isOffline}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-semibold tracking-wider text-[#F5EFE6] uppercase transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#E8DAC2] dark:text-stone-950 dark:hover:bg-[#F3E9D7]"
          >
            <span>{t.contactPage.chat.sendButton}</span>
            <Send className="size-3.5" aria-hidden="true" />
          </button>
        </div>

        <a
          href={isOffline ? undefined : buildWhatsappHref()}
          target={isOffline ? undefined : '_blank'}
          rel={isOffline ? undefined : 'noopener noreferrer'}
          aria-disabled={isOffline}
          onClick={(e) => {
            if (isOffline) e.preventDefault()
          }}
          className={cn(
            'mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold tracking-[0.16em] uppercase transition-colors',
            isOffline
              ? 'cursor-not-allowed border-stone-400/40 bg-stone-300/60 text-stone-500 dark:border-stone-800 dark:bg-stone-900/50 dark:text-stone-500'
              : 'border-emerald-700/40 bg-emerald-800 text-emerald-50 hover:bg-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-900/60',
          )}
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          <span>{t.contactPage.chat.openWhatsappButton}</span>
        </a>
      </form>
    </section>
  )
}
