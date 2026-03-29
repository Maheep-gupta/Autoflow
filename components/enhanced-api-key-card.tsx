'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Eye, EyeOff, Trash2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { formatDateTime } from '@/lib/date-utils'

interface APIKeyData {
  id: string
  name: string
  key: string
  createdAt: Date
  lastUsed: Date | null
}

interface EnhancedAPIKeyCardProps {
  apiKey: APIKeyData
  isProduction?: boolean
}

export function EnhancedAPIKeyCard({ apiKey, isProduction }: EnhancedAPIKeyCardProps) {
  const [isRevealed, setIsRevealed] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const maskKey = (key: string) => {
    const visible = key.substring(0, 10)
    const hidden = '*'.repeat(Math.max(0, key.length - 16))
    const end = key.substring(Math.max(0, key.length - 6))
    return `${visible}${hidden}${end}`
  }

  const copyToClipboard = (key: string, name: string) => {
    navigator.clipboard.writeText(key)
    setCopiedId(apiKey.id)
    toast.success('Copied to clipboard!', {
      description: `${name} API key copied`,
    })
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-lg border transition-all duration-300 p-5 ${
        isProduction
          ? 'bg-linear-to-br from-red-500/5 via-card to-card border-red-500/30 hover:border-red-500/50'
          : 'bg-linear-to-br from-card to-card/60 border-border/50 hover:border-primary/30'
      }`}
    >
      {/* Animated background gradient */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${
          isProduction ? 'bg-linear-to-br from-red-500 to-red-500' : 'bg-linear-to-br from-primary to-primary'
        }`}
      />

      <div className="relative z-10">
        {/* Header with Production Warning */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{apiKey.name}</h3>
            {isProduction && (
              <div className="flex items-center gap-1.5 mt-2 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded w-fit">
                <AlertCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                <span className="text-xs font-semibold text-red-700 dark:text-red-400">Production</span>
              </div>
            )}
          </div>
        </div>

        {/* Key Display */}
        <div className="mb-4 bg-background/50 border border-border/30 rounded-lg p-3 flex items-center justify-between">
          <code className="text-xs font-mono text-muted-foreground/70">
            {isRevealed ? apiKey.key : maskKey(apiKey.key)}
          </code>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setIsRevealed(!isRevealed)}
            title={isRevealed ? 'Hide key' : 'Show key'}
          >
            {isRevealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
          <div>
            <p className="text-muted-foreground mb-1">Created</p>
            <p className="text-foreground font-medium">{formatDateTime(apiKey.createdAt).split(' ').slice(0, 3).join(' ')}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Last Used</p>
            <p className="text-foreground font-medium">
              {apiKey.lastUsed
                ? `${Math.round((Date.now() - apiKey.lastUsed.getTime()) / 60000)}m ago`
                : 'Never'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2"
            onClick={() => copyToClipboard(apiKey.key, apiKey.name)}
          >
            <Copy className="h-4 w-4" />
            {copiedId === apiKey.id ? 'Copied!' : 'Copy'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 text-destructive hover:text-destructive"
            title="Delete key"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
