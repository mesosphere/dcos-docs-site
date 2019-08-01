---
layout: layout.pug
title: Azure Recommendations
navigationTitle:  Azure 
menuWeight: 25
excerpt: Recommendations for Azure
---

# Production-Ready Cluster Configurations

These recommendations are based on the operation of multiple DC/OS clusters over many years, scaling a mix of stateful and stateless services under a live production load. Your service mix may perform differently, but the principles and lessons discussed herein still apply.

## General Machine Configurations 
We recommend disabling swap on your VMs, which is typically the default for the Azure Linux images. We have found that using the ephemeral SSDs for swap (via WAAgent configuration) can conflict with the disk caching configuration of the `D` series of VMs. For other series of VMs, such as the L series, it may be possible to use the SSDs for swap and other purposes.

See the following section for details on disk configuration. Monitoring (such as Node Exporter with Prometheus) should be used to identify and alert when workloads are nearing Azure defined limits.

## Networking 
On Azure, raw network performance is roughly determined by VM size. VMs with 8 or more cores, such as `Standard_D8_v3`, are eligible for [Azure Accelerated Networking (SR-IOV)](https://docs.microsoft.com/en-us/azure/virtual-network/create-vm-accelerated-networking-cli). We have seen much lower latency and more available and stable bandwidth using SR-IOV, as opposed to relying on the Azure hypervisor vswitches. For example, in our testing, a `Standard_D16s_v3` without SR-IOV can push approximately 450MB/s of data between two VMs, while the same size machines can push closer to 1000MB/s of data using SR-IOV. Thus, SR-IOV should be employed when possible and you should benchmark your instance sizes (e.g. using [iperf3](https://github.com/esnet/iperf)) to make sure your network requirements are met.

Additionally, while multiple NICs are supported per virtual machine, the amount of bandwidth is per VM, not per NIC. Thus, while segmenting your network into control and data planes (or other networks) may be useful for organizational or security purposes, Linux level traffic shaping is required in order to achieve bandwidth control.

## Disk Configurations 
In order to achieve performant, reliable cluster operation on Azure, premium SSDs are recommended in particular disk configurations. Managed disks (MDs) are preferred over unmanaged disks (UMDs) to avoid storage account limitations: The Azure fabric will place the managed disks appropriately to meet the guaranteed SLAs. Storage account limitations for UMDs are documented [here](https://docs.microsoft.com/en-us/azure/storage/common/storage-performance-checklist).

On Azure, premium SSDs have a limited number of synchronous IOPs possible limited by the latency of the underlying disk fabric. Services such as etcd, Zookeeper and databases which utilize a write-ahead-log (WAL) are particularly sensitive to this I/O configuration. Thus, much of the system engineering described herein is focused on minimizing and/or eliminating I/O contention on the Azure disks. Additionally, exceeding the I/O allocation on a machine will result in throttling. You should study this article on [Azure VM Storage Performance and Throttling Demystified](https://blogs.technet.microsoft.com/xiangwu/2017/05/14/azure-vm-storage-performance-and-throttling-demystify/)
in detail to understand the theoretical background of the recommendations herein.

Given the need to separate synchronous from asynchronous I/O loads in order to maintain performance, we recommend the following disk mounting configuration:
- Masters:
    - / - P10
    - /var/lib/etcd - (for those running etcd on CoreOS) - P10
    - /var/log - P10
    - /var/lib/dcos/exhibitor - P10
- Public Agents:
    - / - P10
    - /var/log - P10
    - /var/lib/docker - P10
    - /var/lib/mesos/slave - P10
- Private Agents:
    - / - P10
    - /var/log - P10
    - /var/lib/docker - P10
    - /var/lib/mesos/slave - P20

It is certainly possible to run clusters with smaller and/or fewer disks, but for production use, the above configuration has proven to have substantial advantages for any non-trivial cluster sizes. Additionally, we recommend attaching appropriate premium SSDs to `/dcos/volume0 ... /dcos/volumeN` using Mesos MOUNT disk resources, which can then be dedicated to data intensive services without I/O contention. For data intensive services such as postgres or mysql, you should consider attaching LVM RAID stripes to those MOUNT resources to increase the possible transactions per second of the databases.

With respect to configuring the disk caches, the following general rules apply:
- OS disks should be set to `ReadWrite`.
- Data disks with a mixed or read heavy load (database bulk storage, etc) should be set to `ReadOnly`.
- Data disks with high sequential write loads (WAL disks) should be set to `None`.
