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