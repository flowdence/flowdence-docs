---
title: "Help and Support"
---

## If You Need Help Fast

Collect these details before escalating:

- Confluence site URL
- affected space key
- affected tab/feature
- timeframe with timezone
- expected behavior vs actual behavior
- one screenshot or short video

## Quick Triage by Symptom

### Symptom: Connection test fails

1. Re-open `Space settings -> MuleSight Configuration`.
2. Verify client id, client secret, and org id values.
3. Re-run `Test MuleSoft Connection`.

Evidence reference:

- `assets/screenshots/raw/04-space-settings-test-connection-success.png`

### Symptom: Dashboard looks stale or incomplete

1. Use `Refresh` in the active dashboard tab.
2. Reduce selected environments to isolate scope.
3. Apply a narrow search filter.
4. Export CSV/HTML for evidence.

Evidence references:

- `assets/screenshots/raw/06-dashboard-environment-comparison-filtered-drift-exported.png`
- `assets/screenshots/raw/08-dashboard-api-security-posture-tab.png`

### Symptom: Security details are unclear

1. Open `API Security Posture`.
2. Click `View security` on the API row.
3. Review policies, tiers, and contracts in the modal.

Evidence reference:

- `assets/screenshots/raw/09-dashboard-api-security-modal-mule-mcp-test.png`

### Symptom: Ops pages are not updating

1. Check refresh interval and last sync in `MuleSight Ops Dashboard`.
2. Open the linked ops parent page and confirm child incident history.
3. Remember `Refresh Ops Data` reloads metadata only; it does not run the scheduler.

Evidence references:

- `assets/screenshots/raw/11-dashboard-ops-tab.png`
- `assets/screenshots/raw/12-ops-parent-page-published-incidents.png`

## Operational Rules to Remember

- Rovo behavior is space-context bound.
- Ops publishing is scheduler-driven and transition-driven.
- This documentation pack covers single-space operation.
