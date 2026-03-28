'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, X } from 'lucide-react'

interface NodeOption {
  type: string
  label: string
  icon: string
  category: string
  description: string
}

const NODE_OPTIONS: NodeOption[] = [
  // Navigation
  { type: 'goToUrl', label: 'Go To URL', icon: '🌐', category: 'Navigation', description: 'Navigate to a URL with timeout' },
  { type: 'goBack', label: 'Go Back', icon: '⬅️', category: 'Navigation', description: 'Navigate back in history' },
  { type: 'reloadPage', label: 'Reload Page', icon: '🔄', category: 'Navigation', description: 'Reload current page' },

  // Interaction
  { type: 'click', label: 'Click', icon: '🖱️', category: 'Interaction', description: 'Click on element with selector' },
  { type: 'typeText', label: 'Type Text', icon: '⌨️', category: 'Interaction', description: 'Type text into input field' },
  { type: 'clearInput', label: 'Clear Input', icon: '🗑️', category: 'Interaction', description: 'Clear input field content' },
  { type: 'selectOption', label: 'Select Option', icon: '📋', category: 'Interaction', description: 'Select from dropdown menu' },
  { type: 'check', label: 'Check', icon: '✓', category: 'Interaction', description: 'Check a checkbox' },
  { type: 'uncheck', label: 'Uncheck', icon: '☐', category: 'Interaction', description: 'Uncheck a checkbox' },
  { type: 'hover', label: 'Hover', icon: '🎯', category: 'Interaction', description: 'Hover over element' },
  { type: 'pressKey', label: 'Press Key', icon: '⌨️', category: 'Interaction', description: 'Press keyboard key (Enter, Tab, etc)' },

  // Wait
  { type: 'waitForElement', label: 'Wait For Element', icon: '⏳', category: 'Wait', description: 'Wait for element to appear' },
  { type: 'waitForNavigation', label: 'Wait For Navigation', icon: '⏳', category: 'Wait', description: 'Wait for page navigation' },
  { type: 'waitForTimeout', label: 'Wait For Timeout', icon: '⏱️', category: 'Wait', description: 'Wait for specified duration' },
  { type: 'waitForUrl', label: 'Wait For URL', icon: '🔗', category: 'Wait', description: 'Wait for URL to match pattern' },

  // Data Extraction
  { type: 'getText', label: 'Get Text', icon: '📖', category: 'Data Extraction', description: 'Extract text from element' },
  { type: 'getAttribute', label: 'Get Attribute', icon: '🏷️', category: 'Data Extraction', description: 'Get element attribute value' },
  { type: 'getElements', label: 'Get Elements', icon: '📦', category: 'Data Extraction', description: 'Get multiple elements matching selector' },
  { type: 'setVariable', label: 'Set Variable', icon: '📝', category: 'Data Extraction', description: 'Create or update variable' },
  { type: 'getVariable', label: 'Get Variable', icon: '📂', category: 'Data Extraction', description: 'Retrieve variable value' },

  // Control Flow
  { type: 'if', label: 'If', icon: '🔀', category: 'Control Flow', description: 'Conditional branching' },
  { type: 'forEach', label: 'For Each', icon: '🔁', category: 'Control Flow', description: 'Loop through array items' },
  { type: 'try', label: 'Try', icon: '🛡️', category: 'Control Flow', description: 'Try-catch error handling' },
  { type: 'catch', label: 'Catch', icon: '⚠️', category: 'Control Flow', description: 'Catch errors from try block' },
  { type: 'retry', label: 'Retry', icon: '🔄', category: 'Control Flow', description: 'Retry failed operation' },

  // Advanced
  { type: 'executeScript', label: 'Execute Script', icon: '💻', category: 'Advanced', description: 'Execute custom JavaScript' },
  { type: 'httpRequest', label: 'HTTP Request', icon: '🌐', category: 'Advanced', description: 'Make HTTP request (GET, POST, PUT, DELETE)' },
]

interface AddNodeModalProps {
  isOpen: boolean
  onClose: () => void
  onNodeSelect: (nodeType: string) => void
}

export function AddNodeModal({ isOpen, onClose, onNodeSelect }: AddNodeModalProps) {
  const [search, setSearch] = useState('')
  const [filtered, setFiltered] = useState<NodeOption[]>(NODE_OPTIONS)

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(NODE_OPTIONS)
    } else {
      const query = search.toLowerCase()
      setFiltered(
        NODE_OPTIONS.filter(
          (node) =>
            node.label.toLowerCase().includes(query) ||
            node.description.toLowerCase().includes(query) ||
            node.category.toLowerCase().includes(query)
        )
      )
    }
  }, [search])

  const handleSelect = (nodeType: string) => {
    onNodeSelect(nodeType)
    setSearch('')
    onClose()
  }

  // Group by category
  const groupedNodes = filtered.reduce(
    (acc, node) => {
      if (!acc[node.category]) {
        acc[node.category] = []
      }
      acc[node.category].push(node)
      return acc
    },
    {} as Record<string, NodeOption[]>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl">➕</span>
            Add New Node
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Search for a node type or browse by category
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search nodes... (e.g., 'loop', 'click', 'webhook')"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-10 bg-background border-border/50"
              autoFocus
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Node List */}
          <ScrollArea className="h-96 border border-border/50 rounded-lg p-4 bg-card/50">
            {Object.entries(groupedNodes).length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <div className="text-3xl mb-2 opacity-30">🔍</div>
                  <p className="text-sm">No nodes found for "{search}"</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupedNodes).map(([category, nodes]) => (
                  <div key={category}>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                      {category}
                    </div>
                    <div className="space-y-1.5">
                      {nodes.map((node) => (
                        <button
                          key={node.type}
                          onClick={() => handleSelect(node.type)}
                          className="w-full flex items-start gap-3 p-3 rounded-lg bg-background border border-border/30 hover:border-primary/50 hover:bg-accent/10 transition-all duration-200 text-left group hover:shadow-md"
                        >
                          <span className="text-lg shrink-0 group-hover:scale-110 transition-transform">
                            {node.icon}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                              {node.label}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {node.description}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          <div className="text-xs text-muted-foreground/60 flex items-center justify-between">
            <span>{filtered.length} available nodes</span>
            <span className="text-right">Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd> to close</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
