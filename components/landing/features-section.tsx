'use client'

import { CloudLightning, Code2, Shield, Database } from 'lucide-react'

const features = [
  {
    icon: CloudLightning,
    title: 'Instant Execution',
    description: 'Execute tasks in milliseconds without delays. Your workflows run at lightning speed 24/7.',
    gradient: 'from-yellow-500/20 to-orange-500/20',
    borderColor: 'border-yellow-500/30',
  },
  {
    icon: Code2,
    title: 'No Coding Required',
    description: 'Drag, drop, and automate visually. Build complex workflows without touching a line of code.',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level encryption and compliance with industry standards. Your data stays protected.',
    gradient: 'from-green-500/20 to-emerald-500/20',
    borderColor: 'border-green-500/30',
  },
  {
    icon: Database,
    title: '100+ Integrations',
    description: 'Connect all your favorite apps seamlessly. New integrations added weekly.',
    gradient: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/30',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything you need to{' '}
            <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              automate smarter
            </span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Powerful features designed for teams of all sizes
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className={`group relative rounded-2xl border ${feature.borderColor} bg-linear-to-br ${feature.gradient} backdrop-blur-xl p-8 hover:border-opacity-50 transition-all duration-300 cursor-pointer`}
              >
                {/* Glow effect on hover */}
                <div
                  className={`absolute -inset-1 rounded-2xl bg-linear-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10`}
                />

                {/* Icon container */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="inline-block p-3 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                      <Icon className="h-6 w-6 text-white/80" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3 group-hover:text-transparent group-hover:from-blue-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all">
                  {feature.title}
                </h3>
                <p className="text-white/60 leading-relaxed">{feature.description}</p>

                {/* Focus indicator line */}
                <div className="absolute bottom-0 left-0 h-1 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full w-0 group-hover:w-full transition-all duration-500" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
