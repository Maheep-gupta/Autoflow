'use client'

import { useEffect, useRef, useState } from 'react'
import { MousePointerClick, Settings, Zap } from 'lucide-react'

const steps = [
  {
    icon: MousePointerClick,
    number: 1,
    title: 'Choose a Trigger',
    description: 'Select the app and event that starts your workflow',
  },
  {
    icon: Settings,
    number: 2,
    title: 'Add Actions',
    description: 'Define what happens when the trigger fires',
  },
  {
    icon: Zap,
    number: 3,
    title: 'Run Automation',
    description: 'Deploy instantly and watch it run 24/7',
  },
]

export function HowItWorks() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="how-it-works" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-32 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Build workflows in{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              3 simple steps
            </span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            No coding, no complexity. Just drag, drop, and automate.
          </p>
        </div>

        <div ref={ref} className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={step.number}
                className={`relative transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: isVisible ? `${index * 100}ms` : '0ms',
                }}
              >
                {/* Card */}
                <div className="relative h-full rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-8 hover:border-blue-500/30 transition-all duration-300 group">
                  {/* Glow on hover */}
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10" />

                  {/* Number badge */}
                  <div className="absolute -top-4 -left-4 h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="mb-6 mt-4">
                    <div className="inline-block p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 group-hover:bg-blue-500/20 transition-colors">
                      <Icon className="h-6 w-6 text-blue-400" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-white/60">{step.description}</p>

                  {/* Arrow to next step */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:flex absolute -right-10 top-1/2 -translate-y-1/2 text-white/30 text-3xl">
                      →
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <p className="text-white/40 text-sm mb-4">TRUSTED BY LEADING COMPANIES</p>
          <div className="flex flex-wrap gap-4 justify-center items-center">
            {['TechCorp', 'InnoHub', 'DataFlow', 'CloudSync'].map((company) => (
              <div
                key={company}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/50 text-sm font-medium"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
