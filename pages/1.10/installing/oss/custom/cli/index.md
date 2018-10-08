---
layout: layout.pug
excerpt:
title: CLI DC/OS Installation Guide
navigationTitle: CLI
menuWeight: 200
oss: true
---

The automated CLI installer provides a guided installation of DC/OS from the command line. With this method you can choose from the complete set of DC/OS configuration options.

This installation method uses a bootstrap node to administer the DC/OS installation across your cluster. The bootstrap node uses an unencrypted SSH key that can be used to authenticate with the cluster nodes over SSH. Encrypted SSH keys are not supported. This requirement is only for CLI Installer.

**Important:** Upgrades are not supported with this installation method.

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
    <td>Contains the DC/OS data.</td>
  </tr>
  <tr>
    <td><code>/var/lib/mesos</code></td>
    <td>Contains the Mesos data.</td>
  </tr>
</table>

**Important:** Changes to `/opt/mesosphere` are unsupported. They can lead to unpredictable behavior in DC/OS and prevent upgrades.

# Prerequisites
Your cluster must meet the software and hardware [requirements](/1.10/installing/oss/custom/system-requirements/).

## Configure your cluster

1. Create a directory named `genconf` on your bootstrap node and navigate to it.

    ```bash
    mkdir -p genconf
    ```

2. Create an `ip-detect` script.

    In this step, an IP detect script is created. This script reports the IP address of each node across the cluster. Each node in a DC/OS cluster has a unique IP address that is used to communicate between nodes in the cluster. The IP detect script prints the unique IPv4 address of a node to STDOUT each time DC/OS is started on the node.

    **Important:**

    - The IP address of a node must not change after DC/OS is installed on the node. For example, the IP address should not change when a node is rebooted or if the DHCP lease is renewed. If the IP address of a node does change, the node must be [wiped and reinstalled](/1.10/installing/oss/custom/uninstall/).
    - The script must return the same IP address as specified in the `config.yaml`. For example, if the private master IP is specified as `10.2.30.4` in the `config.yaml`, your script should return this same value when run on the master.

    Create an IP detect script for your environment and save as `genconf/ip-detect`. This script needs to be `UTF-8` encoded and have a valid [shebang](https://en.wikipedia.org/wiki/Shebang_%28Unix%29) line. You can use the examples below.

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

1.  Create a configuration file and save as `genconf/config.yaml`.

    In this step you create a YAML configuration file that is customized for your environment. DC/OS uses this configuration file during installation to generate your cluster installation files.

    You can use this template to get started. This template specifies three masters, five [private](/1.10/overview/concepts/#private-agent-node) agents, one [public](/1.10/overview/concepts/#public-agent-node) agent, static master discovery list, and SSH configuration. You may use additional configuration parameters. For descriptions of all parameters and configuration examples, see the [documentation][6].

    The CLI installer uses these default configuration values, which you may override in your configuration:

    - `ssh_port`: `22`
      - Only override this value if SSH on cluster nodes is available at a different port.
    - `process_timeout`: `120`

    **Tips:**

    - If your servers are installed with a domain name in `/etc/resolv.conf`, you should specify `dns_search` with a value that includes that domain. 
    - If you set `master_discovery` to `static`, the IP addresses in `master_list` will be used for internal cluster communication. These IP addresses must be reachable from each other, as well as from the bootstrap host.

    ```yaml
    cluster_name: <cluster-name>
    # Only override this value if you're hosting the contents of genconf/serve/
    # at a custom location. The CLI installer will automatically distribute
    # its contents to this location on all cluster nodes prior to install.
    bootstrap_url: file:///opt/dcos_install_tmp
    master_discovery: static
    exhibitor_storage_backend: static
    # If Google DNS is not available, you can replace these servers with your
    # local DNS servers.
    resolvers:
    - 8.8.8.8
    - 8.8.4.4
    master_list:
    - <master-private-ip-1>
    - <master-private-ip-2>
    - <master-private-ip-3>
    agent_list:
    - <agent-private-ip-1>
    - <agent-private-ip-2>
    - <agent-private-ip-3>
    - <agent-private-ip-4>
    - <agent-private-ip-5>
    public_agent_list:
    - <public-agent-private-ip>
    ssh_user: <username>
    ```

3.  Copy your private SSH key to `genconf/ssh_key`. For more information, see the [ssh_key_path][6] parameter.

    ```bash
    cp <path-to-key> genconf/ssh_key && chmod 0600 genconf/ssh_key
    ```


# Install DC/OS

In this step you create a custom DC/OS build file on your bootstrap node and then install DC/OS across your cluster nodes with SSH. With this installation method you create a bootstrap server that uses your SSH key and connects to every node to automate the deployment.

**Important:**

- Do not install DC/OS until you have these items working: ip-detect script, DNS, and NTP everywhere. For help with troubleshooting, see the [documentation](/1.10/installing/oss/troubleshooting/).
- If something goes wrong and you want to rerun your setup, use these cluster [cleanup instructions][7].

To install DC/OS:

1.  Download the [DC/OS installer][5] to your root directory.

    ```bash
    curl -O https://downloads.dcos.io/dcos/stable/dcos_generate_config.sh
    ```

1.  From your home directory, run the DC/OS installer shell script on your bootstrapping master nodes to generate a customized DC/OS build. The setup script extracts a Docker container that uses the generic DC/OS install files to create customized DC/OS build files for your cluster. The build files are output to `./genconf/serve/`.

    **Tip:** You can view all of the automated command line installer options with the `dcos_generate_config.sh --help` flag.

    ```bash
    sudo bash dcos_generate_config.sh --genconf
    ```

    Here is an example of the output.

    ```bash
    Extracting image from this script and loading into docker daemon, this step can take a few minutes
    dcos-genconf.e060aa49ac4ab62d5e-1e14856f55e5d5d07b.tar
    Running mesosphere/dcos-genconf docker with BUILD_DIR set to /home/centos/genconf
    ====> EXECUTING CONFIGURATION GENERATION
    ...
    ```

    At this point your directory structure should resemble:

    ```
    ├── dcos-genconf.<HASH>.tar
    ├── dcos_generate_config.sh
    ├── genconf
    │   ├── cluster_packages.json
    │   ├── config.yaml
    │   ├── ip-detect
    │   ├── serve
    │   ├── ssh_key
    │   ├── state
    ```

2.  <a name="two"></a>Install the cluster prerequisites, including system updates, compression utilities (UnZip, GNU tar, and XZ Utils), and cluster permissions. For a full list of cluster prerequisites, see this [documentation][4].

    ```bash
    sudo bash dcos_generate_config.sh --install-prereqs
    ```

    Here is an example of the output.

    ```bash
    Running mesosphere/dcos-genconf docker with BUILD_DIR set to /home/centos/genconf
    ====> dcos_installer.action_lib.prettyprint:: ====> EXECUTING INSTALL PREREQUISITES
    ====> dcos_installer.action_lib.prettyprint:: ====> START install_prereqs
    ====> dcos_installer.action_lib.prettyprint:: ====> STAGE install_prereqs
    ====> dcos_installer.action_lib.prettyprint:: ====> STAGE install_prereqs
    ====> dcos_installer.action_lib.prettyprint:: ====> END install_prereqs with returncode: 0
    ====> dcos_installer.action_lib.prettyprint:: ====> SUMMARY
    ====> dcos_installer.action_lib.prettyprint:: 2 out of 2 hosts successfully completed install_prereqs stage.
    ```

3.  Run a preflight script to validate that your cluster is installable.

    ```bash
    sudo bash dcos_generate_config.sh --preflight
    ```

    Here is an example of the output.

    ```bash
    Running mesosphere/dcos-genconf docker with BUILD_DIR set to /home/centos/genconf
    ====> dcos_installer.action_lib.prettyprint:: ====> EXECUTING PREFLIGHT
    ====> dcos_installer.action_lib.prettyprint:: ====> START run_preflight
    ====> dcos_installer.action_lib.prettyprint:: ====> STAGE preflight
    ====> dcos_installer.action_lib.prettyprint:: ====> STAGE preflight
    ====> dcos_installer.action_lib.prettyprint:: ====> STAGE preflight_cleanup
    ====> dcos_installer.action_lib.prettyprint:: ====> STAGE preflight_cleanup
    ====> dcos_installer.action_lib.prettyprint:: ====> END run_preflight with returncode: 0
    ====> dcos_installer.action_lib.prettyprint:: ====> SUMMARY
    ====> dcos_installer.action_lib.prettyprint:: 2 out of 2 hosts successfully completed run_preflight stage.
    ```

    **Tip:** For a detailed view, you can append log level debug (`-v`) to your command. For example `sudo bash dcos_generate_config.sh --preflight -v`.

4.  Install DC/OS on your cluster.

    ```bash
    sudo bash dcos_generate_config.sh --deploy
    ```

    Here is an example of the output.

    ```bash
    Running mesosphere/dcos-genconf docker with BUILD_DIR set to /home/centos/genconf
    ====> dcos_installer.action_lib.prettyprint:: ====> EXECUTING DC/OS INSTALLATION
    ====> dcos_installer.action_lib.prettyprint:: ====> START deploy_master
    ====> dcos_installer.action_lib.prettyprint:: ====> STAGE deploy_master
    ====> dcos_installer.action_lib.prettyprint:: ====> STAGE deploy_master_cleanup
    ====> dcos_installer.action_lib.prettyprint:: ====> END deploy_master with returncode: 0
    ====> dcos_installer.action_lib.prettyprint:: ====> SUMMARY
    ====> dcos_installer.action_lib.prettyprint:: 1 out of 1 hosts successfully completed deploy_master stage.
    ====> dcos_installer.action_lib.prettyprint:: ====> START deploy_agent
    ====> dcos_installer.action_lib.prettyprint:: ====> STAGE deploy_agent
    ====> dcos_installer.action_lib.prettyprint:: ====> STAGE deploy_agent_cleanup
    ====> dcos_installer.action_lib.prettyprint:: ====> END deploy_agent with returncode: 0
    ====> dcos_installer.action_lib.prettyprint:: ====> SUMMARY
    ====> dcos_installer.action_lib.prettyprint:: 1 out of 1 hosts successfully completed deploy_agent stage.
    ```

5.  Run the DC/OS diagnostic script to verify that services are up and running.

    ```bash
    sudo bash dcos_generate_config.sh --postflight
    ```

    Here is an example of the output.

    ```bash
    Running mesosphere/dcos-genconf docker with BUILD_DIR set to /home/centos/genconf
    ====> dcos_installer.action_lib.prettyprint:: ====> EXECUTING POSTFLIGHT
    ====> dcos_installer.action_lib.prettyprint:: ====> START run_postflight
    ====> dcos_installer.action_lib.prettyprint:: ====> STAGE postflight
    ====> dcos_installer.action_lib.prettyprint:: ====> STAGE postflight
    ====> dcos_installer.action_lib.prettyprint:: ====> STAGE postflight_cleanup
    ====> dcos_installer.action_lib.prettyprint:: ====> STAGE postflight_cleanup
    ====> dcos_installer.action_lib.prettyprint:: ====> END run_postflight with returncode: 0
    ====> dcos_installer.action_lib.prettyprint:: ====> SUMMARY
    ====> dcos_installer.action_lib.prettyprint:: 2 out of 2 hosts successfully completed run_postflight stage.
    ```

6.  Monitor Exhibitor and wait for it to converge at `http://<master-public-ip>:8181/exhibitor/v1/ui/index.html`.

    __Tip:__ If you encounter errors such as `Time is marked as bad`, `adjtimex`, or `Time not in sync` during Post-Flight, verify that Network Time Protocol (NTP) is enabled on all nodes. For more information, see the [system requirements](/1.10/installing/oss/custom/system-requirements/#port-and-protocol-configuration).

    ![alt text](/1.10/img/chef-zk-status.png)

    When the status icons are green, you can access the DC/OS web interface.

7.  Launch the DC/OS web interface at `http://<public-master-ip>/` and login. If this doesn't work, take a look at the [troubleshooting docs][9]

    ![alt text](/1.10/img/ui-installer-login.gif)

    You are done!

    ![DC/OS dashboard](/1.10/img/dcos-gui.png)

# <a name="backup"></a>(Optional) Backup your DC/OS installer files
It is recommended that you save your DC/OS installer file immediately after installation completes and before you start using DC/OS. These installer files can be used to add more agent nodes to your cluster, including the [public agent][4] node.

1.  From your bootstrap node, navigate to the `genconf/serve` directory and package the contents as `dcos-install.tar`:

    ```bash
    # <Ctrl-C> to exit installer
    cd genconf/serve
    sudo tar cf dcos-install.tar *
    ```

1.  Copy the `dcos-install.tar` file to another location for backup. For example, you can use Secure Copy (scp) to copy `dcos-install.tar` to your home directory:

    ```bash
    exit
    scp -i $username@$node-ip:~/genconf/serve/dcos-install.tar ~
    ```

# Next Steps

- [Add users to your cluster][10]
- [Add a public agent post-installation][11]
- [Install the DC/OS Command-Line Interface (CLI)][2]
- [Troubleshooting DC/OS installation][9]
- [Uninstalling DC/OS][7]

### Add more agent nodes

After DC/OS is installed and deployed across your cluster, you can add more agent nodes.

**Prerequisite:**

*   The agent nodes must meet the hardware and software prerequisites.

1.  Update the `config.yaml` file with the additional agent nodes. For parameters descriptions and configuration examples, see the [documentation][2].
2.  Run the installation steps beginning with [installing the cluster][4] prerequisites:

    ```bash
    sudo bash dcos_generate_config.sh --install-prereqs
    ```

    **Important:** You can ignore the errors that are shown. For example, during the `--preflight` you may see this error:

    ```bash
    18:17:14::           Found an existing DC/OS installation. To reinstall DC/OS on this this machine you must
    18:17:14::           first uninstall DC/OS then run dcos_install.sh. To uninstall DC/OS, follow the product
    18:17:14::           documentation provided with DC/OS.
    18:17:14::
    18:17:14::
    18:17:14:: ====> 10.10.0.160:22 FAILED
    ```

 [2]: /1.10/cli/install/
 [4]: /1.10/installing/oss/custom/system-requirements/
 [5]: https://downloads.dcos.io/dcos/stable/dcos_generate_config.sh
 [6]: /1.10/installing/oss/custom/configuration/configuration-parameters/
 [7]: /1.10/installing/oss/custom/uninstall/
 [9]: /1.10/installing/oss/troubleshooting/
 [10]: /1.10/security/ent/users-groups/
 [11]: /1.10/administering-clusters/convert-agent-type/
