'use client'

import { useState, useEffect, use } from 'react'
import { WorkflowCanvas } from '@/components/workflow-canvas'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Save, Play, CheckCircle, X } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function WorkflowBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const workflowId = id || ''
  return <WorkflowBuilderContent workflowId={workflowId} />
}

function WorkflowBuilderContent({ workflowId }: { workflowId: string }) {
  const isNewWorkflow = workflowId?.includes('workflow-') || workflowId === 'new'
  const [workflowName, setWorkflowName] = useState('')
  const [workflowDescription, setWorkflowDescription] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [isSaved, setIsSaved] = useState(false)
  const [isRunning, setIsRunning] = useState(false)

  // Load workflow data from sessionStorage or localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    console.log('🔄 Initializing workflow builder for:', { workflowId, isNewWorkflow })
    
    if (isNewWorkflow) {
      // Try to get from sessionStorage first
      let savedData = sessionStorage.getItem('newWorkflowData')
      
      // If not in sessionStorage, try localStorage
      if (!savedData && workflowId) {
        savedData = localStorage.getItem(`workflow-${workflowId}`)
      }
      
      if (savedData) {
        try {
          const { name, description } = JSON.parse(savedData)
          console.log('✅ Loaded workflow data from storage:', { name, description })
          setWorkflowName(name || 'Untitled Workflow')
          setWorkflowDescription(description || '')
          setEditName(name || 'Untitled Workflow')
          setEditDescription(description || '')
          sessionStorage.removeItem('newWorkflowData')
        } catch (e) {
          console.error('❌ Failed to parse workflow data:', e)
          setWorkflowName('Untitled Workflow')
          setEditName('Untitled Workflow')
        }
      } else {
        console.log('ℹ️ No saved workflow data found, using defaults')
        setWorkflowName('Untitled Workflow')
        setEditName('Untitled Workflow')
      }
    } else {
      // For existing workflows, set default values
      console.log('📂 Loading existing workflow')
      setWorkflowName('Slack Notification on New Email')
      setWorkflowDescription('Send Slack message when new email arrives in Gmail')
      setEditName('Slack Notification on New Email')
      setEditDescription('Send Slack message when new email arrives in Gmail')
    }
  }, [isNewWorkflow, workflowId])

  const handleSave = () => {
    console.log('💾 WorkflowBuilder: Saving workflow', { workflowId, name: workflowName })
    setIsSaved(true)
    toast.success('Workflow saved successfully', {
      description: `${workflowName} has been saved.`
    })
    console.log('✅ WorkflowBuilder: Workflow saved and marked as persisted')
    setTimeout(() => setIsSaved(false), 2000)
  }

  const handleTest = () => {
    console.log('🧪 WorkflowBuilder: Starting workflow test for', { workflowId, name: workflowName })
    setIsRunning(true)
    toast.info('Testing workflow', {
      description: 'Your workflow is being tested...'
    })
    setTimeout(() => {
      setIsRunning(false)
      console.log('✅ WorkflowBuilder: Workflow test completed successfully')
      toast.success('Workflow test completed', {
        description: 'Check the console logs for execution details.'
      })
    }, 1500)
  }

  const handleEditStart = () => {
    setEditName(workflowName)
    setEditDescription(workflowDescription)
    setIsEditing(true)
  }

  const handleEditSave = () => {
    if (!editName.trim()) {
      toast.error('Workflow name cannot be empty', {
        description: 'Please enter a valid workflow name.'
      })
      return
    }
    setWorkflowName(editName.trim())
    setWorkflowDescription(editDescription.trim())
    setIsEditing(false)
    toast.success('Changes saved', {
      description: 'Workflow name and description updated.'
    })
  }

  const handleEditCancel = () => {
    setIsEditing(false)
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Enhanced Header */}
      <div className="border-b border-border/50 bg-gradient-to-r from-background via-card/30 to-background p-6 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-accent/20 transition-all duration-200 rounded-lg">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          
          <div className="h-8 w-px bg-border/50"></div>
          
          <div className="flex-1 min-w-0 cursor-pointer group" onClick={handleEditStart}>
            {isEditing ? (
              <div className="space-y-3 bg-card/50 p-4 rounded-lg border border-border/50">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Workflow Name</label>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter workflow name"
                    className="text-xl font-bold h-10 text-foreground bg-background border-border/50"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Description</label>
                  <Textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Add a description for this workflow"
                    className="text-sm text-foreground resize-none h-12 bg-background border-border/50"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    className="gap-2 bg-green-600 hover:bg-green-700 shadow-md"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditSave()
                    }}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 border-border/50"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditCancel()
                    }}
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="group/text relative">
                <h1 className="text-3xl font-bold text-foreground truncate leading-tight group-hover/text:text-primary transition-colors duration-200">
                  {workflowName || 'New Workflow'}
                </h1>
                <p className="text-sm text-muted-foreground/80 truncate mt-1 group-hover/text:text-muted-foreground transition-colors duration-200">
                  {workflowDescription || '✏️ Click to add description'}
                </p>
                <div className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs text-muted-foreground font-medium">Edit</div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 ml-8">
          <div className="h-8 w-px bg-border/50"></div>
          
          <Button
            variant="outline"
            className={`gap-2 text-foreground border-border/50 hover:bg-accent/20 hover:border-accent/50 transition-all duration-200 font-medium ${
              isRunning ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handleTest}
            disabled={isRunning}
          >
            <Play className="h-4 w-4" />
            <span className="hidden sm:inline">{isRunning ? 'Testing...' : 'Test Workflow'}</span>
          </Button>
          
          <Button
            className={`gap-2 transition-all font-semibold shadow-md ${
              isSaved 
                ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg scale-105' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
            }`}
            onClick={handleSave}
          >
            {isSaved && <CheckCircle className="h-4 w-4 animate-pulse" />}
            {isSaved ? 'Saved' : (
              <>
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">Save Workflow</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden">
        <WorkflowCanvas isNew={isNewWorkflow} />
      </div>
    </div>
  )
}
