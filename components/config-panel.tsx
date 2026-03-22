import React, { useState } from 'react'
import { Node } from 'reactflow'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Trash2 } from 'lucide-react'

interface ConfigPanelProps {
  node: Node
  onDelete: () => void
  onChange: (node: Node) => void
}

export function ConfigPanel({ node, onDelete, onChange }: ConfigPanelProps) {
  const [label, setLabel] = useState(node.data.label || '')
  const [description, setDescription] = useState(node.data.description || '')
  const [config, setConfig] = useState(node.data.config || {})

  // Sync state when node selection changes
  React.useEffect(() => {
    setLabel(node.data.label || '')
    setDescription(node.data.description || '')
    setConfig(node.data.config || {})
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
        },
      })
    }, 500)
    return () => clearTimeout(timer)
  }, [label, description])

  const handleSave = () => {
    onChange({
      ...node,
      data: {
        ...node.data,
        label,
        description,
        config,
      },
    })
  }

  const getNodeTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1)
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
          className="resize-none h-20 text-sm"
        />
      </div>

      {node.type === 'action' && (
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold block text-foreground">App/Service</label>
            <Input placeholder="e.g., Slack, Gmail, Notion" className="text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold block text-foreground">Message</label>
            <Textarea placeholder="Enter the message or action" className="resize-none h-16 text-sm" />
          </div>
        </div>
      )}

      {node.type === 'condition' && (
        <>
          <div>
            <label className="text-sm font-medium mb-2 block">Field</label>
            <Input placeholder="Select field to check" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Condition</label>
            <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground">
              <option>equals</option>
              <option>not equals</option>
              <option>contains</option>
              <option>greater than</option>
              <option>less than</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Value</label>
            <Input placeholder="Enter value" />
          </div>
        </>
      )}

      {node.type === 'delay' && (
        <>
          <div>
            <label className="text-sm font-medium mb-2 block">Duration</label>
            <Input type="number" placeholder="Enter duration" min="1" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Unit</label>
            <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground">
              <option>seconds</option>
              <option>minutes</option>
              <option>hours</option>
              <option>days</option>
            </select>
          </div>
        </>
      )}

      {node.type === 'webhook' && (
        <>
          <div>
            <label className="text-sm font-medium mb-2 block">URL</label>
            <Input placeholder="https://..." type="url" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Method</label>
            <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground">
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
            </select>
          </div>
        </>
      )}

      {node.type === 'apiRequest' && (
        <>
          <div>
            <label className="text-sm font-medium mb-2 block">Endpoint</label>
            <Input placeholder="https://api.example.com/..." type="url" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Method</label>
            <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground">
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Headers</label>
            <Textarea placeholder="Authorization: Bearer token" className="resize-none h-16" />
          </div>
        </>
      )}

      <div className="space-y-2 pt-4 border-t border-border">
        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
        <Button onClick={onDelete} variant="destructive" className="w-full gap-2">
          <Trash2 className="h-4 w-4" />
          Delete Node
        </Button>
      </div>
    </div>
  )
}
