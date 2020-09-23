---
layout: layout.pug
navigationTitle: Version Support Policy
title: Version Support Policy
menuWeight: 100
excerpt: Konvoy's supported version policy
enterprise: false
beta: true
---

D2iQ's supports N-2 of the latest `MAJOR.MINOR` version of Konvoy. For example, if you have Konvoy version 1.5, then D2iQ supports all patch versions of Konvoy 1.5, 1.4, and 1.3.

When the new 1.6.0 version releases, support continues for 1.6, 1.5, and 1.4. Support for Konvoy version 1.3.x expires. Users should  upgrade their Konvoy clusters with every new release to stay up to date with the latest features and bug fixes.

You can read more about our official support policy in [D2iQ Support and Maintenance Terms](https://d2iq.com/legal/support-terms).

## Supported Kubernetes versions

Each Konvoy release supports a range of Kubernetes versions. The [Release Notes](/dkp/konvoy/latest/release-notes/) describe these versions.

For example, Konvoy 1.5.0 supports:

| Kubernetes Support | Version |
| ------------------ | ------- |
|**Minimum** | 1.15.4 |
|**Maximum** | 1.17.11 |
|**Default** | 1.17.11 |

## Supported operating systems

Details for supported operating systems on Konvoy can be found in [Supported Operating Systems](/dkp/konvoy/latest/install/supported-operating-systems/).

## Supported Kubernetes-Base-Addons (KBA) versions

Konvoy support for KBA depends on the Kubernetes version it deploys with. Every KBA release has the supported Kubernetes version in its tag.

For example, KBA version `stable-1.17-2.1.1` is made up of:

```text
<release_channel>-<kubernetes_version>-<kba_version>
```

This means this set of addons can deploy on any 1.17 Kubernetes cluster, regardless of the distribution. The support policy for KBA on Konvoy follows the same support policy for [Kubernetes versions](#supported-kubernetes-versions). You can find more details for KBA under [Kubernetes Base Addons](/dkp/konvoy/1.5/addons/).

## Supported Kommander Versions

The following chart identifies which version of Konvoy supports which version of Kommander.

| Konvoy Version | Kommander Version |
| -------------- | ----------------- |
| 1.5.x | 1.1.x |
| 1.4.x | 1.0.x |

Konvoy and Kommander release `MAJOR.MINOR` versions together and are compatible with each other for that version set. This means, Kommander 1.1, and all of its patch versions (e.g. 1.1.0, 1.1.1), can deploy successfully on any version of Konvoy 1.5. Mixing minor versions is prohibited and the following is not supported:

- You cannot deploy Kommander 1.1.x on Konvoy 1.4.x
- You cannot deploy Kommander 1.0.x on Konvoy 1.3.x
