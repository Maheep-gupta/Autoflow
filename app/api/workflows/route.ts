import { NextRequest, NextResponse } from 'next/server'
import { mockWorkflows, mockProjectMembers } from '@/lib/mock-data'
import { createPermissionChecker, requirePermission } from '@/lib/rbac'
import { Workflow } from '@/lib/types'

// Mock authentication - in real app, get from session/token
const getCurrentUser = () => ({ id: 'user-1', email: 'john.doe@example.com' })

// GET /api/workflows?projectId=xxx - List workflows for a project
export async function GET(request: NextRequest) {
  try {
    const currentUser = getCurrentUser()
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

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

    // Check permission to view workflows
    const checker = createPermissionChecker(
      { userId: currentUser.id, email: currentUser.email },
      { projectId, userRole: membership.role }
    )
    requirePermission(checker, 'view_workflow')

    // Get workflows for this project
    const projectWorkflows = mockWorkflows.filter(w => w.projectId === projectId)

    return NextResponse.json(projectWorkflows)
  } catch (error) {
    console.error('Error fetching workflows:', error)
    if (error instanceof Error && error.message.includes('Insufficient permissions')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to fetch workflows' },
      { status: 500 }
    )
  }
}

// POST /api/workflows - Create new workflow
export async function POST(request: NextRequest) {
  try {
    const currentUser = getCurrentUser()
    const body = await request.json()
    const { projectId, name, description, nodes, edges } = body

    if (!projectId || !name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'projectId and name are required' },
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

    // Check permission to create workflows
    const checker = createPermissionChecker(
      { userId: currentUser.id, email: currentUser.email },
      { projectId, userRole: membership.role }
    )
    requirePermission(checker, 'create_workflow')

    // Create new workflow
    const newWorkflow: Workflow = {
      id: `workflow-${Date.now()}`,
      projectId,
      name: name.trim(),
      description: description?.trim() || '',
      status: 'draft',
      nodes: nodes || [],
      edges: edges || [],
      createdBy: currentUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      executions: 0,
      successRate: 0,
    }

    // Add to mock data
    mockWorkflows.push(newWorkflow)

    return NextResponse.json(newWorkflow, { status: 201 })
  } catch (error) {
    console.error('Error creating workflow:', error)
    if (error instanceof Error && error.message.includes('Insufficient permissions')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create workflow' },
      { status: 500 }
    )
  }
}