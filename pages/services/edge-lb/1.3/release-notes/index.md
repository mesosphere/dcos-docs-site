---
layout: layout.pug
navigationTitle:  Release Notes
title: Release Notes
menuWeight: 0
excerpt: Release notes for Edge-LB 1.3
enterprise: false
---

These are the release notes for Edge-LB 1.3.

Released on February 6, 2019.

# Noteworthy Changes
- Simplify and optimize the HAProxy reload loop.
- Improve the update strategy for the Edge-LB pool.
- Bump the SDK version to 0.55.2.
- Add protection against installing a pool while its previous version is still uninstalling.
- Improve sidecars runs.
- Improve integration test coverage.

# Features
- Expose tasks without specifying ports.
- Dynamic allocation of the HAProxy STATS port.
- Dynamic allocation of the HAProxy Frontend port.
- Scale down Edge-LB pool instances.

# Bug Fixes
- LB task getting killed intermittently leading to outage for apps being load balanced.

# Known Limitations

- Edge-LB currently does not support `Strict` security mode on DC/OS 1.10, but supports `Strict` security mode in DC/OS 1.11.
- Edge-LB currently does not support self-service configuration. All configuration must be handled centrally.

# Known Issues

- The steps provided in the DC/OS 1.10 web interface to uninstall Edge-LB are incorrect. In order to correctly uninstall Edge-LB for any given DC/OS version, please follow the steps in the [Edge-LB uninstall documentation](/services/edge-lb/1.3/uninstalling/).
- Edge-LB running on a CentOS/RHEL 7.2 node where `/var/lib/mesos` is formatted with `ext4` may have connection issues.
- If a pool is configured with invalid constraints, that pool will not be properly created and will not respect pool deletion. It must be removed manually.