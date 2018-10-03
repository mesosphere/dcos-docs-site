---
layout: layout.pug
navigationTitle: Upgrades
title: Upgrades
menuWeight: 35
excerpt: Instructions for upgrading the DC/OS Storage Service on a DC/OS cluster.
enterprise: true
---

# Manually upgrade the DSS package to 0.3.0 from 0.2.0

DSS 0.3 requires DC/OS 1.12 or higher, but DSS 0.2 only works for 1.11.
Therefore, to upgrade from DSS 0.2 to DSS 0.3, you will also need to upgrade DC/OS.

Since there are some breaking changes between DSS 0.2 and DSS 0.3, please follow the following steps to upgrade:

* Remove DSS created [volumes](../cli-references/dcos-storage-volume/dcos-storage-volume-remove/) and [volume providers](../cli-references/dcos-storage-provider/dcos-storage-provider-remove/) from all agents in the cluster.
* [Uninstall](../uninstall/) DSS.
* Remove volume, volume providers, and related assets from Zookeeper.
* For every agent, do the followings:
  * Stop the agent.
  * Kill all CSI plugin processes (i.e., `csilvm` and `devices-plugin`).
    * `$ pkill csilvm && pkill devices-plugin`
  * Remove files under Mesos resource provider configuration directory.
    * `$ rm /opt/mesosphere/etc/mesos/resource-providers/*`
  * Remove checkpointed CSI volume state.
    * `$ rm -r /var/lib/mesos/slave/csi/`
  * Remove the latest symlink for the agent.
    * `$ rm /var/lib/mesos/slave/slaves/latest`
* Upgrade DC/OS to 1.12.
* [Install](../install/) DSS 0.3.
* Follow [steps](../cli-references/dcos-storage-device/) to install device providers on desired nodes.

# Manually upgrade the DSS package to v0.2.0 from v0.1.0

* [Uninstall](../uninstall/) the currently installed DSS package and package repository.
* Remove volume, volume providers, and related assets from Zookeeper.
* Remove DSS-created volumes and volume providers from all agents in the cluster.
* [Install](../install/) the latest release of DSS.
