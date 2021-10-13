---
layout: layout.pug
navigationTitle: Version Support Policy
title: Version Support Policy
menuWeight: 280
excerpt: Supported version policy for Konvoy
beta: false
enterprise: false
---

D2iQ&reg; supports N-2 of the latest `MAJOR.MINOR` version of Konvoy. For example, if the current version of Konvoy&reg; is version 2.0, then D2iQ supports all patch versions of Konvoy 2.0, 1.8, and 1.7.

When the 2.1 version releases, support continues for 2.0, and 1.8. Support for Konvoy version 1.7.x expires. Users should upgrade their Konvoy clusters with every new release to stay up-to-date with the latest features and bug fixes.

You can read more about our official support policy in [D2iQ Support and Maintenance Terms](https://d2iq.com/legal/support-terms).

## Supported Kubernetes versions

Each Konvoy release supports a range of Kubernetes versions. The [Release Notes](../release-notes) describe these versions.

For example, Konvoy 2.0.0 supports:

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.21.3 |
|**Maximum** | 1.21.x |
|**Default** | 1.21.3 |

## Supported operating systems

Details for supported operating systems on Konvoy can be found in [Supported Operating Systems](../supported-operating-systems).

### Experimental Status

"Experimental" means software, features, functionality, sample configurations, or other speculative content that is still under exploration, development, or testing by D2iQ. Experimental components carry no guarantee of eventual release as GA and therefore must not be used in Production Environments. Experimental components qualify for limited, Severity 4 support only and may be discontinued at any time, with or without notice.

Since Experimental components are not intended for Production Environment use, D2iQ cannot assume any responsibility for errors occurring during their use in Production. We can offer only these services in a commercially-reasonable manner, based on the availability of relevant subject matter experts (SMEs):

- General operational guidance for the Experimental component.
- Identifying and diagnosing of errors in configuration or implementation, if possible.
- Advice on preventing and recovering from failures and troubleshooting, as available.

Support for Experimental components is provided on a Standard level, Severity 4 basis only.

This software is provided "as is" and without any express or implied warranties including, without limitation, the implied warranties of merchantability and fitness for a particular purpose.

## Supported Kommander Versions

The following chart identifies which version of Konvoy supports which version of Kommander.

| Konvoy Version | Kommander Version |
| -------------- | ----------------- |
| 2.0.x | 2.0.x |
| 1.8.x | 1.4.x |
| 1.7.x | 1.3.x |

Konvoy and Kommander release `MAJOR.MINOR` versions together and are compatible with each other for that version set. This means, Kommander 2.0, and all of its patch versions (e.g. 2.0.0, 2.0.1), can deploy successfully on any version of Konvoy 2.0. Mixing minor versions is prohibited and the following is not supported:

- You cannot deploy Kommander 1.4.x on Konvoy 2.0.x
- You cannot deploy Kommander 1.3.x on Konvoy 1.8.x

### Standard Level & Severity Definitions

To view our severity level and support terms refer - <https://d2iq.com/legal/support-terms>
