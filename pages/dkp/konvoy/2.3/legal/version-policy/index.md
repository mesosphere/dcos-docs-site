---
layout: layout.pug
navigationTitle: Version Support Policy
title: Version Support Policy
menuWeight: 280
excerpt: Supported version policy for Konvoy
beta: false
enterprise: false
---

D2iQ&reg; supports N-2 of the latest `MAJOR.MINOR` version of Konvoy. For example, if the current GA version of Konvoy&reg; is 2.2, then D2iQ supports all patch versions of Konvoy 2.1, and 1.8.

When the next version releases, support continues for 2.2, and 2.1. Support for Konvoy version 1.8.x expires. You should upgrade Konvoy with every new release to stay up-to-date with the latest features and bug fixes.

You can read more about our official support policy in [D2iQ Support and Maintenance Terms](https://d2iq.com/legal/support-terms).

## Supported Kubernetes versions

Each Konvoy release supports a range of Kubernetes versions. Konvoy 2.0 supports:

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.21.0 |
|**Maximum** | 1.22.x |
|**Default** | 1.22.8|

## Supported operating systems

Details for supported operating systems on Konvoy can be found in [Supported Operating Systems](../../supported-operating-systems).

## Support for KUDO - Cassandra, Kafka & Spark

### Support definition - secondary support

Secondary support covers support for the base technology of platform service, which is Cassandra, Kafka, and Spark, and additionally support for the KUDO-based operator of the mentioned platform services.

**Note:** Base Technology refers to Cassandra, Kafka, and Spark.

## Features in patches

Occasionally, to make new features available at a faster rate, D2iQ releases features as part of a patch release. If the Release Notes indicate a feature you need and do not yet have, consider upgrading to the latest version to take full advantage of new features and functions.

## Experimental status

"Experimental" means software, features, functionality, sample configurations, or other speculative content that is still under exploration, development, or testing by D2iQ. Experimental components carry no guarantee of eventual release as GA and therefore must not be used in Production Environments. Experimental components qualify for limited, Severity 4 support only and may be discontinued at any time, with or without notice.

Since Experimental components are not intended for Production Environment use, D2iQ cannot assume any responsibility for errors occurring during their use in Production. We can offer only these services in a commercially-reasonable manner, based on the availability of relevant subject matter experts (SMEs):

- General operational guidance for the Experimental component.
- Identifying and diagnosing of errors in configuration or implementation, if possible.
- Advice on preventing and recovering from failures and troubleshooting, as available.

Support for Experimental components is provided on a Standard level, Severity 4 basis only.

This software is provided "as is" and without any express or implied warranties including, without limitation, the implied warranties of merchantability and fitness for a particular purpose.

## Standard Level & Severity Definitions

To view our severity level and support terms see the [support terms page](https://d2iq.com/legal/support-terms).
