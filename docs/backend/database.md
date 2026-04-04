# Database Schema

Complete reference for all Autoflow data models.

## Current Implementation

Currently using **mock in-memory data store** in `lib/mock-data.ts`. This document shows the expected schema when migrating to a real database.

## Data Models

### 1. User

Represents a user account.

```typescript
interface User {
  id: string                    // Unique identifier (user-1, user-2, etc)
  email: string                 // Unique email address
  name: string                  // Display name
  password: string              // Hashed password (if using local auth)
  role: 'admin' | 'user'        // Site-level role
  createdAt: Date              // Account creation date
  updatedAt: Date              // Last update
}

// Example
{
  id: "user-1",
  email: "john@example.com",
  name: "John Doe",
  password: "$2b$10$...",       // bcrypt hash
  role: "user",
  createdAt: "2024-01-10T00:00:00Z",
  updatedAt: "2024-01-10T00:00:00Z"
}
```

### 2. Project

Container for workflows and team collaboration.

```typescript
interface Project {
  id: string
  name: string                  // User-entered name
  description: string
  ownerId: string              // User ID of creator/owner
  members: ProjectMember[]     // Team members with roles
  createdAt: Date
  updatedAt: Date
}

// Example
{
  id: "proj-1",
  name: "E-commerce Platform",
  description: "Main project for shop",
  ownerId: "user-1",
  members: [
    { userId: "user-1", role: "Owner", joinedAt: "2024-01-10T00:00:00Z" },
    { userId: "user-2", role: "Admin", joinedAt: "2024-01-11T00:00:00Z" }
  ],
  createdAt: "2024-01-10T00:00:00Z",
  updatedAt: "2024-01-10T00:00:00Z"
}
```

### 3. ProjectMember

Links users to projects with role-based permissions.

```typescript
interface ProjectMember {
  userId: string               // Foreign key to User
  projectId: string            // Foreign key to Project
  role: ProjectRole            // Owner | Admin | Builder | Runner | Viewer
  joinedAt: Date
}

type ProjectRole = 'Owner' | 'Admin' | 'Builder' | 'Runner' | 'Viewer';

// Example
{
  userId: "user-2",
  projectId: "proj-1",
  role: "Admin",
  joinedAt: "2024-01-11T00:00:00Z"
}
```

**Permissions by Role:** (See [RBAC Guide](./rbac.md))

### 4. Workflow

The core automation definition.

```typescript
interface Workflow {
  id: string
  projectId: string           // Foreign key to Project
  name: string                // User-entered name
  description?: string
  status: 'draft' | 'active' | 'inactive'
  
  // React Flow data (stored as JSON)
  nodes: Node[]               // Node definitions
  edges: Edge[]               // Connections between nodes
  
  createdBy: string           // User ID (foreign key)
  createdAt: Date
  updatedAt: Date
}

interface Node {
  id: string                  // Unique within workflow
  type: string                // Type identifier
  label: string               // Display name
  params: Record<string, any> // Configuration
  position: { x: number; y: number }
}

interface Edge {
  id: string
  source: string              // Source node ID
  target: string              // Target node ID
  label?: string              // For branching (true/false)
  animated?: boolean
}

// Example
{
  id: "wf-1",
  projectId: "proj-1",
  name: "Order Processing",
  description: "Process new orders",
  status: "active",
  nodes: [
    {
      id: "trigger-1",
      type: "webhook",
      label: "Order Webhook",
      params: { path: "/order-received" },
      position: { x: 0, y: 0 }
    },
    {
      id: "action-1",
      type: "http-request",
      label: "Process Payment",
      params: {
        url: "https://api.stripe.com/charges",
        method: "POST"
      },
      position: { x: 0, y: 100 }
    }
  ],
  edges: [
    {
      id: "e1",
      source: "trigger-1",
      target: "action-1"
    }
  ],
  createdBy: "user-1",
  createdAt: "2024-01-10T00:00:00Z",
  updatedAt: "2024-01-10T00:00:00Z"
}
```

### 5. WorkflowExecution

Record of workflow runs for monitoring and debugging.

```typescript
interface WorkflowExecution {
  id: string
  workflowId: string          // Foreign key to Workflow
  projectId: string           // Foreign key to Project
  
  status: ExecutionStatus
  startedAt: Date
  completedAt?: Date
  duration?: number           // Milliseconds (calculated)
  
  triggeredBy: string         // User ID who triggered
  error?: string              // Error message if failed
  
  logs: ExecutionLog[]        // Execution trace
}

type ExecutionStatus = 'pending' | 'running' | 'success' | 'failed' | 'unknown';

interface ExecutionLog {
  timestamp: Date
  nodeId: string
  nodeType: string
  nodeLabel: string
  status: 'success' | 'failed' | 'skipped' | 'running'
  message: string
  level: 'info' | 'warn' | 'error'
  input?: any                 // What was passed in
  output?: any                // What was returned
  duration?: number           // Milliseconds
  error?: string              // Error details
}

// Example
{
  id: "exec-1",
  workflowId: "wf-1",
  projectId: "proj-1",
  status: "success",
  startedAt: "2024-01-15T10:00:00Z",
  completedAt: "2024-01-15T10:00:02.450Z",
  duration: 2450,
  triggeredBy: "user-1",
  error: null,
  logs: [
    {
      timestamp: "2024-01-15T10:00:00Z",
      nodeId: "trigger-1",
      nodeType: "webhook",
      nodeLabel: "Order Webhook",
      status: "success",
      message: "Webhook fired",
      level: "info",
      input: { orderId: "ORD-123", amount: 99.99 },
      output: { ... }
    },
    {
      timestamp: "2024-01-15T10:00:01.200Z",
      nodeId: "action-1",
      nodeType: "http-request",
      nodeLabel: "Process Payment",
      status: "success",
      message: "HTTP request completed",
      level: "info",
      duration: 1200
    }
  ]
}
```

### 6. Integration

Third-party service configuration (OAuth, API keys, webhooks, etc).

```typescript
interface Integration {
  id: string
  projectId: string             // Foreign key to Project
  type: string                  // slack, github, stripe, etc
  name: string                  // User-friendly name
  
  // Encrypted credentials
  credentials: Record<string, string>
  
  // Config
  config?: Record<string, any>
  
  // Status
  active: boolean
  lastTestedAt?: Date
  error?: string
  
  createdAt: Date
  updatedAt: Date
}

// Example (credentials are encrypted in DB)
{
  id: "int-1",
  projectId: "proj-1",
  type: "slack",
  name: "Development Workspace",
  credentials: {
    // Stored encrypted
    "bot_token": "encrypted:xoxb-..."
  },
  config: {
    defaultChannel: "#notifications"
  },
  active: true,
  createdAt: "2024-01-10T00:00:00Z",
  updatedAt: "2024-01-10T00:00:00Z"
}
```

### 7. ApiKey

API keys for programmatic access.

```typescript
interface ApiKey {
  id: string
  projectId: string             // Foreign key
  name: string                  // User-friendly name
  
  key: string                   // Hashed (never returned)
  keyLastFourChars: string      // For display
  
  permissions: string[]         // Scopes
  rateLimit?: number            // Requests per minute
  
  active: boolean
  lastUsedAt?: Date
  expiresAt?: Date              // Optional expiration
  
  createdAt: Date
  createdBy: string             // User who created it
}

// Example
{
  id: "key-1",
  projectId: "proj-1",
  name: "CI/CD Integration",
  key: "$2b$10$...",             // Hashed
  keyLastFourChars: "abcd",
  permissions: ["workflow:read", "execution:write"],
  rateLimit: 100,
  active: true,
  lastUsedAt: "2024-01-15T09:30:00Z",
  expiresAt: "2025-01-15T00:00:00Z",
  createdAt: "2024-01-10T00:00:00Z",
  createdBy: "user-1"
}
```

### 8. Template

Workflow templates for common use cases.

```typescript
interface Template {
  id: string
  name: string
  description: string
  category: string              // slack, github, email, etc
  
  nodes: Node[]
  edges: Edge[]
  
  popularity: number            // Usage count
  author: string               // Creator user ID
  
  createdAt: Date
  updatedAt: Date
}

// Example
{
  id: "tmpl-slack-notification",
  name: "Send Slack Notification",
  description: "Send message to Slack channel",
  category: "slack",
  nodes: [
    {
      id: "trigger-1",
      type: "webhook",
      label: "Trigger"
    },
    {
      id: "action-1",
      type: "slack-message",
      label: "Send Message"
    }
  ],
  edges: [...],
  popularity: 245,
  author: "system",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z"
}
```

## Database Schema (SQL)

For PostgreSQL migration:

```sql
-- Users
CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  owner_id VARCHAR(50) REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Project Members (RBAC)
CREATE TABLE project_members (
  id SERIAL PRIMARY KEY,
  project_id VARCHAR(50) REFERENCES projects(id) ON DELETE CASCADE,
  user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL,
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Workflows
CREATE TABLE workflows (
  id VARCHAR(50) PRIMARY KEY,
  project_id VARCHAR(50) REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  
  -- Store React Flow data as JSONB for flexibility
  nodes JSONB NOT NULL,
  edges JSONB NOT NULL,
  
  created_by VARCHAR(50) REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Executions
CREATE TABLE workflow_executions (
  id VARCHAR(50) PRIMARY KEY,
  workflow_id VARCHAR(50) REFERENCES workflows(id) ON DELETE CASCADE,
  project_id VARCHAR(50) REFERENCES projects(id),
  status VARCHAR(50) NOT NULL,
  
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  duration_ms INTEGER,
  
  triggered_by VARCHAR(50) REFERENCES users(id),
  error TEXT,
  
  -- Store logs as JSONB
  logs JSONB DEFAULT '[]',
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Integrations
CREATE TABLE integrations (
  id VARCHAR(50) PRIMARY KEY,
  project_id VARCHAR(50) REFERENCES projects(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  
  -- Encrypted credentials
  credentials_encrypted TEXT,
  config JSONB,
  
  active BOOLEAN DEFAULT true,
  last_tested_at TIMESTAMP,
  error TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- API Keys
CREATE TABLE api_keys (
  id VARCHAR(50) PRIMARY KEY,
  project_id VARCHAR(50) REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255),
  
  key_hash VARCHAR(255),
  key_last_four VARCHAR(4),
  
  permissions TEXT[],
  rate_limit INTEGER,
  
  active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMP,
  expires_at TIMESTAMP,
  
  created_by VARCHAR(50) REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_project_members_user ON project_members(user_id);
CREATE INDEX idx_project_members_project ON project_members(project_id);
CREATE INDEX idx_workflows_project ON workflows(project_id);
CREATE INDEX idx_executions_workflow ON workflow_executions(workflow_id);
CREATE INDEX idx_executions_status ON workflow_executions(status);
CREATE INDEX idx_integrations_project ON integrations(project_id);
CREATE INDEX idx_api_keys_project ON api_keys(project_id);
```

## Relationships

```
User
  ├─ 1:many → ProjectMember
  ├─ 1:many → Project (as owner)
  └─ 1:many → Workflow (as creator)

Project
  ├─ many:many → User (through ProjectMember)
  ├─ 1:many → Workflow
  ├─ 1:many → WorkflowExecution
  ├─ 1:many → Integration
  └─ 1:many → ApiKey

Workflow
  ├─ many:1 → Project
  └─ 1:many → WorkflowExecution

WorkflowExecution
  ├─ many:1 → Workflow
  └─ many:1 → Project

Integration
  └─ many:1 → Project

ApiKey
  ├─ many:1 → Project
  └─ many:1 → User (creator)
```

## Query Examples

### Get User's Projects (with Role)

```sql
SELECT p.*, pm.role
FROM projects p
JOIN project_members pm ON p.id = pm.project_id
WHERE pm.user_id = 'user-1'
ORDER BY p.created_at DESC;
```

### Get Workflow Execution History

```sql
SELECT * 
FROM workflow_executions
WHERE workflow_id = 'wf-1'
ORDER BY started_at DESC
LIMIT 50;
```

### Get Average Execution Time

```sql
SELECT 
  workflow_id,
  AVG(duration_ms) as avg_duration,
  COUNT(*) as total_runs
FROM workflow_executions
WHERE status = 'success'
  AND created_at > NOW() - INTERVAL '7 days'
GROUP BY workflow_id;
```

### Check User Permission

```sql
SELECT pm.role
FROM project_members pm
WHERE pm.project_id = 'proj-1' 
  AND pm.user_id = 'user-1';
```

## Scaling Considerations

### Partitioning

Large `workflow_executions` table should be partitioned by date:

```sql
CREATE TABLE workflow_executions_2024_01 PARTITION OF workflow_executions
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

### Archiving

Old executions can be archived:

```sql
-- Archive executions older than 1 year
INSERT INTO workflow_executions_archive
SELECT * FROM workflow_executions 
WHERE created_at < NOW() - INTERVAL '1 year';
```

### Caching

Cache frequently accessed queries:

```
- User's projects (5 min TTL)
- Workflow definitions (1 hour TTL)
- Execution logs (30 min TTL)
```

---

**Next Steps:**
- Read [RBAC Guide](./rbac.md) for permission enforcement
- Read [API Documentation](./api.md) for endpoint details
- Check [Setup Guide](../setup.md#database-setup) for migration steps
