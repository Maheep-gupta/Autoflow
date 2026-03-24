'use client'

import React, { useState } from 'react'
import { WorkflowCanvas } from '@/components/workflow-canvas'
import { WorkflowSettingsModal } from '@/components/workflow-settings-modal'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Save, Play, Settings, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default async function WorkflowBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const workflowId = id || ''
  
  return <WorkflowBuilderContent workflowId={workflowId} />
}

function WorkflowBuilderContent({ workflowId }: { workflowId: string }) {
  const isNewWorkflow = workflowId?.includes('workflow-') || workflowId === 'new'
  const [workflowName, setWorkflowName] = useState('')
  const [workflowDescription, setWorkflowDescription] = useState('')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isRunning, setIsRunning] = useState(false)

  // Load workflow data from sessionStorage on mount
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    
    console.log('[v0] WorkflowBuilderContent mounted, workflowId:', workflowId, 'isNewWorkflow:', isNewWorkflow)
    
    if (isNewWorkflow) {
      const savedData = sessionStorage.getItem('newWorkflowData')
      console.log('[v0] Reading sessionStorage:', savedData)
      if (savedData) {
        try {
          const { name, description } = JSON.parse(savedData)
          console.log('[v0] Parsed data:', { name, description })
          setWorkflowName(name || 'Untitled Workflow')
          setWorkflowDescription(description || '')
          sessionStorage.removeItem('newWorkflowData')
        } catch (e) {
          console.error('[v0] Failed to parse workflow data:', e)
          setWorkflowName('Untitled Workflow')
        }
      } else {
        console.log('[v0] No saved data found, using defaults')
        setWorkflowName('Untitled Workflow')
      }
    } else {
      // For existing workflows, set default values
      setWorkflowName('Slack Notification on New Email')
      setWorkflowDescription('Send Slack message when new email arrives in Gmail')
    }
  }, [isNewWorkflow])

  const handleSave = () => {
    console.log('[v0] Saving workflow:', { workflowName, workflowDescription })
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const handleTest = () => {
    console.log('[v0] Testing workflow:', workflowName)
    setIsRunning(true)
    setTimeout(() => {
      setIsRunning(false)
      alert('Workflow test completed! Check logs for details.')
    }, 1500)
  }

  const handleSettingsSave = (name: string, description: string) => {
    setWorkflowName(name)
    setWorkflowDescription(description)
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-r from-background to-card p-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted/80 transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-foreground truncate leading-tight">{workflowName || 'New Workflow'}</h1>
            <p className="text-sm text-muted-foreground truncate mt-1">{workflowDescription || 'Create your automation'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="outline"
            className="gap-2 text-foreground border-border hover:bg-muted/80 transition-all"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </Button>
          <Button
            variant="outline"
            className={`gap-2 text-foreground border-border hover:bg-muted/80 transition-all ${
              isRunning ? 'opacity-60 cursor-not-allowed' : ''
            }`}
            onClick={handleTest}
            disabled={isRunning}
          >
            <Play className="h-4 w-4" />
            <span className="hidden sm:inline">{isRunning ? 'Testing...' : 'Test'}</span>
          </Button>
          <Button
            className={`gap-2 transition-all font-semibold ${
              isSaved ? 'bg-green-600 hover:bg-green-700 shadow-lg' : 'bg-primary hover:bg-primary/90 shadow-md'
            }`}
            onClick={handleSave}
          >
            {isSaved && <CheckCircle className="h-4 w-4 animate-pulse" />}
            {isSaved ? 'Saved' : (
              <>
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">Save</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden">
        <WorkflowCanvas isNew={isNewWorkflow} />
      </div>

      {/* Settings Modal */}
      <WorkflowSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        workflowName={workflowName}
        workflowDescription={workflowDescription}
        onSave={handleSettingsSave}
      />
    </div>
  )
}
