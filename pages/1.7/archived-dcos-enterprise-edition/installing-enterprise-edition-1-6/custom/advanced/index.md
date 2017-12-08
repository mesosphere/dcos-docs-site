---
layout: layout.pug
navigationTitle:  Advanced
title: Advanced
menuWeight: 0
excerpt:
featureMaturity:
enterprise: true
---









With the advanced installer, you package the DC/OS distribution yourself and connect to every node manually to run the DC/OS installation commands. This installation method is recommended if you don't have SSH access to your cluster or if you want to integrate with an existing system.

This installation method requires:

*   The bootstrap node must be network accessible from the cluster nodes 
*   The bootstrap node must have the HTTP(S) ports open from the cluster nodes

## Prerequisites
Before installing DC/OS, your cluster must have the software and hardware [requirements](/1.7/administration/installing/custom/system-requirements/).

# Create an IP detection script

In this step you create an IP detect script to broadcast the IP address of each node across the cluster. Each node in a DC/OS cluster has a unique IP address that is used to communicate between nodes in the cluster. The IP detect script prints the unique IPv4 address of a node to STDOUT each time DC/OS is started on the node.

**Important:** The IP address of a node must not change after DC/OS is installed on the node. For example, the IP address must not change when a node is rebooted or if the DHCP lease is renewed. If the IP address of a node does change, the node must be [wiped and reinstalled][2].

1.  Create a directory named `genconf` on your bootstrap node and navigate to it.
    
        mkdir -p genconf
        

2.  Create an IP detection script for your environment and save as `genconf/ip-detect`. This script needs to be `UTF-8` encoded and have a valid [shebang](https://en.wikipedia.org/wiki/Shebang_(Unix&#41;) line. You can use the examples below.
    
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
            

# <a name="config-json"></a>Configure your cluster

In this step you create a YAML configuration file that is customized for your environment. DC/OS uses this configuration file during installation to generate your cluster installation files. In these instructions we assume that you are using ZooKeeper for shared storage.

1.  From the bootstrap node, run this command to create a hashed password for superuser authentication, where `<superuser_password>` is the superuser password. Use the hashed password key for the `superuser_password_hash` parameter in your `config.yaml` file.
    
        sudo bash dcos_generate_config.ee.sh --hash-password <superuser_password>
        
    
    Here is an example of a hashed password output.
    
        Extracting image from this script and loading into docker daemon, this step can take a few minutes
        dcos-genconf.9eda4ae45de5488c0c-c40556fa73a00235f1.tar
        Running mesosphere/dcos-genconf docker with BUILD_DIR set to /home/centos/genconf
        00:42:10 dcos_installer.action_lib.prettyprint:: ====> HASHING PASSWORD TO SHA512
        00:42:11 root:: Hashed password for 'password' key:
        $6$rounds=656000$v55tdnlMGNoSEgYH$1JAznj58MR.Bft2wd05KviSUUfZe45nsYsjlEl84w34pp48A9U2GoKzlycm3g6MBmg4cQW9k7iY4tpZdkWy9t1
        

2.  Create a configuration file and save as `genconf/config.yaml`.
    
    You can use this template to get started. This template specifies 5 agent nodes, 3 masters, 3 ZooKeeper instances for Exhibitor storage, static master discovery list, and Google DNS resolvers. If your servers are installed with a domain name in your `/etc/resolv.conf`, you should add `dns_search` to your `config.yaml` file. For parameters descriptions and configuration examples, see the [documentation][1].
    
    **Tip:** If Google DNS is not available in your country, you can replace the Google DNS servers `8.8.8.8` and `8.8.4.4` with your local DNS servers.
    
        agent_list:
        - <agent-private-ip-1>
        - <agent-private-ip-2>
        - <agent-private-ip-3>
        - <agent-private-ip-4>
        - <agent-private-ip-5>
        bootstrap_url: http://<bootstrap_ip>:80       
        cluster_name: '<cluster-name>'
        exhibitor_storage_backend: zookeeper
        exhibitor_zk_hosts: <host1>:2181,<host2>:2181,<host3>:2181
        exhibitor_zk_path: /dcos
        master_discovery: static 
        master_list:
        - <master-private-ip-1>
        - <master-private-ip-2>
        - <master-private-ip-3>
        resolvers:
        - 8.8.4.4
        - 8.8.8.8
        superuser_password_hash: <hashed-password>
        superuser_username: <username>
        

# <a name="install-bash"></a>Install DC/OS

In this step you create a custom DC/OS build file on your bootstrap node and then install DC/OS onto your cluster. With this method you package the DC/OS distribution yourself and connect to every server manually and run the commands.

**Tip:** If something goes wrong and you want to rerun your setup, use these cluster [cleanup instructions][2].

**Prerequisites**

*   A `genconf/config.yaml` file that is optimized for [manual distribution of DC/OS across your nodes][3].
*   A `genconf/ip-detect` script.

<!-- Early access URL: https://downloads.dcos.io/dcos/EarlyAccess/dcos_generate_config.sh -->

<!-- Stable URL: https://downloads.dcos.io/dcos/stable/dcos_generate_config.sh --> To install DC/OS:

1.  From the bootstrap node, run the DC/OS installer shell script to generate a customized DC/OS build file. The setup script extracts a Docker container that uses the generic DC/OS install files to create customized DC/OS build files for your cluster. The build files are output to `./genconf/serve/`.
    
    At this point your directory structure should resemble:
    
        ├── dcos-genconf.c9722490f11019b692-cb6b6ea66f696912b0.tar
        ├── dcos_generate_config.ee.sh
        ├── genconf
        │   ├── config.yaml
        │   ├── ip-detect
        

2.  Run this command to generate your customized DC/OS build file:
    
        sudo bash dcos_generate_config.ee.sh
        
    
    **Tip:** For the install script to work, you must have created `genconf/config.yaml` and `genconf/ip-detect`.

3.  From your home directory, run this command to host the DC/OS install package through an NGINX Docker container. For `<your-port>`, specify the port value that is used in the `bootstrap_url`.
    
        sudo docker run -d -p <your-port>:80 -v $PWD/genconf/serve:/usr/share/nginx/html:ro nginx
        

4.  Run these commands on each of your master nodes in succession to install DC/OS using your custom build file.
    
    **Tip:** Although there is no actual harm to your cluster, DC/OS may issue error messages until all of your master nodes are configured.
    
    1.  SSH to your master nodes:
        
            ssh <master-ip>
            
    
    2.  Make a new directory and navigate to it:
        
            mkdir /tmp/dcos && cd /tmp/dcos
            
    
    3.  Download the DC/OS installer from the NGINX Docker container, where `<bootstrap-ip>` and `<your_port>` are specified in `bootstrap_url`:
        
            curl -O http://<bootstrap-ip>:<your_port>/dcos_install.sh
            
    
    4.  Run this command to install DC/OS on your master nodes:
        
            sudo bash dcos_install.sh master
            

5.  Run these commands on each of your agent nodes to install DC/OS using your custom build file.
    
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
    
    4.  Run this command to install DC/OS on your agent nodes. You must designate your agent nodes as [public][4] or [private][5].
        
        *   Private agent nodes:
        <pre>sudo bash dcos_install.sh slave</pre>
    
    *   Public agent nodes:
        
        ```bash
        sudo bash dcos_install.sh slave_public</pre>
        ```

6.  Monitor Exhibitor and wait for your masters to converge at `http://<master-ip>:8181/exhibitor/v1/ui/index.html`.
    
    **Tip:** This process can take about 10 minutes. During this time you will see the Master nodes become visible on the Exhibitor consoles and come online, eventually showing a green light.
    
    <a href="/wp-content/uploads/2015/12/chef-zk-status.png" rel="attachment wp-att-2112"><img src="/wp-content/uploads/2015/12/chef-zk-status.png" alt="chef-zk-status" width="551" height="467" class="alignnone size-full wp-image-2112" /></a>
    
    When the status icons are green, you can access the DC/OS web interface.

7.  Launch the DC/OS web interface at: `http://<master-node-public-ip>/`.

8.  Click **Log In To DC/OS**.
    
    <a href="/wp-content/uploads/2016/02/ui-installer-success1.png" rel="attachment wp-att-3198"><img src="/wp-content/uploads/2016/02/ui-installer-success1.png" alt="ui-installer-success1" width="625" height="404" class="alignnone size-full wp-image-3198" /></a>

9.  Enter your administrator username and password.
    
    ![UI installer auth](ui-installer-auth2.png)
    
    You are done!
    
    <a href="/wp-content/uploads/2016/02/ui-dashboard-ee.png" rel="attachment wp-att-3343"><img src="/wp-content/uploads/2016/02/ui-dashboard-ee-800x538.png" alt="ui-dashboard-ee" width="800" height="538" class="alignnone size-large wp-image-3343" /></a>

### Next Steps

Now you can [assign user roles][6].

### Uninstalling DC/OS

1.  Enter this command on each cluster node.
    
        sudo -i /opt/mesosphere/bin/pkgpanda uninstall && sudo rm -rf /opt/mesosphere

 [1]: /1.7/administration/installing/custom/configuration-parameters/
 [2]: /1.7/administration/installing/custom/uninstall/
 [3]: /1.7/usage/cli/
 [4]: /1.7/overview/concepts/#public
 [5]: /1.7/overview/concepts/#private
 [6]: /1.7/administration/id-and-access-mgt/