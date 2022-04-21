---
layout: layout.pug
navigationTitle: Version Support Policy
title: Version Support Policy
menuWeight: 98
excerpt: Kaptain's supported version policy
beta: false
enterprise: false
---

D2iQ supports `N-2` of the latest `MAJOR.MINOR` release of Kaptain.
With the GA release of Kaptain 1.3.0, support continues for Kaptain 1.3, 1.2, and 1.1, including all patch releases. Support for Kaptain 1.0 expires.

D2iQ recommends that you install the newest Kaptain version available to stay up to date with the latest features and bug fixes.

## Supported Konvoy Versions

Kaptain 1.3.0 runs on DKP 2.1.1, Konvoy 1.7 and 1.8.

## Supported Kommander Versions

Kaptain 1.3.0 cannot be installed from Kommander or as an add on.

Note that it is possible to use [Kommander's Dex instance](../configuration/external-dex) for authenticating users in Kaptain.

## Experimental Status
"Experimental" means software, features, functionality, sample configurations, or other speculative content that is still under exploration, development, or testing by D2iQ. Experimental components carry no guarantee of eventual release as GA and therefore must not be used in Production Environments. Experimental components qualify for limited, Severity 4 support only and may be discontinued at any time, with or without notice.

Since Experimental components are not intended for Production Environment use, D2iQ cannot assume any responsibility for errors occurring during their use in Production. We can offer only these services in a commercially-reasonable manner, based on the availability of relevant subject matter experts (SMEs):

General operational guidance for the Experimental component.
Identifying and diagnosing of errors in configuration or implementation, if possible.
Advice on preventing and recovering from failures and troubleshooting, as available.
Support for Experimental components is provided on a Standard level, Severity 4 basis only.

## Istio Support Status
Istio is a required prerequisite for Kaptain.
Istio usage is only supported in conjunction with Kaptain and the configurations delivered as part of Kaptain.
All other usage of [experimental]Istio[/experimental] is considered experimental.

## Support for KUDO - Cassandra, Kafka & Spark
### Support Definition - Secondary Support
Secondary support covers support for the base technology of platform service, which is Cassandra, Kafka, and Spark, and additionally support for the KUDO-based operator of the mentioned platform services.

*Base Technology refers to Cassandra, Kafka, and Spark.

|Type|Scope Example|Support Offered|
|:---|:---|:---|
|Configuration|* Guidance for base technology and DKP interoperability configuration questions and troubleshooting for different components of the DKP platform. <br> * No support for base technology's configuration that is unrelated to its integration with DKP. <br>  * No support for performance issues with the base technology.|Supported with Severity 4 support terms|
|Failure Assistance|* Assistance with installation, and upgrade, failures of the service. <br> * Assistance with service failures due to platform issues. For example: Konvoy, Kommander, KUDO. <br> * No assistance for base technology's failures that is unrelated to its integration with DKP.|  Supported with Severity 3 & 4 support terms|
|Bug Fixes|* Bug fixes for service integration with DKP.<br>  * Upstream bug fixes to identified issues in the base technology. (Cassandra, Kafka, Spark) on a best effort basis.<br> * No guarantee that changes to upstream will be accepted.<br> * No commitment to maintaining forks of upstream.|Supported with Severity 3 & 4 support terms|
|Documentation Errors|* Documentation fixes for life cycle management of services and integration with DKP.<br> * Issue or PR submitted to correct any incorrect upstream documentation in base technology. (Cassandra, Kafka, Spark) on a best effort basis.<br> * No guarantee that changes will be accepted.|Supported with Severity 4 support terms|

## Standard Level & Severity Definitions

To view our severity level and support terms refer to [https://d2iq.com/legal/support-terms](https://d2iq.com/legal/support-terms).
