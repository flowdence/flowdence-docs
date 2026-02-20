---
title: "data handling disclosure"
---

| | |
|---|---|
| **Owner** | Flowdence Product and Engineering |
| **Applies to app** | ApprovalFlow for Confluence |
| **Review cadence** | Quarterly and after any data model changes |

## Data categories

| Category | Examples | Source |
|---|---|---|
| Workflow definitions | Workflow name, steps, approvers, enabled state, owner IDs, space scope | Admin configuration via space dashboard |
| Approval records | Status, page version, timestamps, actor identifiers, step decisions, history | User actions via byline and space dashboard |
| Workflow-to-page assignments | Page ID to workflow ID mapping, space context | First submission or admin assignment |
| Audit events | Action type, timestamp, actor, page ID, space ID, workflow reference | System-generated on workflow and approval actions |
| Space configuration | Space-level app settings | Admin configuration |
| Global settings | Global app configuration | Admin configuration |

## Data storage and location

- Primary storage: Atlassian Forge Key-Value Storage (KVS).
- Runtime and hosting: Atlassian Forge platform.
- All data is stored using versioned key patterns (v1 keyspace) with additive index design.

## External data egress

ApprovalFlow does not declare any external egress endpoints in its manifest. All data processing occurs entirely within the Atlassian Forge platform. The app only communicates with Confluence REST APIs for page metadata, comments, labels, and space information.

## Data residency

ApprovalFlow uses Atlassian Forge-hosted services; residency follows Forge capabilities and the customer's Atlassian Cloud setup.

## Data access model

- End-user and admin operations call Confluence APIs using user context (.asUser()) where possible.
- App-owned storage access is performed server-side via resolvers.
- Workflow mutations require server-side space-admin or workflow-owner authorization.
- Decision actions validate approver eligibility for the active workflow step.

## Data flow

1. User interacts with Confluence UI (byline, space dashboard, or global dashboard).
2. UI invokes licensed resolver functions.
3. Resolvers call service layer which reads/writes Forge KVS and Confluence REST APIs.
4. Audit events are fanned out to multiple indexes (global, space, page) for efficient retrieval.
5. Best-effort label updates and comment notifications are applied to Confluence pages.

## Retention defaults

- Approval records (resolved): 180 days default retention target.
- Audit records: 365 days default retention target.

Retention values may be adjusted based on legal and customer obligations.

## Data deletion

- Approval records can be reset or deleted through app operations (Manage Space tab).
- Retention cleanup functions can purge stale records based on policy windows.
- Audit purge removes base records and all derived index entries (global, page, and space recent keys).
- On service termination, Flowdence will delete or irreversibly de-identify customer personal data within 90 days, subject to backup lifecycle and technical constraints.
