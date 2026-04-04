# Setup Guide

## Prerequisites

- **Node.js** 18+ (check with `node --version`)
- **npm** 9+ or **pnpm** 8+ (check with `npm --version`)
- **Git** (check with `git --version`)
- A code editor (VS Code recommended)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/autoflow.git
cd autoflow
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Or using pnpm:
```bash
pnpm install
```

### 3. Environment Configuration

Create a `.env.local` file in the project root:

```env
# Authentication (Mock)
NEXT_PUBLIC_AUTH_MODE=mock
NEXT_PUBLIC_DEFAULT_USER_ID=user-1
NEXT_PUBLIC_DEFAULT_USER_ROLE=Owner

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Feature Flags
NEXT_PUBLIC_ENABLE_TEMPLATES=true
NEXT_PUBLIC_ENABLE_INTEGRATIONS=true
```

**Available User Roles for Testing:**
- `Owner` - Full access to all features
- `Admin` - Can't delete projects
- `Builder` - Can't manage team
- `Runner` - Can run but not create workflows
- `Viewer` - Read-only access

To test different roles, change `NEXT_PUBLIC_DEFAULT_USER_ROLE` and restart.

### 4. Start Development Server

```bash
npm run dev
```

Or with pnpm:
```bash
pnpm dev
```

Output will show:
```
> ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

Open http://localhost:3000 in your browser.

### 5. Build for Production

```bash
npm run build
npm run start
```

## Project Structure Quick Reference

```
autoflow/
├── app/                    # Next.js App Router (pages & APIs)
│   ├── api/               # API endpoints
│   ├── auth/              # Auth pages (login, signup)
│   ├── dashboard/         # Main application
│   ├── workflow/          # Workflow editor
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui primitives
│   ├── landing/          # Landing page sections
│   └── *.tsx             # Feature components
├── lib/                   # Utilities and business logic
│   ├── api-service.ts    # API client & backend functions
│   ├── types.ts          # TypeScript types
│   ├── rbac.ts           # Permission system
│   ├── node-schema.ts    # Node type definitions
│   └── mock-data.ts      # In-memory data store
├── features/             # Feature-specific logic
├── hooks/                # Custom React hooks
├── styles/               # Global CSS
├── public/               # Static assets
├── docs/                 # Documentation (this folder)
├── package.json          # Dependencies
└── tsconfig.json         # TypeScript config
```

## Database Setup

Currently, Autoflow uses **in-memory mock data** stored in `lib/mock-data.ts`. This includes:

```typescript
// Mock users, projects, workflows, executions
const mockUsers = { /* ... */ }
const mockProjects = { /* ... */ }
const mockWorkflows = { /* ... */ }
const mockExecutions = { /* ... */ }
```

**To use a real database:**

1. Choose your database (PostgreSQL, MongoDB, etc.)
2. Set up connection in `lib/db.ts`
3. Update API routes to call database instead of mock store
4. Update `lib/api-service.ts` functions

Example PostgreSQL connection:

```typescript
// lib/db.ts
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

export const db = {
  query: (text, params) => pool.query(text, params)
}
```

Then in an API route:

```typescript
// Before (mock)
const workflow = mockWorkflows[id]

// After (database)
const { rows } = await db.query(
  'SELECT * FROM workflows WHERE id = $1',
  [id]
)
const workflow = rows[0]
```

## Common First-Time Tasks

### Task 1: Create Your First Workflow

1. Open http://localhost:3000
2. Click "Get Started"
3. Create a project (name it anything)
4. Create a workflow in that project
5. Drag nodes onto the canvas
6. Connect them with edges
7. Click "Save"
8. Click "Run" to execute

### Task 2: Understand the Mock Data

```typescript
// See lib/mock-data.ts
// Current structure:
{
  users: {
    "user-1": { id, name, email, role }
  },
  projects: {
    "proj-1": { id, name, description, ownerId, members }
  },
  workflows: {
    "wf-1": { id, projectId, name, nodes, edges, status }
  },
  executions: {
    "exec-1": { id, workflowId, status, startedAt, logs }
  }
}
```

### Task 3: Add a New Node Type

1. Add type definition to `lib/node-schema.ts`
2. Add UI component in `components/workflow-nodes.tsx`
3. Add execution logic to execution engine (if needed)
4. Test with workflow

See [Node Creation Guide](./workflow-engine/node-creation.md) for detailed steps.

### Task 4: Add an API Endpoint

1. Create file in `app/api/resource/route.ts`
2. Implement `GET`, `POST`, `PUT`, or `DELETE`
3. Add RBAC checks using `canUserPerformAction()`
4. Test with frontend

## Troubleshooting

### Issue: Port 3000 Already in Use

```bash
# Kill process on port 3000
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

Then restart: `npm run dev`

### Issue: Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### Issue: TypeScript Errors

```bash
# Rebuild TypeScript
npm run build

# Check for type issues
npx tsc --noEmit
```

### Issue: Mock Data Not Persisting

The mock data is in-memory only. It resets on server restart. This is intentional for development. To persist data:

1. Use local database (SQLite)
2. Or connect to PostgreSQL/MongoDB
3. See **Database Setup** section above

### Issue: CSS/Styling Issues

Ensure `tailwind.config.ts` includes all component paths:

```typescript
content: [
  './app/**/*.{js,ts,jsx,tsx}',
  './components/**/*.{js,ts,jsx,tsx}',
  './features/**/*.{js,ts,jsx,tsx}',
]
```

Then rebuild:
```bash
npm run build
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type check
npm run check-types

# Lint code
npm run lint

# Format code
npm run format
```

## Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_AUTH_MODE` | `mock` | Authentication mode (mock, oauth, jwt) |
| `NEXT_PUBLIC_DEFAULT_USER_ID` | `user-1` | Mock user ID for development |
| `NEXT_PUBLIC_DEFAULT_USER_ROLE` | `Owner` | Mock user role (Owner, Admin, Builder, Runner, Viewer) |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000/api` | API base URL |
| `NEXT_PUBLIC_ENABLE_TEMPLATES` | `true` | Enable workflow templates |
| `NEXT_PUBLIC_ENABLE_INTEGRATIONS` | `true` | Enable integrations feature |
| `DATABASE_URL` | (not set) | Database connection string (if using real DB) |

## Next Steps

1. **Explore the Application**
   - Navigate to http://localhost:3000
   - Create a project and workflow
   - Test the workflow editor

2. **Read Documentation**
   - [Project Overview](./overview.md) - Understand concepts
   - [System Architecture](./architecture.md) - How it works
   - [API Documentation](./backend/api.md) - Available endpoints

3. **Start Developing**
   - Create custom nodes: See [Node Creation Guide](./workflow-engine/node-creation.md)
   - Extend API: See [API Documentation](./backend/api.md)
   - Understand permissions: See [RBAC Guide](./backend/rbac.md)

4. **Deploy**
   - Recommended platforms: Vercel, AWS, Azure, Heroku
   - Environment variables must be configured before deployment
   - See deployment guides for your chosen platform

## Getting Help

- **TypeScript Errors?** → Check `lib/types.ts` type definitions
- **Permission Denied?** → Check `lib/rbac.ts` permission rules
- **API Not Working?** → Check the endpoint in `app/api/` directory
- **Component Issues?** → Check `components/` or `components/ui/` directories
- **Data Flow?** → See Architecture diagram in [System Architecture](./architecture.md)

---

**Ready to code?** Pick your task:
- [Add a custom node](./workflow-engine/node-creation.md)
- [Create an API endpoint](./backend/api.md)
- [Understand React Flow](./frontend/react-flow.md)
