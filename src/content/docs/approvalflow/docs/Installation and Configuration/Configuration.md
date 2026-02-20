---
title: "Configuration"
---

## Configuration Goals

Initial production-ready configuration includes:

- At least one active workflow.
- Valid approver assignment.
- Workflow naming convention.
- Optional cross-space import source strategy.

## Step 1: Open Workflows Tab

![Workflows tab in SPARROW](../assets/screenshots/admin-workflow-management/03-sparrow-workflows-overview.png)

## Step 2: Create Main Workflow

1. Click `Create Workflow`.
2. Enter workflow name with clear purpose (example: docs lifecycle).
3. Select workflow type:
   - `Single step` for simple approval.
   - `Multi step` for sequential approvals.
4. Add approver(s).
5. Set approval mode (`Any one approver` or `All approvers`).
6. Save.

![Workflow created in table](../assets/screenshots/admin-workflow-management/04-sparrow-main-workflow-created.png)

## Step 3: Edit Workflow Details

- Use row actions (`...`) -> `Edit`.
- Update owners/approvers/step behavior.

![Edit workflow modal](../assets/screenshots/admin-workflow-management/05-edit-workflow-modal-sharp.png)

## Step 4: Manage Lifecycle Operations

- Duplicate workflow for safe experimentation.
- Disable a workflow when pausing usage.

![Workflow actions menu](../assets/screenshots/admin-workflow-management/06-workflow-actions-menu.png)

![Duplicate and disabled state](../assets/screenshots/admin-workflow-management/08-duplicate-workflow-disabled.png)

## Step 5: Cross-Space Workflow Import (Optional)

Use `Import Workflows` to bring proven workflows from another space (example `SPARROWSALES`) into `SPARROW`.

![Import modal with cross-space workflow](../assets/screenshots/admin-workflow-management/09-import-modal-with-cross-space-workflow.png)

![Imported workflow visible in SPARROW](../assets/screenshots/admin-workflow-management/10-imported-workflow-visible-in-sparrow.png)

## Recommended Naming Convention

- `<Domain> <Purpose> Workflow`
- Include a stable team keyword (e.g., `Docs`, `Ops`, `Sales`).

## Configuration Quality Checks

- Workflow toggle is active for live use.
- Approver names resolve correctly.
- Duplicate/test workflows are cleaned up or disabled.
