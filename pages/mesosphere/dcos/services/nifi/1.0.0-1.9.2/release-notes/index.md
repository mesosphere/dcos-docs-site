---
layout: layout.pug
navigationTitle:  Release Notes
title: Release Notes
menuWeight: 5
excerpt: Discover the new features, updates, and known limitations in this release of the NiFi Service
featureMaturity:
enterprise: false
model: /mesosphere/dcos/services/nifi/data.yml
render: mustache
---

# Release Notes for NiFi Service version 1.0.0-1.9.2

This release of the NiFi service is based on a more recent SDK, which supports quota enforcement.

## Bug Fix
- Fix removing nodes from cluster after upgrade/restart.

## Changes
- The UID for `nobody` is now Debian default rather than `99`.