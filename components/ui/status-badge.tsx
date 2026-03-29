'use client'

import { Badge } from './badge'

interface StatusBadgeProps {
  status: 'success' | 'failed' | 'running' | 'pending'
  showLabel?: boolean
}

export function StatusBadge({ status, showLabel = true }: StatusBadgeProps) {
  const statusConfig = {
    success: {
      label: 'Success',
      className: 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/50',
    },
    failed: {
      label: 'Failed',
      className: 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/50',
    },
    running: {
      label: 'Running',
      className: 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/50',
    },
    pending: {
      label: 'Pending',
      className: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/50',
    },
  }

  const config = statusConfig[status]

  return (
    <Badge variant="outline" className={`${config.className} border`}>
      {showLabel ? config.label : <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />}
    </Badge>
  )
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'success':
      return 'bg-green-500'
    case 'failed':
      return 'bg-red-500'
    case 'running':
      return 'bg-blue-500'
    case 'pending':
      return 'bg-yellow-500'
    default:
      return 'bg-gray-500'
  }
}
