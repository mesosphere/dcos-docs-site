---
layout: layout.pug
origin: github.com/mesosphere/dcos-storage/docs/upgrades/index.md
navigationTitle: Upgrades
title: Upgrades
menuWeight: 35
excerpt: Instructions for upgrading the DC/OS Storage Service on a DC/OS Enterprise cluster.
enterprise: true
---

# Upgrade the DSS package to 1.0.x from 0.6.x

DSS 1.0 requires DC/OS Enterprise 1.13.2 or higher.
Therefore, to upgrade from DSS 0.6 to DSS 1.0, you must also upgrade DC/OS Enterprise.

## Prerequisites

* DC/OS Enterprise 1.13.2 or higher.

## Limitations

* The default behavior of device blacklisting has changed. Unless otherwise specified, all child devices of a blacklisted device will also be blacklisted. See the [`blacklist-exactly`](../volume-plugins/#blacklist-exactly) option for more information.
* DSS configuration options and permissions have changed and require different settings depending on the security mode of the cluster.
* The [volume plugins](../volume-plugins/) that ship with DSS 1.0 are newer than those from earlier DSS releases and should also be upgraded to enable full functionality. Plugins should be upgraded *after* the DSS package has been upgraded.

## Upgrading to DSS 1.0.x on permissive security clusters

1. Add the new DSS `.dcos` package to the [package registry](/latest/administering-clusters/package-registry/). You can download the `.dcos` package of the DC/OS Storage Service (DSS) from the [Mesosphere support site](https://support.mesosphere.com/hc/en-us/articles/213198586). You must have a Mesosphere support account in order to download software from this page.
    ```bash
    dcos registry add --dcos-file storage.dcos
    ```
1. Uninstall the currently running DSS package. Uninstalling leaves all storage configurations, devices, volumes, volume profiles, and volume providers intact.
    ```bash
    dcos package uninstall beta-storage
    ```
1. Create a storage principal for DSS, for example:
    ```bash
    dcos security org service-accounts keypair storage-private-key.pem storage-public-key.pem
    dcos security org service-accounts create -p storage-public-key.pem -d "DSS service account" storage-principal
    dcos security secrets create-sa-secret --strict storage-private-key.pem storage-principal storage/storage-private-key
    ```
1. Add the `dcos:adminrouter:ops:slave` permission by running the following command:
    ```bash
    dcos security org users grant storage-principal dcos:adminrouter:ops:slave full
    ```
1. Create an options JSON file for DSS that refers to the newly-created storage principal. For example, create a file named `storage.json` with the storage principal account name and secret name in the `service` section similar to the following:
    ```bash
    cat storage.json
    ```
    ```
    {
      "service": {
        "principal": "storage-principal",
        "secret-name": "storage/storage-private-key"
      }
    }
    ```
1. Install DSS using the configuration options file you created in the previous step.
    ```bash
    dcos package install storage --package-version=v1.0.0 --options=storage.json
    ```

## Upgrading DSS to 1.0.x on strict security clusters

1. Add the new DSS `.dcos` package to the [package registry](/latest/administering-clusters/package-registry/). You can download the `.dcos` package of the DC/OS Storage Service (DSS) from the [Mesosphere support site](https://support.mesosphere.com/hc/en-us/articles/213198586). You must have a Mesosphere support account in order to download software from this page.
    ```bash
    dcos registry add --dcos-file storage.dcos
    ```
1. Uninstall the currently running DSS package. Uninstalling leaves all storage configurations, devices, volumes, volume profiles, and volume providers intact.
    ```bash
    dcos package uninstall beta-storage
    ```
1. Add the `dcos:adminrouter:ops:slave` permission to the existing storage principal (e.g. `storage-principal`) by running the following command:
    ```bash
    dcos security org users grant storage-principal dcos:adminrouter:ops:slave full
    ```
1. Remove permissions that are not needed by DSS by running the following commands:
    ```bash
    dcos security org users revoke storage-principal dcos:adminrouter:package full
    dcos security org users revoke storage-principal dcos:adminrouter:service:marathon full
    dcos security org users revoke storage-principal dcos:adminrouter:service:storage full
    dcos security org users revoke storage-principal dcos:service:marathon:marathon:services:/ full
    ```
1. Update the existing package options for DSS by adding the `enforce-authorization` property as in the following example:
    ```bash
    cat storage.json
    ```
    ```
    {
      "service": {
        "enforce-authorization": true,
        "principal": "storage-principal",
        "secret-name": "storage/storage-private-key"
      }
    }
    ```
1. Install DSS using the configuration options file you updated in the previous step.
    ```bash
    dcos package install storage --package-version=v1.0.0 --options=storage.json
    ```

## Upgrading the 'devices' and 'lvm' volume plugins

1. Upgrade the `devices` and `lvm` plugin configurations. Run the following commands to use the default settings:
    ```bash
    dcos storage plugin-configuration generate --name=devices | \
        dcos storage plugin-configuration update
    dcos storage plugin-configuration generate --name=lvm | \
        dcos storage plugin-configuration update
    ```
1. Upgrade every `devices` and `lvm` provider to use the latest configuration. For example, to upgrade a single `lvm` provider named `lvm-ssds`, run the following command:
    ```bash
    cat <<EOF | dcos storage provider modify
    {
      "name": "lvm-ssds",
      "spec": { "plugin": { "config-version": "latest" } }
    }
    EOF
    ```
1. Confirm that every provider has been modified to use the latest configuration. For example, to generate a brief report, run the following command:
    ```bash
    dcos storage provider list --json | jq -r '.providers[] |
      [ .spec.plugin.name, .name, .spec.plugin."config-version" ] | @csv'
    ```
    ```
    "devices","devices-1555629792-279",4
    "devices","devices-1555629898-361",4
    "lvm","lvm-data-services-1555629335-818",8
    "lvm","lvm-data-services-1555629679-584",8
    ```

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
        curl -X DELETE --cacert dcos-ca.crt \
          -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
          $(dcos config show core.dcos_url)/exhibitor/exhibitor/v1/explorer/znode/dcos-storage/dss
        ```
1. Check agents for lingering CSI plugins and/or DSS-created LVM volumes/groups. Then, for every agent, do the following:
    1. Stop the agent.
    1. Kill all CSI plugin processes (such as, `csilvm` and `devices-plugin`).
        ```bash
        pkill csilvm && pkill devices-plugin
        ```
    1. Remove files under the Mesos resource provider configuration directory.
        ```bash
        rm /var/lib/dcos/mesos/resource-providers/*
        ```
    1. Remove checkpointed CSI volume state.
        ```bash
        rm -r /var/lib/mesos/slave/csi/
        ```
    1. Remove the latest symlink for each Mesos resource provider.
        ```bash
        rm /var/lib/mesos/slave/meta/slaves/latest/resource_providers/org.apache.mesos.rp.local.storage/*/latest
        ```
    1. Remove any DSS-created LVM volume groups and/or volumes.
        ```bash
        vgremove -f some-volumegroup-name
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
        pkill csilvm && pkill devices-plugin
        ```
    1. Remove files under the Mesos resource provider configuration directory.
        ```bash
        rm /var/lib/dcos/mesos/resource-providers/*
        ```
    1. Remove checkpointed CSI volume state.
        ```bash
        rm -r /var/lib/mesos/slave/csi/
        ```
    1. Remove the latest symlink for each Mesos resource provider.
        ```bash
        rm /var/lib/mesos/slave/meta/slaves/latest/resource_providers/org.apache.mesos.rp.local.storage/*/latest
        ```
    1. Remove any DSS-created LVM volume groups and/or volumes.
        ```bash
        vgremove -f some-volumegroup-name
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
        pkill csilvm && pkill devices-plugin
        ```
    1. Remove files under Mesos resource provider configuration directory.
        ```bash
        rm /opt/mesosphere/etc/mesos/resource-providers/*
        ```
    1. Remove checkpointed CSI volume state.
        ```bash
        rm -r /var/lib/mesos/slave/csi/
        ```
    1. Remove the latest symlink for the agent.
        ```bash
        rm /var/lib/mesos/slave/slaves/latest
        ```
    1. Remove any DSS-created LVM volume groups and/or volumes.
        ```bash
        vgremove -f some-volumegroup-name
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
        pkill csilvm && pkill devices-plugin
        ```
    1. Remove files under Mesos resource provider configuration directory.
        ```bash
        rm /opt/mesosphere/etc/mesos/resource-providers/*
        ```
    1. Remove checkpointed CSI volume state.
        ```bash
        rm -r /var/lib/mesos/slave/csi/
        ```
    1. Remove the latest symlink for the agent.
        ```bash
        rm /var/lib/mesos/slave/slaves/latest
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
