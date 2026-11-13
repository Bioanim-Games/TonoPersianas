import type { TranslationDictionary } from '@/i18n/types'

export const es: TranslationDictionary = {
  brand: {
    name: 'Toño Persianas',
    monogram: 'TOÑO',
    category: 'PERSIANAS',
    tagline: 'Diseño arquitectónico en control de luz',
  },
  nav: {
    home: 'Inicio',
    products: 'Productos',
    contact: 'Contacto',
  },
  mobileMenu: {
    openAriaLabel: 'Abrir menú de navegación',
    closeAriaLabel: 'Cerrar menú de navegación',
    sectionTitle: 'Navegación Principal',
  },
  theme: {
    lightModeLabel: 'Luz de Día',
    darkModeLabel: 'Modo Nocturno',
    toggleAriaLabel: 'Cambiar entre modo claro y oscuro',
  },
  hero: {
    eyebrow: 'COLECCIÓN ARQUITECTÓNICA RESIDENCIAL',
    titleLine1: 'La elegancia de la luz,',
    titleAccent: 'diseñada a tu medida.',
    description:
      'En Toño Persianas transformamos cada espacio con persianas de alta gama que armonizan privacidad, calidez y estética contemporánea.',
    primaryCta: 'Explorar Colección',
    secondaryCta: 'Solicitar Asesoría',
    scrollHint: 'Calidad y precisión en cada detalle',
  },
  highlights: [
    {
      id: 'bespoke',
      title: 'Diseño a Medida',
      description:
        'Fabricación personalizada que se adapta con precisión milimétrica a tus ventanales.',
    },
    {
      id: 'light-control',
      title: 'Control de Luz y Privacidad',
      description:
        'Tejidos selectos traslúcidos y blackout para crear la atmósfera perfecta en todo momento.',
    },
    {
      id: 'installation',
      title: 'Instalación Profesional',
      description:
        'Asesoría personalizada en sitio y montaje impecable por especialistas.',
    },
  ],
  productsPage: {
    eyebrow: 'CATÁLOGO ARQUITECTÓNICO TOÑO PERSIANAS',
    title: 'Colección de Persianas a Medida',
    subtitle:
      'Explora nuestras líneas de control solar, privacidad y diseño textil. Cada persiana es fabricada a la medida exacta de tus espacios.',
    allCategoriesLabel: 'Todas las Colecciones',
    priceUnitLabel: 'm² desde',
    dimensionsLabel: 'Medidas disponibles',
    inquireCta: 'Consultar este modelo',
    featuredBadge: 'Destacado',
    lightControlLabels: {
      duo: 'Dúo / Sheer Elegance',
      blackout: 'Blackout 100%',
      traslucida: 'Filtro Solar Traslúcido',
      'semi-opaca': 'Confort Semi-Opaco',
    },
  },
  contactPage: {
    eyebrow: 'ATENCIÓN PERSONALIZADA Y UBICACIÓN',
    title: 'Hablemos de tu Proyecto',
    subtitle:
      'Escríbenos en nuestro chat en línea conectado con WhatsApp Business, contáctanos por teléfono o correo, o visítanos en nuestra ubicación.',
    directChannelsTitle: 'Canales de Atención Directa',
    phoneLabel: 'Teléfono y WhatsApp Oficial',
    emailLabel: 'Correo Electrónico',
    socialTitle: 'Síguenos en Redes Sociales',
    facebookLabel: 'Facebook Oficial',
    instagramLabel: 'Instagram Oficial',
    mapTitle: 'Ubicación de Toño Persianas',
    mapSubtitle:
      'Consulta nuestra ubicación en Google Maps para visitarnos o agendar toma de medidas a domicilio.',
    openMapsCta: 'Abrir ubicación en Google Maps',
    chat: {
      title: 'Chat en Línea · Toño Persianas',
      statusOnline: 'Conectado con WhatsApp Business',
      statusOffline: 'Sin conexión · Chat en pausa',
      offlineBannerTitle: 'Modo sin conexión activo',
      offlineBannerDescription:
        'Puedes explorar el catálogo y nuestros datos de contacto sin internet. El chat en línea y el envío a WhatsApp se reactivarán automáticamente al recuperar tu conexión.',
      selectedProductPrefix: 'Modelo de interés:',
      welcomeMessage:
        '¡Hola! Bienvenido a Toño Persianas. ¿En qué modelo o medidas podemos asesorarte hoy?',
      autoReplyMessage:
        'Mensaje registrado. Puedes seguir escribiendo aquí o pulsar "Continuar en WhatsApp" para enviar esta conversación directo a nuestro WhatsApp.',
      namePlaceholder: 'Tu nombre (opcional)',
      messagePlaceholder: 'Escribe tu mensaje o las medidas de tu ventana...',
      sendButton: 'Enviar',
      openWhatsappButton: 'Continuar en WhatsApp',
      testModeTitle: 'Modo Prueba WhatsApp (Teléfono Personal)',
      testModeDescription:
        'Ingresa tu número personal (con código de país, ej. 5233...) para probar el envío de WhatsApp sin usar el teléfono oficial.',
      testPhonePlaceholder: 'Ej. 523333773415',
    },
  },
}
