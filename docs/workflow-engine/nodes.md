# Workflow Nodes Guide

## What is a Node?

A node is a unit of work in a workflow. It can trigger workflows, perform actions, make decisions, or manipulate data. Nodes are connected to form a workflow graph.

## Node Structure

```typescript
interface Node {
  id: string                  // Unique ID within workflow (e.g., "node-1")
  type: string                // Node type (e.g., "trigger", "http-request")
  label: string               // Display name (editable in UI)
  params: {                   // Configuration for this node
    [key: string]: any        // Values vary by node type
  }
  position: {                 // Canvas position (set by React Flow)
    x: number
    y: number
  }
  data?: any                  // Runtime data (set during execution)
}
```

## Built-in Node Types

### 1. **Trigger Nodes** (Start workflow)

Start of the workflow. Defines what triggers execution.

#### Webhook Trigger
```typescript
{
  id: "trigger-1",
  type: "webhook",
  label: "Webhook Trigger",
  params: {
    path: "/my-webhook",    // Route: POST /api/webhooks/my-webhook
    headers: {}             // Expected headers
  }
}
```

When called: `POST /api/webhooks/my-webhook` → executes workflow

#### Schedule Trigger
```typescript
{
  id: "trigger-2",
  type: "schedule",
  label: "Daily at 9 AM",
  params: {
    frequency: "daily",     // "hourly", "daily", "weekly", "monthly"
    time: "09:00",          // 24-hour format
    timezone: "UTC"
  }
}
```

Executes automatically on schedule.

#### Event Trigger
```typescript
{
  id: "trigger-3",
  type: "event",
  label: "On Project Update",
  params: {
    eventType: "project.updated",  // Internal event
    filters: {}                    // Optional event filters
  }
}
```

Fires when specified event occurs.

### 2. **Action Nodes** (Perform work)

Do something: call APIs, send notifications, store data, etc.

#### HTTP Request
```typescript
{
  id: "action-1",
  type: "http-request",
  label: "Call GitHub API",
  params: {
    method: "GET",
    url: "https://api.github.com/repos/{{owner}}/{{repo}}",
    headers: {
      "Authorization": "Bearer {{github_token}}"
    },
    body: null,
    timeout: 30000  // milliseconds
  }
}
```

Makes HTTP request. Response available to next nodes.

#### Send Notification
```typescript
{
  id: "action-2",
  type: "send-email",
  label: "Send Email",
  params: {
    to: "{{user.email}}",
    subject: "Workflow Completed",
    body: "Your workflow {{workflow.name}} completed successfully."
  }
}
```

Sends email notification.

#### Write to Database
```typescript
{
  id: "action-3",
  type: "db-insert",
  label: "Log Result",
  params: {
    table: "executions",
    data: {
      workflow_id: "{{workflow.id}}",
      result: "{{previous_node.result}}",
      timestamp: "{{now()}}"
    }
  }
}
```

Write data to database.

#### Wait/Delay
```typescript
{
  id: "action-4",
  type: "wait",
  label: "Wait 1 minute",
  params: {
    duration: 60000  // milliseconds
  }
}
```

Pause workflow execution for specified time.

### 3. **Condition Nodes** (Branch logic)

Run different paths based on conditions.

#### If/Else
```typescript
{
  id: "condition-1",
  type: "if-else",
  label: "Check Status",
  params: {
    condition: "{{previous_node.status}} === 'success'",
    // Two outgoing edges: "true-path" and "false-path"
  }
}
```

**Execution:**
- If condition true → follow "true-path" edge
- If condition false → follow "false-path" edge

#### Switch
```typescript
{
  id: "condition-2",
  type: "switch",
  label: "Route by type",
  params: {
    value: "{{message.type}}",
    cases: [
      { value: "update", path: "update-handler" },
      { value: "delete", path: "delete-handler" },
      { default: true, path: "default-handler" }
    ]
  }
}
```

Switch on value, route to appropriate handler.

### 4. **Loop Nodes** (Repeat actions)

Execute same logic multiple times.

#### For Each
```typescript
{
  id: "loop-1",
  type: "for-each",
  label: "Process Each Item",
  params: {
    items: "{{previous_node.results}}",
    // Connected node runs once per item
    // Available as: {{item}} and {{item_index}}
  }
}
```

For each item in array, execute connected nodes.

#### While Loop
```typescript
{
  id: "loop-2",
  type: "while",
  label: "Retry Until Success",
  params: {
    condition: "{{current_attempt}} < {{max_attempts}}",
    maxIterations: 5  // Prevent infinite loops
  }
}
```

Execute connected nodes while condition true.

### 5. **Data Nodes** (Transform data)

Manipulate variables and data.

#### Extract Data
```typescript
{
  id: "data-1",
  type: "extract",
  label: "Get User ID",
  params: {
    source: "{{webhook.body}}",
    path: "user_id",
    // Result: {{previous_node.user_id}}
  }
}
```

Extract value from object using path.

#### Transform Data
```typescript
{
  id: "data-2",
  type: "transform",
  label: "Format Name",
  params: {
    operations: [
      {
        type: "map",
        input: "{{users}}",
        output: "{{item.first_name}} {{item.last_name}}"
      }
    ]
  }
}
```

Transform, filter, or map data.

#### Combine Data
```typescript
{
  id: "data-3",
  type: "merge",
  label: "Combine Results",
  params: {
    data1: "{{source1.result}}",
    data2: "{{source2.result}}",
    method: "merge"  // "merge", "concat", "append"
  }
}
```

Combine multiple data sources.

### 6. **Control Nodes** (Error handling)

Try/catch and error recovery.

#### Try/Catch
```typescript
{
  id: "control-1",
  type: "try-catch",
  label: "Safe API Call",
  params: {
    maxRetries: 3,
    timeout: 30000
  }
}
```

Try connected node. If error, execute error handler.

#### Error Handler
```typescript
{
  id: "control-2",
  type: "error-handler",
  label: "Log Error",
  params: {
    log: true,
    retry: false,
    fallback: "default_value"
  }
}
```

Handle errors from try/catch block.

## Node Parameter Types

Parameters can accept different input types:

### 1. **Static Values**
```typescript
params: {
  name: "John",
  age: 30,
  active: true,
  tags: ["tag1", "tag2"]
}
```

### 2. **Template Variables** (use `{{}}`)
```typescript
params: {
  to: "{{user.email}}",           // From previous node
  subject: "Hello {{user.name}}", // Variable interpolation
  url: "https://api.example.com/users/{{user.id}}"
}
```

Available variables:
- `{{trigger.*}}` - Trigger input data
- `{{previous_node.*}}` - Output from previous node
- `{{workflow.*}}` - Workflow metadata
- `{{now()}}` - Current timestamp
- `{{env.*}}` - Environment variables

### 3. **Expressions** (JavaScript-like)
```typescript
params: {
  condition: "{{user.age}} > 18",
  amount: "{{quantity}} * {{unit_price}}",
  filter: "{{item.status}} === 'active' && {{item.verified}} === true"
}
```

## Node Lifecycle

### 1. Creation
```
User adds node to canvas
  ↓
getDefaultParams(type) creates default configuration
  ↓
Node ID generated (e.g., "node-1")
  ↓
Node added to local state (React Flow)
```

### 2. Configuration
```
User clicks node
  ↓
ConfigPanel opens (right side)
  ↓
User edits params (inputs, select boxes)
  ↓
State updates: setNodes() → updates node.params
  ↓
User saves workflow (nodes sent to API)
```

### 3. Validation
```
User clicks Save
  ↓
Backend validates:
  ├─ All required params present
  ├─ Params have correct types
  ├─ Node connections valid (no circular)
  ├─ Trigger node exists
  └─ At least one action node exists
  ↓
If valid: Save to database
If invalid: Return error message
```

### 4. Execution
```
Workflow executes
  ↓
Find trigger node
  ↓
For each node in path:
  ├─ Resolve parameters (replace {{variables}})
  ├─ Execute node handler
  ├─ Store output
  ├─ Log execution
  └─ Handle errors
  ↓
Next node receives output as context
  ↓
Repeat until end or error
```

## Node Connections & Data Flow

### Edges

Edges define workflow direction:

```typescript
interface Edge {
  id: string           // e.g., "e1"
  source: string       // Source node ID (e.g., "node-1")
  target: string       // Target node ID (e.g., "node-2")
  label?: string       // Optional label (e.g., "success")
  animated?: boolean   // Show animation
}
```

### Output Flow

```
Node A executes
  ↓ output/result
Node B can access as:
  {{previous_node.result}}
  {{previous_node.data}}
  {{previous_node.*.anyProperty}}
```

Example:
```typescript
// Node A: HTTP Request
{
  type: "http-request",
  params: { url: "https://api.github.com/user" }
}
// Output: { id: 123, name: "John", email: "john@example.com" }

// Node B: Send Email
{
  type: "send-email",
  params: {
    to: "{{previous_node.email}}",      // john@example.com
    subject: "Hello {{previous_node.name}}"  // Hello John
  }
}
```

### Branching

Conditions create multiple paths:

```
[Condition Node]
  ├─ "true" edge → [Success Handler]
  └─ "false" edge → [Error Handler]
```

All paths must eventually rejoin or end.

## Common Node Patterns

### Pattern 1: Fetch and Process
```
[Webhook Trigger]
  ↓
[HTTP Request to API]
  ↓
[Extract Data]
  ↓
[Transform Data]
  ↓
[Write to Database]
```

### Pattern 2: Error Recovery
```
[Action Node]
  ├─ Success → [Log Success]
  └─ Error → [Retry 3 times]
            → [Log Error]
            → [Send Alert Email]
```

### Pattern 3: Conditional Processing
```
[Get User Data]
  ↓
[Check: Is Premium?]
  ├─ Yes → [Send Premium Email]
  └─ No → [Send Standard Email]
```

### Pattern 4: Batch Processing
```
[Get List of Items]
  ↓
[For Each Item]
  ├─ [Validate Item]
  ├─ [Transform Item]
  ├─ [Store Item]
  └─ [End Loop]
```

## Node Best Practices

1. **Keep nodes focused** - One responsibility per node
2. **Use clear labels** - Describe what node does for next developer
3. **Document params** - Add comments explaining each parameter
4. **Handle errors** - Every action should have error handler
5. **Use templates** - For repeated patterns, create templates
6. **Test individually** - Test each node independently first
7. **Avoid deep nesting** - Keep workflows flat when possible

---

**Next Steps:**
- Learn [how to create custom nodes](./node-creation.md)
- Understand [execution flow](./execution-flow.md)
- Read [API documentation](../backend/api.md)
