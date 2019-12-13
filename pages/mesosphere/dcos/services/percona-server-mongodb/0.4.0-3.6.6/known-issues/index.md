---
layout: layout.pug
navigationTitle:  Known Issues
title: Known Issues
menuWeight: 100
excerpt: Known issues in DC/OS
featureMaturity:
enterprise: false
---

The table below shows all limitations of the MongoDB service that are the result of issues in [DC/OS in JIRA](https://jira.mesosphere.com/browse/DCOS_OSS/issues) or the [DC/OS SDK in Github](https://github.com/mesosphere/dcos-commons).

| Limitation                                                                    | Description                                                                                                                                                                                                                                                                             | Bugs                                                                                                                              |
|:------------------------------------------------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------|
| Automated MongoDB Backups not yet supported                                  | Automation of MongoDB backups is not yet supported. This feature is coming soon. | |
| DC/OS Secret Store is not supported | DC/OS Secret Store support for keys and passwords is blocked by DCOS_OSS-2326 | https://jira.mesosphere.com/browse/DCOS_OSS-2326 |
| Support Region/Zone awareness for Replica Sets | Currently regions/zones are unsupported. | |
| Cannot set WiredTiger cache size | Currently WiredTiger uses default cache sizing, in most cases this is 50% of memory | |
| Config: Memory swapiness | Currently the framework is unable to set Virtual Memory swapiness to a recommended value for MongoDB. | |
| Config: XFS Formatting | Currently the framework is unable to enforce an XFS-based filesystem for storing MongoDB data. **We strongly recommend WiredTiger-based installations (the default) run on DC/OS agent nodes using the XFS filesystem only! We also suggest the EXT3 filesystem is avoided due to poor performance.** | |
| Config: Transparent HugePages | Currently the framework is unable to set Transparent HugePages (RedHat/Fedora/CentOS-only) to a recommended value for MongoDB. **We recommend THP is disabled entirely on DC/OS agent nodes running this framework!** | |
