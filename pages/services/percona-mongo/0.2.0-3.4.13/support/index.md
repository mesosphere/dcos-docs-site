---
layout: layout.pug
navigationTitle:  Supported Versions
title: Supported Versions
menuWeight: 130
excerpt:
featureMaturity:
enterprise: false
---

# Support

<a name="package-versioning-scheme"></a>
## Package Versioning Scheme

- Percona-Mongo: 0.2.0-3.4.13
- DC/OS: 1.10 and 1.11

Packages are versioned with an `a.b.c-x.y.z` format, where `a.b.c` is the version of the DC/OS integration and `x.y.z` indicates the version of [Percona Server for MongoDB](https://www.percona.com/software/mongo-database/percona-server-for-mongodb). For example, `0.2.0-3.4.13` indicates version `0.2.0` of the DC/OS integration and version `3.4.13` of [Percona Server for MongoDB](https://www.percona.com/software/mongo-database/percona-server-for-mongodb).

<a name="version-policy"></a>
## Version Policy

The DC/OS Percona Server for MongoDB Service is engineered and tested to work with a specific release of [Percona Server for MongoDB](https://www.percona.com/software/mongo-database/percona-server-for-mongodb). We select stable versions of the base technology in order to promote customer success. We have selected the latest stable version from [Percona Server for MongoDB](https://www.percona.com/software/mongo-database/percona-server-for-mongodb) for new releases.

The use of other [Percona Server for MongoDB](https://www.percona.com/software/mongo-database/percona-server-for-mongodb) versions is unsupported and will likely cause issues.

<a name="contacting-technical-support"></a>
## Contacting Technical Support

### Percona-Mongo package
[Submit a ticket](https://jira.percona.com/secure/CreateIssue!default.jspa?pid=12402)

### Percona Server for MongoDB
[Submit a ticket](https://jira.percona.com/secure/CreateIssue!default.jspa?pid=11601)

### Mesosphere DC/OS
[Submit a request](https://support.mesosphere.com/hc/en-us/requests/new).
