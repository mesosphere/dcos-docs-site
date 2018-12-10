---
layout: layout.pug
navigationTitle: Patching
title: Patching
menuWeight: 20
excerpt: Understanding cluster patches
---

A DC/OS patch describes a set of changes and supporting data designed to update, fix, or improve the features/functionality of DC/OS. A point release that consists of minor changes is also called a patch.

A patching process includes the following:
- Addresses fixed issues, known issues and limitations, notable changes and security enhancements
- Does not impact workloads which is an essential piece of patching live clusters with no downtime
- Helps users to understand the minor changes impacting the functionality of DC/OS

<p class="message--note"><strong>NOTE: </strong>These instructions are only appropriate for a change to the cluster configuration or the maintenance version number. For example, from DC/OS 1.11.1 to 1.11.2.</p>

- To update to a newer major or minor version (for example, from 1.10 to 1.11), refer to the instructions for [upgrading](/1.11/installing/production/upgrading/).

If patching is performed on a supported OS with all prerequisites fulfilled, then the patch **should** preserve the state of running tasks on the cluster.

## Important guidelines

- Review the [release notes](/1.11/release-notes/) before patching DC/OS.
- Due to a cluster configuration issue with overlay networks, it is recommended to set `enable_ipv6` to false in `config.yaml` when patching or configuring a new cluster. If you have already patched to DC/OS 1.11.x without configuring `enable_ipv6` or if `config.yaml` file is set to `true`, then do not add new nodes until DC/OS 1.11.3 has been released. You can find additional information and a more robust remediation procedure in our latest critical [product advisory](https://support.mesosphere.com/s/login/?startURL=%2Fs%2Farticle%2FCritical-Issue-with-Overlay-Networking&ec=302).
- There are new options in the `config.yaml` file which must be declared prior to patching. Even if you have previously installed DC/OS successfully with your `config.yaml` file, the file will require new additions to function with DC/OS 1.11. Check if `fault_domain_enabled` and `enable_ipv6` are added in the `config.yaml` file. You can review the sample file [here](/1.11/installing/production/deploying-dcos/installation/#create-a-configuration-file).
- If IPv6 is disabled in the kernel, then IPv6 must be disabled in the `config.yaml` file for the patch to succeed.
- DC/OS Enterprise now enforces license keys. The license key must reside in a genconf/license.txt file or the patch will fail. [enterprise type="inline" size="small" /]
- The DC/OS GUI and other higher-level system APIs may be inconsistent or unavailable until all master nodes have been patched. For example, a patched DC/OS Marathon leader cannot connect to the leading Mesos master until it has also been patched. When this occurs:

    - The DC/OS GUI may not provide an accurate list of services.
    - For multi-master configurations, after one master has finished patching, you can monitor the health of the remaining masters from the Exhibitor UI on port 8181.
- A patched DC/OS Marathon leader cannot connect to a non-secure (not patched) leading Mesos master. The DC/OS UI cannot be trusted until all masters are patched. There are multiple Marathon scheduler instances and multiple Mesos masters, each being patched, and the Marathon leader may not be the Mesos leader.
- Task history in the Mesos UI will not persist through the patch.
- DC/OS Enterprise downloads can be found [here](https://support.mesosphere.com/hc/en-us/articles/213198586-Mesosphere-Enterprise-DC-OS-Downloads). [enterprise type="inline" size="small" /]

## Supported patching path matrix
 The following matrix table lists the patching paths for DC/OS 1.11.

**DC/OS minor versions for 1.11**

|**Display Icon** | **Service** |
|---------- | ------- |
| ⚫ | Supported |
| ◯ | Not Supported |

<table style="border-collapse: collapse;" Border = "1" Cellpadding = "5" Cellspacing = "5">
   <tr>
    <th Rowspan = "20" Align = "center"><strong>Patch<br> From</strong></div></th>
   <tr>
    <th></th>
    <th Colspan = "8" Align = "center"><strong>Patch To</strong></th>
   </tr>
    <th></th>
    <th>1.11.1</th>
    <th>1.11.2</th>
    <th>1.11.3</th>
    <th>1.11.4</th>
    <th>1.11.5</th>
    <th>1.11.6</th>
    <th>1.11.7</th>
    <th>1.11.8</th>
   </tr>
   <tr>
    <th>1.11.1</th>
    <td Align = "center">◯</td>
    <td Align = "center">⚫</td>
    <td Align = "center">⚫</td>
    <td Align = "center">⚫</td>
    <td Align = "center">⚫</td>
    <td Align = "center">⚫</td>
    <td Align = "center">◯</td>
    <td Align = "center">◯</td>
   </tr>
   <tr>
    <th>1.11.2</th>
    <td Align = "center">◯</td>
    <td Align = "center">◯</td>
    <td Align = "center">⚫</td>
    <td Align = "center">⚫</td>
    <td Align = "center">⚫</td>
    <td Align = "center">⚫</td>
    <td Align = "center">◯</td>
    <td Align = "center">◯</td>
  </tr>
   <tr>
    <th>1.11.3</th>
    <td Align = "center">◯</td>
    <td Align = "center">◯</td>
    <td Align = "center">◯</td>
    <td Align = "center">⚫</td>
    <td Align = "center">⚫</td>
    <td Align = "center">⚫</td>
    <td Align = "center">◯</td>
    <td Align = "center">◯</td>
  </tr>
   <tr>
    <th>1.11.4</th>
    <td Align = "center">◯</td>
    <td Align = "center">◯</td>
    <td Align = "center">◯</td>
    <td Align = "center">◯</td>
    <td Align = "center">⚫</td>
    <td Align = "center">⚫</td>
    <td Align = "center">⚫</td>
    <td Align = "center">◯</td>
  </tr>
   <tr>
    <th>1.11.5</th>
    <td Align = "center">◯</td>
    <td Align = "center">◯</td>
    <td Align = "center">◯</td>
    <td Align = "center">◯</td>
    <td Align = "center">◯</td>
    <td Align = "center">⚫</td>
    <td Align = "center">⚫</td>
    <td Align = "center">⚫</td>
   </tr>
    <tr>
    <th>1.11.6</th>
    <td Align = "center">◯</td>
    <td Align = "center">◯</td>
    <td Align = "center">◯</td>
    <td Align = "center">◯</td>
    <td Align = "center">◯</td>
    <td Align = "center">◯</td>
    <td Align = "center">⚫</td>
    <td Align = "center">⚫</td>
   </tr>
   <tr>
       <th>1.11.7</th>
    <td Align = "center">◯</td>
    <td Align = "center">◯</td>
    <td Align = "center">◯</td>
    <td Align = "center">◯</td>
    <td Align = "center">◯</td>
    <td Align = "center">◯</td>
    <td Align = "center">◯</td>
    <td Align = "center">⚫</td>
   </tr>
  </table>  

## Modifying DC/OS configuration

There are limitations to the changes you can make to the cluster configuration when you are applying a patch release to the currently installed version of the software. For example, you cannot change the security mode for a cluster if you are patching a release.

To modify your DC/OS configuration, you must first make the configuration changes in the `config.yaml` file. You can then run the installer with the modified `config.yaml` file to update the cluster to use the new configuration. Changes to the DC/OS configuration have the same risk as patching a host. Incorrect configurations could potentially crash your hosts, or an entire cluster.

Only a subset of DC/OS configuration parameters can be modified. The adverse effects on any software that is running on top of DC/OS is outside of the scope of this document. Contact Mesosphere Support for more information.

Here is a list of the parameters that you can modify:

- [`dns_search`](/1.11/installing/production/advanced-configuration/configuration-reference/#dns-search)
- [`docker_remove_delay`](/1.11/installing/production/advanced-configuration/configuration-reference/#docker-remove-delay)
- [`gc_delay`](/1.11/installing/production/advanced-configuration/configuration-reference/#gc-delay)
- [`resolvers`](/1.11/installing/production/advanced-configuration/configuration-reference/#resolvers)
- [`telemetry_enabled`](/1.11/installing/production/advanced-configuration/configuration-reference/#telemetry-enabled)
- [`use_proxy`](/1.11/installing/production/advanced-configuration/configuration-reference/#use-proxy)
    - [`http_proxy`](/1.11/installing/production/advanced-configuration/configuration-reference/#use-proxy)
    - [`https_proxy`](/1.11/installing/production/advanced-configuration/configuration-reference/#use-proxy)
    - [`no_proxy`](/1.11/installing/production/advanced-configuration/configuration-reference/#use-proxy)

The security mode (`security`) can be changed but has special caveats.

- You can only update to a stricter security mode. Security downgrades are not supported. For example, if your cluster is in `permissive` mode and you want to downgrade to `disabled` mode, you must reinstall the cluster and terminate all running workloads.
- During each update, you can only increase your security by a single level. For example, you cannot update directly from `disabled` to `strict` mode. To increase from `disabled` to `strict` mode you must first update to `permissive` mode, and then update from `permissive` to `strict` mode.

See the security [mode](/1.11/installing/production/advanced-configuration/configuration-reference/#security-enterprise) for information on different security modes.

# Instructions
These steps must be performed for version patches and cluster configuration changes.

## Prerequisites

- Mesos, Mesos Frameworks, Marathon, Docker and all running tasks in the cluster should be stable and in a known healthy state.
- For Mesos compatibility reasons, we recommend patching any running Marathon-on-Marathon instances to Marathon version 1.3.5 before proceeding with this DC/OS patch.
- You must have access to copies of the config files used with the previous DC/OS version: `config.yaml` and `ip-detect`.
- You must be using `systemd` 218 or newer to maintain task state.
- All hosts (masters and agents) must be able to communicate with all other hosts on all ports, for both TCP and UDP.
- In CentOS or RedHat, install IP sets with this command (used in some IP detect scripts): `sudo yum install -y ipset`
- You must be familiar with using `systemctl` and `journalctl` command line tools to review and monitor service status. Troubleshooting notes can be found at the end of this [document](#troubleshooting).
- You must be familiar with the [DC/OS Installation Guide](/1.11/installing/production/deploying-dcos/installation/).
- Take a snapshot of ZooKeeper prior to patching. Marathon supports rollbacks, but does not support downgrades.
- [Take a snapshot of the IAM database](/1.11/installing/installation-faq/#q-how-do-i-backup-the-iam-database-enterprise) prior to patching.
- Ensure that Marathon event subscribers are disabled before beginning the patch. Leave them disabled after completing the patch, as this feature is now deprecated.
- **Note:** Marathon event subscribers are disabled by default. Check to see if the line `--event_subscriber "http_callback"` has been added to `sudo vi /opt/mesosphere/bin/marathon.sh` on your master node(s). If this is the case you will need to remove that line in order to disable event subscribers.
- Verify that all Marathon application constraints are valid before beginning the patch. Use [this script](https://github.com/mesosphere/public-support-tools/blob/master/check-constraints.py) to check if your constraints are valid.
- [Back up your cluster](/1.11/administering-clusters/backup-and-restore/).
- **Optional** You can add custom [node and cluster health checks](/1.11/installing/production/deploying-dcos/node-cluster-health-check/#custom-health-checks) to your `config.yaml`.

## Bootstrap Node

Choose your desired security mode and then follow the applicable patch instructions.

- [Patching DC/OS 1.11 without changing security mode](#current-security)
- [Patching DC/OS 1.11 in permissive mode](#permissive)
- [Patching DC/OS 1.11 in strict mode](#strict)

# <a name="current-security"></a>Patching DC/OS 1.11 without changing security mode
This procedure patches a DC/OS 1.10 cluster to DC/OS 1.11 without changing the cluster's [security mode](/1.11/installing/production/advanced-configuration/configuration-reference/#security-enterprise).
1.  Copy your existing `config.yaml` and `ip-detect` files to an empty `genconf` folder on your bootstrap node. The folder should be in the same directory as the installer.
1.  Merge the old `config.yaml` into the new `config.yaml` format. In most cases the differences will be minimal.

    **Note:**

    *  You cannot change the `exhibitor_zk_backend` setting during a patch.
    *  The syntax of the `config.yaml` may be different from the earlier version. For a detailed description of the current `config.yaml` syntax and parameters, see the [documentation](/1.11/installing/production/advanced-configuration/configuration-reference/).
1. After updating the format of the config.yaml, compare the old `config.yaml` and new `config.yaml`. Verify that there are no differences in pathways or configurations. Changing these while patching can lead to catastrophic cluster failures.
1.  Modify the `ip-detect` file as desired.
1.  Build your installer package.

    1.  Download the `dcos_generate_config.ee.sh` file.
    1.  Generate the installation files. Replace `<installed_cluster_version>` in the command below with the DC/OS version currently running on the cluster you intend to patch, for example `1.8.8`.
        ```bash
        dcos_generate_config.ee.sh --generate-node-upgrade-script <installed_cluster_version>
        ```
    1.  The command in the previous step will produce a URL in the last line of its output, prefixed with `Node patch script URL:`. Record this URL for use in later steps. It will be referred to in this document as the "Node patch script URL".
    1.  Run the [nginx](/1.11/installing/production/deploying-dcos/installation/) container to serve the installation files.

1.  Go to the DC/OS Master [procedure](/1.11/installing/production/patching/#masters) to complete your installation.

# <a name="permissive"></a>Patching DC/OS 1.11 in permissive mode
This procedure patches to DC/OS 1.11 in [permissive security mode](/1.11/installing/production/advanced-configuration/configuration-reference/#security-enterprise).

**Prerequisite:**

- Your cluster must be [patched to DC/OS 1.11](#current-security) and running in [disabled security mode](/1.11/installing/production/advanced-configuration/configuration-reference/#security-enterprise) before it can be patched to permissive mode. If your cluster was running in permissive mode before it was patched to DC/OS 1.10, you can skip this procedure.

<table class=“table” bgcolor=#858585>
<tr> 
  <td align=justify style=color:white><strong>Important:</strong> Any <a href="/1.11/installing/production/deploying-dcos/node-cluster-health-check/#custom-health-checks">custom node or cluster health checks</a> you have configured will fail for a patch from disabled to permissive security mode. A future release will allow you to bypass the health checks.</td> 
</tr> 
</table>

To update a cluster from disabled security to permissive security, complete the following procedure:

1.  Replace `security: disabled` with `security: permissive` in your `config.yaml`. Do not make any other changes to pathways or configurations in the `config.yaml`.
1.  Modify the `ip-detect` file as desired.
1.  Build your installer package.

    1.  Download the `dcos_generate_config.ee.sh` file.
    1.  Generate the installation files. Replace `<installed_cluster_version>` in the below command with the DC/OS version currently running on the cluster you intend to patch, for example `1.8.8`.
        ```bash
        dcos_generate_config.ee.sh --generate-node-upgrade-script <installed_cluster_version>
        ```
    1.  The command in the previous step will produce a URL in the last line of its output, prefixed with `Node patch script URL:`. Record this URL for use in later steps. It will be referred to in this document as the "Node patch script URL".
    1.  Run the [nginx][install] container to serve the installation files.

1.  Go to the DC/OS Master [procedure](#masters) to complete your installation.

# <a name="strict"></a>Patching DC/OS 1.11 in strict mode
This procedure patches to DC/OS 1.11 in security strict [mode](/1.11/installing/production/advanced-configuration/configuration-reference/#security-enterprise).

If you are updating a running DC/OS cluster to run in `security: strict` mode, be aware that security vulnerabilities may persist even after migration to strict mode. When moving to strict mode, your services will now require authentication and authorization to register with Mesos or access its HTTP API. You should test these configurations in permissive mode before patching to strict, to maintain scheduler and script uptimes across the patch.

**Prerequisites:**

- Your cluster must be [patched to DC/OS 1.11](#current-security) and running in [permissive security mode](#permissive) before it can be updated to strict mode. If your cluster was running in strict mode before it was patched to DC/OS 1.11, you can skip this procedure.
- If you have running pods or if the Mesos "HTTP command executors" feature has been enabled in a custom configuration, you must restart these tasks in DC/OS 1.11 permissive security mode before patching to strict mode. Otherwise, these tasks will be restarted when the masters are patched.

To update a cluster from permissive security to strict security, complete the following procedure:

1.  Replace `security: permissive` with `security: strict` in your `config.yaml`. Do not make any other changes to pathways or configurations in the `config.yaml`.
1.  Modify the `ip-detect` file as desired.
1.  Build your installer package.

    1.  Download the `dcos_generate_config.ee.sh` file.
    1.  Generate the installation files. Replace `<installed_cluster_version>` in the below command with the DC/OS version currently running on the cluster you intend to patch, for example `1.8.8`.
        ```bash
        dcos_generate_config.ee.sh --generate-node-upgrade-script <installed_cluster_version>
        ```
    1.  The command in the previous step will produce a URL in the last line of its output, prefixed with `Node patch script URL:`. Record this URL for use in later steps. It will be referred to in this document as the "Node patch script URL".
    1.  Run the [nginx][install] container to serve the installation files.

1.  Go to the DC/OS Master [procedure](#masters) to complete your installation.

## <a name="masters"></a>DC/OS Masters

Proceed with patching every master node one at a time in any order using the following procedure. When you complete each patch, monitor the Mesos master metrics to ensure the node has rejoined the cluster and completed reconciliation.

1.  Download and run the node patch script:
    ```bash
    curl -O <Node patch script URL>
    sudo bash dcos_node_upgrade.sh
    ```

1.  Verify that the patch script succeeded and exited with the status code `0`:
    ```bash
    echo $?
    0
    ```

1.  Validate the patch:

    1.  Monitor Exhibitor and wait for it to converge at `http://<master-ip>:8181/exhibitor/v1/ui/index.html`. Confirm that the master rejoins the ZooKeeper quorum successfully (the status indicator will turn green).

        **Note:** If you are patching from permissive to strict mode, this URL will be `https://...`.
    1.  Wait until the `dcos-mesos-master` unit is up and running.
    1.  Verify that `curl http://<dcos_master_private_ip>:5050/metrics/snapshot` has the metric `registrar/log/recovered` with a value of `1`.
        **Note:** If you are patching from permissive to strict mode, this URL will be `curl https://...` and you will need a JWT for access. [enterprise type="inline" size="small" /]
    1.  Verify that `/opt/mesosphere/bin/mesos-master --version` indicates that the patched master is running the version of Mesos specified in the [release notes](/1.11/release-notes/), for example `1.5.1`.
  1.  Verify that the number of under-replicated ranges has dropped to zero as the IAM database is replicated to the new master. This can be done by running the following command and confirming that the last column on the right shows only zeros.
      ```bash
        sudo /opt/mesosphere/bin/cockroach node status --ranges --certs-dir=/run/dcos/pki/cockroach --host=$(/opt/mesosphere/bin/detect_ip)
        +----+---------------------+--------+---------------------+---------------------+------------------+-----------------------+--------+--------------------+------------------------+
        | id |       address       | build  |     updated_at      |     started_at      | replicas_leaders | replicas_leaseholders | ranges | ranges_unavailable | ranges_underreplicated |
        +----+---------------------+--------+---------------------+---------------------+------------------+-----------------------+--------+--------------------+------------------------+
        |  1 | 172.31.7.32:26257   | v1.1.4 | 2018-03-08 13:56:10 | 2018-02-28 20:11:00 |              195 |                   194 |    195 |                  0 |                      0 |
        |  2 | 172.31.10.48:26257  | v1.1.4 | 2018-03-08 13:56:05 | 2018-03-05 13:33:45 |              200 |                   199 |    200 |                  0 |                      0 |
        |  3 | 172.31.23.132:26257 | v1.1.4 | 2018-03-08 13:56:01 | 2018-02-28 20:18:41 |              187 |                   187 |    187 |                  0 |                      0 |
        +----+---------------------+--------+---------------------+---------------------+------------------+-----------------------+--------+--------------------+------------------------+
    ```
    If the `ranges_underreplicated` column lists any non-zero values, wait a minute and rerun the command. The values will converge to zero once all data is safely replicated.

1.  Go to the DC/OS Agents [procedure](#agents) to complete your installation.

## <a name="agents"></a>DC/OS Agents

**Note:** When patching agent nodes, there is a five minute timeout for the agent to respond to health check pings from the mesos-masters before the agent nodes and task expires.
On all DC/OS agents:

1.  Navigate to the `/opt/mesosphere/lib` directory and delete this library file. Deleting this file will prevent conflicts.

    ```bash
      libltdl.so.7
    ```

1.  Download and run the node patch script:
    ```bash
    curl -O <Node patch script URL>
    sudo bash dcos_node_upgrade.sh
    ```

1.  Verify that the patch script succeeded and exited with the status code `0`:
    ```bash
    echo $?
    0
    ```

1.  Validate the patch:

    - Verify that `curl http://<dcos_agent_private_ip>:5051/metrics/snapshot` has the metric `slave/registered` with a value of `1`.
    - Monitor the Mesos UI to verify that the patched node rejoins the DC/OS cluster and that tasks are reconciled (`http://<master-ip>/mesos`). If you are patching from permissive to strict mode, this URL will be `https://<master-ip>/mesos`.

## <a name="troubleshooting"></a>Troubleshooting Recommendations

The following commands should provide insight into patch issues:

### On All Cluster Nodes

```bash
sudo journalctl -u dcos-download
sudo journalctl -u dcos-spartan
sudo systemctl | grep dcos
```

If your patch fails because of a [custom node or cluster check](/1.11/installing/production/deploying-dcos/node-cluster-health-check/#custom-health-checks), run these commands for more details:
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

- Packages available in the DC/OS 1.11 Universe are newer than those in the older versions of Universe. Services are not automatically patched when DC/OS is installed because not all DC/OS services have patch paths that will preserve an existing state.

