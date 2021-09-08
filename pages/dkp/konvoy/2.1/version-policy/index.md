---
layout: layout.pug
navigationTitle: Version Support Policy
title: Version Support Policy
menuWeight: 280
excerpt: Supported version policy for Konvoy
beta: false
enterprise: false
---

D2iQ&reg; supports N-2 of the latest `MAJOR.MINOR` version of Konvoy. For example, if the current version of Konvoy&reg; is version 1.8, then D2iQ supports all patch versions of Konvoy 1.8, 1.7, and 1.6.

When the next version releases, support continues for 1.8, and 1.7. Support for Konvoy version 1.6.x expires. Users should upgrade their Konvoy clusters with every new release to stay up-to-date with the latest features and bug fixes.

You can read more about our official support policy in [D2iQ Support and Maintenance Terms](https://d2iq.com/legal/support-terms).

## Supported Kubernetes versions

Each Konvoy release supports a range of Kubernetes versions. The [Release Notes](../release-notes) describe these versions.

For example, Konvoy 1.8.0 supports:

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.18.x |
|**Maximum** | 1.20.x |
|**Default** | 1.20.6 |

## Supported operating systems

Details for supported operating systems on Konvoy can be found in [Supported Operating Systems](../install/supported-operating-systems).

## Supported Kubernetes-Base-Addons (KBA) versions

Konvoy support for KBA depends on the Kubernetes version it deploys with. Every KBA release has the supported Kubernetes version in its tag.

For example, KBA version `stable-1.20-4.0.0` is made up of:

```text
<release_channel>-<kubernetes_version>-<kba_version>
```

This means this set of addons can deploy on any 1.19 Kubernetes cluster, regardless of the distribution. The support policy for KBA on Konvoy follows the same support policy for [Kubernetes versions](#supported-kubernetes-versions). You can find more details for KBA under [Kubernetes Base Addons](../addons).

## Supported Kommander Versions

The following chart identifies which version of Konvoy supports which version of Kommander.

| Konvoy Version | Kommander Version |
| -------------- | ----------------- |
| 1.8.x | 1.4.x |
| 1.7.x | 1.3.x |
| 1.6.x | 1.2.x |

Konvoy and Kommander release `MAJOR.MINOR` versions together and are compatible with each other for that version set. This means, Kommander 1.4, and all of its patch versions (e.g. 1.4.0, 1.4.1), can deploy successfully on any version of Konvoy 1.8. Mixing minor versions is prohibited and the following is not supported:

- You cannot deploy Kommander 1.3.x on Konvoy 1.8.x
- You cannot deploy Kommander 1.2.x on Konvoy 1.7.x

## Support for KUDO - Cassandra, Kafka & Spark
### Support Definition - Secondary Support
Secondary support covers support for the base technology of platform service, which is Cassandra, Kafka, and Spark, and additionally support for the KUDO-based operator of the mentioned platform services.

**Note:** Base Technology refers to Cassandra, Kafka, and Spark.
## Support for Addons in Konvoy
### Support Definition - Secondary Support
All addons that D2iQ ships with DKP products are covered under secondary support.

| Type | Scope Example | Support Offered |
| ---- | ------------- | --------------- |
| Configuration | &ast; Guidance for base technology and DKP interoperability configuration questions and troubleshooting for different components of the DKP platform.<br/> &ast; No support for base technology’s configuration that is unrelated to its integration with DKP.<br/> &ast; No support for performance issues with the base technology that is unrelated to its integration with DKP.. | Supported with severity 3 & 4 support terms |
| Failure Assistance | &ast; Assistance with installation, and upgrade failures of the service as captured in the supported DKP product upgrade pathway.<br/> &ast; Assistance with service failures due to platform issues. For example: Konvoy, Kommander, KUDO.<br/> &ast; Support is limited to troubleshooting for root cause up to DKP product limit. Root causes that are identified to be beyond this limit will need to be pursued by the company who creates the addon base technology.  Please note, if the RCA for the failure is due to a non-standard configuration or non-DKP use of the addon, we will be unable to provide assistance beyond basic identification.<br/> &ast; No assistance for base technology’s failures that is unrelated to its integration with DKP. | Supported with all severities |
| Bug Fixes | &ast; Bug fixes for service integration with DKP.<br/>&ast; Upstream bug fixes to identified issues in the base technology of the addon on a best effort basis.<br/>&ast; No guarantees that our changes to upstream will be accepted.<br/>&ast; No commitment to maintaining forks upstream. | RCA supported with all severities, Fix supported with severity 3 & 4 support terms |
| Documentation errors | &ast; Documentation fixes for life cycle management of services and integration with DKP.<br/>&ast; Upstream documentation fixes to reported and identified issues in base technology of the addon via a best effort basis.<br/>&ast; No guarantees that our changes will be accepted. | Supported with severity 4 support terms |
### Experimental Status
"Experimental" means software, features, functionality, sample configurations, or other speculative content that is still under exploration, development, or testing by D2iQ. Experimental components carry no guarantee of eventual release as GA and therefore must not be used in Production Environments. Experimental components qualify for limited, Severity 4 support only and may be discontinued at any time, with or without notice.

Since Experimental components are not intended for Production Environment use, D2iQ cannot assume any responsibility for errors occurring during their use in Production. We can offer only these services in a commercially-reasonable manner, based on the availability of relevant subject matter experts (SMEs):

- General operational guidance for the Experimental component.
- Identifying and diagnosing of errors in configuration or implementation, if possible.
- Advice on preventing and recovering from failures and troubleshooting, as available.

Support for Experimental components is provided on a Standard level, Severity 4 basis only.

This software is provided "as is" and without any express or implied warranties including, without limitation, the implied warranties of merchantability and fitness for a particular purpose.

## Standard Level & Severity Definitions

To view our severity level and support terms see the [support terms page](https://d2iq.com/legal/support-terms).
