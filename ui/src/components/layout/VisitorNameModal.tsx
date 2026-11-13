import { Sparkles, X } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { useLocation } from 'react-router'
import { useChat } from '@/context/ChatContext'
import { useTranslation } from '@/i18n'

export function VisitorNameModal() {
  const { t } = useTranslation()
  const location = useLocation()
  const { hasPromptedName, dismissNamePrompt, clientName } = useChat()
  const [draftName, setDraftName] = useState(clientName)

  const shouldShowModal =
    !hasPromptedName &&
    (location.pathname === '/productos' || location.pathname === '/contacto')

  useEffect(() => {
    if (!shouldShowModal) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        dismissNamePrompt()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shouldShowModal, dismissNamePrompt])

  if (!shouldShowModal) return null

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    dismissNamePrompt(draftName)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="visitor-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Subtle Backdrop (Click to Skip) */}
      <div
        aria-hidden="true"
        onClick={() => dismissNamePrompt()}
        className="fixed inset-0 bg-stone-950/45 backdrop-blur-sm transition-opacity"
      />

      {/* Architectural Personal Welcome Card */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-[#D5C7B2] bg-[#FCF9F4] p-6 text-left shadow-[0_24px_60px_rgba(28,24,21,0.25)] sm:p-8 dark:border-[#D6C3A5]/30 dark:bg-[#25201C] dark:shadow-[0_24px_65px_rgba(0,0,0,0.75)]">
        {/* Top Close / Skip Button */}
        <button
          type="button"
          onClick={() => dismissNamePrompt()}
          aria-label={t.visitorModal.skipButton}
          className="absolute top-5 right-5 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#D5C7B2] bg-[#F5EFE4] text-stone-600 transition-colors hover:border-[#8C6A3E] hover:text-stone-950 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400 dark:hover:border-[#D6C3A5] dark:hover:text-stone-100"
        >
          <X className="size-4" aria-hidden="true" />
        </button>

        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#B89768]/45 bg-[#F5EFE4] px-3.5 py-1 text-[10px] font-semibold tracking-[0.22em] text-[#7A5930] uppercase dark:border-[#D6C3A5]/35 dark:bg-stone-900/80 dark:text-[#E8DAC2]">
          <Sparkles className="size-3 text-[#8C6A3E] dark:text-[#D6C3A5]" />
          <span>{t.visitorModal.eyebrow}</span>
        </div>

        <h2
          id="visitor-modal-title"
          className="font-heading mt-4 text-2xl font-medium text-stone-900 sm:text-3xl dark:text-stone-50"
        >
          {t.visitorModal.title}
        </h2>

        <p className="mt-2.5 text-sm leading-relaxed text-stone-600 dark:text-stone-300/85">
          {t.visitorModal.description}
        </p>

        <form onSubmit={handleSubmit} className="mt-6">
          <input
            type="text"
            autoFocus
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            placeholder={t.visitorModal.inputPlaceholder}
            maxLength={50}
            className="w-full rounded-xl border border-[#D5C7B2] bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#8C6A3E] focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-[#D6C3A5]"
          />

          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row-reverse">
            <button
              type="submit"
              className="inline-flex flex-1 cursor-pointer items-center justify-center rounded-xl bg-stone-900 px-5 py-3 text-xs font-semibold tracking-[0.18em] text-[#F5EFE6] uppercase transition-colors hover:bg-stone-800 dark:bg-[#E8DAC2] dark:text-stone-950 dark:hover:bg-[#F3E9D7]"
            >
              {t.visitorModal.confirmButton}
            </button>

            <button
              type="button"
              onClick={() => dismissNamePrompt()}
              className="inline-flex flex-1 cursor-pointer items-center justify-center rounded-xl border border-[#D5C7B2] bg-[#F5EFE4] px-5 py-3 text-xs font-medium tracking-[0.16em] text-stone-700 uppercase transition-colors hover:border-[#8C6A3E] hover:bg-white hover:text-stone-950 dark:border-stone-700 dark:bg-stone-900/70 dark:text-stone-300 dark:hover:border-[#D6C3A5]/50 dark:hover:text-stone-100"
            >
              {t.visitorModal.skipButton}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
