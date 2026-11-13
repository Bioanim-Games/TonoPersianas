export type ChatSender = 'client' | 'advisor'

export type ChatChannel = 'web-whatsapp-bridge' | 'whatsapp-direct'

export interface ChatMessage {
  id: string
  sender: ChatSender
  senderName: string
  text: string
  productSlug?: string
  createdAt: string
  status: 'sent' | 'delivered-to-whatsapp'
}
