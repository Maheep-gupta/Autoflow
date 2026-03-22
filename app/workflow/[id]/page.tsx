'use client'

import React, { useState } from 'react'
import { WorkflowCanvas } from '@/components/workflow-canvas'
import { WorkflowSettingsModal } from '@/components/workflow-settings-modal'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Save, Play, Settings, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function WorkflowBuilderPage({ params }: { params: { id: string } }) {
  const isNewWorkflow = params.id === 'new'
  const [workflowName, setWorkflowName] = useState('Slack Notification on New Email')
  const [workflowDescription, setWorkflowDescription] = useState(
    'Send Slack message when new email arrives in Gmail'
  )
  const [isSettingsOpen, setIsSettingsOpen] = useState(isNewWorkflow)
  const [isSaved, setIsSaved] = useState(false)
  const [isRunning, setIsRunning] = useState(false)

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
      <div className="border-b border-border bg-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground truncate">{workflowName}</h1>
            <p className="text-sm text-muted-foreground truncate">{workflowDescription}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2 text-foreground border-border hover:bg-muted"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <Button
            variant="outline"
            className={`gap-2 text-foreground border-border hover:bg-muted ${
              isRunning ? 'opacity-50' : ''
            }`}
            onClick={handleTest}
            disabled={isRunning}
          >
            <Play className="h-4 w-4" />
            {isRunning ? 'Testing...' : 'Test'}
          </Button>
          <Button
            className={`gap-2 transition-all ${
              isSaved ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-primary/90'
            }`}
            onClick={handleSave}
          >
            {isSaved && <CheckCircle className="h-4 w-4" />}
            {isSaved ? 'Saved' : (
              <>
                <Save className="h-4 w-4" />
                Save
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
