---
layout: layout.pug
origin: github.com/mesosphere/dcos-storage/docs/upgrades/index.md
navigationTitle: Upgrades
title: Upgrades
menuWeight: 35
excerpt: Instructions for upgrading the DC/OS Storage Service on a DC/OS Enterprise cluster.
enterprise: true
beta: true
---
#include /services/include/beta-software-warning.tmpl

# Manually upgrade the DSS package to 0.6.x from 0.5.x

DSS 0.6 requires DC/OS Enterprise 1.13.0 or higher.
Therefore, to upgrade from DSS 0.5 to DSS 0.6, you will also need to upgrade DC/OS Enterprise.

<p class="message--warning"><strong>WARNING: </strong>
  Performing this upgrade will remove all DSS-managed plugins, volumes, volume providers, and volume profiles from your cluster.
  Please back up any important data before proceeding.
</p>

Please follow these steps to upgrade:

1. Remove DSS created [volumes](../cli-references/dcos-storage-volume/dcos-storage-volume-remove/) and [volume providers](../cli-references/dcos-storage-provider/dcos-storage-provider-remove/) from all agents in the cluster.
1. [Uninstall](../uninstall/) DSS.
1. Remove volume, volume providers, and related assets from Zookeeper. There are two ways to do this:
    1. Delete DSS state (`/dcos-storage/dss`) using the Exhibitor UI at `<dcos-url>/exhibitor/exhibitor/v1/ui/index.html`; or else
    1. Delete DSS state using the Exhibitor API:
        ```bash
        $ curl -X DELETE --cacert dcos-ca.crt \
          -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
          $(dcos config show core.dcos_url)/exhibitor/exhibitor/v1/explorer/znode/dcos-storage/dss
        ```
1. Check agents for lingering CSI plugins and/or DSS-created LVM volumes/groups. Then, for every agent, do the following:
    1. Stop the agent.
    1. Kill all CSI plugin processes (such as, `csilvm` and `devices-plugin`).
        ```bash
        $ pkill csilvm && pkill devices-plugin
        ```
    1. Remove files under the Mesos resource provider configuration directory.
        ```bash
        $ rm /var/lib/dcos/mesos/resource-providers/*
        ```
    1. Remove checkpointed CSI volume state.
        ```bash
        $ rm -r /var/lib/mesos/slave/csi/
        ```
    1. Remove the latest symlink for each Mesos resource provider.
        ```bash
        $ rm /var/lib/mesos/slave/meta/slaves/latest/resource_providers/org.apache.mesos.rp.local.storage/*/latest
        ```
    1. Remove any DSS-created LVM volume groups and/or volumes.
        ```bash
        $ vgremove -f some-volumegroup-name
        ```
1. Upgrade DC/OS Enterprise to 1.13.0.
1. [Install](../install/) DSS 0.6.
1. Follow [these steps](../cli-references/dcos-storage-device/) to install device providers on desired nodes.

# Manually upgrade the DSS package to 0.5.x from 0.4.x

DSS 0.5 requires DC/OS Enterprise 1.12.1 or higher.
Therefore, to upgrade from DSS 0.4 to DSS 0.5, you will also need to upgrade DC/OS Enterprise.

<p class="message--warning"><strong>WARNING: </strong>
  Performing this upgrade will remove all DSS-managed plugins, volumes, volume providers, and volume profiles from your cluster.
  Please back up any important data before proceeding.
</p>

Please follow these steps to upgrade:

1. Remove DSS created [volumes](../cli-references/dcos-storage-volume/dcos-storage-volume-remove/) and [volume providers](../cli-references/dcos-storage-provider/dcos-storage-provider-remove/) from all agents in the cluster.
1. [Uninstall](../uninstall/) DSS.
1. Remove volume, volume providers, and related assets from Zookeeper.
1. Check agents for lingering CSI plugins and/or DSS-created LVM volumes/groups. Then, for every agent, do the following:
    1. Stop the agent.
    1. Kill all CSI plugin processes (such as, `csilvm` and `devices-plugin`).
        ```bash
        $ pkill csilvm && pkill devices-plugin
        ```
    1. Remove files under the Mesos resource provider configuration directory.
        ```bash
        $ rm /var/lib/dcos/mesos/resource-providers/*
        ```
    1. Remove checkpointed CSI volume state.
        ```bash
        $ rm -r /var/lib/mesos/slave/csi/
        ```
    1. Remove the latest symlink for each Mesos resource provider.
        ```bash
        $ rm /var/lib/mesos/slave/meta/slaves/latest/resource_providers/org.apache.mesos.rp.local.storage/*/latest
        ```
    1. Remove any DSS-created LVM volume groups and/or volumes.
        ```bash
        $ vgremove -f some-volumegroup-name
        ```
1. Upgrade DC/OS Enterprise to 1.12.1.
1. [Install](../install/) DSS 0.5.
1. Follow [these steps](../cli-references/dcos-storage-device/) to install device providers on desired nodes.

If DSS 0.4 is not removed before upgrading DC/OS Enterprise to 1.12.1, you might see the following fatal error on agents:
```
Check failed: update.status().resource_provider_id() == resourceProvider->info.id()
```
If you encounter this error, please downgrade all failed agents to DC/OS Enterprise 1.12.0 and follow the above steps, then upgrade the agents again.

# Manually upgrade the DSS package to 0.4.0 from 0.3.0

<p class="message--warning"><strong>WARNING: </strong>
  Performing this upgrade will remove all DSS-managed plugins, volumes, volume providers, and volume profiles from your cluster.
  Please back up any important data before proceeding.
</p>

Please follow these steps to upgrade:

1. Remove DSS created [volumes](../cli-references/dcos-storage-volume/dcos-storage-volume-remove/) and [volume providers](../cli-references/dcos-storage-provider/dcos-storage-provider-remove/) from all agents in the cluster.
1. [Uninstall](../uninstall/) DSS.
1. Remove volume, volume providers, and related assets from Zookeeper.
1. Check agents for lingering CSI plugins and/or DSS-created LVM volumes/groups. Then, for every agent, do the following:
    1. Stop the agent.
    1. Kill all CSI plugin processes (such as, `csilvm` and `devices-plugin`).
        ```bash
        $ pkill csilvm && pkill devices-plugin
        ```
    1. Remove files under Mesos resource provider configuration directory.
        ```bash
        $ rm /opt/mesosphere/etc/mesos/resource-providers/*
        ```
    1. Remove checkpointed CSI volume state.
        ```bash
        $ rm -r /var/lib/mesos/slave/csi/
        ```
    1. Remove the latest symlink for the agent.
        ```bash
        $ rm /var/lib/mesos/slave/slaves/latest
        ```
    1. Remove any DSS-created LVM volume groups and/or volumes.
        ```bash
        $ vgremove -f some-volumegroup-name
        ```
1. [Install](../install/) DSS 0.4.
1. Follow [these steps](../cli-references/dcos-storage-device/) to install device providers on desired nodes.

# Manually upgrade the DSS package to 0.3.0 from 0.2.0

DSS 0.3 requires DC/OS Enterprise 1.12 or later, but DSS 0.2 only works for DC/OS Enterprise 1.11.
Therefore, to upgrade from DSS 0.2 to DSS 0.3, you will also need to upgrade DC/OS Enterprise.

<p class="message--warning"><strong>WARNING: </strong>
  Performing this upgrade will remove all DSS-managed plugins, volumes, volume providers, and volume profiles from your cluster.
  Please back up any important data before proceeding.
</p>

Since there are some breaking changes between DSS 0.2 and DSS 0.3, please perform the following steps to upgrade:

1. Remove DSS created [volumes](../cli-references/dcos-storage-volume/dcos-storage-volume-remove/) and [volume providers](../cli-references/dcos-storage-provider/dcos-storage-provider-remove/) from all agents in the cluster.
1. [Uninstall](../uninstall/) DSS.
1. Remove volume, volume providers, and related assets from Zookeeper.
1. For every agent, do the following:
    1. Stop the agent.
    1. Kill all CSI plugin processes (such as, `csilvm` and `devices-plugin`).
        ```bash
        $ pkill csilvm && pkill devices-plugin
        ```
    1. Remove files under Mesos resource provider configuration directory.
        ```bash
        $ rm /opt/mesosphere/etc/mesos/resource-providers/*
        ```
    1. Remove checkpointed CSI volume state.
        ```bash
        $ rm -r /var/lib/mesos/slave/csi/
        ```
    1. Remove the latest symlink for the agent.
        ```bash
        $ rm /var/lib/mesos/slave/slaves/latest
        ```
1. Upgrade DC/OS Enterprise to 1.12.
1. [Install](../install/) DSS 0.3.
1. Follow [these steps](../cli-references/dcos-storage-device/) to install device providers on desired nodes.

# Manually upgrade the DSS package to v0.2.0 from v0.1.0

<p class="message--warning"><strong>WARNING: </strong>
  Performing this upgrade will remove all DSS-managed plugins, volumes, volume providers, and volume profiles from your cluster.
  Please back up any important data before proceeding.
</p>

1. [Uninstall](../uninstall/) the currently installed DSS package and package repository.
1. Remove volume, volume providers, and related assets from Zookeeper.
1. Remove DSS-created volumes and volume providers from all agents in the cluster.
1. [Install](../install/) the latest release of DSS.
