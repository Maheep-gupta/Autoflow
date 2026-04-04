import { ProjectRole, Permission, hasPermission } from './types'

export interface UserContext {
  userId: string
  email: string
}

export interface ProjectContext {
  projectId: string
  userRole: ProjectRole
}

/**
 * Permission checking utility for RBAC system
 */
export class PermissionChecker {
  private userContext: UserContext
  private projectContext?: ProjectContext

  constructor(userContext: UserContext, projectContext?: ProjectContext) {
    this.userContext = userContext
    this.projectContext = projectContext
  }

  /**
   * Check if user has a specific permission in the current project context
   */
  hasPermission(permission: Permission): boolean {
    if (!this.projectContext) {
      // Global permissions (like create_project) don't require project context
      return this.isGlobalPermission(permission)
    }

    return hasPermission(this.projectContext.userRole, permission)
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(permission))
  }

  /**
   * Check if user has all of the specified permissions
   */
  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(permission))
  }

  /**
   * Check if user is project owner
   */
  isProjectOwner(): boolean {
    return this.projectContext?.userRole === 'PROJECT_OWNER'
  }

  /**
   * Check if user can manage the project (owner or admin)
   */
  canManageProject(): boolean {
    return this.projectContext?.userRole === 'PROJECT_OWNER' ||
           this.projectContext?.userRole === 'PROJECT_ADMIN'
  }

  /**
   * Check if user can edit workflows
   */
  canEditWorkflows(): boolean {
    return this.hasPermission('edit_workflow')
  }

  /**
   * Check if user can execute workflows
   */
  canExecuteWorkflows(): boolean {
    return this.hasPermission('execute_workflow')
  }

  /**
   * Check if user can view workflows
   */
  canViewWorkflows(): boolean {
    return this.hasPermission('view_workflow')
  }

  /**
   * Check if user can manage project members
   */
  canManageMembers(): boolean {
    return this.hasAnyPermission(['invite_user', 'remove_user', 'assign_role'])
  }

  /**
   * Check if user can view execution logs
   */
  canViewLogs(): boolean {
    return this.hasPermission('view_logs')
  }

  /**
   * Check if user can retry executions
   */
  canRetryExecutions(): boolean {
    return this.hasPermission('retry_execution')
  }

  private isGlobalPermission(permission: Permission): boolean {
    // Global permissions that don't require project context
    const globalPermissions: Permission[] = ['create_project']
    return globalPermissions.includes(permission)
  }
}

/**
 * Create a permission checker for a user in a project context
 */
export function createPermissionChecker(
  userContext: UserContext,
  projectContext?: ProjectContext
): PermissionChecker {
  return new PermissionChecker(userContext, projectContext)
}

/**
 * Middleware-style permission check that throws an error if permission is denied
 */
export function requirePermission(
  checker: PermissionChecker,
  permission: Permission,
  message?: string
): void {
  if (!checker.hasPermission(permission)) {
    throw new Error(message || `Insufficient permissions: ${permission}`)
  }
}

/**
 * Middleware-style check for any of the permissions
 */
export function requireAnyPermission(
  checker: PermissionChecker,
  permissions: Permission[],
  message?: string
): void {
  if (!checker.hasAnyPermission(permissions)) {
    throw new Error(message || `Insufficient permissions: ${permissions.join(' or ')}`)
  }
}