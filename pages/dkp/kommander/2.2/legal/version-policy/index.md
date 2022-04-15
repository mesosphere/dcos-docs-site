---
layout: layout.pug
navigationTitle: Version Support Policy
title: Version Support Policy
menuWeight: 5
excerpt: Supported version policy for Kommander
beta: false
enterprise: false
---

D2iQ&reg; supports N-2 of the latest `MAJOR.MINOR` version of Kommander. For example, if the current version of Kommander&reg; is version 2.2, then D2iQ supports all patch versions of Kommander 2.2, 2.1, and 1.4.

When the 2.3 version releases, support continues for 2.2, and 2.1. Support for Kommander version 1.4.x expires. Users should upgrade Kommander with every new release to stay up-to-date with the latest features and bug fixes.

You can read more about our official support policy in [D2iQ Support and Maintenance Terms](https://d2iq.com/legal/support-terms).

## Supported Kommander Versions

The following chart identifies which version of Konvoy supports which version of Kommander.

| Konvoy Version | Kommander Version |
| -------------- | ----------------- |
| 2.2.x | 2.2.x |
| 2.1.x | 2.1.x |
| 2.0.x | 2.0.x |
| 1.8.x | 1.4.x |

Konvoy and Kommander release `MAJOR.MINOR` versions together and are compatible with each other for that version set. This means, Kommander 1.4, and all of its patch versions (for example, 1.4.0, 1.4.1), can deploy successfully on any version of Konvoy 1.8. Mixing minor versions is prohibited and the following is not supported:

- You cannot deploy Kommander 1.3.x on Konvoy 1.8.x
- You cannot deploy Kommander 1.2.x on Konvoy 1.7.x

<!--- ## Supported operating systems

Details for supported operating systems on Kommander can be found in [Supported Operating Systems](../install/supported-operating-systems).

## Supported Base Platform Services

Kommander support for Base Platform Services (BPS) depends on the Kubernetes version it deploys with. Every Base Platform Service release has the supported Kubernetes version in its tag.

For example, Base Platform Service version `stable-1.19-3.2.0` is made up of:

```text
<release_channel>-<kubernetes_version>-<bps_version>
```

This means this set of platform services can deploy on any 1.19 Kubernetes cluster, regardless of the distribution. The support policy for BPS on Konvoy follows the same support policy for [Kubernetes versions](#supported-kubernetes-versions). -->

### Features in patches

Occasionally, to make new features available at a faster rate, D2iQ releases features as part of a patch release. If the Release Notes indicate a feature you need and do not yet have, consider upgrading to the latest version to take full advantage of new features and functions.

### Experimental status

"Experimental" means software, features, functionality, sample configurations, or other speculative content that is still under exploration, development, or testing by D2iQ. Experimental components carry no guarantee of eventual release as GA and therefore must not be used in Production Environments. Experimental components qualify for limited, Severity 4 support only and may be discontinued at any time, with or without notice.

Since Experimental components are not intended for Production Environment use, D2iQ cannot assume any responsibility for errors occurring during their use in Production. We can offer only these services in a commercially-reasonable manner, based on the availability of relevant subject matter experts (SMEs):

- General operational guidance for the Experimental component.
- Identifying and diagnosing of errors in configuration or implementation, if possible.
- Advice on preventing and recovering from failures and troubleshooting, as available.

Support for Experimental components is provided on a Standard level, Severity 4 basis only.

This software is provided "as is" and without any express or implied warranties including, without limitation, the implied warranties of merchantability and fitness for a particular purpose.

## Support for KUDO - Cassandra, Kafka & Spark

### Support Definition - Secondary Support

Secondary support covers support for the base technology of platform service, which is Cassandra, Kafka, and Spark, and additionally support for the KUDO-based operator of the mentioned platform services.

(Base Technology refers to Cassandra, Kafka, and Spark.)

|Type|Scope Example|Support Offered|
|:---|:---|:---|
|Configuration|<ul><li>Guidance for base technology and DKP interoperability configuration questions and troubleshooting for different components of the DKP platform.</li><li>No support for base technology’s configuration that is unrelated to its integration with DKP.</li><li>No support for performance issues with the base technology.</li></ul>|Supported with Severity 4 support terms|
|Failure Assistance|<ul><li>Assistance with installation, and upgrade, failures of the service.</li><li>Assistance with service failures due to platform issues. For example: Konvoy, Kommander, KUDO.</li><li>No assistance for base technology’s failures that is unrelated to its integration with DKP.</li></ul>|Supported with Severity 3 & 4 support terms|
|Bug Fixes|<ul><li>Bug fixes for service integration with DKP.</li><li>Upstream bug fixes to identified issues in the base technology. (Cassandra, Kafka, Spark) on a best effort basis.</li><li>No guarantee that changes to upstream will be accepted.</li><li>No commitment to maintaining forks of upstream.</li></ul>|Supported with Severity 3 & 4 support terms|
|Documentation Errors|<ul><li>Documentation fixes for life cycle management of services and integration with DKP.</li><li>Issue or PR submitted to correct any incorrect upstream documentation in base technology. (Cassandra, Kafka, Spark) on a best effort basis.</li><li>No guarantee that changes will be accepted.</li></ul>|Supported with Severity 4 support terms|

## Standard level & severity definitions

To view our severity level and support terms refer to [D2iQ Support and Maintenance Terms](https://d2iq.com/legal/support-terms)
