# Quick Reference Guide

## URL Routes

### Public Pages
- `/` - Landing page with pricing
- `/auth/login` - Sign in
- `/auth/signup` - Sign up

### Dashboard Pages (Protected by layout)
- `/dashboard` - Main overview
- `/dashboard/executions` - View execution logs
- `/dashboard/integrations` - Browse integrations
- `/dashboard/templates` - Pre-built templates
- `/dashboard/api-keys` - Manage API keys
- `/dashboard/settings` - Settings and preferences

### Workflow Pages
- `/workflow/1` - Edit workflow "Slack Notification on New Email"

---

## Key Components to Understand

### Sidebar (`components/sidebar.tsx`)
- Mobile responsive (hamburger menu < 1024px)
- Active route highlighting
- Theme toggle integrated
- Links to all dashboard pages

### WorkflowCanvas (`components/workflow-canvas.tsx`)
- React Flow editor
- 6 node types available
- Add nodes button for each type
- Configuration panel on right

### ConfigPanel (`components/config-panel.tsx`)
- Shows when node is selected
- Edit label and description
- Save changes back to canvas

### Mock Data (`lib/mock-data.ts`)
- `mockWorkflows` - 6 workflows
- `mockExecutions` - 8 execution records
- `mockIntegrations` - 8 integrations
- `mockTemplates` - 8 templates
- All properly typed with interfaces from `lib/types.ts`

---

## Styling System

### Design Tokens (in `app/globals.css`)
- `--primary`: #3b82f6 (blue)
- `--background`: #0f0f0f (dark) / #ffffff (light)
- `--card`: #1a1a1a (dark) / #f8f8f8 (light)
- `--border`: #2a2a2a (dark) / #e5e7eb (light)
- All others follow similar pattern

### Theme Mode
- Default: Dark mode
- Toggle: Click sun/moon icon in nav or sidebar
- Persistence: Saved to localStorage via next-themes

### Responsive Breakpoints
- Mobile: < 768px (md: prefix in Tailwind)
- Tablet: 768px - 1024px
- Desktop: > 1024px (lg: prefix in Tailwind)

---

## Adding New Pages

1. Create folder under `app/dashboard/`
2. Create `page.tsx` inside
3. Use same layout pattern as existing pages
4. Add import and link in `components/sidebar.tsx`

Example:
```tsx
export default function NewPage() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Your content */}
      </div>
    </div>
  )
}
```

---

## Adding New Integrations/Workflows

Edit `lib/mock-data.ts` and add to appropriate array:

```tsx
// Add to mockIntegrations
{
  id: 'new-app',
  name: 'New App',
  description: 'Description here',
  icon: '🎯',
  category: 'Category',
  connected: false,
}
```

---

## Modifying Node Types

Edit `components/workflow-nodes.tsx`:

1. Create new component (e.g., `CustomNode`)
2. Add to `nodeTypes` export
3. Add button in `workflow-canvas.tsx` to create that type

---

## Theme Colors Reference

Available token names (use in className):
- `bg-background` / `bg-card` / `bg-primary`
- `text-foreground` / `text-muted-foreground`
- `border-border` / `border-primary`
- `hover:bg-primary/10` (10% opacity)

---

## Common Tasks

### Search Implementation
Already done in: integrations, templates, executions pages
Pattern: useState filter + array.filter()

### Modal/Dialog
Import from `@/components/ui/dialog`
Example: See settings page for tabs implementation

### Table
Import from `@/components/ui/table`
Example: execution-table.tsx has full implementation

### Dark Mode Support
Use `dark:` prefix: `bg-white dark:bg-black`
All defaults set in globals.css tokens

---

## Debugging

### Console Errors
Check imports in specific page file first

### Component not rendering
Verify mock data is exported from lib/mock-data.ts

### Styling not applying
Check if dark mode is enabled (should be default)
Verify class names are spelled correctly

### Theme toggle not working
Check ThemeProvider is in layout.tsx
Verify next-themes is installed in package.json

---

## Performance Tips

- Mock data is already optimized
- Components are split properly
- No unnecessary re-renders
- Styles are scoped to components

---

## Next Steps

1. **Test everything** - Click through all pages, use search/filters
2. **Try the editor** - Add/remove nodes, configure them
3. **Deploy** - Click Publish button
4. **Customize** - Change colors, add more mock data, add pages

That's it! You have a complete SaaS platform ready to go.
