---
layout: layout.pug
navigationTitle:  Release Notes
title: Release Notes
menuWeight: 190
excerpt:
featureMaturity:
enterprise: false
---

## Version 0.3.0-3.6.5

### Breaking Changes
- Pod task name changes.
  - The *'mongo'* pod was renamed to *'mongo-REPLSET'*, where *'REPLSET'* is the name of the MongoDB Replica Set.
  - The *'mongo-0-watchdog'* task was moved to a new pod named *'watchdog'*, its new task name is *'watchdog-0-watchdog'*.

### Improvements
- Official documentation created.
- Backups using [Percona-Lab/mongodb_consistent_backup](https://github.com/Percona-Lab/mongodb_consistent_backup) added. See the *'Backup'* tab of the service configuration.
  - Currently only [AWS S3](https://aws.amazon.com/s3/) is supported as an upload destination for the backup.
  - Support for adding a [Hidden MongoDB Replica Set member](https://docs.mongodb.com/manual/core/replica-set-hidden-member/) *(for backups)* added.
- Support for auto-installation of [Percona Monitoring and Management](https://www.percona.com/software/database-tools/percona-monitoring-and-management) *'pmm-client'*. See the *'Percona Pmm'* tab of the service configuration.
- 'MOUNT'-type disk support added.

### Bug Fixes

### Documentation
- Service documentation was added in this release.
