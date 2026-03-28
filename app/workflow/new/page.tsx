'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function NewWorkflowPage() {
  const router = useRouter()
  const [workflowName, setWorkflowName] = useState('')
  const [workflowDescription, setWorkflowDescription] = useState('')

  const handleCreate = () => {
    if (!workflowName.trim()) {
      toast.error('Workflow name is required', {
        description: 'Please enter a name for your workflow to continue.'
      })
      return
    }

    // Store the workflow data in both sessionStorage and localStorage for persistence
    const workflowData = {
      name: workflowName.trim(),
      description: workflowDescription.trim(),
    }
    
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('newWorkflowData', JSON.stringify(workflowData))
      // Also store in localStorage with a workflow ID for persistence
      const workflowId = `workflow-${Date.now()}`
      localStorage.setItem(`workflow-${workflowId}`, JSON.stringify(workflowData))
      console.log('✅ NewWorkflowForm: Workflow data stored with ID', { workflowId, name: workflowData.name })
    }

    // Redirect to the workflow builder with the new workflow ID
    const workflowId = `workflow-${Date.now()}`
    console.log('🚀 NewWorkflowForm: Redirecting to workflow builder', { workflowId, name: workflowName })
    toast.success('Workflow created successfully', {
      description: `Creating workflow: ${workflowName}`
    })
    router.push(`/workflow/${workflowId}`)
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card p-4 flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Create New Workflow</h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-6 bg-card border border-border rounded-lg p-8">
          <div>
            <label className="text-sm font-semibold text-foreground block mb-3">
              Workflow Name
            </label>
            <Input
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              placeholder="e.g., Email to Slack, Save Gmail to Notion"
              className="bg-background text-foreground border-border text-base"
              onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground block mb-3">
              Description (Optional)
            </label>
            <Textarea
              value={workflowDescription}
              onChange={(e) => setWorkflowDescription(e.target.value)}
              placeholder="Describe what this workflow does..."
              className="bg-background text-foreground border-border resize-none h-24"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" className="w-full text-foreground border-border hover:bg-muted">
                Cancel
              </Button>
            </Link>
            <Button onClick={handleCreate} className="flex-1">
              Create Workflow
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
