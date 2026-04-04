'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Workflow, Users, Activity, Settings, Plus, Play, Eye, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Project, Workflow as WorkflowType, WorkflowExecution, ProjectMember } from '@/lib/types'
import { formatTime } from '@/lib/date-utils'
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog'
import { toast } from 'sonner'

export default function ProjectDashboardPage() {
  const params = useParams()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [workflows, setWorkflows] = useState<WorkflowType[]>([])
  const [executions, setExecutions] = useState<WorkflowExecution[]>([])
  const [members, setMembers] = useState<ProjectMember[]>([])
  const [userRole, setUserRole] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [workflowToDelete, setWorkflowToDelete] = useState<WorkflowType | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [executingWorkflowId, setExecutingWorkflowId] = useState<string | null>(null)

  useEffect(() => {
    if (projectId) {
      fetchProjectData()
    }
  }, [projectId])

  const fetchProjectData = async () => {
    try {
      // Fetch project details
      const projectResponse = await fetch(`/api/projects/${projectId}`)
      if (projectResponse.ok) {
        const projectData = await projectResponse.json()
        setProject(projectData)
      }

      // Fetch workflows
      const workflowsResponse = await fetch(`/api/projects/${projectId}/workflows`)
      if (workflowsResponse.ok) {
        const workflowsData = await workflowsResponse.json()
        setWorkflows(workflowsData)
      }

      // Fetch executions
      const executionsResponse = await fetch(`/api/executions?projectId=${projectId}`)
      if (executionsResponse.ok) {
        const executionsData = await executionsResponse.json()
        setExecutions(executionsData.slice(0, 10)) // Last 10 executions
      }

      // Fetch members
      const membersResponse = await fetch(`/api/projects/${projectId}/members`)
      if (membersResponse.ok) {
        const membersData = await membersResponse.json()
        setMembers(membersData)
        // Find current user's role
        const currentUserMember = membersData.find((m: ProjectMember) => m.userId === 'user-1') // Mock current user
        if (currentUserMember) {
          setUserRole(currentUserMember.role)
        }
      }
    } catch (error) {
      console.error('Error fetching project data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const canCreateWorkflows = () => {
    return ['PROJECT_OWNER', 'PROJECT_ADMIN', 'WORKFLOW_BUILDER'].includes(userRole)
  }

  const canExecuteWorkflows = () => {
    return ['PROJECT_OWNER', 'PROJECT_ADMIN', 'WORKFLOW_BUILDER', 'WORKFLOW_RUNNER'].includes(userRole)
  }

  const canManageMembers = () => {
    return ['PROJECT_OWNER', 'PROJECT_ADMIN'].includes(userRole)
  }

  const canDeleteWorkflows = () => {
    return ['PROJECT_OWNER', 'PROJECT_ADMIN', 'WORKFLOW_BUILDER'].includes(userRole)
  }

  const openDeleteDialog = (workflow: WorkflowType) => {
    setWorkflowToDelete(workflow)
    setDeleteDialogOpen(true)
  }

  const handleExecuteWorkflow = async (workflowId: string, workflowName: string) => {
    setExecutingWorkflowId(workflowId)
    const toastId = toast.loading(`Executing "${workflowName}"...`, {
      description: 'Your workflow is being executed'
    })

    try {
      const response = await fetch('/api/executions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          workflowId,
          projectId,
        }),
      })

      if (response.ok) {
        const execution = await response.json()
        toast.success('Workflow execution started', {
          description: `Execution ID: ${execution.id}`,
          id: toastId,
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to execute workflow')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      toast.error('Failed to execute workflow', {
        description: message,
        id: toastId,
      })
    } finally {
      setExecutingWorkflowId(null)
    }
  }

  const handleDeleteWorkflow = async () => {
    if (!workflowToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/workflows/${workflowToDelete.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove from local state
        setWorkflows(workflows.filter(w => w.id !== workflowToDelete.id))
        setDeleteDialogOpen(false)
        setWorkflowToDelete(null)
        toast.success('Workflow deleted successfully')
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete workflow')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      toast.error('Failed to delete workflow', { description: message })
      throw error
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-background via-background to-card/10 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-32 bg-card rounded-lg"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-96 bg-card rounded-lg"></div>
              </div>
              <div className="space-y-6">
                <div className="h-64 bg-card rounded-lg"></div>
                <div className="h-64 bg-card rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-linear-to-br from-background via-background to-card/10 p-6 md:p-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Project not found</h1>
          <Link href="/dashboard">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-card/10 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
                {project.name}
              </h1>
              <p className="text-muted-foreground text-lg">
                {project.description || 'No description provided'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary">{userRole.replace('_', ' ')}</Badge>
            {canManageMembers() && (
              <Link href={`/dashboard/project/${projectId}/settings`}>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Workflows</CardTitle>
              <Workflow className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{workflows.length}</div>
              <p className="text-xs text-muted-foreground">
                {workflows.filter(w => w.status === 'active').length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{members.length}</div>
              <p className="text-xs text-muted-foreground">
                {members.filter(m => m.role === 'PROJECT_OWNER').length} owner
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Executions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{executions.length}</div>
              <p className="text-xs text-muted-foreground">
                {executions.filter(e => e.status === 'success').length} successful
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="workflows" className="space-y-6">
          <TabsList>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="executions">Recent Executions</TabsTrigger>
            <TabsTrigger value="members">Team Members</TabsTrigger>
          </TabsList>

          <TabsContent value="workflows" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Workflows</h2>
              {canCreateWorkflows() && (
                <Link href={`/workflow/new?projectId=${projectId}`}>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Workflow
                  </Button>
                </Link>
              )}
            </div>

            {workflows.length === 0 ? (
              <Card className="p-12 text-center">
                <Workflow className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No workflows yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first workflow to automate processes in this project.
                </p>
                {canCreateWorkflows() && (
                  <Link href={`/workflow/new?projectId=${projectId}`}>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Workflow
                    </Button>
                  </Link>
                )}
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workflows.map((workflow) => (
                  <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="truncate">{workflow.name}</span>
                        <Badge variant={workflow.status === 'active' ? 'default' : 'secondary'}>
                          {workflow.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {workflow.description || 'No description'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <span>{workflow.executions} executions</span>
                        <span>{workflow.successRate}% success</span>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/workflow/${workflow.id}?projectId=${projectId}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </Link>
                        {canExecuteWorkflows() && (
                          <Button 
                            size="sm" 
                            onClick={() => handleExecuteWorkflow(workflow.id, workflow.name)}
                            disabled={executingWorkflowId === workflow.id}
                            className="gap-1"
                          >
                            {executingWorkflowId === workflow.id ? (
                              <>
                                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Running...
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4" />
                                Run
                              </>
                            )}
                          </Button>
                        )}
                        {canDeleteWorkflows() && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(workflow)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="executions" className="space-y-6">
            <h2 className="text-2xl font-bold">Recent Executions</h2>

            {executions.length === 0 ? (
              <Card className="p-12 text-center">
                <Activity className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No executions yet</h3>
                <p className="text-muted-foreground">
                  Executions will appear here once workflows are run.
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {executions.map((execution) => (
                  <Card key={execution.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${
                            execution.status === 'success' ? 'bg-green-500' :
                            execution.status === 'failed' ? 'bg-red-500' :
                            execution.status === 'running' ? 'bg-blue-500' : 'bg-gray-500'
                          }`} />
                          <div>
                            <h3 className="font-semibold">{execution.workflowName}</h3>
                            <p className="text-sm text-muted-foreground">
                              Started {formatTime(execution.startedAt)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={
                            execution.status === 'success' ? 'default' :
                            execution.status === 'failed' ? 'destructive' :
                            execution.status === 'running' ? 'secondary' : 'outline'
                          }>
                            {execution.status}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">
                            {execution.duration}ms
                          </p>
                        </div>
                      </div>
                      {execution.error && (
                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 rounded-md">
                          <p className="text-sm text-red-600 dark:text-red-400">
                            {execution.error}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Team Members</h2>
              {canManageMembers() && (
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Invite Member
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {members.map((member) => (
                <Card key={member.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold">
                            {member.user?.name?.charAt(0) || member.user?.email?.charAt(0) || '?'}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{member.user?.name || 'Unknown User'}</h3>
                          <p className="text-sm text-muted-foreground">{member.user?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{member.role.replace('_', ' ')}</Badge>
                        {canManageMembers() && member.role !== 'PROJECT_OWNER' && (
                          <Button variant="outline" size="sm">
                            Change Role
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <DeleteConfirmationDialog
          isOpen={deleteDialogOpen}
          title="Delete Workflow"
          description="This action cannot be undone. The workflow and all its associated data will be permanently deleted."
          itemName={workflowToDelete?.name}
          isLoading={isDeleting}
          onConfirm={handleDeleteWorkflow}
          onCancel={() => {
            setDeleteDialogOpen(false)
            setWorkflowToDelete(null)
          }}
        />
      </div>
    </div>
  )
}