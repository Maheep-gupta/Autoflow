'use client'

import { WorkflowExecution } from '@/lib/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, AlertCircle, Clock, Loader2 } from 'lucide-react'

interface ExecutionTableProps {
  executions: WorkflowExecution[]
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'success':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />
    case 'failed':
      return <AlertCircle className="h-4 w-4 text-red-500" />
    case 'running':
      return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
    case 'pending':
      return <Clock className="h-4 w-4 text-gray-500" />
    default:
      return null
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'success':
      return 'bg-green-500/10 text-green-700 dark:text-green-400'
    case 'failed':
      return 'bg-red-500/10 text-red-700 dark:text-red-400'
    case 'running':
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
    case 'pending':
      return 'bg-gray-500/10 text-gray-700 dark:text-gray-400'
    default:
      return ''
  }
}

function formatDuration(ms: number) {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

export function ExecutionTable({ executions }: ExecutionTableProps) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-card">
            <TableHead>Workflow</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Started At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {executions.map((execution) => (
            <TableRow key={execution.id} className="hover:bg-card/50">
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span>{execution.workflowName}</span>
                  <span className="text-xs text-muted-foreground">
                    ID: {execution.id}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusIcon(execution.status)}
                  <Badge className={getStatusColor(execution.status)}>
                    {execution.status.charAt(0).toUpperCase() +
                      execution.status.slice(1)}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>{formatDuration(execution.duration)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {execution.startedAt.toLocaleString()}
              </TableCell>
              <TableCell>
                <button className="text-sm text-primary hover:underline">
                  View Details
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
