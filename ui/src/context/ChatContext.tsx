import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  DEFAULT_CONTACT_CONFIG,
  type ContactInfoData,
} from '@/config/contactConfig'
import { useTranslation } from '@/i18n'
import { fetchContactInfo, getCachedContactInfo } from '@/services/contactApi'
import type { ProductItem } from '@/types/catalog'
import type { ChatMessage } from '@/types/chat'

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
  readonly setShowTestConfig: (
    show: boolean | ((prev: boolean) => boolean),
  ) => void
  readonly targetWhatsappPhone: string
  readonly setTargetWhatsappPhone: (phone: string) => void
  readonly contactInfo: ContactInfoData
  readonly openProductInquiry: (product: ProductItem) => void
  readonly sendMessage: () => void
  readonly buildWhatsappHref: () => string
}

const ChatContext = createContext<ChatContextValue | null>(null)

function formatTimeNow(): string {
  return new Date().toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const [contactInfo, setContactInfo] = useState<ContactInfoData>(
    () => getCachedContactInfo() ?? DEFAULT_CONTACT_CONFIG,
  )
  const [clientName, setClientName] = useState('')
  const [inputText, setInputText] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(
    null,
  )
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [showTestConfig, setShowTestConfig] = useState(false)
  const [targetWhatsappPhone, setTargetWhatsappPhone] = useState(
    contactInfo.defaultWhatsappDigits,
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

  useEffect(() => {
    let active = true
    fetchContactInfo().then((data) => {
      if (!active) return
      setContactInfo(data)
      setTargetWhatsappPhone(data.defaultWhatsappDigits)
    })
    return () => {
      active = false
    }
  }, [])

  const clearSelectedProduct = useCallback(() => {
    setSelectedProduct(null)
  }, [])

  const openProductInquiry = useCallback(
    (product: ProductItem) => {
      setSelectedProduct(product)
      const prefilledMessage = t.contactPage.chat.productInquiryTemplate
        .replace('{name}', product.name)
        .replace('{sku}', product.sku)
      setInputText(prefilledMessage)
      setIsPopupOpen(true)
    },
    [t.contactPage.chat.productInquiryTemplate],
  )

  const sendMessage = useCallback(() => {
    const trimmed = inputText.trim()
    if (!trimmed) return

    const clientMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'client',
      senderName: clientName.trim() || 'Cliente',
      text: trimmed,
      createdAt: formatTimeNow(),
      status: 'sent',
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
  }, [
    clientName,
    inputText,
    t.brand.name,
    t.contactPage.chat.autoReplyMessage,
  ])

  const buildWhatsappHref = useCallback((): string => {
    const cleanPhone = targetWhatsappPhone.replace(/\D/g, '')
    const clientHistory = messages
      .filter((m) => m.sender === 'client')
      .map((m) => m.text)
      .join(' | ')
    const draft = inputText.trim()
    const combinedText = [
      `Hola ${t.brand.name}`,
      clientName.trim() ? `Soy ${clientName.trim()}.` : '',
      selectedProduct
        ? `Modelo: ${selectedProduct.name} (${selectedProduct.sku}).`
        : '',
      clientHistory || draft || 'Me gustaría solicitar una cotización.',
    ]
      .filter(Boolean)
      .join(' ')

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(combinedText)}`
  }, [clientName, inputText, messages, selectedProduct, t.brand.name, targetWhatsappPhone])

  const value = useMemo<ChatContextValue>(
    () => ({
      messages,
      clientName,
      setClientName,
      inputText,
      setInputText,
      selectedProduct,
      clearSelectedProduct,
      isPopupOpen,
      setIsPopupOpen,
      showTestConfig,
      setShowTestConfig,
      targetWhatsappPhone,
      setTargetWhatsappPhone,
      contactInfo,
      openProductInquiry,
      sendMessage,
      buildWhatsappHref,
    }),
    [
      messages,
      clientName,
      inputText,
      selectedProduct,
      clearSelectedProduct,
      isPopupOpen,
      showTestConfig,
      targetWhatsappPhone,
      contactInfo,
      openProductInquiry,
      sendMessage,
      buildWhatsappHref,
    ],
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext)
  if (!ctx) {
    throw new Error('useChat debe usarse dentro de un ChatProvider')
  }
  return ctx
}
