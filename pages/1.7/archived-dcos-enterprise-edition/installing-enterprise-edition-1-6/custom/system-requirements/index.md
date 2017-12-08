---
layout: layout.pug
navigationTitle:  System Requirements
title: System Requirements
menuWeight: 0
excerpt:
featureMaturity:
enterprise: true
---




# Hardware Prerequisites

You must have a single bootstrap node, Mesos master nodes, and Mesos agent nodes.

## Bootstrap node

1 node with 2 Cores, 16 GB RAM, 60 GB HDD. This is the node where DCOS installation is run. This bootstrap node must also have:

*   Python, pip, and virtualenv must be installed for the DCOS [CLI][1]. pip must be configured to pull packages from PyPI or your private PyPI, if applicable.
*   A High-availability (HA) load balancer, such as HAProxy to balance the following TCP ports to all master nodes: 80, 443, 8080, 8181, 2181, 5050. </ul> </li> </ul></li> </ul>
    
    ## Cluster nodes
    
    The cluster nodes are designated Mesos masters and agents during installation.
    
    ### Master nodes
    
    Here are the master node hardware requirements.
    
    <table class="table">
      <tr>
        <th>
          Minimum
        </th>
        
        <th>
          Recommended
        </th>
      </tr>
      
      <tr>
        <td>
          Nodes: 1<br />OS: Enterprise Linux 7 kernel 3.10.0-327 or CoreOS Stable<br />Processor: 4 cores<br />Memory: 32 GB RAM<br />Hard disk space: 120 GB
        </td>
        
        <td>
          Nodes: 3<br />OS: Enterprise Linux 7 kernel 3.10.0-327 or CoreOS Stable<br />Processor: 4 cores<br />Memory: 32 GB RAM<br />Hard disk space: 120 GB
        </td>
      </tr>
      
      <tr>
        <td colspan="2">
          <p>
            There are many mixed workloads on the masters, for example Mesos replicated log and Zookeeper. Some of these require fsync()ing every so often, and this can generate a lot of very expensive random I/O. We recommend the following: <ul>
              <li>
                Solid-state drive (SSD)
              </li>
              <li>
                RAID controllers with a BBU
              </li>
              <li>
                RAID controller cache configured in writeback mode
              </li>
            </ul>
          </p>
        </td>
      </tr>
    </table>
    
    ### Agent nodes
    
    Here are the agent node hardware requirements.
    
    <table class="table">
      <tr>
        <th class="tg-e3zv">
          Minimum
        </th>
        
        <th class="tg-e3zv">
          Recommended
        </th>
      </tr>
      
      <tr>
        <td class="tg-031e">
          Nodes: 1<br />OS: Enterprise Linux 7 kernel 3.10.0-327 or CoreOS Stable<br />Processor: 2 cores<br />Memory: 16 GB RAM<br />Hard disk space: 60 GB
        </td>
        
        <td class="tg-031e">
          Nodes: 6<br />OS: Enterprise Linux 7 kernel 3.10.0-327 or CoreOS Stable<br />Processor: 2 cores<br />Memory: 16 GB RAM<br />Hard disk space: 60 GB
        </td>
      </tr>
      
      <tr>
        <td colspan="2">
          The agent nodes must also have a <code>/var</code> directory with 10 GB or more of free space. This directory is used by the sandbox for both Docker and Mesos Containerizer.* Network Access to a public Docker repository or to an internal Docker registry.</ul>
        </td>
      </tr>
    </table>
    
    </ul>
    
    *   On RHEL 7 and CentOS 7, firewalld must be stopped and disabled. It is a known <a href="https://github.com/docker/docker/issues/16137" target="_blank">Docker issue</a> that firewalld interacts poorly with Docker. For more information, see the <a href="https://docs.docker.com/v1.6/installation/centos/#firewalld" target="_blank">Docker CentOS firewalld</a> documentation.
        
            sudo systemctl stop firewalld && sudo systemctl disable firewalld
            
    
    ### Port Configuration
    
    *   Each node has IP-to-IP connectivity from itself to all nodes in the DCOS cluster.
    *   Each node has Network Time Protocol (NTP) for clock synchronization enabled.
    *   Each node has ICMP enabled.
    *   Each node has TCP and UDP enabled port 53 for DNS.
    *   All hostnames (FQDN and short hostnames) must be resolvable in DNS, both forward and reverse lookups must succeed. 
    *   These ports must be open for communication from the master nodes to the agent nodes:
        
        <table class="table">
          <tr>
            <th class="tg-e3zv">
              TCP Port
            </th>
            
            <th class="tg-e3zv">
              Description
            </th>
          </tr>
          
          <tr>
            <td class="tg-yw4l">
              5051
            </td>
            
            <td class="tg-yw4l">
              Mesos agent nodes
            </td>
          </tr>
        </table>
    
    *   These ports must be open for communication from the agent nodes to the master nodes.
        
        <table class="table">
          <tr>
            <th class="tg-e3zv">
              TCP Port
            </th>
            
            <th class="tg-e3zv">
              Description
            </th>
          </tr>
          
          <tr>
            <td class="tg-yw4l">
              2181
            </td>
            
            <td class="tg-yw4l">
              ZooKeeper, see the <a href="http://zookeeper.apache.org/doc/r3.1.2/zookeeperAdmin.html#sc_zkCommands" target="_blank">ZK Admin Guide</a>
            </td>
          </tr>
          
          <tr>
            <td class="tg-yw4l">
              2888
            </td>
            
            <td class="tg-yw4l">
              Exhibitor, see the <a href="https://github.com/Netflix/exhibitor/wiki/REST-Introduction" target="_blank">Exhibitor REST Documentation</a>
            </td>
          </tr>
          
          <tr>
            <td class="tg-yw4l">
              3888
            </td>
            
            <td class="tg-yw4l">
              Exhibitor, see the <a href="https://github.com/Netflix/exhibitor/wiki/REST-Introduction" target="_blank">Exhibitor REST Documentation</a>
            </td>
          </tr>
          
          <tr>
            <td class="tg-031e">
              5050
            </td>
            
            <td class="tg-031e">
              Mesos master nodes
            </td>
          </tr>
          
          <tr>
            <td class="tg-031e">
              5051
            </td>
            
            <td class="tg-031e">
              Mesos agent nodes
            </td>
          </tr>
          
          <tr>
            <td class="tg-031e">
              8080
            </td>
            
            <td class="tg-031e">
              Marathon
            </td>
          </tr>
          
          <tr>
            <td class="tg-031e">
              8123
            </td>
            
            <td class="tg-031e">
              Mesos-DNS API
            </td>
          </tr>
          
          <tr>
            <td class="tg-yw4l">
              8181
            </td>
            
            <td class="tg-yw4l">
              Exhibitor, see the <a href="https://github.com/Netflix/exhibitor/wiki/REST-Introduction" target="_blank">Exhibitor REST Documentation</a>
            </td>
          </tr>
        </table>
    
    # Software Prerequisites
    
    ## All Nodes
    
    ### <a name="docker"></a>Docker
    
    **Requirements**
    
    *   Docker 1.7 or greater must be installed on all bootstrap and cluster nodes.
    
    **Recommendations**
    
    *   Docker 1.9 or greater is recommended <a href="https://github.com/docker/docker/issues/9718" target="_blank">for stability reasons</a>.
    
    *   Do not use Docker `devicemapper` storage driver in `loop-lvm` mode. For more information, see [Docker and the Device Mapper storage driver][2].
    
    *   Prefer `OverlayFS` or `devicemapper` in `direct-lvm` mode when choosing a production storage driver. For more information, see Docker's <a href="https://docs.docker.com/engine/userguide/storagedriver/selectadriver/" target="_blank">Select a Storage Driver</a>.
    
    *   Manage Docker on CentOS with systemd. systemd handles starting Docker on boot and restarting it when it crashes.
    
    *   Run Docker commands as the root user (with `sudo`) or as a user in the <a href="https://docs.docker.com/engine/installation/linux/centos/#create-a-docker-group" target="_blank">docker user group</a>.
    
    **Distribution-Specific Installation**
    
    Each Linux distribution requires Docker to be installed in a specific way:
    
    *   **CoreOS** - Comes with Docker pre-installed and pre-configured.
    *   **RHEL** - Install Docker by using a subscription channel. For more information, see <a href="https://access.redhat.com/articles/881893" target="_blank">Docker Formatted Container Images on Red Hat Systems</a>. <!-- curl -sSL https://get.docker.com | sudo sh -->
    
    *   **CentOS** - [Install Docker from Docker's yum repository][3].
    
    For more more information, see Docker's <a href="http://docs.docker.com/engine/installation/" target="_blank">distribution-specific installation instructions</a>.
    
    ## Bootstrap node
    
    </li> </ul>
    
    The bootstrap node is a permanent part of your cluster and is required for DCOS recovery. The leader state and leader election of your Mesos masters is maintained in Exhibitor ZooKeeper.
    
    Before installing DCOS, you must ensure that your bootstrap node has the following prerequisites.
    
    ### DCOS setup file
    
    Download and save the DCOS setup file to your bootstrap node. This file is used to create your customized DCOS build file. Contact your sales representative or [sales@mesosphere.com][3] to obtain the DCOS setup file.
    
    ### Shared external storage for Exhibitor
    
    Shared external storage is required to bootstrap the Exhibitor service. Exhibitor automatically configures your ZooKeeper installation on the master nodes during DCOS installation. ZooKeeper is a high-performance coordination service for distributed applications. Exhibitor is a supervisor for ZooKeeper and requires a dedicated amount of storage space that is highly available.
    
    The shared external storage mechanism can be another ZooKeeper instance, an Amazon S3 bucket, or a Network File System (NFS) mount. Temporary outages while the cluster is running are acceptable, but shared storage should generally be up and running to support replacing failed masters.
    
    For testing purposes, you can quickly start a single temporary instance of ZooKeeper in a Docker container with this command.
    
        sudo docker run -d -p 2181:2181 -p 2888:2888 -p 3888:3888 -v /var/zookeeper/dcos:/tmp/zookeeper --name=dcos_int_zk jplock/zookeeper
        
    
    If you’ve run the `usermod` Docker command, you might have to log out and then back in to your bootstrap node before starting Zookeeper.
    
    **Important:** If you use a ZooKeeper instance to bootstrap Exhibitor, this ZooKeeper instance must be separate from your DCOS cluster. You must have at least 3 ZooKeeper instances running at all times for high availability.
    
    For more information about how to configure external shared storage, see the [exhibitor_storage_backend][4] configuration parameter.
    
    ### Docker Nginx
    
    Install the Docker Nginx image:
    
        sudo docker pull nginx
        
    
    ## Cluster nodes
    
        For advanced install only, your cluster nodes must have the following prerequisites. The cluster nodes are designated as Mesos masters and agents during installation.
        
    
    ### Data compression (advanced installer)
    
    You must have the <a href="http://www.info-zip.org/UnZip.html" target="_blank">UnZip</a>, <a href="https://www.gnu.org/software/tar/" target="_blank">GNU tar</a>, and <a href="http://tukaani.org/xz/" target="_blank">XZ Utils</a> data compression utilities installed on your cluster nodes.
    
    To install these utilities on CentOS7 and RHEL7:
    
        sudo yum install -y tar xz unzip curl ipset
        
    
    ### Cluster permissions (advanced installer)
    
    On each of your cluster nodes, use the following command to:
    
    *   Disable SELinux or set it to permissive mode.
    *   Add nogroup to each of your Mesos masters and agents. 
    *   Reboot your cluster for the changes to take affect. 
        
            sudo sed -i s/SELINUX=enforcing/SELINUX=permissive/g /etc/selinux/config &&
            sudo groupadd nogroup &&
            sudo reboot
            
    
    **Tip:** It may take a few minutes for your node to come back online after reboot.

 [1]: /1.7/usage/cli/
 [2]: https://docs.docker.com/engine/userguide/storagedriver/device-mapper-driver/
 [3]: http://sales@mesosphere.com
 [4]: ../configuration-parameters/