---
layout: layout.pug
navigationTitle: Changed Node IP
title: Changed Node IP
menuWeight: 12
excerpt: Updating inventory.yaml to restore access to nodes
beta: false
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

## Cloud Providers

Konvoy uses public IPs to communicate with the nodes. Konvoy sets `ansible_host` in `inventory.yaml`, to a DNS name. Cloud providers DNS names on the node's public IP. When you restart a node, it will get a new public IP assigned to it. To refresh the IP information in the `inventory.yaml` you need to run `konvoy up` or `konvoy provision`.

## On-Premises

In on-premises deployments you will need to update the `inventory.yaml` manually. Please refer to the [on-premises documentation][on-premises].

[on-premises]: ../../../install/install-onprem#specifying-ip-addresses-and-host-names
