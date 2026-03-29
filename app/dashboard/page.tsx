'use client'

import Link from 'next/link'
import { Workflow, Zap, Activity, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EnhancedStatCard } from '@/components/enhanced-stat-card'
import { EnhancedWorkflowCard } from '@/components/enhanced-workflow-card'
import { mockWorkflows, mockExecutions, mockDashboardStats } from '@/lib/mock-data'
import { formatTime } from '@/lib/date-utils'

export default function DashboardPage() {
  const stats = mockDashboardStats
  const workflows = mockWorkflows
  const recentExecutions = mockExecutions.slice(0, 5)

  // Mock sparkline data (7 days)
  const sparklineData = [45, 52, 48, 61, 55, 67, 72]

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-card/10 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
              Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Monitor and manage your automated workflows
            </p>
          </div>
          <Link href="/workflow/new">
            <Button size="lg" className="gap-2 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300">
              <Workflow className="h-5 w-5" />
              New Workflow
            </Button>
          </Link>
        </div>

        {/* Stats Grid with Sparklines */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <EnhancedStatCard
            icon={Workflow}
            label="Total Workflows"
            value={stats.totalWorkflows}
            change="+2 this week"
            changeType="positive"
            sparklineData={sparklineData}
          />
          <EnhancedStatCard
            icon={Activity}
            label="Active Workflows"
            value={stats.activeWorkflows}
            change={`${stats.activeWorkflows}/${stats.totalWorkflows} active`}
            changeType="positive"
            sparklineData={[3, 4, 3, 5, 4, 5, 6]}
          />
          <EnhancedStatCard
            icon={Zap}
            label="Total Executions"
            value={stats.totalExecutions.toLocaleString()}
            change="↑ 12% from last week"
            changeType="positive"
            sparklineData={[340, 420, 380, 510, 490, 620, 740]}
          />
          <EnhancedStatCard
            icon={TrendingUp}
            label="Success Rate"
            value={`${stats.successRate}%`}
            change="↑ 0.5% from last week"
            changeType="positive"
            sparklineData={[97, 97.2, 97.5, 98.1, 98.3, 98.5, 98.7]}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Workflows Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Your Workflows</h2>
              <span className="text-sm text-muted-foreground">{workflows.length} total</span>
            </div>
            <div className="space-y-4">
              {workflows.map((workflow) => (
                <EnhancedWorkflowCard key={workflow.id} workflow={workflow} />
              ))}
            </div>
          </div>

          {/* Recent Activity Sidebar */}
          <div className="bg-linear-to-br from-card to-card/60 rounded-lg border border-border/50 p-6 backdrop-blur h-fit sticky top-6">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentExecutions.map((execution) => {
                const statusColors = {
                  success: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
                  failed: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
                  running: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
                  pending: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
                }

                return (
                  <div key={execution.id} className="p-3 bg-background/30 rounded-lg border border-border/30 hover:border-border/50 transition-all">
                    <p className="text-sm font-medium line-clamp-1">{execution.workflowName}</p>
                    <div className="flex items-center justify-between mt-2 gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full border ${statusColors[execution.status]}`}>
                        {execution.status.charAt(0).toUpperCase() + execution.status.slice(1)}
                      </span>
                      <span className="text-xs text-muted-foreground/70">
                        {formatTime(execution.startedAt)}
                      </span>
                    </div>
                  </div>
                )
              })}
              <Link href="/dashboard/executions" className="block mt-4">
                <Button variant="outline" className="w-full gap-2 hover:bg-accent/20 transition-all">
                  View All Executions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
