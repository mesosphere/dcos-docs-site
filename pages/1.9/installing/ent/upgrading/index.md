---
layout: layout.pug
navigationTitle:  Upgrading
title: Upgrading
menuWeight: 4
excerpt:

enterprise: true
---

An upgrade is the process of adding new features, replacing the existing features with new features/functionality or adding a major configuration change. You can upgrade DC/OS only if you have used the installation process to install DC/OS on your cluster.
Example: 1.X to 1.Y (1.9 --> 1.10)

**Note:** An upgrade occurs only between major releases.


If an upgrade is performed on a supported OS with all prerequisites fulfilled, this upgrade _should_ preserve the state of running tasks on the cluster.  This document reuses portions of the [Advanced DC/OS Installation Guide][advanced-install].  

**Important:**

- Review the [release notes](/1.9/release-notes/) before upgrading DC/OS.
- The DC/OS GUI and other higher-level system APIs may be inconsistent or unavailable until all master nodes have been upgraded. For example, an upgraded DC/OS Marathon leader cannot connect to the leading Mesos master until it has also been upgraded. When this occurs:

    - The DC/OS GUI may not provide an accurate list of services.
    - For multi-master configurations, after one master has finished upgrading, you can monitor the health of the remaining masters from the Exhibitor UI on port 8181.
- The [VIP features](/1.9/networking/load-balancing-vips/virtual-ip-addresses/), added in DC/OS 1.8, require that ports 32768 - 65535 are open between all agent and master nodes for both TCP and UDP.
- Virtual networks require Docker 1.11 or later. For more information, see the [documentation](/1.9/networking/virtual-networks/).
- An upgraded DC/OS Marathon leader cannot connect to an non-secure (i.e. not upgraded) leading Mesos master. The DC/OS UI cannot be trusted until all masters are upgraded. There are multiple Marathon scheduler instances and multiple Mesos masters, each being upgraded, and the Marathon leader may not be the Mesos leader.
- Task history in the Mesos UI will not persist through the upgrade.
- DC/OS Enterprise downloads can be found [here](https://support.mesosphere.com/hc/en-us/articles/213198586-Mesosphere-Enterprise-DC-OS-Downloads).

## Supported upgrade paths

- From the latest GA version of 1.8 to the latest GA version of 1.9. For example, if 1.8.8 is the latest and 1.9.0 is the latest, this upgrade would be supported.
- From any 1.9 release to the next. For example, an upgrade from 1.9.1 to 1.9.2 would be supported.
- From any 1.9 release to an identical 1.9 release. For example, an upgrade from 1.9.0 to 1.9.0 would be supported. This is useful for making configuration changes.

## Modifying DC/OS configuration

You _cannot_ change your cluster configuration at the same time as upgrading to a new version. Cluster configuration changes must be done with an update to an already installed version. For example, you cannot simultaneously upgrade a cluster from 1.9.x to 1.9.y and add more public agents. You can add more public agents with an update to 1.9.x, and then upgrade to 1.9.y. Or you can upgrade to 1.9.y and then add more public agents by updating 1.9.y after the upgrade. 

To modify your DC/OS configuration, you must run the installer with the modified `config.yaml` and update your cluster using the new installation files. Changes to the DC/OS configuration have the same risk as upgrading a host. Incorrect configurations could potentially crash your hosts, or an entire cluster.

### Configuration parameters
Only a subset of DC/OS configuration parameters can be modified. The adverse effects on any software that is running on top of DC/OS is outside of the scope of this document. Contact Mesosphere Support for more information. 

Here is a list of the parameters that you can modify:

- [`dns_search`](/1.9/installing/ent/custom/configuration/configuration-parameters/#dns-search)
- [`docker_remove_delay`](/1.9/installing/ent/custom/configuration/configuration-parameters/#docker-remove-delay)
- [`gc_delay`](/1.9/installing/ent/custom/configuration/configuration-parameters/#gc-delay)
- [`resolvers`](/1.9/installing/ent/custom/configuration/configuration-parameters/#resolvers)
- [`telemetry_enabled`](/1.9/installing/ent/custom/configuration/configuration-parameters/#telemetry-enabled)
- [`use_proxy`](/1.9/installing/ent/custom/configuration/configuration-parameters/#use-proxy)
    - [`http_proxy`](/1.9/installing/ent/custom/configuration/configuration-parameters/#use-proxy)
    - [`https_proxy`](/1.9/installing/ent/custom/configuration/configuration-parameters/#use-proxy)
    - [`no_proxy`](/1.9/installing/ent/custom/configuration/configuration-parameters/#use-proxy)
    
### Security modes
The [security mode](/1.9/security/ent/#security-modes) can be changed but has special caveats.

- You can only update to a stricter security mode. Security downgrades are not supported. For example, if your cluster is in permissive mode and you want to downgrade to disabled mode, you must reinstall the cluster and terminate all running workloads.
- During each update, you can only increase your security by a single level. For example, you cannot update directly from disabled to strict mode. To increase from disabled to strict mode, you must first update to permissive mode, and then update from permissive to strict mode. 

See the security [mode](/1.9/installing/ent/custom/configuration/configuration-parameters/#security-enterprise) parameter for a description of the different security modes and what each means.

### IP detect script
The [IP detect script](/1.9/installing/ent/custom/advanced/#ip-detect-script) can be modified during an upgrade.

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
- Verify that all Marathon application constraints are valid before beginning the upgrade.  Use this [script](https://github.com/mesosphere/public-support-tools/blob/master/check-constraints.py) to check if your constraints are valid.

## Bootstrap Node

Choose your desired security mode and then follow the applicable upgrade instructions. 

- [Installing DC/OS 1.9 without changing security mode](#current-security)
- [Installing DC/OS 1.9 in permissive mode](#permissive)
- [Installing DC/OS 1.9 in strict mode](#strict)

# <a name="current-security"></a>Installing DC/OS 1.9 without changing security mode
This procedure upgrades a DC/OS 1.8 cluster to DC/OS 1.9 without changing the cluster's [security mode](/1.9/installing/ent/custom/configuration/configuration-parameters/#security-enterprise).

1.  Copy your existing `config.yaml` and `ip-detect` files to an empty `genconf` folder on your bootstrap node. The folder should be in the same directory as the installer. 
1.  Merge the old `config.yaml` into the new `config.yaml` format. In most cases the differences will be minimal.

    **Important:**
    
    *  You cannot change the `exhibitor_zk_backend` setting during an upgrade.
    *  The syntax of the DC/OS 1.9 `config.yaml` may be different from the 1.8 version. For a detailed description of the 1.9 `config.yaml` syntax and parameters, see the [documentation](/1.9/installing/ent/custom/configuration/configuration-parameters/).

1. After updating the format of the `config.yaml`, compare the old `config.yaml` and new `config.yaml`.  Verify that there are no differences in pathways or configurations. Changing these while upgrading can lead to catastrophic cluster failures.
1.  Modify the `ip-detect` file as desired. 
1.  Build your installer package.

    1.  Download the `dcos_generate_config.ee.sh` file.
    1.  Generate the installation files. Replace `<installed_cluster_version>` in the below command with the DC/OS version currently running on the cluster you intend to upgrade, for example `1.8.8`.
    
        ```bash
        dcos_generate_config.ee.sh --generate-node-upgrade-script <installed_cluster_version>
        ```
    1.  The command in the previous step will produce a URL in the last line of its output, prefixed with `Node upgrade script URL:`. Record this URL for use in later steps. It will be referred to in this document as the "Node upgrade script URL".
    1.  Run the [nginx][advanced-install] container to serve the installation files. Please note: either stop any existing nginx container hosting the installation files, or configure the upgrade nginx container to listen on a different port.
    
1.  Go to the DC/OS Master [procedure](#masters) to complete your installation.

# <a name="permissive"></a>Installing DC/OS 1.9 in permissive mode
This procedure upgrades to DC/OS 1.9 in [permissive security mode](/1.9/installing/ent/custom/configuration/configuration-parameters/#security-enterprise).

**Prerequisite:**

- Your cluster must be [upgraded to DC/OS 1.9](#current-security) and running in [disabled security mode](/1.9/installing/ent/custom/configuration/configuration-parameters/#security-enterprise) before it can be upgraded to permissive mode. If your cluster was running in permissive mode before it was upgraded to DC/OS 1.9, you can skip this procedure. 

To update a 1.9 cluster from disabled security to permissive security, complete the following procedure:

1.  Replace `security: disabled` with `security: permissive` in your `config.yaml`.  Do not make any other changes to pathways or configurations in the `config.yaml`.
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

# <a name="strict"></a>Installing DC/OS 1.9 in strict mode
This procedure upgrades to DC/OS 1.9 in security strict [mode](/1.9/installing/ent/custom/configuration/configuration-parameters/#security-enterprise). 

If you are updating a running DC/OS cluster to run in `security: strict` mode, beware that security vulnerabilities may persist even after migration to strict mode. When moving to strict mode, your services will now require authentication and authorization to register with Mesos or access its HTTP API. You should test these configurations in permissive mode before upgrading to strict, to maintain scheduler and script uptimes across the upgrade.

**Prerequisite:**

- Your cluster must be [upgraded to DC/OS 1.9](#current-security) and running in [permissive security mode](#permissive) before it can be updated to strict mode. If your cluster was running in strict mode before it was upgraded to DC/OS 1.9, you can skip this procedure. 

To update a cluster from permissive security to strict security, complete the following procedure:

1.  Replace `security: permissive` with `security: strict` in your `config.yaml`.  Do not make any other changes to pathways or configurations in the `config.yaml`.
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
    1.  Verify that `/opt/mesosphere/bin/mesos-master --version` indicates that the upgraded master is running Mesos 1.2.0 or greater.

1.  Go to the DC/OS Agents [procedure](#agents) to complete your installation.

## <a name="agents"></a>DC/OS Agents

**Important:** When upgrading agent nodes, there is a 5 minute timeout for the agent to respond to health check pings from the mesos-masters before it is considered lost and its tasks are given up for dead.

On all DC/OS agents:

1.  On CentOS and RHEL, run the following commands:

    ```bash
    sudo cp -p /usr/bin/docker /usr/bin/docker-orig
    sudo cp -p /usr/bin/docker /tmp/docker-wrapper
    sudo tee /tmp/docker-wrapper >/dev/null <<"EOF"
    #!/usr/bin/env sh
    unset LD_LIBRARY_PATH
    /usr/bin/docker-orig "$@"
    EOF
    sudo mv -f /tmp/docker-wrapper /usr/bin/docker
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

1.  On CentOS and RHEL, run the command:
    ```bash
    sudo mv -f /usr/bin/docker-orig /usr/bin/docker
    ```

## <a name="troubleshooting"></a>Troubleshooting Recommendations

The following commands should provide insight into upgrade issues:

### On All Cluster Nodes

```bash
sudo journalctl -u dcos-download
sudo journalctl -u dcos-spartan
sudo systemctl | grep dcos
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

- Packages available in the DC/OS 1.9 Universe are newer than those in the DC/OS 1.8 Universe. Services are not automatically upgraded when  DC/OS 1.9 is installed because not all DC/OS services have upgrade paths that will preserve existing state.

[advanced-install]: /1.9/installing/ent/custom/advanced/
