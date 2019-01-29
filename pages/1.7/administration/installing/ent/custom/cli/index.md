---
layout: layout.pug
navigationTitle:  CLI Installer
title: CLI Installer
menuWeight: 2
excerpt:

enterprise: true
---





The automated CLI installer provides a guided installation of DC/OS from the command line. With this method you can choose from the complete set of DC/OS configuration options. 

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

**Important:** You cannot create a [public](/1.7/overview/concepts/#public-agent-node) agent by using the CLI installer. If you are using the CLI installer, you must create a public agent [post-installation](/1.7/administration/installing/ent/custom/create-public-agent/). 

# Create an IP detection script

In this step you create an IP detect script to broadcast the IP address of each node across the cluster. Each node in a DC/OS cluster has a unique IP address that is used to communicate between nodes in the cluster. The IP detect script prints the unique IPv4 address of a node to STDOUT each time DC/OS is started on the node.

**Important:** The IP address of a node must not change after DC/OS is installed on the node. For example, the IP address must not change when a node is rebooted or if the DHCP lease is renewed. If the IP address of a node does change, the node must be [wiped and reinstalled][2].

1.  Create a directory named `genconf` on your bootstrap node and navigate to it.
    
        mkdir -p genconf
        

2.  Create an IP detection script for your environment and save as `genconf/ip-detect`. This script needs to be `UTF-8` encoded and have a valid [shebang](https://en.wikipedia.org/wiki/Shebang_(Unix)) line. You can use the examples below.
    
    *   #### Use the AWS Metadata Server
        
        This method uses the AWS Metadata service to get the IP address:
        
            #!/bin/sh
            # Example ip-detect script using an external authority
            # Uses the AWS Metadata Service to get the node's internal
            # ipv4 address
            curl -fsSL http://169.254.169.254/latest/meta-data/local-ipv4
            
    
    *   #### Use the GCE Metadata Server
        
        This method uses the GCE Metadata Server to get the IP address:
        
            #!/bin/sh
            # Example ip-detect script using an external authority
            # Uses the GCE metadata server to get the node's internal
            # ipv4 address
            
            curl -fsSL -H "Metadata-Flavor: Google" http://169.254.169.254/computeMetadata/v1/instance/network-interfaces/0/ip
            
    
    *   #### Use the IP address of an existing interface
        
        This method discovers the IP address of a particular interface of the node.
        
        If you have multiple generations of hardware with different internals, the interface names can change between hosts. The IP detection script must account for the interface name changes. The example script could also be confused if you attach multiple IP addresses to a single interface, or do complex Linux networking, etc.
        
            #!/usr/bin/env bash
            set -o nounset -o errexit
            export PATH=/usr/sbin:/usr/bin:$PATH
            echo $(ip addr show eth0 | grep -Eo '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}' | head -1)
            
    
    *   #### Use the network route to the Mesos master
        
        This method uses the route to a Mesos master to find the source IP address to then communicate with that node.
        
        In this example, we assume that the Mesos master has an IP address of `172.28.128.3`. You can use any language for this script. Your Shebang line must be pointed at the correct environment for the language used and the output must be the correct IP address.
        
            #!/usr/bin/env bash
            set -o nounset -o errexit
            
            MASTER_IP=172.28.128.3
            
            echo $(/usr/sbin/ip route show to match 172.28.128.3 | grep -Eo '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}' | tail -1)
            

# <a name="config-json"></a>Create a configuration file

In this step you create a YAML configuration file that is customized for your environment. DC/OS uses this configuration file during installation to generate your cluster installation files. In these instructions we assume that you are using ZooKeeper for shared storage.

1.  From your home directory, run this command to create a hashed password for superuser authentication, where `<superuser_password>` is the superuser password. Use the hashed password key for the `superuser_password_hash` parameter in your `config.yaml` file.
    
        sudo bash dcos_generate_config.ee.sh --hash-password <superuser_password>
        
    
    Here is an example of a hashed password output.
    
        Extracting image from this script and loading into docker daemon, this step can take a few minutes
        dcos-genconf.9eda4ae45de5488c0c-c40556fa73a00235f1.tar
        Running mesosphere/dcos-genconf docker with BUILD_DIR set to /home/centos/genconf
        00:42:10 dcos_installer.action_lib.prettyprint:: ====> HASHING PASSWORD TO SHA512
        00:42:11 root:: Hashed password for 'password' key:
        $6$rounds=656000$v55tdnlMGNoSEgYH$1JAznj58MR.Bft2wd05KviSUUfZe45nsYsjlEl84w34pp48A9U2GoKzlycm3g6MBmg4cQW9k7iY4tpZdkWy9t1   
        

2.  Create a configuration file and save as `genconf/config.yaml`.
    
    You can use this template to get started. This template specifies 3 Mesos masters, 5 Mesos agents, static master discovery list, and SSH configuration specified. If your servers are installed with a domain name in your `/etc/resolv.conf`, you should add `dns_search` to your `config.yaml` file. For parameters descriptions and configuration examples, see the [documentation][3].
    
    **Tip:** If Google DNS is not available in your country, you can replace the Google DNS servers `8.8.8.8` and `8.8.4.4` with your local DNS servers.
    
        agent_list:
        - <agent-private-ip-1>
        - <agent-private-ip-2>
        - <agent-private-ip-3>
        - <agent-private-ip-4>
        - <agent-private-ip-5>
        # Use this bootstrap_url value unless you have moved the DC/OS installer assets.   
        bootstrap_url: http://<bootstrap_ip>:<your_port>
        customer_key: <customer-key>
        cluster_name: <cluster-name>
        master_discovery: static 
        master_list:
        - <master-private-ip-1>
        - <master-private-ip-2>
        - <master-private-ip-3>
        resolvers:
        - 8.8.4.4
        - 8.8.8.8 
        ssh_port: 22
        ssh_user: <username>
        superuser_password_hash: <hashed-password>
        superuser_username: <username>
        
    
    **Important:** You cannot use an NFS mount for Exhibitor storage with the automated command line installation method. To use an NFS mount for Exhibitor storage (`exhibitor_storage_backend: shared_filesystem`), you must use the [Manual command line installation method][4].

3.  Optional: if you are using external volumes:
    
    *   Specify the [`rexray_config_method`][5] parameter in your `genconf/config.yaml` file. For example:
        
            rexray_config_method: file
            rexray_config_filename: path/to/rexray.yaml
            
        
        **Tip:** The `rexray_config_filename` path must be relative to your `genconf` directory.
    
    *   Create a `genconf/rexray.yaml` file with your REX-Ray configuration specified. For example, here is a `rexray.yaml` file is configured for Amazon's EBS. Consult the [REX-Ray documentation][6] for more information.
        
              rexray:
                loglevel: info
                storageDrivers:
                  - ec2
                volume:
                  unmount:
                    ignoreusedcount: true
            
    
    For more information, see the external volumes [documentation][7].

4.  Copy your private SSH key to `genconf/ssh_key`. For more information, see the [ssh_key_path][3] parameter.
    
        cp <path-to-key> genconf/ssh_key && chmod 0600 genconf/ssh_key
        

# <a name="install-bash"></a>Install DC/OS

In this step you create a custom DC/OS build file on your bootstrap node and then install DC/OS across your cluster nodes with SSH. With this installation method you create a bootstrap server that uses your SSH key and connects to every node to automate the deployment.

You can view all of the automated command line installer options with the `--help` flag:

    sudo bash dcos_generate_config.ee.sh --help
    Running mesosphere/dcos-genconf docker with BUILD_DIR set to /home/centos/genconf
    usage: 
    Install Mesosophere's Data Center Operating System
    
    dcos_installer [-h] [-f LOG_FILE] [--hash-password HASH_PASSWORD] [-v]
    [--web | --genconf | --preflight | --deploy | --postflight | --uninstall | --validate-config | --test]
    
    Environment Settings:
    
      PORT                  Set the :port to run the web UI
      CHANNEL_NAME          ADVANCED - Set build channel name
      BOOTSTRAP_ID          ADVANCED - Set bootstrap ID for build
    
    optional arguments:
      -h, --help            show this help message and exit
      --hash-password HASH_PASSWORD
                            Hash a password on the CLI for use in the config.yaml.
      -v, --verbose         Verbose log output (DEBUG).
      --offline             Do not install preflight prerequisites on CentOS7,
                            RHEL7 in web mode
      --web                 Run the web interface.
      --genconf             Execute the configuration generation (genconf).
      --preflight           Execute the preflight checks on a series of nodes.
      --install-prereqs     Install preflight prerequisites. Works only on CentOS7
                            and RHEL7.
      --deploy              Execute a deploy.
      --postflight          Execute postflight checks on a series of nodes.
      --uninstall           Execute uninstall on target hosts.
      --validate-config     Validate the configuration in config.yaml
      --test                Performs tests on the dcos_installer application
    

**Tip:** If something goes wrong and you want to rerun your setup, use these cluster <a href="/1.7/administration/installing/ent/custom/uninstall/" target="_blank">cleanup instructions</a>.

To install DC/OS:

1.  From your home directory, run the DC/OS installer shell script on your bootstrapping master nodes to generate a customized DC/OS build. The setup script extracts a Docker container that uses the generic DC/OS install files to create customized DC/OS build files for your cluster. The build files are output to `./genconf/serve/`.
    
        sudo bash dcos_generate_config.ee.sh --genconf
        
    
    Here is an example of the output.
    
        ====> EXECUTING CONFIGURATION GENERATION
        Generating configuration files...
        
    
    At this point your directory structure should resemble:
    
        ├── dcos-genconf.c9722490f11019b692-cb6b6ea66f696912b0.tar
        ├── dcos_generate_config.ee.sh
        ├── genconf
        │   ├── config.yaml
        │   ├── ip-detect     
        

2.  <a name="two"></a>Install the cluster prerequisites, including system updates, compression utilities (UnZip, GNU tar, and XZ Utils), and cluster permissions. For a full list of cluster prerequisites, see this [documentation][8].
    
        sudo bash dcos_generate_config.ee.sh --install-prereqs
        
    
    Here is an example of the output.
    
        Running mesosphere/dcos-genconf docker with BUILD_DIR set to /home/centos/genconf
        ====> EXECUTING INSTALL PREREQUISITES
        ====> START install_prereqs
        ====> STAGE install_prereqs
        ====> STAGE install_prereqs
        ====> OUTPUT FOR install_prereqs
        ====> END install_prereqs with returncode: 0
        ====> SUMMARY FOR install_prereqs
        2 out of 2 hosts successfully completed install_prereqs stage.
        ====> END OF SUMMARY FOR install_prereqs
        

3.  Run a preflight script to validate that your cluster is installable.
    
        sudo bash dcos_generate_config.ee.sh --preflight
        
    
    Here is an example of the output.
    
        Running mesosphere/dcos-genconf docker with BUILD_DIR set to /home/centos/genconf
        ====> EXECUTING PREFLIGHT
        ====> START run_preflight
        ====> STAGE preflight
        ====> STAGE preflight
        ====> STAGE preflight_cleanup
        ====> STAGE preflight_cleanup
        ====> OUTPUT FOR run_preflight
        ====> END run_preflight with returncode: 0
        ====> SUMMARY FOR run_preflight
        2 out of 2 hosts successfully completed run_preflight stage.
        ====> END OF SUMMARY FOR run_preflight
        
    
    **Tip:** For a detailed view, you can append log level debug (`-v`) to your command. For example `sudo bash dcos_generate_config.ee.sh --preflight -v`.

4.  Install DC/OS on your cluster.
    
        sudo bash dcos_generate_config.ee.sh --deploy
        
    
    Here is an example of the output.
    
        Running mesosphere/dcos-genconf docker with BUILD_DIR set to /home/centos/genconf
        ====> EXECUTING DCOS INSTALLATION
        ====> START install_dcos
        ====> STAGE deploy
        ====> STAGE deploy
        ====> STAGE deploy_cleanup
        ====> STAGE deploy_cleanup
        ====> OUTPUT FOR install_dcos
        ====> END install_dcos with returncode: 0
        ====> SUMMARY FOR install_dcos
        2 out of 2 hosts successfully completed install_dcos stage.
        ====> END OF SUMMARY FOR install_dcos
        

5.  Run the DC/OS diagnostic script to verify that services are up and running.
    
        sudo bash dcos_generate_config.ee.sh --postflight
        
    
    Here is an example of the output.
    
        Running mesosphere/dcos-genconf docker with BUILD_DIR set to /home/centos/genconf
        ====> EXECUTING POSTFLIGHT
        ====> START run_postflight
        ====> STAGE postflight
        ====> STAGE postflight
        ====> STAGE postflight_cleanup
        ====> STAGE postflight_cleanup
        ====> OUTPUT FOR run_postflight
        ====> END run_postflight with returncode: 0
        ====> SUMMARY FOR run_postflight
        2 out of 2 hosts successfully completed run_postflight stage.
        ====> END OF SUMMARY FOR run_postflight
        

6.  Monitor Exhibitor and wait for your masters to converge at `http://<master-public-ip>:8181/exhibitor/v1/ui/index.html`.
    
    **Tip:** This process can take about 10 minutes. During this time you will see the Master nodes become visible on the Exhibitor consoles and come online, eventually showing a green light.
    
    ![alt text][9]
    
    When the status icons are green, you can access the DC/OS web interface.

7.  Launch the DC/OS web interface at: `http://<public-master-ip>/`.

9.  Enter your administrator username and password and click **Log In To DC/OS**.
    
    ![alt text][10]
    
    You are done!
    
    ![alt text][11]
    
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

# Next Steps

### Add DC/OS users

You can assign user roles and grant access to DC/OS services. For more information, see the [documentation][12].

### Add more agent nodes

After DC/OS is installed and deployed across your cluster, you can add more agent nodes.

**Prerequisite:**

*   The agent nodes must meet the [hardware][13] and [software][14] prerequisites.

1.  Update the `config.yaml` file with the additional agent nodes. For parameters descriptions and configuration examples, see the [documentation][3].
2.  Run the installation steps beginning with [installing the cluster][15] prerequisites:
    
        sudo bash dcos_generate_config.ee.sh --install-prereqs
        
    
    **Important:** You can ignore the errors that are shown. For example, during the `--preflight` you may see this error:
    
        ====> Found an existing DC/OS installation. To reinstall DC/OS on this this machine you must
        ====> first uninstall DC/OS then run dcos_install.sh. To uninstall DC/OS, follow the product
        ====> documentation provided with DC/OS.
        ====>            
        ====>  
        ====> 10.10.0.160:22 FAILED
        

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

 [1]: /1.7/administration/installing/ent/custom/system-requirements/
 [2]: /1.7/administration/installing/ent/custom/uninstall/
 [3]: /1.7/administration/installing/ent/custom/configuration-parameters/
 [4]: /1.7/administration/installing/ent/custom/advanced/
 [5]: /1.7/administration/installing/ent/custom/configuration-parameters/#rexray-config
 [6]: http://rexray.readthedocs.io/en/stable/user-guide/config/
 [7]: /1.7/usage/storage/external-storage/
 [8]: /1.7/administration/installing/ent/custom/advanced/
 [9]: /1.11/img/chef-zk-status.png
 [10]: /1.11/img/gui-installer-login-ee.gif
 [11]: /1.11/img/dashboard-ee.png
 [12]: /1.7/administration/id-and-access-mgt/ent/
 [13]: /1.7/administration/installing/ent/custom/system-requirements/#hardware-prerequisites
 [14]: /1.7/administration/installing/ent/custom/system-requirements/#software-prerequisites
 [15]: #two
