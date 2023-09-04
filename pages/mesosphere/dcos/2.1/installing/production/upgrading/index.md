---
layout: layout.pug
navigationTitle:  Upgrading
title: Upgrading
menuWeight: 25
excerpt: Upgrading a DC/OS cluster
render: mustache
model: /mesosphere/dcos/2.1/data.yml
---

An upgrade is the process of moving between major releases to add new features or to replace existing features with new features/functionality. You can upgrade DC/OS only if you have used the advanced installation process to install DC/OS on your cluster.

<p class="message--important"><strong>IMPORTANT: </strong>An upgrade is required only when changing the major or minor version of your DC/OS installation. Example: 2.0 --> 2.1</p>

- To update to a newer maintenance version (e.g. 2.0.2 to 2.0.4), refer to the instructions for [patching](/mesosphere/dcos/2.1/installing/production/patching/).
- To modify the cluster configuration, refer to the instructions for [patching](/mesosphere/dcos/2.1/installing/production/patching/).

If upgrading is performed on a supported OS with all prerequisites fulfilled, then the upgrade **should** preserve the state of running tasks on the cluster.

## Important guidelines

- The Production installation method is the **only** recommended upgrade path for DC/OS. It is recommended that you familiarize yourself with the [DC/OS Deployment Guide](/mesosphere/dcos/2.1/installing/production/deploying-dcos/) before proceeding.
- Review the [release notes](/mesosphere/dcos/2.1/release-notes/) before upgrading DC/OS.
- Due to a cluster configuration issue with overlay networks, it is recommended to set `enable_ipv6` to false in `config.yaml` when upgrading or configuring a new cluster.  You can find additional information and a more detailed remediation procedure in our latest critical [product advisory](https://support.mesosphere.com/s/article/Critical-Issue-with-Overlay-Networking). [enterprise type="inline" size="small" /]
- If IPv6 is disabled in the kernel, then IPv6 must be disabled in the `config.yaml` file.
- The DC/OS Enterprise license key must reside in a `genconf/license.txt` file. [enterprise type="inline" size="small" /]
- The DC/OS GUI and other higher-level system APIs may be inconsistent or unavailable until all master nodes have been upgraded.
  When this occurs:
   * The DC/OS GUI may not provide an accurate list of services.
- An upgraded DC/OS Marathon leader cannot connect to the leading Mesos master until it has also been upgraded. The DC/OS UI cannot be trusted until all masters are upgraded. There are multiple Marathon scheduler instances and multiple Mesos masters, each being upgraded, and the Marathon leader may not be the Mesos leader.
- Task history in the Mesos UI will not persist through the upgrade.
- DC/OS 2.0 added TLS for Exhibitor.  Exhibitor TLS is automatically enabled for static master clusters during installation of DC/OS 2.0 or later. It is not enabled during an upgrade from DC/OS 1.13 or earlier.  Once the cluster has been upgraded to DC/OS 2.0 or later, [Exhibitor can be manually configured to use TLS](/mesosphere/dcos/2.1/security/ent/tls-ssl/exhibitor).  [enterprise type="inline" size="small" /]

## Supported upgrade paths
The following tables list the supported upgrade paths for DC/OS 2.1.


|**Display Icon** | **Service** |
|---------- | ------- |
| ⚫ | Supported |
| ◯ | Not Supported |

<table style="border-collapse: collapse;" Border = "1" Cellpadding = "5" Cellspacing = "5">
   <caption>DC/OS 1.13 to 2.1 Upgrade Paths</caption>
   <tr>
    <th Rowspan = "20" Align = "center"><strong>Upgrade<br>From</strong></th>
   <tr>
    <th></th>
    <th Colspan = "20" Align = "center"><strong>Upgrade To</strong></th>
   </tr>
    <th></th>
    <th Align = "center">2.1.0</th>
    <th Align = "center">2.1.1</th>
   </tr>
   <tr>
    <th>1.13.0</th>
    <td Align = "center">◯</td>
    <td Align = "center">◯</td>
   </tr>
   <tr>
    <th>1.13.1</th>
    <td Align = "center">◯</td>
    <td Align = "center">◯</td>
   </tr>
   <tr>
    <th>1.13.2</th>
    <td Align = "center">◯</td>
    <td Align = "center">◯</td>
   </tr>
   <tr>
    <th>1.13.3</th>
    <td Align = "center">◯</td>
    <td Align = "center">◯</td>
   </tr>
   <tr>
    <th>1.13.4</th>
    <td Align = "center">◯</td>
    <td Align = "center">◯</td>
   </tr>
   <tr>
    <th>1.13.5</th>
    <td Align = "center">◯</td>
    <td Align = "center">◯</td>
   </tr>
   <tr>
    <th>1.13.6</th>
    <td Align = "center">⚫</td>
    <td Align = "center">⚫</td>
   </tr>
   <tr>
    <th>1.13.7</th>
    <td Align = "center">⚫</td>
    <td Align = "center">⚫</td>
   </tr>
   <tr>
    <th>1.13.9</th>
    <td Align = "center">⚫</td>
    <td Align = "center">⚫</td>
   </tr>
   <tr>
    <th>1.13.10</th>
    <td Align = "center">⚫</td>
    <td Align = "center">⚫</td>
   </tr>
</table>
<br>
<table style="border-collapse: collapse;" Border = "1" Cellpadding = "5" Cellspacing = "5">
   <caption>DC/OS 2.0 to 2.1 Upgrade Paths</caption>
   <tr>
    <th Rowspan = "20" Align = "center"><strong>Upgrade<br>From</strong></th>
   <tr>
    <th></th>
    <th Colspan = "20" Align = "center"><strong>Upgrade To</strong></th>
   </tr>
    <th></th>
    <th Align = "center">2.1.0</th>
    <th Align = "center">2.1.1</th>
   </tr>
   <tr>
    <th>2.0.0</th>
    <td Align = "center">⚫</td>
    <td Align = "center">◯</td>
   </tr>
   <tr>
    <th>2.0.1</th>
    <td Align = "center">⚫</td>
    <td Align = "center">◯</td>
   </tr>
   <tr>
    <th>2.0.2</th>
    <td Align = "center">⚫</td>
    <td Align = "center">◯</td>
   </tr>
   <tr>
    <th>2.0.3</th>
    <td Align = "center">⚫</td>
    <td Align = "center">◯</td>
   </tr>
   <tr>
    <th>2.0.4</th>
    <td Align = "center">⚫</td>
    <td Align = "center">⚫</td>
   </tr>
   <tr>
    <th>2.0.5</th>
    <td Align = "center">⚫</td>
    <td Align = "center">⚫</td>
   </tr>
   <tr>
    <th>2.0.6</th>
    <td Align = "center">⚫</td>
    <td Align = "center">⚫</td>
   </tr>
  </table>

# Modifying DC/OS configuration [enterprise type="inline" size="small" /]

You **cannot** change your cluster configuration at the same time as upgrading to a new version. Cluster configuration changes must be done with a patch to an already installed version. For example, you cannot simultaneously upgrade a cluster from 2.0 to 2.1 and add more public agents. You can add more public agents with a patch to 2.0 and then upgrade to 2.1, or you can upgrade to 2.1 and then add more public agents by [patching 2.1](/mesosphere/dcos/2.1/installing/production/patching/) after the upgrade.

# Instructions
These steps must be performed for version upgrades.

## Prerequisites
- Enterprise users: DC/OS Enterprise downloads can be found [here](https://support.mesosphere.com/hc/en-us/articles/213198586-Mesosphere-Enterprise-DC-OS-Downloads). [enterprise type="inline" size="small" /]
- Open Source users: DC/OS Open Source downloads can be found [here](https://dcos.io/releases/). [oss type="inline" size="small" /]
- Mesos, Mesos Frameworks, Marathon, Docker and all running tasks in the cluster should be stable and in a known healthy state.
- For Mesos compatibility reasons, we recommend upgrading any running Marathon-on-Marathon instances to Marathon version 1.3.5 before proceeding with this DC/OS upgrade.
- You must have access to copies of the config files used with the previous DC/OS version: `config.yaml` and `ip-detect`.
- You must be using systemd 218 or newer to maintain task state.
- All hosts (masters and agents) must be able to communicate with all other hosts as described at [network security](/mesosphere/dcos/2.1/administering-clusters/securing-your-cluster/#network-security).
- In CentOS or RedHat, install IP sets with this command (used in some IP detect scripts): `sudo yum install -y ipset`
- You must be familiar with using `systemctl` and `journalctl` command line tools to review and monitor service status. Troubleshooting notes can be found at the end of this [document](#troubleshooting).
- You must be familiar with the DC/OS [Production Installation][install] instructions.
- Take a [snapshot of ZooKeeper](/mesosphere/dcos/2.1/installing/installation-faq/#q-how-do-i-backup-zookeeper-using-guano) prior to upgrading. Marathon supports rollbacks, but does not support downgrades.
- Take a [snapshot of the IAM database](/mesosphere/dcos/2.1/installing/installation-faq/#q-how-do-i-backup-the-iam-database-enterprise) prior to upgrading. **This is very easy to do and should be considered a necessity.**
- Ensure that Marathon event subscribers are disabled before beginning the upgrade. Leave them disabled after completing the upgrade, as this feature is now deprecated.

<p class="message--note"><strong>NOTE: </strong>Marathon event subscribers are disabled by default. Check to see if the line <code>--event_subscriber "http_callback"</code> has been added to <code>sudo vi /opt/mesosphere/bin/marathon.sh</code> on your master node(s). In such a case, you must remove that line in order to disable event subscribers.</p>

[enterprise type="inline" size="small" /]

- Verify that all Marathon application constraints are valid before beginning the upgrade. Use [this script](https://github.com/mesosphere/public-support-tools/blob/master/check-constraints.py) to check if your constraints are valid.
- [Back up your cluster](/mesosphere/dcos/2.1/administering-clusters/backup-and-restore/). [enterprise type="inline" size="small" /]
- Optional: You can add custom [node and cluster health checks](/mesosphere/dcos/2.1/installing/production/deploying-dcos/node-cluster-health-check/) to your `config.yaml`.
- Verify that all your masters are in a healthy state:
   - Check the Exhibitor UI to confirm that all masters have joined the quorum successfully (the status indicator will show green). The Exhibitor UI is available at `http://<dcos_master>:8181/`.
   - Verify that `curl http://<dcos_master_private_ip>:5050/metrics/snapshot` has the metric `registrar/log/recovered` with a value of `1` for each master.


## Bootstrap Node


This procedure upgrades a DC/OS 2.0 cluster to DC/OS 2.1.

1.  Copy your existing `config.yaml` and `ip-detect` files to an empty `genconf` folder on your bootstrap node. The folder should be in the same directory as the installer.
2.  The syntax of the `config.yaml` file can be different from the earlier version. For a detailed description of the current `config.yaml` syntax and parameters, see the [documentation](/mesosphere/dcos/2.1/installing/production/advanced-configuration/configuration-reference/).
    *  You cannot change the `exhibitor_storage_backend` setting during an upgrade.

3. After updating the `config.yaml`, compare the old `config.yaml` and new `config.yaml`. Verify that there are no differences in pathways or configurations. Changing these while upgrading can lead to catastrophic cluster failures.
4.  Modify the `ip-detect` file if necessary.
5.  Build your installer package.

    1.  Download the `dcos_generate_config.ee.sh` [enterprise type="inline" size="small" /] or `dcos_generate_config.sh` [oss type="inline" size="small" /] file.
    2.  Generate the installation files. Replace `<installed_cluster_version>` in the below command with the DC/OS version currently running on the cluster you intend to upgrade, for example `2.0.4`.

        [enterprise type="inline" size="small" /]
        ```bash
        dcos_generate_config.ee.sh --generate-node-upgrade-script <installed_cluster_version>
        ```
        [oss type="inline" size="small" /]
        ```bash
        dcos_generate_config.sh --generate-node-upgrade-script <installed_cluster_version>
        ```
    3.  The command in the previous step will produce a URL in the last line of its output, prefixed with `Node upgrade script URL:`. Record this URL for use in later steps. It will be referred to in this document as the "Node upgrade script URL".

6.  Run the nginx container to serve the [installation files][install] using the Docker [run][cmd] command. For `<your-port>`, specify the port value that is used in the Node upgrade script URL.
```bash
sudo docker run -d -p <your-port>:80 -v $PWD/genconf/serve:/usr/share/nginx/html:ro nginx
```

7.  Go to the DC/OS Master [procedure](#masters) to complete your installation.



## <a name="masters"></a>DC/OS Masters

Proceed with upgrading every master node one at a time in any order using the following procedure. When you complete each upgrade, monitor the Mesos master metrics to ensure the node has rejoined the cluster and completed reconciliation.

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

1.  Validate the upgrade by running the following commands on the master node:

    1.  Monitor Exhibitor and wait for it to converge.

        On DC/OS Enterprise clusters with a static master list use the command:
        ```bash
        sudo curl --cacert /var/lib/dcos/exhibitor-tls-artifacts/root-cert.pem --cert /var/lib/dcos/exhibitor-tls-artifacts/client-cert.pem --key /var/lib/dcos/exhibitor-tls-artifacts/client-key.pem https://localhost:8181/exhibitor/v1/cluster/status
        ```

        On other clusters use the command:
        ```bash
        curl http://localhost:8181/exhibitor/v1/cluster/status
        ```

        Wait until the response shows that all hosts have `"description":"serving"`.
    1.  Wait until the `dcos-mesos-master` unit is up and running.
    1.  Verify that `curl http://localhost:5050/metrics/snapshot` has the metric `registrar/log/recovered` with a value of `1`.

        <p class="message--note"><strong>NOTE: </strong>If you are upgrading from permissive to strict mode, this URL will be <code>curl https://...</code> and you will need a JWT for access. </p>
        [enterprise type="inline" size="small" /]

1.  Verify that `/opt/mesosphere/bin/mesos-master --version` indicates that the upgraded master is running the version of Mesos specified in the [release notes](/mesosphere/dcos/2.1/release-notes/), for example `1.9.1`.

    1.  Verify that the number of under-replicated ranges in CockroachDB has dropped to zero as the IAM database is replicated to the new master. Run the following command and confirm that the `ranges_underreplicated` column shows only zeros.
    ```bash
    sudo /opt/mesosphere/bin/cockroach node status --ranges --certs-dir=/run/dcos/pki/bouncer --host=$(/opt/mesosphere/bin/detect_ip)
    ```
    ```
    +----+---------------------+--------+---------------------+---------------------+------------------+-----------------------+--------+--------------------+------------------------+
    | id |       address       | build  |     updated_at      |     started_at      | replicas_leaders | replicas_leaseholders | ranges | ranges_unavailable | ranges_underreplicated |
    +----+---------------------+--------+---------------------+---------------------+------------------+-----------------------+--------+--------------------+------------------------+
    |  1 | 172.31.7.32:26257   | v1.1.4 | 2018-03-08 13:56:10 | 2018-02-28 20:11:00 |              195 |                   194 |    195 |                  0 |                      0 |
    |  2 | 172.31.10.48:26257  | v1.1.4 | 2018-03-08 13:56:05 | 2018-03-05 13:33:45 |              200 |                   199 |    200 |                  0 |                      0 |
    |  3 | 172.31.23.132:26257 | v1.1.4 | 2018-03-08 13:56:01 | 2018-02-28 20:18:41 |              187 |                   187 |    187 |                  0 |                      0 |
    +----+---------------------+--------+---------------------+---------------------+------------------+-----------------------+--------+--------------------+------------------------+
    ```

    If the `ranges_underreplicated` column lists any non-zero values, wait a minute and rerun the command. The values will converge to zero after all data is safely replicated.

1.  Go to the DC/OS Agents [procedure](#agents) to complete your installation.

## <a name="agents"></a>DC/OS Agents

Be aware that when upgrading agent nodes, there is a five minute timeout for the agent to respond to health check pings from the mesos-masters before the agent nodes and task expire.

On all DC/OS agents:

1.  Navigate to the `/opt/mesosphere/lib` directory and delete this library file. Deleting this file will prevent conflicts.
    ```bash
      libltdl.so.7
    ```

1.  Download and run the node upgrade script.
    ```bash
    curl -O <Node upgrade script URL>
    sudo bash dcos_node_upgrade.sh
    ```

1.  Verify that the upgrade script succeeded and exited with the status code `0`.
    ```bash
    echo $?
    0
    ```

1.  Validate the upgrade.

    - Verify that `curl http://<dcos_agent_private_ip>:5051/metrics/snapshot` has the metric `slave/registered` with a value of `1`.
    - Monitor the Mesos UI to verify that the upgraded node rejoins the DC/OS cluster and that tasks are reconciled (`http://<master-ip>/mesos`).
     If you are upgrading from permissive to strict mode, this URL will be `https://<master-ip>/mesos`.

## <a name="troubleshooting"></a>Troubleshooting Recommendations

The following commands should provide insight into upgrade issues:

### On All Cluster Nodes

```bash
sudo journalctl -u dcos-download
sudo journalctl -u dcos-spartan
sudo systemctl | grep dcos
```

If your upgrade fails because of a [custom node or cluster check](/mesosphere/dcos/2.1/installing/production/deploying-dcos/node-cluster-health-check/), run these commands for more details:
```bash
dcos-check-runner check node-poststart
dcos-check-runner check cluster
```

### On DC/OS Masters

[enterprise type="inline" size="small" /]
```bash
sudo journalctl -u dcos-exhibitor
less /opt/mesosphere/active/exhibitor/usr/zookeeper/zookeeper.out
sudo journalctl -u dcos-mesos-dns
sudo journalctl -u dcos-mesos-master
```

[oss type="inline" size="small" /]
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

- Packages available in the DC/OS 2.1 {{ model.packageRepo }} are newer than those in the older versions of {{ model.packageRepo }}. Services are not automatically upgraded when DC/OS is installed because not all DC/OS services have upgrade paths that will preserve existing states.

[install]: /mesosphere/dcos/2.1/installing/production/deploying-dcos/installation/#custom-build-file
[cmd]: /mesosphere/dcos/2.1/installing/production/deploying-dcos/installation/#nginx-cmd
