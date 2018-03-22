---
post_title: Supported Versions
menu_order: 130
post_excerpt: ""
enterprise: 'no'
---

# Support

<a name="package-versioning-scheme"></a>
## Package Versioning Scheme

- percona-mongo: 0.2.0-3.4.13
- DC/OS: 1.10 and 1.11

Packages are versioned with an `a.b.c-x.y.z` format, where `a.b.c` is the version of the DC/OS integration and `x.y.z` indicates the version of Percona Server for MongoDB. For example, `0.2.0-3.4.13` indicates version `0.2.0` of the DC/OS integration and version `3.4.13` of Percona Server for MongoDB.

<a name="version-policy"></a>
## Version Policy

The DC/OS Percona Server for MongoDB Service is engineered and tested to work with a specific release of Percona Server for MongoDB. We select stable versions of the base technology in order to promote customer success. We have selected the latest stable version from Percona Server for MongoDB for new releases.

The use of other Percona Server for MongoDB versions is unsupported and will likely cause issues.

<a name="contacting-technical-support"></a>
## Contacting Technical Support

### percona-mongo package
[Email mesosphere@percona.com](mailto:mesosphere@percona.com).

### Percona Server for MongoDB
[Submit a Ticket](https://jira.mongodb.org/secure/CreateIssue.jspa).

### Mesosphere DC/OS
[Submit a request](https://support.mesosphere.com/hc/en-us/requests/new).
