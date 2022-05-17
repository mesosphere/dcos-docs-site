---
layout: layout.pug
navigationTitle: Version Support Policy
title: Version Support Policy
menuWeight: 280
excerpt: Supported version policy for Konvoy
beta: false
enterprise: false
---

D2iQ&reg; supports N-2 of the latest `MAJOR.MINOR` version of Konvoy&reg;. For example, if you have Konvoy version 1.5, then D2iQ supports all patch versions of Konvoy 1.5, 1.4, and 1.3.

When the new 1.6.0 version releases, support continues for 1.6, 1.5, and 1.4. Support for Konvoy version 1.3.x expires. Users should  upgrade their Konvoy clusters with every new release to stay up to date with the latest features and bug fixes.

You can read more about our official support policy in [D2iQ Support and Maintenance Terms](https://d2iq.com/legal/support-terms).

## Supported Kubernetes versions

Each Konvoy release supports a range of Kubernetes versions. The [Release Notes](../release-notes) describe these versions.

For example, Konvoy 1.5.0 supports:

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.15.4 |
|**Maximum** | 1.18.18 |
|**Default** | 1.18.18 |

## Supported operating systems

Details for supported operating systems on Konvoy can be found in [Supported Operating Systems](../install/supported-operating-systems).

## Supported Kubernetes-Base-Addons (KBA) versions

Konvoy support for KBA depends on the Kubernetes version it deploys with. Every KBA release has the supported Kubernetes version in its tag.

For example, KBA version `stable-1.17-2.1.1` is made up of:

```text
<release_channel>-<kubernetes_version>-<kba_version>
```

This means this set of addons can deploy on any 1.17 Kubernetes cluster, regardless of the distribution. The support policy for KBA on Konvoy follows the same support policy for [Kubernetes versions](#supported-kubernetes-versions). You can find more details for KBA under [Kubernetes Base Addons](../addons).

### Features in Upgrade Patches

Occasionally, to make new features available at a faster rate, D2iQ releases features as part of a patch release. If the Release Notes indicate a feature you need and do not yet have, consider upgrading to the latest version to take full advantage of new features and functions.

### Experimental Status
"Experimental" means software, features, functionality, sample configurations, or other speculative content that is still under exploration, development, or testing by D2iQ. Experimental components carry no guarantee of eventual release as GA and therefore must not be used in Production Environments. Experimental components qualify for limited, Severity 4 support only and may be discontinued at any time, with or without notice.

Since Experimental components are not intended for Production Environment use, D2iQ cannot assume any responsibility for errors occurring during their use in Production. We can offer only these services in a commercially-reasonable manner, based on the availability of relevant subject matter experts (SMEs):

- General operational guidance for the Experimental component.
- Identifying and diagnosing of errors in configuration or implementation, if possible.
- Advice on preventing and recovering from failures and troubleshooting, as available.

Support for Experimental components is provided on a Standard level, Severity 4 basis only.

## Supported Kommander Versions

The following chart identifies which version of Konvoy supports which version of Kommander.

| Konvoy Version | Kommander Version |
| -------------- | ----------------- |
| 1.5.x | 1.1.x |
| 1.4.x | 1.0.x |

Konvoy and Kommander release `MAJOR.MINOR` versions together and are compatible with each other for that version set. This means, Kommander 1.1, and all of its patch versions (e.g. 1.1.0, 1.1.1), can deploy successfully on any version of Konvoy 1.5. Mixing minor versions is prohibited and the following is not supported:

- You cannot deploy Kommander 1.1.x on Konvoy 1.4.x
- You cannot deploy Kommander 1.0.x on Konvoy 1.3.x
