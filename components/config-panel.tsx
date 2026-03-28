'use client'

import React, { useState } from 'react'
import { Node } from 'reactflow'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Trash2, Plus, X } from 'lucide-react'
import { toast } from 'sonner'

interface ConfigPanelProps {
  node: Node
  onDelete: () => void
  onChange: (node: Node) => void
}

interface ComparisonArg {
  id: string
  field: string
  operator: string
  value: string
}

export function ConfigPanel({ node, onDelete, onChange }: ConfigPanelProps) {
  const [label, setLabel] = useState(node.data.label || '')
  const [description, setDescription] = useState(node.data.description || '')
  const [config, setConfig] = useState(node.data.config || {})
  const [comparisonArgs, setComparisonArgs] = useState<ComparisonArg[]>(
    node.data.comparisonArgs || []
  )

  // Sync state when node selection changes
  React.useEffect(() => {
    setLabel(node.data.label || '')
    setDescription(node.data.description || '')
    setConfig(node.data.config || {})
    setComparisonArgs(node.data.comparisonArgs || [])
  }, [node.id])

  // Auto-save on label/description change
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onChange({
        ...node,
        data: {
          ...node.data,
          label,
          description,
          config,
          comparisonArgs,
        },
      })
    }, 500)
    return () => clearTimeout(timer)
  }, [label, description, config, comparisonArgs])

  const handleSave = () => {
    if (!label.trim()) {
      toast.error('Invalid configuration', {
        description: 'Please provide a label for this node.'
      })
      return
    }
    onChange({
      ...node,
      data: {
        ...node.data,
        label,
        description,
        config,
        comparisonArgs,
      },
    })
    toast.success('Node configuration saved', {
      description: `${label} has been updated.`
    })
  }

  const handleAddComparisonArg = () => {
    const newArg: ComparisonArg = {
      id: `arg-${Date.now()}`,
      field: '',
      operator: 'equals',
      value: '',
    }
    setComparisonArgs([...comparisonArgs, newArg])
  }

  const handleRemoveComparisonArg = (id: string) => {
    setComparisonArgs(comparisonArgs.filter(arg => arg.id !== id))
  }

  const handleUpdateComparisonArg = (id: string, field: keyof ComparisonArg, value: string) => {
    setComparisonArgs(comparisonArgs.map(arg =>
      arg.id === id ? { ...arg, [field]: value } : arg
    ))
  }

  const getNodeTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      trigger: 'Trigger',
      action: 'Action',
      condition: 'Condition',
      delay: 'Delay',
      webhook: 'Webhook',
      apiRequest: 'API Request',
      if: 'If Statement',
      else: 'Else Block',
      ifElse: 'If-Else Statement',
      switch: 'Switch Statement',
      forLoop: 'For Loop',
      whileLoop: 'While Loop',
      openBrowser: 'Open Browser',
      fillInput: 'Fill Input/Textarea',
      clickElement: 'Click Element',
      selectDropdown: 'Select Dropdown',
      getText: 'Get Text',
      checkExists: 'Check Text Exists',
      screenshot: 'Screenshot',
    }
    return labels[type] || type.charAt(0).toUpperCase() + type.slice(1)
  }

  return (
    <div className="p-4 space-y-5 h-full overflow-y-auto">
      <div className="pb-3 border-b border-border">
        <p className="text-xs font-bold text-primary uppercase tracking-wider">
          {getNodeTypeLabel(node.type)} Node
        </p>
        <p className="text-xs text-muted-foreground mt-1">Configure node settings</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold mb-2 block text-foreground">Label</label>
        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Node label"
          className="text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold mb-2 block text-foreground">Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description..."
          className="resize-none h-16 text-sm"
        />
      </div>

      {/* Trigger Configuration */}
      {node.type === 'trigger' && (
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold block text-foreground">Trigger Type</label>
            <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground">
              <option>On New Email</option>
              <option>On New File</option>
              <option>On Form Submission</option>
              <option>On Schedule</option>
              <option>On Webhook</option>
            </select>
          </div>
        </div>
      )}

      {/* Action Configuration */}
      {node.type === 'action' && (
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold block text-foreground">App/Service</label>
            <Input placeholder="e.g., Slack, Gmail, Notion" className="text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold block text-foreground">Action</label>
            <Input placeholder="e.g., Send Message, Create Task" className="text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold block text-foreground">Message/Payload</label>
            <Textarea placeholder="Enter the message or action details" className="resize-none h-16 text-sm" />
          </div>
        </div>
      )}

      {/* Condition Configuration */}
      {node.type === 'condition' && (
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Field</label>
            <Input placeholder="Field to check (e.g., status, email)" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Condition</label>
            <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground">
              <option>equals</option>
              <option>not equals</option>
              <option>contains</option>
              <option>does not contain</option>
              <option>greater than</option>
              <option>less than</option>
              <option>greater than or equal</option>
              <option>less than or equal</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Value</label>
            <Input placeholder="Enter value to compare" />
          </div>
        </div>
      )}

      {/* If Node Configuration */}
      {node.type === 'if' && (
        <div className="space-y-4 pt-2">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
            <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">
              ℹ️ If node: Execute the true path when condition is met
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Comparison Arguments</h4>
            {comparisonArgs.length === 0 ? (
              <p className="text-xs text-muted-foreground">No arguments added yet</p>
            ) : (
              comparisonArgs.map((arg) => (
                <div key={arg.id} className="bg-muted p-3 rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium">Argument {comparisonArgs.indexOf(arg) + 1}</span>
                    <button
                      onClick={() => handleRemoveComparisonArg(arg.id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <Input
                    value={arg.field}
                    onChange={(e) => handleUpdateComparisonArg(arg.id, 'field', e.target.value)}
                    placeholder="Field name"
                    className="text-xs"
                  />
                  <select
                    value={arg.operator}
                    onChange={(e) => handleUpdateComparisonArg(arg.id, 'operator', e.target.value)}
                    className="w-full px-2 py-1.5 border border-border rounded-md bg-background text-foreground text-xs"
                  >
                    <option>equals</option>
                    <option>not equals</option>
                    <option>contains</option>
                    <option>greater than</option>
                    <option>less than</option>
                  </select>
                  <Input
                    value={arg.value}
                    onChange={(e) => handleUpdateComparisonArg(arg.id, 'value', e.target.value)}
                    placeholder="Value to compare"
                    className="text-xs"
                  />
                </div>
              ))
            )}
            <Button
              onClick={handleAddComparisonArg}
              variant="outline"
              className="w-full text-xs gap-2"
            >
              <Plus className="h-3 w-3" />
              Add Argument
            </Button>
          </div>
        </div>
      )}

      {/* If-Else Node Configuration */}
      {node.type === 'ifElse' && (
        <div className="space-y-4 pt-2">
          <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-3 mb-4">
            <p className="text-xs text-violet-700 dark:text-violet-400 font-medium">
              ℹ️ If-Else node: Execute true or false path based on condition
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Condition Field</label>
            <Input placeholder="Field to evaluate" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Operator</label>
            <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground">
              <option>equals</option>
              <option>not equals</option>
              <option>contains</option>
              <option>greater than</option>
              <option>less than</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Expected Value</label>
            <Input placeholder="Value to compare against" />
          </div>
        </div>
      )}

      {/* Switch Node Configuration */}
      {node.type === 'switch' && (
        <div className="space-y-4 pt-2">
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 mb-4">
            <p className="text-xs text-cyan-700 dark:text-cyan-400 font-medium">
              ℹ️ Switch node: Route based on multiple conditions
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Switch Expression</label>
            <Input placeholder="Field or expression to evaluate" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Cases</label>
            <Textarea
              placeholder="case1: action1&#10;case2: action2"
              className="resize-none h-16 text-xs"
            />
          </div>
        </div>
      )}

      {/* For Loop Configuration */}
      {node.type === 'forLoop' && (
        <div className="space-y-4 pt-2">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
            <p className="text-xs text-red-700 dark:text-red-400 font-medium">
              ℹ️ For Loop: Execute actions for each item with start/end/condition
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Start Value</label>
            <Input type="number" placeholder="e.g., 0" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">End Value</label>
            <Input type="number" placeholder="e.g., 10" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Increment</label>
            <Input type="number" placeholder="e.g., 1" defaultValue="1" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Loop Variable Name</label>
            <Input placeholder="e.g., index, i" />
          </div>
        </div>
      )}

      {/* While Loop Configuration */}
      {node.type === 'whileLoop' && (
        <div className="space-y-4 pt-2">
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-3 mb-4">
            <p className="text-xs text-rose-700 dark:text-rose-400 font-medium">
              ℹ️ While Loop: Execute actions while condition is true
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Condition Field</label>
            <Input placeholder="Field to check" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Operator</label>
            <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground">
              <option>equals</option>
              <option>not equals</option>
              <option>greater than</option>
              <option>less than</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Expected Value</label>
            <Input placeholder="Continue while equals this value" />
          </div>
        </div>
      )}

      {/* Delay Configuration */}
      {node.type === 'delay' && (
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Duration</label>
            <Input type="number" placeholder="Enter duration" min="1" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Unit</label>
            <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground">
              <option>milliseconds</option>
              <option>seconds</option>
              <option>minutes</option>
              <option>hours</option>
              <option>days</option>
            </select>
          </div>
        </div>
      )}

      {/* Webhook Configuration */}
      {node.type === 'webhook' && (
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">URL</label>
            <Input placeholder="https://..." type="url" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Method</label>
            <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground">
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
              <option>PATCH</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Headers (JSON)</label>
            <Textarea placeholder='{"Authorization": "Bearer token"}' className="resize-none h-16 text-xs font-mono" />
          </div>
        </div>
      )}

      {/* API Request Configuration */}
      {node.type === 'apiRequest' && (
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Endpoint</label>
            <Input placeholder="https://api.example.com/..." type="url" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Method</label>
            <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground">
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
              <option>PATCH</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Headers</label>
            <Textarea placeholder="Authorization: Bearer token" className="resize-none h-16 text-xs" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Body</label>
            <Textarea placeholder="Request payload" className="resize-none h-16 text-xs font-mono" />
          </div>
        </div>
      )}

      {/* Open Browser Configuration */}
      {node.type === 'openBrowser' && (
        <div className="space-y-4 pt-2">
          <div className="bg-sky-500/10 border border-sky-500/30 rounded-lg p-3 mb-4">
            <p className="text-xs text-sky-700 dark:text-sky-400 font-medium">
              🌐 Opens a browser and navigates to the specified URL
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">URL</label>
            <Input placeholder="https://example.com" type="url" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Browser Type</label>
            <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground">
              <option>Chrome</option>
              <option>Firefox</option>
              <option>Safari</option>
              <option>Edge</option>
            </select>
          </div>
        </div>
      )}

      {/* Fill Input Configuration */}
      {node.type === 'fillInput' && (
        <div className="space-y-4 pt-2">
          <div className="bg-lime-500/10 border border-lime-500/30 rounded-lg p-3 mb-4">
            <p className="text-xs text-lime-700 dark:text-lime-400 font-medium">
              ✏️ Fills input fields, textareas, or editable divs on the webpage
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Selector/XPath</label>
            <Input placeholder="e.g., #inputId or //input[@id='search']" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Text to Fill</label>
            <Textarea placeholder="Enter the text to fill" className="resize-none h-16" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Index (Optional)</label>
            <Input type="number" placeholder="If multiple elements, specify index (0-based)" />
          </div>
        </div>
      )}

      {/* Click Element Configuration */}
      {node.type === 'clickElement' && (
        <div className="space-y-4 pt-2">
          <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-3 mb-4">
            <p className="text-xs text-teal-700 dark:text-teal-400 font-medium">
              🖱️ Clicks on a button or element by text or selector
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Click Method</label>
            <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground">
              <option>By Text</option>
              <option>By Selector</option>
              <option>By XPath</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Text / Selector</label>
            <Input placeholder="e.g., 'Submit' or '#submitBtn'" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Index (Optional)</label>
            <Input type="number" placeholder="If multiple elements with same text, specify index" />
          </div>
        </div>
      )}

      {/* Select Dropdown Configuration */}
      {node.type === 'selectDropdown' && (
        <div className="space-y-4 pt-2">
          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-3 mb-4">
            <p className="text-xs text-indigo-700 dark:text-indigo-400 font-medium">
              📋 Selects an option from a dropdown menu
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Dropdown Selector</label>
            <Input placeholder="e.g., #countrySelect or //select[@id='country']" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Value / Text to Select</label>
            <Input placeholder="e.g., 'USA' or 'opt_123'" />
          </div>
        </div>
      )}

      {/* Get Text Configuration */}
      {node.type === 'getText' && (
        <div className="space-y-4 pt-2">
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 mb-4">
            <p className="text-xs text-purple-700 dark:text-purple-400 font-medium">
              📖 Extracts text from an element using XPath or selector
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Selector/XPath</label>
            <Input placeholder="e.g., //span[@class='price'] or .product-name" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Store As Variable</label>
            <Input placeholder="Variable name to store the text" />
          </div>
        </div>
      )}

      {/* Check Text Exists Configuration */}
      {node.type === 'checkExists' && (
        <div className="space-y-4 pt-2">
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 mb-4">
            <p className="text-xs text-orange-700 dark:text-orange-400 font-medium">
              ✓ Checks if specific text exists on the page
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Text to Find</label>
            <Input placeholder="Enter the text to search for" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Search Scope (Optional)</label>
            <Input placeholder="XPath or selector to limit search area" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Index (Optional)</label>
            <Input type="number" placeholder="If multiple matches, specify which one (0-based)" />
          </div>
        </div>
      )}

      <div className="space-y-2 pt-4 border-t border-border">
        <Button onClick={handleSave} className="w-full">
          Save Configuration
        </Button>
        <Button 
          onClick={() => {
            toast.error('Node deleted successfully', {
              description: `${label || 'Node'} has been removed from the workflow.`
            })
            onDelete()
          }} 
          variant="destructive" 
          className="w-full gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Delete Node
        </Button>
      </div>
    </div>
  )
}

