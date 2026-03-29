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
import { EnhancedExecutionTable } from '@/components/enhanced-execution-table'
import { mockExecutions } from '@/lib/mock-data'
import { Search, Filter, Clock } from 'lucide-react'

export default function ExecutionsPage() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredExecutions = mockExecutions.filter((execution) => {
    const matchesStatus =
      statusFilter === 'all' || execution.status === statusFilter
    const matchesSearch =
      execution.workflowName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      execution.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const statusCounts = {
    all: mockExecutions.length,
    success: mockExecutions.filter(e => e.status === 'success').length,
    failed: mockExecutions.filter(e => e.status === 'failed').length,
    running: mockExecutions.filter(e => e.status === 'running').length,
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-card/10 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
            Execution Logs
          </h1>
          <p className="text-muted-foreground text-lg">
            Track and monitor all workflow executions with detailed logs
          </p>
        </div>

        {/* Quick Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {['all', 'success', 'failed', 'running'].map((status) => (
            <Button
              key={status}
              onClick={() => setStatusFilter(status)}
              variant={statusFilter === status ? 'default' : 'outline'}
              className={`${statusFilter === status ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' : ''}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status as keyof typeof statusCounts]})
            </Button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-linear-to-br from-card to-card/60 rounded-lg border border-border/50 p-6 backdrop-blur">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by workflow name or ID..."
                className="pl-10 bg-background/50 border-border/50 hover:border-border/80 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-background/50 border-border/50">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2 border-border/50 hover:bg-accent/20 transition-all">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredExecutions.length}</span> of <span className="font-semibold text-foreground">{mockExecutions.length}</span> executions
          </p>
          {filteredExecutions.length === 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setStatusFilter('all')
                setSearchQuery('')
              }}
              className="border-border/50 hover:bg-accent/20"
            >
              Clear filters
            </Button>
          )}
        </div>

        {/* Executions Table */}
        {filteredExecutions.length > 0 ? (
          <EnhancedExecutionTable executions={filteredExecutions} />
        ) : (
          <div className="bg-linear-to-br from-card to-card/60 rounded-lg border border-border/50 p-12 text-center backdrop-blur">
            <Clock className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-4">No executions found</p>
            <p className="text-muted-foreground/70 text-sm mb-6">Try adjusting your filters or search term</p>
            <Button 
              variant="outline"
              onClick={() => {
                setStatusFilter('all')
                setSearchQuery('')
              }}
              className="border-border/50 hover:bg-accent/20"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
