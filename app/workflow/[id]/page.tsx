'use client'

import { useState, useEffect, use, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { WorkflowCanvas } from '@/components/workflow-canvas'
import { Button } from '@/components/ui/button'
import { ChevronLeft, CheckCircle, X, Zap, Edit2, Save, FolderOpen } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import generateWorkflowJSON from '@/lib/generate-workflow-json'
import { useNodesState, useEdgesState, ReactFlowProvider } from 'reactflow'
import { Project, Workflow as WorkflowType } from '@/lib/types'

export default function WorkflowBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const workflowId = id || ''
  const searchParams = useSearchParams()
  const projectId = searchParams.get('projectId')

  return (
    <ReactFlowProvider>
      <WorkflowBuilderContent workflowId={workflowId} projectId={projectId} />
    </ReactFlowProvider>
  )
}

function WorkflowBuilderContent({ workflowId, projectId }: { workflowId: string; projectId?: string | null }) {
  const [workflowName, setWorkflowName] = useState('Untitled Workflow')
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('Untitled Workflow')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [isPublishing, setIsPublishing] = useState(false)
  const [project, setProject] = useState<Project | null>(null)
  const [canEdit, setCanEdit] = useState(true)
  const [workflow, setWorkflow] = useState<WorkflowType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Nodes and edges state
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  // Load project and workflow data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      setLoadError(null)

      try {
        // First, try to load the workflow from the API (to detect if it exists)
        const workflowResponse = await fetch(`/api/workflows/${workflowId}`)
        
        if (workflowResponse.ok) {
          // Workflow exists - EDIT mode
          const workflowData = await workflowResponse.json()
          setWorkflow(workflowData)
          setMode('edit')
          setWorkflowName(workflowData.name)
          setEditName(workflowData.name)
          setNodes(workflowData.nodes || [])
          setEdges(workflowData.edges || [])

          // Load project data
          if (workflowData.projectId) {
            const projectResponse = await fetch(`/api/projects/${workflowData.projectId}`)
            if (projectResponse.ok) {
              const projectData = await projectResponse.json()
              setProject(projectData)
            }
          }
        } else if (workflowResponse.status === 404) {
          // Workflow doesn't exist - CREATE mode
          setMode('create')
          setWorkflow(null)
          
          // If projectId is available, load project data for context
          if (projectId) {
            const projectResponse = await fetch(`/api/projects/${projectId}`)
            if (projectResponse.ok) {
              const projectData = await projectResponse.json()
              setProject(projectData)
            }
          }
        } else {
          // API error
          setLoadError('Failed to load workflow')
          console.error('Error loading workflow:', workflowResponse.statusText)
        }
      } catch (error) {
        console.error('Error loading data:', error)
        setLoadError('Failed to load workflow data')
        // Default to CREATE mode if there's an error
        setMode('create')
      } finally {
        setIsLoading(false)
      }
    }

    // Only load if we have a workflowId
    if (workflowId) {
      loadData()
    }
  }, [workflowId])

  // Auto-save on workflow changes (disabled for now, only save on explicit button click)
  useEffect(() => {
    // Auto-save is now disabled. Users must click "Save Workflow" to persist changes.
    // This ensures explicit saves and prevents accidental overwrites.
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [autoSaveTimeoutRef])

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

  const handleTest = async () => {
    if (!nodes || nodes.length === 0) {
      toast.error('No nodes to execute', {
        duration: 3000,
        dismissible: true,
      })
      return
    }

    if (!projectId) {
      toast.error('No project selected', {
        description: 'Please select a project first.'
      })
      return
    }

    try {
      const response = await fetch('/api/executions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId }),
      })

      if (response.ok) {
        const execution = await response.json()
        toast.success('Workflow execution started', {
          description: `Execution ID: ${execution.id}`
        })
      } else {
        const error = await response.json()
        toast.error('Failed to execute workflow', {
          description: error.error || 'Unknown error'
        })
      }
    } catch (error) {
      console.error('Error executing workflow:', error)
      toast.error('Failed to execute workflow', {
        description: 'Network error occurred'
      })
    }
  }

  const handleSaveWorkflow = async () => {
    // Determine projectId: use from workflow if available (edit mode), otherwise use from query
    const saveProjectId = workflow?.projectId || projectId
    
    if (!saveProjectId) {
      toast.error('No project selected')
      return
    }

    if (!workflowName.trim()) {
      toast.error('Workflow name is required')
      return
    }

    setIsPublishing(true)
    const toastId = toast.loading('Saving workflow...', {
      description: 'Your workflow is being saved'
    })

    try {
      const workflowData = {
        name: workflowName.trim(),
        projectId: saveProjectId,
        nodes,
        edges,
      }

      // Choose endpoint and method based on mode
      const endpoint = mode === 'create' ? '/api/workflows' : `/api/workflows/${workflowId}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workflowData),
      })

      if (response.ok) {
        const savedWorkflow = await response.json()
        
        // If it's a new workflow that was just created, update the URL to the real workflow ID
        if (mode === 'create') {
          setMode('edit')
          setWorkflow(savedWorkflow)
          window.history.replaceState({}, '', `/workflow/${savedWorkflow.id}?projectId=${saveProjectId}`)
          toast.success('Workflow created successfully!', {
            description: 'Your new workflow has been created and saved to the database',
            id: toastId,
          })
        } else {
          // EDIT mode
          setWorkflow(savedWorkflow)
          toast.success('Workflow updated successfully!', {
            description: 'Your changes have been persisted to the database',
            id: toastId,
          })
        }
      } else {
        const error = await response.json()
        toast.error('Failed to save workflow', {
          description: error.error || 'Unknown error',
          id: toastId,
        })
      }
    } catch (error) {
      console.error('Error saving workflow:', error)
      toast.error('Failed to save workflow', {
        description: 'Network error occurred',
        id: toastId,
      })
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
            <p className="text-muted-foreground">Loading workflow...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {loadError && !isLoading && (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center max-w-md">
            <p className="text-lg font-semibold mb-2">Unable to Load Workflow</p>
            <p className="text-muted-foreground mb-4">{loadError}</p>
            <Link href={projectId ? `/dashboard/project/${projectId}` : "/dashboard"}>
              <Button>Go Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      )}

      {/* Editor UI */}
      {!isLoading && !loadError && (
        <>
      {/* Enhanced Header with Controls */}
      <div className="border-b border-border/50 bg-linear-to-r from-background via-card/20 to-background px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Link href={project?.id ? `/dashboard/project/${project.id}` : "/dashboard"}>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground hover:bg-accent/20 transition-all rounded-lg"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>

          <div className="h-8 w-px bg-border/30"></div>

          {/* Project Context */}
          {project && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FolderOpen className="h-4 w-4" />
              <span>{project.name}</span>
              <div className="h-4 w-px bg-border/30"></div>
            </div>
          )}

          {/* Mode Indicator */}
          <Badge variant={mode === 'edit' ? 'default' : 'secondary'} className="text-xs">
            {mode === 'edit' ? 'EDIT' : 'CREATE'}
          </Badge>

          <div className="h-4 w-px bg-border/30"></div>

          {/* Workflow Name */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {isEditing ? (
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 min-w-0 h-8 text-lg font-semibold border-none shadow-none px-0 focus-visible:ring-0 bg-transparent"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleNameSave()
                    if (e.key === 'Escape') handleNameCancel()
                  }}
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNameSave}
                  className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/20"
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNameCancel}
                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <h1 className="text-lg font-semibold truncate cursor-pointer hover:text-primary transition-colors"
                    onClick={canEdit ? handleNameEdit : undefined}>
                  {workflowName}
                </h1>
                {canEdit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNameEdit}
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-accent/20 transition-all"
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Save Status */}
          <div className="flex items-center gap-2">
            {saveStatus === 'saving' && (
              <Badge variant="secondary" className="text-xs">
                Saving...
              </Badge>
            )}
            {saveStatus === 'saved' && (
              <Badge variant="default" className="text-xs bg-green-600">
                Saved
              </Badge>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleTest}
            disabled={!canEdit || isPublishing || mode === 'create'}
            className="gap-2 hover:bg-accent/20 transition-all"
            title={mode === 'create' ? 'Save workflow first before testing' : 'Test the workflow'}
          >
            <Zap className="h-4 w-4" />
            Test Run
          </Button>

          <Button
            onClick={handleSaveWorkflow}
            disabled={!canEdit || isPublishing}
            className="gap-2 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isPublishing ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {mode === 'create' ? 'Create Workflow' : 'Save Workflow'}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden">
        <WorkflowCanvas
          isNew={mode === 'create'}
          workflowName={workflowName}
          nodes={nodes}
          setNodes={setNodes}
          onNodesChange={onNodesChange}
          edges={edges}
          setEdges={setEdges}
          onEdgesChange={onEdgesChange}
        />
      </div>
        </>
      )}
    </div>
  )
}
