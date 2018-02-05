---
layout: layout.pug
navigationTitle:  Software Defined Networks
title: Software Defined Networks
menuWeight: 4
excerpt:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


DC/OS allows UCR and Docker containers to be launched on a wide variety of Software Defined Networks (SDN). 

DC/OS addss support for SDN providers by providing support for both the [Container Networking Interface (CNI)](https://github.com/containernetworking/cni) and the [Container Network Model (CNM)](https://github.com/docker/libnetwork/blob/master/docs/design.md) standards. DC/OS support CNI for UCR and CNM for Docker respectively. Examples of supported SDN providers on DC/OS are [Calico](https://github.com/dcos/examples/tree/master/calico) and Contrail. 

DC/OS comes with its own native virtual networking solution, called DC/OS Overlay, which supports both the CNI and CNM standards. 

# IPv6 support for Docker Containers
In DC/OS 1.11 supported for running Docker containers on IPv6 virtual networks has been introduced. DC/OS overlay, the pre-packaged SDN solution for DC/OS, has built in support for creating IPv6 networks for docker containers.
*NOTE: IPv6 support is currently available only for Docker containers and not for UCR containers.* 