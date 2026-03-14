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
import { mockTemplates } from '@/lib/mock-data'
import { Search, Download } from 'lucide-react'

export default function TemplatesPage() {
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    'all',
    ...new Set(mockTemplates.map((t) => t.category)),
  ]

  const filteredTemplates = mockTemplates.filter((template) => {
    const matchesCategory =
      categoryFilter === 'all' || template.category === categoryFilter
    const matchesSearch = template.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Workflow Templates
          </h1>
          <p className="text-muted-foreground">
            Use pre-built templates to get started quickly
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg border border-border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
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
            Showing {filteredTemplates.length} of {mockTemplates.length} templates
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-card rounded-lg border border-border p-6 hover:border-primary/50 transition-colors flex flex-col"
            >
              <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-1">
                {template.description}
              </p>
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">
                  Connected apps:
                </p>
                <div className="flex flex-wrap gap-2">
                  {template.apps.map((app) => (
                    <span
                      key={app}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between mb-4 py-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Installs</p>
                  <p className="font-semibold">{template.installs.toLocaleString()}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {template.category}
                </span>
              </div>
              <Button className="w-full gap-2">
                <Download className="h-4 w-4" />
                Use Template
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
