---
layout: layout.pug
navigationTitle:  Deployment Best Practices
title: Deployment Best Practices
menuWeight: 30
excerpt: Best practices for production deployment
featureMaturity:
enterprise: false
model: ../../data.yml
render: mustache
---

# Configuration Best Practices for Production

- Increase the number of TCP socket ports available. This is particularly important if the flow will be setting up and tearing down a large number of sockets in small period of time.

           sudo sysctl -w net.ipv4.ip_local_port_range="10000 65000"

- Tell Linux you never want DC/OS {{model.techName }} to swap. Swapping is fantastic for some applications. It is not good for something like DC/OS {{model.techName }} that always wants to be running.

To set swapping off you can edit `/etc/sysctl.conf` to add the following line

           vm.swappiness = 0

For the partitions handling the various DC/OS {{model.techName }} repos turn off things like `atime`. Doing so can cause a surprising bump in throughput. Edit the `/etc/fstab` file and for the partition(s) of interest add the `noatime` option.

## Hardware Sizing Recommendations

The following image shows the recommended hardware for a DC/OS {{model.techName }} production installation:

[<img src="../img/HardwareRecommendation.png" alt="Hardware Recommendation" width="700"/>](../img/HardwareRecommendation.png)

Figure 1. Hardware sizing recommendations for DC/OS {{model.techName }}

## Disk Recommendations

DC/OS {{model.techName }} performs best when using disks with fast read and write patterns.

We recommend the following:

- Always prefer locally-attached storage. Remote storage adds points of failure, add latency/overhead to block requests and are more complicated to troubleshoot.  
- For better performance, use solid-state disks vs. spinning disks, or allocate more memory to cache more data, reducing the use of disks.
