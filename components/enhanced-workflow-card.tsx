'use client'

import { useState } from 'react'
import { Workflow } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { formatTime, formatDateTime } from '@/lib/date-utils'
import { ChevronDown, Play, Pause, Edit2, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface EnhancedWorkflowCardProps {
  workflow: Workflow
}

export function EnhancedWorkflowCard({ workflow }: EnhancedWorkflowCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isRunning, setIsRunning] = useState(false)

  const handleRunNow = async () => {
    setIsRunning(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsRunning(false)
    toast.success(`Workflow "${workflow.name}" started running!`, {
      description: `Execution ID: exec-${Date.now()}`,
    })
  }

  const statusStyles = {
    active: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
    inactive: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20',
    draft: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
  }

  const borderStyles = {
    active: 'border-l-4 border-l-green-500',
    inactive: 'border-l-4 border-l-gray-400',
    draft: 'border-l-4 border-l-yellow-500',
  }

  return (
    <div
      className={`group relative overflow-hidden bg-linear-to-br from-card via-card/80 to-card/60 rounded-lg border border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 ${borderStyles[workflow.status]}`}
    >
      {/* Animated hover gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/0 via-transparent to-primary/0 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />

      {/* Status Badge */}
      <div className={`absolute top-4 right-4 px-2.5 py-1 rounded-full border text-xs font-semibold ${statusStyles[workflow.status]}`}>
        {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {workflow.name}
            </h3>
            <p className="text-sm text-muted-foreground truncate mt-1">
              {workflow.description}
            </p>
          </div>

          {/* Status Indicator Dot */}
          <div className={`h-3 w-3 rounded-full shrink-0 ${
            workflow.status === 'active' 
              ? 'bg-green-500 animate-pulse' 
              : workflow.status === 'draft'
              ? 'bg-yellow-500'
              : 'bg-gray-400'
          }`} />
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-6 py-3 border-b border-border/30 mb-4">
          <div>
            <p className="text-xs text-muted-foreground">Executions</p>
            <p className="text-lg font-semibold text-foreground">{workflow.executions.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Success Rate</p>
            <div className="flex items-center gap-2">
              <p className="text-lg font-semibold text-green-600">{workflow.successRate}%</p>
              <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-linear-to-r from-green-500 to-green-600 rounded-full"
                  style={{ width: `${workflow.successRate}%` }}
                />
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Last Run</p>
            <p className="text-sm font-medium text-foreground">
              {workflow.lastRun 
                ? formatTime(workflow.lastRun)
                : 'Never'
              }
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleRunNow}
            disabled={isRunning || workflow.status !== 'active'}
            className="gap-1.5 bg-green-600 hover:bg-green-700 text-white transition-all duration-200"
          >
            {isRunning ? (
              <>
                <span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" />
                Run Now
              </>
            )}
          </Button>

          <Link href={`/workflow/${workflow.id}`}>
            <Button size="sm" variant="outline" className="gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              View
            </Button>
          </Link>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="gap-1.5"
          >
            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </Button>

          <div className="flex-1" />

          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Expandable Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border/30 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Workflow Steps</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="px-2 py-1 bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded">
                  Trigger: Gmail
                </span>
                <span className="text-muted-foreground">→</span>
                <span className="px-2 py-1 bg-green-500/10 text-green-700 dark:text-green-400 rounded">
                  Action: Slack
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Metadata</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="text-foreground">{formatDateTime(workflow.createdAt).split(' ').slice(0, 3).join(' ')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Updated</p>
                  <p className="text-foreground">{formatDateTime(workflow.updatedAt).split(' ').slice(0, 3).join(' ')}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
