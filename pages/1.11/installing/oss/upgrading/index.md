---
layout: layout.pug
navigationTitle:  Upgrading
excerpt:
title: Upgrading
menuWeight: 4
---

An upgrade is the process of adding new features, replacing the existing features with new features/functionality or adding a major configuration change. You can upgrade DC/OS only if you have used the installation process to install DC/OS on your cluster.
Example: 1.X to 1.Y (1.11 --> 1.12)

**Note:** An upgrade occurs only between major releases.

 If an upgrade is performed on a supported OS with all prerequisites fulfilled, this upgrade _should_ preserve the state of running tasks on the cluster. This document reuses portions of the [Advanced DC/OS Installation Guide][advanced-install].

**Important:**

- Review the [release notes](/1.11/release-notes/) before upgrading DC/OS.
- If IPv6 is disabled in the kernel, the `config.yaml` file will need to contain `enable_ipv6: 'false'`
- The Advanced installation method is the _only_ recommended upgrade path for DC/OS. It is recommended that you familiarize yourself with the [Advanced DC/OS Installation Guide][advanced-install] before proceeding.
- The DC/OS UI and APIs may be inconsistent or unavailable while masters are being upgraded. Avoid using the DC/OS UI and APIs until all masters have been upgraded and have rejoined the cluster.
- Task history in the Mesos UI will not persist through the upgrade.

## Prerequisites

- Mesos, Mesos Frameworks, Marathon, Docker, and all running tasks in the cluster should be stable and in a known healthy state.
- For Mesos compatibility reasons, we recommend upgrading any running Marathon-on-Marathon instances to Marathon version 1.5 before upgrading.
- You must have access to copies of the config files used with DC/OS 1.10: `config.yaml` and `ip-detect`.
- You must be using systemd 218 or newer to maintain task state.
- All hosts (masters and agents) must be able to communicate with all other hosts on all ports, for both TCP and UDP.
- In CentOS or RedHat, install IP sets with this command (used in some IP detect scripts): `sudo yum install -y ipset`.
- You must be familiar with using `systemctl` and `journalctl` command line tools to review and monitor service status. Troubleshooting notes can be found at the end of this [document](#troubleshooting).
- You must be familiar with the [Advanced DC/OS Installation Guide][advanced-install].
- Take a snapshot of ZooKeeper prior to upgrading. Marathon supports rollbacks, but does not support downgrades.
- Ensure that Marathon event subscribers are disabled before beginning the upgrade. Leave them disabled after completing the upgrade, as this feature is now deprecated.
- Verify that all Marathon application constraints are valid before beginning the upgrade.  Use this [script](https://github.com/mesosphere/public-support-tools/blob/master/check-constraints.py) to check if your constraints are valid.
- Optional: You can add custom [node and cluster healthchecks](/1.11/installing/oss/custom/node-cluster-health-check/#custom-health-checks) to your `config.yaml`.
- Verify that all your masters are in a healthy state: 
   - Check the Exhibitor UI to confirm that all masters have joined the quorum successfully (the status indicator will show green). The Exhibitor UI is available at `http://<dcos_master>:8181/`.
   - Verify that `curl http://<dcos_master_private_ip>:5050/metrics/snapshot` has the metric `registrar/log/recovered` with a value of `1` for each master.

## Supported upgrade paths

- From the latest GA version of 1.9 to the latest GA version of 1.10. For example, if 1.9.2 is the latest and 1.10.0 is the latest, this upgrade would be supported.
- From any 1.10 release to the next. For example, an upgrade from 1.10.1 to 1.10.2 would be supported.
- From any 1.10 release to an identical 1.10 release. For example, an upgrade from 1.10.0 to 1.10.0 would be supported. This is useful for making configuration changes.

## Instructions

### Bootstrap Nodes

1.  Copy and update the DC/OS 1.10 `config.yaml` and `ip-detect` files to a new, clean folder on your bootstrap node.

    **Important:**

    *  You cannot change the `exhibitor_zk_backend` setting during an upgrade.
    *  The syntax of the DC/OS 1.11 `config.yaml` differs from that of previous versions. See the [documentation](/1.11/installing/oss/custom/configuration/configuration-parameters/) for the latest information.

1.  After updating the format of the `config.yaml`, compare the old `config.yaml` and new `config.yaml`.  Verify that there are no differences in pathways or configurations. Changing these while upgrading can lead to catastrophic cluster failures.

1.  After you have converted your 1.10 `config.yaml` into the 1.11 `config.yaml` format, you can build your installer package:

    1.  Download the file `dcos_generate_config.sh`.
    1.  Generate the installation files. Replace `<installed_cluster_version>` in the below command with the DC/OS version currently running on the cluster you intend to upgrade, for example `1.9.2`.
        ```bash
        dcos_generate_config.sh --generate-node-upgrade-script <installed_cluster_version>
        ```
    1.  The command in the previous step will produce a URL in the last line of its output, prefixed with `Node upgrade script URL:`. Record this URL for use in later steps. It will be referred to in this document as the "Node upgrade script URL".
    1.  Run the [nginx][advanced-install] container to serve the installation files. <!-- ?? -->

### DC/OS Masters

Proceed with upgrading every master node one-at-a-time in any order using the following procedure. When you complete each upgrade, monitor the Mesos master metrics to ensure the node has rejoined the cluster and completed reconciliation.

1.  Download and run the node upgrade script:

    ```bash
    curl -O <Node upgrade script URL>
    sudo bash ./dcos_node_upgrade.sh
    ```

1.  Verify that the upgrade script succeeded and exited with the status code `0`:
    ```bash
    echo $?
    0
    ```

1.  Validate the upgrade:

    - Monitor the Exhibitor UI to confirm that the Master rejoins the ZooKeeper quorum successfully (the status indicator will turn green).  The Exhibitor UI is available at `http://<dcos_master>:8181/`.
    - Verify that `http://<dcos_master>/mesos` indicates that the upgraded master is running Mesos 1.5.0.

### DC/OS Agents

Proceed with upgrading every agent in any order. Agent upgrades can be parallelized with a few caveats. During an upgrade the Mesos agent will go offline briefly (tasks will continue to run) and load on the Master nodes will increase slightly and proportional to the number of Agents rejoining the cluster. For maximum service availability, upgrade Agents one at a time and only perform parallel upgrades if the larger upgrade batch size has been well-tested with the same workload.

### On all DC/OS Agents:

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

    - Monitor the Mesos UI to verify that the upgraded node rejoins the DC/OS cluster and that tasks are reconciled (`http://<dcos_master>/mesos`).

## <a name="troubleshooting"></a>Troubleshooting Recommendations

The following commands should provide insight into upgrade issues:

### On All Cluster Nodes

```bash
sudo journalctl -u dcos-download
sudo journalctl -u dcos-spartan
sudo systemctl | grep dcos
```

If your upgrade fails because of a [custom node or cluster check](/1.11/installing/oss/custom/node-cluster-health-check/), run these commands for more details:

```bash
dcos-diagnostics check node-poststart
dcos-diagnostics check cluster
```

### On DC/OS Masters

```bash
sudo journalctl -u dcos-exhibitor
less /var/lib/dcos/exhibitor/zookeeper/zookeeper.out
sudo journalctl -u dcos-mesos-dns
sudo journalctl -u dcos-mesos-master
```

### On DC/OS Agents

```bash
sudo journalctl -u dcos-mesos-slave
```

## Notes:

- Packages available in the DC/OS 1.11 Universe are newer than those in the DC/OS 1.10 Universe. Services are not automatically upgraded when DC/OS 1.10 is installed because not all DC/OS services have upgrade paths that will preserve existing state.

[advanced-install]: /1.11/installing/oss/custom/advanced
