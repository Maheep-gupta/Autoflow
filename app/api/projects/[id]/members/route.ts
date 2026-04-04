import { NextRequest, NextResponse } from 'next/server'
import { mockProjectMembers, mockUsers } from '@/lib/mock-data'
import { createPermissionChecker, requirePermission } from '@/lib/rbac'
import { ProjectRole } from '@/lib/types'

// Mock authentication - in real app, get from session/token
const getCurrentUser = () => ({ id: 'user-1', email: 'john.doe@example.com' })

// GET /api/projects/[id]/members - List project members
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const currentUser = getCurrentUser()
    const projectId = id

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

    // Check permission to view members
    const checker = createPermissionChecker(
      { userId: currentUser.id, email: currentUser.email },
      { projectId, userRole: membership.role }
    )
    requirePermission(checker, 'view_workflow') // Using view_workflow as general project access

    // Get all members for this project
    const members = mockProjectMembers
      .filter(m => m.projectId === projectId)
      .map(member => ({
        ...member,
        user: mockUsers.find(u => u.id === member.userId),
      }))

    return NextResponse.json(members)
  } catch (error) {
    console.error('Error fetching project members:', error)
    if (error instanceof Error && error.message.includes('Insufficient permissions')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to fetch project members' },
      { status: 500 }
    )
  }
}

// POST /api/projects/[id]/members - Invite user to project
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const currentUser = getCurrentUser()
    const projectId = id
    const body = await request.json()
    const { email, role } = body

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    if (!role || !['PROJECT_OWNER', 'PROJECT_ADMIN', 'WORKFLOW_BUILDER', 'WORKFLOW_RUNNER', 'VIEWER'].includes(role)) {
      return NextResponse.json(
        { error: 'Valid role is required' },
        { status: 400 }
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

    // Check permission to invite users
    const checker = createPermissionChecker(
      { userId: currentUser.id, email: currentUser.email },
      { projectId, userRole: membership.role }
    )
    requirePermission(checker, 'invite_user')

    // Check if user already exists
    let user = mockUsers.find(u => u.email === email)
    if (!user) {
      // Create new user (in real app, send invitation email)
      user = {
        id: `user-${Date.now()}`,
        email,
        name: email.split('@')[0],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      mockUsers.push(user)
    }

    // Check if user is already a member
    const existingMember = mockProjectMembers.find(
      m => m.userId === user.id && m.projectId === projectId
    )
    if (existingMember) {
      return NextResponse.json(
        { error: 'User is already a member of this project' },
        { status: 400 }
      )
    }

    // Create membership
    const newMember = {
      id: `member-${Date.now()}`,
      userId: user.id,
      projectId,
      role: role as ProjectRole,
      invitedBy: currentUser.id,
      invitedAt: new Date(),
      joinedAt: new Date(), // Auto-join for demo
      user,
    }

    mockProjectMembers.push(newMember)

    return NextResponse.json(newMember, { status: 201 })
  } catch (error) {
    console.error('Error inviting user:', error)
    if (error instanceof Error && error.message.includes('Insufficient permissions')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to invite user' },
      { status: 500 }
    )
  }
}