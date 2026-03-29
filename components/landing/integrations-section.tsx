'use client'

import { Mail, MessageCircle, CreditCard, FileText, GitBranch, CheckCircle } from 'lucide-react'
import { ArrowRight } from 'lucide-react'

const integrations = [
  {
    from: { icon: Mail, label: 'Gmail', color: 'from-red-500 to-pink-500' },
    to: { icon: MessageCircle, label: 'Slack', color: 'from-purple-500 to-blue-500' },
    useCase: 'Send Slack alert when email arrives',
    description: 'Get instant notifications for important emails',
  },
  {
    from: { icon: CreditCard, label: 'Stripe', color: 'from-blue-500 to-cyan-500' },
    to: { icon: FileText, label: 'Google Sheets', color: 'from-green-500 to-emerald-500' },
    useCase: 'Log every payment automatically',
    description: 'Track all transactions in your spreadsheet',
  },
  {
    from: { icon: GitBranch, label: 'GitHub', color: 'from-gray-500 to-slate-500' },
    to: { icon: CheckCircle, label: 'Asana', color: 'from-blue-600 to-indigo-600' },
    useCase: 'Create tasks from pull requests',
    description: 'Automatically track code reviews as tasks',
  },
  {
    from: { icon: MessageCircle, label: 'Discord', color: 'from-indigo-500 to-purple-600' },
    to: { icon: FileText, label: 'Notion', color: 'from-gray-600 to-gray-700' },
    useCase: 'Save Discord messages to Notion',
    description: 'Archive important conversations automatically',
  },
]

export function IntegrationsSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-40 left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Smart use-case{' '}
            <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              integrations
            </span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            See real workflows that teams are building every day. 100+ apps ready to connect.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {integrations.map((integration, index) => {
            const FromIcon = integration.from.icon
            const ToIcon = integration.to.icon
            return (
              <div
                key={index}
                className="group relative rounded-2xl border border-white/10  backdrop-blur-xl p-8 hover:border-blue-500/30 transition-all duration-300 overflow-hidden"
              >
                {/* Background glow */}
                <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10" />

                {/* Integration flow */}
                <div className="flex items-center justify-between mb-6">
                  {/* From */}
                  <div className="flex flex-col items-center flex-1">
                    <div className={`p-4 rounded-xl  ${integration.from.color} mb-3 shadow-lg`}>
                      <FromIcon className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-white/70">{integration.from.label}</p>
                  </div>

                  {/* Arrow */}
                  <div className="flex-1 flex justify-center">
                    <div className="text-white/30 group-hover:text-white/60 transition-colors transform group-hover:scale-110">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>

                  {/* To */}
                  <div className="flex flex-col items-center flex-1">
                    <div className={`p-4 rounded-xl  ${integration.to.color} mb-3 shadow-lg`}>
                      <ToIcon className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-white/70">{integration.to.label}</p>
                  </div>
                </div>

                {/* Use case */}
                <div className="border-t border-white/10 pt-4">
                  <p className="font-semibold text-white mb-2">{integration.useCase}</p>
                  <p className="text-white/50 text-sm">{integration.description}</p>
                </div>

                {/* Tooltip on hover */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-xs px-2 py-1 rounded bg-blue-500/20 border border-blue-500/30 text-blue-300">
                    Click to add
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Explore more link */}
        <div className="text-center mt-12">
          <a href="#" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium">
            Explore all 100+ integrations <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
