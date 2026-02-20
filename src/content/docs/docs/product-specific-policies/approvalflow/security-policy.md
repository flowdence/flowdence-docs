---
title: "security policy"
---

| | |
|---|---|
| **Owner** | Flowdence Security and Engineering |
| **Applies to app** | ApprovalFlow for Confluence |
| **Review cadence** | Quarterly and after any significant security event |
| **Status** | Baseline policy |

## 1. Secure development lifecycle

- Source control with reviewed changes via pull requests and decision logs.
- All resolver mutations enforce server-side authorization checks (owner-or-admin and space-admin guards).
- Production release gates include `forge lint`, unit tests, and Playwright end-to-end verification.
- Production claims are traceable to implementation code.
- CI quality gate must pass on release commit.

## 2. Access control and least privilege

- App permissions are scoped to minimum required capability (see manifest scopes).
- Space-level admin checks are required for all workflow mutation actions.
- Workflow ownership RBAC enforces that only workflow owners or space admins can mutate workflows.
- Decision actions validate approver eligibility for the active step.
- Sensitive operations are denied for unauthorized users with consistent error handling.
- License enforcement is strict in production via `defineLicensedResolver`.

## 3. Secrets and credential management

- No secrets are stored in source code.
- ApprovalFlow does not require external credentials; all data is stored in Forge Key-Value Storage.
- No external egress is declared in the manifest.

## 4. Logging and monitoring

- Structured logging via dedicated logger utility with redaction for sensitive data.
- Production logging avoids user-generated content and nonessential identifiers.
- Resolver timing snapshots for selected hot resolvers support performance monitoring.
- Monitoring and alerting responders are assigned per operational readiness plan.

## 5. Vulnerability management

- Security issues are triaged and remediated by severity.
- Marketplace security requirement timelines are treated as release constraints.
- Dependency updates and vulnerability patches are tracked through standard release process.

## 6. Incident response

- Incident triage, escalation, and communication runbooks are maintained.
- Post-incident review and corrective actions are tracked to closure.
- Security events are managed per security policy and operational runbooks.

## 7. Data protection

- Data stored in Forge hosted storage with versioned, additive key design (v1 keyspace).
- Optimistic concurrency prevents lost updates under concurrent approval decisions.
- Retention cleanup functions exist for approval and audit artifacts.
- Audit write fanout to multiple indexes supports compliance without exposing raw data.

## 8. Security reporting

- Contact: security@flowdence.io
- Report format: include impact, reproduction steps, and affected environments.
