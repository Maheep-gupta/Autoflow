# Creating Custom Nodes

This guide walks through creating a new node type from start to finish.

## Step 1: Define Your Node in node-schema.ts

First, add your node type definition to `lib/node-schema.ts`:

```typescript
// 1. Define the node type constant
export const NODE_TYPES = {
  // ... existing types
  'slack-message': 'slack-message',
};

// 2. Add label for UI
export const TYPE_LABELS: Record<string, string> = {
  // ... existing labels
  'slack-message': 'Send Slack Message',
};

// 3. Define parameter schema (validation & UI generation)
export const NODE_PARAM_SCHEMA: Record<string, ParamDefinition[]> = {
  // ... existing schemas
  'slack-message': [
    {
      name: 'channel',
      label: 'Channel',
      type: 'text',
      required: true,
      description: 'Slack channel ID or name (e.g., #general)',
      placeholder: '#general or C123456'
    },
    {
      name: 'message',
      label: 'Message',
      type: 'textarea',
      required: true,
      description: 'Message to send. Supports templates: {{}}',
      placeholder: 'Hello {{user.name}}!'
    },
    {
      name: 'thread_ts',
      label: 'Thread ID (optional)',
      type: 'text',
      required: false,
      description: 'Post as reply to thread',
      placeholder: 'Leave blank for main channel'
    }
  ]
};

// 4. Define default parameters
function getDefaultParams(nodeType: string): Record<string, any> {
  const defaults: Record<string, any> = {
    // ... existing defaults
    'slack-message': {
      channel: '#general',
      message: '',
      thread_ts: ''
    }
  };
  return defaults[nodeType] || {};
}
```

### Parameter Definition Schema

```typescript
interface ParamDefinition {
  name: string              // Unique key for this param
  label: string             // Display name in UI
  type: 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'date'
  required: boolean
  description?: string      // Hover help text
  placeholder?: string      // Input placeholder
  options?: Array<{         // For 'select' type
    label: string
    value: string
  }>
  validation?: {            // Optional validation rules
    pattern?: string        // Regex pattern
    min?: number
    max?: number
  }
}
```

## Step 2: Create UI Component for Node

Create `components/workflow-nodes.tsx` with a custom node component:

```typescript
import { Handle, Position, NodeProps } from 'reactflow';
import { Card } from '@/components/ui/card';

// Custom node for Slack message action
export function SlackMessageNode({ data, selected }: NodeProps) {
  const { label } = data;
  
  return (
    <div>
      <Handle type="target" position={Position.Top} />
      <Card
        className={`w-48 p-3 text-sm ${
          selected ? 'ring-2 ring-blue-500' : ''
        }`}
      >
        <div className="font-semibold text-purple-600">💬</div>
        <div className="font-bold">{label}</div>
        <div className="text-xs text-gray-600">Send Slack message</div>
      </Card>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

// Register in nodeTypes object
export const nodeTypes = {
  'slack-message': SlackMessageNode,
  // ... other node types
};
```

## Step 3: Add to Node Type Registry

In `workflows/[id]/page.tsx`, register your node type:

```typescript
'use client';

import { useCallback, useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  Panel
} from 'reactflow';
import { SlackMessageNode } from '@/components/workflow-nodes';

export default function WorkflowEditor() {
  // Register all node types
  const nodeTypes = useMemo(() => ({
    'trigger': TriggerNode,
    'http-request': HttpRequestNode,
    'slack-message': SlackMessageNode,  // Add here
    'send-email': SendEmailNode,
    // ... other types
  }), []);
  
  return (
    <ReactFlow nodeTypes={nodeTypes}>
      {/* ... */}
    </ReactFlow>
  );
}
```

## Step 4: Add to Node Palette (UI)

In `components/add-node-modal.tsx`, add your node to the palette:

```typescript
export function AddNodeModal({ open, onClose, onAddNode }: Props) {
  const nodeCategories = {
    triggers: [
      { type: 'webhook', label: 'Webhook' },
      { type: 'schedule', label: 'Schedule' }
    ],
    actions: [
      { type: 'http-request', label: 'HTTP Request' },
      { type: 'send-email', label: 'Send Email' },
      { type: 'slack-message', label: 'Send Slack Message' },  // Add here
      // ... other actions
    ],
    conditions: [
      { type: 'if-else', label: 'If/Else' }
    ]
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* Dialog content that lists nodeCategories */}
    </Dialog>
  );
}
```

## Step 5: Implement Execution Handler

Create handler for your node in `lib/api-service.ts`:

```typescript
// Handler function for Slack message nodes
async function executeSlackMessageNode(
  node: Node,
  context: ExecutionContext
): Promise<ExecutionResult> {
  try {
    // 1. Get parameters (resolve templates)
    const channel = resolveTemplate(node.params.channel, context);
    const message = resolveTemplate(node.params.message, context);
    const threadTs = resolveTemplate(node.params.thread_ts, context);

    // 2. Validate parameters
    if (!channel || !message) {
      return {
        success: false,
        error: 'channel and message are required',
        output: null
      };
    }

    // 3. Get integration auth
    const slackAuth = context.integrations['slack'];
    if (!slackAuth) {
      return {
        success: false,
        error: 'Slack integration not configured',
        output: null
      };
    }

    // 4. Call external API
    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${slackAuth.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        channel,
        text: message,
        thread_ts: threadTs || undefined
      })
    });

    const data = await response.json();

    // 5. Handle response
    if (!data.ok) {
      return {
        success: false,
        error: data.error,
        output: null
      };
    }

    // 6. Return success with data for next nodes
    return {
      success: true,
      error: null,
      output: {
        messageId: data.ts,
        channel: data.channel,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      output: null
    };
  }
}

// Register handler
const NODE_HANDLERS: Record<string, NodeHandler> = {
  'slack-message': executeSlackMessageNode,
  // ... other handlers
};
```

## Step 6: Add Configuration UI

In `components/config-panel.tsx`, add UI for your parameters:

```typescript
export function ConfigPanel({ node, onParamChange }: Props) {
  const paramSchema = NODE_PARAM_SCHEMA[node.type] || [];

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-bold">{TYPE_LABELS[node.type]}</h3>
      
      {paramSchema.map((param) => (
        <div key={param.name}>
          <label className="text-sm font-medium">{param.label}</label>
          
          {/* Render input based on type */}
          {param.type === 'text' && (
            <Input
              placeholder={param.placeholder}
              value={node.params[param.name] || ''}
              onChange={(e) => 
                onParamChange(param.name, e.target.value)
              }
              required={param.required}
            />
          )}
          
          {param.type === 'textarea' && (
            <Textarea
              placeholder={param.placeholder}
              value={node.params[param.name] || ''}
              onChange={(e) => 
                onParamChange(param.name, e.target.value)
              }
              required={param.required}
              rows={4}
            />
          )}
          
          {param.type === 'select' && (
            <Select value={node.params[param.name] || ''}>
              {param.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          )}
          
          {param.description && (
            <p className="text-xs text-gray-500">{param.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
```

## Step 7: Test Your Node

### Test in Development

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Open workflow editor:**
   ```
   http://localhost:3000/workflow/new?projectId=proj-1
   ```

3. **Add your node:**
   - Click "Add Node"
   - Scroll to Actions
   - Click "Send Slack Message"
   - Configure parameters

4. **Connect to trigger:**
   - Drag edge from trigger to your node

5. **Test execution:**
   - Click "Save"
   - Click "Run"
   - Check Slack channel for message

### Test with Mock Data

Update `lib/mock-data.ts` to include your node:

```typescript
const mockWorkflows: Record<string, Workflow> = {
  'wf-slack-test': {
    id: 'wf-slack-test',
    projectId: 'proj-1',
    name: 'Slack Test',
    description: 'Test slack integration',
    status: 'active',
    nodes: [
      {
        id: 'trigger-1',
        type: 'webhook',
        label: 'Test Trigger',
        params: { path: '/test' },
        position: { x: 0, y: 0 }
      },
      {
        id: 'slack-1',
        type: 'slack-message',
        label: 'Send Slack Message',
        params: {
          channel: '#test',
          message: 'Hello from Autoflow!',
          thread_ts: ''
        },
        position: { x: 0, y: 100 }
      }
    ],
    edges: [
      {
        id: 'e1',
        source: 'trigger-1',
        target: 'slack-1'
      }
    ],
    createdBy: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date()
  }
};
```

## Complete Checklist

- [ ] Add node type to `NODE_TYPES`
- [ ] Add label to `TYPE_LABELS`
- [ ] Add parameter schema to `NODE_PARAM_SCHEMA`
- [ ] Add default params to `getDefaultParams()`
- [ ] Create UI component in `workflow-nodes.tsx`
- [ ] Register in `nodeTypes` object
- [ ] Add to node palette in `add-node-modal.tsx`
- [ ] Implement execution handler
- [ ] Register handler in `NODE_HANDLERS`
- [ ] Add configuration UI in `config-panel.tsx`
- [ ] Test in development
- [ ] Add to mock workflow
- [ ] Document in project wiki
- [ ] Get code review

## Example: Complete Slack Node

Here's a minimal but complete example:

```typescript
// lib/node-schema.ts additions:
export const NODE_PARAM_SCHEMA = {
  // ...
  'slack-message': [
    {
      name: 'channel',
      label: 'Channel',
      type: 'text',
      required: true,
      placeholder: '#general'
    },
    {
      name: 'message',
      label: 'Message',
      type: 'textarea',
      required: true,
      placeholder: 'Enter message...'
    }
  ]
};

export function getDefaultParams(type: string) {
  // ...
  if (type === 'slack-message') {
    return { channel: '#general', message: '' };
  }
  // ...
}

// components/workflow-nodes.tsx:
export function SlackMessageNode({ data }: NodeProps) {
  return (
    <div className="bg-purple-50 p-3 rounded border border-purple-200">
      <Handle type="target" position={Position.Top} />
      <div className="text-sm font-bold">📨 {data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

// Register in page.tsx:
const nodeTypes = useMemo(() => ({
  'slack-message': SlackMessageNode,
  // ...
}), []);
```

---

**Next Steps:**
- Deploy and test your node
- Add integration tests
- Add documentation
- Get community feedback
- Consider contributing back to Autoflow!

**Questions?**
- Review [Nodes Guide](./nodes.md) again
- Check [API Documentation](../backend/api.md)
- Look at existing node implementations
