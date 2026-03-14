# Setup Guide - SaaS Workflow Automation Platform

## Quick Start

### Prerequisites
- Node.js 18+ installed
- pnpm package manager (recommended)

### Installation Steps

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Start Development Server**
   ```bash
   pnpm dev
   ```

3. **Open in Browser**
   - Navigate to `http://localhost:3000`

## What's Included

### Pages Available

**Public Pages:**
- `/` - Landing page with features, pricing, and integrations
- `/auth/login` - Login page with email/OAuth options
- `/auth/signup` - Registration page

**Dashboard Pages (after login):**
- `/dashboard` - Main dashboard with workflow overview
- `/dashboard/executions` - Execution logs with filtering
- `/dashboard/integrations` - Integration marketplace
- `/dashboard/templates` - Workflow templates gallery
- `/dashboard/api-keys` - API key management
- `/dashboard/settings` - Account and system settings

**Workflow Builder:**
- `/workflow/[id]` - Visual workflow builder with React Flow

## Project Features

### Dark/Light Mode
- Toggle available in top navigation and sidebar
- Persists across sessions via next-themes
- Design tokens for easy customization

### Responsive Design
- Mobile menu (hamburger) on screens < 1024px
- Tablet-optimized layouts
- Desktop full-feature interface

### Mock Data
All pages use comprehensive mock data:
- 6 sample workflows
- 8 execution records
- 8+ integration apps
- 8 workflow templates
- Dashboard statistics

## Customization

### Colors
Edit design tokens in `app/globals.css`:
```css
:root {
  --primary: #3b82f6; /* Change primary color */
  --background: #ffffff; /* Change background */
}

.dark {
  --primary: #3b82f6;
  --background: #0f0f0f;
}
```

### Fonts
Fonts are defined in `app/layout.tsx`:
```typescript
import { Geist, Geist_Mono } from 'next/font/google'

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
```

### Add New Components
Use shadcn/ui CLI:
```bash
npx shadcn-ui@latest add button
```

## Building for Production

1. **Build the project:**
   ```bash
   pnpm build
   ```

2. **Start production server:**
   ```bash
   pnpm start
   ```

## Workflow Builder Usage

The workflow builder at `/workflow/1` includes:

### Node Types
- **Trigger** (Blue): Start of workflow - e.g., "On New Email"
- **Action** (Blue): Execute action - e.g., "Send Slack Message"
- **Condition** (Yellow): Branch logic - e.g., "If amount > 1000"
- **Delay** (Purple): Pause workflow - e.g., "Wait 5 minutes"
- **Webhook** (Green): HTTP callback - e.g., "POST to URL"
- **API Request** (Orange): Make API call - e.g., "Call Stripe API"

### How to Use
1. Click node types on right sidebar to add nodes
2. Click and drag nodes to position them
3. Connect nodes by dragging from handles
4. Select a node to edit configuration
5. Click "Save Changes" to update
6. Click "Delete Node" to remove

## File Organization

```
Key Directories:
- /app - All pages and routes
- /components - Reusable components
- /lib - Types, mock data, utilities
- /public - Static assets
```

## Dependencies Overview

### Core
- `next` - React framework
- `react` & `react-dom` - UI library
- `typescript` - Type safety

### UI/Components
- `shadcn/ui` - Component library
- `lucide-react` - Icons
- `tailwindcss` - Styling

### Functionality
- `reactflow` - Workflow builder
- `next-themes` - Theme management
- `react-hook-form` - Form handling
- `zod` - Validation
- `date-fns` - Date utilities

## Troubleshooting

### Styles not loading?
- Clear `.next` folder: `rm -rf .next`
- Restart dev server: `pnpm dev`

### Components missing?
- Install shadcn component: `npx shadcn-ui@latest add [component]`

### Port already in use?
- Change port: `pnpm dev -- -p 3001`

## Next Steps

1. **Add Backend Integration**: Connect to a real database (Supabase/Neon)
2. **Implement Authentication**: Use Auth.js or similar
3. **Real Workflow Engine**: Replace mock executions with real job queue
4. **API Development**: Build REST/GraphQL API
5. **Testing**: Add unit and integration tests
6. **Deployment**: Deploy to Vercel, AWS, or other platforms

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Flow Docs](https://reactflow.dev)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

## Support

For issues or questions:
1. Check the PROJECT_OVERVIEW.md for detailed architecture
2. Review component documentation in component files
3. Check Next.js and React Flow documentation
