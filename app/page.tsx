'use client'

import { Navbar } from '@/components/landing/navbar'
import { HeroSection } from '@/components/landing/hero-section'
import { HowItWorks } from '@/components/landing/how-it-works'
import { FeaturesSection } from '@/components/landing/features-section'
import { IntegrationsSection } from '@/components/landing/integrations-section'
import { WorkflowShowcase } from '@/components/landing/workflow-showcase'
import { PricingSection } from '@/components/landing/pricing-section'
import { CTASection } from '@/components/landing/cta-section'
import { Footer } from '@/components/landing/footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Main content */}
      <main className="relative">
        <HeroSection />
        <HowItWorks />
        <FeaturesSection />
        <IntegrationsSection />
        <WorkflowShowcase />
        <PricingSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  )
}
