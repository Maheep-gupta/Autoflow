'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Copy, Trash2, Plus } from 'lucide-react'

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
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyToClipboard = (key: string, id: string) => {
    navigator.clipboard.writeText(key)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const maskKey = (key: string) => {
    const visible = key.substring(0, 10)
    const hidden = '*'.repeat(key.length - 16)
    const end = key.substring(key.length - 6)
    return `${visible}${hidden}${end}`
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">API Keys</h1>
            <p className="text-muted-foreground">
              Manage your API keys for programmatic access
            </p>
          </div>
          <Button size="lg" className="gap-2 mt-4 md:mt-0">
            <Plus className="h-4 w-4" />
            Generate New Key
          </Button>
        </div>

        {/* Security Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-700 dark:text-blue-400">
            ℹ️ Keep your API keys secure. Never share them publicly or commit them to version control.
          </p>
        </div>

        {/* API Keys Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-card">
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockApiKeys.map((apiKey) => (
                <TableRow key={apiKey.id} className="hover:bg-card/50">
                  <TableCell className="font-medium">{apiKey.name}</TableCell>
                  <TableCell className="font-mono text-sm">
                    <code>{maskKey(apiKey.key)}</code>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {apiKey.createdAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {apiKey.lastUsed
                      ? apiKey.lastUsed.toLocaleString()
                      : 'Never used'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                      >
                        {copiedId === apiKey.id ? (
                          <span className="text-xs">Copied!</span>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            <span className="sr-only">Copy</span>
                          </>
                        )}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Code Example */}
        <div className="mt-8 bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Example Usage</h3>
          <div className="bg-background rounded p-4 overflow-x-auto">
            <pre className="text-sm text-foreground font-mono">
{`const response = await fetch('https://api.workflow.io/workflows', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
