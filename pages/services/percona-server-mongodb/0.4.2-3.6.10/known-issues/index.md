---
layout: layout.pug
navigationTitle:  Known Issues
title: Known Issues in DC/OS Percona Server for MongoDB
menuWeight: 100
excerpt: Known issues in DC/OS Percona Server for MongoDB
model: /services/percona-server-mongodb/data.yml
render: mustache
featureMaturity:
enterprise: false
---

The table below shows all limitations of the {{ model.dbName }} service that are the result of issues in [DC/OS in JIRA](https://jira.mesosphere.com/browse/DCOS_OSS/issues) or the [DC/OS SDK in Github](https://github.com/mesosphere/dcos-commons).

| Limitation                                                                    | Description                                                                                                                                                                                                                                                                             | Bugs                                                                                                                              |
|:------------------------------------------------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------|
| Automated {{ model.dbName }} Backups not yet supported                                  | Automation of {{ model.dbName }} backups is not yet supported. This feature is coming soon. | |
| DC/OS Secret Store is not supported | DC/OS Secret Store support for keys and passwords is blocked by DCOS_OSS-2326. | https://jira.mesosphere.com/browse/DCOS_OSS-2326 |
| Support Region/Zone awareness for Replica Sets | Currently regions/zones are unsupported. | |
| Cannot set WiredTiger cache size | Currently WiredTiger uses default cache sizing; in most cases this is 50% of memory. | |
| Config: Memory swapiness | Currently the framework is unable to set Virtual Memory swapiness to a recommended value for {{ model.dbName }}. | |
| Config: XFS Formatting | Currently the framework is unable to enforce an XFS-based filesystem for storing {{ model.dbName }} data. **We strongly recommend WiredTiger-based installations (the default) run on DC/OS agent nodes using the XFS filesystem only! We also suggest taht you avoid the EXT3 filesystem, due to poor performance.** | |
| Config: Transparent HugePages | Currently the framework is unable to set Transparent HugePages (RedHat/Fedora/CentOS-only) to a recommended value for {{ model.dbName }}. **We recommend disabling THP entirely on DC/OS agent nodes running this framework!** | |
