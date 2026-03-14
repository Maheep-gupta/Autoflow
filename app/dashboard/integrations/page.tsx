'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { mockIntegrations } from '@/lib/mock-data'
import { Search, Plus, Settings } from 'lucide-react'

export default function IntegrationsPage() {
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    'all',
    ...new Set(mockIntegrations.map((i) => i.category)),
  ]

  const filteredIntegrations = mockIntegrations.filter((integration) => {
    const matchesCategory =
      categoryFilter === 'all' || integration.category === categoryFilter
    const matchesSearch = integration.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Integrations</h1>
          <p className="text-muted-foreground">
            Connect your favorite apps and services
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg border border-border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search integrations..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredIntegrations.length} of {mockIntegrations.length}{' '}
            integrations
          </p>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map((integration) => (
            <div
              key={integration.id}
              className="bg-card rounded-lg border border-border p-6 hover:border-primary/50 transition-colors flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{integration.icon}</div>
                {integration.connected ? (
                  <span className="px-3 py-1 bg-green-500/10 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                    Connected
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-gray-500/10 text-gray-700 dark:text-gray-400 text-xs font-medium rounded-full">
                    Disconnected
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-lg mb-1">{integration.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-1">
                {integration.description}
              </p>
              <div className="text-xs text-muted-foreground mb-4">
                {integration.category}
              </div>
              <div className="flex gap-2">
                {integration.connected ? (
                  <>
                    <Button variant="outline" size="sm" className="flex-1">
                      Manage
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button size="sm" className="w-full gap-2">
                    <Plus className="h-4 w-4" />
                    Connect
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
