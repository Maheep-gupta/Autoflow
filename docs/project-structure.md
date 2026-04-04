# Project Structure Guide

## Directory Tree

```
autoflow/
├── app/                          # Next.js App Router (pages & API routes)
│   ├── api/                      # Backend API endpoints
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── projects/             # Project management API
│   │   │   ├── route.ts          # GET /projects, POST /projects
│   │   │   └── [id]/
│   │   │       └── route.ts      # GET, PUT, DELETE /projects/[id]
│   │   ├── workflows/            # Workflow management API
│   │   │   ├── route.ts          # POST /workflows (create)
│   │   │   └── [id]/
│   │   │       └── route.ts      # GET, PUT, DELETE /workflows/[id]
│   │   ├── executions/           # Workflow execution API
│   │   │   ├── route.ts          # POST /executions, GET /executions
│   │   │   └── [id]/
│   │   │       └── route.ts      # GET /executions/[id]
│   │   └── integrations/         # External integrations API
│   │       ├── route.ts
│   │       └── [id]/
│   ├── auth/                     # Auth pages
│   │   ├── login/page.tsx        # Login form
│   │   └── signup/page.tsx       # Sign up form
│   ├── dashboard/                # Main application dashboard
│   │   ├── page.tsx              # Dashboard home (project list)
│   │   ├── layout.tsx            # Dashboard layout (sidebar, header)
│   │   ├── project/              
│   │   │   └── [id]/page.tsx     # Project detail (workflow list)
│   │   ├── api-keys/             # API key management page
│   │   ├── integrations/         # Integrations setup page
│   │   ├── settings/             # Team settings, preferences
│   │   ├── templates/            # Workflow templates browser
│   │   ├── executions/           # Global executions view
│   │   └── workflow/
│   │       └── [id]/page.tsx     # Workflow detail/view
│   ├── workflow/                 # Workflow editor (main feature)
│   │   ├── [id]/page.tsx         # Workflow editor for existing workflow
│   │   └── new/page.tsx          # Create new workflow (with projectId param)
│   ├── layout.tsx                # Root layout (theme, providers)
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
│
├── components/                   # Reusable React components
│   ├── ui/                      # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── toast.tsx
│   │   └── ...30+ more UI components
│   ├── landing/                 # Landing page sections
│   │   ├── hero-section.tsx
│   │   ├── features-section.tsx
│   │   ├── how-it-works.tsx
│   │   ├── pricing-section.tsx
│   │   ├── integrations-section.tsx
│   │   ├── cta-section.tsx
│   │   ├── footer.tsx
│   │   └── navbar.tsx
│   ├── workflow-canvas.tsx      # React Flow canvas component
│   ├── workflow-nodes.tsx       # Custom React Flow node types
│   ├── workflow-card.tsx        # Card displaying a workflow
│   ├── workflow-settings-modal.tsx # Modal for workflow settings
│   ├── config-panel.tsx         # Right panel for node configuration
│   ├── add-node-modal.tsx       # Modal for adding new nodes
│   ├── delete-confirmation-dialog.tsx # Generic delete confirmation
│   ├── enhanced-workflow-card.tsx    # Enhanced workflow card variant
│   ├── enhanced-api-key-card.tsx
│   ├── enhanced-execution-table.tsx
│   ├── enhanced-integration-card.tsx
│   ├── enhanced-stat-card.tsx
│   ├── enhanced-template-card.tsx
│   ├── execution-table.tsx      # Table showing workflow executions
│   ├── sidebar.tsx              # Application sidebar
│   ├── stat-card.tsx            # Card for displaying statistics
│   ├── theme-provider.tsx       # Theme context provider
│   ├── theme-toggle.tsx         # Dark/light mode toggle
│   └── animations/              # Animation utilities
│
├── lib/                         # Core library code & utilities
│   ├── types.ts                 # All TypeScript type definitions
│   │   ├─ User, Project, ProjectMember
│   │   ├─ Workflow, WorkflowExecution
│   │   ├─ Integration, ApiKey
│   │   └─ ExecutionLog, etc.
│   ├── api-service.ts           # API client functions
│   │   ├─ Project functions: getProject, createProject, updateProject
│   │   ├─ Workflow functions: getWorkflow, saveWorkflow, deleteWorkflow
│   │   ├─ Execution functions: executeWorkflow, getExecutions
│   │   └─ Generic fetch wrapper
│   ├── mock-data.ts             # In-memory data store
│   │   ├─ mockUsers
│   │   ├─ mockProjects
│   │   ├─ mockWorkflows (with nodes/edges)
│   │   ├─ mockExecutions
│   │   └─ mockIntegrations
│   ├── node-schema.ts           # Node type definitions & metadata
│   │   ├─ Node type definitions
│   │   ├─ Node parameter schemas
│   │   ├─ getDefaultParams() - Create default params for node type
│   │   ├─ ensureNodeParams() - Validate/fix node parameters
│   │   └─ TYPE_LABELS mapping
│   ├── rbac.ts                  # Role-based access control
│   │   ├─ canUserPerformAction()
│   │   ├─ getUserPermissions()
│   │   ├─ requirePermission() middleware
│   │   └─ Permission checks
│   ├── utils.ts                 # General utility functions
│   │   ├─ cn() - Merge class names
│   │   ├─ formatDate()
│   │   └─ Other helpers
│   ├── date-utils.ts            # Date formatting & manipulation
│   ├── generate-workflow-json.ts # Helper for creating workflows
│   └── db.ts                    # Database connection (when using real DB)
│
├── features/                    # Feature-specific code (will grow)
│   ├── workflow/                # Workflow feature module
│   │   └── components/
│   ├── execution/               # Execution feature module
│   │   └── components/
│   ├── integration/
│   ├── templates/
│   └── settings/
│
├── hooks/                       # Custom React hooks
│   ├── use-toast.ts            # Toast notification hook
│   └── use-mobile.ts           # Mobile detection hook
│
├── styles/                      # Global styles
│   └── globals.css             # Tailwind + global CSS
│
├── public/                      # Static assets served at /
│   └── (images, fonts, etc.)
│
├── docs/                        # Documentation (you are here!)
│   ├── overview.md              # What is Autoflow?
│   ├── architecture.md          # System design & data flow
│   ├── setup.md                 # How to set up & run
│   ├── project-structure.md     # This file
│   ├── workflow-engine/
│   │   ├── nodes.md             # Node types & structure
│   │   ├── node-creation.md     # How to create custom nodes
│   │   └── execution-flow.md    # Execution step-by-step
│   ├── frontend/
│   │   ├── react-flow.md        # React Flow integration
│   │   └── state-management.md  # Frontend state handling
│   └── backend/
│       ├── api.md               # API endpoints reference
│       ├── database.md          # Data models
│       └── rbac.md              # Permission system
│
├── config files:
│   ├── package.json             # Dependencies & scripts
│   ├── tsconfig.json            # TypeScript configuration
│   ├── next.config.mjs          # Next.js configuration
│   ├── tailwind.config.ts       # Tailwind CSS configuration
│   ├── postcss.config.mjs       # PostCSS configuration
│   ├── .env.local               # Environment variables (local)
│   └── pnpm-lock.yaml           # Dependency lock file (pnpm)
│
└── root files:
    ├── README.md                # Project readme
    ├── CONTRIBUTING.md          # Contribution guidelines
    ├── LICENSE                  # License file
    └── .gitignore               # Git ignore patterns
```

## Purpose of Each Directory

### `/app` - Next.js App Router

The application framework. Each file becomes a route.

- **`/api`** - Backend API routes
- **`/auth`** - Authentication pages (login, signup)
- **`/dashboard`** - Main application for logged-in users
- **`/workflow`** - Main workflow editor interface
- **`layout.tsx`** - Root layout wrapping all pages
- **`page.tsx`** - Landing page (home route)

### `/components` - React Components

Reusable, self-contained React components.

- **`/ui`** - shadcn/ui component library (buttons, inputs, modals, etc.)
- **`/landing`** - Landing page specific components
- **Workflow components** - `workflow-canvas.tsx`, `config-panel.tsx`, etc.
- **Card components** - `workflow-card.tsx`, `stat-card.tsx`, etc.
- **Dialogs** - `add-node-modal.tsx`, `delete-confirmation-dialog.tsx`

### `/lib` - Library Code

Core business logic, utilities, and data access.

- **`types.ts`** - All TypeScript type definitions for the app
- **`api-service.ts`** - Functions that call the API routes
- **`mock-data.ts`** - In-memory data store for development
- **`node-schema.ts`** - Defines all node types and their configuration
- **`rbac.ts`** - Permission system implementation
- **`utils.ts`** - General utility functions

### `/features` - Feature Modules

Feature-specific code organized by feature. These are "mini-apps" that may have their own components, hooks, and utils.

- **`/workflow`** - Workflow creation and management
- **`/execution`** - Execution tracking and monitoring
- **`/integration`** - External service integrations
- **`/templates`** - Workflow templates

### `/docs` - Documentation

You're reading this! Comprehensive guides for developers.

- **`overview.md`** - What is Autoflow and core concepts
- **`architecture.md`** - How the system is designed
- **`setup.md`** - How to set up your development environment
- **`/workflow-engine`** - How nodes and workflows work
- **`/frontend`** - React and UI specifics
- **`/backend`** - API and database details

## Data Flow Through Directories

### Example: Creating a Workflow

```
1. User interaction in component
   └─ components/workflow-canvas.tsx

2. Call API service function
   └─ lib/api-service.ts → saveWorkflow()

3. API route processes request
   └─ app/api/workflows/[id]/route.ts

4. Business logic & permissions
   └─ lib/rbac.ts, lib/node-schema.ts

5. Data stored
   └─ lib/mock-data.ts (development)
      or database (production)

6. Response back to component
   └─ Update React state
   └─ components/workflow-canvas.tsx re-renders
```

### Example: Generating Node File

```
import statements:
├─ from 'lib/types.ts' → Get Node, Edge types
├─ from 'lib/node-schema.ts' → Get default params
├─ from 'lib/api-service.ts' → Get saveWorkflow function

Usage:
function MyComponent() {
  const nodes = Array.from(...)  // Create from node schema
  const edges = [
    { id: 'e1', source: 'node1', target: 'node2' }
  ]
  
  // Call with nodes/edges
  const result = await saveWorkflow(workflowId, { nodes, edges })
}
```

## Key File Relationships

```
types.ts (master types)
  ↓ imported by:
  ├─ api-service.ts (functions return these types)
  ├─ components/*.tsx (props use these types)
  ├─ lib/rbac.ts (checks permission on Project type)
  └─ lib/node-schema.ts (Node type implementation)

api-service.ts
  ↓ calls:
  └─ app/api/*/route.ts (backend endpoints)

rbac.ts
  ↓ called by:
  ├─ app/api/*/route.ts (permission checks)
  └─ components/*.tsx (permission checks for UI)

node-schema.ts
  ↓ imported by:
  ├─ app/workflow/[id]/page.tsx (add new nodes)
  ├─ components/add-node-modal.tsx (node list)
  └─ components/config-panel.tsx (show params)
```

## File Size Guidelines

When deciding where to put code:

| File Size | Location | Example |
|-----------|----------|---------|
| <100 lines | `/lib` | `date-utils.ts` |
| 100-300 lines | `/components` or `/lib` | `workflow-card.tsx` |
| 300-600 lines | `/components` or `/features` | `config-panel.tsx` |
| >600 lines | Split into `/features` submodule | Create `/features/workflow/` |

If a component file gets >600 lines:
1. Create `/features/FeatureName/` directory
2. Split into smaller components
3. Create `index.ts` to re-export

## Import Path Conventions

```typescript
// Absolute imports (use these)
import { User, Project } from '@/lib/types'
import { saveWorkflow } from '@/lib/api-service'
import { Button } from '@/components/ui/button'

// Avoid relative imports (hard to refactor)
import { User } from '../../../lib/types'

// Special cases
import { cn } from '@/lib/utils'  // utility function
```

## Adding New Features

When adding a new feature, create in this order:

1. **Add types** in `/lib/types.ts`
2. **Add API routes** in `/app/api/<feature>/`
3. **Add API client functions** in `/lib/api-service.ts`
4. **Create components** in `/components/` or `/features/<feature>/`
5. **Add pages** in `/app/dashboard/<feature>/` or `/app/<feature>/`
6. **Document** in `/docs/`

Example: Adding "Webhooks" feature:

```
Step 1: lib/types.ts
  + interface Webhook { ... }

Step 2: app/api/webhooks/
  + route.ts (CRUD for webhooks)

Step 3: lib/api-service.ts
  + getWebhooks()
  + createWebhook()
  + updateWebhook()
  + deleteWebhook()

Step 4: components/
  + webhook-card.tsx
  + add-webhook-modal.tsx

Step 5: app/dashboard/
  + webhooks/page.tsx (list view)

Step 6: docs/
  + backend/webhooks.md
```

---

**Next Steps:**
- Understand [how nodes work](./workflow-engine/nodes.md)
- Learn [the API structure](./backend/api.md)
- Set up [your development environment](./setup.md)
- Or explore specific features based on your role
