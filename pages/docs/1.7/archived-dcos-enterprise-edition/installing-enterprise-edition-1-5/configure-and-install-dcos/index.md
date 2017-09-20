---
layout: layout.pug
title: Step 2 Configure and install DC/OS
menuWeight: 0
excerpt:
featureMaturity:
enterprise: true
navigationTitle:  Step 2 Configure and install DC/OS
---






This topic provides instructions for installing DC/OS in your environment by using a customized Bash install script.

The DC/OS installation creates these folders:

*   `/opt/mesosphere`
    :   Contains all the DC/OS binaries, libraries, cluster configuration. Do not modify.

*   `/etc/systemd/system/dcos.target.wants`
    :   Contains the systemd services which start the things that make up systemd. They must live outside of `/opt/mesosphere` because of systemd constraints.

*   Various units prefixed with `dcos` in `/etc/systemd/system`
    :   Copies of the units in `/etc/systemd/system/dcos.target.wants`. They must be at the top folder as well as inside `dcos.target.wants`.

Choose your DC/OS installation method:

*   [Using SSH to distribute DC/OS across your nodes][1]
*   [Manually distributing DC/OS across your nodes][2]

# <a name="ssh"></a>Using SSH to distribute DC/OS across your nodes

**Prerequisite:** If your SSH key has a passphrase, you must decrypt your SSH key before installing DC/OS. For information on how to decrypt your SSH key, see [these instructions][3].

### <a name="config-json"></a>4.1 Configure your cluster

In this step you create a YAML configuration file that is customized for your environment. DC/OS uses this configuration file during installation to generate your cluster installation files. In these instructions we assume that you are using ZooKeeper for shared storage.

1.  Customize this `config.yaml` template file for your environment. <!-- do not change bootstrap_url -->
    
        cluster_config:
          ##########################################
          # DO NOT CHANGE the bootstrap_url value, #
          # unless you have moved installer assets.#
          ##########################################
          bootstrap_url: file:///opt/dcos_install_tmp
          cluster_name: <cluster-name>
          exhibitor_storage_backend: zookeeper
          exhibitor_zk_hosts: <host1>:2181,<host2>:2181,<host3>:2181
          exhibitor_zk_path: /dcos
          master_discovery: static 
          ###########################################
          # Master nodes must be listed in both the #  
          # master_list andtarget_hosts parameters. #
          ###########################################
          master_list:
          - <private-master-ip-1>
          - <private-master-ip-2>
          - <private-master-ip-3>
          resolvers:
          - 8.8.8.8 
          - 8.8.4.4
        
        ssh_config:
          log_directory: /genconf/logs          
          ssh_port: 22
          ssh_user: <username>
          ###########################################################
          # Specify your agent AND master nodes in the target_hosts #
          # parameter. Master nodes must be listed in both the      #
          # master_list and target_hosts parameters.                #
          ###########################################################
          target_hosts:
          - <target-host-privateIP-1>
          - <target-host-privateIP-2>
          - <target-host-privateIP-3>
          - <target-host-privateIP-4>
          - <target-host-privateIP-5>
        
    
    Specify these configuration parameters. <!-- log_directory: /genconf/logs, process_timeout: 120, ssh_key_path: /genconf/ssh-key -->
    
    **bootstrap_url**
    
    :   This parameter specifies the URI path for the DC/OS installer to store the customized DC/OS build files. Use the default value of `bootstrap_url: file:///opt/dcos_install_tmp`, unless you have moved the installer assets from their default location.
    
    **cluster_name**
    :   Specify the name of your cluster.
    
    **exhibitor_storage_backend**
    :   This parameter specifies the type of storage backend for Exhibitor. By default this is set to `zookeeper` in the `config.yaml` template file. During DC/OS installation, a storage system is required for configuring and orchestrating ZooKeeper with Exhibitor on the master nodes. Exhibitor automatically configures your ZooKeeper installation on the master nodes during your DC/OS installation.
    
    **exhibitor_zk_hosts**
    :   Specify a comma-separated list of one or more ZooKeeper node IP addresses to use for configuring the internal Exhibitor instances. Exhibitor uses this ZooKeeper cluster to orchestrate it's configuration.
    
    **master_discovery**
    :   This parameter specifies the Mesos master discovery method. By default this is set to `static` in the `config.yaml` template file. The `static` method uses the Mesos agents to discover the masters by giving each agent a static list of master IPs. The masters must not change IP addresses, and if a master is replaced, the new master must take the old master's IP address
    
    **master_list**
    
    :   Specify a list of your static master IP addresses as a YAML nested series (`-`).
        
        **Important:** Master nodes must be listed in both the `master_list` and `target_hosts` parameters.
    
    **resolvers**
    
    :   Specify a JSON-formatted list of DNS servers for your DC/OS host nodes. You must include the escape characters (``) as shown in the template. Set this parameter to the most authoritative nameservers that you have. If you want to resolve internal hostnames, set it to a nameserver that can resolve them.
        
        *Caution:* If you set the `resolvers` parameter incorrectly, you will permanently damage your configuration and have to reinstall DC/OS.
    
    **log_directory**
    
    :   This parameter specifies the path to the installer host logs generated by the SSH processes. By default this is set to `/genconf/logs`. This should not be changed because `/genconf` is local to the container that is running the installer, and is a mounted volume.
    
    **ssh_port**
    :   This parameter specifies the port to SSH to, for example `22`.
    
    **ssh_user**
    :   This parameter specifies the SSH username, for example `centos`.
    
    **target_hosts**
    
    :   This parameter specifies a complete list of IPv4 addresses to your master and agent nodes. This must be a YAML-formatted nested series (-).
        
        **Important:** Master nodes must be listed in both the `master_list` and `target_hosts` parameters.
    
    For more configuration examples and all available options, see the [configuration file options][4].

2.  Save as `genconf/config.yaml`.

3.  Move your private SSH key to `genconf/ssh_key`. For more information, see the [ssh_key_path][5] parameter.
    
        cp <path-to-key> genconf/ssh_key && chmod 0600 genconf/ssh_key
        

### <a name="install-bash"></a>4.2 Install DC/OS

In this step you create a custom DC/OS build file on your bootstrap node and then install DC/OS onto your cluster. With this installation method you create a bootstrap server that uses your SSH key and connects to every node to automate the deployment.

**Tip:** If something goes wrong and you want to rerun your setup, use these cluster [cleanup instructions][6].

**Prerequisites**

*   A `genconf/config.yaml` file that is optimized for automatic distribution of DC/OS across your nodes with SSH.
*   A `genconf/ip-detect` script.

<!-- Early access URL: https://downloads.dcos.io/dcos/EarlyAccess/dcos_generate_config.sh -->

<!-- Stable URL: https://downloads.dcos.io/dcos/stable/dcos_generate_config.sh -->

To install DC/OS:

1.  Download and save the DC/OS setup file, `dcos_generate_config.sh`, to the home directory on your bootstrap node. This file is used to create your customized DC/OS build file.
    
    **Important:** Contact your sales representative or <sales@mesosphere.io> to obtain the DC/OS setup file.

2.  From your root directory on the bootstrap node, run the DC/OS installer shell script on your bootstrap node to generate a customized DC/OS build. The setup script extracts a Docker container that uses the generic DC/OS install files to create customized DC/OS build files for your cluster. The build files are output to `./genconf/serve/`.
    
        sudo bash dcos_generate_config.sh --genconf
        
    
    At this point your directory structure should resemble:
    
        ├── dcos-genconf.c9722490f11019b692-cb6b6ea66f696912b0.tar
        ├── dcos_generate_config.sh
        ├── genconf
        │   ├── config.yaml
        │   ├── ip-detect
        │   ├── ssh_key
        

3.  Run this command on your DC/OS setup file to fix a known issue. This command inserts an argument into the `docker run` command for the container which sets an environment variable for `$TERM`.
    
        sed -i.bak "s/docker run -i/docker run -i -e "TERM=linux"/g" dcos_generate_config.sh
        

4.  Run a preflight script to validate that your cluster is installable.
    
        sudo bash dcos_generate_config.sh --preflight 
        
    
    Here is an example of the output.
    
        Running mesosphere/dcos-genconf docker BUILD_DIR set to /home/someuser/genconf 
        ... 
        Running preflight checks
        
    
    **Tip:** For a detailed view, you can add log level debug (`-v`) to your command. For example `sudo bash dcos_generate_config.sh --preflight -v`.

5.  Install DC/OS on your cluster.
    
        sudo bash dcos_generate_config.sh --deploy
        
    
    Here is an example of the output.
    
        Running mesosphere/dcos-genconf docker with BUILD_DIR set to /home/someuser/genconf
        ...
        Starting DC/OS install process
        Running preflight checks
        Creating directories under /etc/mesosphere
        Creating role file for master
        Configuring DC/OS
        Setting and starting DC/OS
        
        Cleaning up temp directory /opt/dcos_install_tmp
        

6.  Run the DC/OS diagnostic script to verify that services are up and running.
    
        sudo bash dcos_generate_config.sh --postflight
        

7.  Monitor Exhibitor and wait for your masters to converge at `http://<public-master-ip>:8181/exhibitor/v1/ui/index.html`.
    
    **Tip:** This process can take about 10 minutes. During this time you will see the Master nodes become visible on the Exhibitor consoles and come online, eventually showing a green light.
    
    <a href="/wp-content/uploads/2015/12/chef-zk-status.png" rel="attachment wp-att-2112"><img src="/wp-content/uploads/2015/12/chef-zk-status.png" alt="chef-zk-status" width="551" height="467" class="alignnone size-full wp-image-2112" /></a>
    
    When the status icons are green, you can access the DC/OS web interface.

8.  Launch the DC/OS web interface at: `http://<public-master-ip>/`:
    
    <a href="/wp-content/uploads/2015/12/dashboardsmall.png" rel="attachment wp-att-1120"><img src="/wp-content/uploads/2015/12/dashboardsmall.png" alt="dashboardsmall" width="1338" height="828" class="alignnone size-full wp-image-1120" /></a>

You are done!

# <a name="manual"></a>Manually distributing DC/OS across your nodes

### <a name="config-json"></a>4.1 Configure your cluster

In this step you create a YAML configuration file that is customized for your environment. DC/OS uses this configuration file during installation to generate your cluster installation files. In these instructions we assume that you are using ZooKeeper for shared storage.

1.  Customize this `config.yaml` template file for your environment. <!-- bootstrap_url is changeable -->
    
        cluster_config:
          bootstrap_url: http://<bootstrap_ip>:<your_port>       
          cluster_name: '<cluster-name>'
          exhibitor_storage_backend: zookeeper
          exhibitor_zk_hosts: <host1>:2181
          exhibitor_zk_path: /dcos
          master_discovery: static 
          master_list:
          - <private-master-ip-1>
          - <private-master-ip-2>
          - <private-master-ip-3>
          resolvers:
          - <dns-resolver-1>
          - <dns-resolver-2>
        
    
    Specify these configuration parameters. <!-- log_directory: /genconf/logs, process_timeout: 120, ssh_key_path: /genconf/ssh-key -->
    
    **cluster_name**
    :   Specify the name of your cluster.
    
    **bootstrap_url**
    
    :   This parameter specifies the URI path for the DC/OS installer to store the customized DC/OS build files, which can be local (`bootstrap_url:file:///opt/dcos_install_tmp`) or hosted (`http://<your-web-server>`). By default this is set to `file:///opt/dcos_install_tmp` in the `config.yaml` template file, which is the location where the DC/OS installer puts your install tarball.
        
        **Tip:** This parameter is for advanced users. The default value should work for most installations.
    
    **exhibitor_storage_backend**
    :   This parameter specifies the type of storage backend for Exhibitor. By default this is set to `zookeeper` in the `config.yaml` template file. During DC/OS installation, a storage system is required for configuring and orchestrating Zookeeper with Exhibitor on the master nodes. Exhibitor automatically configures your Zookeeper installation on the master nodes during your DC/OS installation.
    
    **exhibitor_zk_hosts**
    :   Specify a comma-separated list of one or more Zookeeper node IP addresses to use for configuring the internal Exhibitor instances. Exhibitor uses this Zookeeper cluster to orchestrate it's configuration.
    
    **master_discovery**
    :   This parameter specifies the Mesos master discovery method. By default this is set to `static` in the `config.yaml` template file. The `static` method uses the Mesos agents to discover the masters by giving each agent a static list of master IPs. The masters must not change IP addresses, and if a master is replaced, the new master must take the old master's IP address
    
    **master_list**
    :   Specify a list of your static master IP addresses as a YAML nested series (`-`).
    
    **resolvers**
    
    :   Specify a JSON-formatted list of DNS servers for your DC/OS host nodes. You must include the escape characters (``) as shown in the template. Set this parameter to the most authoritative nameservers that you have. If you want to resolve internal hostnames, set it to a nameserver that can resolve them.
        
        *Caution:* If you set the `resolvers` parameter incorrectly, you will permanently damage your configuration and have to reinstall DC/OS.
    
    For more configuration examples and all available options, see the [configuration file options][4].

2.  Save as `genconf/config.yaml`.

## <a name="install-bash"></a>4.2 Install DC/OS

In this step you create a custom DC/OS build file on your bootstrap node and then install DC/OS onto your cluster. With this method you package the DC/OS distribution yourself and connect to every server manually and run the commands.

**Tip:** If something goes wrong and you want to rerun your setup, use these cluster [cleanup instructions][5].

**Prerequisites**

*   A `genconf/config.yaml` file that is optimized for manual distribution of DC/OS across your nodes.
*   A `genconf/ip-detect` script. 
*   The Docker NGINX image must be on your bootstrap node. You can use this command to install the NGINX container:
    
         docker pull nginx
        
    
    For more information, see <a href="https://hub.docker.com/_/nginx/" target="_blank">DockerHub NGINX</a> documentation.

<!-- Early access URL: https://downloads.dcos.io/dcos/EarlyAccess/dcos_generate_config.sh -->

<!-- Stable URL: https://downloads.dcos.io/dcos/stable/dcos_generate_config.sh --> To install DC/OS:

1.  Download and save the DC/OS setup file, `dcos_generate_config.sh`, to the root directory on your bootstrap node. This file is used to create your customized DC/OS build file.
    
    **Important:** Contact your sales representative or <sales@mesosphere.io> to obtain the DC/OS setup file.
    
    At this point your directory structure should resemble:
    
        ├── dcos-genconf.c9722490f11019b692-cb6b6ea66f696912b0.tar
        ├── dcos_generate_config.sh
        ├── genconf
        │   ├── config.yaml
        │   ├── ip-detect
        

2.  Run this command on your DC/OS setup file to fix a known issue. This command inserts an argument into the `docker run` command for the container which sets an environment variable for `$TERM`.
    
        sed -i.bak "s/docker run -i/docker run -i -e "TERM=linux"/g" dcos_generate_config.sh
        

3.  From your root directory, run the DC/OS installer shell script on your bootstrapping master nodes to generate a customized DC/OS build. The setup script extracts a Docker container that uses the generic DC/OS install files to create customized DC/OS build files for your cluster. The build files are output to `./genconf/serve/`.
    
            sudo bash dcos_generate_config.sh
        
    
    **Tip:** For the install script to work, you must have created `genconf/config.yaml` and `genconf/ip-detect`.

4.  From your root directory, run this command to host the DC/OS install package through an NGINX Docker container. For `<your-port>`, specify the port value that is used in the `bootstrap_url`.
    
        docker run -d -p <your-port>:80 -v $PWD/genconf/serve:/usr/share/nginx/html:ro nginx
        

5.  Run these commands on each of your master nodes in succession to install DC/OS using your custom build file.
    
    **Tip:** Although there is no actual harm to your cluster, DC/OS may issue error messages until all of your master nodes are configured.
    
    1.  SSH to your master node:
        
            ssh <master-ip>
            
    
    2.  Make a new directory and navigate to it:
        
            mkdir /tmp/dcos && cd /tmp/dcos
            
    
    3.  Download the DC/OS installer from the NGINX Docker container, where `<bootstrap-ip>` and `<your_port>` are specified in `bootstrap_url`:
        
            curl -O http://<bootstrap-ip>:<your_port>/dcos_install.sh
            
    
    4.  Run this command to install DC/OS on your master nodes:
        
            sudo bash dcos_install.sh master
            

6.  Run these commands on each of your agent nodes to install DC/OS using your custom build file.
    
    1.  SSH to your node:
        
            ssh <agent-ip>
            
    
    2.  Make a new directory and navigate to it:
        
            mkdir /tmp/dcos && cd /tmp/dcos
            
    
    3.  Download the DC/OS installer from the NGINX Docker container, where `<bootstrap-ip>` and `<your_port>` are specified in `bootstrap_url`:
        
            curl http://<bootstrap-ip>:<your_port>/dcos_install.sh
            
    
    4.  Run this command to install DC/OS on your agent node:
        
            sudo bash dcos_install.sh slave
            

7.  Monitor Exhibitor and wait for your masters to converge at `http://<public-master-ip>:8181/exhibitor/v1/ui/index.html`.
    
    **Tip:** This process can take about 10 minutes. During this time you will see the Master nodes become visible on the Exhibitor consoles and come online, eventually showing a green light.
    
    <a href="/wp-content/uploads/2015/12/chef-zk-status.png" rel="attachment wp-att-2112"><img src="/wp-content/uploads/2015/12/chef-zk-status.png" alt="chef-zk-status" width="551" height="467" class="alignnone size-full wp-image-2112" /></a>
    
    When the status icons are green, you can access the DC/OS web interface.

8.  Launch the DC/OS web interface at: `http://<public-master-ip>/`:
    
    <a href="/wp-content/uploads/2015/12/dashboardsmall.png" rel="attachment wp-att-1120"><img src="/wp-content/uploads/2015/12/dashboardsmall.png" alt="dashboardsmall" width="1338" height="828" class="alignnone size-full wp-image-1120" /></a>

You are done!

 [1]: #ssh
 [2]: #manual
 [3]: https://techjourney.net/how-to-decrypt-an-enrypted-ssl-rsa-private-key-pem-key/
 [4]: /archived-dcos-enterprise-edition/installing-enterprise-edition-1-5/configure-and-install-dcos/configuration-parameters/
 [5]: http://mesos.apache.org/documentation/latest/containerizer/
 [6]: /docs/1.7/administration/installing/custom/uninstall/