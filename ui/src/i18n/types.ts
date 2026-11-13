import type { LightControlType } from '@/types/catalog'
import type { NavRouteId } from '@/types/navigation'

export type Locale = 'es' | 'en'

export interface FeatureHighlightItem {
  id: 'bespoke' | 'light-control' | 'installation'
  title: string
  description: string
}

export interface TranslationDictionary {
  brand: {
    name: string
    monogram: string
    category: string
    tagline: string
  }
  nav: Record<NavRouteId, string>
  mobileMenu: {
    openAriaLabel: string
    closeAriaLabel: string
    sectionTitle: string
  }
  theme: {
    lightModeLabel: string
    darkModeLabel: string
    toggleAriaLabel: string
  }
  hero: {
    eyebrow: string
    titleLine1: string
    titleAccent: string
    description: string
    primaryCta: string
    secondaryCta: string
    scrollHint: string
  }
  highlights: readonly FeatureHighlightItem[]
  productsPage: {
    eyebrow: string
    title: string
    subtitle: string
    allCategoriesLabel: string
    priceUnitLabel: string
    dimensionsLabel: string
    inquireCta: string
    featuredBadge: string
    imageOfflineLabel: string
    lightControlLabels: Record<LightControlType, string>
  }
  contactPage: {
    eyebrow: string
    title: string
    subtitle: string
    directChannelsTitle: string
    phoneLabel: string
    emailLabel: string
    socialTitle: string
    facebookLabel: string
    instagramLabel: string
    mapTitle: string
    mapSubtitle: string
    openMapsCta: string
    mapOfflineLabel: string
    chat: {
      title: string
      statusOnline: string
      statusOffline: string
      offlineBannerTitle: string
      offlineBannerDescription: string
      openPopupAriaLabel: string
      closePopupAriaLabel: string
      floatingLauncherLabel: string
      productInquiryTemplate: string
      selectedProductPrefix: string
      welcomeMessage: string
      autoReplyMessage: string
      namePlaceholder: string
      messagePlaceholder: string
      sendButton: string
      openWhatsappButton: string
      testModeTitle: string
      testModeDescription: string
      testPhonePlaceholder: string
    }
  }
}
