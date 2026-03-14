import Link from 'next/link'
import { Workflow, Zap, Activity, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/stat-card'
import { WorkflowCard } from '@/components/workflow-card'
import { ExecutionTable } from '@/components/execution-table'
import { mockWorkflows, mockExecutions, mockDashboardStats } from '@/lib/mock-data'

export default function DashboardPage() {
  const stats = mockDashboardStats
  const workflows = mockWorkflows
  const recentExecutions = mockExecutions.slice(0, 5)

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Workflows</h1>
            <p className="text-muted-foreground">
              Manage and monitor all your automated workflows
            </p>
          </div>
          <Link href="/workflow/new">
            <Button size="lg" className="gap-2 mt-4 md:mt-0">
              <Workflow className="h-4 w-4" />
              New Workflow
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Workflow}
            label="Total Workflows"
            value={stats.totalWorkflows}
            change="+2 this week"
            changeType="positive"
          />
          <StatCard
            icon={Activity}
            label="Active Workflows"
            value={stats.activeWorkflows}
            change={`${stats.activeWorkflows}/${stats.totalWorkflows} active`}
          />
          <StatCard
            icon={Zap}
            label="Total Executions"
            value={stats.totalExecutions.toLocaleString()}
            change="↑ 12% from last week"
            changeType="positive"
          />
          <StatCard
            icon={TrendingUp}
            label="Success Rate"
            value={`${stats.successRate}%`}
            change="↑ 0.5% from last week"
            changeType="positive"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Workflows Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Your Workflows</h2>
              <div className="grid gap-4">
                {workflows.map((workflow) => (
                  <WorkflowCard key={workflow.id} workflow={workflow} />
                ))}
              </div>
            </div>
          </div>

          {/* Recent Executions Sidebar */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
            <div className="bg-card rounded-lg border border-border p-6 space-y-4">
              {recentExecutions.slice(0, 5).map((execution) => {
                const statusColors = {
                  success: 'bg-green-500/10 text-green-700 dark:text-green-400',
                  failed: 'bg-red-500/10 text-red-700 dark:text-red-400',
                  running: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
                  pending: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
                }

                return (
                  <div key={execution.id} className="py-3 border-b border-border last:border-0">
                    <p className="text-sm font-medium">{execution.workflowName}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs px-2 py-1 rounded ${statusColors[execution.status]}`}>
                        {execution.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {execution.startedAt.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                )
              })}
              <Link href="/dashboard/executions" className="block mt-4">
                <Button variant="outline" className="w-full">
                  View All Executions
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Executions Table */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Recent Executions</h2>
          <ExecutionTable executions={recentExecutions} />
        </div>
      </div>
    </div>
  )
}
