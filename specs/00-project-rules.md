# Specification: Project Rules & Spec-Driven Workflow Configuration

## 1. Overview & Impact Summary
- **Target Scope**: Repository Root (`GEMINI.md` and `specs/_template.md`)
- **Total Files Affected**: **2 new files** (`0` existing files modified)
  1. `[NEW]` `/home/bioanim/paginas/tono-persianas/GEMINI.md`
  2. `[NEW]` `/home/bioanim/paginas/tono-persianas/specs/_template.md`

---

## 2. Functional Requirements & Acceptance Criteria

| ID | Rule / Requirement | Acceptance Criteria |
| :--- | :--- | :--- |
| **REQ-1** | **Read-Only Inspection by Default** | Whenever the user asks to check, inspect, review, or explain something, the agent performs 0 file modifications until explicitly instructed to change code. |
| **REQ-2** | **Pre-Change Impact Report (Small Changes)** | For direct/small changes without a full plan, the agent must first state: (1) **what** will change, (2) **which files** will be affected, and (3) **how many files** in total, and wait for user approval before editing. |
| **REQ-3** | **3-Phase Spec-Driven Workflow (Planned Mode)** | In plan mode, the agent must complete **Phase 1 (Plan Approval)** → **Phase 2 (Spec Approval, then saved to `specs/`)** → **Phase 3 (Implementation)**. No code is written before both Plan and Spec are approved. |
| **REQ-4** | **Post-Change Single-Run Verification** | After every change, the agent runs project verification commands **once** (e.g., `yarn build` and `yarn dev` in `ui/`). If any check fails, the agent stops immediately, explains the error, and waits for user approval before attempting a fix. If unsure how to run/check the project, the agent asks the user. |
| **REQ-5** | **Modularity & 400-Line File Limit** | Code must be split cleanly into logical files and folders for readability. No file may exceed **400 lines** unless the agent explains the technical reason and receives explicit user approval. |
| **REQ-6** | **Single-Folder Focus (`ui/` vs `api/`)** | The agent works across both `ui/` and `api/`, but must split work and focus on **1 folder at a time** (`ui/` or `api/`) per task/step. |
