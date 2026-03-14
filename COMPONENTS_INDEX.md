# Components Index - Quick Reference Guide

## Custom Components

### Layout Components
| Component | Location | Purpose | Size |
|-----------|----------|---------|------|
| `Sidebar` | `/components/sidebar.tsx` | Navigation with mobile menu | 117 lines |
| `ThemeToggle` | `/components/theme-toggle.tsx` | Dark/light mode switcher | 31 lines |

### Dashboard Components
| Component | Location | Purpose | Size |
|-----------|----------|---------|------|
| `StatCard` | `/components/stat-card.tsx` | Dashboard statistics card | 43 lines |
| `WorkflowCard` | `/components/workflow-card.tsx` | Workflow list item card | 70 lines |
| `ExecutionTable` | `/components/execution-table.tsx` | Execution logs table | 103 lines |

### Workflow Builder Components
| Component | Location | Purpose | Size |
|-----------|----------|---------|------|
| `WorkflowCanvas` | `/components/workflow-canvas.tsx` | React Flow main canvas | 172 lines |
| `WorkflowNodes` | `/components/workflow-nodes.tsx` | 6 custom node types | 134 lines |
| `ConfigPanel` | `/components/config-panel.tsx` | Node configuration UI | 168 lines |

## UI Components (shadcn/ui)

### Form Components
- `Button` - Action buttons (variants: default, outline, ghost, destructive)
- `Input` - Text input fields
- `Textarea` - Multi-line text input
- `Checkbox` - Boolean selection
- `Radio Group` - Single selection from group
- `Switch` - Toggle switches
- `Select` - Dropdown selection
- `Form` - Form wrapper with react-hook-form

### Data Display
- `Table` - Data tables with sorting
- `Badge` - Status and category labels
- `Card` - Container component
- `Tabs` - Tabbed interface

### Feedback
- `Dialog` - Modal dialogs
- `Toaster` - Toast notifications (via sonner)
- `Skeleton` - Loading placeholders
- `Spinner` - Loading indicator
- `Alert` - Alert boxes

### Navigation
- `Breadcrumb` - Navigation hierarchy
- `DropdownMenu` - Dropdown menus
- `Menubar` - Menu bar
- `Pagination` - Page navigation

### Layout
- `Resizable` - Resizable panels
- `ScrollArea` - Scrollable content area
- `Separator` - Visual divider
- `AspectRatio` - Aspect ratio box

### Media
- `Avatar` - User avatars
- `Image` - Next.js optimized images

## Component Usage Examples

### StatCard
```tsx
import { StatCard } from '@/components/stat-card'
import { Users } from 'lucide-react'

<StatCard
  icon={Users}
  label="Total Users"
  value="1,234"
  change="+12% this week"
  changeType="positive"
/>
```

### WorkflowCard
```tsx
import { WorkflowCard } from '@/components/workflow-card'
import { mockWorkflows } from '@/lib/mock-data'

<WorkflowCard workflow={mockWorkflows[0]} />
```

### ExecutionTable
```tsx
import { ExecutionTable } from '@/components/execution-table'
import { mockExecutions } from '@/lib/mock-data'

<ExecutionTable executions={mockExecutions} />
```

### ThemeToggle
```tsx
import { ThemeToggle } from '@/components/theme-toggle'

<ThemeToggle />
```

### WorkflowCanvas
```tsx
import { WorkflowCanvas } from '@/components/workflow-canvas'

<div className="h-screen">
  <WorkflowCanvas />
</div>
```

## Available Icons (from lucide-react)

### Workflow Icons
- `Workflow` - Main workflow icon
- `Zap` - Action/execution
- `Clock` - Delay/time
- `Webhook` - HTTP webhook
- `Database` - API/data

### UI Icons
- `Menu` - Hamburger menu
- `X` - Close button
- `ChevronLeft` - Back navigation
- `Settings` - Settings/configuration
- `Play` - Run/execute
- `Save` - Save action
- `Delete` - Delete action
- `Edit2` - Edit action
- `Copy` - Copy action
- `Trash2` - Delete button
- `MoreVertical` - More options
- `Search` - Search icon
- `Filter` - Filter icon
- `Plus` - Add button
- `GitBranch` - Condition/branching

### Status Icons
- `CheckCircle2` - Success status
- `AlertCircle` - Error status
- `Loader2` - Loading status
- `Clock` - Pending status

### Theme Icons
- `Sun` - Light mode
- `Moon` - Dark mode

## Reusable Patterns

### Dashboard Layout
```tsx
import { Sidebar } from '@/components/sidebar'

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  )
}
```

### Stats Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <StatCard ... />
  <StatCard ... />
  <StatCard ... />
  <StatCard ... />
</div>
```

### Filter Bar
```tsx
<div className="bg-card rounded-lg border border-border p-6 mb-6">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <Input placeholder="Search..." />
    <Select>...</Select>
    <Button>Filter</Button>
  </div>
</div>
```

### Card Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (
    <div key={item.id} className="bg-card rounded-lg border border-border p-6">
      {/* Card content */}
    </div>
  ))}
</div>
```

## Component Props Reference

### StatCard Props
```typescript
interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative'
}
```

### WorkflowCard Props
```typescript
interface WorkflowCardProps {
  workflow: Workflow
}
```

### ExecutionTable Props
```typescript
interface ExecutionTableProps {
  executions: WorkflowExecution[]
}
```

### ConfigPanel Props
```typescript
interface ConfigPanelProps {
  node: Node
  onDelete: () => void
  onChange: (node: Node) => void
}
```

## Styling System

### Color Classes
- `bg-background` - Main background
- `bg-card` - Card background
- `text-foreground` - Main text
- `text-muted-foreground` - Secondary text
- `border-border` - Borders
- `bg-primary` - Primary color (blue)
- `text-primary` - Primary text

### Spacing Classes
- `p-4` - Padding
- `gap-4` - Gap between items
- `mb-4` - Margin bottom
- `mt-4` - Margin top

### Responsive Classes
- `md:` - Medium screens (768px+)
- `lg:` - Large screens (1024px+)
- `hidden md:block` - Hide on mobile

### Flexbox Classes
- `flex` - Flex container
- `items-center` - Vertical centering
- `justify-between` - Space between
- `gap-4` - Spacing between items

## Adding New Components

### Step 1: Create Component File
```tsx
// components/my-component.tsx
import { Button } from '@/components/ui/button'

interface MyComponentProps {
  title: string
}

export function MyComponent({ title }: MyComponentProps) {
  return <div>{title}</div>
}
```

### Step 2: Use in Page
```tsx
import { MyComponent } from '@/components/my-component'

export default function MyPage() {
  return <MyComponent title="Hello" />
}
```

## Component Best Practices

1. **Keep Components Small**: Single responsibility principle
2. **Use Props**: Pass data via props, not context (when possible)
3. **Type Everything**: Full TypeScript coverage
4. **Extract Logic**: Use custom hooks for complex logic
5. **Semantic HTML**: Use proper HTML elements
6. **Accessibility**: Add ARIA labels where needed
7. **Mobile First**: Style mobile, then enhance with md:/lg: prefixes

## Importing Components

### From Custom Components
```tsx
import { Sidebar } from '@/components/sidebar'
import { StatCard } from '@/components/stat-card'
```

### From shadcn/ui
```tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
```

### From Icons
```tsx
import { Zap, Settings, Menu } from 'lucide-react'
```

## Common Component Combinations

### Workflow Card + Stats
Used in dashboard to show workflow list with performance metrics

### Execution Table + Filters
Used in executions page to display and filter logs

### Stat Cards Grid
Used in dashboard to show key metrics

### Integration Grid
Used in integrations page to display available apps

### Workflow Builder Canvas
Used in workflow editor for visual workflow design

---

**Total Components**: 70+ (20 custom + 50 shadcn/ui)
**Last Updated**: March 2024
