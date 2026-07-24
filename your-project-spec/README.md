# Khazana AI — Sovereign Enterprise Finance & Supply Chain Copilot
## Comprehensive Project Specification Directory (`your-project-spec`)

Welcome to the **Khazana AI Specification Engine**. This directory contains the exhaustive product, technical, architectural, agent, and test specifications for building **Khazana AI** — Pakistan’s Sovereign Multi-Agent Enterprise Finance Operating System.

Designed specifically for the **KSBL ELXR Hackathon (Import Substitution Engine Theme)**, Khazana AI replaces prohibitive, expensive foreign enterprise software (SAP, Oracle Financials, Coupa, Xero) with a localized, high-performance, AI-orchestrated financial platform tailored to Pakistani regulatory, taxation (FBR, PRA, SRB, KPR), and business environments.

---

## 📂 Specification Directory Structure

| File | Description | Target Consumer |
|---|---|---|
| [`01-architecture-and-data-model.md`](./01-architecture-and-data-model.md) | Database schemas, REST API contracts, backend-driven state machine, and data models. | Backend AI Developer / DB Architect |
| [`02-user-journeys-and-workflows.md`](./02-user-journeys-and-workflows.md) | Step-by-step user journeys, state transitions, and edge cases for all 6 core workflows. | Fullstack / Frontend Developer |
| [`03-agent-specifications.md`](./03-agent-specifications.md) | AI Agent prompts, tool definitions, multi-agent delegation topology, and structured outputs. | AI / LLM Engineer |
| [`04-frontend-design-system.md`](./04-frontend-design-system.md) | Behance-inspired dark glassmorphism UI/UX design system, pages, and component hierarchy. | Frontend Developer / Designer |
| [`05-tdd-and-verification-suite.md`](./05-tdd-and-verification-suite.md) | Test-Driven Development protocols, unit/integration test specifications, and bug-fix TDD workflows. | QA / Test Engineer / AI Builder |

---

## 🎯 Core Operating Principles for AI Code Generators (Cline, DeepSeek, Kilo Code, Antigravity)

### 1. Backend-Driven Architecture (Single Source of Truth)
- The **database and backend API are the absolute single source of truth**.
- Frontend components **MUST NOT** hold independent persistent business state or compute financial totals on the client.
- All state changes (invoice uploads, compliance flags, categorization updates, agent workflow steps) must originate from API mutations and be synced via TanStack Query / React Query or REST polling/WebSockets.

### 2. Strict Test-Driven Development (TDD)
- **Feature Development**: Write test cases (unit or API contract tests) *before* writing component or API handler code.
- **Bug Fixes**: When a bug is identified, first write a failing test reproducing the exact issue, verify the failure, and then apply the fix until the test passes.

### 3. Localized Import Substitution Focus (Pakistan Compliance)
- Support **PKR (Pakistani Rupee)** as the primary operating currency.
- Support **FBR (Federal Board of Revenue)** tax compliance rules:
  - NTN (National Tax Number) format: `7-digit number + 1 check digit` (e.g., `1234567-8`).
  - STRN (Sales Tax Registration Number) format: `13 digits` (e.g., `1234567890123`).
  - Withholding Tax (WHT) rates under Income Tax Ordinance 2001 (Goods 4-5%, Services 8-10%).
  - Provincial Sales Tax rules (PRA - Punjab Revenue Authority 16%, SRB - Sindh Revenue Board 13%).

---

## 🛠 Tech Stack Overview

- **Frontend**: React 19 / TanStack Router & Start (or Next.js/Vite), Tailwind CSS v4, Framer Motion, Lucide Icons, Recharts, Radix UI primitives.
- **Backend / API**: FastAPI (Python) or Nitro / Node.js backend endpoints with SQLite/PostgreSQL database.
- **AI Infrastructure**: Multi-Agent system using OpenAI Agents SDK / LangChain / Pydantic AI with OCR (Docling / PaddleOCR / Tesseract / Vision LLM).

---

## 🚀 Execution Instructions for Code Assistants
When tasked with building or updating any feature in Khazana AI:
1. Locate the feature's user journey in [`02-user-journeys-and-workflows.md`](./02-user-journeys-and-workflows.md).
2. Check the DB schema & API contract in [`01-architecture-and-data-model.md`](./01-architecture-and-data-model.md).
3. Review the agent requirements in [`03-agent-specifications.md`](./03-agent-specifications.md).
4. Implement tests first following [`05-tdd-and-verification-suite.md`](./05-tdd-and-verification-suite.md).
5. Build backend endpoints followed by backend-driven UI components.
