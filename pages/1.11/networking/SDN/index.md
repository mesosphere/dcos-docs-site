---
layout: layout.pug
navigationTitle:  Software Defined Networks
title: Software Defined Networks
menuWeight: 4
excerpt:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


DC/OS allows UCR and Docker containers to be launched on a wide variety of Software Defined Networks (SDN). DC/OS supports two container networking standards [Container Networking Interface (CNI)](https://github.com/containernetworking/cni) and [Container Network Model (CNM)](https://github.com/docker/libnetwork/blob/master/docs/design.md), for UCR and Docker respectively. DC/OS can thus run containers on any IP-based virtual networking solution that supports the CNI (for UCR) or the CNM standard (for Docker), examples being [Calico](https://github.com/dcos/examples/tree/master/calico) and Contrail. 

DC/OS itself comes with a native virtual networking solution called DC/OS Overlay which supports both the CNI and CNM standards. 

# IPv6 support for Docker Containers
In DC/OS 1.11 we have enabled IPv6 support for Docker containers. DC/OS overlay, the pre-packaged SDN solution for DC/OS, has built in support for creating IPv6 networks for docker containers.
*NOTE: IPv6 support is currently available only for Docker containers and not for UCR containers.* 