import { NextRequest, NextResponse } from 'next/server'
import { mockProjects, mockProjectMembers, mockWorkflows, mockExecutions } from '@/lib/mock-data'
import { createPermissionChecker, requirePermission } from '@/lib/rbac'

// Mock authentication - in real app, get from session/token
const getCurrentUser = () => ({ id: 'user-1', email: 'john.doe@example.com' })

// GET /api/projects/[id] - Get project details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const currentUser = getCurrentUser()
    const projectId = id

    // Find project
    const project = mockProjects.find(p => p.id === projectId)
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Check if user is a member
    const membership = mockProjectMembers.find(
      m => m.userId === currentUser.id && m.projectId === projectId
    )
    if (!membership) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Check permission to view project
    const checker = createPermissionChecker(
      { userId: currentUser.id, email: currentUser.email },
      { projectId, userRole: membership.role }
    )
    requirePermission(checker, 'view_workflow') // Using view_workflow as general project view permission

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    if (error instanceof Error && error.message.includes('Insufficient permissions')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

// PUT /api/projects/[id] - Update project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const currentUser = getCurrentUser()
    const projectId = id
    const body = await request.json()
    const { name, description } = body

    // Find project
    const projectIndex = mockProjects.findIndex(p => p.id === projectId)
    if (projectIndex === -1) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Check if user is a member
    const membership = mockProjectMembers.find(
      m => m.userId === currentUser.id && m.projectId === projectId
    )
    if (!membership) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Check permission to update project
    const checker = createPermissionChecker(
      { userId: currentUser.id, email: currentUser.email },
      { projectId, userRole: membership.role }
    )
    requirePermission(checker, 'update_project')

    // Update project
    const updatedProject = {
      ...mockProjects[projectIndex],
      name: name?.trim() || mockProjects[projectIndex].name,
      description: description?.trim() || mockProjects[projectIndex].description,
      updatedAt: new Date(),
    }

    mockProjects[projectIndex] = updatedProject

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error('Error updating project:', error)
    if (error instanceof Error && error.message.includes('Insufficient permissions')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id] - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const currentUser = getCurrentUser()
    const projectId = id

    // Find project
    const projectIndex = mockProjects.findIndex(p => p.id === projectId)
    if (projectIndex === -1) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Check if user is a member
    const membership = mockProjectMembers.find(
      m => m.userId === currentUser.id && m.projectId === projectId
    )
    if (!membership) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Check permission to delete project
    const checker = createPermissionChecker(
      { userId: currentUser.id, email: currentUser.email },
      { projectId, userRole: membership.role }
    )
    requirePermission(checker, 'delete_project')

    // Remove project and related data
    mockProjects.splice(projectIndex, 1)
    // Remove members
    const memberIndices = mockProjectMembers
      .map((m, index) => m.projectId === projectId ? index : -1)
      .filter(index => index !== -1)
      .reverse()
    memberIndices.forEach(index => mockProjectMembers.splice(index, 1))

    // Remove workflows
    const workflowIndices = mockWorkflows
      .map((w, index) => w.projectId === projectId ? index : -1)
      .filter(index => index !== -1)
      .reverse()
    workflowIndices.forEach(index => mockWorkflows.splice(index, 1))

    // Remove executions
    const executionIndices = mockExecutions
      .map((e, index) => e.projectId === projectId ? index : -1)
      .filter(index => index !== -1)
      .reverse()
    executionIndices.forEach(index => mockExecutions.splice(index, 1))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting project:', error)
    if (error instanceof Error && error.message.includes('Insufficient permissions')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}