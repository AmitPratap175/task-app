# Design Guidelines: Student Exam Prep Task Manager

## Design Approach

**Selected System:** Hybrid approach inspired by Linear + Notion
- **Linear:** Clean typography, subtle animations, focused interface, excellent task management patterns
- **Notion:** Flexible layouts, clear hierarchy, comfortable information density
- **Justification:** Productivity tools require clarity, speed, and minimal cognitive load. Students need focus-conducive interfaces that reduce friction.

## Core Design Principles

1. **Focus-First:** Minimize visual noise, maximize clarity
2. **Information Hierarchy:** Clear distinction between primary actions and supporting content
3. **Performance Feedback:** Immediate visual confirmation of actions
4. **Consistency:** Predictable patterns across all views

## Color Palette

### Dark Mode (Primary)
- **Background Base:** 222 15% 8% (rich dark, not pure black)
- **Surface:** 222 13% 11% (cards, panels)
- **Surface Elevated:** 222 12% 14% (modals, dropdowns)
- **Border Subtle:** 222 10% 18%
- **Border Default:** 222 8% 24%

### Light Mode
- **Background Base:** 0 0% 98%
- **Surface:** 0 0% 100%
- **Surface Elevated:** 0 0% 100% (with shadow)
- **Border Subtle:** 220 13% 91%
- **Border Default:** 220 13% 85%

### Semantic Colors
- **Primary (Focus/Action):** 250 95% 65% (vibrant purple-blue for CTAs, active states)
- **Success (Completed):** 142 76% 45%
- **Warning (Due Soon):** 38 92% 50%
- **Danger (Overdue):** 0 84% 60%
- **Text Primary:** 222 10% 95% (dark mode) / 222 15% 15% (light mode)
- **Text Secondary:** 222 8% 65% (dark mode) / 222 10% 45% (light mode)
- **Text Tertiary:** 222 6% 45% (dark mode) / 222 8% 60% (light mode)

### Subject Color Coding
- **Math:** 210 100% 60%
- **Science:** 160 80% 50%
- **Language:** 280 70% 60%
- **History:** 30 90% 55%
- **Other:** 0 0% 50%

## Typography

**Font Family:**
- Primary: 'Inter', system-ui, sans-serif (Google Fonts)
- Monospace: 'JetBrains Mono', monospace (for timers, stats)

**Scale:**
- Hero/Dashboard Title: text-4xl font-bold (36px)
- Section Headers: text-2xl font-semibold (24px)
- Card Titles: text-lg font-medium (18px)
- Body: text-base (16px)
- Small/Meta: text-sm (14px)
- Micro/Labels: text-xs (12px)

**Line Heights:**
- Headings: leading-tight (1.25)
- Body: leading-normal (1.5)
- Compact UI: leading-snug (1.375)

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 20
- Micro spacing: p-2, gap-2 (8px)
- Standard spacing: p-4, gap-4 (16px)
- Section spacing: p-6, gap-6 (24px)
- Component spacing: p-8, gap-8 (32px)
- Major sections: py-12, py-16 (48-64px)

**Grid System:**
- Dashboard: 12-column responsive grid
- Sidebar: Fixed 280px (collapsed: 64px)
- Main content: max-w-7xl with responsive padding
- Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

**Responsive Breakpoints:**
- Mobile: base (< 640px)
- Tablet: md (≥ 768px)
- Desktop: lg (≥ 1024px)
- Wide: xl (≥ 1280px)

## Component Library

### Navigation
- **Sidebar:** Fixed left, collapsible, icon + label navigation
- **Top Bar:** Breadcrumbs, search, quick actions, profile menu
- **Active States:** Subtle background + accent border-left-4

### Task Cards
- **Default:** Rounded corners (rounded-lg), subtle shadow, hover lift effect
- **Checkbox:** Large (20px), custom styling with smooth transitions
- **Priority Badge:** Small, rounded-full, positioned top-right
- **Tags:** Pill-shaped, subject-colored backgrounds at 20% opacity

### Forms & Inputs
- **Text Inputs:** border-2, focus:border-primary, consistent dark mode backgrounds
- **Buttons Primary:** bg-primary, rounded-lg, px-6 py-3, font-medium
- **Buttons Secondary:** border-2 border-current, transparent background
- **Icon Buttons:** p-2, rounded-md, hover:bg-surface

### Data Displays
- **Progress Rings:** SVG-based circular progress (120px diameter)
- **Charts:** Clean line/bar charts with subtle gridlines
- **Stats Cards:** Large number (text-3xl font-bold) + label below
- **Time Display:** Monospace font, large (text-5xl for timer)

### Pomodoro Timer
- **Center Stage:** Circular timer (240px) with progress ring
- **Control Buttons:** Icon buttons below timer
- **Session Indicator:** Small dots showing completed/remaining sessions
- **Sound Toggle:** Top-right corner icon

### Calendar/Schedule
- **Time Block View:** Hour-based grid with color-coded blocks
- **Mini Calendar:** Compact month view with dots for scheduled days
- **Drag Handles:** Subtle resize indicators on hover

### Analytics Dashboard
- **Chart Cards:** White/surface background, rounded-xl, p-6
- **Legend:** Horizontal below charts with colored dots
- **Tooltips:** Dark overlay with white text, arrow pointer

## Overlays & Modals

- **Modal Background:** backdrop-blur-sm bg-black/50
- **Modal Content:** max-w-2xl, rounded-xl, shadow-2xl
- **Toast Notifications:** Bottom-right, slide-in animation, auto-dismiss 4s
- **Dropdown Menus:** Minimal shadow, rounded-lg, py-2

## Animations

**Minimal & Purposeful Only:**
- Task completion: Subtle fade + slide out (200ms)
- Modal entry: Scale from 0.95 to 1 + fade (150ms)
- Hover states: opacity/shadow transitions (100ms)
- Progress updates: Smooth value changes (300ms ease-out)

**No:**
- Page transitions
- Gratuitous micro-interactions
- Loading spinners (use skeleton states)

## Icons

**Library:** Heroicons (outline for inactive, solid for active states)
- Navigation: 24px
- Cards/UI: 20px
- Inline: 16px
- Use consistent stroke-width across the app

## Images

**Dashboard Hero:** No large hero image - focus on productivity data
**Onboarding:** Welcome screen may include subtle illustration (400x300px) showing study workflow
**Empty States:** Simple line illustrations for "no tasks" states (200x200px)
**Profile:** User avatar (40px rounded-full) in top bar

## Visual Hierarchy

1. **Primary Actions:** Bright primary color, prominent placement
2. **Content:** High contrast text on appropriate backgrounds
3. **Metadata:** Muted text-secondary, smaller font
4. **Borders:** Subtle, used sparingly for separation
5. **Shadows:** Minimal elevation (shadow-sm default, shadow-lg for modals)

## Accessibility

- Maintain WCAG AA contrast ratios (4.5:1 minimum)
- Focus indicators: 2px offset ring in primary color
- Keyboard navigation: visible focus states on all interactive elements
- Screen reader labels: aria-label for icon-only buttons
- Color is never the only differentiator (use icons + text)