# Specification 01: Architecture & Data Model

## 1. System Architecture Diagram

```
                                 ┌─────────────────────────┐
                                 │     React Frontend      │
                                 │  (TanStack Query / UI)  │
                                 └────────────┬────────────┘
                                              │ HTTP / JSON API
                                              ▼
                                 ┌─────────────────────────┐
                                 │  Backend API Gateway    │
                                 │  (FastAPI / Express)    │
                                 └────────────┬────────────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    │                         │                         │
                    ▼                         ▼                         ▼
          ┌───────────────────┐     ┌───────────────────┐     ┌───────────────────┐
          │  Relational DB    │     │ Local Storage /   │     │  AI Multi-Agent   │
          │ (SQLite / Postgres)│    │ File Blob Store   │     │ Orchestrator SDK  │
          └───────────────────┘     └───────────────────┘     └─────────┬─────────┘
                                                                        │
                                       ┌────────────────────────────────┼────────────────────────────────┐
                                       │                                │                                │
                                       ▼                                ▼                                ▼
                            ┌────────────────────┐            ┌────────────────────┐           ┌────────────────────┐
                            │   Invoice Agent    │            │   Expense Agent    │           │  Compliance Agent  │
                            └────────────────────┘            └────────────────────┘           └────────────────────┘
```

---

## 2. Relational Database Schema (SQL)

The database serves as the **Single Source of Truth** for all processed financial documents, vendor records, compliance flags, agent execution logs, and executive reporting metrics.

```sql
-- 1. Users Table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    company_name TEXT NOT NULL,
    ntn_number TEXT, -- Pakistani National Tax Number (e.g. 1234567-8)
    role TEXT DEFAULT 'Finance Manager',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Vendors Table (Pakistani B2B Enterprise Context)
CREATE TABLE vendors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    ntn_number TEXT, -- Pakistani NTN
    strn_number TEXT, -- Sales Tax Registration Number
    city TEXT DEFAULT 'Karachi', -- Karachi, Lahore, Islamabad, etc.
    tax_category TEXT DEFAULT 'Filer', -- Filer / Non-Filer
    wht_rate DECIMAL(5,2) DEFAULT 4.5, -- Withholding Tax Rate (%)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Invoices Table
CREATE TABLE invoices (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    vendor_id TEXT REFERENCES vendors(id),
    invoice_number TEXT NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    currency TEXT DEFAULT 'PKR', -- Default PKR, foreign currencies converted
    exchange_rate DECIMAL(10,4) DEFAULT 1.0,
    subtotal DECIMAL(14,2) NOT NULL,
    sales_tax_amount DECIMAL(14,2) DEFAULT 0.0, -- FBR/PRA/SRB Tax
    wht_deducted DECIMAL(14,2) DEFAULT 0.0,
    total_amount DECIMAL(14,2) NOT NULL,
    status TEXT CHECK(status IN ('Uploaded', 'Processing', 'Extracted', 'Flagged', 'Approved', 'Paid')) DEFAULT 'Uploaded',
    is_duplicate BOOLEAN DEFAULT FALSE,
    duplicate_of_id TEXT REFERENCES invoices(id),
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL, -- PDF, PNG, JPG
    ocr_confidence DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Invoice Line Items Table
CREATE TABLE invoice_items (
    id TEXT PRIMARY KEY,
    invoice_id TEXT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(14,2) NOT NULL,
    total_price DECIMAL(14,2) NOT NULL,
    category TEXT DEFAULT 'Miscellaneous'
);

-- 5. Expense Categories & Analytics Table
CREATE TABLE expenses (
    id TEXT PRIMARY KEY,
    invoice_id TEXT REFERENCES invoices(id),
    category TEXT NOT NULL, -- Travel, Marketing, Software, Hardware, Payroll, Utilities, Office Supplies, Miscellaneous
    department TEXT NOT NULL, -- Finance, IT, Operations, Sales, HR
    amount_pkr DECIMAL(14,2) NOT NULL,
    is_anomaly BOOLEAN DEFAULT FALSE,
    anomaly_reason TEXT,
    saving_recommendation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Compliance Audits & Rule Violations Table
CREATE TABLE compliance_checks (
    id TEXT PRIMARY KEY,
    invoice_id TEXT NOT NULL REFERENCES invoices(id),
    rule_name TEXT NOT NULL, -- e.g. "Missing NTN Number", "Duplicate Invoice", "High Value Approval (> PKR 500,000)", "Non-Filer WHT Alert"
    severity TEXT CHECK(severity IN ('Low', 'Medium', 'High', 'Critical')) NOT NULL,
    status TEXT CHECK(status IN ('Passed', 'Failed', 'Ignored')) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Multi-Agent Audit Log Table
CREATE TABLE agent_logs (
    id TEXT PRIMARY KEY,
    invoice_id TEXT REFERENCES invoices(id),
    agent_name TEXT NOT NULL, -- Supervisor, Invoice, Expense, Compliance, Reporting
    action TEXT NOT NULL,
    input_payload TEXT,
    output_payload TEXT,
    runtime_ms INTEGER NOT NULL,
    confidence_score DECIMAL(5,2),
    status TEXT CHECK(status IN ('Success', 'Failed', 'Retrying')) DEFAULT 'Success',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Financial Summaries Table (Backend Aggregations)
CREATE TABLE financial_summaries (
    id TEXT PRIMARY KEY,
    period_month TEXT NOT NULL, -- Format: YYYY-MM
    total_invoices_processed INTEGER DEFAULT 0,
    total_spend_pkr DECIMAL(16,2) DEFAULT 0.0,
    total_wht_pkr DECIMAL(16,2) DEFAULT 0.0,
    duplicate_count INTEGER DEFAULT 0,
    policy_violation_count INTEGER DEFAULT 0,
    estimated_savings_pkr DECIMAL(16,2) DEFAULT 0.0,
    executive_summary_markdown TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. Backend REST API Endpoints Specification

### A. Document Upload & Processing

#### `POST /api/v1/upload`
- **Description**: Upload single or batch invoice files (PDF, PNG, JPG).
- **Request**: `multipart/form-data` with `files: File[]`.
- **Response**:
```json
{
  "success": true,
  "batch_id": "batch_98721",
  "uploaded_files": [
    {
      "id": "inv_101",
      "filename": "Invoice_Vendor_PKR.pdf",
      "status": "Uploaded",
      "size_bytes": 1042300
    }
  ]
}
```

#### `POST /api/v1/process`
- **Description**: Trigger multi-agent pipeline execution for uploaded documents.
- **Request**:
```json
{
  "invoice_ids": ["inv_101", "inv_102"],
  "force_reprocess": false
}
```
- **Response**:
```json
{
  "job_id": "job_301",
  "status": "Processing",
  "pipeline_steps": [
    { "agent": "Supervisor", "status": "In Progress" },
    { "agent": "Invoice Processing", "status": "Pending" },
    { "agent": "Expense Analysis", "status": "Pending" },
    { "agent": "Compliance & Audit", "status": "Pending" },
    { "agent": "Reporting Agent", "status": "Pending" }
  ]
}
```

---

### B. Invoices Management

#### `GET /api/v1/invoices`
- **Query Params**: `status`, `vendor`, `search`, `page`, `limit`.
- **Response**:
```json
{
  "total": 50,
  "page": 1,
  "limit": 10,
  "invoices": [
    {
      "id": "inv_101",
      "vendor_name": "Systems Limited Karachi",
      "vendor_ntn": "0812345-6",
      "invoice_number": "INV-2026-089",
      "invoice_date": "2026-07-15",
      "due_date": "2026-08-15",
      "currency": "PKR",
      "subtotal": 450000.00,
      "sales_tax_amount": 72000.00,
      "wht_deducted": 20250.00,
      "total_amount": 501750.00,
      "status": "Approved",
      "is_duplicate": false,
      "category": "Software",
      "ocr_confidence": 98.5
    }
  ]
}
```

#### `GET /api/v1/invoices/:id`
- **Response**: Full invoice metadata including line items, extracted raw text, associated compliance flags, and agent logs.

---

### C. Agents Status & Workflow Monitoring

#### `GET /api/v1/agents/status`
- **Response**: Real-time status, current task, confidence score, runtime, and memory metrics of all 5 agents.
```json
{
  "agents": [
    {
      "id": "supervisor-agent",
      "name": "Supervisor Agent",
      "role": "Orchestrator & Task Router",
      "status": "Active",
      "current_task": "Delegating Batch 98721 to Expense & Compliance Agents",
      "confidence_score": 99.2,
      "runtime_ms": 320,
      "memory_usage_mb": 42.1
    },
    {
      "id": "invoice-agent",
      "name": "Invoice Agent",
      "role": "OCR & Structured Extraction",
      "status": "Idle",
      "current_task": "Waiting for document queue",
      "confidence_score": 98.4,
      "runtime_ms": 1450,
      "memory_usage_mb": 118.5
    }
  ]
}
```

---

### D. Analytics & Reporting

#### `GET /api/v1/dashboard/metrics`
- **Response**:
```json
{
  "summary": {
    "total_invoices_processed": 50,
    "total_spend_pkr": 48200000.00,
    "compliance_score": 92.5,
    "duplicate_invoices_found": 3,
    "policy_violations": 6,
    "estimated_savings_pkr": 1450000.00
  },
  "monthly_trend": [
    { "month": "Feb", "spend_pkr": 3800000 },
    { "month": "Mar", "spend_pkr": 4200000 },
    { "month": "Apr", "spend_pkr": 3900000 },
    { "month": "May", "spend_pkr": 5100000 },
    { "month": "Jun", "spend_pkr": 4700000 },
    { "month": "Jul", "spend_pkr": 4820000 }
  ],
  "category_breakdown": [
    { "category": "Software", "amount_pkr": 15000000, "percentage": 31.1 },
    { "category": "Hardware", "amount_pkr": 12000000, "percentage": 24.9 },
    { "category": "Marketing", "amount_pkr": 8500000, "percentage": 17.6 },
    { "category": "Utilities", "amount_pkr": 4200000, "percentage": 8.7 },
    { "category": "Travel", "amount_pkr": 5500000, "percentage": 11.4 },
    { "category": "Office Supplies", "amount_pkr": 3000000, "percentage": 6.3 }
  ],
  "executive_summary_markdown": "### Executive Overview (July 2026)\nCompany processed **50 invoices** totaling **PKR 48.2 Million**.\n- **3 duplicate invoices** detected saving **PKR 850,000**.\n- **6 policy violations** flagged (missing NTN/STRN tax fields).\n- Software spending grew by **18%**; recommended contract consolidation with local vendors."
}
```

---

### E. AI Copilot Chat Endpoint

#### `POST /api/v1/chat`
- **Request**:
```json
{
  "message": "Show duplicate invoices from July and explain policy violations.",
  "conversation_id": "conv_8812"
}
```
- **Response**:
```json
{
  "conversation_id": "conv_8812",
  "reply_markdown": "### Duplicate Invoices Identified (July 2026)\nWe detected **3 duplicate invoices** totaling **PKR 850,000**:\n1. **INV-9901** (Vendor: Apex Tech Karachi) - Duplicate of INV-9870.\n2. **INV-4410** (Vendor: Indus Logistics) - Identical amount (PKR 120,000) and date.\n\n### Policy Violations Breakdown\n- **Missing NTN Number**: 4 vendors are unregistered non-filers.\n- **Over-budget Limit**: Travel invoice #INV-772 exceeded PKR 250,000 approval threshold.",
  "suggested_actions": ["Download Audit CSV", "Flag Vendors for Review", "Export Report PDF"],
  "referenced_invoices": ["inv_9901", "inv_4410", "inv_772"]
}
```

---

## 4. Backend-Driven State Management Rules

1. **No Client Side Financial Calculations**: Financial totals, WHT withholding calculations, tax deductions, and compliance scoring MUST be performed by the backend API and stored in the database. The frontend renders pre-calculated fields directly from API responses.
2. **Optimistic UI Updates with Rollback**: When a user updates invoice status or flags an invoice, the UI updates optimistically but reverts if the backend API returns an error response.
3. **Data Refresh Triggers**: Upon completing an invoice upload or triggering agent workflow execution, the frontend invalidates TanStack Query keys (`['invoices']`, `['dashboard']`, `['audit-logs']`, `['agent-status']`) to fetch fresh server-authoritative state.
