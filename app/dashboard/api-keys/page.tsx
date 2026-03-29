'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { EnhancedAPIKeyCard } from '@/components/enhanced-api-key-card'
import { Plus, Key, Loader2, AlertTriangle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

const mockApiKeys = [
  {
    id: '1',
    name: 'Production API Key',
    key: 'wf_prod_1234567890abcdef1234567890abcdef',
    createdAt: new Date('2024-01-15'),
    lastUsed: new Date(Date.now() - 2 * 60000),
  },
  {
    id: '2',
    name: 'Development API Key',
    key: 'wf_dev_abcdef1234567890abcdef1234567890',
    createdAt: new Date('2024-02-01'),
    lastUsed: new Date(Date.now() - 1 * 3600000),
  },
  {
    id: '3',
    name: 'Testing',
    key: 'wf_test_1234567890abcdefabcdef1234567890',
    createdAt: new Date('2024-02-10'),
    lastUsed: null,
  },
]

export default function ApiKeysPage() {
  const [isCreatingKey, setIsCreatingKey] = useState(false)
  const [keyName, setKeyName] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleCreateKey = async () => {
    if (!keyName.trim()) {
      toast.error('Please enter a key name')
      return
    }
    setIsCreatingKey(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsCreatingKey(false)
    setKeyName('')
    setIsDialogOpen(false)
    toast.success('API key generated successfully!', {
      description: 'Save it somewhere secure',
    })
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-card/10 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
              API Keys
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your API keys for programmatic access to workflows
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="h-5 w-5" />
                Generate New Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate New API Key</DialogTitle>
                <DialogDescription>
                  Create a new API key for accessing the workflow API programmatically
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="key-name">Key Name</Label>
                  <Input
                    id="key-name"
                    placeholder="e.g., Production API Key"
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3">
                  <p className="text-xs text-blue-700 dark:text-blue-400">
                    💡 Give your key a descriptive name to remember where it's used
                  </p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isCreatingKey}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateKey}
                  disabled={isCreatingKey || !keyName.trim()}
                  className="gap-2"
                >
                  {isCreatingKey ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Key className="h-4 w-4" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Security Warning Banner */}
        <div className="bg-linear-to-r from-yellow-500/10 via-yellow-500/5 to-transparent border border-yellow-500/30 rounded-lg p-4 flex gap-4">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-900 dark:text-yellow-400 text-sm mb-1">
              Keep your API keys secure
            </p>
            <p className="text-xs text-yellow-800/90 dark:text-yellow-400/90">
              Never share API keys publicly or commit them to version control. Treat them like passwords. Once generated, we cannot show them again.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-linear-to-br from-card to-card/60 border border-border/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Total API Keys</p>
            <p className="text-3xl font-bold">{mockApiKeys.length}</p>
          </div>
          <div className="bg-linear-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Active Keys</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{mockApiKeys.filter(k => k.lastUsed).length}</p>
          </div>
          <div className="bg-linear-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Unused Keys</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{mockApiKeys.filter(k => !k.lastUsed).length}</p>
          </div>
        </div>

        {/* API Keys Grid */}
        {mockApiKeys.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Your API Keys</h2>
            <div className="grid grid-cols-1 gap-4">
              {mockApiKeys.map((apiKey) => (
                <EnhancedAPIKeyCard
                  key={apiKey.id}
                  apiKey={apiKey}
                  isProduction={apiKey.name.includes('Production')}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-linear-to-br from-card to-card/60 rounded-lg border border-border/50 p-12 text-center">
            <Key className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-4">No API keys yet</p>
            <p className="text-muted-foreground/70 text-sm mb-6">Generate your first API key to get started</p>
          </div>
        )}

        {/* Code Example */}
        <div className="bg-gradient-to-br from-card to-card/60 border border-border/50 rounded-lg p-6 backdrop-blur">
          <h3 className="font-semibold text-lg mb-4">Example Usage</h3>
          <div className="bg-background/50 border border-border/30 rounded p-4 overflow-x-auto">
            <pre className="text-xs md:text-sm text-foreground font-mono space-y-2">
              <code className="text-blue-400">{`const response = await fetch(`}</code>
              <code className="text-green-400">{`  'https://api.workflow.io/workflows',`}</code>
              <code className="text-blue-400">{` {`}</code>
              <code className="text-blue-400">{`    headers: {`}</code>
              <code className="text-blue-400">{`      'Authorization': 'Bearer YOUR_API_KEY',`}</code>
              <code className="text-blue-400">{`      'Content-Type': 'application/json'`}</code>
              <code className="text-blue-400">{`    }`}</code>
              <code className="text-blue-400">{`  }`}</code>
              <code className="text-blue-400">{`)`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
