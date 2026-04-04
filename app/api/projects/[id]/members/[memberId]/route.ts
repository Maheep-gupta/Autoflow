import { NextRequest, NextResponse } from 'next/server'
import { mockProjectMembers } from '@/lib/mock-data'
import { createPermissionChecker, requirePermission } from '@/lib/rbac'
import { ProjectRole } from '@/lib/types'

// Mock authentication - in real app, get from session/token
const getCurrentUser = () => ({ id: 'user-1', email: 'john.doe@example.com' })

// PUT /api/projects/[id]/members/[memberId] - Update member role
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const { id, memberId } = await params
    const currentUser = getCurrentUser()
    const projectId = id
    const body = await request.json()
    const { role } = body

    if (!role || !['PROJECT_OWNER', 'PROJECT_ADMIN', 'WORKFLOW_BUILDER', 'WORKFLOW_RUNNER', 'VIEWER'].includes(role)) {
      return NextResponse.json(
        { error: 'Valid role is required' },
        { status: 400 }
      )
    }

    // Check if current user is a member
    const currentMembership = mockProjectMembers.find(
      m => m.userId === currentUser.id && m.projectId === projectId
    )
    if (!currentMembership) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Find the member to update
    const memberIndex = mockProjectMembers.findIndex(
      m => m.id === memberId && m.projectId === projectId
    )
    if (memberIndex === -1) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    const member = mockProjectMembers[memberIndex]

    // Check permission to assign roles
    const checker = createPermissionChecker(
      { userId: currentUser.id, email: currentUser.email },
      { projectId, userRole: currentMembership.role }
    )
    requirePermission(checker, 'assign_role')

    // Cannot change project owner's role
    if (member.role === 'PROJECT_OWNER') {
      return NextResponse.json(
        { error: 'Cannot change project owner role' },
        { status: 400 }
      )
    }

    // Update member role
    mockProjectMembers[memberIndex] = {
      ...member,
      role: role as ProjectRole,
    }

    return NextResponse.json(mockProjectMembers[memberIndex])
  } catch (error) {
    console.error('Error updating member role:', error)
    if (error instanceof Error && error.message.includes('Insufficient permissions')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update member role' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id]/members/[memberId] - Remove member from project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const { id, memberId } = await params
    const currentUser = getCurrentUser()
    const projectId = id

    // Check if current user is a member
    const currentMembership = mockProjectMembers.find(
      m => m.userId === currentUser.id && m.projectId === projectId
    )
    if (!currentMembership) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Find the member to remove
    const memberIndex = mockProjectMembers.findIndex(
      m => m.id === memberId && m.projectId === projectId
    )
    if (memberIndex === -1) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    const member = mockProjectMembers[memberIndex]

    // Cannot remove project owner
    if (member.role === 'PROJECT_OWNER') {
      return NextResponse.json(
        { error: 'Cannot remove project owner' },
        { status: 400 }
      )
    }

    // Check permission to remove users
    const checker = createPermissionChecker(
      { userId: currentUser.id, email: currentUser.email },
      { projectId, userRole: currentMembership.role }
    )
    requirePermission(checker, 'remove_user')

    // Remove member
    mockProjectMembers.splice(memberIndex, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing member:', error)
    if (error instanceof Error && error.message.includes('Insufficient permissions')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to remove member' },
      { status: 500 }
    )
  }
}