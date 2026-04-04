export type WorkflowStatus = 'active' | 'inactive' | 'draft'
export type ExecutionStatus = 'success' | 'failed' | 'running' | 'pending'
export type NodeType = 'trigger' | 'action' | 'condition' | 'delay' | 'webhook' | 'apiRequest' | 'if' | 'else' | 'ifElse' | 'switch' | 'forLoop' | 'whileLoop' | 'openBrowser' | 'fillInput' | 'clickElement' | 'selectDropdown' | 'getText' | 'checkExists' | 'screenshot'

// RBAC Types
export type ProjectRole = 'PROJECT_OWNER' | 'PROJECT_ADMIN' | 'WORKFLOW_BUILDER' | 'WORKFLOW_RUNNER' | 'VIEWER'

export type Permission =
  // Project permissions
  | 'create_project'
  | 'delete_project'
  | 'update_project'
  // User permissions
  | 'invite_user'
  | 'remove_user'
  | 'assign_role'
  // Workflow permissions
  | 'create_workflow'
  | 'edit_workflow'
  | 'delete_workflow'
  | 'view_workflow'
  | 'execute_workflow'
  // Execution permissions
  | 'view_logs'
  | 'retry_execution'
  // System permissions
  | 'manage_roles'

export interface User {
  id: string
  email: string
  name?: string
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  name: string
  description?: string
  ownerId: string
  createdAt: Date
  updatedAt: Date
  memberCount: number
  workflowCount: number
}

export interface ProjectMember {
  id: string
  userId: string
  projectId: string
  role: ProjectRole
  invitedBy: string
  invitedAt: Date
  joinedAt?: Date
  user?: User
}

export interface Workflow {
  id: string
  projectId: string
  name: string
  description: string
  status: WorkflowStatus
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  createdBy: string
  createdAt: Date
  updatedAt: Date
  executions: number
  successRate: number
  lastRun?: Date
}

export interface WorkflowExecution {
  id: string
  workflowId: string
  projectId: string
  workflowName: string
  status: ExecutionStatus
  startedAt: Date
  completedAt?: Date
  duration: number // in milliseconds
  error?: string
  triggeredBy: string
  logs?: string[]
}

export interface WorkflowExecution {
  id: string
  workflowId: string
  workflowName: string
  status: ExecutionStatus
  startedAt: Date
  completedAt?: Date
  duration: number // in milliseconds
  error?: string
}

export interface Integration {
  id: string
  name: string
  description: string
  category: string
  icon?: string
  connected?: boolean
  workflows?: number
}

export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  apps: string[]
  icon?: string
  category: string
  installs: number
  rating?: number
}

export interface WorkflowNode {
  id: string
  type: NodeType
  position: { x: number; y: number }
  data: Record<string, any>
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
}

export interface DashboardStats {
  totalWorkflows: number
  activeWorkflows: number
  totalExecutions: number
  successRate: number
}

// Role-Permission Mappings
export const ROLE_PERMISSIONS: Record<ProjectRole, Permission[]> = {
  PROJECT_OWNER: [
    'create_project', 'delete_project', 'update_project',
    'invite_user', 'remove_user', 'assign_role',
    'create_workflow', 'edit_workflow', 'delete_workflow', 'view_workflow', 'execute_workflow',
    'view_logs', 'retry_execution',
    'manage_roles'
  ],
  PROJECT_ADMIN: [
    'update_project',
    'invite_user', 'remove_user', 'assign_role',
    'create_workflow', 'edit_workflow', 'delete_workflow', 'view_workflow', 'execute_workflow',
    'view_logs', 'retry_execution',
    'manage_roles'
  ],
  WORKFLOW_BUILDER: [
    'create_workflow', 'edit_workflow', 'view_workflow'
  ],
  WORKFLOW_RUNNER: [
    'view_workflow', 'execute_workflow', 'view_logs'
  ],
  VIEWER: [
    'view_workflow'
  ]
}

// Permission checking utilities
export function hasPermission(role: ProjectRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function hasAnyPermission(role: ProjectRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission))
}

export function hasAllPermissions(role: ProjectRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission))
}
