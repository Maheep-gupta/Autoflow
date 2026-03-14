import Link from 'next/link'
import { Workflow } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreVertical, Play, Edit2 } from 'lucide-react'

interface WorkflowCardProps {
  workflow: Workflow
}

export function WorkflowCard({ workflow }: WorkflowCardProps) {
  const statusColors = {
    active: 'bg-green-500/10 text-green-700 dark:text-green-400',
    inactive: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
    draft: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  }

  const lastRunTime = workflow.lastRun
    ? new Date(workflow.lastRun).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })
    : 'Never'

  return (
    <div className="bg-card rounded-lg border border-border p-6 hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{workflow.name}</h3>
          <p className="text-sm text-muted-foreground">{workflow.description}</p>
        </div>
        <Badge className={statusColors[workflow.status]}>
          {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-border">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Executions</p>
          <p className="font-semibold">{workflow.executions.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Success Rate</p>
          <p className="font-semibold">{workflow.successRate}%</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Last Run</p>
          <p className="font-semibold">{lastRunTime}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Link href={`/workflow/${workflow.id}`} className="flex-1">
          <Button variant="default" size="sm" className="w-full gap-2">
            <Edit2 className="h-4 w-4" />
            Edit
          </Button>
        </Link>
        <Button variant="outline" size="sm" className="gap-2">
          <Play className="h-4 w-4" />
          Run
        </Button>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
