'use client'

import { useState, useEffect, use, useCallback, useRef } from 'react'
import { WorkflowCanvas } from '@/components/workflow-canvas'
import { Button } from '@/components/ui/button'
import { ChevronLeft, CheckCircle, X, Zap, Edit2, Save } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import generateWorkflowJSON from '@/lib/generate-workflow-json'
import { useNodesState, useEdgesState, ReactFlowProvider } from 'reactflow'

export default function WorkflowBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const workflowId = id || ''
  return (
    <ReactFlowProvider>
      <WorkflowBuilderContent workflowId={workflowId} />
    </ReactFlowProvider>
  )
}

function WorkflowBuilderContent({ workflowId }: { workflowId: string }) {
  const isNewWorkflow = workflowId?.includes('workflow-') || workflowId === 'new'
  const [workflowName, setWorkflowName] = useState('Untitled Workflow')
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('Untitled Workflow')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [isPublishing, setIsPublishing] = useState(false)
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Nodes and edges state
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  // Auto-save on workflow changes (name changes, node changes, etc.)
  useEffect(() => {
    // Clear previous timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }

    // Set new timeout for auto-save
    setSaveStatus('saving')
    autoSaveTimeoutRef.current = setTimeout(() => {
      // Simulate save
      if (typeof window !== 'undefined') {
        localStorage.setItem(`workflow-${workflowId}`, JSON.stringify({
          name: workflowName,
          updatedAt: new Date().toISOString(),
        }))
      }
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }, 2000)

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [workflowName, workflowId])

  const handleNameEdit = () => {
    setEditName(workflowName)
    setIsEditing(true)
  }

  const handleNameSave = () => {
    if (!editName.trim()) {
      toast.error('Workflow name cannot be empty', {
        description: 'Please enter a valid workflow name.'
      })
      return
    }
    setWorkflowName(editName.trim())
    setIsEditing(false)
    toast.success('Workflow name updated', {
      description: `Renamed to "${editName.trim()}".`
    })
  }

  const handleNameCancel = () => {
    setIsEditing(false)
  }

  const handleTest = () => {
    if (!nodes || nodes.length === 0) {
      toast.error('No nodes to execute', {
        duration: 3000,
        dismissible: true,
      })
      return
    }

    try {
      const typedNodes = nodes.map(n => ({
        ...n,
        type: n.type || 'action'
      }))
      const workflowJSON = generateWorkflowJSON(typedNodes, edges)
      
      // Update workflow name in the output
      workflowJSON.workflowName = workflowName

      console.log(JSON.stringify(workflowJSON, null, 2))

      toast.success('Workflow executed successfully', {
        duration: 3000,
        dismissible: true,
      })
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to execute workflow', {
        duration: 3000,
        dismissible: true,
      })
    }
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    toast.loading('Publishing workflow...', {
      description: 'Your workflow is being published'
    })
    
    setTimeout(() => {
      setIsPublishing(false)
      toast.success('Workflow published successfully! 🚀', {
        description: 'Your workflow is now live and ready to use.'
      })
    }, 1500)
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Enhanced Header with Controls */}
      <div className="border-b border-border/50 bg-linear-to-r from-background via-card/20 to-background px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Link href="/dashboard">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground hover:bg-accent/20 transition-all rounded-lg"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          
          <div className="h-8 w-px bg-border/30"></div>
          
          {/* Workflow Name - Inline Edit */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex items-center gap-2 bg-card/50 border border-border/50 rounded-lg px-3 py-2">
                <Input
                  value={editName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditName(e.target.value)}
                  placeholder="Enter workflow name"
                  className="text-lg font-semibold text-foreground bg-transparent border-0 h-8 p-0 focus:outline-none"
                  autoFocus
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') handleNameSave()
                    if (e.key === 'Escape') handleNameCancel()
                  }}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 hover:bg-green-500/20 text-green-600"
                  onClick={handleNameSave}
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 hover:bg-red-500/20 text-red-600"
                  onClick={handleNameCancel}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div 
                className="group cursor-pointer"
                onClick={handleNameEdit}
              >
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {workflowName}
                  </h1>
                  <Edit2 className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-xs text-muted-foreground/60 mt-0.5">
                  {saveStatus === 'saving' && '💾 Saving...'}
                  {saveStatus === 'saved' && '✅ Saved'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-2 ml-6">
          <Button
            onClick={handleTest}
            variant="outline"
            className="gap-2 text-foreground border-border/50 hover:bg-accent/20 font-medium text-sm"
            disabled={isPublishing}
          >
            <span>Test</span>
          </Button>
          
          <Button
            className="gap-2 font-semibold text-sm bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-md"
            onClick={handlePublish}
            disabled={isPublishing}
          >
            <Zap className="h-4 w-4" />
            <span>Publish</span>
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden">
        <WorkflowCanvas 
          isNew={isNewWorkflow} 
          workflowName={workflowName}
          nodes={nodes}
          setNodes={setNodes}
          onNodesChange={onNodesChange}
          edges={edges}
          setEdges={setEdges}
          onEdgesChange={onEdgesChange}
        />
      </div>
    </div>
  )
}
