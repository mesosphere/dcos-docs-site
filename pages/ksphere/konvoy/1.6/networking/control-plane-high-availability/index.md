---
layout: layout.pug
navigationTitle: Control plane High Availability
title: Control plane High Availability
menuWeight: 8
excerpt: Make Konvoy control plane nodes highly available
beta: true
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

Konvoy ships with a highly available control plane, in case of a multi-master Kubernetes deployment.

## Cloud

High availability is provided through the cloud provider's load balancer.
The load balancer takes care of healthchecks and distributing traffic between the control plane nodes.
It is provisioned by Konvoy. Two config options are available, for all supported cloud providers (below is an example for AWS):

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  aws:
    elb:
      apiServerPort: 6443
      internal: false
```

`apiServerPort` defines the port on which the cloud provider's load balancer should listen for incomming requests.

`internal` defines whether the created load balancer should be available only from within the Virtual Private Cloud where the cluster resides or should it also be reachable from public Internet.

## On-premises

In on-premises deployments, Konvoy ships with [Keepalived][keepalived].
Keepalived provides two main functionalities - high availability and load balancing.
It uses the [Virtual Router Redundancy Protocol][vrrp] (VRRP) to provide high availability.
VRRP allows you to assign a virtual IP (VIP) to participating machines, where it is active only on one of the machines.

VRRP provides high availability by ensuring that virtual IP is active as long as one of the participating machines is active.
Konvoy uses Keepalived to maintain high availability of the control plane.

To use `Keepalived`:

1. Identify and reserve a virtual IP (VIP) address in your networking infrastructure.

1. Configure your networking infrastructure so that the reserved virtual IP address is reachable:

-   from all hosts specified in the inventory file.
-   from the computer that is used to deploy Kubernetes.

The configuration is complete if the virtual IP address is in the same subnet as the rest of the cluster nodes.
If the address is in a different subnet, you may need to configure appropriate routes to ensure connectivity with the virtual IP address.
If the virtual IP address shares an interface with the primary IP address of the interface, you must disable any IP or MAC spoofing from the infrastructure firewall.

The following example illustrates the Konvoy configuration to use if the reserved virtual IP address is `10.0.50.20`:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  kubernetes:
    controlPlane:
      controlPlaneEndpointOverride: "10.0.50.20:6443"
      keepalived:
        interface: ens20f0 # optional
        vrid: 51           # optional
```

The IP address specified in `spec.kubernetes.controlPlane.controlPlaneEndpointOverride` is used for the Keepalived VIP.
This value is optional if it is already specified in `inventory.yaml` as part of `all.vars.control_plane_endpoint`.
You can set `spec.kubernetes.controlPlane.keepalived.interface` to specify the network interface for the Keepalived VIP.
This field is optional. If not set, Konvoy automatically detects the network interface to use based on the route to the VIP.

You can also set `spec.kubernetes.controlPlane.keepalived.vrid` to specify the [Virtual Router ID][keepalived_conf] used by Keepalived.
This field is optional. If not set, Konvoy randomly picks a Virtual Router ID for you.

Keepalived is enabled by default for on-premises deployment. You can disable it by removing `spec.kubernetes.controlPlane.keepalived` from the `cluster.yaml`.
This is done where there is an on-premises load balancer which could be used to maintain high availability of the control plane.

If you are not setting any optional values, set `spec.kubernetes.controlPlane.keepalived: {}` to enable the default values.

[keepalived]: https://www.keepalived.org/doc/introduction.html
[keepalived_conf]: https://www.keepalived.org/doc/configuration_synopsis.html
[vrrp]: https://en.wikipedia.org/wiki/Virtual_Router_Redundancy_Protocol
