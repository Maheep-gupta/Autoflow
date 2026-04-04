# Frontend State Management

This guide explains how state is managed in the Autoflow frontend application.

## Overview

Autoflow uses React Hooks for state management. There's no Redux or other global state library - state is kept simple and local to components.

```
┌─────────────────────────────────┐
│  Page Component (e.g., /dashboard)
│
│  ┌──────────────────────────────┐
│  │ useState: projects []         │
│  │ useState: selectedProject     │
│  │ useEffect: fetch projects     │
│  └──────────────────────────────┘
│               │
│  ┌────────────▼─────────────┐
│  │ Render ProjectCard        │
│  │ (pass as props)           │
│  └──────────────────────────┘
│
└─────────────────────────────────┘
```

## State Architecture by Feature

### 1. Dashboard State

Location: `app/dashboard/page.tsx`

```typescript
export default function DashboardPage() {
  // Projects list
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setProjectsLoading(true);
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      setProjectsError(error.message);
    } finally {
      setProjectsLoading(false);
    }
  }

  return (
    <div>
      {projectsLoading && <Skeleton />}
      {projectsError && <Alert>{projectsError}</Alert>}
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

### 2. Project Detail State

Location: `app/dashboard/project/[id]/page.tsx`

```typescript
interface ProjectDetailState {
  project: Project | null;
  workflows: Workflow[];
  executions: WorkflowExecution[];
  members: ProjectMember[];
  teamModal: boolean;
  deleteConfirm: boolean;
  selectedWorkflow: Workflow | null;
}

export default function ProjectDetailPage({ params }: Props) {
  const [state, setState] = useState<ProjectDetailState>({
    project: null,
    workflows: [],
    executions: [],
    members: [],
    teamModal: false,
    deleteConfirm: false,
    selectedWorkflow: null
  });

  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState<string | null>(null);

  // Load project data
  useEffect(() => {
    loadProject();
  }, [params.id]);

  async function loadProject() {
    setLoading(true);
    try {
      const [projectRes, workflowsRes, membersRes] = await Promise.all([
        fetch(`/api/projects/${params.id}`),
        fetch(`/api/projects/${params.id}/workflows`),
        fetch(`/api/projects/${params.id}/members`)
      ]);

      setState(prev => ({
        ...prev,
        project: await projectRes.json(),
        workflows: await workflowsRes.json(),
        members: await membersRes.json()
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // Execute workflow
  async function handleExecuteWorkflow(workflowId: string) {
    setExecuting(workflowId);
    try {
      const response = await fetch('/api/executions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowId,
          projectId: params.id,
          triggeredBy: 'user-1'
        })
      });

      if (response.ok) {
        const execution = await response.json();
        toast.success(`Execution started: ${execution.id}`);
        // Reload executions
        loadExecutions();
      }
    } finally {
      setExecuting(null);
    }
  }

  return (
    <div>
      {/* Project header */}
      {state.project && <h1>{state.project.name}</h1>}

      {/* Workflows list */}
      <div>
        {state.workflows.map(wf => (
          <WorkflowCard
            key={wf.id}
            workflow={wf}
            onExecute={() => handleExecuteWorkflow(wf.id)}
            isExecuting={executing === wf.id}
          />
        ))}
      </div>

      {/* Modals */}
      {state.teamModal && <TeamModal onClose={closeTeamModal} />}
    </div>
  );
}
```

### 3. Workflow Editor State

Location: `app/workflow/[id]/page.tsx`

The workflow editor keeps separate state for canvas and UI:

```typescript
'use client';

import { useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import ReactFlow, { useNodesState, useEdgesState } from 'reactflow';

export default function WorkflowEditorPage({ params }) {
  // Canvas state (React Flow)
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // UI state
  const [mode, setMode] = useState<'CREATE' | 'EDIT' | 'LOADING'>('LOADING');
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Dialog/modal states
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Get search params
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');

  // Determine mode and load
  useEffect(() => {
    async function initializeWorkflow() {
      if (params.id === 'new' || params.id === 'undefined') {
        // CREATE mode
        setMode('CREATE');
        setNodes([]);
        setEdges([]);
        return;
      }

      // EDIT mode - fetch existing workflow
      try {
        const response = await fetch(`/api/workflows/${params.id}`);
        if (response.ok) {
          const workflow = await response.json();
          setMode('EDIT');
          setWorkflowName(workflow.name);
          setNodes(workflow.nodes);
          setEdges(workflow.edges);
        }
      } catch (error) {
        console.error('Failed to load workflow:', error);
        setMode('CREATE');
      }
    }

    initializeWorkflow();
  }, [params.id, setNodes, setEdges]);

  // Save workflow
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const endpoint = mode === 'CREATE' 
        ? '/api/workflows' 
        : `/api/workflows/${params.id}`;

      const method = mode === 'CREATE' ? 'POST' : 'PUT';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
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
        })
      });

      if (response.ok) {
        const saved = await response.json();
        
        // Transition CREATE → EDIT
        if (mode === 'CREATE') {
          setMode('EDIT');
          // Redirect to EDIT URL
          window.history.replaceState(null, '', `/workflow/${saved.id}?projectId=${projectId}`);
        }

        toast.success('Workflow saved');
      }
    } finally {
      setIsSaving(false);
    }
  }, [mode, params.id, projectId, workflowName, nodes, edges]);

  // Add node handler
  const handleAddNode = useCallback((nodeType: string) => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: nodeType,
      label: TYPE_LABELS[nodeType],
      position: { x: Math.random() * 300, y: Math.random() * 300 },
      params: getDefaultParams(nodeType),
      data: {}
    };
    setNodes(nds => [...nds, newNode]);
    setShowAddNodeModal(false);
  }, [setNodes]);

  // Delete workflow
  const handleDelete = useCallback(async () => {
    if (mode === 'CREATE') return;

    try {
      const response = await fetch(`/api/workflows/${params.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Workflow deleted');
        // Navigate back to project
        window.location.href = `/dashboard/project/${projectId}`;
      }
    } catch (error) {
      toast.error('Failed to delete workflow');
    }
  }, [mode, params.id, projectId]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r bg-gray-50 p-4">
        <h2 className="font-bold mb-4">Workflow</h2>
        <Input
          value={workflowName}
          onChange={(e) => setWorkflowName(e.target.value)}
          placeholder="Workflow name"
          className="mb-4"
        />
        <Button
          onClick={() => setShowAddNodeModal(true)}
          className="w-full mb-2"
        >
          + Add Node
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>

      {/* Canvas */}
      <div className="flex-1">
        <ReactFlow nodes={nodes} edges={edges}>
          {/* ... */}
        </ReactFlow>
      </div>

      {/* Right Panel */}
      <div className="w-80 border-l bg-white p-4">
        {selectedNode && <ConfigPanel nodeId={selectedNode} />}
      </div>

      {/* Modals */}
      {showAddNodeModal && <AddNodeModal onAdd={handleAddNode} />}
      {showSettingsModal && <WorkflowSettingsModal />}
      {showDeleteConfirm && (
        <DeleteConfirmationDialog
          title="Delete Workflow?"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
}
```

## Data Flow Patterns

### Pattern 1: Fetch on Mount

```typescript
useEffect(() => {
  let isMounted = true;  // Prevent state update if unmounted

  async function fetchData() {
    const response = await fetch('/api/resource');
    const data = await response.json();
    
    if (isMounted) {
      setState(data);  // Only set if still mounted
    }
  }

  fetchData();

  return () => {
    isMounted = false;  // Cleanup
  };
}, []);  // Empty dependency array: runs once on mount
```

### Pattern 2: Update on Dependency Change

```typescript
useEffect(() => {
  loadProject(projectId);
}, [projectId]);  // Re-run when projectId changes
```

### Pattern 3: Optimistic Updates

Update UI before API response (better UX):

```typescript
async function handleToggleActive() {
  const oldStatus = workflow.status;
  
  // Optimistic: update UI immediately
  setWorkflow(prev => ({
    ...prev,
    status: prev.status === 'active' ? 'inactive' : 'active'
  }));

  try {
    // API call in background
    const response = await fetch(`/api/workflows/${workflow.id}`, {
      method: 'PUT',
      body: JSON.stringify(({ status: workflow.status }))
    });

    if (!response.ok) {
      // Revert on error
      setWorkflow(prev => ({ ...prev, status: oldStatus }));
      toast.error('Failed to update');
    }
  } catch (error) {
    // Revert on error
    setWorkflow(prev => ({ ...prev, status: oldStatus }));
  }
}
```

### Pattern 4: Form State

```typescript
const [formData, setFormData] = useState({
  name: '',
  description: '',
  email: ''
});

const [errors, setErrors] = useState<Record<string, string>>({});

function handleInputChange(field: string, value: string) {
  setFormData(prev => ({
    ...prev,
    [field]: value
  }));
  // Clear error for this field
  setErrors(prev => ({ ...prev, [field]: '' }));
}

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  // Validate
  const newErrors: Record<string, string> = {};
  if (!formData.name) newErrors.name = 'Name required';
  if (!formData.email) newErrors.email = 'Email required';

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  // Submit
  try {
    const response = await fetch('/api/resource', {
      method: 'POST',
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      toast.success('Created successfully');
      // Reset form
      setFormData({ name: '', description: '', email: '' });
    }
  } catch (error) {
    // Handle error
  }
}
```

## Async State Patterns

### Pattern 1: Loading/Error State

```typescript
interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const [state, setState] = useState<AsyncState<Project>>({
  data: null,
  loading: false,
  error: null
});

async function fetchProject() {
  setState(prev => ({ ...prev, loading: true }));
  try {
    const response = await fetch(`/api/projects/${id}`);
    const data = await response.json();
    setState(prev => ({ ...prev, data, loading: false }));
  } catch (error) {
    setState(prev => ({
      ...prev,
      error: error.message,
      loading: false
    }));
  }
}
```

### Pattern 2: useReducer for Complex State

```typescript
interface State {
  workflows: Workflow[];
  loading: boolean;
  error: Error | null;
  selectedId: string | null;
}

type Action =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: Workflow[] }
  | { type: 'LOAD_ERROR'; payload: Error }
  | { type: 'SELECT'; payload: string }
  | { type: 'DELETE'; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null };
    case 'LOAD_SUCCESS':
      return { ...state, workflows: action.payload, loading: false };
    case 'LOAD_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SELECT':
      return { ...state, selectedId: action.payload };
    case 'DELETE':
      return {
        ...state,
        workflows: state.workflows.filter(w => w.id !== action.payload)
      };
    default:
      return state;
  }
}

const [state, dispatch] = useReducer(reducer, initialState);

// Usage:
dispatch({ type: 'SELECT', payload: 'workflow-1' });
dispatch({ type: 'DELETE', payload: 'workflow-2' });
```

## Local Storage Integration

Persist state across sessions:

```typescript
// Save to localStorage
function usePersistentState<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    // Read from localStorage on mount
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  // Save to localStorage whenever value changes
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Usage:
const [theme, setTheme] = usePersistentState<'light' | 'dark'>(
  'theme',
  'light'
);
```

## Custom Hooks

Reusable state logic:

```typescript
// Hook: useAsync
function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true
) {
  const [state, setState] = useState<{
    status: 'idle' | 'pending' | 'success' | 'error';
    data: T | null;
    error: Error | null;
  }>({
    status: 'idle',
    data: null,
    error: null
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, status: 'pending' }));
    try {
      const data = await asyncFunction();
      setState({ status: 'success', data, error: null });
      return data;
    } catch (error) {
      setState({
        status: 'error',
        data: null,
        error: error as Error
      });
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { ...state, execute };
}

// Usage:
const { data, status, error } = useAsync(
  () => fetch('/api/workflows').then(r => r.json())
);
```

## State Organization Best Practices

1. **Keep state close to where it's used**
   - Don't hoist state unnecessarily
   - If only child needs it, keep in child component

2. **Use separate states for independent concerns**
   ```typescript
   // Good
   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);

   // Not ideal
   const [state, setState] = useState({
     data, loading, error  // Too coupled
   });
   ```

3. **Prefer composition over prop drilling**
   ```typescript
   // Bad: Passing through many layers
   <GrandchildComponent workflow={workflow} />

   // Better: Use context
   <WorkflowContext.Provider value={workflow}>
     <Grandchild />
   </WorkflowContext.Provider>
   ```

4. **Normalize data structure**
   ```typescript
   // Bad: Nested updates difficult
   workflows: [
     { id: 1, name: 'WF1', project: { id: 1, name: 'P1' } }
   ]

   // Good: Separate collections
   workflows: [
     { id: 1, name: 'WF1', projectId: 1 }
   ],
   projects: [
     { id: 1, name: 'P1' }
   ]
   ```

---

**Next Steps:**
- Read [React Flow Integration](./react-flow.md)
- Learn [API patterns](../backend/api.md)
- Check [RBAC implementation](../backend/rbac.md)
