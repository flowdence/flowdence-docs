---
title: "Tutorial: Build a MuleSight Macro Coverage Page"
---

## Scenario

You are creating a runbook page that should always show live MuleSoft posture instead of static screenshots.

## Time Estimate

15-20 minutes

## Guided Flow

### Step 1: Create the page and add source links

Add one source link each for Exchange asset, Runtime Manager app, and API Manager instance.

![Macro source links and page structure](../assets/screenshots/raw/16-macro-coverage-page-all-macros.png)

### Step 2: Validate runtime and compact cards

Set display options so detailed and compact runtime-style views are both represented.

![Runtime detailed and compact examples](../assets/screenshots/raw/17-macro-runtime-exchange-api-security-overview.png)

### Step 3: Validate security macro sections

Ensure policy, SLA tier, and contract sections are rendering.

![Security macro section example](../assets/screenshots/raw/18-macro-security-tables-and-compact-row.png)

### Step 4: Validate API and Exchange detailed cards

Check status/version metadata and outbound action links.

![API and Exchange detailed cards](../assets/screenshots/raw/19-macro-api-detailed-and-env-summary.png)

### Step 5: Add and validate Environment Summary

Confirm drift counters and snapshot timestamp are visible.

![Environment summary widget](../assets/screenshots/raw/20-macro-environment-summary.png)

## Done Criteria

- Runtime card shows status/version/links.
- Security macro shows policies, tiers, and contracts.
- Compact row supports fast status scanning.
- Environment Summary provides current drift snapshot.
