---
title: "privacy policy"
---

| | |
|---|---|
| **Owner** | Flowdence Legal and Product |
| **Applies to app** | ApprovalFlow for Confluence |
| **Review cadence** | Quarterly and before publication |

## 1. Who we are

- Company: Flowdence
- Privacy contact: privacy@flowdence.io
- Address: Melbourne AU, 3030

## 2. Data we process

ApprovalFlow processes the following categories of data to deliver its approval workflow functionality:

- Atlassian account identifiers (user IDs and display names for approver and actor references)
- Confluence page identifiers, version numbers, and space identifiers needed for workflow state tracking
- Workflow configuration data (workflow name, steps, approvers, enabled state, owner IDs, space scope)
- Approval records (status, timestamps, actor identifiers, step decisions, history)
- Workflow-to-page assignment metadata
- Audit events recording workflow and approval actions (timestamps, actors, actions, page and space context)

ApprovalFlow does not store or access full page content bodies. The app operates on page metadata and version identifiers only.

## 3. Purpose of processing

- Deliver page approval workflow functionality within Confluence.
- Track approval status per page version and notify approvers via @mention comments.
- Record audit events for workflow actions to support compliance and operational visibility.
- Provide troubleshooting and customer support.
- Protect service security and reliability.

## 4. Legal basis

Flowdence processes personal data under one or more of the following legal bases, depending on context:

- Performance of a contract (to deliver and operate the app service).
- Legitimate interests (for service security, abuse prevention, reliability, and support operations), where those interests are not overridden by data subject rights.
- Compliance with legal obligations.
- Consent, where consent is required by applicable law.

## 5. Data retention

- Approval records (resolved): 180 days default retention target.
- Audit records: 365 days default retention target.
- Retention values may be adjusted based on legal and customer obligations.
- Retention cleanup functions can purge stale records based on policy windows.

Each app defines retention periods and deletion workflows in its app-specific data handling disclosure.

## 6. Data sharing

- Data is processed within Atlassian Forge-hosted infrastructure.
- No sale of personal data.
- Data sharing is limited to subprocessors and infrastructure required to deliver the app.
- ApprovalFlow does not declare any external egress endpoints; all processing occurs within the Atlassian Forge platform.

## 7. International transfers

Flowdence may process personal data in jurisdictions where Flowdence, Atlassian, or authorized subprocessors operate. When transferring personal data from regions with transfer restrictions, Flowdence uses appropriate safeguards, including standard contractual clauses or other legally recognized transfer mechanisms.

## 8. Security

- Server-side space-admin authorization checks on all workflow mutation operations.
- Paid Marketplace licensing enforcement in production.
- Optimistic concurrency guards for approval decisions to prevent lost updates.
- Least-privilege scope design with periodic review.
- Structured logging with redaction of sensitive data.
- License and permission checks for all protected functionality.

## 9. Your rights

Data subject requests can be submitted to privacy@flowdence.io.

## 10. Changes to this notice

Material updates will be reflected with a revised date and published notice.

## 11. Contact

For privacy questions: privacy@flowdence.io
