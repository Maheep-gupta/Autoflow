'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const plans = [
  {
    name: 'Starter',
    price: { monthly: 29, yearly: 290 },
    description: 'Perfect for individuals',
    features: [
      'Up to 10 workflows',
      '1,000 executions/month',
      'Basic integrations (20+)',
      'Email support',
      'Community access',
    ],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: { monthly: 99, yearly: 990 },
    description: 'For growing teams',
    features: [
      'Unlimited workflows',
      '100,000 executions/month',
      'All integrations (100+)',
      'Priority support',
      'Advanced analytics',
      'Team collaboration',
      'Custom domains',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: { monthly: null, yearly: null },
    description: 'For large organizations',
    features: [
      'Unlimited everything',
      'Dedicated support 24/7',
      'Custom integrations',
      'SLA guarantee',
      'Advanced security',
      'On-prem deployment',
      'Custom contracts',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
]

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false)

  const getPrice = (plan: (typeof plans)[0]) => {
    if (plan.price.monthly === null) return 'Custom'
    return isYearly ? `$${plan.price.yearly}` : `$${plan.price.monthly}`
  }

  const getPeriod = (plan: (typeof plans)[0]) => {
    if (plan.price.monthly === null) return ''
    return isYearly ? '/year' : '/month'
  }

  return (
    <section id="pricing" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl transform -translate-x-1/2" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, transparent{' '}
            <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              pricing
            </span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-8">
            Choose the plan that fits your needs. Always cancel anytime.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-4 p-1 rounded-full bg-white/10 border border-white/20">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                !isYearly
                  ? ' from-blue-500 to-cyan-500 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                isYearly
                  ? ' from-blue-500 to-cyan-500 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Yearly <span className="text-xs ml-2 bg-green-500/30 border border-green-500/50 rounded px-2 py-0.5">Save 17%</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative group rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
                plan.highlighted
                  ? 'border-blue-500/50 bg-linear-to-br from-blue-500/20 to-cyan-500/10 scale-105 md:scale-105 shadow-2xl shadow-blue-500/20'
                  : 'border-white/10  hover:border-white/20'
              }`}
            >
              {/* Glow effect for highlighted */}
              {plan.highlighted && (
                <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-blue-500/30 to-cyan-500/30 blur-xl opacity-50 group-hover:opacity-70 transition-opacity -z-10" />
              )}

              <div className="p-8">
                {/* Badge */}
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full text-xs font-bold bg-linear-to-r from-blue-500 to-cyan-500 text-white">
                      ⭐ MOST POPULAR
                    </span>
                  </div>
                )}

                {/* Plan name and description */}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-white/50 text-sm mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{getPrice(plan)}</span>
                    {plan.price.monthly !== null && (
                      <span className="text-white/50">{getPeriod(plan)}</span>
                    )}
                  </div>
                  <p className="text-xs text-white/40 mt-2">Cancel anytime. No hidden fees.</p>
                </div>

                {/* CTA Button */}
                <Link href="/dashboard" className="w-full block mb-8">
                  <Button
                    className={`w-full h-12 font-semibold transition-all ${
                      plan.highlighted
                        ? 'bg-linear-to-r from-blue-500 to-cyan-500 text-white border-0 hover:shadow-lg hover:shadow-blue-500/50'
                        : 'border border-white/20 text-white hover:bg-white/10'
                    }`}
                    variant={plan.highlighted ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </Link>

                {/* Features list */}
                <div className="space-y-3 border-t border-white/10 pt-8">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                      <span className="text-white/70 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ hint */}
        <div className="text-center mt-12">
          <p className="text-white/50 text-sm">
            Questions about pricing? <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">Check our FAQ</a>
          </p>
        </div>
      </div>
    </section>
  )
}
