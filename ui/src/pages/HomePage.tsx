import heroBgImage from '@/assets/Gemini_Generated_Image_866yuw866yuw866y.jpg'
import { FeatureHighlights } from '@/components/home/FeatureHighlights'
import { HeroSection } from '@/components/home/HeroSection'
import { useTranslation } from '@/i18n'

export function HomePage() {
  const { t } = useTranslation()

  return (
    <main className="relative flex min-h-svh w-full flex-col justify-between overflow-hidden bg-[#F5F0E6] dark:bg-stone-950">
      {/* Home-Scoped Architectural Blind Background Image */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <img
          src={heroBgImage}
          alt={t.brand.name}
          className="h-full w-full object-cover object-center"
        />

        {/* Light Theme: Natural bright image with only a subtle warm-alabaster left sheen for text clarity */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6EE]/65 via-[#FAF6EE]/20 to-transparent dark:from-stone-950/85 dark:via-stone-950/50 dark:to-stone-950/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F5F0E6]/35 via-transparent to-transparent dark:from-stone-950/75 dark:via-transparent dark:to-stone-950/40" />
      </div>

      {/* Main Editorial Hero Content */}
      <HeroSection />

      {/* Bottom Glass Feature Strip */}
      <FeatureHighlights />
    </main>
  )
}
