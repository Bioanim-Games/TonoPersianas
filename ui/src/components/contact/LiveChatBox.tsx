import { MessageCircle, Send, Settings2, Sparkles } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { DEFAULT_CONTACT_CONFIG } from '@/config/contactConfig'
import { useTranslation } from '@/i18n'
import type { ChatMessage } from '@/types/chat'

export interface LiveChatBoxProps {
  selectedProductSlug: string | null
}

function formatTimeNow(): string {
  return new Date().toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function LiveChatBox({ selectedProductSlug }: LiveChatBoxProps) {
  const { t } = useTranslation()
  const [clientName, setClientName] = useState('')
  const [inputText, setInputText] = useState('')
  const [showTestConfig, setShowTestConfig] = useState(false)
  const [targetWhatsappPhone, setTargetWhatsappPhone] = useState(
    DEFAULT_CONTACT_CONFIG.defaultWhatsappDigits,
  )
  const [messages, setMessages] = useState<readonly ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      sender: 'advisor',
      senderName: t.brand.name,
      text: t.contactPage.chat.welcomeMessage,
      createdAt: formatTimeNow(),
      status: 'sent',
    },
  ])

  function handleSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = inputText.trim()
    if (!trimmed) return

    const clientMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'client',
      senderName: clientName.trim() || 'Cliente',
      text: trimmed,
      productSlug: selectedProductSlug ?? undefined,
      createdAt: formatTimeNow(),
      status: 'delivered-to-whatsapp',
    }

    const replyMsg: ChatMessage = {
      id: `reply-${Date.now() + 1}`,
      sender: 'advisor',
      senderName: t.brand.name,
      text: t.contactPage.chat.autoReplyMessage,
      createdAt: formatTimeNow(),
      status: 'sent',
    }

    setMessages((prev) => [...prev, clientMsg, replyMsg])
    setInputText('')
  }

  function buildWhatsappHref(): string {
    const cleanPhone = targetWhatsappPhone.replace(/\D/g, '')
    const clientHistory = messages
      .filter((m) => m.sender === 'client')
      .map((m) => m.text)
      .join(' | ')
    const draft = inputText.trim()
    const combinedText = [
      `Hola ${t.brand.name}`,
      clientName.trim() ? `Soy ${clientName.trim()}.` : '',
      selectedProductSlug ? `Modelo: ${selectedProductSlug}.` : '',
      clientHistory || draft || 'Me gustaría solicitar una cotización.',
    ]
      .filter(Boolean)
      .join(' ')

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(combinedText)}`
  }

  return (
    <section
      aria-label={t.contactPage.chat.title}
      className="flex flex-col overflow-hidden rounded-2xl border border-[#DFD3C0] bg-[#FCF9F4] text-left text-stone-900 shadow-[0_14px_36px_rgba(28,24,21,0.09)] dark:border-stone-800/90 dark:bg-[#25201C] dark:text-stone-100 dark:shadow-[0_16px_40px_rgba(0,0,0,0.4)]"
    >
      {/* Chat Header */}
      <div className="flex items-center justify-between gap-3 border-b border-[#E5DAC8] bg-[#F3ECE0] px-6 py-4 dark:border-stone-800 dark:bg-stone-900/90">
        <div>
          <h2 className="font-heading text-xl font-medium text-stone-900 dark:text-stone-50">
            {t.contactPage.chat.title}
          </h2>
          <p className="mt-1 flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] dark:bg-emerald-400" />
            <span>{t.contactPage.chat.statusOnline}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowTestConfig((v) => !v)}
          title={t.contactPage.chat.testModeTitle}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#C8B89E] bg-white px-3 py-1.5 text-[11px] font-medium text-stone-700 transition-colors hover:border-[#8C6A3E] hover:text-stone-950 dark:border-stone-700 dark:bg-stone-800/80 dark:text-stone-300 dark:hover:border-[#D6C3A5] dark:hover:text-stone-100"
        >
          <Settings2
            className="size-3.5 text-[#8C6A3E] dark:text-[#D6C3A5]"
            aria-hidden="true"
          />
          <span>Prueba WA</span>
        </button>
      </div>

      {/* Collapsible Personal Phone Test Mode Bar */}
      {showTestConfig && (
        <div className="border-b border-[#E5DAC8] bg-[#F7F2E8] px-6 py-3.5 text-xs dark:border-stone-800 dark:bg-stone-900/70">
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
      {selectedProductSlug && (
        <div className="flex items-center gap-2 border-b border-[#E5DAC8] bg-[#F5EFE4] px-6 py-2.5 text-xs text-[#7A5930] dark:border-stone-800/80 dark:bg-stone-900/50 dark:text-[#E8DAC2]">
          <Sparkles
            className="size-3.5 text-[#8C6A3E] dark:text-[#D6C3A5]"
            aria-hidden="true"
          />
          <span>{t.contactPage.chat.selectedProductPrefix}</span>
          <span className="font-mono font-semibold">{selectedProductSlug}</span>
        </div>
      )}

      {/* Message Thread */}
      <div className="flex h-80 flex-col gap-3.5 overflow-y-auto p-6">
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
        className="border-t border-[#E5DAC8] bg-[#F3ECE0]/85 p-5 dark:border-stone-800 dark:bg-stone-900/75"
      >
        <input
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder={t.contactPage.chat.namePlaceholder}
          className="mb-2.5 w-full rounded-xl border border-[#D5C7B2] bg-white px-4 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#8C6A3E] focus:outline-none dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-[#D6C3A5]"
        />

        <div className="flex items-center gap-2.5">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.contactPage.chat.messagePlaceholder}
            className="flex-1 rounded-xl border border-[#D5C7B2] bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#8C6A3E] focus:outline-none dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-[#D6C3A5]"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-xs font-semibold tracking-wider text-[#F5EFE6] uppercase transition-colors hover:bg-stone-800 dark:bg-[#E8DAC2] dark:text-stone-950 dark:hover:bg-[#F3E9D7]"
          >
            <span>{t.contactPage.chat.sendButton}</span>
            <Send className="size-3.5" aria-hidden="true" />
          </button>
        </div>

        <a
          href={buildWhatsappHref()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3.5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-700/40 bg-emerald-800 px-4 py-3 text-xs font-semibold tracking-[0.16em] text-emerald-50 uppercase transition-colors hover:bg-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-900/60"
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          <span>{t.contactPage.chat.openWhatsappButton}</span>
        </a>
      </form>
    </section>
  )
}
