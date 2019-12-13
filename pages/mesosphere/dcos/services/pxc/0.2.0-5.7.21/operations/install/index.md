---
layout: layout.pug
navigationTitle: Install 
excerpt: Installation guide, best practices and constraints
title: Install 
menuWeight: 31
model: /mesosphere/dcos/services/pxc/data.yml
render: mustache
---


DC/OS {{ model.techName }} is available in the DC/OS Catalog and can be installed by using either the GUI or the DC/OS CLI.

The default DC/OS {{ model.techName }} Service installation provides reasonable defaults for trying out the service, but that may not be sufficient for production use. You may require different configurations depending on the context of the deployment.


## Deployment Best Practice for Production
  
- Increase the number of TCP socket ports available. This is particularly important if the flow will be setting up and tearing down a large number of sockets in small period of time.
   ```
   sudo sysctl -w net.ipv4.ip_local_port_range="10000 65000"
   ```
- Tell Linux you never want {{ model.techName }} to swap. Swapping is fantastic for some applications. It isn’t good for something like {{ model.techName }} that always wants to be running. To tell Linux you’d like swapping off you can edit '/etc/sysctl.conf' to add the following line:
   ``` 
   vm.swappiness = 0
   ```  
For the partitions handling the various {{ model.techName }} repos, turn off things like `atime`. Doing so can cause a surprising bump in 
throughput. Edit the `/etc/fstab` file and for the partition(s) of interest add the 'noatime' option.

## Prerequisites
- You must have [DC/OS](/mesosphere/dcos/1.12/installing/) installed on your cluster.
- Your cluster must have {{ model.install.minNodeCount }}.
- If you are using Enterprise DC/OS, you may [need to provision a service account](/mesosphere/dcos/services/pxc/0.2.0-5.7.21/Operations/security/service-account/) before installing DC/OS {{ model.techName }} Service. Only someone with `superuser` permission can create the service account.
  - `strict` [security mode](/mesosphere/dcos/1.12/security/ent/service-auth/custom-service-auth/) requires a service account.
  - In `permissive` security mode a service account is optional.
  - `disabled` security mode does not require a service account.

#include /mesosphere/dcos/services/include/getting-started.tmpl
