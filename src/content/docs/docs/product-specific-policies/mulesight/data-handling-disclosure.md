---
title: "data handling disclosure"
---

| | |
|---|---|
| **Owner** | Flowdence Product and Security |
| **Applies to app** | MuleSight for Confluence |
| **Review cadence** | Quarterly and before Marketplace updates |

## Current implementation facts

| Data category | Examples | Source | Storage location | Retention posture |
|---|---|---|---|---|
| App configuration | Default org id, dataset flags, sync interval | Admin settings UI | Forge KVS | Persisted until updated/removed |
| Credential material | MuleSoft client secret, cached OAuth access token | Admin input and token exchange | Forge secret storage | Persisted until rotated or cleared |
| Dataset snapshots | CloudHub apps, API Manager APIs, security slices | MuleSoft APIs | Forge KVS cache entries | Replaced on refresh; cleanup behavior defined by cache lifecycle |
| Operational metadata | Refresh timestamps, stale indicators, error metadata | App execution | Forge KVS and logs | Retained per operational needs and platform behavior |

## Data flow summary

1. Admin configures MuleSoft credentials.
2. App exchanges credentials for access token.
3. App fetches MuleSoft data and writes cached snapshots.
4. UI and Rovo actions read cache-first and optionally refresh live data.

## External data egress

Configured egress target:

- `https://anypoint.mulesoft.com`

No additional outbound endpoints are currently declared in the app manifest.

## Data residency and hosting

- Runtime and storage operate on Atlassian Forge services.
- Customer data location and residency follow Forge and Atlassian platform controls.

## Deletion and rotation

- Secrets can be replaced through configuration updates.
- Cache state can be reset when runtime context changes.
- Additional lifecycle controls are tracked in the release gap register.

## Planned commitments

- Define explicit documented cache retention windows by dataset type.
- Add formal policy for periodic stale cache cleanup.

