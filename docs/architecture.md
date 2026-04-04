# System Architecture

## High-Level Overview

Autoflow follows a client-server architecture with a visual editor frontend and RESTful API backend:

```
┌─────────────────────────────────────────────────────────────┐
│                    User Browser                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  React Application (Next.js App Router)             │    │
│  │  ├─ Dashboard (project/workflow management)         │    │
│  │  ├─ Workflow Editor (React Flow canvas)             │    │
│  │  ├─ Execution Monitor (status and logs)             │    │
│  │  └─ Settings (team, integrations)                   │    │
│  └─────────────────────────────────────────────────────┘    │
│                           ↓ HTTP/JSON                        │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                   next/api Routes (Backend)                  │
│  ┌───────────────────────────────────────────────────┐      │
│  │  API Routes (Node.js)                             │      │
│  │  ├─ /api/projects/* (CRUD)                        │      │
│  │  ├─ /api/workflows/* (CRUD)                        │      │
│  │  ├─ /api/executions/* (Create & list)             │      │
│  │  ├─ /api/integrations/* (Manage connections)      │      │
│  │  └─ /api/auth/* (Login/signup)                     │      │
│  └───────────────────────────────────────────────────┘      │
│                           ↓                                   │
│  ┌───────────────────────────────────────────────────┐      │
│  │  Business Logic (lib/ functions)                  │      │
│  │  ├─ RBAC enforcement (permissions)                │      │
│  │  ├─ Workflow validation                           │      │
│  │  ├─ Execution engine                              │      │
│  │  └─ Data service functions                        │      │
│  └───────────────────────────────────────────────────┘      │
│                           ↓                                   │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                  In-Memory Data Store                        │
│  ├─ Users & Authentication                                   │
│  ├─ Projects & Memberships                                   │
│  ├─ Workflows (JSON stored as nodes/edges)                  │
│  ├─ Executions & Logs                                        │
│  └─ Integrations & Credentials                              │
│  (Note: Mock data - can replace with real database)         │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### State Management

The frontend uses React Hooks for state management:

```
┌────────────────────────────────────────────┐
│       Page Components (Next.js)             │
├────────────────────────────────────────────┤
│ Dashboard                                   │
│ ├─ useEffect: fetch projects/workflows      │
│ ├─ setState: projects[], currentProject     │
│ ├─ Context: passed to children              │
│ └─ Render: WorkflowCard components          │
├────────────────────────────────────────────┤
│ Workflow Editor ([id]/page.tsx)             │
│ ├─ useEffect: fetch workflow (EDIT mode)    │
│ ├─ setNodes/setEdges: React Flow state      │
│ ├─ useState: selectedNode, configModal      │
│ └─ onSave: POST/PUT to /api/workflows       │
└────────────────────────────────────────────┘
```

### Component Hierarchy

```
App
├─ layout.tsx (root layout)
├─ page.tsx (landing page)
├─ auth/
│  ├─ login/
│  └─ signup/
├─ dashboard/
│  ├─ page.tsx (project list)
│  ├─ project/[id]/page.tsx (project detail)
│  │  ├─ WorkflowCard[] (list workflows)
│  │  └─ ExecutionTable (recent runs)
│  └─ workflow/
│     ├─ [id]/page.tsx (view/edit)
│     └─ new/page.tsx (create new)
└─ workflow/[id]/page.tsx (main editor)
   ├─ WorkflowCanvas (React Flow)
   │  ├─ Node[] (visual nodes)
   │  └─ Edge[] (connections)
   ├─ ConfigPanel (node parameters)
   ├─ Toolbar (save, test, publish)
   └─ Sidebar (node palette)
```

### React Flow Integration

React Flow manages the canvas state:

```
WorkflowCanvas Component
├─ useNodesState(nodes) → [nodes, setNodes, ...]
├─ useEdgesState(edges) → [edges, setEdges, ...]
├─ useReactFlow() → { getNodes, getEdges, setCenter }
├─ Event Handlers:
│  ├─ onNodesChange: Updates local node state
│  ├─ onEdgesChange: Updates local edge state
│  ├─ onConnect: Creates new edges
│  ├─ onNodeClick: Selects node, shows config panel
│  └─ onDragStop: Records new position
└─ onSave:
   └─ POST/PUT /api/workflows with getNodes(), getEdges()
```

## Backend Architecture

### API Routes Structure

```
app/api/
├─ projects/
│  ├─ route.ts (POST list, POST create)
│  └─ [id]/route.ts (GET detail, PUT update, DELETE)
├─ workflows/
│  ├─ route.ts (POST create)
│  └─ [id]/route.ts (GET detail, PUT update, DELETE)
├─ executions/
│  ├─ route.ts (POST create, GET list)
│  └─ [id]/route.ts (GET detail)
├─ integrations/
│  ├─ route.ts (GET list)
│  └─ [id]/route.ts (GET detail)
└─ auth/
   ├─ login/route.ts
   └─ signup/route.ts
```

### Request/Response Pattern

All API routes follow this pattern:

```typescript
// GET /api/resource/[id]
export async function GET(req, { params }) {
  try {
    // 1. Validate authentication
    const userId = req.headers['user-id'] || 'user-1';
    
    // 2. Fetch data from store
    const resource = store.get(params.id);
    
    // 3. Check permissions (RBAC)
    if (!canUserAccess(userId, resource)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // 4. Return resource
    return Response.json(resource, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

### RBAC Enforcement

Permission checks happen on the backend:

```
User Request
    ↓
Authenticate User
    ↓
Load Resource (project/workflow/etc)
    ↓
Check: canUserPerformAction(userId, resource, action)
    ├─ If true → Proceed with operation
    └─ If false → Return 403 Forbidden
    ↓
Execute Operation (create/update/delete)
    ↓
Return Result/Error
```

Permission Check Example:

```typescript
function canUserEditWorkflow(userId, workflow, userRole) {
  if (userRole === 'Viewer' || userRole === 'Runner') {
    return false; // Not allowed
  }
  if (userRole === 'Owner') {
    return true; // Always allowed
  }
  if (userRole === 'Admin' || userRole === 'Builder') {
    return true; // Allowed
  }
  return false; // Default deny
}
```

## Data Models

### Project

```typescript
interface Project {
  id: string
  name: string
  description: string
  ownerId: string
  members: ProjectMember[]
  workflowCount: number
  createdAt: Date
  updatedAt: Date
}

interface ProjectMember {
  userId: string
  role: 'Owner' | 'Admin' | 'Builder' | 'Runner' | 'Viewer'
  joinedAt: Date
}
```

### Workflow

```typescript
interface Workflow {
  id: string
  projectId: string
  name: string
  description: string
  status: 'draft' | 'active' | 'inactive'
  nodes: Node[]              // From React Flow
  edges: Edge[]              // From React Flow
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

interface Node {
  id: string
  type: 'trigger' | 'action' | 'condition' | 'loop' | 'data' | 'control'
  label: string
  params: Record<string, any>  // Configuration
  position: { x: number; y: number }
}

interface Edge {
  id: string
  source: string
  target: string
  animated?: boolean
}
```

### Execution

```typescript
interface WorkflowExecution {
  id: string
  workflowId: string
  projectId: string
  status: 'pending' | 'running' | 'success' | 'failed' | 'unknown'
  startedAt: Date
  completedAt?: Date
  duration: number  // milliseconds
  triggeredBy: string
  error?: string
  logs: ExecutionLog[]
}

interface ExecutionLog {
  timestamp: Date
  nodeId: string
  message: string
  level: 'info' | 'warn' | 'error'
  data?: any
}
```

## Data Flow Examples

### Creating a Workflow

```
1. User in Workflow Editor clicks "Save"
   ├─ Canvas has nodes=[...] and edges=[...]
   └─ User sees "Saving..." indicator

2. Frontend Action:
   ├─ Determine mode: 
   │  ├─ If URL has ?projectId but no workflowId → CREATE
   │  └─ If URL has workflowId → EDIT
   ├─ Call API with mode
   │  ├─ CREATE: POST /api/workflows
   │  │  └─ body: { projectId, name, nodes, edges }
   │  └─ EDIT: PUT /api/workflows/{id}
   │     └─ body: { name, nodes, edges }
   └─ Send along nodes/edges JSON

3. Backend Processing:
   ├─ Route handler receives request
   ├─ Validate authentication (check user-id header)
   ├─ Validate authorization (can user edit this project?)
   ├─ Validate workflow structure:
   │  ├─ All nodes have required params
   │  ├─ Edges connect valid nodes
   │  └─ No circular dependencies
   ├─ Save to store
   ├─ Generate/use workflow ID
   └─ Return { id, status, timestamp, ... }

4. Frontend Response:
   ├─ Show success message
   ├─ Update local state
   ├─ Transition from CREATE → EDIT mode
   ├─ Update URL to include workflowId
   └─ Enable "Execute" button
```

### Executing a Workflow

```
1. User clicks "Run" on workflow card
   └─ UI shows loading spinner

2. Frontend calls POST /api/executions:
   ├─ body: { workflowId, projectId, triggeredBy }
   └─ Wait for response

3. Backend Processing:
   ├─ Validate user can execute this workflow
   ├─ Create execution record:
   │  ├─ id (unique)
   │  ├─ status = 'running'
   │  ├─ startedAt = now
   │  └─ logs = []
   ├─ Queue for execution:
   │  ├─ Load workflow from store
   │  ├─ Load first trigger node (entry point)
   │  └─ Begin processing nodes
   ├─ For each node:
   │  ├─ Load node handler based on type
   │  ├─ Execute node logic with params
   │  ├─ Handle success/error
   │  ├─ Append to execution logs
   │  └─ Move to next node(s)
   ├─ On completion:
   │  ├─ Set status = 'success' or 'failed'
   │  ├─ Set completedAt = now
   │  └─ Calculate duration
   └─ Store execution record

4. Frontend Dashboard:
   ├─ Poll GET /api/executions?workflowId={id}
   ├─ Show execution in table:
   │  ├─ timestamp
   │  ├─ status (with icon)
   │  ├─ duration
   │  └─ triggeredBy
   └─ User can click to view logs
```

## Integration Points

### 1. Authentication

Currently uses mock auth (hardcoded "user-1"). To integrate real auth:

```
app/auth/login/route.ts
├─ Receive credentials
├─ Validate against auth provider (OAuth, JWT, etc.)
├─ Create session/token
└─ Return to client

Every API route:
├─ Check Authorization header
├─ Validate token
├─ Extract userId
└─ Proceed
```

### 2. External Services

Workflows can call external integrations via Action nodes:

```
Action Node (HTTP request type)
├─ Config: { method, url, headers, body }
├─ On Execution:
│  ├─ Build request with params
│  ├─ Make HTTP call
│  ├─ Handle response
│  └─ Store response in execution context
└─ Pass data to next node
```

### 3. Database Replacement

Current mock data store in `lib/mock-data.ts`. To replace:

```typescript
// Before: In-memory store
const workflowStore = { /* ... */ }

// After: Database
import { db } from '@/lib/db'
const workflow = await db.workflows.findById(id)
```

All API routes use `lib/api-service.ts` functions, so change there once.

## Performance Considerations

### Canvas Rendering (React Flow)

```
Large workflows (100+ nodes) impact performance:
├─ Solution 1: Virtualization (render only visible nodes)
├─ Solution 2: Lazy loading (load nodes on demand)
└─ Solution 3: Subgraph clustering (group nodes)
```

### Execution Processing

```
Long-running workflows block node process:
├─ Solution: Move execution to job queue (Bull, RabbitMQ)
└─ Benefit: Can execute in background, webhook callbacks
```

### API Performance

```
High-traffic dashboards with many workflows:
├─ Add caching layer (Redis)
├─ Paginate API responses
└─ Optimize database queries (indexes)
```

## Scalability Path

```
Phase 1 (Current)
├─ In-memory mock data
├─ Single Node.js process
└─ ~10-100 users

Phase 2 (Production)
├─ Replace with PostgreSQL/MongoDB
├─ Add authentication (Auth0, Firebase)
├─ Deploy to Platform (Vercel, AWS, Azure)
└─ ~100-1000 users

Phase 3 (Enterprise)
├─ Distributed execution (microservices)
├─ Message queue (Redis/RabbitMQ)
├─ Load balancer
└─ Multi-region deployment
```

---

**Next Steps:**
- Read [Setup Guide](./setup.md) to configure environment
- Read [API Documentation](./backend/api.md) for endpoint details
- Read [RBAC Documentation](./backend/rbac.md) for permission system
