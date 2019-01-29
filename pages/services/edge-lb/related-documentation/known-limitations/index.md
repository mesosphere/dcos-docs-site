---
layout: layout.pug
navigationTitle:  Known Limitations and Issues
title: Known limitations and issues
menuWeight: 50
excerpt: Lists known limitations and issues for Edge-LB 
enterprise: false
---

# Known Edge-LB limitations
Depending on the configuration of Edge_LB and your cluster environment, you might experience some limitations in Edge-LB features or functionality. Unlike issues that are typically found and fixed in minor or patch version updates, technical limitations can span multiple versions. 

## Current limitations
* Edge-LB supports all [security modes](/1.12/security/ent/#security-modes) in DC/OS 1.11 and later.

* Edge-LB supports `permissive` and `disabled` security in DC/OS 1.10, but does not support `strict` security mode on DC/OS 1.10.

* Edge-LB is not supported for DC/OS 1.9, or earlier, clusters.

* Edge-LB currently does not support self-service configuration. All configuration must be handled centrally.

## Limitations in previous versions
The following previously-reported Edge-LB limitations have been resolved.

| Known limitation description | Versions affected | Resolved by |
|-------------------------------| ----------------- | ----------- |
Edge-LB does not support `disabled` security mode. | Edge-LB 1.0.2 (and older) | Edge-LB 1.1.0 (and newer)
The number of load balancer instances ocannot be scaled down | Edge-LB 1.0.2 (and older) | Edge-LB 1.0.3 (and newer)

# Known Edge-LB issues

* The steps provided in the DC/OS web interface to uninstall Edge-LB are incorrect. Follow the steps in [Uninstall](/services/edge-lb/1.2/uninstalling/) to uninstall Edge-LB.

* If you are running Edge-LB on a CentOS/RHEL 7.2 node where `/var/lib/mesos` is formatted with `ext4`, you might see connection issues.

* If you attempt to configure a pool with invalid constraints, the pool will not be created properly and will not respect pool deletion. To address this issue, you must manually remove the pool and recreate it.

## Known issues in previous versions
The following previously-reported Edge-LB issues have been resolved.

| Known issue description | Versions affected | Resolved by |
|-------------------------| ----------------- | ----------- |

