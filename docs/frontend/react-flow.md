# React Flow Integration

This guide explains how React Flow is used in Autoflow for the visual node editor.

## What is React Flow?

React Flow is a library for building node-based UIs and workflow editors. It provides:

- **Nodes** - Visual boxes that can be dragged/configured
- **Edges** - Connections between nodes showing data flow
- **Canvas** - Pan, zoom, minimap
- **State Management** - `useNodesState` and `useEdgesState` hooks

Autoflow uses React Flow as the foundation for the workflow canvas editor.

## React Flow Setup

### Installation

React Flow is already installed (check `package.json`):

```json
{
  "dependencies": {
    "reactflow": "11.11.0"
  }
}
```

### Basic Component Structure

```typescript
'use client';

import { useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';

export default function WorkflowCanvas() {
  // Initialize nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  // Get React Flow hooks for advanced features
  const { getNodes, getEdges, setCenter } = useReactFlow();

  // Handle new connections
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
    >
      <Background />
      <Controls />
      <MiniMap />
    </ReactFlow>
  );
}
```

## Nodes in Autoflow

### Node Data Structure

```typescript
interface Node {
  id: string              // Unique within workflow
  type: string            // 'trigger', 'http-request', etc
  label: string           // Display name
  params: Record          // Configuration
  position: { x, y }      // Canvas position
  data: any              // Runtime data (output)
}
```

### Default Nodes in Workflow Canvas

```typescript
const [nodes, setNodes, onNodesChange] = useNodesState([
  {
    id: 'trigger-1',
    type: 'trigger',
    label: 'Webhook',
    position: { x: 0, y: 0 },
    params: { path: '/webhook' },
    data: {}
  }
]);
```

### Custom Node Types

Register custom node types in React Flow:

```typescript
const nodeTypes = useMemo(
  () => ({
    'trigger': TriggerNode,
    'http-request': HttpRequestNode,
    'slack-message': SlackMessageNode,
    'if-else': IfElseNode,
    'for-each': ForEachNode,
    'send-email': SendEmailNode,
    // ... more types
  }),
  []
);

return (
  <ReactFlow nodeTypes={nodeTypes}>
    {/* Canvas content */}
  </ReactFlow>
);
```

### Creating Custom Node Components

Each node type needs a React component:

```typescript
import { Handle, Position, NodeProps } from 'reactflow';
import { Card } from '@/components/ui/card';

interface HttpRequestNodeData {
  label: string;
  params?: {
    method?: string;
    url?: string;
  };
}

export function HttpRequestNode({ 
  data, 
  selected,
  id 
}: NodeProps<HttpRequestNodeData>) {
  return (
    <div className={selected ? 'ring-2 ring-blue-500 rounded' : ''}>
      {/* Input handle (top) */}
      <Handle type="target" position={Position.Top} />
      
      {/* Node content */}
      <Card className="w-48 p-3 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="text-xs font-bold text-blue-600">HTTP REQUEST</div>
        <div className="font-semibold truncate">{data.label}</div>
        <div className="text-xs text-gray-600 mt-1">
          {data.params?.method || 'GET'} {data.params?.url?.substring(0, 20)}...
        </div>
      </Card>
      
      {/* Output handle (bottom) */}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
```

### Handle Positions

Handles are connection points on nodes:

```
        ▲ (Top - Input)
        │
    ◄─  □  ─► (Left/Right - Side inputs/outputs)
        │
        ▼ (Bottom - Output)
```

```typescript
// Standard pattern:
Handle type="target" position={Position.Top}      // Input
Handle type="source" position={Position.Bottom}   // Output

// Advanced: Side handles for branching
Handle type="source" position={Position.Right} id="true" label="true"
Handle type="source" position={Position.Right} id="false" label="false"
```

## Edges in Autoflow

### Edge Data Structure

```typescript
interface Edge {
  id: string          // Unique identifier (e.g., 'e1')
  source: string      // Source node ID
  target: string      // Target node ID
  label?: string      // Label for branching ('true'/'false')
  animated?: boolean  // Visual animation
}
```

### Creating Edges

Edges are created when user connects nodes:

```typescript
const onConnect = useCallback(
  (connection: Connection) => {
    console.log(`Connected ${connection.source} to ${connection.target}`);
    
    const newEdge = {
      id: `e${Math.random()}`,  // Generate ID
      source: connection.source,
      target: connection.target,
      animated: true
    };
    
    setEdges((eds) => addEdge(newEdge, eds));
  },
  [setEdges]
);
```

### Custom Edge Rendering

Use `edgeTypes` for custom edge rendering:

```typescript
function CustomEdge({ id, sourceX, sourceY, targetX, targetY }) {
  return (
    <path
      id={id}
      d={`M${sourceX},${sourceY}L${targetX},${targetY}`}
      style={{
        stroke: '#888',
        strokeWidth: 2,
        fill: 'none'
      }}
    />
  );
}

const edgeTypes = {
  custom: CustomEdge
};

<ReactFlow edgeTypes={edgeTypes}>
  {/* ... */}
</ReactFlow>
```

## State Management with React Flow

### Adding Nodes Dynamically

When user adds a node from palette:

```typescript
function onAddNode(nodeType: string, label: string) {
  const newNode = {
    id: `node-${Math.random()}`,
    type: nodeType,
    label,
    position: { 
      x: Math.random() * 400,
      y: Math.random() * 400 
    },
    params: getDefaultParams(nodeType),
    data: {}
  };
  
  setNodes((nds) => [...nds, newNode]);
}
```

### Deleting Nodes

```typescript
function onDeleteNode(nodeId: string) {
  // Remove node
  setNodes((nds) => nds.filter((node) => node.id !== nodeId));
  
  // Remove connected edges
  setEdges((eds) => 
    eds.filter((edge) => 
      edge.source !== nodeId && edge.target !== nodeId
    )
  );
}
```

### Updating Node Parameters

When user configures a node:

```typescript
function onUpdateNodeParams(nodeId: string, paramName: string, value: any) {
  setNodes((nds) =>
    nds.map((node) => {
      if (node.id === nodeId) {
        return {
          ...node,
          params: {
            ...node.params,
            [paramName]: value
          }
        };
      }
      return node;
    })
  );
}
```

### Selecting a Node

```typescript
function onNodeClick(event, node) {
  setSelectedNodeId(node.id);
  
  // Show config panel for this node
  showConfigPanel(node);
}
```

## Syncing React Flow State with Backend

### Loading Workflow (EDIT mode)

```typescript
useEffect(() => {
  async function loadWorkflow() {
    const response = await fetch(`/api/workflows/${workflowId}`);
    const workflow = await response.json();
    
    // Load nodes from database
    setNodes(workflow.nodes);
    
    // Load edges from database
    setEdges(workflow.edges);
    
    // Center view on nodes
    setTimeout(() => {
      const nodes = getNodes();
      if (nodes.length > 0) {
        fitView();
      }
    }, 0);
  }
  
  loadWorkflow();
}, [workflowId, setNodes, setEdges]);
```

### Saving Workflow

```typescript
async function onSave() {
  // Get current state
  const nodes = getNodes();
  const edges = getEdges();
  
  // Validate
  if (!nodes.some(n => n.type === 'trigger')) {
    alert('Workflow must have a trigger node');
    return;
  }
  
  // Prepare payload (strip unnecessary React Flow data)
  const workflow = {
    name: workflowName,
    nodes: nodes.map(({ id, type, label, params, position }) => ({
      id,
      type,
      label,
      params,
      position
    })),
    edges: edges.map(({ id, source, target, label }) => ({
      id,
      source,
      target,
      label
    }))
  };
  
  // Save
  setLoading(true);
  try {
    const mode = workflowId ? 'PUT' : 'POST';
    const endpoint = workflowId 
      ? `/api/workflows/${workflowId}` 
      : `/api/workflows`;
    
    const response = await fetch(endpoint, {
      method: mode,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workflow)
    });
    
    if (response.ok) {
      alert('Workflow saved!');
      // Navigate or update state
    }
  } finally {
    setLoading(false);
  }
}
```

## Event Handlers

### Node Changes

React Flow calls this when node is modified (moved, resized, etc):

```typescript
const onNodesChange = useCallback(
  (changes: NodeChange[]) => {
    console.log('Node changes:', changes);
    // Default handler updates node state
    handleNodesChange(changes);
  },
  []
);
```

Change types:
- `add` - New node added
- `remove` - Node deleted
- `select` - Node selected/deselected
- `position` - Node moved
- `dimensions` - Node resized
- `data` - Node data updated

### Edge Changes

Similar to node changes:

```typescript
const onEdgesChange = useCallback(
  (changes: EdgeChange[]) => {
    console.log('Edge changes:', changes);
    handleEdgesChange(changes);
  },
  []
);
```

## Viewport & Navigation

### Pan and Zoom

React Flow auto-handles pan/zoom with Controls:

```typescript
<ReactFlow>
  <Controls />  {/* Shows +/- zoom buttons and lock button */}
  {/* ... */}
</ReactFlow>
```

### Fit View

Center all nodes in view:

```typescript
const { fitView } = useReactFlow();

// When loading or after adding nodes
useEffect(() => {
  setTimeout(() => fitView(), 100);
}, [nodes]);
```

### Set Center on Node

Focus on specific node:

```typescript
const { setCenter } = useReactFlow();

function focusOnNode(nodeId: string) {
  const node = getNodes().find(n => n.id === nodeId);
  if (node) {
    setCenter(node.position.x, node.position.y, { zoom: 1.5, duration: 800 });
  }
}
```

## Minimap

Shows birds-eye view of workflow:

```typescript
<ReactFlow>
  <MiniMap
    nodeColor="#fff"
    nodeStrokeColor="#222"
    nodeBorderRadius={4}
    maskColor="rgba(0,0,0,0.1)"
  />
</ReactFlow>
```

## Performance Optimization

### Large Workflows (100+ nodes)

React Flow handles this, but you can optimize:

```typescript
// 1. Use memo for node components
const MemoizedNode = React.memo(HttpRequestNode);

// 2. Use useCallback for event handlers
const onNodeClick = useCallback((event, node) => {
  // ...
}, []);

// 3. Virtualization (for very large workflows)
// Use defaultViewport to avoid initial centering delay
<ReactFlow defaultViewport={{ x: 0, y: 0, zoom: 1 }}>
```

### Reduce Renders

```typescript
// Bad: Re-creates on every render
function WorkflowEditor() {
  const nodeTypes = {
    test: TestNode  // ← Created new object every time!
  };
  
  // Bad: onConnect created every time
  const onConnect = () => { /* ... */ };
  
  return <ReactFlow nodeTypes={nodeTypes} onConnect={onConnect} />;
}

// Good: Memoize with useMemo/useCallback
function WorkflowEditor() {
  const nodeTypes = useMemo(() => ({
    test: TestNode  // ← Reused unless dependencies change
  }), []);
  
  const onConnect = useCallback(() => { /* ... */ }, []);
  
  return <ReactFlow nodeTypes={nodeTypes} onConnect={onConnect} />;
}
```

## Common Patterns

### Pattern 1: Select and Configure Node

```typescript
const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

function onNodeClick(event, node) {
  setSelectedNodeId(node.id);
}

// Show config panel in sidebar
{selectedNodeId && <ConfigPanel nodeId={selectedNodeId} />}
```

### Pattern 2: Add Node from Palette

```typescript
function onAddNodeClick(type: string) {
  const newNode = {
    id: generateId(),
    type,
    label: TYPE_LABELS[type],
    position: { x: 100, y: 100 },
    params: getDefaultParams(type)
  };
  
  setNodes(nds => [...nds, newNode]);
}
```

### Pattern 3: Validate Before Save

```typescript
function validateWorkflow(): string[] {
  const errors: string[] = [];
  const nodes = getNodes();
  const edges = getEdges();
  
  // Rules
  if (!nodes.some(n => n.type === 'trigger')) {
    errors.push('Must have trigger node');
  }
  if (nodes.length < 2) {
    errors.push('Must have at least 2 nodes');
  }
  if (!nodes.every(n => edges.some(e => e.source === n.id || e.target === n.id))) {
    errors.push('All nodes must be connected');
  }
  
  return errors;
}
```

## Debugging React Flow

### Log Current State

```typescript
const handleLogState = () => {
  const nodes = getNodes();
  const edges = getEdges();
  console.log('Nodes:', nodes);
  console.log('Edges:', edges);
};
```

### React Flow Devtools

Install React Flow's devtools:

```bash
npm install reactflow-utils
```

Then enable in component:

```typescript
import { useDevTools } from 'reactflow-utils';

export default function WorkflowEditor() {
  useDevTools();
  // ... rest of component
}
```

---

**Next Steps:**
- Read [State Management Guide](./state-management.md)
- Learn [how nodes execute](../workflow-engine/execution-flow.md)
- Check [React Flow official docs](https://reactflow.dev/)
