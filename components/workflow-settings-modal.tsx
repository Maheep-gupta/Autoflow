'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface WorkflowSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  workflowName: string
  workflowDescription: string
  onSave: (name: string, description: string) => void
}

export function WorkflowSettingsModal({
  isOpen,
  onClose,
  workflowName,
  workflowDescription,
  onSave,
}: WorkflowSettingsModalProps) {
  const [name, setName] = useState(workflowName)
  const [description, setDescription] = useState(workflowDescription)

  const handleSave = () => {
    onSave(name, description)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border border-border rounded-lg shadow-lg max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Workflow Settings</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Workflow Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Email to Slack"
              className="bg-background text-foreground border-border"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this workflow does..."
              className="bg-background text-foreground border-border resize-none h-24"
            />
          </div>

          <div className="pt-4 border-t border-border space-y-2">
            <Button onClick={handleSave} className="w-full">
              Save Settings
            </Button>
            <Button onClick={onClose} variant="outline" className="w-full text-foreground border-border hover:bg-muted">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
