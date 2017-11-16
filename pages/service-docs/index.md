---
layout: layout.pug
navigationTitle:  Service Guides
title: Service Guides
menuWeight: 2
excerpt:
featureMaturity:
enterprise: false
---










DC/OS services are Marathon applications that are packaged and available from the public [DC/OS package repositories][1]. Available DC/OS services include Mesos frameworks and other applications. A [Mesos framework][2] is the combination of a Mesos scheduler and an optional custom executor.

DC/OS services are created by the community and by Mesosphere.

### Versioning Scheme

The service documentation is divided by version. The first part of the version name of a service refers to the release of the DC/OS package of the service. The second part refers to the version of the application in the package. An optional third part, -beta, indicates a service is a beta release. For example, for Beta Cassandra version v1.0.30-3.0.13-beta:

- 1.0.30 = Release of the DC/OS Cassandra package.
- 3.0.13 = The version of Cassandra included in the package.
- beta = The release of the DC/OS Cassandra package is a beta release.

 [1]: /docs/1.9/usage/repo/
 [2]: http://mesos.apache.org/documentation/latest/frameworks/