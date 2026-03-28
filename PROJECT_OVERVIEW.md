# SaaS Workflow Automation Platform

A modern, full-featured workflow automation platform built with Next.js 15, React Flow, and TailwindCSS. This application enables users to create, manage, and monitor automated workflows without writing any code.

## Project Features

### Core Features
- **Workflow Builder**: Visual drag-and-drop interface powered by React Flow
- **6 Node Types**: Trigger, Action, Condition, Delay, Webhook, and API Request nodes
- **Real-time Dashboard**: Monitor active workflows, execution statistics, and system health
- **Integration Marketplace**: Connect with 100+ apps (Slack, Gmail, Notion, Stripe, etc.)
- **Template System**: Pre-built workflow templates for quick setup
- **Execution Logs**: Track and troubleshoot all workflow executions
- **API Management**: Generate and manage API keys for programmatic access
- **Dark/Light Mode**: Full theme support with next-themes

### UI/UX Features
- **Responsive Design**: Mobile, tablet, and desktop optimization
- **Dark Theme Primary**: Modern dark aesthetic with blue accent color
- **Component Library**: 50+ pre-built shadcn/ui components
- **Semantic HTML**: Accessibility-first development approach
- **Smooth Animations**: CSS transitions and ReactFlow animations

## Project Structure

```
Autoflow/
├── app/                                    # Next.js app directory
│   ├── layout.tsx                          # Root layout with theme provider
│   ├── page.tsx                            # Landing page
│   ├── globals.css                         # Design tokens and base styles
│   ├── builder/
│   │   ├── page.tsx                        # Main workflow builder screen
│   │   └── loading.tsx                     # Loading skeleton
│   ├── projects/
│   │   ├── page.tsx                        # Project list
│   │   └── [projectId]/
│   │       └── page.tsx                    # Project dashboard
│   ├── dashboard/
│   │   ├── layout.tsx                      # Dashboard layout with sidebar
│   │   ├── page.tsx                        # Workflows overview
│   │   ├── executions/page.tsx             # Execution logs viewer (INTERACTIVE)
│   │   ├── integrations/page.tsx           # Integration marketplace
│   │   ├── templates/page.tsx              # Template gallery
│   │   ├── api-keys/page.tsx               # API key management
│   │   └── settings/page.tsx               # User settings & permissions
│   └── workflow/
│       ├── [id]/page.tsx                   # Workflow builder canvas
│       └── new/page.tsx                    # New workflow creation
│
├── features/                               # 🔥 CORE ARCHITECTURE - Feature-specific logic
│   │
│   ├── nodes/                              # Everything about nodes (reusable)
│   │   ├── components/
│   │   │   ├── NodeCard.tsx                # Visual node representation
│   │   │   ├── NodeEditor.tsx              # Node configuration editor
│   │   │   └── NodeToolbar.tsx             # Node action toolbar
│   │   ├── config/
│   │   │   └── index.ts                    # Node type definitions (CRITICAL)
│   │   ├── hooks/
│   │   │   ├── useNode.ts                  # Node state management
│   │   │   └── useNodeValidation.ts        # Node validation logic
│   │   ├── utils/
│   │   │   └── nodeHelpers.ts              # Node utility functions
│   │   └── types.ts                        # Node typescript types
│   │
│   ├── workflow/                           # Canvas + workflow logic
│   │   ├── components/
│   │   │   ├── Canvas.tsx                  # React Flow canvas wrapper
│   │   │   ├── Edge.tsx                    # Custom edge rendering
│   │   │   ├── WorkflowToolbar.tsx         # Workflow controls toolbar
│   │   │   ├── DashboardContent.tsx        # Dashboard with stats + workflows
│   │   │   └── WorkflowCardExpandable.tsx  # Interactive workflow card
│   │   ├── hooks/
│   │   │   ├── useWorkflow.ts              # Workflow state management
│   │   │   └── useConnections.ts           # Connection logic
│   │   ├── store.ts                        # Zustand/Redux for builder state
│   │   ├── utils/
│   │   │   ├── layout.ts                   # Auto-layout algorithms
│   │   │   └── validation.ts               # Workflow validation
│   │   └── types.ts                        # Workflow types
│   │
│   ├── execution/                          # Running workflows + status
│   │   ├── components/
│   │   │   ├── ExecutionRowExpandable.tsx  # Expandable execution row (INTERACTIVE)
│   │   │   ├── ExecutionsGrid.tsx          # Executions table with filters
│   │   │   ├── StatusBadge.tsx             # Status indicator component
│   │   │   └── RunButton.tsx               # Action button with loading
│   │   ├── hooks/
│   │   │   └── useExecution.ts             # Execution state & polling
│   │   ├── services.ts                     # API to trigger execution
│   │   └── types.ts                        # Execution types
│   │
│   ├── logs/                               # Logs + debugging
│   │   ├── components/
│   │   │   ├── LogsPanel.tsx               # Real-time logs viewer
│   │   │   └── LogItem.tsx                 # Individual log entry
│   │   ├── hooks/
│   │   │   └── useLogs.ts                  # Log streaming & filtering
│   │   └── types.ts                        # Log types
│   │
│   ├── integrations/                       # Integration management (INTERACTIVE)
│   │   ├── components/
│   │   │   ├── IntegrationCard.tsx         # Integration card with auth modal
│   │   │   ├── IntegrationsGrid.tsx        # Marketplace grid with search
│   │   │   └── AuthFlow.tsx                # OAuth authentication flow
│   │   ├── services.ts                     # Integration APIs
│   │   └── types.ts                        # Integration types
│   │
│   ├── templates/                          # Template system
│   │   ├── components/
│   │   │   ├── TemplateCard.tsx            # Template card with preview
│   │   │   ├── TemplatesGrid.tsx           # Template gallery with filters
│   │   │   └── CategoryFilter.tsx          # Category filtering
│   │   ├── services.ts                     # Template APIs
│   │   └── types.ts                        # Template types
│   │
│   ├── settings/                           # User settings + API keys
│   │   ├── components/
│   │   │   ├── SettingsPageContent.tsx     # Settings with tabs
│   │   │   ├── ApiKeyCard.tsx              # API key with hide/show
│   │   │   └── ApiKeysGrid.tsx             # API keys management
│   │   ├── services.ts                     # Settings/API key APIs
│   │   └── types.ts                        # Settings types
│   │
│   ├── projects/                           # Project management
│   │   ├── components/
│   │   │   ├── ProjectCard.tsx             # Project list item
│   │   │   └── ProjectForm.tsx             # Create/edit project
│   │   ├── services.ts                     # Project APIs
│   │   └── types.ts                        # Project types
│   │
│   ├── hooks.ts                            # Shared feature hooks
│   ├── types.ts                            # Shared feature types
│   ├── utils.ts                            # Shared feature utilities
│   └── auth/                               # Authentication logic
│
├── components/                             # PURE reusable UI only
│   ├── ui/                                 # Base UI components with states
│   │   ├── empty-state.tsx                 # Empty state component (NEW)
│   │   ├── loading-skeleton.tsx            # Loading skeleton (NEW)
│   │   ├── status-badge.tsx                # Status indicator (ENHANCED)
│   │   ├── stat-card-enhanced.tsx          # Stat card with glow (NEW)
│   │   ├── action-button.tsx               # Button with loading/success (NEW)
│   │   ├── filter-chips.tsx                # Filter chip selector (NEW)
│   │   ├── animated-glow.tsx               # Glow effect wrapper (NEW)
│   │   ├── button.tsx                      # Base button
│   │   ├── input.tsx                       # Base input
│   │   ├── card.tsx                        # Base card
│   │   ├── dialog.tsx                      # Modal dialog
│   │   ├── alert-dialog.tsx                # Confirmation dialog
│   │   ├── tabs.tsx                        # Tab component
│   │   ├── badge.tsx                       # Badge component
│   │   ├── label.tsx                       # Form label
│   │   └── ... (30+ other shadcn components)
│   │
│   ├── layout/
│   │   ├── Navbar.tsx                      # Top navigation
│   │   ├── Sidebar.tsx                     # Navigation sidebar with active highlight
│   │   └── DashboardLayout.tsx             # Dashboard layout wrapper
│   │
│   └── shared/                             # Cross-cutting UI components
│       ├── ThemeProvider.tsx               # Theme context & provider
│       ├── ThemeToggle.tsx                 # Dark/light mode toggle
│       └── Toast.tsx                       # Toast notification system
│
├── lib/                                    # Shared utilities & config
│   ├── axios.ts                            # HTTP client setup
│   ├── constants.ts                        # Global constants
│   ├── types.ts                            # Global type definitions
│   ├── utils.ts                            # Global utility functions
│   └── mock-data.ts                        # Mock data for development
│
├── store/                                  # GLOBAL state (Zustand/Redux)
│   ├── authStore.ts                        # Auth state
│   ├── appStore.ts                         # App-wide state
│   └── workflowStore.ts                    # Builder canvas state
│
├── styles/
│   ├── globals.css                         # Global styles
│   ├── animations.css                      # Animation definitions (NEW)
│   └── theme.css                           # CSS variables for theming
│
├── hooks/                                  # App-wide custom hooks
│   ├── use-toast.ts                        # Toast notification hook
│   ├── use-mobile.ts                       # Mobile detection hook
│   └── use-theme.ts                        # Theme hook
│
├── types/
│   └── index.ts                            # Global type exports
│
├── assets/
│   ├── icons/                              # SVG icons
│   └── images/                             # Raster images
│
├── public/                                 # Static files
│   └── icons/                              # Icon assets
│
├── package.json                            # Dependencies
├── tailwind.config.ts                      # Tailwind configuration
├── tsconfig.json                           # TypeScript configuration
├── next.config.mjs                         # Next.js configuration
└── README.md                               # Project documentation
```

## Design System

### Color Palette
- **Dark Mode**: Black background (#0f0f0f) with white text
- **Primary**: Blue (#3B82F6)
- **Neutrals**: Grays for cards, borders, and text hierarchy
- **Accents**: Green (success), Red (error), Yellow (warning), Purple (info)

### Typography
- **Fonts**: Geist (body) and Geist Mono (code)
- **Hierarchy**: 5 levels of text sizing (sm, base, lg, xl, 2xl+)

### Layout
- **Method**: Flexbox for responsive, mobile-first layouts
- **Spacing**: 4px base unit with 6 spacing levels (4px, 8px, 16px, 24px, 32px, 48px)
- **Breakpoints**: Mobile (320px), Tablet (768px), Desktop (1024px), Large (1280px)

## Pages & Functionality

### 1. Landing Page (`/`)
- Hero section with call-to-action buttons
- Feature highlights (4 main features)
- Integration showcase (8+ apps)
- Pricing tiers (3 levels: Starter, Professional, Enterprise)
- Footer with navigation links

### 2. Dashboard (`/dashboard`)
- Welcome header with "New Workflow" button
- Stats grid (Total, Active, Executions, Success Rate)
- Workflow cards with status indicators
- Recent activity sidebar
- Recent executions table

### 3. Workflow Builder (`/workflow/[id]`)
- Interactive React Flow canvas with 400x400px viewport
- 6 draggable node types with visual styling
- Right sidebar with node configuration panel
- Dynamic form fields based on node type
- Node library for adding new nodes

### 4. Executions Log (`/dashboard/executions`)
- Search and filter interface
- Status filtering (success, failed, running, pending)
- Sortable execution table
- Execution duration tracking
- Error message display

### 5. Integrations (`/dashboard/integrations`)
- 8+ integration cards with icons
- Category filtering
- Connection status indicators
- Connect/Manage buttons
- Search functionality

### 6. Templates (`/dashboard/templates`)
- 8 pre-built workflow templates
- Category filtering
- Install count tracking
- Connected apps display
- Template preview

### 7. API Keys (`/dashboard/api-keys`)
- API key list with masked values
- Key generation interface
- Creation date and last-used tracking
- Copy-to-clipboard functionality
- Key revocation

### 8. Settings (`/dashboard/settings`)
- Tabbed interface (Account, Notifications, Billing, Security)
- Profile information editor
- Notification preferences with toggles
- Billing information display
- Security settings (2FA, sessions)

## Technology Stack

### Core
- **Framework**: Next.js 15 (App Router, React 19.2)
- **Language**: TypeScript 5.7
- **Styling**: TailwindCSS 4.2 with PostCSS
- **UI Components**: shadcn/ui (50+ components)

### Workflow Builder
- **React Flow**: 11.11.0 for visual node editor
- **Handles**: Connection handles for node linking

### Utilities
- **Form Handling**: react-hook-form, zod for validation
- **Icons**: lucide-react (50+ icons)
- **Date Handling**: date-fns
- **Theme Management**: next-themes
- **Notifications**: sonner (toast notifications)

### Development
- **Package Manager**: pnpm
- **Linting**: ESLint
- **Type Safety**: Full TypeScript coverage

## Mock Data

The application includes comprehensive mock data in `lib/mock-data.ts`:

- **Workflows**: 6 sample workflows with various statuses
- **Executions**: 8 execution records with different statuses
- **Integrations**: 8 apps with connection status
- **Templates**: 8 pre-built templates
- **Dashboard Stats**: Aggregated metrics

## Key Components

### Workflow Canvas
- React Flow integration with custom nodes
- Grid background and zoom controls
- Mini-map for navigation
- Drag-to-add nodes functionality

### Node Types
1. **Trigger**: Start of workflow (Zap icon, blue border)
2. **Action**: Execute an action (Zap icon, blue border)
3. **Condition**: Branch based on criteria (GitBranch icon, yellow)
4. **Delay**: Pause execution (Clock icon, purple)
5. **Webhook**: HTTP callback (Webhook icon, green)
6. **API Request**: Make API calls (Database icon, orange)

### Configuration Panel
- Dynamic form fields based on node type
- Real-time node updates
- Delete node functionality
- Input validation

## Getting Started

### Installation
1. Clone the repository
2. Install dependencies: `pnpm install`
3. Run development server: `pnpm dev`
4. Open http://localhost:3000

### Building
- Production build: `pnpm build`
- Start production: `pnpm start`

## Future Enhancements

- Backend API integration for real data
- User authentication and authorization
- Database integration (Supabase/Neon)
- Real workflow execution engine
- Advanced analytics dashboard
- Webhook testing interface
- Workflow versioning and rollback
- Team collaboration features
- Audit logging
- Performance monitoring

## File Count Summary

- **Pages**: 8 main pages
- **Components**: 15+ custom components + 50 UI components
- **Types**: 60+ TypeScript interfaces
- **Mock Data**: 30+ sample records

Total lines of code: ~3,000+ (excluding node_modules and UI library)

## Notes

- All data is currently mocked for demonstration
- Sidebar includes mobile-responsive hamburger menu
- Theme toggle available in header and sidebar
- All forms use proper validation patterns
- Semantic HTML with ARIA attributes throughout
- Mobile-first responsive design
