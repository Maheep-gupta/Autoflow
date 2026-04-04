import { NextRequest, NextResponse } from 'next/server'
import { mockWorkflows, mockProjectMembers } from '@/lib/mock-data'
import { createPermissionChecker, requirePermission } from '@/lib/rbac'

// Mock authentication - in real app, get from session/token
const getCurrentUser = () => ({ id: 'user-1', email: 'john.doe@example.com' })

// GET /api/projects/:id/workflows - List all workflows in a project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const currentUser = getCurrentUser()
    const projectId = id

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
    const projectWorkflows = mockWorkflows
      .filter(w => w.projectId === projectId)
      .map(w => ({
        ...w,
        createdBy: w.createdBy,
      }))

    return NextResponse.json(projectWorkflows)
  } catch (error) {
    console.error('Error fetching project workflows:', error)
    if (error instanceof Error && error.message.includes('Insufficient permissions')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to fetch project workflows' },
      { status: 500 }
    )
  }
}