---
layout: layout.pug
excerpt:
title: Advanced DC/OS Installation Guide
navigationTitle: Advanced
menuWeight: 300
---

With this installation method, you package the DC/OS distribution yourself and connect to every node manually to run the DC/OS installation commands. This installation method is recommended if you want to integrate with an existing system or if you don’t have SSH access to your cluster.

The advanced installer requires:

*   The bootstrap node must be network accessible from the cluster nodes.
*   The bootstrap node must have the HTTP(S) ports open from the cluster nodes.

The DC/OS installation creates these folders:

<table class="table">
  <tr>
    <th>Folder</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>/opt/mesosphere</code></td>
    <td>Contains all the DC/OS binaries, libraries, cluster configuration. Do not modify.</td>
  </tr>
  <tr>
    <td><code>/etc/systemd/system/dcos.target.wants</code></td>
    <td>Contains the systemd services which start the things that make up systemd. They must live outside of <code>/opt/mesosphere</code> because of systemd constraints.</td>
  </tr>
  <tr>
    <td><code>/etc/systemd/system/dcos.&lt;units&gt;</code></td>
    <td>Contains copies of the units in <code>/etc/systemd/system/dcos.target.wants</code>. They must be at the top folder as well as inside <code>dcos.target.wants</code>.</td>
  </tr>
  <tr>
    <td><code>/var/lib/dcos/exhibitor/zookeeper</code></td>
    <td>Contains the <a href="/1.10/overview/concepts/#mesos-exhibitor-zookeeper">ZooKeeper</a> data.</td>
  </tr>
  <tr>
    <td><code>/var/lib/docker</code></td>
    <td>Contains the Docker data. </td>
  </tr>
  <tr>
    <td><code>/var/lib/dcos</code></td>
    <td>Contains the DC/OS and Mesos Master data.</td>
  </tr>
  <tr>
    <td><code>/var/lib/mesos</code></td>
    <td>Contains the Mesos Agent data.</td>
  </tr>
</table>

**Important:** Changes to `/opt/mesosphere` are unsupported. They can lead to unpredictable behavior in DC/OS and prevent upgrades.

# Prerequisites
Your cluster must meet the software and hardware [requirements](/1.10/installing/oss/custom/system-requirements/).

## Configure your cluster

1.  Create a directory named `genconf` on your bootstrap node and navigate to it.

    ```bash
    mkdir -p genconf
    ```

2.  Create a configuration file and save as `genconf/config.yaml`.

    In this step you create a YAML configuration file that is customized for your environment. DC/OS uses this configuration file during installation to generate your cluster installation files.

    You can use this template to get started. This template specifies three Mesos masters, three ZooKeeper instances for Exhibitor storage, static master discovery list, internal storage backend for Exhibitor, a custom proxy, and Google DNS resolvers. If your servers are installed with a domain name in your `/etc/resolv.conf`, you should add `dns_search` to your `config.yaml` file. For parameters descriptions and configuration examples, see the [documentation][1].

    **Tips:**

    - If Google DNS is not available in your country, you can replace the Google DNS servers `8.8.8.8` and `8.8.4.4` with your local DNS servers.
    - If you specify `master_discovery: static`, you must also create a script to map internal IPs to public IPs on your bootstrap node (e.g., `genconf/ip-detect-public`). This script is then referenced in `ip_detect_public_filename: <relative-path-from-dcos-generate-config.sh>`.

    ```yaml
    ---
    bootstrap_url: http://<bootstrap_ip>:<your_port>
    cluster_name: <cluster-name>
    exhibitor_storage_backend: static
    master_discovery: static
    ip_detect_public_filename: genconf/ip-detect-public
    master_list:
    - <master-private-ip-1>
    - <master-private-ip-2>
    - <master-private-ip-3>
    resolvers:
    - 169.254.169.253
    use_proxy: 'true'
    http_proxy: http://<proxy_host>:<http_proxy_port>
    https_proxy: https://<proxy_host>:<https_proxy_port>
    no_proxy:
    - 'foo.bar.com'
    - '.baz.com'
    ```

<a id="ip-detect-script"></a>

3.  Create an `ip-detect` script.



    In this step, an IP detect script is created. This script reports the IP address of each node across the cluster. Each node in a DC/OS cluster has a unique IP address that is used to communicate between nodes in the cluster. The IP detect script prints the unique IPv4 address of a node to STDOUT each time DC/OS is started on the node.

    **Important:**

    - The IP address of a node must not change after DC/OS is installed on the node. For example, the IP address should not change when a node is rebooted or if the DHCP lease is renewed. If the IP address of a node does change, the node must be [wiped and reinstalled](/1.10/installing/oss/custom/uninstall/).
    - The script must return the same IP address as specified in the `config.yaml`. For example, if the private master IP is specified as `10.2.30.4` in the `config.yaml`, your script should return this same value when run on the master.

    Create an IP detect script for your environment and save as `genconf/ip-detect`. This script must be `UTF-8` encoded and have a valid [shebang](https://en.wikipedia.org/wiki/Shebang_%28Unix%29) line. You can use the examples below:

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

        curl -fsSL -H "Metadata-Flavor: Google" http://169.254.169.254/computeMetadata/v1/instance/network-interfaces/0/ip
        ```

    *   #### Use the IP address of an existing interface

        This method discovers the IP address of a particular interface of the node.

        If you have multiple generations of hardware with different internals, the interface names can change between hosts. The IP detect script must account for the interface name changes. The example script could also be confused if you attach multiple IP addresses to a single interface, or do complex Linux networking, etc.

        ```bash
        #!/usr/bin/env bash
        set -o nounset -o errexit
        export PATH=/usr/sbin:/usr/bin:$PATH
        echo $(ip addr show eth0 | grep -Eo '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}' | head -1)
        ```

    *   #### Use the network route to the Mesos master

        This method uses the route to a Mesos master to find the source IP address to then communicate with that node.

        In this example, we assume that the Mesos master has an IP address of `172.28.128.3`. You can use any language for this script. Your Shebang line must be pointed at the correct environment for the language used and the output must be the correct IP address.

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

# Install DC/OS

In this step you create a custom DC/OS build file on your bootstrap node and then install DC/OS onto your cluster. With this method you package the DC/OS distribution yourself and connect to every server manually and run the commands.

**Important:**
- Do not install DC/OS until you have these items working: ip-detect script, DNS, and NTP everywhere. For help with troubleshooting, see the [documentation](/1.10/installing/oss/troubleshooting/).
- If something goes wrong and you want to rerun your setup, use these cluster [cleanup instructions][8].

**Prerequisites**

*   A `genconf/config.yaml` file that is optimized for manual distribution of DC/OS across your nodes.
*   A `genconf/ip-detect` script that matches your environment.

To install DC/OS:

1.  Download the [DC/OS installer][4].

    ```bash
    curl -O https://downloads.dcos.io/dcos/stable/dcos_generate_config.sh
    ```

1.  From the bootstrap node, run the DC/OS installer shell script to generate a customized DC/OS build file. The setup script extracts a Docker container that uses the generic DC/OS install files to create customized DC/OS build files for your cluster. The build files are output to `./genconf/serve/`.

    **Tip:** You can view all of the automated command line installer options with the `dcos_generate_config.sh --help` flag.

    ```bash
    sudo bash dcos_generate_config.sh
    ```

    At this point your directory structure should resemble:

        ├── dcos-genconf.<HASH>.tar
        ├── dcos_generate_config.sh
        ├── genconf
        │   ├── config.yaml
        │   ├── ip-detect


    **Tip:** For the install script to work, you must have created `genconf/config.yaml` and `genconf/ip-detect`.

1.  <a name="nginx"></a>From your home directory, run this command to host the DC/OS install package through an NGINX Docker container. For `<your-port>`, specify the port value that is used in the `bootstrap_url`.

    ```bash
    sudo docker run -d -p <your-port>:80 -v $PWD/genconf/serve:/usr/share/nginx/html:ro nginx
    ```

1.  Run these commands on each of your master nodes in succession to install DC/OS using your custom build file.

    **Tip:** Although there is no actual harm to your cluster, DC/OS may issue error messages until all of your master nodes are configured.

    1.  SSH to your master nodes:

        ```bash
        ssh <master-ip>
        ```

    2.  Make a new directory and navigate to it:

        ```bash
        mkdir /tmp/dcos && cd /tmp/dcos
        ```

    3.  Download the DC/OS installer from the NGINX Docker container, where `<bootstrap-ip>` and `<your_port>` are specified in `bootstrap_url`:

        ```bash
        curl -O http://<bootstrap-ip>:<your_port>/dcos_install.sh
        ```

    4.  Run this command to install DC/OS on your master nodes:

        ```bash
        sudo bash dcos_install.sh master
        ```

1.  Run these commands on each of your agent nodes to install DC/OS using your custom build file.

    1.  SSH to your agent nodes:

        ```bash
        ssh <agent-ip>
        ```

    2.  Make a new directory and navigate to it:

        ```bash
        mkdir /tmp/dcos && cd /tmp/dcos
        ```

    3.  Download the DC/OS installer from the NGINX Docker container, where `<bootstrap-ip>` and `<your_port>` are specified in `bootstrap_url`:

        ```bash
        curl -O http://<bootstrap-ip>:<your_port>/dcos_install.sh
        ```

    4.  Run this command to install DC/OS on your agent nodes. You must designate your agent nodes as [public][6] or [private][7].

        *  Private agent nodes:

            ```bash
            sudo bash dcos_install.sh slave
            ```

        *  Public agent nodes:

           ```bash
           sudo bash dcos_install.sh slave_public
           ```

1.  Monitor Exhibitor and wait for it to converge at `http://<master-ip>:8181/exhibitor/v1/ui/index.html`.

    __Tip:__ If you encounter errors such as `Time is marked as bad`, `adjtimex`, or `Time not in sync` in journald, verify that Network Time Protocol (NTP) is enabled on all nodes. For more information, see the [system requirements](/1.10/installing/oss/custom/system-requirements/#port-and-protocol-configuration).

    ![alt text](/1.10/img/chef-zk-status.png)

    When the status icons are green, you can access the DC/OS web interface.

1.  Launch the DC/OS web interface at: `http://<master-node-public-ip>/`. If this doesn't work, take a look at the [troubleshooting docs][9]

    ![DC/OS dashboard](/1.10/img/dcos-gui.png)

### Next Steps

- [Add users to your cluster][10]
- [Install the DC/OS Command-Line Interface (CLI)][2]
- [Troubleshooting DC/OS installation][9]
- [Uninstalling DC/OS][8]

[1]: /1.10/installing/oss/custom/configuration/configuration-parameters/
[2]: /1.10/cli/install/
[4]: https://downloads.dcos.io/dcos/stable/dcos_generate_config.sh
[6]: /1.10/overview/concepts/#public-agent-node
[7]: /1.10/overview/concepts/#private-agent-node
[8]: /1.10/installing/oss/custom/uninstall/
[9]: /1.10/installing/oss/troubleshooting/
[10]: /1.10/security/ent/users-groups/
