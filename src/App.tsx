import { SmoothScroll } from './components/SmoothScroll'
import { CardsShowcase } from './sections/Cards'
import { FinalCta } from './sections/FinalCta'
import { Footer } from './sections/Footer'
import { Hero } from './sections/Hero'
import { Insurance } from './sections/Insurance'
import { Investments } from './sections/Investments'
import { Nav } from './sections/Nav'
import { PhoneShowcase } from './sections/PhoneShowcase'
import { PixInstallments } from './sections/PixInstallments'
import { Products } from './sections/Products'
import { ScrollStatement } from './sections/ScrollStatement'

export default function App() {
  return (
    <SmoothScroll>
      <Nav />
      <main>
        <Hero />
        <PhoneShowcase />
        <Products />
        <ScrollStatement />
        <CardsShowcase />
        <PixInstallments />
        <Investments />
        <Insurance />
        <FinalCta />
      </main>
      <Footer />
    </SmoothScroll>
  )
}
