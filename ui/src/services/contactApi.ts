import {
  DEFAULT_CONTACT_CONFIG,
  type ContactInfoData,
} from '@/config/contactConfig'

let cachedContactInfo: ContactInfoData | null = null

export function getCachedContactInfo(): ContactInfoData | null {
  return cachedContactInfo
}

export async function fetchContactInfo(): Promise<ContactInfoData> {
  try {
    const res = await fetch('/bff/contact-info', {
      credentials: 'same-origin',
    })
    if (!res.ok) {
      cachedContactInfo = DEFAULT_CONTACT_CONFIG
      return DEFAULT_CONTACT_CONFIG
    }
    const data = (await res.json()) as ContactInfoData
    cachedContactInfo = data
    return data
  } catch {
    cachedContactInfo = DEFAULT_CONTACT_CONFIG
    return DEFAULT_CONTACT_CONFIG
  }
}
