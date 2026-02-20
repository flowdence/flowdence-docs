---
title: "security policy"
---

| | |
|---|---|
| **Owner** | Flowdence Security and Engineering |
| **Applies to app** | MuleSight for Confluence |
| **Review cadence** | Quarterly and after security-significant changes |

## 1. Security design principles

- Least privilege on app scopes and egress.
- Secure secret storage with no hardcoded credentials.
- Cache-first resilience without exposing sensitive material.
- Structured logging with redaction.

## 2. Access and authorization model

- Global configuration writes are context-guarded.
- Data fetches are constrained to configured MuleSoft org and environment inputs.
- Mutating config actions are routed through resolver functions with controlled entry points.

## 3. Secret management

- MuleSoft client secret and OAuth token are stored in Forge secret storage.
- Token cache invalidation occurs on auth context changes and 401 retry flows.

## 4. Data egress and network controls

- Outbound fetch is restricted to MuleSoft endpoint(s) declared in manifest.
- No broad wildcard egress is configured.

## 5. Logging policy

- Logs are structured and redacted for keys resembling tokens/secrets/passwords/authorization.
- Operational errors are captured without dumping raw secret values.

## 6. Vulnerability and patch management

- Security defects are triaged by severity and tracked to remediation.
- Marketplace security requirement timelines are treated as release constraints.

## 7. Incident response

- Incident process and communication standards are defined in operational runbooks.
- Security escalation contact: `security@flowdence.io`.

## 8. Shared responsibility references

MuleSight operates on Forge infrastructure; platform and app responsibilities are split per Atlassian shared responsibility guidance.

