---
post_title: Known Issues
menu_order: 100
enterprise: 'no'
---

The table below shows all limitations of the MongoDB service that are the result of issues in [DC/OS in JIRA](https://jira.mesosphere.com/browse/DCOS_OSS/issues) or the [DC/OS SDK in Github](https://github.com/mesosphere/dcos-commons).

| Limitation                                                                    | Description                                                                                                                                                                                                                                                                             | Bugs                                                                                                                              |
|:------------------------------------------------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------|
| MongoDB keyFile and passwords are predictable                                | The backup, userAdmin, clusterMonitor and clusterAdmin users have predictable default passwords. Also, the MongoDB keyFile has a predictable default. A feature request has been opened to generate secure random keys/passwords. | [DCOS_OSS-1917](https://jira.mesosphere.com/browse/DCOS_OSS-1917) |
| MongoDB SSL Connections are not supported                                    | MongoDB SSL/TLS connections are not yet supported. This feature is coming soon. | |
| Automated MongoDB Backups not yet supported                                  | Automation of MongoDB backups is not yet supported. This feature is coming soon. | |
| Emit app metrics to DC/OS Metrics module                                     | DC/OS Metrics are currently not supported by this framework. This feature is coming soon. | |
| Pod never scales-down after reducing 'count' | Scale-down support is blocked by this issue. | |
| Configurable Service Account and Secret for Enterprise DC/OS Strict Security Mode | Add support for configurable Service Account and Service Account Secret for Enterprise DC/OS Strict Security Mode | |
| Support Region/Zone awareness for Replica Sets | Currently regions/zones are unsupported. | |
| Cannot set WiredTiger/InMemory or RocksDB cache size | Currently storage engine cache sizes use default sizing, in most cases this is 50% of memory | |
| Config: Memory swapiness | Currently the framework is unable to set Virtual Memory swapiness to a recommended value for MongoDB. | |
| Config: XFS Formatting | Currently the framework is unable to enforce an XFS-based filesystem for storing MongoDB data. **We strongly recommend WiredTiger-based installations *(the default)* run on DC/OS agent nodes using the XFS filesystem only! We also suggest the EXT3 filesystem is avoided due to poor performance.** | |
| Config: Transparent HugePages | Currently the framework is unable to set Transparent HugePages *(RedHat/Fedora/CentOS-only)* to a recommended value for MongoDB. **We recommend THP is disabled entirely on DC/OS agent nodes running this framework!** | |
