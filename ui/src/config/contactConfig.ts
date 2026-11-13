export interface ContactInfoData {
  displayPhone: string
  phoneHref: string
  defaultWhatsappDigits: string
  email: string
  emailHref: string
  facebookUrl: string
  instagramUrl: string
  googleMapsUrl: string
  googleMapsEmbedUrl: string
}

/**
 * Default contact & social configuration for Toño Persianas.
 * Structured as ContactInfoData so it can be hydrated directly from
 * the SQLite database (/api/contact-info) in the next API task.
 */
export const DEFAULT_CONTACT_CONFIG: ContactInfoData = {
  displayPhone: '+52 33 3377 3415',
  phoneHref: 'tel:+523333773415',
  defaultWhatsappDigits:
    (import.meta.env.VITE_WHATSAPP_TEST_PHONE as string | undefined) ??
    '523333773415',
  email: 'tpersianas@gmail.com',
  emailHref: 'mailto:tpersianas@gmail.com',
  facebookUrl: 'https://www.facebook.com/tonopersianas/?locale=es_LA',
  instagramUrl: 'https://www.instagram.com/tonopersianas/?hl=es',
  googleMapsUrl:
    'https://www.google.com/maps/place/To%C3%B1o+Persianas/data=!4m2!3m1!1s0x0:0x42ab028be436b030?sa=X&ved=1t:2428&ictx=111',
  googleMapsEmbedUrl:
    'https://maps.google.com/maps?q=To%C3%B1o+Persianas+Zapopan+Jalisco&t=&z=16&ie=UTF8&iwloc=&output=embed',
}
