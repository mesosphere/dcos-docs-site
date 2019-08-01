---
layout: layout.pug
navigationTitle:  Supported Versions
title: Supported Versions
menuWeight: 130
excerpt: Understanding versioning schemes and policies
featureMaturity:
enterprise: false
---

# Support

<a name="package-versioning-scheme"></a>
## Package Versioning Scheme

- Percona-Server-MongoDB: 0.4.0-3.6.6
- DC/OS: 1.10 and 1.11

Packages are versioned with an `a.b.c-x.y.z` format, where `a.b.c` is the version of the DC/OS integration and `x.y.z` indicates the version of [Percona Server for MongoDB](https://www.percona.com/software/mongo-database/percona-server-for-mongodb). For example, `0.4.0-3.6.6` indicates version `0.4.0` of the DC/OS integration and version `3.6.6` of [Percona Server for MongoDB](https://www.percona.com/software/mongo-database/percona-server-for-mongodb).

<a name="version-policy"></a>
## Version Policy

The DC/OS Percona Server for MongoDB Service is engineered and tested to work with a specific release of [Percona Server for MongoDB](https://www.percona.com/software/mongo-database/percona-server-for-mongodb). We select stable versions of the base technology in order to promote customer success. We have selected the latest stable version from [Percona Server for MongoDB](https://www.percona.com/software/mongo-database/percona-server-for-mongodb) for new releases.

The use of other [Percona Server for MongoDB](https://www.percona.com/software/mongo-database/percona-server-for-mongodb) versions is unsupported and will likely cause issues.

<a name="contacting-technical-support"></a>
## Contacting Technical Support

### General Inquiries
If you have questions about running Percona Server for MongoDB on DC/OS, or are interested in participating in this solution’s official beta program, please [send an email to mesosphere@percona.com](mailto:mesosphere@percona.com).

### Percona Server for MongoDB Technical Support
If you are running Percona Server for MongoDB on DC/OS and have encountered a defect or other technical issue specific to Percona Server for MongoDB, please [submit a ticket](https://jira.percona.com/secure/CreateIssue!default.jspa?pid=12402).

### Mesosphere DC/OS Technical Support
If you require DC/OS technical support, please visit the [Mesosphere Support](https://support.mesosphere.com/s/) page to search support articles and submit a support request.
