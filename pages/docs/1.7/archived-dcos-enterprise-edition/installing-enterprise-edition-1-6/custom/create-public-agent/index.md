---
layout: layout.pug
title: Creating a Public Agent
menuWeight: 0
excerpt:
featureMaturity:
enterprise: true
navigationTitle:  Creating a Public Agent
---





In DC/OS, agent nodes that are publicly accessible are designated as public and those that are not are designated as private. By default, agent nodes are designated as private during [GUI][1] or [CLI][2] installation.

You can determine how many public agent nodes are in your cluster by running the following command from the DC/OS CLI. A result of `0` indicates that you do not have a public agent. A result of `1` means that you have one or more public agents.

    curl -skSL -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/mesos/master/slaves | grep slave_public | wc -l
           0

These steps must be performed on a machine that is configured as a DC/OS node. Any tasks that are running on the node will be terminated during this conversion process.

### Prerequisites:

*   DC/OS is installed and you have deployed at least one master and one private agent node.
*   The archived DC/OS installer file (`dcos-install.tar`) from your [installation][3]. 

### Uninstall the DC/OS private agent software

1.  Uninstall the current DC/OS software on the agent node.

        sudo -i /opt/mesosphere/bin/pkgpanda uninstall
        sudo systemctl stop dcos-mesos-slave
        sudo systemctl disable dcos-mesos-slave

2.  Remove the old directory structures on the agent node.
    
        sudo rm -rf /etc/mesosphere /opt/mesosphere /var/lib/mesos

3.  Restart the machine.
    
        sudo reboot

### Install DC/OS and convert to a public agent node

Copy the archived DC/OS installer file (`dcos-install.tar`) to the node that that is being converted to a public agent. This archive is created during the GUI or CLI [installation][3] method.

1.  Copy the files to your agent node. For example, you can use Secure Copy (scp) to copy `dcos-install.tar` to your home directory:
    
        scp ~/dcos-install.tar $username@$node-ip:~/dcos-install.tar

2.  SSH to the machine:
    
        ssh $USER@$AGENT

3.  Create a directory for the installer files:
    
        sudo mkdir -p /opt/dcos_install_tmp

4.  Unpackage the `dcos-install.tar` file:
    
        sudo tar xf dcos-install.tar -C /opt/dcos_install_tmp

5.  Install DC/OS as a public agent:
    
        sudo  /opt/dcos_install_tmp/dcos_install.sh slave_public

6.  Verify that your new agent node is public by running this command from a workstation with the DC/OS CLI. You should see a result of `1`, which indicates that you have at least one public node.
    
        curl -skSL -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/mesos/master/slaves | grep slave_public | wc -l
       1
    
    You should see an output greater than zero to indicate at least one public agent.

 [1]: /docs/1.7/administration/installing/custom/gui/
 [2]: /docs/1.7/administration/installing/custom/cli/
 [3]: /docs/1.7/administration/installing/custom/gui/#backup