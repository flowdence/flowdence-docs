---
title: "provider specific terms addendum"
---

| | |
|---|---|
| **Owner** | Flowdence Legal and Product |
| **Applies to app** | MuleSight for Confluence |
| **Review cadence** | Quarterly and before publication |

This addendum supplements Flowdence provider-specific base terms for MuleSight.

## 1. Service-specific scope

MuleSight presents cached and refreshed MuleSoft snapshots inside Confluence modules.

The app does not guarantee real-time MuleSoft state at every render; freshness depends on refresh execution and MuleSoft API response behavior.

## 2. Customer configuration obligations

Customers are responsible for:

- Providing and rotating MuleSoft connected app credentials.
- Ensuring credentials are authorized for required MuleSoft resources.
- Reviewing displayed data before using it for operational decisions.

## 3. Data handling constraints

MuleSight stores operational snapshots and secrets required for functionality as described in the MuleSight data handling disclosure.

## 4. Support boundaries

Support does not include remediation of customer-owned MuleSoft platform outages or permissions misconfiguration unrelated to MuleSight code behavior.

## 5. Security event handling

Security events are managed per the Flowdence security policy and operational runbooks.

Security contact: `security@flowdence.io`

## 6. Service limits and fair use

- High-frequency refresh requests may be rate-limited by upstream services.
- Product behavior under upstream throttling is documented in the release gap register.

## 7. Additional legal clauses

In addition to base provider-specific terms:

- MuleSight output depends on upstream MuleSoft API availability, customer permissions, and data freshness windows.
- Cache-first rendering and stale fallback are resilience features and do not constitute a guarantee of real-time accuracy.
- Customers remain responsible for validating critical operational decisions against source systems when required by internal policy.

