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
- MongoDB system-level users and key required on service configuration
  - 10-character minimum for system-level passwords
  - 1023-1024 character limit for key
- Percona Server for MongoDB
  - RocksDB/MongoRocks storage engine deprecated, more about this [here](https://www.percona.com/blog/2018/05/10/why-weve-deprecated-mongorocks-in-percona-server-for-mongodb-3-6/)
  - *"replication.enableMajorityReadConcern"* option deprecation, due to MongoDB 3.6
- DC/OS Percona-mongo CLI
  - UserAdmin username and password is no longer required on user add/remove/delete
- Experimental Percona Monitoring and Management *(PMM)* support deprecated until further improvements are made to the feature

### Improvements
- Percona Server for MongoDB 3.6
- MongoDB TLS/SSL transport encryption support for DC/OS Enterprise Edition 
- Scaling down the MongoDB replica set is now supported, both in the GUI and CLI
- Backup Restore feature
  - Compatible with backups created by the service
  - Restores possible at service initiation *(check "restoreAfterInit"* in the 'Backup Restore' section of the GUI)*
  - 'dcos percona-mongo restore' CLI commands

### Bug Fixes
- Fix for adding users with roles outside of the MongoDB 'admin' database
