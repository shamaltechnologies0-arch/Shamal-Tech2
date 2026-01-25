# UI Implementation Rules

You are an expert UI developer working with ShadCN UI components and Tailwind CSS. When implementing UI features, follow these rules strictly.

## Core Principle: ShadCN First

**ALWAYS check for existing ShadCN components before implementing custom solutions.**

## Available ShadCN Components

All ShadCN components are documented at: **https://ui.shadcn.com/docs/components**

### Complete Component List

The following components are available from ShadCN UI. Always check this list before creating custom components:

- **Accordion** - Collapsible content sections
- **Alert Dialog** - Modal dialogs for confirmations
- **Alert** - Alert/notification components
- **Aspect Ratio** - Maintain aspect ratios
- **Avatar** - User avatar components
- **Badge** - Badge/label components
- **Breadcrumb** - Breadcrumb navigation
- **Button Group** - Grouped button components
- **Button** - Button components with variants
- **Calendar** - Date picker calendar
- **Card** - Card container components
- **Carousel** - Carousel/slider components
- **Chart** - Chart components
- **Checkbox** - Checkbox input components
- **Collapsible** - Collapsible content
- **Combobox** - Autocomplete combobox
- **Command** - Command palette component
- **Context Menu** - Right-click context menus
- **Data Table** - Advanced data tables
- **Date Picker** - Date picker component
- **Dialog** - Modal dialog components
- **Drawer** - Drawer/sheet components
- **Dropdown Menu** - Dropdown menu components
- **Empty** - Empty state components
- **Field** - Form field wrapper
- **Form** - Form components with validation
- **Hover Card** - Hover card tooltips
- **Input Group** - Input with addons
- **Input OTP** - OTP input component
- **Input** - Text input components
- **Item** - List item component
- **Kbd** - Keyboard key display
- **Label** - Form label components
- **Menubar** - Menu bar component
- **Native Select** - Native select dropdown
- **Navigation Menu** - Navigation menu component
- **Pagination** - Pagination components
- **Popover** - Popover components
- **Progress** - Progress bar components
- **Radio Group** - Radio button groups
- **Resizable** - Resizable panels
- **Scroll Area** - Custom scroll areas
- **Select** - Select dropdown components
- **Separator** - Divider/separator components
- **Sheet** - Sheet/sidebar components
- **Sidebar** - Sidebar navigation
- **Skeleton** - Loading skeleton components
- **Slider** - Range slider components
- **Sonner** - Toast notification system
- **Spinner** - Loading spinner
- **Switch** - Toggle switch components
- **Table** - Table components
- **Tabs** - Tab navigation components
- **Textarea** - Textarea input components
- **Toast** - Toast notification components
- **Toggle Group** - Toggle button groups
- **Toggle** - Toggle button component
- **Tooltip** - Tooltip components
- **Typography** - Typography components

### Currently Installed Components

Check `src/components/ui/` to see which components are currently installed in this project. If a component you need isn't installed, install it using:

```bash
npx shadcn@latest add [component-name]
```

**Reference the official docs for installation and usage:** https://ui.shadcn.com/docs/components

### Component Discovery Process

Before implementing any UI feature:

1. **Check the component list above** - Verify if a ShadCN component exists for your use case
2. **Check `src/components/ui/`** - See if the component is already installed
3. **Check ShadCN documentation** - Visit https://ui.shadcn.com/docs/components for:
   - Component API and props
   - Usage examples
   - Installation instructions
   - Variants and customization options
4. **Install if needed** - If a ShadCN component exists but isn't installed:
   ```bash
   npx shadcn@latest add [component-name]
   ```
5. **Custom only as last resort** - Only create custom components if:
   - No ShadCN component exists for the use case
   - The ShadCN component cannot be extended/modified to meet requirements
   - The requirement is highly project-specific

## Component Usage

**Always refer to the official ShadCN documentation for component usage:**

- **Components**: https://ui.shadcn.com/docs/components
- **Forms**: https://ui.shadcn.com/docs/forms/react-hook-form
- **Theming**: https://ui.shadcn.com/docs/theming

### Import Pattern

```tsx
// ✅ CORRECT: Import from @/components/ui
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

// ❌ WRONG: Don't create custom versions
import { CustomButton } from '@/components/CustomButton'
```

**For detailed usage, variants, props, and examples, always check the component's documentation page.**

## Styling Guidelines

### Use Tailwind CSS Classes

- Always use Tailwind utility classes instead of inline styles
- Use responsive utilities (`md:`, `lg:`, etc.) for responsive design
- Reference Tailwind docs: https://tailwindcss.com/docs

### Use `cn()` Utility for Conditional Classes

The project has a `cn()` utility in `src/utilities/ui.ts` for merging Tailwind classes:

```tsx
import { cn } from '@/utilities/ui'

// ✅ CORRECT: Use cn() for conditional classes
<Button className={cn('w-full', isActive && 'bg-primary')}>
  Click me
</Button>
```

### CSS Variables & Theming

The project uses CSS variables for theming. ShadCN components automatically use theme variables. For theming details, see: https://ui.shadcn.com/docs/theming

## Component Structure

### Server Components (Default)

This is a Next.js App Router project with React Server Components. Components are Server Components by default.

### Client Components

Only use `'use client'` when you need:
- State (useState, useReducer)
- Effects (useEffect)
- Event handlers (onClick, onChange)
- Browser APIs (localStorage, window)

## Forms

**For form implementation, refer to ShadCN Forms documentation:**
- React Hook Form: https://ui.shadcn.com/docs/forms/react-hook-form
- TanStack Form: https://ui.shadcn.com/docs/forms/tanstack-form

Use ShadCN form components: `Input`, `Label`, `Textarea`, `Select`, `Checkbox`, `Radio Group`, `Switch`, `Form`, `Field`, etc.

## Responsive Design

Use Tailwind responsive utilities (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) for responsive design. Reference: https://tailwindcss.com/docs/responsive-design

## Accessibility

ShadCN components are built on Radix UI primitives and include built-in accessibility features. Always add appropriate ARIA attributes when needed. Components handle keyboard navigation, focus management, and screen reader support automatically.

## Installing New ShadCN Components

When you need a component that isn't installed:

1. **Check the component list above** - Verify the component exists
2. **Check ShadCN docs** - https://ui.shadcn.com/docs/components for installation and usage
3. **Install using CLI**:
   ```bash
   npx shadcn@latest add [component-name]
   ```
4. **Verify installation** - Component should appear in `src/components/ui/`
5. **Reference docs** - Use the component's documentation page for usage examples

## Custom Components

### When to Create Custom Components

Only create custom components when:

1. **No ShadCN equivalent exists** - Check the component list and documentation first
2. **Highly project-specific** - Component is unique to this project
3. **Complex composition** - Multiple ShadCN components composed in a reusable way

### Custom Component Guidelines

If you must create a custom component:
- Always use ShadCN components as building blocks
- Use the `cn()` utility for class merging
- Follow the same patterns as ShadCN components
- Use TypeScript with proper typing
- Place in `src/components/` (not `src/components/ui/`)

## Project-Specific Patterns

### Component Location

- **ShadCN components**: `src/components/ui/`
- **Custom components**: `src/components/`
- **Page-specific components**: Co-located with pages or in `src/components/`

### Import Aliases

The project uses path aliases:
- `@/components` → `src/components`
- `@/utilities` → `src/utilities`

Always use path aliases for imports:
```tsx
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
```

## Checklist Before Implementing UI

Before writing any UI code, ask:

- [ ] Have I checked the component list above for a ShadCN component?
- [ ] Have I checked `src/components/ui/` for existing installed components?
- [ ] Have I checked ShadCN documentation (https://ui.shadcn.com/docs/components) for usage?
- [ ] Can I compose existing ShadCN components to achieve the design?
- [ ] Am I using Tailwind utility classes instead of custom CSS?
- [ ] Am I using the `cn()` utility for conditional classes?
- [ ] Is this a Server Component or does it need to be a Client Component?
- [ ] Have I considered accessibility requirements?
- [ ] Is the component responsive?

## Summary

1. **Always check the component list above and ShadCN docs first** - https://ui.shadcn.com/docs/components
2. **Install missing ShadCN components before creating custom ones**
3. **Reference official documentation for component usage, props, and examples**
4. **Use Tailwind CSS utility classes**
5. **Compose ShadCN components for complex UIs**
6. **Only create custom components as a last resort**
7. **Follow Server Component patterns (default)**
8. **Use `cn()` utility for conditional classes**
9. **Maintain accessibility standards**

## Key Resources

- **ShadCN Components**: https://ui.shadcn.com/docs/components
- **ShadCN Forms**: https://ui.shadcn.com/docs/forms/react-hook-form
- **ShadCN Theming**: https://ui.shadcn.com/docs/theming
- **Tailwind CSS**: https://tailwindcss.com/docs

**Remember: ShadCN First, Custom Last - Always reference the official documentation for implementation details.**

