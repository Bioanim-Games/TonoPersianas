import {
  DEFAULT_CONTACT_CONFIG,
  type ContactInfoData,
} from '@/config/contactConfig'
import {
  fetchWithOfflineCache,
  readCachedData,
} from '@/services/offlineCache'

const CONTACT_INFO_CACHE_KEY = 'business_contact_info'

export function getCachedContactInfo(): ContactInfoData | null {
  return readCachedData<ContactInfoData>(CONTACT_INFO_CACHE_KEY)
}

export async function fetchContactInfo(): Promise<ContactInfoData> {
  return fetchWithOfflineCache<ContactInfoData>(
    CONTACT_INFO_CACHE_KEY,
    '/bff/contact-info',
    DEFAULT_CONTACT_CONFIG,
  )
}
