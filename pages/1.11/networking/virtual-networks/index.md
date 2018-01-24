---
layout: layout.pug
navigationTitle:  Virtual Networks
title: Virtual Networks
menuWeight: 4
excerpt:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


DC/OS supports Container Networking Interface (CNI). DC/OS can thus run containers on any IP-based virtual networking solution that supports the CNI standard, examples being [Calico](https://github.com/dcos/examples/tree/master/calico) and Contrail. Apart from CNI, DC/OS also support the Docker networking standard CNM (Container network model) and can support virtual networking solutions for docker containers using providers that support CNM. 

DC/OS itself comes with a native virtual networking solution called DC/OS Overlay which supports both the CNI and CNM standards. 



# Virtual Network Service: DNS

The [Virtual Network Service](/1.11/overview/architecture/components/) maps names to IPs on your virtual network. You can use these DNS addresses to access your task:

* **Container IP:** Provides the container IP address: `<taskname>.<framework_name>.containerip.dcos.thisdcos.directory`
* **Auto IP:** Provides a best guess of a task's IP address: `<taskname>.<framework_name>.autoip.dcos.thisdcos.directory`. This is used during migrations to the overlay.

Terminology:
* `taskname`: The name of the task
* `framework_name`: The name of the framework, if you are unsure, it is likely `marathon`
