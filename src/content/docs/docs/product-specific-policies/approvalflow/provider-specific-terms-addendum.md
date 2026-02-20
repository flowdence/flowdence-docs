---
title: "provider specific terms addendum"
---

| | |
|---|---|
| **Owner** | Flowdence Legal and Product |
| **Applies to app** | ApprovalFlow for Confluence |
| **Review cadence** | Quarterly and before publication |

This addendum supplements Flowdence provider-specific base terms for ApprovalFlow.

## 1. Service-specific scope

ApprovalFlow provides soft, version-aware content approval workflows within Confluence Cloud. The app tracks approval status per page version, surfaces workflow state in the page byline and space dashboard, and records audit events for workflow actions.

The app uses a soft workflow approach: pages remain viewable during review. ApprovalFlow does not restrict page access or enforce hard content locks.

## 2. Customer configuration obligations

Customers are responsible for:

- Configuring approval workflows with appropriate approvers and step definitions.
- Assigning workflows to spaces according to internal governance requirements.
- Reviewing approval outcomes before relying on them for compliance or operational decisions.
- Ensuring workflow owners and space admins are designated according to organizational policy.

## 3. Data handling constraints

ApprovalFlow stores workflow definitions, approval records, page assignments, and audit events as described in the ApprovalFlow data handling disclosure.

ApprovalFlow does not store or access full page content bodies. The app operates on page metadata and version identifiers only.

## 4. Support boundaries

Support does not include:

- Remediation of Atlassian Cloud platform outages unrelated to ApprovalFlow code behavior.
- Configuration of customer-internal governance policies or compliance frameworks.
- Custom workflow logic beyond the capabilities documented in the product.

## 5. Security event handling

Security events are managed per the Flowdence security policy and operational runbooks.

Security contact: security@flowdence.io

## 6. Service limits and fair use

- Approval and audit record volumes are subject to Forge Key-Value Storage limits.
- High-frequency concurrent approval decisions use optimistic concurrency; conflicting writes may require client-side retry.
- Audit write fanout scales with the number of index dimensions; performance under very high event volumes is documented in product economics notes.

## 7. Additional legal clauses

In addition to base provider-specific terms:

- ApprovalFlow output depends on Atlassian Cloud platform availability and Confluence REST API behavior.
- Soft workflow status indicators are advisory and do not constitute a guarantee of content quality or compliance.
- Customers remain responsible for validating critical governance decisions against their own internal policies and source systems.
