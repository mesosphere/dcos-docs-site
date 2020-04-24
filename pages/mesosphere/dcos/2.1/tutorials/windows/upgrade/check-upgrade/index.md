---
layout: layout.pug
title: Check the status of the upgrade
navigationTitle: Upgrade check
menuWeight: 45
model: /mesosphere/dcos/2.1/data.yml
excerpt: Guide how to check the status of the upgrade on the Windows node
---

# Check the status of the upgrade

After upgrading the cluster, the following components must be running on the Windows node:
- mesos-agent (includes security, metrics, and the container logger modules)
- Adminrouter
- Telegraf
- dcos-diagnostics
Use this command to check if all of the services managed by NSSM are running.
```nssm list```

![nssm output](/mesosphere/dcos/2.1/tutorials/windows/upgrade/img/nssm-list.png)

Move to the DCOS install directory by typing the next command:
```cd c:\d2iq\dcos```
And list the stuff within using command:
```dir /p```

![directories](/mesosphere/dcos/2.1/tutorials/windows/upgrade/img/directories.png)

There should be a directory with a name equal to the DCOS upgrade version (2.1.0-beta2 in this particular case).
Switch to the packages directory:
```cd ./packages```
And check the list of packages:
```dir /p```
We can see the old version of the package and its version after the upgrade.

![packages](/mesosphere/dcos/2.1/tutorials/windows/upgrade/img/packages.png)

Move to the log directory:
```cd c:\d2iq\dcos\var\log```
And check if the file **dcos_node_upgrade.log** exists.

![logs](/mesosphere/dcos/2.1/tutorials/windows/upgrade/img/logs.png)

Check the mentioned log:
```type dcos_node_upgrade.log```
And check if the script dcos_node_upgrade.ps1 successfully finished

