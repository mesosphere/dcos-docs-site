---
layout: layout.pug
navigationTitle:  GUI Installer
title: GUI Installer
menuWeight: 1
excerpt:

enterprise: true
---





The automated GUI installer provides a simple graphical interface that guides you through the installation of DC/OS. The GUI installer provides a basic installation that is suitable for demonstrations and POCs. Only a subset of the configuration options are available with the GUI method. This is the fastest way to get started with DC/OS.

This installation method uses a bootstrap node to administer the DC/OS installation across your cluster. The bootstrap node uses an SSH key to connect to each node in your cluster to automate the DC/OS installation.

The DC/OS installation creates these folders:

<table class="table">
    <tr>
        <th>Folder</th>
        <th>Description</th>
    </tr>
    <tr>
        <td><code>/opt/mesosphere<code></td>
        <td>Contains all the DC/OS binaries, libraries, cluster configuration. Do not modify.</td>
    </tr>
    <tr>
        <td><code>/etc/systemd/system/dcos.target.wants<code></td>
        <td>Contains the systemd services which start the things that make up systemd. They must live outside of <code>/opt/mesosphere</code> because of systemd constraints.</td>
    </tr>
    <tr>
        <td><code>/etc/systemd/system/dcos.&lt;units&gt;<code></td>
        <td>Contains copies of the units in <code>/etc/systemd/system/dcos.target.wants</code>. They must be at the top folder as well as inside <code>dcos.target.wants</code>.</td>
    </tr>
    <tr>
        <td><code>/var/lib/zookeeper<code></td>
        <td>Contains the <a href="/1.7/overview/concepts/#exhibitorforzookeeper">ZooKeeper</a> data.</td>
    </tr>
    <tr>
        <td><code>/var/lib/docker<code></td>
        <td>Contains the Docker data. </td>
    </tr>
    <tr>
        <td><code>/var/lib/dcos<code></td>
        <td>Contains the DC/OS data.</td>
    </tr>
    <tr>
        <td><code>/var/lib/mesos<code></td>
        <td>Contains the Mesos data.</td>
    </tr>
</table>

## Prerequisites
    
Before installing DC/OS, your cluster must have the software and hardware [requirements][1].
    
**Important:** You cannot create a [public](/1.7/overview/concepts/#public-agent-node) agent by using the GUI installer. If you are using the GUI installer, you must create a public agent [post-installation](/1.7/administration/installing/ent/custom/create-public-agent/). 

# Install DC/OS

1.  From your terminal, start the DC/OS GUI installer with this command.
    
    ```
    sudo bash dcos_generate_config.ee.sh --web
    ```
    
    Here is an example of the output.
    
    ```
    Running mesosphere/dcos-genconf docker with BUILD_DIR set to /home/centos/genconf
    16:36:09 dcos_installer.action_lib.prettyprint:: ====> Starting DC/OS installer in web mode
    16:36:09 root:: Starting server ('0.0.0.0', 9000)
    ```

    **Tip:** You can add the verbose (`-v`) flag to see the debug output:
    
    ```
    sudo bash dcos_generate_config.ee.sh --web -v
    ```

2.  Launch the DC/OS web installer in your browser at: `http://<bootstrap-node-public-ip>:9000`.

3.  Click **Begin Installation**. 

    ![UI installer begin](/1.11/img/gui-installer-begin-ee.gif)

4.  Specify your Deployment and DC/OS Environment settings:
    
    ![alt text][2]
    
    **Deployment Settings**
    
    **Master Private IP List** :   Specify a comma-separated list of your internal static master IP addresses.
    
    **Agent Private IP List** :   Specify a comma-separated list of your internal static agent IP addresses.
    
    **Master Public IP** :   Specify a publicly accessible proxy IP address to one of your master nodes. If you don't have a proxy or already have access to the network where you are deploying this cluster, you can use one of the master IP's that you specified in the master list. This proxy IP address is used to access the DC/OS web interface on the master node after DC/OS is installed.
    
    **SSH Username** :   Specify the SSH username, for example `centos`.
    
    **SSH Listening Port** :   Specify the port to SSH to, for example `22`.
    
    **Private SSH Key** :   Specify the private SSH key with access to your master IPs.
    
    **Customer ID** :   Specify the 30-character UUID that was given to you by the Mesosphere customer representative.
    
    **DC/OS Environment Settings**
    
    **Username (Enterprise)** :   Specify a user name for the initial superuser account. At least one superuser account is required for DC/OS Enterprise.
    
    **Password (Enterprise)** :   Specify the password of the superuser account.
    
    **Upstream DNS Servers** :   Specify a comma-separated list of DNS resolvers for your DC/OS cluster nodes. Set this parameter to the most authoritative nameservers that you have. If you want to resolve internal hostnames, set it to a nameserver that can resolve them. If you have no internal hostnames to resolve, you can set this to a public nameserver like Google or AWS. In the example file above, the <a href="https://developers.google.com/speed/public-dns/docs/using" target="_blank">Google Public DNS IP addresses (IPv4)</a> are specified (`8.8.8.8` and `8.8.4.4`). If Google DNS is not available in your country, you can replace the Google DNS servers `8.8.8.8` and `8.8.4.4` with your local DNS servers.
        
    *Caution:* If you set this parameter incorrectly you will have to reinstall DC/OS. For more information about service discovery, see this [documentation][3].
    
    **IP Detect Script** :   Choose an IP detect script from the dropdown to broadcast the IP address of each node across the cluster. Each node in a DC/OS cluster has a unique IP address that is used to communicate between nodes in the cluster. The IP detect script prints the unique IPv4 address of a node to STDOUT each time DC/OS is started on the node.
        
    **Important:** The IP address of a node must not change after DC/OS is installed on the node. For example, the IP address must not change when a node is rebooted or if the DHCP lease is renewed. If the IP address of a node does change, the node must be wiped and reinstalled.

5.  Click **Run Pre-Flight**. The preflight script installs the cluster prerequisites and validates that your cluster is installable. For a list of cluster prerequisites, see the [system requirements](/1.7/administration/installing/ent/custom/system-requirements/). This step can take up to 15 minutes to complete. If errors any errors are found, fix and then click **Retry**.
    
    **Important:** If you exit your GUI installation before launching DC/OS, you must do this before reinstalling:
    
    *   SSH to each node in your cluster and run `rm -rf /opt/mesosphere`.
    *   SSH to your bootstrap master node and run `rm -rf /var/lib/zookeeper`

6.  Click **Deploy** to install DC/OS on your cluster. If errors any errors are found, fix and then click **Retry**.
    
    ![UI installer deploy](/1.11/img/ui-installer-deploy1.png)
    
    **Tip:** This step might take a few minutes, depending on the size of your cluster.

7.  Click **Run Post-Flight**. If errors any errors are found, fix and then click **Retry**.
    
    ![UI installer post flight](/1.11/img/ui-installer-post-flight1.png)
    
    **Tip:** You can click **Download Logs** to view your logs locally.

8.  Click **Log In To DC/OS**.
    
    ![UI installer success](/1.11/img/gui-installer-success-ee.gif)

9.  Enter the username and password of the superuser account.
    
    ![alt text][4]
    
    You are done!
    
    ![alt text][5]
    
# <a name="backup"></a>(Optional) Backup your DC/OS installer files
It is recommended that you save your DC/OS installer file immediately after installation completes and before you start using DC/OS. These installer files can be used to add more agent nodes to your cluster, including the [public agent](/1.7/administration/installing/ent/custom/create-public-agent/) node.

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

Now you can [assign user roles][6].

### Uninstalling DC/OS

1.  From the bootstrap node, enter this command:
    
    ```bash
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
    ```

 [1]: /1.7/administration/installing/ent/custom/system-requirements/
 [2]: /1.11/img/gui-installer-setup-ee.gif
 [3]: /1.7/usage/service-discovery/
 [4]: /assets/images/ui-installer-auth-1-7.gif
 [5]: /1.11/img/dashboard-ee.png
 [6]: /1.7/administration/id-and-access-mgt/ent/
