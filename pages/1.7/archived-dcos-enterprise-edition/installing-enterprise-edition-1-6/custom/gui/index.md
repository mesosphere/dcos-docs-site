---
layout: layout.pug
navigationTitle:  GUI
title: GUI
menuWeight: 0
excerpt:
featureMaturity:
enterprise: true
---







The automated GUI installation method provides a simple graphical interface that guides you through the installation of DC/OS Enterprise Edition.

This installation method uses a bootstrap node to administer the DC/OS installation across your cluster. The bootstrap node uses an SSH key to connect to each node in your cluster to automate the DC/OS installation.

**Important:** This installation method supports a minimal DC/OS configuration set that includes ZooKeeper for shared storage and a static master list, and publicly accessible master IP addresses.

To use the automated GUI installation method:

*   Cluster nodes must be network accessible from the bootstrap node
*   Cluster nodes must have SSH enabled and ports open from the bootstrap node
*   The bootstrap node must have an unencrypted SSH key that can be used to authenticate with the cluster nodes over SSH

## Prerequisites

Before installing DC/OS, your cluster must have the software and hardware [requirements][1].

# Install DC/OS

**Important:** Encrypted SSH keys are not supported.

1.  From your terminal, start the DC/OS installer with this command. This terminal will show output from the installer until the installer is terminated.

        sudo bash dcos_generate_config.ee.sh --web


    Here is an example of the output.

        Running mesosphere/dcos-genconf docker with BUILD_DIR set to /home/centos/genconf
        16:36:09 dcos_installer.action_lib.prettyprint:: ====> Starting DC/OS installer in web mode
        16:36:09 root:: Starting server ('0.0.0.0', 9000)


    *Tip:* You can add the verbose (`-v`) flag to see the debug output:

        sudo bash dcos_generate_config.ee.sh --web -v


2.  Launch the DC/OS web installer in your browser at: `http://<bootstrap-node-public-ip>:9000`.

3.  Click **Begin Installation**.

    ![UI installer begin](ui-installer-begin.png)

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

    **Username**
    Specify the administrator username. This username is required for using DC/OS.

    **Password**
    Specify the administrator password. This password is required for using DC/OS.

    **ZooKeeper for Exhibitor Private IP**

    Specify a comma-separated list of one or more ZooKeeper host IP addresses to use for configuring the internal Exhibitor instances. Exhibitor uses this ZooKeeper cluster to orchestrate its configuration.

    **Important:** Multiple ZooKeeper instances are recommended for failover in production environments.

    **ZooKeeper for Exhibitor Port**
    Specify the ZooKeeper port. For example, `2181`.

    **Upstream DNS Servers**

    Specify a comma-separated list of DNS resolvers for your DC/OS cluster nodes. Set this parameter to the most authoritative nameservers that you have. If you want to resolve internal hostnames, set it to a nameserver that can resolve them. If you have no internal hostnames to resolve, you can set this to a public nameserver like Google or AWS. In the example file above, the <a href="https://developers.google.com/speed/public-dns/docs/using" target="_blank">Google Public DNS IP addresses (IPv4)</a> are specified (`8.8.8.8` and `8.8.4.4`). If Google DNS is not available in your country, you can replace the Google DNS servers `8.8.8.8` and `8.8.4.4` with your local DNS servers.

    *Caution:* If you set this parameter incorrectly you will have to reinstall DC/OS. For more information about service discovery, see this [documentation][2].

    **IP Detect Script**

    Choose an IP detect script from the dropdown to broadcast the IP address of each node across the cluster. Each node in a DC/OS cluster has a unique IP address that is used to communicate between nodes in the cluster. The IP detect script prints the unique IPv4 address of a node to STDOUT each time DC/OS is started on the node.

    *Important:* The IP address of a node must not change after DC/OS is installed on the node. For example, the IP address must not change when a node is rebooted or if the DHCP lease is renewed. If the IP address of a node does change, the node must be wiped and reinstalled.

5.  Click **Run Pre-Flight**. The preflight script installs the cluster [prerequisites][3] and validates that your cluster is installable. This step can take up to 15 minutes to complete. If errors any errors are found, fix and then click **Retry**.

    *Important:* If you exit your GUI installation before launching DC/OS, you must do this before reinstalling:

    *   SSH to each node in your cluster and run `rm -rf /opt/mesosphere`.
    *   SSH to your bootstrap master node and run `rm -rf /var/lib/zookeeper`

    ![UI installerr pre flight](ui-installer-pre-flight1.png)

6.  Click **Deploy** to install DC/OS on your cluster. If errors any errors are found, fix and then click **Retry**.

    ![UI installer deploy](ui-installer-deploy1.png)

    *Tip:* This step might take a few minutes, depending on the size of your cluster.

7.  Click **Run Post-Flight**. If errors any errors are found, fix and then click **Retry**.

    ![UI installer post flight](ui-installer-post-flight1.png)

    *Tip:* You can click **Download Logs** to view your logs locally.

8.  Click **Log In To DC/OS**.

    ![UI installer success](ui-installer-success1.png)

9.  Enter your administrator username and password.

    ![UI installer auth](ui-installer-auth2.png)

10. Archive your installer files for safe-keeping. You'll need this archive to make new agents, including the [public agent][4].

        # <Ctrl-C> to exit installer
        cd genconf/serve
        sudo tar cf dcos-install.tar *
        # Move the dcos-install.tar file to a safe place

    You are done!

    ![UI dashboard](dashboard-ee.gif)
    
# <a name="backup"></a>(Optional) Backup your DC/OS installer files
It is recommended that you save your DC/OS installer file immediately after installation completes and before you start using DC/OS. These installer files can be used to add more agent nodes to your cluster, including the [public agent][4] node.

1.  From your bootstrap node, navigate to the `genconf/serve` directory and package the contents as `dcos-install.tar`:

        # <Ctrl-C> to exit installer
        cd genconf/serve
        sudo tar cf dcos-install.tar *

1.  Copy the `dcos-install.tar` file to another location for backup. For example, you can use Secure Copy (scp) to copy `dcos-install.tar` to your home directory:

        exit
        scp -i $username@$node-ip:~/genconf/serve/dcos-install.tar ~

## Next Steps

Now you can [assign user roles][5] or [create a public agent][4]

### Uninstalling DC/OS

1.  From the bootstrap node, enter this command:

        sudo bash dcos_generate_config.sh --uninstall
        Running mesosphere/dcos-genconf docker with BUILD_DIR set to /home/centos/genconf
        ====> EXECUTING UNINSTALL
        This will uninstall DC/OS on your cluster. You may need to manually remove /var/lib/zookeeper in some cases after this completes, please see our documentation for details. Are you ABSOLUTELY sure you want to proceed? [ (y)es/(n)o ]: yes
        ====> START uninstall_dcos
        ====> STAGE uninstall
        ====> STAGE uninstall
        ====> OUTPUT FOR uninstall_dcos
        ====> END uninstall_dcos with returncode: 0
        ====> SUMMARY FOR uninstall_dcos
        2 out of 2 hosts successfully completed uninstall_dcos stage.
        ====> END OF SUMMARY FOR uninstall_dcos

 [1]: /1.7/administration/installing/custom/system-requirements/
 [2]: /1.7/usage/service-discovery/
 [3]: /1.7/administration/installing/custom/advanced/#scrollNav-2
 [4]: /1.7/administration/installing/custom/create-public-agent/
 [5]: /1.7/administration/id-and-access-mgt/managing-users-and-groups/
