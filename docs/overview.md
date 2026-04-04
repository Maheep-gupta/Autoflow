# Project Overview

## What is Autoflow?

Autoflow is a visual workflow automation platform that empowers users to design complex automated processes without writing code. Users can create workflows by visually connecting nodes, each representing a discrete unit of work (triggers, actions, conditions, etc.).

## Core Concepts

### 1. **Projects**
A container for organizing workflows within a team context. Projects provide:
- Scope isolation for workflows
- Team access control with role-based permissions
- Shared resources (integrations, API keys, templates)
- Separate execution histories

**Key Properties:**
- `id` - Unique identifier
- `name` - Human-readable name
- `description` - Optional project details
- `ownerId` - User who created the project
- `memberCount` - Number of team members
- `workflowCount` - Number of workflows

### 2. **Workflows**
A sequence of nodes connected by directed edges that define automation logic. Workflows are the core unit of work in Autoflow.

**Key Properties:**
- `id` - Unique identifier
- `projectId` - Parent project
- `name` - User-editable name
- `nodes` - Array of workflow nodes (JSON)
- `edges` - Array of connections (JSON)
- `status` - 'draft' | 'active' | 'inactive'
- `createdBy` - User who created it
- `updatedAt` - Last modified timestamp

**Workflow States:**
- **Draft** - Created but not yet published
- **Active** - Published and ready for execution
- **Inactive** - Temporarily disabled

### 3. **Nodes**
Individual units of work in a workflow. Each node performs a specific function and can be configured with parameters.

**Node Types:**
- **Trigger** - Initiates workflow execution (webhook, scheduled time, event)
- **Action** - Performs work (HTTP request, send email, write to database)
- **Condition** - Branch logic (if/else, switch)
- **Loop** - Repeat actions (forEach, while)
- **Data** - Variables and data manipulation
- **Control** - Flow control (try/catch, retry)

**Node Structure:**
```typescript
interface Node {
  id: string              // Unique in workflow
  type: string            // Node type identifier
  label: string           // User-editable display name
  params: Record<string, any>  // Node configuration
  position: { x, y }      // Canvas position (React Flow)
  data: any              // Runtime data
}
```

### 4. **Edges**
Connections between nodes that define the execution flow direction.

**Edge Properties:**
```typescript
interface Edge {
  id: string              // Unique identifier
  source: string          // Source node ID
  target: string          // Target node ID
  animated: boolean       // Visual animation
  label?: string          // Optional label
}
```

### 5. **Executions**
A single run of a workflow. Records timing, status, inputs, outputs, and logs.

**Execution Lifecycle:**
```
pending → running → completed
                  ↓
              success or failed
```

**Execution Properties:**
```typescript
interface Execution {
  id: string              // Unique execution ID
  workflowId: string      // Which workflow ran
  projectId: string       // Which project
  status: ExecutionStatus // Current status
  startedAt: Date         // When execution started
  completedAt?: Date      // When execution finished
  duration: number        // Milliseconds
  error?: string          // Error message if failed
  triggeredBy: string     // User who triggered
  logs: string[]          // Execution logs
}
```

**Execution Status:**
- **Pending** - Queued, waiting to start
- **Running** - Currently executing
- **Success** - Completed without errors
- **Failed** - Encountered an error
- **Unknown** - Status cannot be determined

### 6. **Role-Based Access Control (RBAC)**

Users have different roles within projects determining what actions they can perform:

**Role Hierarchy:**
```
Owner (all permissions)
  ↓
Admin (can't delete project)
  ↓
Builder (can't manage team)
  ↓
Runner (can't create workflows)
  ↓
Viewer (read-only)
```

**Permission Matrix:**

| Action | Owner | Admin | Builder | Runner | Viewer |
|--------|-------|-------|---------|--------|--------|
| View workflows | ✓ | ✓ | ✓ | ✓ | ✓ |
| Edit workflows | ✓ | ✓ | ✓ | ✗ | ✗ |
| Create workflows | ✓ | ✓ | ✓ | ✗ | ✗ |
| Delete workflows | ✓ | ✓ | ✓ | ✗ | ✗ |
| Execute workflows | ✓ | ✓ | ✓ | ✓ | ✗ |
| View logs | ✓ | ✓ | ✓ | ✓ | ✓ |
| Invite members | ✓ | ✓ | ✗ | ✗ | ✗ |
| Remove members | ✓ | ✓ | ✗ | ✗ | ✗ |
| Change roles | ✓ | ✗ | ✗ | ✗ | ✗ |
| Delete project | ✓ | ✗ | ✗ | ✗ | ✗ |

### 7. **Integration & API Keys**

External integrations require authentication. API keys are project-scoped and can be rotated.

**Supported Integrations:**
- HTTP endpoints
- Webhooks (send and receive)
- Database connections
- Message queues
- Cloud storage

### 8. **Templates**

Pre-built workflow templates for common use cases. Users can fork templates to create new workflows.

**Template Features:**
- Pre-configured nodes
- Example parameters
- Documentation
- Test data

---

## User Workflows

### Creating and Running a Workflow

```
1. Create Project
   ↓
2. Create Workflow
   ↓
3. Add Nodes (drag-drop)
   ↓
4. Connect Nodes (draw edges)
   ↓
5. Configure Parameters (config panel)
   ↓
6. Test Execution (Test Run)
   ↓
7. Publish (activate)
   ↓
8. Monitor Executions (view logs)
   ↓
9. Iterate (edit workflow)
```

### Managing Team Access

```
1. Invite Team Member (email)
   ↓
2. Assign Role 
   ↓
3. Member Gets Access to Project
   ↓
4. Member Can View/Edit Based on Role
   ↓
5. Change Role or Remove as Needed
```

---

## Data Flow Overview

### Creating a Workflow

```
User(React)
    ↓ [Add node, connect edges]
Canvas State (React Flow)
    ↓ [Save button]
API POST /workflows
    ↓
Backend (Node.js)
    ↓ [Validate, check permissions]
Database
    ↓ [Store workflow JSON]
Return workflow ID
    ↓ [Update local state]
User sees confirmation
```

### Executing a Workflow

```
User(React)
    ↓ [Click Execute]
API POST /executions
    ↓
Backend Queue
    ↓ [Check permissions]
Execution Engine
    ↓ [Load workflow]
Process Nodes
    ├─ Load node handler
    ├─ Run node logic
    ├─ Handle errors
    └─ Record output
    ↓ [Update dashboard]
Return execution status
    ↓ [Show in UI]
User sees results
```

---

## Technology Decision Points

### Why React Flow?
- Handles large node graphs efficiently
- Built-in pan, zoom, minimap
- Customizable node rendering
- Active community and good documentation

### Why Next.js?
- Full-stack framework (frontend + API)
- Server-side rendering for performance
- Built-in routing and middleware
- Easy deployment to modern platforms

### Why TypeScript?
- Type safety catches errors early
- Better IDE support and refactoring
- Serves as documentation
- Scales better for teams

### Why Mock Data?
- Development without database setup
- Easy to modify test scenarios
- Simulates data structure for API endpoints
- Can be replaced with real database

---

## Key Principles

1. **User-Centric Design** - Visual over configuration
2. **Security First** - Validate permissions at every step
3. **Scalability** - Add new node types without modifying core
4. **Reliability** - Error handling and recovery
5. **Developer Experience** - Clear APIs and documentation

---

**Next Steps:**
- Read [Architecture](./architecture.md) to understand system design
- Read [Setup Guide](./setup.md) to get it running
- Pick a documentation file based on your role/task
