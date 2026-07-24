# Specification 04: Frontend Design System & UI Architecture

## 1. Design Vision & Aesthetic Direction

Khazana AI is designed as a **futuristic, ultra-premium AI-native Enterprise Finance Operating System**. Inspired by the high-end editorial glassmorphism visual language of top design showcases (e.g. Behance Sui Brand Identity), the UI combines graphite dark aesthetics with subtle radial lighting, translucent floating cards, and micro-interactions.

---

## 2. Color Palette & Typography Tokens

### Color System (Tailwind CSS Tokens)

```css
:root {
  /* Dark Graphite Backgrounds */
  --bg-app: #09090B;          /* Very dark graphite background */
  --bg-surface: #18181B;      /* Card & panel surface background */
  --bg-surface-glass: rgba(24, 24, 27, 0.65); /* Translucent glass card */
  
  /* Borders & Dividers */
  --border-glass: rgba(255, 255, 255, 0.08); /* Thin translucent border */
  --border-glass-glow: rgba(56, 189, 248, 0.3); /* AI active border glow */

  /* Brand & Accent Colors */
  --primary: #2563EB;         /* Deep Vibrant Blue */
  --secondary: #7C3AED;       /* Imperial Purple */
  --ai-accent: #38BDF8;       /* Bright Sky Blue AI Accent */
  
  /* Status Colors */
  --success: #22C55E;         /* Emerald Green (Passed / Approved) */
  --warning: #F59E0B;         /* Amber (Flagged / Pending) */
  --danger: #EF4444;          /* Coral Red (Duplicate / Failed) */
  --muted: #71717A;           /* Muted Gray Text */
}
```

### Typography System
- **Font Family**: Inter, sans-serif (Google Fonts).
- **Headings**: `font-bold tracking-tight text-white`.
- **Numbers & Financial Figures**: `font-mono font-semibold` for tabular alignment of PKR values.

---

## 3. UI Component Hierarchy & Specifications

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx               # Main navigation sidebar with logo & user profile
│   │   ├── Navbar.tsx                # Top navigation with global search & notification bell
│   │   └── MainLayout.tsx            # Shell container layout
│   ├── dashboard/
│   │   ├── KPICard.tsx               # Metric cards (Spend, Compliance, Savings)
│   │   ├── ExpenseTrendChart.tsx     # Recharts Area & Bar chart for monthly PKR spend
│   │   ├── ExecutiveSummaryCard.tsx  # Markdown AI Executive summary viewer with export buttons
│   │   └── CategoryBreakdownPie.tsx # Category allocation pie chart
│   ├── upload/
│   │   ├── Dropzone.tsx              # Drag & drop PDF/image uploader
│   │   ├── ProcessingPipeline.tsx    # Multi-step animated AI pipeline indicator
│   │   └── UploadedInvoicesTable.tsx # Staged files queue table
│   ├── agents/
│   │   ├── AgentCanvas.tsx           # Framer motion interactive node graph
│   │   ├── AgentCard.tsx             # Glass card for individual agents
│   │   └── AgentDrawer.tsx           # Slide-over drawer with prompt & tool logs
│   ├── audit/
│   │   ├── AuditLogsTable.tsx        # Filterable compliance log table
│   │   └── RuleViolationBadge.tsx    # Color-coded risk badge
│   ├── chat/
│   │   ├── ChatContainer.tsx         # ChatGPT-style conversation view
│   │   ├── ChatBubble.tsx            # Streaming Markdown response bubble
│   │   └── SuggestedPrompts.tsx      # One-click prompt chip buttons
│   └── ui/                           # Reusable Radix UI & Shadcn primitives
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── drawer.tsx
│       ├── table.tsx
│       └── badge.tsx
```

---

## 4. Key Page Layouts

### Page 1: Dashboard (`/`)
- **Header**: Welcoming heading ("Khazana AI — Sovereign Finance OS") + Time/Period selector.
- **Top Row**: 6 KPI Glass Cards (`Invoices Processed`, `Compliance Score`, `Monthly Spend (PKR)`, `Duplicates Blocked`, `Policy Violations`, `Savings (PKR)`).
- **Middle Section**:
  - Left (60% width): Monthly Spending & Department Recharts bar chart.
  - Right (40% width): AI Executive Summary Card (Markdown view + PDF/CSV export).
- **Bottom Section**: Recent Invoices table with quick-view drawer.

### Page 2: Upload Invoices (`/upload`)
- **Top Section**: Hero banner explaining multi-agent OCR capabilities.
- **Center**: Large animated Drag & Drop file dropzone with pulse glow on drag over.
- **Below Dropzone**: Real-time progress bar and step-by-step agent workflow progress indicator (`Upload` ➔ `OCR` ➔ `Tax Extraction` ➔ `Duplicate Check` ➔ `Done`).

### Page 3: AI Agents Showcase (`/agents`)
- **Top Bar**: System status ("5 Agents Online — Multi-Agent SDK Connected").
- **Canvas View**: Animated workflow diagram showing data flow between Supervisor and specialized worker agents.
- **Agent Grid**: 5 large glass cards displaying metrics: Latency, Confidence %, Memory, and Current Task.
- **Drawer**: Slide-over panel displaying prompt instructions, SQL executions, raw JSON outputs, and reasoning steps.

### Page 4: Audit Logs (`/audit`)
- **Filter Bar**: Search input + Risk dropdown filter + Date picker.
- **Audit Data Table**: Built with TanStack Table / Shadcn Table. Features expandable rows revealing detailed JSON diffs, FBR tax violations, and timestamped events.

### Page 5: AI Copilot Chat (`/chat`)
- **Layout**: Centered conversational feed + bottom sticky input box.
- **Prompts Chips**: Horizontal scrollable list of pre-configured finance queries.
- **Markdown & Tables**: Full rendering of markdown responses, interactive tables, and PKR currency badges.

---

## 5. Animation Protocols (Framer Motion)

1. **Staggered Card Entrances**:
   ```tsx
   const containerVariants = {
     hidden: { opacity: 0 },
     show: { opacity: 1, transition: { staggerChildren: 0.1 } }
   };
   ```
2. **Hover Card Lift & Glow Effect**:
   ```tsx
   <motion.div
     whileHover={{ y: -4, borderColor: "rgba(56, 189, 248, 0.4)" }}
     transition={{ duration: 0.2 }}
     className="glass-card"
   >
   ```
3. **Smooth Slide-over Drawers**:
   - Radial backdrop blur (`backdrop-blur-md`).
   - Smooth spring transition (`type: "spring", damping: 25, stiffness: 200`).
