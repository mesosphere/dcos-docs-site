---
layout: layout.pug
navigationTitle:  External Storage
title: External Storage
menuWeight: 20
excerpt: Using external storage in DC/OS
render: mustache
model: /mesosphere/dcos/2.2/data.yml
beta: false
enterprise: false
---

"External storage" is any type of storage which may be mounted from multiple nodes in a cluster. DC/OS provides two methods for using external volumes with your workloads:

# Container Storage Interface

The [Container Storage Interface](https://github.com/container-storage-interface/spec/blob/master/spec.md), or CSI, is a specification which is currently being widely adopted by storage vendors in the cloud-native community. Each vendor produces a "driver" which runs on each agent and interacts with the storage backend to attach volumes to the node. Because this specification has gained acceptance as the standard method for interacting with storage providers in a datacenter environment, the vendor-specific CSI driver implementations should be developed and well-supported long into the future.

Currently, the drawback of using CSI volumes in DC/OS is that they must be pre-provisioned manually; we do not yet provide automatic, dynamic volume provisioning. While this will be possible in the future, if you require that volumes be automatically created for services at launch time right now, we recommend that you use DVDI volumes, detailed below.

For more information, see the instructions for [using CSI volumes with Marathon](/mesosphere/dcos/2.2/storage/csi/).

# Docker Volume Driver Isolator

The Docker Volume Driver Isolator (DVDI) is a component in DC/OS which allows you to use external volumes with your tasks which are mounted by Docker Volume Drivers. The Docker Volume Driver interface is not widely-adopted, and likely will not be supported too long into the future.

For more information, see the instructions for [using DVDI volumes with Marathon](/mesosphere/dcos/2.2/storage/dvdi/).
