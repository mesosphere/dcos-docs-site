---
layout: layout.pug
title: Uninstalling DC/OS
navigationTitle: Uninstalling
menuWeight: 30
excerpt: Removing DC/OS
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---

{{ model.techName }} offers an uninstall script for removing {{ model.techName }} from your system.  To remove {{ model.techName }} from a master, agent or public agent you must push the uninstall script to the node you would like to scrub {{ model.techName }} from, make it executable and then run it with sudo privileges.

Before running the script you should ensure that the cluster no longer requires this agent.

- If the node is a Master, ensure that there are at least 3 other masters in the cluster up and healthy before uninstalling.

- If the node is a Private or Public Agent, ensure that all tasks have been redeployed elsewhere. Ensure that there are no persistent volumes containing data needed for services in the cluster.

# Uninstalling {{ model.techName }}

1. Download the script. You can download the script [here](http://downloads.mesosphere.com/dcos-uninstall/uninstall.sh). 
1. Make it executable:

    ```bash
    chmod a+x dcos_uninstall.sh
    ```
    
1. Run it with `sudo` privileges:
    
    ```bash
    sudo ./dcos_uninstall.sh
    ```


## What this script does
This script will uninstall all {{ model.techName }} binaries, libraries, and log files from the machine named $HOSTNAME.

It will leave behind an [uninstallation log](/var/log/dcos.uninstall.log) which details all of the files that were removed from the machine. 

- After running the uninstallation script, your machine is left in a state where {{ model.techName }} can be cleanly installed again.
- This script is intended to remove {{ model.techName }} from Master and Agent nodes and should not be used to uninstall a bootstrap node.

## What this script does not do

If you are running this script on an agent node, you should gracefully stop any active workloads on this node. This script will proceed with the uninstallation of {{ model.techName }} even with running workloads. However, the exit will not be graceful to those active workloads. Also, the uninstaller may not be able to delete any local ephemeral storage of the active workload(s) due to file locking issues. Any errors in file removal are logged in the uninstaller log.

- This script does not uninstall or alter Docker in any way.
- This script does not modify any supplemental services or packages which might have been used to install or configure {{ model.techName }} like: NTP, yum, firewalld, nginx, resolv.conf, etc.
- This script does not force a reboot after completion. It asks the user to perform a reboot.
