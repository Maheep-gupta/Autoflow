import { NextRequest, NextResponse } from 'next/server'
import { mockWorkflows, mockProjectMembers, mockExecutions } from '@/lib/mock-data'
import { createPermissionChecker, requirePermission } from '@/lib/rbac'
import { Workflow } from '@/lib/types'

// Mock authentication - in real app, get from session/token
const getCurrentUser = () => ({ id: 'user-1', email: 'john.doe@example.com' })

// GET /api/workflows/[id] - Get workflow details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const currentUser = getCurrentUser()
    const workflowId = id

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

    // Check permission to view workflow
    const checker = createPermissionChecker(
      { userId: currentUser.id, email: currentUser.email },
      { projectId: workflow.projectId, userRole: membership.role }
    )
    requirePermission(checker, 'view_workflow')

    return NextResponse.json(workflow)
  } catch (error) {
    console.error('Error fetching workflow:', error)
    if (error instanceof Error && error.message.includes('Insufficient permissions')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to fetch workflow' },
      { status: 500 }
    )
  }
}

// PUT /api/workflows/[id] - Update workflow
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const currentUser = getCurrentUser()
    const workflowId = id
    const body = await request.json()
    const { name, description, status, nodes, edges } = body

    // Find workflow
    const workflowIndex = mockWorkflows.findIndex(w => w.id === workflowId)
    if (workflowIndex === -1) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      )
    }

    const workflow = mockWorkflows[workflowIndex]

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

    // Check permission to edit workflow
    const checker = createPermissionChecker(
      { userId: currentUser.id, email: currentUser.email },
      { projectId: workflow.projectId, userRole: membership.role }
    )
    requirePermission(checker, 'edit_workflow')

    // Update workflow
    const updatedWorkflow: Workflow = {
      ...workflow,
      name: name?.trim() || workflow.name,
      description: description?.trim() || workflow.description,
      status: status || workflow.status,
      nodes: nodes || workflow.nodes,
      edges: edges || workflow.edges,
      updatedAt: new Date(),
    }

    mockWorkflows[workflowIndex] = updatedWorkflow

    return NextResponse.json(updatedWorkflow)
  } catch (error) {
    console.error('Error updating workflow:', error)
    if (error instanceof Error && error.message.includes('Insufficient permissions')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update workflow' },
      { status: 500 }
    )
  }
}

// DELETE /api/workflows/[id] - Delete workflow
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const currentUser = getCurrentUser()
    const workflowId = id

    // Find workflow
    const workflowIndex = mockWorkflows.findIndex(w => w.id === workflowId)
    if (workflowIndex === -1) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      )
    }

    const workflow = mockWorkflows[workflowIndex]

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

    // Check permission to delete workflow
    const checker = createPermissionChecker(
      { userId: currentUser.id, email: currentUser.email },
      { projectId: workflow.projectId, userRole: membership.role }
    )
    requirePermission(checker, 'delete_workflow')

    // Remove workflow and related executions
    mockWorkflows.splice(workflowIndex, 1)

    // Remove executions
    const executionIndices = mockExecutions
      .map((e, index) => e.workflowId === workflowId ? index : -1)
      .filter(index => index !== -1)
      .reverse()
    executionIndices.forEach(index => mockExecutions.splice(index, 1))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting workflow:', error)
    if (error instanceof Error && error.message.includes('Insufficient permissions')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to delete workflow' },
      { status: 500 }
    )
  }
}