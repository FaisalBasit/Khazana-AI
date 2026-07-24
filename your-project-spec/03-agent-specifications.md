# Specification 03: Multi-Agent AI Specifications

## 1. Multi-Agent Orchestration Topology

The platform operates on a **Supervisor-Worker Agent Architecture**. The **Supervisor Agent** acts as the central coordinator, delegating domain-specific tasks to specialized worker agents and synthesizing outputs into a unified response.

```
                        ┌───────────────────────────────┐
                        │       Supervisor Agent        │
                        │  (Planning & Delegation)      │
                        └───────────────┬───────────────┘
                                        │
        ┌───────────────────┬───────────┴───────────┬───────────────────┐
        ▼                   ▼                       ▼                   ▼
┌───────────────┐   ┌───────────────┐       ┌───────────────┐   ┌───────────────┐
│ Invoice Agent │   │ Expense Agent │       │ Compliance    │   │ Reporting     │
│ (OCR/Parse)   │   │ (Analytics)   │       │ Agent (Audit) │   │ Agent (Exec)  │
└───────────────┘   └───────────────┘       └───────────────┘   └───────────────┘
```

---

## 2. Agent 1: Supervisor Agent

### Purpose
Central orchestrator that accepts incoming user requests or batch upload triggers, plans execution steps, routes tasks to worker agents, resolves dependencies, and synthesizes final outputs.

### Prompts & Configuration
- **System Prompt**:
  > "You are the Chief Financial Orchestrator of Khazana AI, Pakistan's sovereign finance operating system. Your job is to parse user requests, delegate processing to specialized agents (Invoice, Expense, Compliance, Reporting), enforce Pakistani regulatory rules (FBR, PRA, SRB), and synthesize accurate, executive-grade financial reports. Always respond with clear, structured logic."
- **Tools**:
  - `delegate_task(agent_name: str, payload: dict)`
  - `query_database(sql_query: str)`
  - `synthesize_final_report(agent_results: list)`

### Inputs & Outputs
- **Input**: User prompt OR batch invoice job ID.
- **Output**:
```json
{
  "orchestration_id": "orch_9001",
  "plan": [
    "Step 1: Execute Invoice Processing OCR & field extraction",
    "Step 2: Classify expenses and identify PKR anomalies",
    "Step 3: Run FBR NTN/STRN and duplicate compliance checks",
    "Step 4: Generate Executive Financial Dashboard Summary"
  ],
  "final_status": "Success",
  "total_latency_ms": 3200
}
```

---

## 3. Agent 2: Invoice Processing Agent

### Purpose
Automates invoice text reading (OCR), structured field extraction, currency conversion to PKR, line item parsing, and duplicate invoice detection.

### Core Features & Pakistani Local Rules
- **OCR Parsing**: Extracts text from PDFs and images (Docling / PaddleOCR / Vision LLM).
- **Pakistani Field Extraction**:
  - `Vendor Name` & `Vendor Address`
  - `NTN Number` (Validation: 7 digits + hyphen + 1 digit)
  - `STRN Number` (Validation: 13 numeric digits)
  - `Subtotal (PKR)`
  - `Sales Tax Amount (PKR)` (PRA 16%, SRB 13%, FBR 18%)
  - `Withholding Tax Deducted (PKR)`
  - `Total Payable (PKR)`
- **Duplicate Detection Logic**: Flags an invoice as duplicate if another invoice exists with:
  `Same Vendor ID` AND (`Same Invoice Number` OR (`Same Total Amount` AND `Date within +/- 3 days`)).

### Tools
- `extract_invoice_fields(file_bytes: bytes) -> dict`
- `check_duplicate_invoice(vendor_id: str, invoice_num: str, amount: float) -> bool`
- `convert_currency_to_pkr(amount: float, source_currency: str) -> float`

### Output JSON Schema
```json
{
  "vendor_name": "Systems Limited Karachi",
  "vendor_ntn": "0812345-6",
  "vendor_strn": "1234567890123",
  "invoice_number": "INV-2026-089",
  "invoice_date": "2026-07-15",
  "due_date": "2026-08-15",
  "currency": "PKR",
  "subtotal_pkr": 450000.00,
  "sales_tax_pkr": 72000.00,
  "wht_pkr": 20250.00,
  "total_amount_pkr": 501750.00,
  "is_duplicate": false,
  "ocr_confidence": 98.5,
  "line_items": [
    {
      "description": "Enterprise Cloud Server Renewal (Karachi Data Center)",
      "quantity": 1,
      "unit_price": 450000.00,
      "total_price": 450000.00
    }
  ]
}
```

---

## 4. Agent 3: Expense Analysis Agent

### Purpose
Classifies invoice expenses into standardized categories, evaluates spending by department, detects unusual PKR spending spikes, and suggests vendor cost-savings options.

### Categories
1. **Software & IT Infra**
2. **Hardware & Machinery**
3. **Marketing & Advertising**
4. **Payroll & Contractor Fees**
5. **Utilities (K-Electric, LESCO, SSGC, PTCL)**
6. **Travel & Entertainment**
7. **Office Supplies & Logistics**
8. **Miscellaneous**

### Anomaly Detection & Cost Saving Suggestions
- **Spending Spike Rule**: Flags category spending if current month exceeds historical 3-month moving average by > 25%.
- **Local Import Substitution Suggestion Engine**: Identifies foreign SaaS / foreign hardware expenses and suggests local Pakistani enterprise alternatives (e.g. replacing foreign cloud hosting with local Tier-3 data centers in Karachi/Lahore).

### Tools
- `classify_line_item(description: str) -> str`
- `detect_spending_anomalies(category: str, amount_pkr: float) -> dict`
- `generate_cost_saving_recommendations(expenses: list) -> list`

### Output JSON Schema
```json
{
  "category": "Software & IT Infra",
  "department": "IT Operations",
  "amount_pkr": 15000000.00,
  "is_anomaly": true,
  "anomaly_reason": "Software spend is 32% higher than June 2026 baseline.",
  "saving_recommendation": {
    "title": "Consolidate Cloud Hosting Subscriptions",
    "description": "Switch from foreign USD hosting to local Karachi Tier-3 Cloud infrastructure.",
    "potential_annual_savings_pkr": 1450000.00
  }
}
```

---

## 5. Agent 4: Compliance & Audit Agent

### Purpose
Ensures strict adherence to Pakistani corporate finance regulations, FBR withholding tax rules, company authorization limits, and audit trail logging.

### Policy Rules Engine

| Rule ID | Rule Name | Condition / Threshold | Severity | Recommended Action |
|---|---|---|---|---|
| `RULE-01` | Missing Vendor NTN | Vendor `ntn_number` is NULL or invalid regex | **High** | Flag invoice; withhold payment until tax ID provided. |
| `RULE-02` | Duplicate Invoice Alert | Matching invoice number and total amount found | **Critical** | Block payment scheduling immediately. |
| `RULE-03` | CFO Dual Approval Needed | Single invoice total > PKR 500,000 | **Medium** | Require CFO approval before status set to `Paid`. |
| `RULE-04` | Non-Filer WHT Penalty | Vendor `tax_category` == 'Non-Filer' | **High** | Apply double Withholding Tax rate (9% instead of 4.5%). |
| `RULE-05` | Missing Sales Tax Invoice | Sales tax charged without valid STRN | **High** | Disallow Sales Tax input claim. |

### Audit Trail Logging Format
Every check appends a immutable log entry:
```
[2026-07-25 01:40:00] INVOICE_UPLOADED (inv_101)
[2026-07-25 01:40:02] OCR_COMPLETED (Confidence: 98.5%)
[2026-07-25 01:40:03] COMPLIANCE_CHECK_PASSED (NTN: 0812345-6 Verified)
[2026-07-25 01:40:04] DUAL_APPROVAL_FLAGGED (Total PKR 501,750 > Threshold PKR 500,000)
```

---

## 6. Agent 5: Reporting Agent

### Purpose
Aggregates structured output from all agents into executive-ready markdown summaries, P&L cash flow indicators, and downloadable PDF/CSV artifacts.

### Tools
- `build_kpi_summary(invoices: list) -> dict`
- `generate_executive_markdown(data: dict) -> str`
- `export_audit_pdf(summary_id: str) -> bytes`

### Standard Executive Summary Output Template
```markdown
### Khazana AI — Executive Financial Summary (July 2026)

#### Key Performance Indicators
- **Total Invoices Processed**: 50
- **Total Expenditure**: PKR 48,200,000.00
- **Compliance Score**: 92.5 / 100
- **Duplicates Blocked**: 3 (PKR 850,000 saved)
- **Policy Violations Flagged**: 6
- **Estimated Import Substitution Savings**: PKR 1,450,000.00

#### Key Highlights & Anomaly Analysis
1. **Software & Infrastructure**: Software spending increased by 18% due to annual cloud license renewals.
2. **FBR Tax Compliance**: 4 vendors are unregistered non-filers; non-filer withholding tax penalty rates applied.
3. **Duplicate Prevention**: Prevented duplicate payment of INV-9901 (PKR 450,000).

#### Recommended Actions
- Approve pending high-value invoices (> PKR 500k).
- Initiate local cloud hosting migration to save PKR 1.45M annually.
- Request updated NTN tax certificates from unregistered vendors.
```
