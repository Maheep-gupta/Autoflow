'use client'

import { useState } from 'react'
import { WorkflowExecution } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatTime } from '@/lib/date-utils'
import { ChevronDown, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react'

interface EnhancedExecutionTableProps {
  executions: WorkflowExecution[]
}

export function EnhancedExecutionTable({ executions }: EnhancedExecutionTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'running':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/10 text-green-700 dark:text-green-400'
      case 'failed':
        return 'bg-red-500/10 text-red-700 dark:text-red-400'
      case 'running':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400'
    }
  }

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  return (
    <div className="border border-border/50 rounded-lg overflow-hidden bg-card/50 backdrop-blur">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border/30">
            <TableHead className="w-12" />
            <TableHead>Workflow</TableHead>
            <TableHead>Execution ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Started</TableHead>
            <TableHead>Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {executions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <Clock className="h-8 w-8 opacity-30" />
                  <p>No executions found</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            executions.map((execution) => (
              <div key={execution.id}>
                <TableRow 
                  className="border-border/30 hover:bg-accent/30 cursor-pointer transition-all duration-200"
                  onClick={() => setExpandedId(expandedId === execution.id ? null : execution.id)}
                >
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        setExpandedId(expandedId === execution.id ? null : execution.id)
                      }}
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-300 ${
                          expandedId === execution.id ? 'rotate-180' : ''
                        }`}
                      />
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {execution.workflowName}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground font-mono">
                    {execution.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(execution.status)}
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${getStatusStyles(execution.status)}`}>
                        {getStatusLabel(execution.status)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatTime(execution.startedAt)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {execution.duration ? `${execution.duration}s` : '-'}
                  </TableCell>
                </TableRow>

                {/* Expandable Row */}
                {expandedId === execution.id && (
                  <TableRow className="bg-muted/30 border-border/30">
                    <TableCell colSpan={6} className="py-4">
                      <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div>
                          <h4 className="font-semibold text-sm mb-3">Execution Logs</h4>
                          <div className="bg-background/50 rounded border border-border/30 p-4 font-mono text-xs space-y-2 max-h-48 overflow-y-auto">
                            <div className="text-green-600 dark:text-green-400">
                              ✓ Trigger: Gmail - Email detected from john@example.com
                            </div>
                            <div className="text-green-600 dark:text-green-400">
                              ✓ Action: Send Slack message to #notifications
                            </div>
                            <div className="text-green-600 dark:text-green-400">
                              ✓ Workflow completed successfully in 1.2s
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-sm mb-3">Step-by-Step Status</h4>
                          <div className="space-y-2">
                            {[
                              { name: 'Trigger', status: 'success', time: '0ms' },
                              { name: 'Condition Check', status: 'success', time: '230ms' },
                              { name: 'Send Slack', status: 'success', time: '1200ms' },
                            ].map((step, idx) => (
                              <div key={idx} className="flex items-center gap-3 text-sm">
                                <div className="flex items-center gap-2">
                                  {step.status === 'success' && (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  )}
                                  <span className="font-medium">{step.name}</span>
                                </div>
                                <span className="text-muted-foreground ml-auto">{step.time}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </div>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
