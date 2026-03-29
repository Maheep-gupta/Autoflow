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
import { EnhancedTemplateCard } from '@/components/enhanced-template-card'
import { mockTemplates } from '@/lib/mock-data'
import { Search, Zap } from 'lucide-react'

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

  const popularTemplates = mockTemplates.filter(t => t.rating && t.rating >= 4.5)

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-card/10 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
            Workflow Templates
          </h1>
          <p className="text-muted-foreground text-lg">
            Use pre-built templates to get started quickly with powerful automations
          </p>
        </div>

        {/* Featured Banner */}
        <div className="bg-linear-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 border border-blue-500/30 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400 shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-1">Start in seconds</h3>
              <p className="text-sm text-muted-foreground">
                Our templates include pre-configured triggers, actions, and conditions. Just customize and deploy!
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-linear-to-br from-card to-card/60 rounded-lg border border-border/50 p-6 backdrop-blur">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
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
            Showing <span className="font-semibold text-foreground">{filteredTemplates.length}</span> of <span className="font-semibold text-foreground">{mockTemplates.length}</span> templates
          </p>
          {popularTemplates.length > 0 && (
            <span className="text-xs px-2.5 py-1 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-500/20 rounded-full">
              ⭐ {popularTemplates.length} Popular
            </span>
          )}
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <EnhancedTemplateCard key={template.id} template={template} />
            ))}
          </div>
        ) : (
          <div className="bg-linear-to-br from-card to-card/60 rounded-lg border border-border/50 p-12 text-center backdrop-blur">
            <Zap className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-4">No templates found</p>
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
