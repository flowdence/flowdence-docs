---
title: "Flowdence Vendor Public Docs Source"
---

Last updated: 2026-02-16
Owner: Flowdence Product and Engineering
Applies to app: All Flowdence Marketplace apps
Review cadence: Quarterly and before each Marketplace submission

## Purpose

This directory is the canonical markdown source for shared legal, privacy, security, support, and governance content used across Flowdence Marketplace apps.

This source is intentionally app-agnostic. App repositories should only include app-specific deltas and should link back to this shared baseline where appropriate.

## Publishing model

- Canonical source: markdown files in this directory.
- Canonical customer entry: `flowdence.io` app pages.
- Public implementation walkthroughs: one public Confluence space with dedicated app sections.
- Marketplace listings: each app listing links to app-specific pages and shared policy pages as needed.

## Structure

- `legal/`: Shared legal framework and templates.
- `privacy/`: Shared privacy baseline text.
- `security/`: Shared security baseline text.
- `support/`: Shared support baseline text.
- `governance/`: Review ownership, cadence, and document governance.

## Shared legal and trust pages

- `legal/about-dpa.md`: Public explanation of DPA model and usage.
- `legal/subprocessor-change-communication-plan.md`: Notice process for subprocessor changes.
- `privacy/cookie-policy.md`: Cookie category and consent baseline policy.

## Integration contract for app repositories

Each app repository must:

1. Keep app-specific legal and operational deltas locally.
2. Reference shared baseline policy documents from this source.
3. Document traceability from app claims to implementation.
4. Maintain app-level `Last updated`, `Owner`, `Applies to app`, and `Review cadence` metadata.

## Authoring rules

- Keep legal placeholders explicit until legal review is complete.
- Separate current implementation facts from planned commitments.
- Avoid claims that cannot be backed by code, config, or platform controls.
- Update `governance/review-cadence.md` when ownership changes.

## Related app packs

- MuleSight official app pack:
  - `/Users/rganatra/Documents/Projects/personal/atlassian-root/projects/main/mule-sight/docs/official`
