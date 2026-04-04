import { NextRequest, NextResponse } from 'next/server'
import { mockProjects, mockProjectMembers, mockUsers } from '@/lib/mock-data'
import { createPermissionChecker, requirePermission } from '@/lib/rbac'
import { Project } from '@/lib/types'

// Mock authentication - in real app, get from session/token
const getCurrentUser = () => ({ id: 'user-1', email: 'john.doe@example.com' })

// GET /api/projects - List user's projects
export async function GET() {
  try {
    const currentUser = getCurrentUser()

    // Get projects where user is a member
    const userProjectIds = mockProjectMembers
      .filter(member => member.userId === currentUser.id)
      .map(member => member.projectId)

    const userProjects = mockProjects.filter(project =>
      userProjectIds.includes(project.id)
    )

    return NextResponse.json(userProjects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const currentUser = getCurrentUser()
    const body = await request.json()
    const { name, description } = body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      )
    }

    // Check permission to create project
    const checker = createPermissionChecker({ userId: currentUser.id, email: currentUser.email })
    requirePermission(checker, 'create_project')

    // Create new project
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: name.trim(),
      description: description?.trim() || '',
      ownerId: currentUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      memberCount: 1,
      workflowCount: 0,
    }

    // Add to mock data (in real app, save to database)
    mockProjects.push(newProject)

    // Add owner as project member
    const ownerMember = {
      id: `member-${Date.now()}`,
      userId: currentUser.id,
      projectId: newProject.id,
      role: 'PROJECT_OWNER' as const,
      invitedBy: currentUser.id,
      invitedAt: new Date(),
      joinedAt: new Date(),
      user: mockUsers.find(u => u.id === currentUser.id),
    }
    mockProjectMembers.push(ownerMember)

    return NextResponse.json(newProject, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    if (error instanceof Error && error.message.includes('Insufficient permissions')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}