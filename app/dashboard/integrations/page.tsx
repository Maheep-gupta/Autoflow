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
import { EnhancedIntegrationCard } from '@/components/enhanced-integration-card'
import { mockIntegrations } from '@/lib/mock-data'
import { Search, Plug } from 'lucide-react'

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

  const connectedCount = mockIntegrations.filter(i => i.isConnected).length

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-card/10 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
            Integrations
          </h1>
          <p className="text-muted-foreground text-lg">
            Connect your favorite apps and services to automate workflows
          </p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-linear-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Connected Services</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{connectedCount}</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Ready to use</p>
          </div>
          <div className="bg-linear-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Available</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{filteredIntegrations.length}</p>
            <p className="text-xs text-muted-foreground/70 mt-1">In your search</p>
          </div>
          <div className="bg-linear-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Services</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{mockIntegrations.length}</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Available to connect</p>
          </div>
        </div>

        {/* Search and Filters */}
          <div className="bg-linear-to-br from-card to-card/60 rounded-lg border border-border/50 p-6 backdrop-blur">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search integrations..."
                className="pl-10 bg-background/50 border-border/50 hover:border-border/80 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-background/50 border-border/50">
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
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredIntegrations.length}</span> of <span className="font-semibold text-foreground">{mockIntegrations.length}</span> integrations
          </p>
        </div>

        {/* Integrations Grid */}
        {filteredIntegrations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIntegrations.map((integration) => (
              <EnhancedIntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
        ) : (
          <div className="bg-linear-to-br from-card to-card/60 rounded-lg border border-border/50 p-12 text-center backdrop-blur">
            <Plug className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-4">No integrations found</p>
            <p className="text-muted-foreground/70 text-sm mb-6">Try adjusting your filters or search term</p>
            <Button 
              variant="outline"
              onClick={() => {
                setCategoryFilter('all')
                setSearchQuery('')
              }}
              className="border-border/50 hover:bg-accent/20"
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
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
