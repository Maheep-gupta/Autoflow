'use client'

import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WorkflowMockup } from './workflow-mockup'

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="animate-fade-in">
            <div className="inline-block mb-6 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold">
              ✨ No code, no setup, works in minutes
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Build automations{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                visually
              </span>
              , not manually
            </h1>

            <p className="text-lg md:text-xl text-white/60 mb-8 leading-relaxed max-w-lg">
              Connect apps, automate workflows, and save hours — without writing a single line of code. Build complex automations in minutes with our intuitive visual builder.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 hover:shadow-lg hover:shadow-blue-500/50 transition-all h-12 px-8 text-base">
                  Start Free <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 h-12 px-8 text-base"
              >
                <Play className="h-4 w-4 mr-2" /> See How It Works
              </Button>
            </div>

            <div className="flex items-center gap-2 text-white/50 text-sm">
              <div className="flex -space-x-2">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400" />
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400" />
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-400" />
              </div>
              <span>Trusted by 10,000+ teams worldwide</span>
            </div>
          </div>

          {/* Right Column - Workflow Mockup */}
          <div className="hidden lg:block animate-fade-in-up">
            <WorkflowMockup />
          </div>
        </div>
      </div>
    </section>
  )
}
