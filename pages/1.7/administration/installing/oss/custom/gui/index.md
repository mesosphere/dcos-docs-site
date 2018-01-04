---
layout: layout.pug
excerpt:
title: GUI DC/OS Installation Guide
navigationTitle: GUI
menuWeight: 100
---

The automated GUI installer provides a simple graphical interface that guides you through the installation of DC/OS. The automated installer provides a basic installation that is suitable for demonstrations and POCs. Only a subset of the configuration options are available with the GUI method. This is the fastest way to get started with DC/OS.

This installation method uses a bootstrap node to administer the DC/OS installation across your cluster. The bootstrap node uses an SSH key to connect to each node in your cluster to automate the DC/OS installation.

The DC/OS installation creates these folders:

| Folder                                  | Description                                                                                                                                            |
|-----------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| `/opt/mesosphere`                       | Contains all the DC/OS binaries, libraries, cluster configuration. Do not modify.                                                                      |
| `/etc/systemd/system/dcos.target.wants` | Contains the systemd services which start the things that make up systemd. They must live outside of `/opt/mesosphere` because of systemd constraints. |
| `/etc/systemd/system/dcos.<units>`      | Contains copies of the units in `/etc/systemd/system/dcos.target.wants`. They must be at the top folder as well as inside `dcos.target.wants`.         |
| `/var/lib/zookeeper`                    | Contains the [ZooKeeper](/1.7/overview/concepts/#exhibitorforzookeeper) data.                                                                                      |
| `/var/lib/docker`                       | Contains the Docker data.                                                                                                                              |
| `/var/lib/dcos`                         | Contains the DC/OS data.                                                                                                                               |
| `/var/lib/mesos`                        | Contains the Mesos data.                                                                                                                               |


# Install DC/OS

1.  Download the [DC/OS installer][1] to your bootstrap node.

    ```bash
    curl -O https://downloads.dcos.io/dcos/EarlyAccess/commit/14509fe1e7899f439527fb39867194c7a425c771/dcos_generate_config.sh
    ```

1.  From your terminal, start the DC/OS GUI installer with this command.

    ```bash
    sudo bash dcos_generate_config.sh --web
    ```

    Here is an example of the output.

    ```bash
    Running mesosphere/dcos-genconf docker with BUILD_DIR set to /home/centos/genconf
    16:36:09 dcos_installer.action_lib.prettyprint:: ====> Starting DC/OS installer in web mode
    16:36:09 root:: Starting server ('0.0.0.0', 9000)
    ```

    **Tip:** You can add the verbose (`-v`) flag to see the debug output:

    ```bash
    sudo bash dcos_generate_config.sh --web -v
    ```

2.  Launch the DC/OS web installer in your browser at: `http://<bootstrap-node-public-ip>:9000`.

3.  Click **Begin Installation**.

    ![Begin Install](../img/dcos-gui-install.png)

4.  Specify your Deployment and DC/OS Environment settings:

    ### Deployment Settings

    **Master Private IP List**
    Specify a comma-separated list of your internal static master IP addresses.

    **Agent Private IP List**
    Specify a comma-separated list of your internal static agent IP addresses.

    **Master Public IP**
    Specify a publicly accessible proxy IP address to one of your master nodes. If you don't have a proxy or already have access to the network where you are deploying this cluster, you can use one of the master IP's that you specified in the master list. This proxy IP address is used to access the DC/OS web interface on the master node after DC/OS is installed.

    **SSH Username**
    Specify the SSH username, for example `centos`.

    **SSH Listening Port**
    Specify the port to SSH to, for example `22`.

    **SSH Key**
    Specify the private SSH key with access to your master IPs.

    ### DC/OS Environment Settings

    **Upstream DNS Servers**
    Specify a comma-separated list of DNS resolvers for your DC/OS cluster nodes. Set this parameter to the most authoritative nameservers that you have. If you want to resolve internal hostnames, set it to a nameserver that can resolve them. If you have no internal hostnames to resolve, you can set this to a public nameserver like Google or AWS. In the example file above, the <a href="https://developers.google.com/speed/public-dns/docs/using" target="_blank">Google Public DNS IP addresses (IPv4)</a> are specified (`8.8.8.8` and `8.8.4.4`). If Google DNS is not available in your country, you can replace the Google DNS servers `8.8.8.8` and `8.8.4.4` with your local DNS servers.

    *Caution:* If you set this parameter incorrectly you will have to reinstall DC/OS. For more information about service discovery, see this [documentation][2].

    **IP Detect Script**
    Choose an IP detect script from the dropdown to broadcast the IP address of each node across the cluster. Each node in a DC/OS cluster has a unique IP address that is used to communicate between nodes in the cluster. The IP detect script prints the unique IPv4 address of a node to STDOUT each time DC/OS is started on the node.

    *Important:* The IP address of a node must not change after DC/OS is installed on the node. For example, the IP address must not change when a node is rebooted or if the DHCP lease is renewed. If the IP address of a node does change, the node must be wiped and reinstalled.

5.  Click **Run Pre-Flight**. The preflight script installs the cluster prerequisites and validates that your cluster is installable. For a list of cluster prerequisites, see the scripted installer [prerequisites][3]. This step can take up to 15 minutes to complete. If errors any errors are found, fix and then click **Retry**.

    ![preflight](../img/dcos-gui-preflight.png)

   **Important:* If you exit your GUI installation before launching DC/OS, you must do this before reinstalling:

    *   SSH to each node in your cluster and run `rm -rf /opt/mesosphere`.
    *   SSH to your bootstrap master node and run `rm -rf /var/lib/zookeeper`

6.  Click **Deploy** to install DC/OS on your cluster. If errors any errors are found, fix and then click **Retry**.

    ![deploy](../img/dcos-gui-deploy.png)

    **Tip:** This step might take a few minutes, depending on the size of your cluster.

7.  Click **Run Post-Flight**. If errors any errors are found, fix and then click **Retry**.

    ![postflight](../img/dcos-gui-postflight.png)

    **Tip:** You can click **Download Logs** to view your logs locally.
    **Tip:** If this takes longer than about 10 minutes, you've probably misconfigured your cluster. Go checkout the [troubleshooting documentation][9]

8.  Click **Log In To DC/OS**. If this doesn't work, take a look at the [troubleshooting docs][9].

    ![login](../img/dcos-gui-login.png)

    You are done!

    ![dashboard](../img/ui-dashboard.gif)

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

## Next Steps

- [Add users to your cluster][10]
- [Add a public agent][4]
- [Install the DC/OS Command-Line Interface (CLI)][5]
- [Troubleshooting DC/OS installation][9]
- [Using your cluster][6]
- [Uninstall DC/OS][7]

[1]: https://downloads.dcos.io/dcos/EarlyAccess/commit/14509fe1e7899f439527fb39867194c7a425c771/dcos_generate_config.sh
[2]: /1.7/overview/service-discovery/
[3]: /1.7/administration/installing/oss/custom/system-requirements/
[4]: /1.7/administration/installing/oss/custom/create-public-agent/
[5]: /1.7/usage/cli/install/
[6]: /1.7/usage/
[7]: /1.7/administration/installing/oss/custom/uninstall/
[9]: /1.7/administration/installing/oss/custom/troubleshooting/
[10]: /1.7/administration/id-and-access-mgt/oss/managing-authentication/#user-management
