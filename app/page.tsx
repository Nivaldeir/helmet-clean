import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { HowItWorks } from "@/components/how-it-works"
import { Services } from "@/components/services"
import { Footer } from "@/components/footer"
import { Testimonials } from "@/components/testimonials"
import { FAQ } from "@/components/faq"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <HowItWorks />
      <Services />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  )
}
