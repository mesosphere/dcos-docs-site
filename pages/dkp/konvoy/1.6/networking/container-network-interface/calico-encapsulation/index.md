---
layout: layout.pug
navigationTitle: Calico Encapsulation
title: Calico Encapsulation
menuWeight: 8
excerpt: Set Network Encapsulation type for Calico
beta: false
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

# Encapsulation

Networks route packets to IP address destinations through layer 2 whois discovery or through layer 3 routing techniques.
This allows unencapsulated pod and service traffic to reach the right host for the endpoint that is the ultimate destination.

Not all networks are able to route  pod and service IP addresses.
Some examples:

- public cloud environments where you don’t own the hardware
- AWS across VPC subnet boundaries
- environments where you cannot peer Calico over BGP to the underlay or easily configure static routes.

This is why Calico supports encapsulation, so you can send traffic over the network without requiring the underlying network to be aware of pod or service IP addresses.

## Configure Calico Encapsulation

Two ways of encapsulating networking traffic are supported: IP-to-IP and VXLAN. By default, IP-to-IP is enabled:

### IP-in-IP

IP-in-IP is an IP tunneling protocol that encapsulates one IP packet in another IP packet. An outer packet header is added with the tunnel entrypoint and the tunnel exit point. The calico implementation of this protocol uses BGP to determine the exit point making this protocol unusable on networks that don't pass BGP (eg Azure).

IP-in-IP is the default protocol and will be used if the encapsulation setting is omitted or is set to `ipip`:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  kubernetes:
    containerNetworking:
      calico:
        encapsulation: ipip
```

### VXLAN

VXLAN is a tunneling protocol that encapsulates layer 2 Ethernet frames in UDP packets, enabling you to create virtualized layer 2 subnets that span Layer 3 networks. It has a slightly larger header than IP-in-IP which creates a very slight reduction in performance over IP-in-IP.

To use VXLAN encapsulation, simply change the encapsulation setting of Calico:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  kubernetes:
    containerNetworking:
      calico:
        encapsulation: vxlan
```

For more information, see:

- [Calico Overlay Networking](https://docs.projectcalico.org/networking/vxlan-ipip)
- [IP-in-IP RFC 2003](https://tools.ietf.org/html/rfc2003)
- [VXLAN RFC 7348](https://tools.ietf.org/html/rfc7348)
