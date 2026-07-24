# Specification 02: User Journeys & Workflows

## Overview of Core User Journeys

Khazana AI provides 6 distinct, seamlessly integrated user journeys designed for Pakistani Enterprise CFOs, Finance Managers, Accountants, and Auditors.

```
       [Journey 1: Document Upload & OCR]
                      │
                      ▼
       [Journey 2: Multi-Agent Orchestration]
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
[Journey 3: Expense Analysis] [Journey 4: Compliance & Audit]
        │                           │
        └─────────────┬─────────────┘
                      ▼
       [Journey 5: Executive Dashboard & Reports]
                      │
                      ▼
       [Journey 6: Interactive Copilot Chat]
```

---

## 🗺 Journey 1: Invoice Upload, OCR & Data Extraction

### User Story
> As a Finance Manager at a Pakistani manufacturing company, I want to batch-upload 50 invoices (PDFs and Scanned Images) so that the system automatically extracts fields, identifies local vendor NTN/STRN details, and formats accounting line items without manual data entry.

### Step-by-Step Flow

1. **Access Upload View**: User navigates to `/upload` or clicks "Upload Invoices" button on the Sidebar.
2. **Drag & Drop Action**: User drags a batch of PDF, PNG, or JPG invoice files into the animated upload dropzone.
3. **Client Pre-validation**:
   - Verify file types (`application/pdf`, `image/png`, `image/jpeg`).
   - Limit file size (< 25MB per file).
4. **Backend Upload Execution**:
   - Trigger `POST /api/v1/upload`.
   - Backend saves files to storage, creates `invoices` database records with status `Uploaded`.
   - UI presents a real-time table of uploaded files with thumbnail preview, file size, and upload progress indicator.
5. **Trigger Multi-Agent OCR Processing**:
   - User clicks **"Start AI Pipeline Processing"**.
   - Frontend invokes `POST /api/v1/process`.
   - Processing stepper animates live:
     `Upload Completed` ➔ `Docling OCR Running` ➔ `Field Extraction` ➔ `Duplicate Checking` ➔ `Completed`.

### State Diagram & API Contracts

```
[Idle / Empty Upload Zone]
        │ (File Selection)
        ▼
[Files Staged locally] ──(Validation Failed)──► [Toast Alert Error]
        │ (Validation Pass -> POST /upload)
        ▼
[Backend Saved -> Status: Uploaded]
        │ (User clicks "Start Pipeline" -> POST /process)
        ▼
[Status: Processing] ──(Progress Stepper Active)
        │
        ▼
[Status: Extracted] ──► [Redirect / Invoices Table]
```

### Pakistani Tax Field Extraction Checklist
The Invoice Agent extracts and validates the following fields:
- **Vendor NTN (National Tax Number)**: Regex `^[0-9]{7}-[0-9]{1}$`.
- **Vendor STRN (Sales Tax Registration Number)**: 13-digit numeric string.
- **Sales Tax Amount**: PRA (16%), SRB (13%), FBR General (18%).
- **Withholding Tax (WHT)**: Calculates applicable WHT under Income Tax Ordinance Section 153 based on vendor Filer/Non-Filer status.
- **Currency Conversion**: Converts USD/EUR/AED invoices to PKR using the day's exchange rate.

---

## 🗺 Journey 2: Multi-Agent Pipeline Orchestration

### User Story
> As a CFO, I want full transparency into how AI agents collaborate so that I can inspect agent reasoning, execution runtimes, tool calls, and confidence scores for audit compliance.

### Step-by-Step Flow

1. **Navigate to AI Agents Showcase**: User accesses `/agents`.
2. **Visual Workflow Canvas**: An animated workflow diagram displays the 5 agents:
   - **Supervisor Agent** (Central Node)
   - **Invoice Agent** (Input Branch)
   - **Expense Agent** (Analytics Branch)
   - **Compliance Agent** (Audit & Tax Branch)
   - **Reporting Agent** (Output Branch)
3. **Live Animated Connections**: Pulse lines between agent cards indicate active data passing.
4. **Agent Inspection Drawer**:
   - Clicking any Agent Card (e.g. `Compliance Agent`) opens a slide-over Drawer (`vaul` / Radix Dialog).
   - Drawer displays:
     - **Prompt Preview**: System prompt and contextual instructions.
     - **Reasoning Log**: Chain-of-thought summary.
     - **Tool Calls**: OCR tools, SQL query execution, duplicate checker invocation.
     - **Execution Metrics**: Confidence score (e.g. `98.7%`), Execution latency (`450ms`), Memory usage (`64MB`).
     - **Output Json Preview**: Pretty-printed JSON returned by the agent.

---

## 🗺 Journey 3: Expense Categorization & PKR Cost Optimization

### User Story
> As an Enterprise Accountant, I want invoices categorized automatically into departments (IT, Marketing, Operations, Payroll) and flagged for unusual spending spikes so that I can negotiate better local vendor contracts.

### Step-by-Step Flow

1. **Navigate to Expenses/Reports**: User selects "Expense Analysis" tab.
2. **Category Distribution**: View interactive Recharts Pie & Bar charts:
   - Top Category Spend (e.g., Software: PKR 15.0M, Hardware: PKR 12.0M).
   - Department Breakdown (IT, Operations, Marketing, HR).
3. **Anomaly & Savings Detection**:
   - Anomaly Alert cards highlight suspicious spending spikes (e.g., "Marketing travel expense increased by 42% compared to June").
   - **Cost Saving Cards**:
     - *Opportunity*: "Consolidate 4 separate cloud hosting subscriptions with local Karachi data centers."
     - *Potential Savings*: PKR 1,450,000 / year.
4. **Actioning Savings**: User clicks "Apply Recommendation" to generate vendor consolidation task.

---

## 🗺 Journey 4: Compliance Auditing & FBR Tax Rule Checks

### User Story
> As a Compliance Auditor, I want automated verification of Pakistani tax laws, duplicate payment prevention, and spending limit enforcement so that the company avoids FBR penalties and non-filer tax surcharges.

### Step-by-Step Flow

1. **Access Audit Logs**: User opens `/audit`.
2. **Search & Filter Table**: Filter logs by:
   - Risk Level (`Critical`, `High`, `Medium`, `Low`).
   - Action / Violation (`Missing NTN`, `Duplicate Invoice Number`, `Non-Filer Surcharge`, `Over PKR 500k Limit`).
   - Date range.
3. **Rule Enforcement Checks**:
   - **Check 1: Duplicate Invoice Detection**: Flags duplicate invoice numbers from the same vendor within 90 days.
   - **Check 2: FBR NTN / STRN Verification**: Flags invoices from vendors missing valid tax registration numbers.
   - **Check 3: Approval Threshold Check**: Invoices exceeding PKR 500,000 require CFO dual-approval.
   - **Check 4: Non-Filer Tax Alert**: Penalizes non-filer vendors with double withholding tax rates (9% instead of 4.5%).
4. **Interactive Row Expansion**: Clicking an audit row reveals exact diffs, JSON payload logs, and timestamped history:
   `Uploaded` ➔ `OCR Extracted` ➔ `NTN Flagged` ➔ `Sent for Dual Approval`.

---

## 🗺 Journey 5: Executive Dashboard & Multi-Format Export

### User Story
> As a CFO preparing for a board meeting, I want an AI-generated Executive Summary and instant P&L / Cash Flow summaries so that I can export audit-ready PDF/CSV reports in one click.

### Step-by-Step Flow

1. **Access Dashboard**: User opens `/` (Dashboard).
2. **KPI Highlights Cards**:
   - Total Invoices Processed (e.g. `50`).
   - Compliance Score (e.g. `92.5%`).
   - Monthly Spend (e.g. `PKR 48.2M`).
   - Duplicate Invoices Prevented (e.g. `3`).
   - Total Estimated Savings (e.g. `PKR 1.45M`).
3. **AI Executive Summary Card**:
   - Formatted in clean Markdown with key bullets.
   - Quick action buttons: **[Export PDF]**, **[Download CSV]**, **[Share Summary]**.
4. **Export Action**:
   - Clicking **Export PDF** triggers backend print-styled PDF document stream generation.
   - Clicking **Download CSV** downloads raw sanitized financial audit records.

---

## 🗺 Journey 6: Conversational AI Copilot Chat

### User Story
> As a CFO, I want to chat with the multi-agent copilot in natural language to query complex financial data, explain tax anomalies, or retrieve duplicate invoices instantly.

### Step-by-Step Flow

1. **Access AI Copilot**: User navigates to `/chat`.
2. **Suggested Prompt Cards**:
   - *"Show all duplicate invoices detected in July 2026."*
   - *"Explain policy violations for non-filer vendors."*
   - *"Summarize IT infrastructure spend in PKR."*
   - *"Calculate withholding tax savings for this quarter."*
3. **Conversational Stream**:
   - User submits prompt.
   - Markdown response streams with rich tables, formatted PKR currency badges, and clickable reference buttons (`[View Invoice #INV-9901]`).
4. **Deep Linking**: Clicking an invoice tag inside chat opens the corresponding document drawer.
