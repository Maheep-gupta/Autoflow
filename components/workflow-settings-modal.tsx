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

  React.useEffect(() => {
    setName(workflowName)
    setDescription(workflowDescription)
  }, [workflowName, workflowDescription])

  const handleSave = () => {
    onSave(name, description)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full mx-4 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
          <div>
            <h2 className="text-xl font-bold text-foreground">Workflow Settings</h2>
            <p className="text-xs text-muted-foreground mt-1">Update your workflow details</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors hover:bg-muted rounded-full p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground block">
              Workflow Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Email to Slack"
              className="bg-background text-foreground border-border text-sm"
            />
            <p className="text-xs text-muted-foreground">Give your workflow a descriptive name</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground block">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this workflow does..."
              className="bg-background text-foreground border-border resize-none h-24 text-sm"
            />
            <p className="text-xs text-muted-foreground">Explain the workflow purpose and actions</p>
          </div>

          <div className="pt-4 border-t border-border/50 space-y-3">
            <Button 
              onClick={handleSave} 
              className="w-full font-semibold shadow-md hover:shadow-lg transition-shadow"
            >
              Save & Close
            </Button>
            <Button 
              onClick={onClose} 
              variant="outline" 
              className="w-full text-foreground border-border hover:bg-muted transition-colors"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
