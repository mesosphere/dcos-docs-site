---
layout: layout.pug
navigationTitle:  Supported Versions
title: Supported Versions
menuWeight: 130
excerpt: Understanding versioning schemes and policies
featureMaturity:
enterprise: false
model: /services/percona-server-mongodb/data.yml
render: mustache
---

# Support

<a name="package-versioning-scheme"></a>

## Package Versioning Scheme

- {{ model.techName }}: 0.4.1-3.6.8
- DC/OS: 1.10 and 1.11

Packages are versioned with an `a.b.c-x.y.z` format, where `a.b.c` is the version of the DC/OS integration and `x.y.z` indicates the version of [{{ model.techName }}](https://www.percona.com/software/mongo-database/percona-server-for-mongodb). For example, `0.4.1-3.6.8` indicates version `0.4.1` of the DC/OS integration and version `3.6.8` of [{{ model.techName }}](https://www.percona.com/software/mongo-database/percona-server-for-mongodb).

<a name="version-policy"></a>

## Version Policy

The DC/OS {{ model.techName }} Service is engineered and tested to work with a specific release of [{{ model.techName }}](https://www.percona.com/software/mongo-database/percona-server-for-mongodb). We select stable versions of the base technology in order to promote customer success. We have selected the latest stable version from [{{ model.techName }}](https://www.percona.com/software/mongo-database/percona-server-for-mongodb) for new releases.

The use of other [{{ model.techName }}](https://www.percona.com/software/mongo-database/percona-server-for-mongodb) versions is unsupported and will likely cause issues.

<a name="contacting-technical-support"></a>
## Contacting Technical Support

### General Inquiries
If you have questions about running {{ model.techName }} on DC/OS, or are interested in participating in this solution’s official beta program, please [send an email to mesosphere@percona.com](mailto:mesosphere@percona.com).

### {{ model.techName }} Technical Support
If you are running {{ model.techName }} on DC/OS and have encountered a defect or other technical issue specific to {{ model.techName }}, please [submit a ticket](https://jira.percona.com/secure/CreateIssue!default.jspa?pid=12402).

### Mesosphere DC/OS Technical Support
If you require DC/OS technical support, please visit the [Mesosphere Support](https://support.mesosphere.com/s/) page to search support articles and submit a support request.
