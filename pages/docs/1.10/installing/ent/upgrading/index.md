---
layout: layout.pug
navigationTitle:  Upgrading
title: Upgrading
menuWeight: 4
excerpt:
featureMaturity:
enterprise: true
---

This document provides instructions for upgrading a DC/OS cluster.  

If this upgrade is performed on a supported OS with all prerequisites fulfilled, this upgrade _should_ preserve the state of running tasks on the cluster.  This document reuses portions of the [Advanced DC/OS Installation Guide][advanced-install].  

**Important:**

- Review the [release notes](/docs/1.10/release-notes/) before upgrading DC/OS.
- The DC/OS GUI and other higher-level system APIs may be inconsistent or unavailable until all master nodes have been upgraded. For example, an upgraded DC/OS Marathon leader cannot connect to the leading Mesos master until it has also been upgraded. When this occurs:

    - The DC/OS GUI may not provide an accurate list of services.
    - For multi-master configurations, after one master has finished upgrading, you can monitor the health of the remaining masters from the Exhibitor UI on port 8181.
- An upgraded DC/OS Marathon leader cannot connect to an non-secure (i.e. not upgraded) leading Mesos master. The DC/OS UI cannot be trusted until all masters are upgraded. There are multiple Marathon scheduler instances and multiple Mesos masters, each being upgraded, and the Marathon leader may not be the Mesos leader.
- Task history in the Mesos UI will not persist through the upgrade.
- Before you upgrade from 1.9 to 1.10, you must upgrade Marathon-LB. Do this by uninstalling Marathon-LB and reinstalling the latest package.
- Enterprise DC/OS downloads can be found [here](https://support.mesosphere.com/hc/en-us/articles/213198586-Mesosphere-Enterprise-DC-OS-Downloads).

## Supported upgrade paths
- From the latest GA version of previous to the latest GA version of current. For example, if 1.8.8 is the latest and 1.9.0 is the latest, this upgrade would be supported.
    - [1.7 to 1.8](/docs/1.8/administration/upgrading/)
    - [1.8 to 1.9](/docs/1.10/administration/upgrading/)
    - [1.9 to 1.10](/docs/1.10/administration/upgrading/)
- From any current release to the next. For example, an upgrade from 1.9.1 to 1.9.2 would be supported.
- From any current release to an identical release. For example, an upgrade from 1.9.0 to 1.9.0 would be supported. This is useful for making configuration changes.


## Modifying DC/OS configuration

You _cannot_ change your cluster configuration at the same time as upgrading to a new version. Cluster configuration changes must be done with an update to an already installed version. For example, you cannot simultaneously upgrade a cluster from 1.10.x to 1.10.y and add more public agents. You can add more public agents with an update to 1.10.x, and then upgrade to 1.10.y. Or you can upgrade to 1.10.y and then add more public agents by updating 1.10.y after the upgrade.

To modify your DC/OS configuration, you must run the installer with the modified `config.yaml` and update your cluster using the new installation files. Changes to the DC/OS configuration have the same risk as upgrading a host. Incorrect configurations could potentially crash your hosts, or an entire cluster.

Only a subset of DC/OS configuration parameters can be modified. The adverse effects on any software that is running on top of DC/OS is outside of the scope of this document. Contact Mesosphere Support for more information.

Here is a list of the parameters that you can modify:

- [`check_time`](/docs/1.10/installing/ent/custom/configuration-parameters/#check-time)
- [`dns_search`](/docs/1.10/installing/ent/custom/configuration-parameters/#dns-search)
- [`docker_remove_delay`](/docs/1.10/installing/ent/custom/configuration-parameters/#docker-remove)
- [`gc_delay`](/docs/1.10/installing/ent/custom/configuration-parameters/#gc-delay)
- [`resolvers`](/docs/1.10/installing/ent/custom/configuration-parameters/#resolvers)
- [`telemetry_enabled`](/docs/1.10/installing/ent/custom/configuration-parameters/#telemetry-enabled)
- [`use_proxy`](/docs/1.10/installing/ent/custom/configuration-parameters/#use-proxy)
    - [`http_proxy`](/docs/1.10/installing/ent/custom/configuration-parameters/#use-proxy)
    - [`https_proxy`](/docs/1.10/installing/ent/custom/configuration-parameters/#use-proxy)
    - [`no_proxy`](/docs/1.10/installing/ent/custom/configuration-parameters/#use-proxy)

The security mode (`security`) can be changed but has special caveats.

- You can only update to a stricter security mode. Security downgrades are not supported. For example, if your cluster is in `permissive` mode and you want to downgrade to `disabled` mode, you must reinstall the cluster and terminate all running workloads.
- During each update, you can only increase your security by a single level. For example, you cannot update directly from `disabled` to `strict` mode. To increase from `disabled` to `strict` mode you must first update to `permissive` mode, and then update from `permissive` to `strict` mode.

See the security [mode](/docs/1.10/installing/ent/custom/configuration-parameters/#security) for a description of the different security modes and what each means.

# Instructions
These steps must be performed for version upgrades and cluster configuration changes.

## Prerequisites

- Mesos, Mesos Frameworks, Marathon, Docker and all running tasks in the cluster should be stable and in a known healthy state.
- For Mesos compatibility reasons, we recommend upgrading any running Marathon-on-Marathon instances to Marathon version 1.3.5 before proceeding with this DC/OS upgrade.
- You must have access to copies of the config files used with the previous DC/OS version: `config.yaml` and `ip-detect`.
- You must be using systemd 218 or newer to maintain task state.
- All hosts (masters and agents) must be able to communicate with all other hosts on all ports, for both TCP and UDP.
- In CentOS or RedHat, install IP sets with this command (used in some IP detect scripts): `sudo yum install -y ipset`
- You must be familiar with using `systemctl` and `journalctl` command line tools to review and monitor service status. Troubleshooting notes can be found at the end of this [document](#troubleshooting).
- You must be familiar with the [Advanced DC/OS Installation Guide][advanced-install].
- Take a snapshot of ZooKeeper prior to upgrading. Marathon supports rollbacks, but does not support downgrades.
- Ensure that Marathon event subscribers are disabled before beginning the upgrade. Leave them disabled after completing the upgrade, as this feature is now deprecated.
- Verify that all Marathon application constraints are valid before beginning the upgrade. Use [this script](https://github.com/mesosphere/public-support-tools/blob/master/check-constraints.py) to check if your constraints are valid.
- [Back up your cluster](/docs/1.10/administering-clusters/backup-and-restore/).
- Optional: You can add custom [node and cluster healthchecks](/docs/1.10/installing/ent/custom/node-cluster-health-check/#custom-health-checks) to your `config.yaml`.

## Bootstrap Node

Choose your desired security mode and then follow the applicable upgrade instructions.

- [Installing DC/OS 1.10 without changing security mode](#current-security)
- [Installing DC/OS 1.10 in permissive mode](#permissive)
- [Installing DC/OS 1.10 in strict mode](#strict)

# <a name="current-security"></a>Installing DC/OS 1.10 without changing security mode
This procedure upgrades a DC/OS 1.9 cluster to DC/OS 1.10 without changing the cluster's [security mode](/docs/1.10/installing/ent/custom/configuration-parameters/#security).

1.  Copy your existing `config.yaml` and `ip-detect` files to an empty `genconf` folder on your bootstrap node. The folder should be in the same directory as the installer.
1.  Merge the old `config.yaml` into the new `config.yaml` format. In most cases the differences will be minimal.

    **Important:**

    *  You cannot change the `exhibitor_zk_backend` setting during an upgrade.
    *  The syntax of the `config.yaml` may be different from the earlier version. For a detailed description of the current `config.yaml` syntax and parameters, see the [documentation](/docs/1.10/installing/ent/custom/configuration-parameters/).
1. After updating the format of the config.yaml, compare the old config.yaml and new config.yaml. Verify that there are no differences in pathways or configurations. Changing these while upgrading can lead to catastrophic cluster failures.
1.  Modify the `ip-detect` file as desired.
1.  Build your installer package.

    1.  Download the `dcos_generate_config.ee.sh` file.
    1.  Generate the installation files. Replace `<installed_cluster_version>` in the below command with the DC/OS version currently running on the cluster you intend to upgrade, for example `1.8.8`.
        ```bash
        dcos_generate_config.ee.sh --generate-node-upgrade-script <installed_cluster_version>
        ```
    1.  The command in the previous step will produce a URL in the last line of its output, prefixed with `Node upgrade script URL:`. Record this URL for use in later steps. It will be referred to in this document as the "Node upgrade script URL".
    1.  Run the [nginx][advanced-install] container to serve the installation files.

1.  Go to the DC/OS Master [procedure](#masters) to complete your installation.

# <a name="permissive"></a>Installing DC/OS 1.10 in permissive mode
This procedure upgrades to DC/OS 1.10 in [permissive security mode](/docs/1.10/installing/ent/custom/configuration-parameters/#security).

**Prerequisite:**

- Your cluster must be [upgraded to DC/OS 1.10](#current-security) and running in [disabled security mode](/docs/1.10/installing/ent/custom/configuration-parameters/#security) before it can be upgraded to permissive mode. If your cluster was running in permissive mode before it was upgraded to DC/OS 1.10, you can skip this procedure.

**Important:** Any [custom node or cluster healthchecks](/docs/1.10/installing/ent/custom/node-cluster-health-check/#custom-health-checks) you have configured will fail for an upgrade from disabled to permissive security mode. A future release will allow you to bypass the healthchecks.

To update a cluster from disabled security to permissive security, complete the following procedure:

1.  Replace `security: disabled` with `security: permissive` in your `config.yaml`. Do not make any other changes to pathways or configurations in the `config.yaml`.
1.  Modify the `ip-detect` file as desired.
1.  Build your installer package.

    1.  Download the `dcos_generate_config.ee.sh` file.
    1.  Generate the installation files. Replace `<installed_cluster_version>` in the below command with the DC/OS version currently running on the cluster you intend to upgrade, for example `1.8.8`.
        ```bash
        dcos_generate_config.ee.sh --generate-node-upgrade-script <installed_cluster_version>
        ```
    1.  The command in the previous step will produce a URL in the last line of its output, prefixed with `Node upgrade script URL:`. Record this URL for use in later steps. It will be referred to in this document as the "Node upgrade script URL".
    1.  Run the [nginx][advanced-install] container to serve the installation files.

1.  Go to the DC/OS Master [procedure](#masters) to complete your installation.

# <a name="strict"></a>Installing DC/OS 1.10 in strict mode
This procedure upgrades to DC/OS 1.10 in security strict [mode](/docs/1.10/installing/ent/custom/configuration-parameters/#security).

If you are updating a running DC/OS cluster to run in `security: strict` mode, beware that security vulnerabilities may persist even after migration to strict mode. When moving to strict mode, your services will now require authentication and authorization to register with Mesos or access its HTTP API. You should test these configurations in permissive mode before upgrading to strict, to maintain scheduler and script uptimes across the upgrade.

**Prerequisites:**

- Your cluster must be [upgraded to DC/OS 1.10](#current-security) and running in [permissive security mode](#permissive) before it can be updated to strict mode. If your cluster was running in strict mode before it was upgraded to DC/OS 1.10, you can skip this procedure.
- If you have running pods or if the Mesos "HTTP command executors" feature has been enabled in a custom configuration, you must restart these tasks in DC/OS 1.10 permissive security mode before upgrading to strict mode. Otherwise, these tasks will be restarted when the masters are upgraded.

To update a cluster from permissive security to strict security, complete the following procedure:

1.  Replace `security: permissive` with `security: strict` in your `config.yaml`. Do not make any other changes to pathways or configurations in the `config.yaml`.
1.  Modify the `ip-detect` file as desired.
1.  Build your installer package.

    1.  Download the `dcos_generate_config.ee.sh` file.
    1.  Generate the installation files. Replace `<installed_cluster_version>` in the below command with the DC/OS version currently running on the cluster you intend to upgrade, for example `1.8.8`.
        ```bash
        dcos_generate_config.ee.sh --generate-node-upgrade-script <installed_cluster_version>
        ```
    1.  The command in the previous step will produce a URL in the last line of its output, prefixed with `Node upgrade script URL:`. Record this URL for use in later steps. It will be referred to in this document as the "Node upgrade script URL".
    1.  Run the [nginx][advanced-install] container to serve the installation files.

1.  Go to the DC/OS Master [procedure](#masters) to complete your installation.

## <a name="masters"></a>DC/OS Masters

Proceed with upgrading every master node one-at-a-time in any order using the following procedure. When you complete each upgrade, monitor the Mesos master metrics to ensure the node has rejoined the cluster and completed reconciliation.

1.  Download and run the node upgrade script:
    ```bash
    curl -O <Node upgrade script URL>
    sudo bash dcos_node_upgrade.sh
    ```

1.  Verify that the upgrade script succeeded and exited with the status code `0`:
    ```bash
    echo $?
    0
    ```

1.  Validate the upgrade:

    1.  Monitor Exhibitor and wait for it to converge at `http://<master-ip>:8181/exhibitor/v1/ui/index.html`. Confirm that the master rejoins the ZooKeeper quorum successfully (the status indicator will turn green).

        **Tip:** If you are upgrading from permissive to strict mode, this URL will be `https://...`.
    1.  Wait until the `dcos-mesos-master` unit is up and running.
    1.  Verify that `curl http://<dcos_master_private_ip>:5050/metrics/snapshot` has the metric `registrar/log/recovered` with a value of `1`.
        **Tip:** If you are upgrading from permissive to strict mode, this URL will be `curl https://...` and you will need a JWT for access.
    1.  Verify that `/opt/mesosphere/bin/mesos-master --version` indicates that the upgraded master is running Mesos 1.2.0.

1.  Go to the DC/OS Agents [procedure](#agents) to complete your installation.

## <a name="agents"></a>DC/OS Agents

**Important:** When upgrading agent nodes, there is a 5 minute timeout for the agent to respond to health check pings from the mesos-masters before it is considered lost and its tasks are given up for dead.

On all DC/OS agents:

1.  Navigate to the `/opt/mesosphere/lib` directory and delete this library file. Deleting this file will prevent conflicts.

    ```bash
      libltdl.so.7
    ```

1.  Download and run the node upgrade script:
    ```bash
    curl -O <Node upgrade script URL>
    sudo bash dcos_node_upgrade.sh
    ```

1.  Verify that the upgrade script succeeded and exited with the status code `0`:
    ```bash
    echo $?
    0
    ```

1.  Validate the upgrade:

    - Verify that `curl http://<dcos_agent_private_ip>:5051/metrics/snapshot` has the metric `slave/registered` with a value of `1`.
    - Monitor the Mesos UI to verify that the upgraded node rejoins the DC/OS cluster and that tasks are reconciled (`http://<master-ip>/mesos`). If you are upgrading from permissive to strict mode, this URL will be `https://<master-ip>/mesos`.

## <a name="troubleshooting"></a>Troubleshooting Recommendations

The following commands should provide insight into upgrade issues:

### On All Cluster Nodes

```bash
sudo journalctl -u dcos-download
sudo journalctl -u dcos-spartan
sudo systemctl | grep dcos
```

If your upgrade fails because of a [custom node or cluster check](/docs/1.10/installing/ent/custom/node-cluster-health-check/#custom-health-checks), run these commands for more details:
```bash
dcos-diagnostics check node-poststart
dcos-diagnostics check cluster
```
### On DC/OS Masters

```bash
sudo journalctl -u dcos-exhibitor
less /opt/mesosphere/active/exhibitor/usr/zookeeper/zookeeper.out
sudo journalctl -u dcos-mesos-dns
sudo journalctl -u dcos-mesos-master
```

### On DC/OS Agents

```bash
sudo journalctl -u dcos-mesos-slave
```

## Notes:

- Packages available in the DC/OS 1.10 Universe are newer than those in the older versions of Universe. Services are not automatically upgraded when DC/OS is installed because not all DC/OS services have upgrade paths that will preserve existing state.

[advanced-install]: /docs/1.10/installing/ent/custom/advanced/
