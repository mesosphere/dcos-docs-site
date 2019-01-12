---
layout: layout.pug
navigationTitle: Production Installation
title: Production Installation
menuWeight: 15
excerpt: Installing production-ready DC/OS 
---


This page outlines how to install DC/OS for production. Using this method, you can package the DC/OS distribution and connect to every node manually to run the DC/OS installation commands. This installation method is recommended if you want to integrate with an existing system or if you do not have SSH access to your cluster.

The DC/OS installation process requires a bootstrap node, master node, public agent node, and a private agent node. You can view the [nodes](/1.11/overview/concepts/#node) documentation for more information.

# Production Installation Process

 The following steps are required to install DC/OS clusters:

1. Configure bootstrap node
1. Install DC/OS on master node
1. Install DC/OS on agent node

![Production Installation Process](/1.11/img/advanced-installer.png)
Figure 1. The production installation process


This installation method requires the following:

*   The bootstrap node must be network accessible from the cluster nodes.
*   The bootstrap node must have the HTTP(S) ports open from the cluster nodes.

The DC/OS installation creates the following folders:

| Folder                                  | Description                                                                                                                                    |
|-----------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| `/opt/mesosphere`                       | Contains the DC/OS binaries, libraries, and cluster configuration. Do not modify.                                                              |
| `/etc/systemd/system/dcos.target.wants` | Contains the systemd services that start the systemd components. They must be located outside of `/opt/mesosphere` because of systemd constraints.   |
| `/etc/systemd/system/dcos.<units>`      | Contains copies of the units in `/etc/systemd/system/dcos.target.wants`. They must be at the top folder as well as inside `dcos.target.wants`. |
| `/var/lib/dcos/exhibitor/zookeeper`     | Contains the [ZooKeeper](/1.11/overview/concepts/#exhibitor-zookeeper) data.                                                                   |
| `/var/lib/docker`                       | Contains the Docker data.                                                                                                                      |
| `/var/lib/dcos`                         | Contains the DC/OS data.                                                                                                                       |
| `/var/lib/mesos`                        | Contains the Mesos data.                                                                                                                       |

<p class="message--warning"><strong>WARNING: </strong>Changes to <code>/opt/mesosphere</code> are unsupported. They can lead to unpredictable behavior in DC/OS and prevent upgrades.</p>

## Prerequisites
Before installing DC/OS, your cluster must meet the software and hardware [requirements](/1.11/installing/production/system-requirements/).


# <a name="configure-cluster"></a>Configure your cluster

1.  Create a directory named `genconf` on your bootstrap node and navigate to it.

    ```bash
    mkdir -p genconf
    ```
[enterprise]
# <a name="license"></a>Store license file
[/enterprise]

Create a [license file](/1.11/administering-clusters/licenses/) containing the license text received in email sent by your Authorized Support Contact and save as `genconf/license.txt`.

# <a name="ip-detect-script"></a>Create an IP detection script

In this step, an IP detection script is created. This script reports the IP address of each node across the cluster. Each node in a DC/OS cluster has a unique IP address that is used to communicate between nodes in the cluster. The IP detection script prints the unique IPv4 address of a node to STDOUT each time DC/OS is started on the node.

<p class="message--note"><strong>NOTE: </strong>The IP address of a node must not change after DC/OS is installed on the node. For example, the IP address should not change when a node is rebooted or if the DHCP lease is renewed. If the IP address of a node does change, the node must be <a href="/1.11/installing/production/uninstalling/">uninstalled</a>.</p>

<p class="message--note"><strong>NOTE: </strong>The script must return the same IP address as specified in the <code>config.yaml</code>. For example, if the private master IP is specified as <code>10.2.30.4</code> in the <code>config.yaml</code>, your script should return this same value when run on the master.</p>

1.  Create an IP detection script for your environment and save as `genconf/ip-detect`. This script needs to be `UTF-8` encoded and have a valid [shebang](https://en.wikipedia.org/wiki/Shebang_(Unix)) line. You can use the examples below.

    *   #### Use the AWS Metadata Server

        This method uses the AWS Metadata service to get the IP address:

        ```bash
        #!/bin/sh
        # Example ip-detect script using an external authority
        # Uses the AWS Metadata Service to get the node's internal
        # ipv4 address
        curl -fsSL http://169.254.169.254/latest/meta-data/local-ipv4
        ```

    *   #### Use the GCE Metadata Server

        This method uses the GCE Metadata Server to get the IP address:

        ```bash
        #!/bin/sh
        # Example ip-detect script using an external authority
        # Uses the GCE metadata server to get the node's internal
        # ipv4 address

        curl -fsSl -H "Metadata-Flavor: Google" http://169.254.169.254/computeMetadata/v1/instance/network-interfaces/0/ip
        ```

    *   #### Use the IP address of an existing interface

        This method discovers the IP address of a particular interface of the node.

        If you have multiple generations of hardware with different internal IP address, the interface names can change between hosts. The IP detect script must account for the interface name changes. The example script could also be confused if you attach multiple IP addresses to a single interface, or do complex Linux networking, etc.

        ```bash
        #!/usr/bin/env bash
        set -o nounset -o errexit
        export PATH=/usr/sbin:/usr/bin:$PATH
        echo $(ip addr show eth0 | grep -Eo '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}' | head -1)
        ```

    *   #### Use the network route to the Mesos master

        This method uses the route to a Mesos master to find the source IP address to then communicate with that node.

        In this example, we assume that the Mesos master has an IP address of `172.28.128.3`. You can use any language for this script. Your Shebang line must be pointed at the correct environment for the language used and the output must be the correct IP address.

        [enterprise type="inline" size="small" /]

        ```bash
        #!/usr/bin/env bash
        set -o nounset -o errexit
        MASTER_IP=172.28.128.3
        echo $(/usr/sbin/ip route show to match 172.28.128.3 | grep -Eo '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}' | tail -1)
        ```

        [oss type="inline" size="small" /]

        ```bash
        #!/usr/bin/env bash
        set -o nounset -o errexit -o pipefail
        export PATH=/sbin:/usr/sbin:/bin:/usr/bin:$PATH
        MASTER_IP=$(dig +short master.mesos || true)
        MASTER_IP=${MASTER_IP:-172.28.128.3}
        INTERFACE_IP=$(ip r g ${MASTER_IP} | \
        awk -v master_ip=${MASTER_IP} '
        BEGIN { ec = 1 }
        {
        if($1 == master_ip) {
                print $7
                ec = 0
        } else if($1 == "local") {
                print $6
                ec = 0
        }
            if (ec == 0) exit;
            }
            END { exit ec }
            ')
        echo $INTERFACE_IP
        ```

[enterprise]
# Create a fault domain detection script
[/enterprise]

By default, DC/OS clusters have [fault domain awareness](/1.11/deploying-services/fault-domain-awareness/) enabled, so no changes to your `config.yaml` are required to use this feature. However, you must include a fault domain detection script named `fault-domain-detect` in your `./genconf` directory. To opt out of fault domain awareness, set the `fault_domain_enabled` parameter of your `config.yaml` file to `false`.


1. Create a fault domain detect script named `fault-domain-detect` to run on each node to detect the node's fault domain. During installation, the output of this script is passed to Mesos.

    We recommend the format for the script output be:

    ```json
    {
        "fault_domain": {
            "region": {
                "name": "<region-name>"
            },
            "zone": {
                "name": "<zone-name>"
            }
        }
    }
    ```

    We provide [fault domain detect scripts for AWS and Azure nodes](https://github.com/dcos/dcos/tree/master/gen/fault-domain-detect). For a cluster that has aws nodes and azure nodes you would combine the two into one script. You can use these as a model for creating a fault domain detect script for an on premises cluster.

    <p class="message--important"><strong>IMPORTANT: </strong>This script will not work if you use proxies in your environment. If you use a proxy, modifications will be required.</p>


2. Add your newly created `fault-domain-detect` script to the `/genconf` directory of your bootstrap node.


# Create a configuration file

In this step, you can create a YAML configuration file that is customized for your environment. DC/OS uses this configuration file during installation to generate your cluster installation files. 

[Enterprise]
## Set up a super user password
[/enterprise]
In the following instructions, we assume that you are using ZooKeeper for shared storage.

1.  From the bootstrap node, run this command to create a hashed password for superuser authentication, where `<superuser_password>` is the superuser password. 

2. Save the hashed password key for use in the `superuser_password_hash` parameter in your `config.yaml` file.

    ```bash
    sudo bash dcos_generate_config.ee.sh --hash-password <superuser_password>
    ```

    Here is an example of a hashed password output.

    ```
    Extracting an image from this script and loading it into a docker daemon, can take a few minutes.
    dcos-genconf.9eda4ae45de5488c0c-c40556fa73a00235f1.tar
    Running mesosphere/dcos-genconf docker with BUILD_DIR set to /home/centos/genconf
    00:42:10 dcos_installer.action_lib.prettyprint:: ====> HASHING PASSWORD TO SHA512
    00:42:11 root:: Hashed password for 'password' key:
    $6$rounds=656000$v55tdnlMGNoSEgYH$1JAznj58MR.Bft2wd05KviSUUfZe45nsYsjlEl84w34pp48A9U2GoKzlycm3g6MBmg4cQW9k7iY4tpZdkWy9t1
    ```

## Create the configuration 
Create a configuration file and save as `genconf/config.yaml`. You can use this template to get started. 

The Enterprise template specifies three Mesos masters, static master discovery list, internal storage backend for Exhibitor, a custom proxy, security mode specified, and cloud specific DNS resolvers. [enterprise type="inline" size="small" /]

The Open Source template specifies three Mesos masters, three ZooKeeper instances for Exhibitor storage, static master discovery list, internal storage backend for Exhibitor, a custom proxy, and cloud specific DNS resolvers. [oss type="inline" size="small" /]

If your servers are installed with a domain name in your `/etc/resolv.conf`, add the `dns_search` parameter. For parameter descriptions and configuration examples, see the [documentation](/1.11/installing/production/advanced-configuration/configuration-reference/).

<p class="message--note"><strong>NOTE: </strong>If AWS DNS IP is not available in your country, you can replace the AWS DNS IP servers <code>8.8.8.8</code> and <code>8.8.4.4</code> with your local DNS servers.</p>
<p class="message--note"><strong>NOTE: </strong>If you specify <code>master_discovery: static</code>, you must also create a script to map internal IPs to public IPs on your bootstrap node (for example, <code>genconf/ip-detect-public</code>). This script is then referenced in <code>ip_detect_public_filename: "relative-path-from-dcos-generate-config.sh"</code>.</p>
<p class="message--note"><strong>NOTE: </strong>In AWS, or any other environment where you can not control a node's IP address, master_discovery needs to be set to use <code>master_http_load_balancer</code>, and a load balancer needs to be set up.</p>

[enterprise]
### Enterprise template
[/enterprise]

```bash
bootstrap_url: http://<bootstrap_ip>:80
cluster_name: <cluster-name>
superuser_username:
superuser_password_hash:
#customer_key in yaml file has been replaced by genconf/license.txt in DC/OS 1.12
#customer_key: <customer-key>
exhibitor_storage_backend: static
master_discovery: static
ip_detect_public_filename: <relative-path-to-ip-script>
master_list:
- <master-private-ip-1>
- <master-private-ip-2>
- <master-private-ip-3>
resolvers:
- 169.254.169.253
# Choose your security mode: permissive or strict 
security: <security-mode>
superuser_password_hash: <hashed-password> # Generated above
superuser_username: <username> # This can be whatever you like
# A custom proxy is optional. For details, see the configuration documentation.
use_proxy: 'true'
http_proxy: http://<user>:<pass>@<proxy_host>:<http_proxy_port>
https_proxy: https://<user>:<pass>@<proxy_host>:<https_proxy_port>
no_proxy:
- 'foo.bar.com'
- '.baz.com'
# Fault domain entry required for DC/OS Enterprise 1.12+
fault_domain_enabled: false
#If IPv6 is disabled in your kernel, you must disable it in the config.yaml
enable_ipv6: 'false'
```

[oss]
### Open Source template
[/oss]
    
    bootstrap_url: http://<bootstrap_ip>:80
    cluster_name: <cluster-name>
    exhibitor_storage_backend: static
    master_discovery: static
    ip_detect_public_filename: <relative-path-to-ip-script>
    master_list:
    - <master-private-ip-1>
    - <master-private-ip-2>
    - <master-private-ip-3>
    resolvers:
    - 169.254.169.253
    use_proxy: 'true'
    http_proxy: http://<user>:<pass>@<proxy_host>:<http_proxy_port>
    https_proxy: https://<user>:<pass>@<proxy_host>:<https_proxy_port>
    no_proxy:
    - 'foo.bar.com'
    - '.baz.com'


# <a name="install-bash"></a>Install DC/OS

In this step, you will create a custom DC/OS build file on your bootstrap node and then install DC/OS onto your cluster. With this method you
1. Package the DC/OS distribution yourself
2. Connect to every server manually
3. Run the commands

<p class="message--note"><strong>NOTE: </strong>Due to a cluster configuration issue with overlay networks, we recommend setting <code>enable_ipv6</code> to <code>false</code> in <code>config.yaml</code> when upgrading or configuring a new cluster. If you have already upgraded to DC/OS 1.12.x without configuring <code>enable_ipv6</code> or if <code>config.yaml</code> file is set to <code>true</code>, then do not add new nodes.</p>

You can find additional information and a more detailed remediation procedure in our latest critical [product advisory](https://support.mesosphere.com/s/login/?startURL=%2Fs%2Farticle%2FCritical-Issue-with-Overlay-Networking&ec=302). [enterprise type="inline" size="small" /]
<p class="message--important"><strong>IMPORTANT: </strong>Do not install DC/OS until you have these items working: <code>ip-detect script</code>, <code>DNS</code>, and <code>NTP</code> on all DC/OS nodes with time synchronized. See <a href="https://docs.mesosphere.com/1.11/installing/troubleshooting/">troubleshooting</a> for more information.</p>
<p class="message--note"><strong>NOTE: </strong>If something goes wrong and you want to rerun your setup, use the cluster <a href="https://docs.mesosphere.com/1.11/installing/production/uninstalling/">uninstall</a> instructions.</p>

**Prerequisites**

*   A `genconf/config.yaml` file that is optimized for manual distribution of DC/OS across your nodes.
*   A `genconf/license.txt` file containing your DC/OS Enterprise license. [enterprise type="inline" size="small" /]
*   A `genconf/ip-detect` script.

The term `dcos_generate_config file` refers to either a `dcos_generate_config.ee.sh` file or `dcos_generate_config.sh` file, based on whether you are using the Enterprise or Open Source version of DC/OS.

- Download and save the [dcos_generate_config file](https://support.mesosphere.com/hc/en-us/articles/213198586-Mesosphere-Enterprise-DC-OS-Downloads) to your bootstrap node. This file is used to create your customized DC/OS build file. Contact your sales representative or <a href="mailto:sales@mesosphere.com">sales@mesosphere.com</a> for access to this file. [enterprise type="inline" size="small" /]

   OR

- Download and save the [dcos_generate_config file](https://downloads.dcos.io/dcos/stable/dcos_generate_config.sh) to your bootstrap node. This file is used to create your customized DC/OS build file. [oss type="inline" size="small" /]

    ```bash
    curl -O https://downloads.dcos.io/dcos/stable/dcos_generate_config.sh
    ```


1.  From the bootstrap node, run the DC/OS installer shell script to generate a customized DC/OS build file. The setup script extracts a Docker container that uses the generic DC/OS install files to create customized DC/OS build files for your cluster. The build files are output to `./genconf/serve/`.

    You can view all of the automated command line installer options with:
    * `dcos_generate_config.ee.sh --help`  flag [enterprise type="inline" size="small" /]  
    OR 
    * `dcos_generate_config.sh --help` flag. [oss type="inline" size="small" /]

    **Enterprise script** [enterprise type="inline" size="small" /]

    ```bash
    sudo bash dcos_generate_config.ee.sh
    ```

    At this point your directory structure should resemble:

    ```bash
    ├── dcos-genconf.c9722490f11019b692-cb6b6ea66f696912b0.tar
    ├── dcos_generate_config.ee.sh
    ├── genconf
    │   ├── config.yaml
    │   ├── ip-detect
    │   ├── license.txt
    ```

    **Open Source script** [oss type="inline" size="small" /]

    ```bash
    sudo bash dcos_generate_config.sh
    ```

    At this point your directory structure should resemble:

    ``` bash
    ├── dcos-genconf.<HASH>.tar
    ├── dcos_generate_config.sh
    ├── genconf
    │   ├── config.yaml
    │   ├── ip-detect
    ```

    For the install script to work, you must have created `genconf/config.yaml` and `genconf/ip-detect`.

2.  From your home directory, run the following command to host the DC/OS install package through an NGINX Docker container. For `<your-port>`, specify the port value that is used in the `bootstrap_url`.

    ```bash
    sudo docker run -d -p <your-port>:80 -v $PWD/genconf/serve:/usr/share/nginx/html:ro nginx
    ```

3.  <A name="masterinstall"></A> Run the following commands on each of your master nodes in succession to install DC/OS using your custom build file:

    * SSH to your master nodes.

        ```bash
        ssh <master-ip>
        ```
    * Make a new directory and navigate to it.

        ```bash
        mkdir /tmp/dcos && cd /tmp/dcos
        ```

    * Download the DC/OS installer from the NGINX Docker container, where `<bootstrap-ip>` and `<your_port>` are specified in `bootstrap_url`.

        ```bash
        curl -O http://<bootstrap-ip>:<your_port>/dcos_install.sh
        ```

    * Run the following command to install DC/OS on your master nodes.

        ```bash
        sudo bash dcos_install.sh master
        ```

    <p class="message--note"><strong>NOTE: </strong>Although there is no actual harm to your cluster, DC/OS may issue error messages until all of your master nodes are configured.</p>

4.  <A name="slaveinstall"></A> Run the following commands on each of your agent nodes to install DC/OS using your custom build file:

     * SSH to your agent nodes.

        ```bash
        ssh <agent-ip>
        ```

     * Make a new directory and navigate to it.

        ```bash
        mkdir /tmp/dcos && cd /tmp/dcos
        ```

     * Download the DC/OS installer from the NGINX Docker container, where `<bootstrap-ip>` and `<your_port>` are specified in `bootstrap_url`.

        ```bash
        curl -O http://<bootstrap-ip>:<your_port>/dcos_install.sh
        ```

     *  Run this command to install DC/OS on your agent nodes. You must designate your agent nodes as [Public agent nodes][2] or [Private agent nodes][3].

        *   Private agent nodes:

            ```bash
            sudo bash dcos_install.sh slave
            ```

        *   Public agent nodes:

            ```bash
            sudo bash dcos_install.sh slave_public
            ```

    __Note:__ If you encounter errors such as `Time is marked as bad`, `adjtimex`, or `Time not in sync` in journald, verify that Network Time Protocol (NTP) is enabled on all nodes. For more information, see the [system requirements](/1.11/installing/production/system-requirements/#port-and-protocol) documentation.

5.  Monitor Exhibitor and wait for it to converge at `http://<master-ip>:8181/exhibitor/v1/ui/index.html`.

    <p class="message--note"><strong>NOTE: </strong>This process can take about 10 minutes. During this time, you will see the Master nodes become visible on the Exhibitor consoles and come online, eventually showing a green light.</p>

![Exhibitor for ZooKeeper](/1.11/img/chef-zk-status.png)

Figure 2. Exhibitor for ZooKeeper

   When the status icons are green, you can access the DC/OS web interface.

6.  Launch the DC/OS web interface at: `http://<master-node-public-ip>/`. If this doesn't work, take a look at the [troubleshooting][11] documentation.

    <p class="message--note"><strong>NOTE: </strong>After clicking <strong>Log In To DC/OS</strong>, your browser may show a warning that your connection is not secure. This is because DC/OS uses self-signed certificates. You can ignore this error and click to proceed.</p>

7.  Enter your administrator username and password.

![Login screen](/1.11/img/ui-installer-auth2.png)

Figure 3. Sign in dialogue


You are done! The UI dashboard will now be displayed.

![UI dashboard](/1.11/img/dashboard-ee.png)

Figure 4. DC/OS UI dashboard

<p class="message--note"><strong>NOTE: </strong>You can also use <a href="https://docs.mesosphere.com/1.11/installing/evaluation/mesosphere-supported-methods/">Universal Installer</a> to deploy DC/OS on AWS, Azure, or GCP in production.</p>

### Next Steps: Enterprise and Open Source users

You can find information on the next steps listed below:
- [Assign user roles][7].
- [System Requirements](/1.11/installing/production/system-requirements/)
- [Public agent nodes][2]
- [Private agent nodes][3]
- [Install the DC/OS Command-Line Interface (CLI)][9]
- [Using node and cluster health checks][12]
- [Troubleshooting DC/OS installation][10]
- [Uninstalling DC/OS][11]


[1]: /1.11/installing/production/system-requirements/
[2]: /1.11/overview/concepts/#public
[3]: /1.11/overview/concepts/#private
[5]: /1.11/img/ui-installer-auth2.png
[6]: /1.11/img/dashboard-ee.png
[7]: /1.11/security/ent/users-groups/
[8]: /1.11/security/ent/users-groups/
[9]: /1.11/cli/install/
[12]: /1.11/installing/production/deploying-dcos/node-cluster-health-check/
[10]: /1.11/installing/troubleshooting/
[11]: /1.11/installing/production/uninstalling/


