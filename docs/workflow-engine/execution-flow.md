# Workflow Execution Flow

This guide explains how workflows are executed step-by-step, from trigger to completion.

## High-Level Execution Process

```
1. Trigger Event
   ↓
2. Load Workflow
   ↓
3. Initialize Execution Context
   ↓
4. Execute Nodes in Order
   ├─ Resolve Parameters ({{templates}})
   ├─ Run Node Handler
   ├─ Store Output
   ├─ Log Progress
   └─ Handle Errors
   ↓
5. Repeat for Each Node
   ↓
6. Finalize Execution
   ├─ Set Status (success/failed)
   ├─ Calculate Duration
   ├─ Store Logs
   └─ Cleanup
   ↓
7. Execution Complete
```

## Detailed Step-by-Step

### Phase 1: Trigger Event

A workflow starts when something triggers it:

#### 1a. Webhook Trigger
```
User sends HTTP request:
  POST /api/webhooks/my-webhook
  
With body:
  {
    "userId": 123,
    "action": "order_placed",
    "amount": 99.99
  }
  
↓
Backend:
  1. Find workflow with matching webhook path
  2. Create execution record
  3. Queue for processing
```

#### 1b. Schedule Trigger
```
Scheduler runs (every minute):
  1. Check workflows with schedule trigger
  2. If scheduled time reached
  3. Create execution record
  4. Queue for processing
```

#### 1c. Event Trigger
```
Internal system event:
  Event: "project.updated"
  Project ID: "proj-123"
  
↓
Event Handler:
  1. Find workflows listening to this event
  2. Create execution record (with event data)
  3. Queue for processing
```

### Phase 2: Load Workflow

```
Execution starts:

1. Load workflow definition
   ├─ GET from database: workflow.id = "wf-123"
   ├─ Retrieve nodes and edges
   └─ Parse node schemas

2. Validate workflow structure
   ├─ Has trigger node
   ├─ All nodes have required params
   ├─ No circular edges
   └─ All edges connect valid nodes

3. Find entry point (trigger node)
   ├─ Look for node.type = 'trigger'
   └─ Start execution from there

4. Build execution graph
   ├─ Create adjacency list (which nodes connect)
   ├─ Detect branching paths (conditions)
   └─ Identify parallel routes (if any)
```

### Phase 3: Initialize Execution Context

```
Create execution context that flows through workflow:

ExecutionContext {
  executionId: "exec-123",
  workflowId: "wf-123",
  projectId: "proj-1",
  triggeredBy: "user-1",
  timestamp: "2024-01-15T10:30:00Z",
  
  // Input data from trigger
  triggerData: {
    userId: 123,
    action: "order_placed",
    amount: 99.99
  },
  
  // Variables accumulated during execution
  variables: {
    trigger: { ... },        // Input from trigger
    node_1: { ... },         // Output from node-1
    node_2: { ... },         // Output from node-2
    // etc
  },
  
  // User provided
  integrations: {
    slack: { token: "xoxb-..." },
    github: { token: "ghp_..." }
  },
  
  // Execution tracking
  logs: [],
  errors: []
}
```

### Phase 4: Execute Nodes

#### 4a. Find Next Node to Execute

Starting from trigger node, execute connected nodes:

```typescript
// Current: trigger node
// Find target nodes (connected edges)
const edges = workflow.edges.filter(e => e.source === "trigger-1")
// Result: Array of edges pointing to next nodes

// For each edge, execute target node
edges.forEach(edge => {
  const nextNode = workflow.nodes.find(n => n.id === edge.target)
  executeNode(nextNode, context)
})
```

#### 4b. Resolve Node Parameters

Parameters may contain templates like `{{variable}}`. Resolve them:

```typescript
// Parameter before resolution:
{
  url: "https://api.example.com/users/{{trigger.userId}}",
  method: "GET",
  headers: {
    "Authorization": "Bearer {{github.token}}"
  }
}

// After resolution:
{
  url: "https://api.example.com/users/123",
  method: "GET", 
  headers: {
    "Authorization": "Bearer ghp_abc123"
  }
}
```

**Template Syntax:**
```
{{trigger.userId}}         // From trigger data
{{node_1.result}}          // Output from node-1
{{github.token}}           // From integrations
{{now()}}                  // Current time
{{env.API_KEY}}            // Environment variable
```

#### 4c. Execute Node Handler

Call the appropriate handler function for node type:

```typescript
// Example: HTTP Request node
async function executeHttpRequestNode(
  node: Node,
  context: ExecutionContext
): Promise<NodeResult> {
  const { url, method, headers, body } = node.params;
  
  try {
    // Make HTTP request
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
    
    const result = await response.json();
    
    return {
      success: true,
      output: result,
      error: null
    };
  } catch (error) {
    return {
      success: false,
      output: null,
      error: error.message
    };
  }
}
```

#### 4d. Store Node Output

Result is stored in context for next nodes:

```typescript
// After executing HTTP node:
context.variables.node_1 = {
  statusCode: 200,
  body: {
    id: 123,
    name: "John",
    email: "john@example.com"
  },
  headers: {
    "content-type": "application/json"
  }
}

// Next node can access via:
// {{node_1.body.email}} = "john@example.com"
```

#### 4e. Log Execution

Every step is logged:

```typescript
context.logs.push({
  timestamp: "2024-01-15T10:30:05.123Z",
  nodeId: "node-1",
  nodeType: "http-request",
  nodeLabel: "Get User Data",
  status: "success",
  duration: 245,  // milliseconds
  message: "HTTP GET completed",
  input: {
    url: "https://api.example.com/users/123",
    method: "GET"
  },
  output: {
    statusCode: 200,
    body: { /* ... */ }
  }
})
```

### Phase 5: Handle Branching

If node is a condition (if/else, switch), execution branches:

```
[Condition Node]
  ├─ Check condition: {{node_1.status}} === 'active'
  ├─ If true:
  │  └─ Execute nodes on "true-path" edge
  └─ If false:
     └─ Execute nodes on "false-path" edge
```

Example:
```typescript
// Condition node execution
if (node.type === 'if-else') {
  const condition = evaluateCondition(node.params.condition, context);
  
  if (condition === true) {
    const trueEdges = edges.filter(e => 
      e.source === node.id && e.label === 'true'
    );
    // Execute nodes connected to true edge
  } else {
    const falseEdges = edges.filter(e => 
      e.source === node.id && e.label === 'false'
    );
    // Execute nodes connected to false edge
  }
}
```

### Phase 6: Handle Loops

Loop nodes execute connected nodes multiple times:

```
[For Each Node]
  items: [1, 2, 3, 4, 5]
  
  ├─ Loop iteration 1: item = 1
  │  └─ Execute connected nodes
  ├─ Loop iteration 2: item = 2
  │  └─ Execute connected nodes
  ├─ Loop iteration 3: item = 3
  │  └─ Execute connected nodes
  ├─ Loop iteration 4: item = 4
  │  └─ Execute connected nodes
  └─ Loop iteration 5: item = 5
     └─ Execute connected nodes
```

For each iteration:
```typescript
context.variables.item = 1
context.variables.item_index = 0
context.variables.loop_1_results = []

// Execute connected nodes
// Store result
context.variables.loop_1_results.push(result)

// Next iteration
context.variables.item = 2
context.variables.item_index = 1
// ... repeat
```

### Phase 7: Error Handling

If a node fails, errors are handled:

```
[Action Node] fails
  ↓
Check: Is node wrapped in try-catch?
  ├─ YES: Execute error handler node
  │  └─ Continue execution
  └─ NO: Stop execution, mark as failed
```

Error logging:
```typescript
context.logs.push({
  timestamp: "2024-01-15T10:30:10.456Z",
  nodeId: "node-2",
  nodeType: "http-request",
  status: "failed",
  error: "Connection timeout after 30000ms",
  errorType: "TimeoutError",
  stackTrace: "..."
})

context.errors.push({
  nodeId: "node-2",
  error: "Connection timeout",
  fatal: true  // Stops execution
})
```

## Complete Example

### Example Workflow

```
Workflow: "Notify on Order"

Nodes:
- trigger: Webhook (when order placed)
- action-1: GET user data from database
- condition-1: Is user premium?
  - true → action-2a: Send premium email
  - false → action-2b: Send standard email
- action-3: Log to analytics
- end: Complete
```

### Execution Trace

```
1️⃣ TRIGGER
   Input: { userId: 123, orderId: "ORD-456", amount: 99.99 }
   Context: trigger = { userId: 123, orderId: "ORD-456", amount: 99.99 }

2️⃣ Execute Node "action-1"
   Type: http-request
   Params (after resolution):
     url: https://db.example.com/users/123
     method: GET
   Output: { id: 123, name: "John", premium: true }
   Context: node_1 = { id: 123, name: "John", premium: true }

3️⃣ Execute Node "condition-1"
   Type: if-else
   Condition: {{node_1.premium}} === true
   Evaluation: true === true → TRUE
   Branch: true-path

4️⃣ Execute Node "action-2a" (premium email)
   Type: send-email
   Params (after resolution):
     to: {{node_1.email}}     → john@example.com
     subject: "Thanks, {{node_1.name}}!"  → "Thanks, John!"
     body: "Premium offer..."
   Output: { messageId: "msg-789", sent: true }
   Context: node_2a = { messageId: "msg-789", sent: true }

5️⃣ Execute Node "action-3"
   Type: http-request (post to analytics)
   Params (after resolution):
     url: https://analytics.example.com/events
     method: POST
     body: {
       event: "email_sent",
       userId: 123,
       type: "premium",
       timestamp: "2024-01-15T10:30:15Z"
     }
   Output: { eventId: "evt-101", recorded: true }
   Context: node_3 = { eventId: "evt-101", recorded: true }

6️⃣ Execution Complete
   Status: success
   Duration: 2450 milliseconds
   Logs: [...all 5 steps logged...]
```

## Execution State Machine

```
                    ┌────────────────┐
                    │    PENDING     │
                    │  (Queued)      │
                    └────────┬────────┘
                             │
                             ↓
                    ┌────────────────┐
                    │   RUNNING      │
                    │ (Processing)   │
                    └────┬───────┬───┘
                         │       │
                    Success  Failure
                         │       │
                    ┌────▼──┐ ┌─▼────┐
                    │SUCCESS│ │FAILED│
                    └───────┘ └──────┘
```

## Performance Metrics

Each execution tracks:

```typescript
{
  startedAt: "2024-01-15T10:30:00Z",
  completedAt: "2024-01-15T10:30:02.450Z",
  
  duration: 2450,  // Total milliseconds
  
  nodeExecutions: [
    { nodeId: "trigger-1", duration: 5 },
    { nodeId: "action-1", duration: 245 },   // Slowest!
    { nodeId: "condition-1", duration: 2 },
    { nodeId: "action-2a", duration: 189 },
    { nodeId: "action-3", duration: 12 }
  ],
  
  // Slowest nodes identified for optimization
}
```

## Execution API Endpoints

### Start Execution
```
POST /api/executions
{
  workflowId: "wf-123",
  projectId: "proj-1",
  triggeredBy: "user-1"
}

Response:
{
  id: "exec-789",
  status: "running",
  startedAt: "2024-01-15T10:30:00Z"
}
```

### Get Execution Status
```
GET /api/executions/exec-789

Response:
{
  id: "exec-789",
  workflowId: "wf-123",
  status: "success",
  startedAt: "2024-01-15T10:30:00Z",
  completedAt: "2024-01-15T10:30:02.450Z",
  duration: 2450,
  logs: [
    { nodeId: "trigger-1", message: "Started", ... },
    { nodeId: "action-1", message: "Success", ... },
    ...
  ]
}
```

### Execution History
```
GET /api/executions?workflowId=wf-123&limit=50

Response:
{
  executions: [
    { id: "exec-789", status: "success", duration: 2450, ... },
    { id: "exec-788", status: "success", duration: 1903, ... },
    { id: "exec-787", status: "failed", duration: 500, ... },
    ...
  ],
  total: 156
}
```

## Debugging Failed Executions

When an execution fails:

1. **Check Status**
   ```
   GET /api/executions/exec-failed
   → status: "failed"
   ```

2. **Review Logs**
   ```
   logs[].nodeId = "action-2"
   logs[].status = "failed"
   logs[].error = "API returned 401 Unauthorized"
   ```

3. **Find Root Cause**
   - Check node parameters (templates resolved correctly?)
   - Check integrations (credentials valid?)
   - Check input data (expected format?)
   - Check network (API endpoint reachable?)

4. **Fix and Retry**
   - Update node parameters
   - Re-authenticate integrations
   - Click "Run" to retry

---

**Next Steps:**
- Read [Node Types Guide](./nodes.md)
- Learn [how to create nodes](./node-creation.md)
- Check [API Documentation](../backend/api.md)
- Monitor [executions in dashboard](../frontend/state-management.md)
