---
layout: layout.pug
navigationTitle:  Uninstall
title: Uninstall
menuWeight: 0
excerpt:
featureMaturity:
enterprise: true
---





You can uninstall DC/OS from each node individually or from all nodes at once.

## Uninstall all nodes

You can completely uninstall DC/OS from all of your nodes by using this method. You must have installed DC/OS by using the CLI or GUI installer to use this method.
   
From your nodes with this command. From the bootstrap node, enter this command:

```
sudo bash dcos_generate_config.sh --uninstall
```

Here is an example of the output:

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

Uninstall individual nodes

You can uninstall DC/OS from individual nodes by using this method.

From each node, enter these commands:

    sudo -i /opt/mesosphere/bin/pkgpanda uninstall
    sudo rm -rf /opt/mesosphere

**Tip:** Uninstalling DCOS with these commands does not delete everything on the host.
