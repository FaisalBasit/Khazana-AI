# Specification 05: Test-Driven Development (TDD) & Verification Suite

## 1. Test-Driven Development (TDD) Mandatory Protocol

Every new feature or bug fix added to **Khazana AI** MUST follow a strict Test-Driven Development workflow. This guarantees high reliability, prevents regression errors, and ensures seamless execution by AI code generators (Cline, DeepSeek, Kilo Code, Antigravity).

```
         ┌────────────────────────────────────────────────────────┐
         │ 1. Write Failing Test Spec (Unit / API Contract Test) │
         └───────────────────────────┬────────────────────────────┘
                                     │
                                     ▼
         ┌────────────────────────────────────────────────────────┐
         │ 2. Run Test Suite & Confirm RED (Failure Verified)     │
         └───────────────────────────┬────────────────────────────┘
                                     │
                                     ▼
         ┌────────────────────────────────────────────────────────┐
         │ 3. Implement Minimum Production Code to Pass Test      │
         └───────────────────────────┬────────────────────────────┘
                                     │
                                     ▼
         ┌────────────────────────────────────────────────────────┐
         │ 4. Run Test Suite & Confirm GREEN (Success Verified)  │
         └───────────────────────────┬────────────────────────────┘
                                     │
                                     ▼
         ┌────────────────────────────────────────────────────────┐
         │ 5. Refactor Code (Keep Tests Green & Clean Architecture)│
         └────────────────────────────────────────────────────────┘
```

---

## 2. Test Cases & Test Specifications

### A. Unit Tests: Invoice Extraction & Pakistani Tax Validation

#### Test Suite: `tests/unit/test_tax_validation.py` (or `.ts`)

1. **Test Case 1.1: Valid Pakistani NTN Regex Check**
   - *Input*: `ntn = "1234567-8"`
   - *Expected Result*: `validate_ntn(ntn) == True`
2. **Test Case 1.2: Invalid Pakistani NTN Regex Check**
   - *Input*: `ntn = "12345678"` (missing hyphen)
   - *Expected Result*: `validate_ntn(ntn) == False`
3. **Test Case 1.3: Filer vs Non-Filer Withholding Tax Deduction**
   - *Input*: `amount_pkr = 100000.00`, `tax_category = "Non-Filer"`
   - *Expected Result*: `wht_amount == 9000.00` (9% rate applied for non-filers).
4. **Test Case 1.4: Duplicate Invoice Detection Logic**
   - *Input*: Invoice A (`vendor_id="v_101"`, `invoice_num="INV-9901"`), Invoice B (`vendor_id="v_101"`, `invoice_num="INV-9901"`)
   - *Expected Result*: `detect_duplicate(invoice_b) == True`

---

### B. API Integration Tests: REST Endpoints

#### Test Suite: `tests/integration/test_invoices_api.test.ts`

```typescript
import { describe, it, expect } from 'vitest';

describe('POST /api/v1/upload', () => {
  it('should accept valid PDF invoice and create pending database record', async () => {
    const response = await fetch('http://localhost:3000/api/v1/upload', {
      method: 'POST',
      body: mockFormDataWithPDF('sample_invoice.pdf')
    });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.uploaded_files[0].status).toBe('Uploaded');
  });
});

describe('GET /api/v1/dashboard/metrics', () => {
  it('should return backend-calculated spend totals in PKR and compliance metrics', async () => {
    const response = await fetch('http://localhost:3000/api/v1/dashboard/metrics');
    expect(response.status).toBe(200);
    const data = await response.json();
    
    expect(data.summary.total_invoices_processed).toBeGreaterThan(0);
    expect(data.summary.total_spend_pkr).toBeDefined();
    expect(typeof data.summary.compliance_score).toBe('number');
  });
});
```

---

### C. Bug-Fix TDD Protocol

Whenever a bug is reported or discovered (e.g., *“Duplicate invoice status is not setting `is_duplicate` to true when dates are 2 days apart”*):

1. **Step 1**: Open the corresponding test file (or create `tests/regression/bug_fix_duplicate_date.test.ts`).
2. **Step 2**: Add a reproduction test case:
   ```typescript
   it('BUG-FIX: should flag invoice as duplicate when date is within +/- 3 days', async () => {
     const inv1 = { vendor_id: 'v1', amount: 50000, date: '2026-07-20' };
     const inv2 = { vendor_id: 'v1', amount: 50000, date: '2026-07-22' };
     const result = checkDuplicate(inv2, [inv1]);
     expect(result.is_duplicate).toBe(true); // Fails initially if bug exists
   });
   ```
3. **Step 3**: Run tests and confirm **Failure (RED)**.
4. **Step 4**: Fix the implementation logic in the backend service or agent handler.
5. **Step 5**: Re-run test and confirm **Pass (GREEN)**.

---

## 3. Mock Data Suite (`data/mockData.ts`)

To support instant frontend demo and offline testing, maintain comprehensive mock dataset containing:
- 50 synthetic enterprise invoices (including 3 duplicate pairs).
- 10 Pakistani B2B vendors (Systems Ltd, K-Electric, PTCL, Indus Motors, Apex Tech, etc.) with valid and invalid NTN/STRN records.
- 6 compliance rule violations.
- 5 AI agent status profiles.
- Pre-generated Markdown Executive Summary.
