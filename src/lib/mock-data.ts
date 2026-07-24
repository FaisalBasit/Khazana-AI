export type InvoiceStatus = "processing" | "completed" | "flagged" | "pending";
export type Risk = "low" | "medium" | "high";

export interface Invoice {
  id: string;
  vendor: string;
  amount: number;
  currency: string;
  date: string;
  category: string;
  status: InvoiceStatus;
  risk: Risk;
  duplicate?: boolean;
}

const vendors = [
  "AWS", "Figma", "Notion", "Linear", "Vercel", "Slack", "GitHub", "Datadog",
  "Stripe", "OpenAI", "Anthropic", "Snowflake", "PagerDuty", "Zoom", "Loom",
  "Airtable", "1Password", "Cloudflare", "Segment", "Twilio", "Sendgrid",
  "MongoDB", "Retool", "Mixpanel", "Amplitude",
];
const categories = ["Software", "Cloud", "Marketing", "Travel", "Office", "Consulting", "Legal"];

function rand<T>(arr: T[], i: number) {
  return arr[i % arr.length];
}

export const invoices: Invoice[] = Array.from({ length: 50 }).map((_, i) => {
  const amount = Math.round((Math.random() * 12000 + 120) * 100) / 100;
  const statusPool: InvoiceStatus[] = ["completed", "completed", "completed", "processing", "flagged", "pending"];
  const riskPool: Risk[] = ["low", "low", "low", "medium", "high"];
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * 90));
  return {
    id: `INV-${(1000 + i).toString()}`,
    vendor: rand(vendors, i + Math.floor(Math.random() * 7)),
    amount,
    currency: "USD",
    date: d.toISOString().slice(0, 10),
    category: rand(categories, i),
    status: rand(statusPool, i + Math.floor(Math.random() * 3)),
    risk: rand(riskPool, i + Math.floor(Math.random() * 4)),
    duplicate: i % 17 === 0,
  };
});

export const kpis = [
  { label: "Invoices Processed", value: "1,284", delta: "+12.4%", trend: "up" as const },
  { label: "Compliance Score", value: "97.2%", delta: "+1.8%", trend: "up" as const },
  { label: "Monthly Expenses", value: "$482,910", delta: "-3.1%", trend: "down" as const },
  { label: "Cash Flow", value: "$1.24M", delta: "+8.7%", trend: "up" as const },
  { label: "Policy Violations", value: "7", delta: "-4", trend: "down" as const },
  { label: "Estimated Savings", value: "$38,420", delta: "+21%", trend: "up" as const },
];

export const monthlySpending = [
  { month: "Jan", spend: 312000, budget: 340000 },
  { month: "Feb", spend: 298000, budget: 340000 },
  { month: "Mar", spend: 361000, budget: 360000 },
  { month: "Apr", spend: 340000, budget: 360000 },
  { month: "May", spend: 402000, budget: 400000 },
  { month: "Jun", spend: 388000, budget: 400000 },
  { month: "Jul", spend: 482910, budget: 460000 },
];

export const categoryBreakdown = [
  { name: "Software", value: 128400 },
  { name: "Cloud", value: 184200 },
  { name: "Marketing", value: 62100 },
  { name: "Travel", value: 41800 },
  { name: "Office", value: 22800 },
  { name: "Consulting", value: 43610 },
];

export const cashFlow = Array.from({ length: 12 }).map((_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  inflow: 400000 + Math.round(Math.random() * 200000),
  outflow: 300000 + Math.round(Math.random() * 180000),
}));

export const complianceTrend = Array.from({ length: 8 }).map((_, i) => ({
  week: `W${i + 1}`,
  score: 90 + Math.round(Math.random() * 8),
}));

export const agents = [
  {
    id: "supervisor",
    name: "Supervisor Agent",
    role: "Orchestrates the finance workflow",
    status: "active" as const,
    confidence: 0.98,
    runtimeMs: 428,
    memoryMb: 142,
    task: "Coordinating 4 downstream agents on batch #A-2841",
    activity: [
      "Assigned 12 invoices to Invoice Agent",
      "Queued compliance review for 3 flagged items",
      "Synthesized report draft for CFO",
    ],
  },
  {
    id: "invoice",
    name: "Invoice Agent",
    role: "OCR and field extraction",
    status: "running" as const,
    confidence: 0.94,
    runtimeMs: 812,
    memoryMb: 268,
    task: "Extracting fields from invoice INV-1042 (AWS)",
    activity: [
      "Extracted vendor, tax id, line items",
      "Detected currency USD and totals",
      "Normalized vendor to canonical id",
    ],
  },
  {
    id: "expense",
    name: "Expense Agent",
    role: "Categorization and matching",
    status: "idle" as const,
    confidence: 0.91,
    runtimeMs: 214,
    memoryMb: 118,
    task: "Awaiting new categorized batches",
    activity: [
      "Categorized 42 invoices in last hour",
      "Matched 8 to open POs",
      "Flagged 2 for manual review",
    ],
  },
  {
    id: "compliance",
    name: "Compliance Agent",
    role: "Policy and fraud detection",
    status: "active" as const,
    confidence: 0.88,
    runtimeMs: 604,
    memoryMb: 196,
    task: "Reviewing potential duplicate INV-1017 vs INV-1029",
    activity: [
      "Detected 1 duplicate suspicion",
      "3 threshold violations logged",
      "Escalated to Supervisor",
    ],
  },
  {
    id: "reporting",
    name: "Reporting Agent",
    role: "Executive summaries and exports",
    status: "running" as const,
    confidence: 0.96,
    runtimeMs: 1120,
    memoryMb: 224,
    task: "Compiling monthly executive report for July",
    activity: [
      "Aggregated KPIs across 5 dimensions",
      "Drafted narrative with anomalies",
      "Prepared PDF and CSV exports",
    ],
  },
];

export const auditLogs = Array.from({ length: 32 }).map((_, i) => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - i * 27);
  const actions = [
    "OCR completed",
    "Category assigned",
    "Duplicate suspected",
    "Threshold exceeded",
    "Report exported",
    "Policy violation flagged",
    "Vendor normalized",
    "Approval routed",
  ];
  const status = ["success", "success", "warning", "success", "error"][i % 5];
  const risk: Risk = (["low", "low", "medium", "high"] as Risk[])[i % 4];
  return {
    id: `LOG-${9000 + i}`,
    ts: d.toISOString(),
    invoice: `INV-${1000 + (i % 50)}`,
    agent: ["Invoice", "Expense", "Compliance", "Reporting", "Supervisor"][i % 5] + " Agent",
    action: actions[i % actions.length],
    status,
    risk,
  };
});

export const execSummary = `## July 2026 Executive Summary

Overall financial health is **strong**. Compliance score climbed to **97.2%** (+1.8pp) as the Compliance Agent resolved 12 legacy exceptions.

**Highlights**
- Monthly spend of **$482,910** is 5% above budget, driven by a one-time Snowflake commitment.
- Estimated savings of **$38,420** from vendor consolidation and duplicate-invoice prevention.
- 7 policy violations remain open — all low-to-medium risk.

**Recommendations**
1. Renegotiate Datadog contract before October renewal.
2. Consolidate 3 overlapping analytics vendors into a single tier.
3. Enforce two-approver policy for expenses above $10K.
`;
