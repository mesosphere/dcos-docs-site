---
layout: layout.pug
navigationTitle:  Release Notes
title: Release Notes
menuWeight: 190
excerpt:
featureMaturity:
enterprise: false
---

## Version 0.4.0-3.6.6

### Breaking Changes
- DC/OS service was renamed from *'percona-mongo'* to *'percona-server-mongodb'*.

### Improvements
- Improved input validation for *'dcos percona-server-mongodb scale'* up/down CLI actions.
- Improved input validation for *'dcos percona-server-mongodb user add'* CLI action.

### Bug Fixes
- Fix for [DCOS_OSS-4005: Percona-mongo cant start if launched from UI with virtual network checked](https://jira.mesosphere.com/browse/DCOS_OSS-4005).
- Fix for WiredTiger cache sizing exceeding DC/OS task available RAM.
