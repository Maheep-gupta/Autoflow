# API Documentation

Complete reference for all Autoflow API endpoints.

## Base URL

```
Development: http://localhost:3000/api
Production: https://yourdomain.com/api
```

## Authentication

All requests include a user ID header:

```
Headers:
  user-id: user-1
  Content-Type: application/json
```

Current implementation uses mock auth (always authenticated as user-1). Replace with real auth provider.

## Response Format

### Success Response

```json
{
  "data": { ... },
  "status": 200,
  "message": "Operation successful"
}
```

HTTP Status: `200 OK`

### Error Response

```json
{
  "error": "Resource not found",
  "status": 404
}
```

HTTP Status: `4xx` or `5xx`

## Projects API

### List Projects

```http
GET /api/projects
```

Retrieve all projects where user has access.

**Response:**
```json
[
  {
    "id": "proj-1",
    "name": "E-commerce",
    "description": "Main project",
    "ownerId": "user-1",
    "workflowCount": 5,
    "memberCount": 3,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
]
```

**Status:** `200 OK`

### Create Project

```http
POST /api/projects
Content-Type: application/json

{
  "name": "New Project",
  "description": "Project description"
}
```

**Response:**
```json
{
  "id": "proj-2",
  "name": "New Project",
  "description": "Project description",
  "ownerId": "user-1",
  "members": [
    {
      "userId": "user-1",
      "role": "Owner",
      "joinedAt": "2024-01-15T10:00:00Z"
    }
  ],
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

**Status:** `201 Created`

**Errors:**
- `400 Bad Request` - Missing required fields
- `403 Forbidden` - User not authorized

### Get Project

```http
GET /api/projects/{projectId}
```

**Parameters:**
- `projectId` - Project ID (path parameter)

**Response:**
```json
{
  "id": "proj-1",
  "name": "E-commerce",
  "description": "Main project",
  "ownerId": "user-1",
  "members": [
    {
      "userId": "user-1",
      "role": "Owner",
      "joinedAt": "2024-01-15T10:00:00Z"
    },
    {
      "userId": "user-2",
      "role": "Admin",
      "joinedAt": "2024-01-16T10:00:00Z"
    }
  ],
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

**Status:** `200 OK`

**Errors:**
- `404 Not Found` - Project doesn't exist
- `403 Forbidden` - User doesn't have access

### Update Project

```http
PUT /api/projects/{projectId}
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description"
}
```

**Response:** Updated project object

**Status:** `200 OK`

**Errors:**
- `404 Not Found`
- `403 Forbidden` - Only Owner can edit
- `400 Bad Request` - Invalid data

### Delete Project

```http
DELETE /api/projects/{projectId}
```

**Status:** `204 No Content`

**Errors:**
- `404 Not Found`
- `403 Forbidden` - Only Owner can delete

## Workflows API

### Create Workflow

```http
POST /api/workflows
Content-Type: application/json

{
  "projectId": "proj-1",
  "name": "Payment Processing",
  "nodes": [
    {
      "id": "trigger-1",
      "type": "webhook",
      "label": "Webhook",
      "params": { "path": "/payment" },
      "position": { "x": 0, "y": 0 }
    },
    {
      "id": "action-1",
      "type": "http-request",
      "label": "Process Payment",
      "params": {
        "url": "https://api.stripe.com/v1/charges",
        "method": "POST"
      },
      "position": { "x": 0, "y": 100 }
    }
  ],
  "edges": [
    {
      "id": "e1",
      "source": "trigger-1",
      "target": "action-1"
    }
  ]
}
```

**Response:**
```json
{
  "id": "wf-1",
  "projectId": "proj-1",
  "name": "Payment Processing",
  "status": "draft",
  "nodes": [...],
  "edges": [...],
  "createdBy": "user-1",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

**Status:** `201 Created`

**Errors:**
- `400 Bad Request` - Invalid workflow structure
- `403 Forbidden` - User can't create in this project
- `404 Not Found` - Project doesn't exist

### Get Workflow

```http
GET /api/workflows/{workflowId}
```

**Response:**
```json
{
  "id": "wf-1",
  "projectId": "proj-1",
  "name": "Payment Processing",
  "status": "active",
  "nodes": [...],
  "edges": [...],
  "createdBy": "user-1",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

**Status:** `200 OK`

**Errors:**
- `404 Not Found` - Workflow doesn't exist
- `403 Forbidden` - User doesn't have access

### Update Workflow

```http
PUT /api/workflows/{workflowId}
Content-Type: application/json

{
  "name": "Updated Name",
  "status": "active",
  "nodes": [...],
  "edges": [...]
}
```

**Response:** Updated workflow object

**Status:** `200 OK`

**Errors:**
- `404 Not Found`
- `403 Forbidden` - Only Owner/Admin/Builder can edit
- `400 Bad Request` - Invalid structure

### Delete Workflow

```http
DELETE /api/workflows/{workflowId}
```

Also deletes all related executions.

**Status:** `204 No Content`

**Errors:**
- `404 Not Found`
- `403 Forbidden` - Only Owner/Admin/Builder can delete

### List Project Workflows

```http
GET /api/projects/{projectId}/workflows
```

Get all workflows in a project.

**Query Parameters:**
- `status` (optional) - Filter by status: "draft", "active", "inactive"
- `limit` (optional) - Max results (default: 50)
- `offset` (optional) - Pagination offset (default: 0)

**Response:**
```json
[
  {
    "id": "wf-1",
    "projectId": "proj-1",
    "name": "Payment Processing",
    ...
  },
  {
    "id": "wf-2",
    "projectId": "proj-1",
    "name": "Email Notifications",
    ...
  }
]
```

**Status:** `200 OK`

## Executions API

### Create Execution

```http
POST /api/executions
Content-Type: application/json

{
  "workflowId": "wf-1",
  "projectId": "proj-1",
  "triggeredBy": "user-1"
}
```

Starts workflow execution.

**Response:**
```json
{
  "id": "exec-1",
  "workflowId": "wf-1",
  "projectId": "proj-1",
  "status": "running",
  "triggeredBy": "user-1",
  "startedAt": "2024-01-15T10:00:00Z",
  "completedAt": null,
  "duration": null,
  "logs": []
}
```

**Status:** `201 Created`

**Errors:**
- `400 Bad Request` - Invalid parameters
- `403 Forbidden` - User can't execute
- `404 Not Found` - Workflow not found

### Get Execution

```http
GET /api/executions/{executionId}
```

**Response:**
```json
{
  "id": "exec-1",
  "workflowId": "wf-1",
  "projectId": "proj-1",
  "status": "success",
  "triggeredBy": "user-1",
  "startedAt": "2024-01-15T10:00:00Z",
  "completedAt": "2024-01-15T10:00:02Z",
  "duration": 2000,
  "error": null,
  "logs": [
    {
      "timestamp": "2024-01-15T10:00:00Z",
      "nodeId": "trigger-1",
      "message": "Webhook executed",
      "level": "info"
    },
    {
      "timestamp": "2024-01-15T10:00:01Z",
      "nodeId": "action-1",
      "message": "HTTP request completed",
      "level": "info"
    }
  ]
}
```

**Status:** `200 OK`

**Errors:**
- `404 Not Found` - Execution not found
- `403 Forbidden` - User doesn't have access

### List Executions

```http
GET /api/executions
```

Get execution history.

**Query Parameters:**
- `workflowId` (optional) - Filter by workflow
- `status` (optional) - Filter by status: "pending", "running", "success", "failed"
- `limit` (optional) - Max results (default: 50)
- `offset` (optional) - Pagination (default: 0)

**Response:**
```json
[
  {
    "id": "exec-3",
    "workflowId": "wf-1",
    "status": "success",
    "duration": 1500,
    "startedAt": "2024-01-15T11:00:00Z",
    "completedAt": "2024-01-15T11:00:02Z"
  },
  {
    "id": "exec-2",
    "workflowId": "wf-1",
    "status": "success",
    "duration": 2000,
    "startedAt": "2024-01-15T10:30:00Z",
    "completedAt": "2024-01-15T10:30:02Z"
  },
  {
    "id": "exec-1",
    "workflowId": "wf-1",
    "status": "failed",
    "duration": 500,
    "startedAt": "2024-01-15T10:00:00Z",
    "completedAt": "2024-01-15T10:00:01Z",
    "error": "API timeout"
  }
]
```

**Status:** `200 OK`

## Integrations API

### List Integrations

```http
GET /api/projects/{projectId}/integrations
```

Get all integrations configured for a project.

**Response:**
```json
[
  {
    "id": "int-1",
    "type": "slack",
    "name": "Slack Workspace",
    "configured": true,
    "createdAt": "2024-01-15T10:00:00Z"
  },
  {
    "id": "int-2",
    "type": "github",
    "name": "GitHub Account",
    "configured": true,
    "createdAt": "2024-01-14T10:00:00Z"
  }
]
```

**Status:** `200 OK`

### Configure Integration

```http
POST /api/projects/{projectId}/integrations
Content-Type: application/json

{
  "type": "slack",
  "name": "Slack Workspace",
  "credentials": {
    "bot_token": "xoxb-..."
  }
}
```

**Response:**
```json
{
  "id": "int-3",
  "type": "slack",
  "name": "Slack Workspace",
  "configured": true,
  "createdAt": "2024-01-15T10:00:00Z"
}
```

**Status:** `201 Created`

**Errors:**
- `400 Bad Request` - Invalid credentials
- `403 Forbidden` - User can't manage integrations

## Authentication API

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user-1",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGc..."
}
```

**Status:** `200 OK`

**Errors:**
- `401 Unauthorized` - Invalid credentials

### Sign Up

```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "New User"
}
```

**Response:** Same as login

**Status:** `201 Created`

**Errors:**
- `409 Conflict` - Email already exists
- `400 Bad Request` - Missing fields

## Error Codes

| Code | Meaning | What to do |
|------|---------|-----------|
| `400 Bad Request` | Invalid input | Check request body format |
| `401 Unauthorized` | Auth failed | Re-authenticate |
| `403 Forbidden` | Permission denied | Check user role |
| `404 Not Found` | Resource missing | Check IDs |
| `409 Conflict` | Duplicate resource | Use different name/email |
| `500 Internal Server Error` | Server error | Retry or contact support |
| `503 Service Unavailable` | Server down | Retry later |

## Rate Limiting

Not currently implemented. Add when going to production:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1234567890
```

## Pagination

For list endpoints:

```http
GET /api/resources?limit=20&offset=40
```

Response includes metadata:

```json
{
  "data": [...],
  "pagination": {
    "limit": 20,
    "offset": 40,
    "total": 156
  }
}
```

## Testing Endpoints

### cURL Examples

Create project:
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "user-id: user-1" \
  -d '{"name": "Test Project", "description": "Testing"}'
```

Get workflows:
```bash
curl http://localhost:3000/api/projects/proj-1/workflows \
  -H "user-id: user-1"
```

Execute workflow:
```bash
curl -X POST http://localhost:3000/api/executions \
  -H "Content-Type: application/json" \
  -H "user-id: user-1" \
  -d '{"workflowId": "wf-1", "projectId": "proj-1", "triggeredBy": "user-1"}'
```

### Postman Collection

Export from Autoflow (coming soon) or build manually by following examples above.

## API Client (JavaScript/TypeScript)

Use the `lib/api-service.ts` file:

```typescript
import {
  getProjects,
  createWorkflow,
  getWorkflow,
  saveWorkflow,
  executeWorkflow,
  getExecutions,
  deleteWorkflow
} from '@/lib/api-service';

// Get projects
const projects = await getProjects();

// Create workflow
const newWf = await createWorkflow('proj-1', {
  name: 'My Workflow',
  nodes: [...],
  edges: [...]
});

// Execute workflow
const execution = await executeWorkflow('wf-1', 'proj-1');

// Get execution status
const result = await getExecutions({ workflowId: 'wf-1', limit: 10 });
```

---

**Next Steps:**
- Learn [how to create API routes](../project-structure.md#adding-new-features)
- Review [RBAC permission system](./rbac.md)
- Check [data models](./database.md)
