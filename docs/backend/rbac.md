# Role-Based Access Control (RBAC)

Complete guide to the permission system in Autoflow.

## Role Hierarchy

```
Owner (Team lead)
  │ Can do everything Owner, Admin, Builder, Runner can do
  │ + Manage billing, delete project, change roles
  │
├─ Admin (Senior developer/manager)
│  │ Can do everything Admin, Builder, Runner can do
│  │ + Invite members, remove members, manage integrations
│  │ - Cannot delete project
│  │
├─ Builder (Developer)
│  │ Can do everything Builder, Runner can do
│  │ + Create/edit/delete workflows, manage templates
│  │ - Cannot invite members
│  │
├─ Runner (Operations)
│  │ Can execute workflows, view logs and history
│  │ - Cannot create/edit workflows
│  │
└─ Viewer (Stakeholder)
   │ Can view workflows, projects, and execution history
   │ - Cannot execute, create, or modify anything
```

## Permission Matrix

| Action | Owner | Admin | Builder | Runner | Viewer |
|--------|-------|-------|---------|--------|--------|
| **Project Management** | | | | | |
| View project | ✓ | ✓ | ✓ | ✓ | ✓ |
| Edit project | ✓ | ✓ | ✓ | ✗ | ✗ |
| Delete project | ✓ | ✗ | ✗ | ✗ | ✗ |
| **Team Management** | | | | | |
| View members | ✓ | ✓ | ✓ | ✗ | ✗ |
| Invite members | ✓ | ✓ | ✗ | ✗ | ✗ |
| Remove members | ✓ | ✓ | ✗ | ✗ | ✗ |
| Change roles | ✓ | ✗ | ✗ | ✗ | ✗ |
| **Workflow Management** | | | | | |
| View workflows | ✓ | ✓ | ✓ | ✓ | ✓ |
| Create workflows | ✓ | ✓ | ✓ | ✗ | ✗ |
| Edit workflows | ✓ | ✓ | ✓ | ✗ | ✗ |
| Delete workflows | ✓ | ✓ | ✓ | ✗ | ✗ |
| Publish workflows | ✓ | ✓ | ✓ | ✗ | ✗ |
| **Execution** | | | | | |
| Execute workflows | ✓ | ✓ | ✓ | ✓ | ✗ |
| Stop execution | ✓ | ✓ | ✓ | ✗ | ✗ |
| **Monitoring** | | | | | |
| View execution logs | ✓ | ✓ | ✓ | ✓ | ✓ |
| View execution history | ✓ | ✓ | ✓ | ✓ | ✓ |
| Export logs | ✓ | ✓ | ✓ | ✓ | ✗ |
| **Integration Management** | | | | | |
| View integrations | ✓ | ✓ | ✓ | ✗ | ✗ |
| Configure integrations | ✓ | ✓ | ✗ | ✗ | ✗ |
| Delete integrations | ✓ | ✓ | ✗ | ✗ | ✗ |
| **API Keys** | | | | | |
| View API keys | ✓ | ✓ | ✗ | ✗ | ✗ |
| Create API keys | ✓ | ✓ | ✗ | ✗ | ✗ |
| Revoke API keys | ✓ | ✓ | ✗ | ✗ | ✗ |
| **Templates** | | | | | |
| Use templates | ✓ | ✓ | ✓ | ✓ | ✓ |
| Create templates | ✓ | ✓ | ✓ | ✗ | ✗ |
| Manage templates | ✓ | ✓ | ✓ | ✗ | ✗ |

## Implementation

### 1. Permission Checking in Backend

All API routes must verify permissions. File: `lib/rbac.ts`

```typescript
// Check if user can perform action
function canUserPerformAction(
  userId: string,
  resource: Project | Workflow,
  action: string,
  userRole: ProjectRole
): boolean {
  // Get user's permissions
  const permissions = getRolePermissions(userRole);
  
  // Check if action allowed
  return permissions.includes(action);
}

// Example
if (!canUserPerformAction('user-1', project, 'update', 'Builder')) {
  return { error: 'Forbidden', status: 403 };
}
```

### 2. Get User Role in Project

```typescript
// Get user's role in specific project
function getUserRoleInProject(
  userId: string,
  projectId: string
): ProjectRole | null {
  const member = project.members.find(m => m.userId === userId);
  return member?.role || null;
}
```

### 3. Get Role Permissions

```typescript
function getRolePermissions(role: ProjectRole): string[] {
  const permissions: Record<ProjectRole, string[]> = {
    Owner: [
      'project:view', 'project:update', 'project:delete',
      'member:view', 'member:add', 'member:remove', 'member:change-role',
      'workflow:view', 'workflow:create', 'workflow:update', 'workflow:delete',
      'execution:view', 'execution:run', 'execution:stop',
      'integration:view', 'integration:configure', 'integration:delete',
      'apikey:view', 'apikey:create', 'apikey:revoke'
    ],
    Admin: [
      'project:view', 'project:update',
      'member:view', 'member:add', 'member:remove',
      'workflow:view', 'workflow:create', 'workflow:update', 'workflow:delete',
      'execution:view', 'execution:run', 'execution:stop',
      'integration:view', 'integration:configure', 'integration:delete',
      'apikey:view', 'apikey:create', 'apikey:revoke'
    ],
    Builder: [
      'project:view', 'project:update',
      'workflow:view', 'workflow:create', 'workflow:update', 'workflow:delete',
      'execution:view', 'execution:run',
      'integration:view'
    ],
    Runner: [
      'project:view',
      'workflow:view',
      'execution:view', 'execution:run'
    ],
    Viewer: [
      'project:view',
      'workflow:view',
      'execution:view'
    ]
  };
  
  return permissions[role] || [];
}
```

## Usage in API Routes

### Example: Update Workflow

File: `app/api/workflows/[id]/route.ts`

```typescript
export async function PUT(req: Request, { params }: Props) {
  try {
    // 1. Get user ID
    const userId = req.headers.get('user-id') || 'user-1';
    
    // 2. Load resource
    const workflow = getWorkflowById(params.id);
    if (!workflow) {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }
    
    // 3. Get user's role in project
    const project = getProjectById(workflow.projectId);
    const userRole = getUserRoleInProject(userId, project.id);
    
    // 4. Check permission
    if (!canUserPerformAction(userId, project, 'workflow:update', userRole)) {
      return Response.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    // 5. Update workflow
    const body = await req.json();
    const updated = updateWorkflow(params.id, body);
    
    return Response.json(updated);
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

### Example: Execute Workflow

File: `app/api/executions/route.ts`

```typescript
export async function POST(req: Request) {
  try {
    const userId = req.headers.get('user-id') || 'user-1';
    const body = await req.json();
    
    // Load workflow and project
    const workflow = getWorkflowById(body.workflowId);
    const project = getProjectById(workflow.projectId);
    
    // Check: User can view workflow?
    let userRole = getUserRoleInProject(userId, project.id);
    if (!userRole) {
      return Response.json({ error: 'Not in project' }, { status: 403 });
    }
    
    // Check: User can execute?
    if (!getRolePermissions(userRole).includes('execution:run')) {
      return Response.json(
        { error: 'Not allowed to execute workflows' },
        { status: 403 }
      );
    }
    
    // Create and start execution
    const execution = createExecution({
      workflowId: workflow.id,
      projectId: project.id,
      triggeredBy: userId
    });
    
    // Queue for execution
    queueExecutionStart(execution);
    
    return Response.json(execution, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

## Frontend Permission Checks

### Warning: Frontend Checks Are NOT Secure

Frontend permission checks are for **UX only** - always enforce on backend!

```typescript
// Frontend: Hide UI for unauthorized actions
const userRole = getUserRoleInProject(userId, projectId);
const canEdit = getRolePermissions(userRole).includes('workflow:update');

return (
  <div>
    {canEdit && (
      <Button onClick={handleEdit}>Edit Workflow</Button>
    )}
  </div>
);
```

**Security Note:** User can bypass frontend checks using browser dev tools. Backend must enforce!

## Special Permissions

### Rule 1: Only Project Owner Can Delete Project

```typescript
if (action === 'project:delete') {
  // Only owner can delete, regardless of project role
  return userRole === 'Owner';
}
```

### Rule 2: Only Owner Can Change Member Roles

```typescript
if (action === 'member:change-role') {
  // Only owner can change roles
  return userRole === 'Owner';
}
```

### Rule 3: Admin Cannot Remove Owner

```typescript
if (action === 'member:remove' && targetUserRole === 'Owner') {
  // Only owner can remove owner
  return userRole === 'Owner';
}
```

## Project Membership

When a user joins a project:

```typescript
interface ProjectMember {
  userId: string
  projectId: string
  role: ProjectRole
  joinedAt: Date
}
```

**User is NOT in project if:**
- No entry in `project.members` array
- OR they were removed

**Accessing other users' projects:**
- Not allowed (403 Forbidden) if not in members
- Exception: Site admins (may have special role)

## Anonymous Access

Certain operations can be performed without authentication:

```typescript
// Public workflow URL (if enabled)
GET /api/workflows/{id}/public
// Returns public workflow data (no auth required)

// Webhook triggers (if path exposed)
POST /api/webhooks/public-path
// Can be called without auth header
```

**Important:** Only expose safe operations (read-only, idempotent).

## Audit Logging

Track who did what (implement later):

```typescript
interface AuditLog {
  timestamp: Date
  userId: string
  action: string
  resource: { type: string; id: string }
  result: 'success' | 'denied'
  reason?: string
}

// Log permission check result
auditLog({
  timestamp: new Date(),
  userId: 'user-1',
  action: 'workflow:update',
  resource: { type: 'workflow', id: 'wf-1' },
  result: 'denied',
  reason: 'User is Viewer role'
});
```

## Testing Permission System

### Test Case 1: Builder Cannot Delete Workflow

```typescript
test('Builder cannot delete workflow', async () => {
  const userId = 'user-2'; // Builder
  const projectId = 'proj-1';
  const workflowId = 'wf-1';
  
  const response = await fetch(`/api/workflows/${workflowId}`, {
    method: 'DELETE',
    headers: { 'user-id': userId }
  });
  
  expect(response.status).toBe(403);
  expect(response.json).toEqual({ error: 'Forbidden' });
});
```

### Test Case 2: Runner Can Execute

```typescript
test('Runner can execute workflow', async () => {
  const userId = 'user-3'; // Runner
  const projectId = 'proj-1';
  
  const response = await fetch('/api/executions', {
    method: 'POST',
    headers: { 'user-id': userId },
    body: JSON.stringify({
      workflowId: 'wf-1',
      projectId: projectId,
      triggeredBy: userId
    })
  });
  
  expect(response.status).toBe(201);
});
```

### Test Case 3: Viewer Cannot Edit

```typescript
test('Viewer cannot edit workflow', async () => {
  const userId = 'user-4'; // Viewer
  
  const response = await fetch('/api/workflows/wf-1', {
    method: 'PUT',
    headers: {
      'user-id': userId,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: 'Updated', nodes: [] })
  });
  
  expect(response.status).toBe(403);
});
```

## Implementing Custom Roles

To add a new role (e.g., "Executor"):

1. **Update type definition** in `lib/types.ts`:
   ```typescript
   type ProjectRole = 'Owner' | 'Admin' | 'Builder' | 'Runner' | 'Viewer' | 'Executor';
   ```

2. **Add permissions** in `lib/rbac.ts`:
   ```typescript
   Executor: [
     'workflow:view',
     'execution:run'
   ]
   ```

3. **Test thoroughly** - ensure no regressions

## Common Permission Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Forbidden" | User not in project | Add to project first |
| "Forbidden" | User role insufficient | Request owner to upgrade role |
| "Not found" | Resource doesn't exist | Use correct resource ID |
| "Not found" | User lacks read permission | Add read permission for role |

## Best Practices

1. **Always check server-side** - Frontend checks don't prevent attacks
2. **Fail secure** - Default to deny if unsure
3. **Principle of least privilege** - Give minimum needed permissions
4. **Regular audits** - Review who has what access
5. **Use groups** - Easier to manage team permissions via roles than individually
6. **Log changes** - Track when permissions change
7. **Revoke promptly** - When user leaves team

---

**Next Steps:**
- Read [API Documentation](./api.md) - See permission checks in action
- Review [Database Schema](./database.md) - Understand ProjectMember structure
- Check [Implementation Examples](../project-structure.md) - See rbac.ts usage
