import { NextRequest, NextResponse } from 'next/server'
import { mockExecutions, mockWorkflows, mockProjectMembers } from '@/lib/mock-data'
import { createPermissionChecker, requirePermission } from '@/lib/rbac'
import { WorkflowExecution } from '@/lib/types'

// Mock authentication - in real app, get from session/token
const getCurrentUser = () => ({ id: 'user-1', email: 'john.doe@example.com' })

// GET /api/executions?projectId=xxx&workflowId=yyy - List executions
export async function GET(request: NextRequest) {
  try {
    const currentUser = getCurrentUser()
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const workflowId = searchParams.get('workflowId')

    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId query parameter is required' },
        { status: 400 }
      )
    }

    // Check if user is a member of the project
    const membership = mockProjectMembers.find(
      m => m.userId === currentUser.id && m.projectId === projectId
    )
    if (!membership) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Check permission to view logs
    const checker = createPermissionChecker(
      { userId: currentUser.id, email: currentUser.email },
      { projectId, userRole: membership.role }
    )
    requirePermission(checker, 'view_logs')

    // Get executions for this project (and optionally workflow)
    let projectExecutions = mockExecutions.filter(e => e.projectId === projectId)
    if (workflowId) {
      projectExecutions = projectExecutions.filter(e => e.workflowId === workflowId)
    }

    return NextResponse.json(projectExecutions)
  } catch (error) {
    console.error('Error fetching executions:', error)
    if (error instanceof Error && error.message.includes('Insufficient permissions')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to fetch executions' },
      { status: 500 }
    )
  }
}

// POST /api/executions - Execute workflow
export async function POST(request: NextRequest) {
  try {
    const currentUser = getCurrentUser()
    const body = await request.json()
    const { workflowId } = body

    if (!workflowId) {
      return NextResponse.json(
        { error: 'workflowId is required' },
        { status: 400 }
      )
    }

    // Find workflow
    const workflow = mockWorkflows.find(w => w.id === workflowId)
    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      )
    }

    // Check if user is a member of the project
    const membership = mockProjectMembers.find(
      m => m.userId === currentUser.id && m.projectId === workflow.projectId
    )
    if (!membership) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Check permission to execute workflow
    const checker = createPermissionChecker(
      { userId: currentUser.id, email: currentUser.email },
      { projectId: workflow.projectId, userRole: membership.role }
    )
    requirePermission(checker, 'execute_workflow')

    // Create new execution
    const newExecution: WorkflowExecution = {
      id: `exec-${Date.now()}`,
      workflowId,
      projectId: workflow.projectId,
      workflowName: workflow.name,
      status: 'running',
      startedAt: new Date(),
      duration: 0,
      triggeredBy: currentUser.id,
    }

    // Add to mock data
    mockExecutions.unshift(newExecution)

    // Simulate execution completion (in real app, this would be async)
    setTimeout(() => {
      const execIndex = mockExecutions.findIndex(e => e.id === newExecution.id)
      if (execIndex !== -1) {
        mockExecutions[execIndex] = {
          ...mockExecutions[execIndex],
          status: Math.random() > 0.1 ? 'success' : 'failed',
          completedAt: new Date(),
          duration: Math.floor(Math.random() * 5000) + 1000,
          error: Math.random() > 0.9 ? 'Simulated error' : undefined,
        }
      }
    }, 2000)

    return NextResponse.json(newExecution, { status: 201 })
  } catch (error) {
    console.error('Error executing workflow:', error)
    if (error instanceof Error && error.message.includes('Insufficient permissions')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to execute workflow' },
      { status: 500 }
    )
  }
}