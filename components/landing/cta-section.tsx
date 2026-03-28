'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CTASection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/4 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-2xl" />
      </div>

      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Ready to{' '}
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            automate your work?
          </span>
        </h2>

        <p className="text-xl text-white/60 mb-10 max-w-lg mx-auto">
          Start building workflows in minutes. No credit card required. Get instant access to all features.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/dashboard">
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 hover:shadow-lg hover:shadow-blue-500/50 transition-all h-12 px-8 text-base">
              Start Free Trial <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <a
            href="mailto:support@workflow.app"
            className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
          >
            Schedule a demo
          </a>
        </div>

        {/* Trust line */}
        <div className="mt-12 text-white/40 text-sm">
          <p>✓ 10,000+ teams trusted us • ✓ 99.9% uptime • ✓ Data stored securely</p>
        </div>
      </div>
    </section>
  )
}
