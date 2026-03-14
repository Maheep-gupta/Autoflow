'use client'

import React from 'react'
import { WorkflowCanvas } from '@/components/workflow-canvas'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Save, Play, Settings } from 'lucide-react'
import Link from 'next/link'

export default function WorkflowBuilderPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Slack Notification on New Email</h1>
            <p className="text-sm text-muted-foreground">
              Send Slack message when new email arrives in Gmail
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <Button variant="outline" className="gap-2">
            <Play className="h-4 w-4" />
            Test
          </Button>
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden">
        <WorkflowCanvas />
      </div>
    </div>
  )
}
