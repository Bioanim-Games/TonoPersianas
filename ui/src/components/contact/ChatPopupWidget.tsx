import { cn } from 'cn'
import { MessageCircle } from 'lucide-react'
import { useLocation } from 'react-router'
import { LiveChatBox } from '@/components/contact/LiveChatBox'
import { useChat } from '@/context/ChatContext'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'
import { useTranslation } from '@/i18n'

export function ChatPopupWidget() {
  const { t } = useTranslation()
  const location = useLocation()
  const { isOffline } = useNetworkStatus()
  const { isPopupOpen, setIsPopupOpen, selectedProduct } = useChat()

  // On /contacto, the full inline LiveChatBox is already displayed on the page
  if (location.pathname === '/contacto') {
    return null
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6">
      {isPopupOpen ? (
        <div className="w-[calc(100vw-2rem)] max-w-md animate-in fade-in slide-in-from-bottom-4 duration-200">
          <LiveChatBox isPopup onClosePopup={() => setIsPopupOpen(false)} />
        </div>
      ) : (
        <button
          type="button"
          aria-label={t.contactPage.chat.openPopupAriaLabel}
          onClick={() => setIsPopupOpen(true)}
          className={cn(
            'group flex cursor-pointer items-center gap-3 rounded-full border px-5 py-3.5 shadow-[0_14px_35px_rgba(28,24,21,0.22)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5',
            'border-[#9E7B4F]/60 bg-stone-900 text-[#F5EFE6] hover:border-[#D6C3A5] hover:bg-stone-800',
            'dark:border-[#D6C3A5]/55 dark:bg-[#25201C]/95 dark:text-[#E8DAC2] dark:shadow-[0_16px_40px_rgba(0,0,0,0.6)] dark:hover:border-[#D6C3A5]',
          )}
        >
          <span className="relative flex items-center justify-center">
            <MessageCircle
              className="size-4 text-[#D6C3A5] transition-transform duration-300 group-hover:scale-110"
              aria-hidden="true"
            />
            <span
              aria-hidden="true"
              className={cn(
                'absolute -top-1 -right-1 h-2 w-2 rounded-full',
                isOffline
                  ? 'bg-amber-500 shadow-[0_0_6px_#f59e0b]'
                  : 'bg-emerald-500 shadow-[0_0_6px_#10b981]',
              )}
            />
          </span>

          <span className="text-xs font-semibold tracking-[0.18em] uppercase">
            {t.contactPage.chat.floatingLauncherLabel}
          </span>

          {selectedProduct && (
            <span className="rounded-full bg-[#D6C3A5] px-2 py-0.5 font-mono text-[10px] font-bold text-stone-950">
              {selectedProduct.sku}
            </span>
          )}
        </button>
      )}
    </div>
  )
}
