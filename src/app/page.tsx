import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { MenusSection } from "@/components/landing/menus-section"
import { BrandSection } from "@/components/landing/brand-section"
import { SiteFooter } from "@/components/landing/footer"

export default function Page() {
  return (
    <main>
      <Navbar />
      <Hero />
      <BrandSection />
      <MenusSection />
      <SiteFooter />
      <img
        src="/images/mockups/landing-reference.png"
        alt="Design reference of Hafrin Coffee landing layout"
        className="hidden"
        aria-hidden="true"
      />
    </main>
  )
}