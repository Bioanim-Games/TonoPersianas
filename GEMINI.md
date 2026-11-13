# Project Rules & Engineering Guidelines (tono-persianas)

These rules govern all agent interactions, planning, inspections, and code modifications in this repository.

---

## Rule 1 — Read-Only Inspection by Default
- When asked to **check**, **inspect**, **review**, **debug**, or **explain** anything, operate strictly in **read-only mode**.
- Do **not** create, edit, or delete any files until the user directly and explicitly instructs you to change code.

---

## Rule 2 — Pre-Change Impact Report (Small Changes Without a Plan)
- To prevent small changes from turning into large problems, before making any small or direct code change (when not running a full `/plan` cycle), you **must** first inform the user:
  1. **What** you are going to change (clear summary of the modification).
  2. **Which files** will be created, modified, or deleted (exact file paths).
  3. **How many files** will be touched in total.
- Wait for the user's explicit approval before modifying any file.

---

## Rule 3 — Mandatory 3-Phase Spec-Driven Workflow (`/plan` Mode)
When operating in planning mode or building a planned feature, strictly follow these three sequential phases:

1. **Phase 1 — Planning (`implementation_plan.md`)**
   - Research the codebase, clarify any ambiguities, and create the `implementation_plan.md` artifact.
   - Wait for explicit user approval of the Plan before moving to Phase 2.
2. **Phase 2 — Spec-Driven Design (`spec.md` → `specs/`)**
   - After the Plan is approved, draft a detailed technical specification (`spec.md`) in the conversation artifacts directory for review.
   - Wait for explicit user approval of the Specification.
   - Once approved, persist the specification file into the repository's `specs/` directory (`specs/ui/` or `specs/api/`).
3. **Phase 3 — Code Implementation & Verification**
   - Only after **both** the Plan and the Specification are approved by the user may you begin implementing code changes.

---

## Rule 4 — Post-Change Verification (Run Once & Report on Failure)
- After completing every code change, verify that the application still works and no errors break the app:
  - **For `ui/` (React + Vite)**: Run `yarn build` and `yarn dev` to verify there are no TypeScript, build, or startup errors.
  - **For `api/` (FastAPI + uv)**: Run the appropriate check command for the Python service.
- **Run each check command only once**:
  - Do **not** enter an automatic retry/fix loop if a command fails.
  - **If a check fails**: Stop immediately, explain clearly to the user what went wrong, present a Pre-Change Impact Report for the proposed fix, and wait for explicit user approval before modifying any code.
- **Ask When Unsure**: Verification steps can vary by project. If you encounter issues or are unsure how to run or verify a part of the project, stop and ask the user how to run it.

---

## Rule 5 — Modular File/Folder Organization & 400-Line Limit
- Organize code into clean, single-responsibility files and logical folder structures so the code is easy to read and navigate.
- **Maximum 400 Lines Per File**: Never exceed **400 lines** in a single file unless there is a strong technical reason. If a file needs to exceed 400 lines, you must first explain the reason to the user and get explicit approval to keep the larger file.

---

## Rule 6 — Single-Folder Focus (`ui/` vs `api/`)
- This monorepo contains two main subprojects: `ui/` (React frontend) and `api/` (FastAPI backend).
- When asked to fix an issue or build a feature, **focus work on 1 folder at a time** (`ui/` **or** `api/`).
- If a task requires changes in both `ui/` and `api/`, split the work into separate sequential steps so only one subproject folder is modified at a time.
