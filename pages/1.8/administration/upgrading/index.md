---
layout: layout.pug
navigationTitle:  Upgrading
title: Upgrading
menuWeight: 0
excerpt:
featureMaturity:
enterprise: true
---

This document provides instructions for upgrading a DC/OS cluster.  

If this upgrade is performed on a supported OS with all prerequisites fulfilled, this upgrade _should_ preserve the state of running tasks on the cluster.  This document reuses portions of the [Advanced DC/OS Installation Guide][advanced-install].  

**Important:**

- Review the [release notes](/docs/1.8/administration/release-notes) before upgrading DC/OS.
- Many new security [features](/docs/1.8/administration/release-notes/) were added in 1.8 and the upgrade process has changed significantly.
- The DC/OS GUI and other higher-level system APIs may be inconsistent or unavailable until all master nodes have been upgraded. For example, an upgraded DC/OS Marathon leader cannot connect to the leading Mesos master until it has also been upgraded. When this occurs:

    - The DC/OS GUI may not provide an accurate list of services.
    - For multi-master configurations, after one master has finished upgrading, you can monitor the health of the remaining masters from the Exhibitor UI on port 8181.
- The [VIP features](/docs/1.8/usage/service-discovery/load-balancing-vips/virtual-ip-addresses/), added in DC/OS 1.8, require that ports 32768 - 65535 are open between all agent and master nodes for both TCP and UDP.
- Virtual networks require Docker 1.11. For more information, see the [documentation](/docs/1.8/administration/virtual-networks/).
- An upgraded DC/OS Marathon leader cannot connect to an non-secure (i.e. not upgraded) leading Mesos master. The DC/OS UI cannot be trusted until all masters are upgraded. There are multiple Marathon scheduler instances and multiple Mesos masters, each being upgraded, and the Marathon leader may not be the Mesos leader.
- Task history in the Mesos UI will not persist through the upgrade.
- `.mesos` domains may fail to resolve during the 1.7 to 1.8 master upgrade, but will eventually recover.

## Modifying DC/OS configuration

You _cannot_ change your cluster configuration at the same time as upgrading to a new version. Cluster configuration changes must be done with an update to an already installed version. For example, you cannot simultaneously upgrade a cluster from 1.8.x to 1.8.y and add more public agents. You can add more public agents with an update to 1.8.x, and then upgrade to 1.8.y. Or you can upgrade to 1.8.y and then add more public agents by updating 1.8.y after the upgrade. 

To modify your DC/OS configuration, you must run the installer with the modified `config.yaml` and update your cluster using the new installation files. Changes to the DC/OS configuration have the same risk as upgrading a host. Incorrect configurations could potentially crash your hosts, or an entire cluster.

Only a subset of DC/OS configuration parameters can be modified. The adverse effects on any software that is running on top of DC/OS is outside of the scope of this document. Contact Mesosphere Support for more information. 

Here is a list of the parameters that you can modify:

- [`dns_search`](/docs/1.8/administration/installing/ent/custom/configuration-parameters/#dns-search)
- [`docker_remove_delay`](/docs/1.8/administration/installing/ent/custom/configuration-parameters/#docker-remove)
- [`gc_delay`](/docs/1.8/administration/installing/ent/custom/configuration-parameters/#gc-delay)
- [`resolvers`](/docs/1.8/administration/installing/ent/custom/configuration-parameters/#resolvers)
- [`telemetry_enabled`](/docs/1.8/administration/installing/ent/custom/configuration-parameters/#telemetry-enabled)
- [`use_proxy`](/docs/1.8/administration/installing/ent/custom/configuration-parameters/#use-proxy)
    - [`http_proxy`](/docs/1.8/administration/installing/ent/custom/configuration-parameters/#use-proxy)
    - [`https_proxy`](/docs/1.8/administration/installing/ent/custom/configuration-parameters/#use-proxy)
    - [`no_proxy`](/docs/1.8/administration/installing/ent/custom/configuration-parameters/#use-proxy)

The security mode (`security`) can be changed but has special caveats.

- You can only update to a stricter security mode. Security downgrades are not supported. For example, if your cluster is in `permissive` mode and you want to downgrade to `disabled` mode, you must reinstall the cluster and terminate all running workloads.
- During each update, you can only increase your security by a single level. For example, you cannot update directly from `disabled` to `strict` mode. To increase from `disabled` to `strict` mode you must first update to `permissive` mode, and then update from `permissive` to `strict` mode. 

See the security [mode](/docs/1.8/administration/installing/ent/custom/configuration-parameters/#security) for a description of the different security modes and what each means.

# Instructions
These steps must be performed for version upgrades and cluster configuration changes. 

## Prerequisites

- Mesos, Mesos Frameworks, Marathon, Docker and all running tasks in the cluster should be stable and in a known healthy state.
- For Mesos compatibility reasons, we recommend upgrading any running Marathon-on-Marathon instances to version Marathon 0.16.0-RC3 before proceeding with this DC/OS upgrade.
- You must have access to copies of the config files used with the previous DC/OS version: `config.yaml` and `ip-detect`.
- You must be using systemd 218 or newer to maintain task state.
- All hosts (masters and agents) must be able to communicate with all other hosts on all ports, for both TCP and UDP.
- In CentOS or RedHat, install IP sets with this command (used in some IP detect scripts): `sudo yum install -y ipset`
- You must be familiar with using `systemctl` and `journalctl` command line tools to review and monitor service status. Troubleshooting notes can be found at the end of this [document](#troubleshooting).
- You must be familiar with the [Advanced DC/OS Installation Guide][advanced-install].
- Take a snapshot of ZooKeeper prior to upgrading. Marathon supports rollbacks, but does not support downgrades.
- Verify that all Marathon application constraints are valid before beginning the upgrade.  Use this [script](https://github.com/mesosphere/public-support-tools/blob/master/check-constraints.py) to check if your constraints are valid.

## Bootstrap Node

Choose your desired security mode and then follow the applicable upgrade instructions. 

- [Installing DC/OS 1.8 in disabled mode](#disabled)
- [Installing DC/OS 1.8 in permissive mode](#permissive)
- [Installing DC/OS 1.8 in strict mode](#strict)

# <a name="disabled"></a>Installing DC/OS 1.8 in disabled mode
This procedure upgrades a cluster running DC/OS 1.7 to DC/OS 1.8 in [disabled security mode](/docs/1.8/administration/installing/ent/custom/configuration-parameters/#security).

1.  Copy your existing `config.yaml` and `ip-detect` files to an empty `genconf` folder on your bootstrap node. The folder should be in the same directory as the installer. 
1.  Merge the old `config.yaml` into the new `config.yaml` format. In most cases the differences will be minimal.

    **Important:**
    
    *  You cannot change the `exhibitor_zk_backend` setting during an upgrade.
    *  The syntax of the DC/OS 1.8 `config.yaml` may be different from the 1.7 version. For a detailed description of the 1.8 `config.yaml` syntax and parameters, see the [documentation](/docs/1.8/administration/installing/ent/custom/configuration-parameters/).
1.  **1.7 to 1.8 upgrades only:** Add `security: disabled` to your `config.yaml`.
1. After updating the format of the `config.yaml`, compare the old `config.yaml` and new `config.yaml`.  Verify that there are no differences in pathways or configurations as changing these while upgrading can lead to catastrophic cluster failures.
1.  Modify the `ip-detect` file as desired. 
1.  Build your installer package.

    1.  Download the `dcos_generate_config.ee.sh` file.
    1.  Generate the installation files.
    
        ```bash
        sudo bash dcos_generate_config.ee.sh
        ```
        
    1.  Disable Docker restarts in `dcos_install.sh` by using this command:

        ```bash
        sed -i -e "s/systemctl restart systemd-journald//g" -e "s/systemctl restart docker//g" genconf/serve/dcos_install.sh
        ```

        **Important:** This step is critical to prevent task restarts.

    1.  From your home directory, run this command to host the DC/OS install package through an NGINX Docker container. For `<your-port>`, specify the port value that is used in the `bootstrap_url`.
                                                                                         
        ```bash
        sudo docker run -d -p <your-port>:80 -v $PWD/genconf/serve:/usr/share/nginx/html:ro nginx
        ```
    
1.  Go to the DC/OS Master [procedure](#masters) to complete your installation.

# <a name="permissive"></a>Installing DC/OS 1.8 in permissive mode
This procedure upgrades to DC/OS 1.8 in [permissive security mode](/docs/1.8/administration/installing/ent/custom/configuration-parameters/#security). 

**Prerequisite:**

- Your cluster must be running DC/OS 1.8 in [disabled security mode](#disabled) before it can be updated to permissive mode. To update a 1.8 cluster from disabled security to permissive security, complete the following procedure:

1.  Replace `security: disabled` with `security: permissive` in your `config.yaml`. Do not make any other changes to pathways or configurations in the `config.yaml`.
1.  Modify the `ip-detect` file as desired. 
1.  Build your installer package.

    1.  Download the `dcos_generate_config.ee.sh` file.
    1.  Generate the installation files.
    
        ```bash
        sudo bash dcos_generate_config.ee.sh
        ```
        
    1.  Disable Docker restarts in `dcos_install.sh` by using this command:

        ```bash
        sed -i -e "s/systemctl restart systemd-journald//g" -e "s/systemctl restart docker//g" genconf/serve/dcos_install.sh
        ```

        **Important:** This step is critical to prevent task restarts.

    1.  From your home directory, run this command to host the DC/OS install package through an NGINX Docker container. For `<your-port>`, specify the port value that is used in the `bootstrap_url`.
                                                                                             
        ```bash
        sudo docker run -d -p <your-port>:80 -v $PWD/genconf/serve:/usr/share/nginx/html:ro nginx
        ```
    
1.  Go to the DC/OS Master [procedure](#masters) to complete your installation.

# <a name="strict"></a>Installing DC/OS 1.8 in strict mode
This procedure upgrades to DC/OS 1.8 in [strict security mode](/docs/1.8/administration/installing/ent/custom/configuration-parameters/#security). 

If you are updating a running DC/OS cluster to run in `security: strict` mode, beware that security vulnerabilities may persist even after migration to strict mode. When moving to strict mode, your services will now require authentication and authorization to register with Mesos or access its HTTP API. You should test these configurations in permissive mode before upgrading to strict, to maintain scheduler and script uptimes across the upgrade.

**Prerequisite:**

- Your cluster must be running DC/OS 1.8 in [permissive security mode](#permissive) before it can be updated to strict mode. To update a cluster from permissive security to strict security, complete the following procedure:

1.  Replace `security: permissive` with `security: strict` in your `config.yaml`. Do not make any other changes to pathways or configurations in the `config.yaml`.
1.  Modify the `ip-detect` file as desired. 
1.  Build your installer package.

    1.  Download the `dcos_generate_config.ee.sh` file.
    1.  Generate the installation files.
    
        ```bash
        sudo bash dcos_generate_config.ee.sh
        ```
        
    1.  Disable Docker restarts in `dcos_install.sh` by using this command:

        ```bash
        sed -i -e "s/systemctl restart systemd-journald//g" -e "s/systemctl restart docker//g" genconf/serve/dcos_install.sh
        ```

        **Important:** This step is critical to prevent task restarts.

    1.  From your home directory, run this command to host the DC/OS install package through an NGINX Docker container. For `<your-port>`, specify the port value that is used in the `bootstrap_url`.
                                                                                             
        ```bash
        sudo docker run -d -p <your-port>:80 -v $PWD/genconf/serve:/usr/share/nginx/html:ro nginx
        ```
    
1.  Go to the DC/OS Master [procedure](#masters) to complete your installation.

## <a name="masters"></a>DC/OS Masters

[SSH](/docs/1.8/administration/access-node/sshcluster/) to your master node and identify the ZooKeeper leader among the masters. This node should be the last master node that you upgrade. You can determine whether a master node is a ZooKeeper leader by sending the `stat` command to the ZooKeeper client port.

```bash
echo stat | /opt/mesosphere/bin/toybox nc localhost 2181 | grep "Mode:"
```

Proceed with upgrading every master node using the following procedure. When you complete each upgrade, monitor the Mesos master metrics to ensure the node has rejoined the cluster and completed reconciliation.

1.  Download the `dcos_install.sh` script:

    ```bash
    curl -O <bootstrap_url>/dcos_install.sh
    ```

1.  Remove all of the DC/OS software packages:

    ```bash
    sudo -i /opt/mesosphere/bin/pkgpanda uninstall
    ```

1.  Remove the DC/OS install and config directories:

    ```bash
    sudo rm -rf /opt/mesosphere /etc/mesosphere
    ```

1.  **1.7 to 1.8 upgrades only:** If the type of storage backend for Exhibitor is set to `exhibitor_storage_backend: zookeeper` or set to `exhibitor_storage_backend: aws_s3`, you must add the Linux user `dcos_exhibitor` and give it ownership of the ZooKeeper data directory:

    ```bash
    sudo useradd --system --home-dir /opt/mesosphere --shell /sbin/nologin -c 'DCOS System User' dcos_exhibitor
    sudo chown -R dcos_exhibitor /var/lib/zookeeper
    ```

1.  Run the new DC/OS installer script:

    ```bash
     sudo bash dcos_install.sh -d master
    ```

1.  Validate the upgrade:

    1.  Monitor Exhibitor and wait for it to converge at `http://<master-ip>:8181/exhibitor/v1/ui/index.html`. Confirm that the master rejoins the ZooKeeper quorum successfully (the status indicator will turn green). 
    
        **Tip:** If you are upgrading from permissive to strict mode, this URL will be `https://...`.
    1.  Wait until the `dcos-mesos-master` unit is up and running.
    1.  Verify that `curl http://<dcos_master_private_ip>:5050/metrics/snapshot` has the metric `registrar/log/recovered` with a value of `1`.
        **Tip:** If you are upgrading from permissive to strict mode, this URL will be `curl https://...` and you will need a JWT for access.
    1.  Verify that `/opt/mesosphere/bin/mesos-master --version` indicates that the upgraded master is running Mesos 1.0.1.

1.  Go to the DC/OS Agents [procedure](#agents) to complete your installation.

## <a name="agents"></a>DC/OS Agents

**Important:** When reinstalling on agent nodes, there is a 5 minute timeout for the agent to respond to health check pings from the mesos-masters before it is considered lost and its tasks are given up for dead.

On all DC/OS agents:

1.  Download the `dcos_install.sh` script:

    ```bash
    curl -O <bootstrap_url>/dcos_install.sh
    ```

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

1.  Remove all of the DC/OS software packages:

    ```bash
    sudo -i /opt/mesosphere/bin/pkgpanda uninstall
    ```

1.  Remove the DC/OS install and config directories:

    ```bash
    sudo rm -rf /opt/mesosphere /etc/mesosphere
    ```

1.  **1.7 to 1.8 upgrades only:** The DC/OS installer discovers and combines your agent's configuration parameters into a file named `mesos-resources`. As a part of this process the available disk space of each node is calculated. If you have not made explicit disk size reservations, you must create a placeholder for the disk reservation file. This prevents the installer from building a new disk reservation file that might conflict with your stored agent metadata:

    ```bash
    sudo mkdir -p /var/lib/dcos
    sudo touch /var/lib/dcos/mesos-resources
    ```

1.  Run the new DC/OS installer script:

    -  [Private](/docs/1.8/overview/concepts/#private) agent nodes:

       ```bash
       sudo bash dcos_install.sh -d slave
       ```

    -  [Public](/docs/1.8/overview/concepts/#public) agent nodes:

       ```bash
       sudo bash dcos_install.sh -d slave_public
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

- Packages available in the DC/OS 1.8 Universe are newer than those in the DC/OS 1.7 Universe. Services are not automatically upgraded when  DC/OS 1.8 is installed because not all DC/OS services have upgrade paths that will preserve existing state.

[advanced-install]: /docs/1.8/administration/installing/ent/custom/advanced/
