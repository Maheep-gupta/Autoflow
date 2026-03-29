'use client'

import { useState } from 'react'
import { Integration } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { LogOut, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface EnhancedIntegrationCardProps {
  integration: Integration
}

export function EnhancedIntegrationCard({ integration }: EnhancedIntegrationCardProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(integration.connected || false)

  const handleConnect = async () => {
    setIsConnecting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    setIsConnecting(false)
    setIsConnected(true)
    toast.success(`${integration.name} connected successfully!`, {
      description: 'Your account is now authorized',
    })
  }

  const handleDisconnect = async () => {
    setIsConnecting(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsConnecting(false)
    setIsConnected(false)
    toast.info(`${integration.name} disconnected`)
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-lg border transition-all duration-300 p-6 ${
        isConnected
          ? 'bg-linear-to-br from-green-500/5 via-card to-card border-green-500/30 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10'
          : 'bg-linear-to-br from-card to-card/60 border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10'
      }`}
    >
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-linear-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${
        isConnected 
          ? 'from-green-500 to-green-500' 
          : 'from-primary via-transparent to-primary'
      }`} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-lg bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                {integration.icon ? (
                  <img src={integration.icon} alt={integration.name} className="h-6 w-6" />
                ) : (
                  <span className="text-lg">{integration.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{integration.name}</h3>
                <p className="text-xs text-muted-foreground">{integration.category}</p>
              </div>
            </div>
          </div>

          {/* Connection Badge */}
          {isConnected && (
            <div className="px-2.5 py-1 bg-green-500/20 border border-green-500/30 rounded-full flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-green-700 dark:text-green-400">
                Connected
              </span>
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {integration.description}
        </p>

        {/* Usage Info */}
        {isConnected && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-xs text-green-700 dark:text-green-400">
              ✓ Used in <span className="font-semibold">{Math.floor(Math.random() * 10) + 1} workflows</span>
            </p>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={isConnected ? handleDisconnect : handleConnect}
          disabled={isConnecting}
          className={`w-full gap-2 transition-all duration-200 ${
            isConnected
              ? 'bg-red-600/20 hover:bg-red-600/30 text-red-700 dark:text-red-400 border border-red-500/30'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
          variant={isConnected ? 'outline' : 'default'}
        >
          {isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isConnected ? 'Disconnecting...' : 'Connecting...'}
            </>
          ) : isConnected ? (
            <>
              <LogOut className="h-4 w-4" />
              Disconnect
            </>
          ) : (
            'Authorize & Connect'
          )}
        </Button>
      </div>
    </div>
  )
}
