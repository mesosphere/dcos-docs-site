---
layout: layout.pug
navigationTitle: Configure MetalLB
title: Configure MetalLB
menuWeight: 78
excerpt: Create a MetalLB configmap for your vSphere infrastructure.
beta: false
enterprise: false
---

Choose one of the following two protocols you want to use to announce service IPs, either Layer 2 or BGP configurations.

## Layer 2 configuration

Layer 2 mode is the simplest to configure: in many cases, you don’t need any protocol-specific configuration, only IP addresses.

Layer 2 mode does not require the IPs to be bound to the network interfaces of your worker nodes. It works by responding to ARP requests on your local network directly, to give the machine’s MAC address to clients.

For example, the following configuration gives MetalLB control over IPs from 192.168.1.240 to 192.168.1.250, and configures Layer 2 mode:

<p class="message--note"><strong>NOTE:</strong>The following values are generic, enter your specific values into the fields where applicable.</p>

```sh
cat << EOF > metallb-conf.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: metallb-system
  name: config
data:
  config: |
    address-pools:
    - name: default
      protocol: layer2
      addresses:
      - 192.168.1.240-192.168.1.250
EOF
```

When complete, run the following `kubectl` command.

```sh
kubectl apply -f metallb-conf.yaml
```

## BGP Configuration

For a basic configuration featuring one BGP router and one IP address range, you need 4 pieces of information:

* The router IP address that MetalLB should connect to,
* The router’s AS number,
* The AS number MetalLB should use,
* An IP address range expressed as a CIDR prefix.

As an example, if you want to give MetalLB the range 192.168.10.0/24 and AS number 64500, and connect it to a router at 10.0.0.1 with AS number 64501, your configuration will look like:

<p class="message--note"><strong>NOTE:</strong>The following values are generic, enter your specific values into the fields where applicable.</p>

```sh
cat << EOF > metallb-conf.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: metallb-system
  name: config
data:
  config: |
    peers:
    - peer-address: 10.0.0.1
      peer-asn: 64501
      my-asn: 64500
    address-pools:
    - name: default
      protocol: bgp
      addresses:
      - 192.168.10.0/24
EOF
```

When complete, run the following `kubectl` command:

```sh
kubectl apply -f metallb-conf.yaml
```
