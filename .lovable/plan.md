

## Profit Calculator — Implementation Plan

### Pages & Routing
- Single-page app with two views using **HashRouter** (for GitHub Pages compatibility):
  - **Calculator** (`/`) — main input + results
  - **History** (`/history`) — saved jobs list with summary stats
- Bottom tab bar for navigation between Calculator and History

### Calculator Page (top to bottom)
1. **Header** with app name + "Try Demo" button
2. **Revenue input** — large, currency-formatted, always visible
3. **Collapsible cost sections** (all collapsed by default):
   - **Materials** — dynamic list of name+cost line items, add/remove, running subtotal
   - **Labor** — helpers count, hours, rate → auto-calculated subtotal
   - **Mileage** — miles input, editable rate (default $0.70), auto-calculated deduction
   - **Other expenses** — amount + optional note
4. **Your Time** — hours worked input
5. **Results card** — live-updating scoreboard:
   - Revenue, Total Costs, Net Profit (color-coded), Profit Margin with animated bar + icon, Effective Hourly Rate (largest/boldest number)
   - Color coding per spec (green >50%, amber 20-50%, red <20%, bold red if negative)
6. **Action buttons**: Save Job (with optional client name dialog), Clear, Share Summary (clipboard copy)

### History Page
- Summary banner: total revenue, total profit, avg margin, avg hourly rate
- List of saved jobs sorted by date (newest first), each showing client name, revenue, profit, margin
- Tap to reload into calculator; swipe/button to delete; "Clear All" option

### PWA Setup
- Install `vite-plugin-pwa` with `devOptions: { enabled: false }`, service worker for offline support
- Web manifest with standalone display, app icons, theme colors
- Guard against service worker registration in iframes/preview hosts

### Data Layer
- All state managed with React hooks
- localStorage for job history persistence
- No mock data on load — empty state with $0/0%/— in results
- "Try Demo" fills realistic scenario ($350 deep clean, $28 supplies, 15 miles, 4 hours)

### Design
- Mobile-first (375px primary), scales up for tablet/desktop
- Clean white background, card sections, Lucide icons
- 44px minimum touch targets
- shadcn/ui components (Input, Button, Card, Collapsible, Dialog, Tabs)
- Animated profit margin bar with framer-motion or CSS transitions

