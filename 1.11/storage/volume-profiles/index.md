---
layout: layout.pug
navigationTitle: Volume Profiles
title: Volume Profiles
menuWeight: 40
excerpt:
enterprise: true
beta: true
---

A [volume provider](/1.11/cli/command-reference/dcos-storage/dcos-storage-provider) manages storage capacity offered by a [Container Storage Interface (CSI) plugin](https://github.com/apache/mesos/blob/master/docs/csi.md) to the DC/OS cluster through a DC/OS [storage plugin](/1.11/storage/plugins/). A DC/OS storage plugin consists of a CSI plugin along with code that integrates the CSI plugin into DC/OS. A volume provider that specifies its plugin as "lvm" is referred to as a "lvm" volume provider.

A [volume profile](/1.11/cli/command-reference/dcos-storage/dcos-storage-profile) represents volumes based on [volume provider](/1.11/cli/command-reference/dcos-storage/dcos-storage-provider) or volume parameters and labels. For example, if you want to differentiate between HDDs and SSDs for different purposes, you can create a "fast" volume profile that identifies your SSDs and a "slow" volume profile that identifies your HDDs. If your framework, say Cassandra, distinguishes between "cache" and "archive" storage you can then configure it to map your "fast" volume profile to Cassandra’s "cache" storage and your "slow" volume profile to Cassandra’s "archive" storage.

Once you have configured a volume provider and a volume profile you use the `dcos storage volume` subcommands to create and manage [volumes](/1.11/cli/command-reference/dcos-storage/dcos-storage-volume).


# Create a volume profile
