# Specification: [Feature / Task Name]

## 1. Scope & Impact Summary
- **Target Subproject**: `ui/` | `api/` (strictly 1 folder at a time)
- **Total Files Affected**: [N] files ([X] new, [Y] modified, [Z] deleted)
- **File List & Estimated Line Counts (Max 400 lines/file)**:
  - `[NEW | MODIFY | DELETE]` `path/to/file` (~[N] lines) — [Brief purpose]

---

## 2. Overview & Goals
[Concise description of what this specification accomplishes and why.]

---

## 3. Functional Requirements & Acceptance Criteria
| ID | Requirement | Acceptance Criteria |
| :--- | :--- | :--- |
| **REQ-1** | [Requirement name] | [Testable condition] |

---

## 4. Technical Design & Contracts
- **Folder & Module Structure**: [How files are split for readability]
- **Interfaces / Props / State / API Contracts**:
  ```ts
  // Exact types, props, state shapes, or API schemas
  ```
- **UI States / Edge Cases**:
  - Loading / Empty / Error / Validation states

---

## 5. Verification Plan (Single-Run Rule)
- **Commands to Run Once**:
  - `yarn build` (for `ui/`)
  - `yarn dev` (for `ui/`)
- **Failure Protocol**: If any check fails, stop immediately, report the exact error to the user, and wait for approval before applying fixes.
