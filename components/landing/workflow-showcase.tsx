'use client'

import { Boxes, GripVertical, Zap, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

const nodeTypes = [
  {
    type: 'Trigger',
    icon: Zap,
    description: 'Start your workflow',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
  },
  {
    type: 'Condition',
    icon: Boxes,
    description: 'Add logic',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
  },
  {
    type: 'Action',
    icon: Plus,
    description: 'Make something happen',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
  },
]

export function WorkflowShowcase() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-32 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-32 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Build workflows{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                visually
              </span>
            </h2>
            <p className="text-lg text-white/60 mb-8">
              Drag components onto the canvas, connect them, and watch your automation come to life. No learning curve, no complexity.
            </p>

            <div className="space-y-4 mb-8">
              {nodeTypes.map((nodeType) => {
                const Icon = nodeType.icon
                return (
                  <div
                    key={nodeType.type}
                    className="flex items-start gap-4 p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group cursor-grab active:cursor-grabbing"
                  >
                    <div className={`p-2 rounded-lg ${nodeType.bgColor}`}>
                      <Icon className={`h-5 w-5 ${nodeType.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white">{nodeType.type}</p>
                      <p className="text-sm text-white/50">{nodeType.description}</p>
                    </div>
                    <GripVertical className="h-5 w-5 text-white/20 group-hover:text-white/40 transition-colors mt-1" />
                  </div>
                )
              })}
            </div>

            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 hover:shadow-lg hover:shadow-blue-500/50 transition-all h-12 px-8">
              Create Your First Workflow
            </Button>
          </div>

          {/* Right: Workflow Canvas Mockup */}
          <div className="relative">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl p-8 aspect-square flex flex-col justify-between overflow-hidden">
              {/* Grid background */}
              <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid2)" />
              </svg>

              {/* Canvas content */}
              <div className="relative space-y-6 flex flex-col">
                {/* Sidebar label */}
                <div className="text-xs text-white/40 font-semibold tracking-wider">SELECT APP</div>

                {/* Node 1 */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-red-500/30 border border-red-500/50 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white/60">Trigger</p>
                  </div>
                </div>

                {/* Connection line with animation */}
                <div className="h-6 flex items-center justify-center">
                  <div className="w-0.5 h-full bg-gradient-to-b from-white/30 to-transparent" />
                </div>

                {/* Node 2 */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/30 border border-blue-500/50 flex items-center justify-center animate-pulse">
                    <Boxes className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white/60">Condition</p>
                  </div>
                </div>

                {/* Connection line */}
                <div className="h-6 flex items-center justify-center">
                  <div className="w-0.5 h-full bg-gradient-to-b from-white/30 to-transparent" />
                </div>

                {/* Node 3 */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-500/30 border border-green-500/50 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white/60">Action</p>
                  </div>
                </div>
              </div>

              {/* Add button */}
              <button className="w-full mt-4 py-3 rounded-lg border border-dashed border-white/20 text-white/40 hover:text-white/60 hover:border-white/40 transition-colors text-sm font-medium">
                + Add Node
              </button>
            </div>

            {/* Glow effect */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
