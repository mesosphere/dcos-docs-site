---
layout: layout.pug
title: >
  Step 1 Create a script for IP address
  discovery
menuWeight: 0
excerpt:
featureMaturity:
enterprise: true
navigationTitle:  >
---






In this step you create an IP detect script on your bootstrap node to broadcast the IP address of each node across the cluster. Each node in a DC/OS cluster has a unique IP address that is used to communicate between nodes in the cluster. The IP detect script prints the unique IPv4 address of a node to STDOUT each time DC/OS is started on the node.

**Important:** The IP address of a node must not change after DC/OS is installed on the node. For example, the IP address must not change when a node is rebooted or if the DHCP lease is renewed. If the IP address of a node does change, the node must be [wiped and reinstalled][1].

1.  From your home directory, create a directory named `genconf` on your bootstrap node and navigate to it.
    
        mkdir -p genconf
        

2.  Create an IP detection script for your environment and save as `ip-detect`. You can use the examples below.
    
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
            

## Next step

[Configure and install DC/OS][2]

 [1]: /docs/1.7/administration/installing/custom/uninstall/
 [2]: /archived-dcos-enterprise-edition/installing-enterprise-edition-1-5/configure-and-install-dcos/