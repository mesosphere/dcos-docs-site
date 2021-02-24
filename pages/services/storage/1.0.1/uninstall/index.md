---
layout: layout.pug
origin: github.com/mesosphere/dcos-storage/docs/uninstall/index.md
navigationTitle: Uninstall
title: Uninstall
menuWeight: 40
excerpt: Instructions for removing the DC/OS Storage Service from a DC/OS cluster
enterprise: true
---

# Uninstall the DC/OS Storage Service

1. Uninstall the storage service using the following command:
    ```bash
    dcos package uninstall storage
    ```
    ```
    WARNING: This action cannot be undone. This will uninstall [storage] and delete all of its persistent data (logs, configurations, database artifacts, everything).
    Please type the name of the service to confirm: storage
    Uninstalled package [storage] version [...]
    ```
1. Remove the storage package from the [package registry](/latest/administering-clusters/package-registry/) using the following command:
    ```bash
    dcos registry remove --package-name=storage --package-version=$PACKAGE_VERSION
    ```

# Manually remove DSS volume providers and their configuration from an agent

If DSS cannot remove a volume or volume provider, follow the steps below to manually remove them from an agent.

<p class="message--warning"><strong>WARNING: </strong>
  Performing these steps will remove all DSS-managed plugins, volumes, and volume providers from an agent.
  Be sure to back up any important data before proceeding.
</p>

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

# Manually remove remaining DSS configuration from ZooKeeper

Uninstalling the DSS package does not remove records for storage assets that DSS tracks in ZooKeeper.
Follow the steps below to remove storage state information from ZooKeeper.

<p class="message--warning"><strong>WARNING: </strong>
  Performing these steps will remove all DSS plugin configuration settings and volume profiles from the cluster.
  As a result of removing DSS from ZooKeeper, you might have volumes and volume providers left behind as orphaned data no longer associated with DSS.
  Be sure to back up any important data before proceeding.
</p>

1. Remove the top-level DSS ZooKeeper node.
    ```bash
    curl -X DELETE --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
      "$(dcos config show core.dcos_url)/exhibitor/exhibitor/v1/explorer/znode/dcos-storage/dss"
    ```
