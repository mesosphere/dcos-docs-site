---
layout: layout.pug
navigationTitle:  Virtual Infrastructure
title: Virtual Infrastructure
menuWeight: 1
excerpt: Operating DC/OS on Virtualized Infrastructure - Best Practices

---

The following is intended to provide operational guidance to customers running DC/OS clusters on virtualized infrastructure. While the guidance below references VMware vSphere concepts, similar settings should be applied to other hypervisors and virtualization technologies.

Please contact your customer success team for additional guidance.

# Performance and Capacity Guidelines

## Recommendations:

  - Minimize excess oversubscription of CPU and other resources on hosts
  - Keep CPU Ready Time* <5% on hosts where DC/OS master nodes are scheduled

<p class="message--note"><strong>NOTE: </strong>CPU ready time is a metric that records the amount of time a virtual machine is ready to use CPU but was unable to schedule time because all CPU resources are busy.</p>

# Time Keeping Guidelines

A DC/OS cluster requires robust time synchronization between nodes for optimal functionality. Please check that [NTP is enabled](https://docs.mesosphere.com/1.11/installing/production/system-requirements/#enable-ntp) on your DC/OS cluster to help ensure such robust synchronization.

## Recommendations:

  - Disable VMware Tools time synchronization and [configure ESXi hosts and guests to use a reliable NTP source](https://blogs.vmware.com/vsphere/2018/07/timekeeping-within-esxi.html)

  -  Add the following lines to the VM configuration file (.vmx) [to disable time synchronization](https://kb.vmware.com/s/article/1189):

  ```
  tools.syncTime = "0"
  time.synchronize.continue = "0"
  time.synchronize.restore = "0"
  time.synchronize.resume.disk = "0"
  time.synchronize.shrink = "0"
  time.synchronize.tools.startup = "0"
  time.synchronize.tools.enable = "0"
  time.synchronize.resume.host = "0"
  ```

 ### Optional

 - Consider disabling slew mode for NTP using `ntpd -x`.
 - Set `tinker panic` to `0` in the NTP configuration.

# vSphere DRS Settings

DRS ([Distributed Resource Scheduler](https://www.vmware.com/products/vsphere/drs-dpm.html)) is a vSphere feature that balances computing workloads with available resources in a vSphere cluster.

It is recommended that DRS automation is set to disabled or partially automated for master and agent nodes that have Zookeeper and etcd components scheduled on them. vSphere clusters under load can cause erratic behavior on Zookeeper ensembles or etcd clusters if multiple live migration actions are initiated. A live migration (vMotion) may issue a [“stop the world” pause](https://cormachogan.com/2015/04/28/when-and-why-do-we-stun-a-virtual-machine/) (also known as a “stun”) in order to complete the migration to another host.

Also note that Zookeeper and etcd might experience a failover event when live migration is triggered under certain conditions and care should be taken to not lose multiple members in an ensemble that violates the number of failures that can be tolerated. Accordingly, a Zookeeper ensemble of 3 can tolerate the failure of one server while an ensemble of 5 can tolerate the failure of two servers.

## Recommendations:

- Set DRS “Automation Level” to “Disabled” or “Partially Automated” for DC/OS master nodes and any nodes hosting Zookeeper or etcd instances.
- Create a VM-VM anti-affinity rule to prevent DC/OS master nodes from being scheduled on the same hosts.
- Consider creating anti-affinity rules/policies for other standalone Zookeeper or etcd nodes deployed on DC/OS to ensure a host (hypervisor) failure does not result in a service outage.
- Consider creating anti-affinity rules/policies for agent nodes if you have capacity available in your virtualization cluster or are operating a large DC/OS cluster.
- Factor in fault domain considerations such as racks, rows and datacenters to ensure resilient resource placement for virtual machines (and DC/OS nodes).

### Optional:

- Set “vSphere Latency Sensitivity” to “High” for DC/OS master nodes

# vSphere HA Settings

Hosts in a vSphere HA cluster are monitored and in the event of a failure, the virtual machines on a failed host are restarted on alternate hosts in the cluster.

## Recommendations:

- Set a higher restart priority for DC/OS master nodes in comparison to DC/OS agent nodes.
