import { BrowserRouter, Route, Routes } from 'react-router'
import { Navbar } from '@/components/layout/Navbar'
import { I18nProvider } from '@/i18n'
import { ContactPage } from '@/pages/ContactPage'
import { HomePage } from '@/pages/HomePage'
import { ProductsPage } from '@/pages/ProductsPage'
import { ThemeProvider } from '@/theme'

export function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <I18nProvider defaultLocale="es">
        <BrowserRouter>
          <div className="relative min-h-svh w-full">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/productos" element={<ProductsPage />} />
              <Route path="/contacto" element={<ContactPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </I18nProvider>
    </ThemeProvider>
  )
}

export default App
