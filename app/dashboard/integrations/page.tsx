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

  const connectedCount = mockIntegrations.filter(i => i.connected).length

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-card/10 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Integrations
          </h1>
          <p className="text-muted-foreground">
            Connect your apps to automate workflows
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <p className="text-sm">Connected</p>
            <p className="text-2xl font-bold">{connectedCount}</p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm">Available</p>
            <p className="text-2xl font-bold">{filteredIntegrations.length}</p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm">Total</p>
            <p className="text-2xl font-bold">{mockIntegrations.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="border rounded-lg p-4 grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2 h-4 w-4" />
            <Input
              className="pl-8"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Grid */}
        {filteredIntegrations.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIntegrations.map((integration) => (
              <EnhancedIntegrationCard
                key={integration.id}
                integration={integration}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-10 border rounded-lg">
            <Plug className="mx-auto mb-3" />
            <p>No integrations found</p>
            <Button
              onClick={() => {
                setCategoryFilter('all')
                setSearchQuery('')
              }}
            >
              Reset
            </Button>
          </div>
        )}

      </div>
    </div>
  )
}