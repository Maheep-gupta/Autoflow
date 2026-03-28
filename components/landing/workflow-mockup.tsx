'use client'

import { Mail, Filter, Send, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Node {
  id: string
  label: string
  icon: React.ReactNode
  x: number
  y: number
  color: string
  glowing: boolean
}

export function WorkflowMockup() {
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: 'trigger',
      label: 'Gmail',
      icon: <Mail className="h-5 w-5" />,
      x: 50,
      y: 50,
      color: 'bg-red-500/20 border-red-500/50',
      glowing: false,
    },
    {
      id: 'filter',
      label: 'Filter',
      icon: <Filter className="h-5 w-5" />,
      x: 50,
      y: 50,
      color: 'bg-blue-500/20 border-blue-500/50',
      glowing: false,
    },
    {
      id: 'action',
      label: 'Slack',
      icon: <Send className="h-5 w-5" />,
      x: 50,
      y: 50,
      color: 'bg-purple-500/20 border-purple-500/50',
      glowing: false,
    },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setNodes((prev) =>
        prev.map((node, index) => ({
          ...node,
          glowing: (index + Math.floor(Date.now() / 500)) % 3 === 0,
        }))
      )
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative">
      {/* Glassmorphic frame */}
      <div className="relative h-96 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Nodes and connections */}
        <div className="relative h-full flex flex-col justify-around">
          {/* Node 1: Trigger */}
          <div className="flex items-center gap-6">
            <div
              className={`flex-shrink-0 h-14 w-14 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
                nodes[0].glowing
                  ? 'border-red-400 bg-red-500/30 shadow-lg shadow-red-500/50'
                  : 'border-red-500/50 bg-red-500/10'
              }`}
            >
              <Mail className="h-6 w-6 text-red-400" />
            </div>
            <div className="flex-1">
              <p className="text-white/70 text-sm font-medium">Trigger: Gmail</p>
              <p className="text-white/40 text-xs">New email arrives</p>
            </div>
          </div>

          {/* Connection line */}
          <div className="flex justify-start pl-7">
            <div className="text-white/30">↓</div>
          </div>

          {/* Node 2: Filter */}
          <div className="flex items-center gap-6">
            <div
              className={`flex-shrink-0 h-14 w-14 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
                nodes[1].glowing
                  ? 'border-blue-400 bg-blue-500/30 shadow-lg shadow-blue-500/50'
                  : 'border-blue-500/50 bg-blue-500/10'
              }`}
            >
              <Filter className="h-6 w-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-white/70 text-sm font-medium">Filter: Condition</p>
              <p className="text-white/40 text-xs">Check if important</p>
            </div>
          </div>

          {/* Connection line */}
          <div className="flex justify-start pl-7">
            <div className="text-white/30">↓</div>
          </div>

          {/* Node 3: Action */}
          <div className="flex items-center gap-6">
            <div
              className={`flex-shrink-0 h-14 w-14 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
                nodes[2].glowing
                  ? 'border-purple-400 bg-purple-500/30 shadow-lg shadow-purple-500/50'
                  : 'border-purple-500/50 bg-purple-500/10'
              }`}
            >
              <Send className="h-6 w-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-white/70 text-sm font-medium">Action: Send Message</p>
              <p className="text-white/40 text-xs">Post to Slack channel</p>
            </div>
          </div>
        </div>
      </div>

      {/* Glow effect */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-xl -z-10" />
    </div>
  )
}
