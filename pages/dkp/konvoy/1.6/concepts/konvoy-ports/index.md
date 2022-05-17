---
layout: layout.pug
navigationTitle: Konvoy Port Usage
title: Konvoy Ports
menuWeight: 10
excerpt: Understanding configured ports for Konvoy deployment
beta: false
enterprise: false
---

This section describes pre-configured ports in your Konvoy deployment.

[Konvoy Components](../) listen on multiple ports on each node. These ports must be available for installation to succeed.

## Before you begin

-   To perform an installation, Ansible needs SSH connectivity on Port 22.

-   Detailed aspects of the networking components that come together to form a Konvoy networking stack are available in the [networking](../../networking) section.

-   You must use appropriate network mechanisms to prevent unauthorized access to cluster nodes. Refer to the documentation on [Access and Authentication](../../access-authentication).

-   By default, pods are non-isolated; they accept traffic from any source. Pods become isolated by having a NetworkPolicy that selects them. Once there is any NetworkPolicy in a namespace selecting a particular pod, that pod will reject any connections that are not allowed by any NetworkPolicy. Refer to the documentation for details on how Konvoy integrates Calico to support [Network Policies](../../networking/container-network-interface/network-policy).

-   During installation Konvoy can be configured to automatically add <code>[iptables](../../networking/add-fw-rules)</code> the rules outlined below.

## Control-plane nodes

<table>
  <tr>
   <td><strong>Port</strong>
   </td>
   <td><strong>Konvoy Component</strong>
   </td>
   <td><strong>Notes</strong>
   </td>
  </tr>
  <tr>
   <td>22
   </td>
   <td>Ansible
   </td>
   <td>ssh
   </td>
  </tr>
  <tr>
   <td>179
   </td>
   <td>calico-node
   </td>
   <td>BGP
   </td>
  </tr>
  <tr>
   <td>2379
   </td>
   <td>etcd
   </td>
   <td>client
   </td>
  </tr>
  <tr>
   <td>2380
   </td>
   <td>etcd
   </td>
   <td>peer
   </td>
  </tr>
  <tr>
   <td>6443
   </td>
   <td>kube-apiserver
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>9091
   </td>
   <td>calico-node
   </td>
   <td>felix metrics
   </td>
  </tr>
  <tr>
   <td>9092
   </td>
   <td>calico-node
   </td>
   <td>bird metrics
   </td>
  </tr>
  <tr>
   <td>9099
   </td>
   <td>calico-node
   </td>
   <td>felix liveliness
   </td>
  </tr>
  <tr>
   <td>10248
   </td>
   <td>kubelet
   </td>
   <td>health
   </td>
  </tr>
  <tr>
   <td>10249
   </td>
   <td>kube-proxy
   </td>
   <td>metrics
   </td>
  </tr>
  <tr>
   <td>10250
   </td>
   <td>kubelet
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>10256
   </td>
   <td>kube-proxy
   </td>
   <td>health
   </td>
  </tr>
  <tr>
   <td>10257
   </td>
   <td>kube-controller-manager
   </td>
   <td>secure port
   </td>
  </tr>
  <tr>
   <td>10259
   </td>
   <td>kube-scheduler
   </td>
   <td>secure port
   </td>
  </tr>
  <tr>
   <td>30000-32767
   </td>
   <td>Kubernetes NodePorts
   </td>
   <td>
   </td>
  </tr>
</table>

## Worker nodes

<table>
  <tr>
   <td><strong>Port</strong>
   </td>
   <td><strong>Konvoy Component</strong>
   </td>
   <td><strong>Notes</strong>
   </td>
  </tr>
  <tr>
   <td>22
   </td>
   <td>Ansible
   </td>
   <td>ssh
   </td>
  </tr>
  <tr>
   <td>179
   </td>
   <td>calico-node
   </td>
   <td>BGP
   </td>
  </tr>
  <tr>
   <td>5473
   </td>
   <td>calico-typha
   </td>
   <td>syncserver
   </td>
  </tr>
  <tr>
   <td>9091
   </td>
   <td>calico-node
   </td>
   <td>felix metrics
   </td>
  </tr>
  <tr>
   <td>9092
   </td>
   <td>calico-node
   </td>
   <td>bird metrics
   </td>
  </tr>
  <tr>
   <td>9093
   </td>
   <td>calico-typha
   </td>
   <td>metrics
   </td>
  </tr>
  <tr>
   <td>9099
   </td>
   <td>calico-node
   </td>
   <td>felix liveliness
   </td>
  </tr>
  <tr>
   <td>10248
   </td>
   <td>kubelet
   </td>
   <td>health
   </td>
  </tr>
  <tr>
   <td>10249
   </td>
   <td>kube-proxy
   </td>
   <td>metrics
   </td>
  </tr>
  <tr>
   <td>10250
   </td>
   <td>kubelet
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>10256
   </td>
   <td>kube-proxy
   </td>
   <td>health
   </td>
  </tr>
  <tr>
   <td>30000-32767
   </td>
   <td>Kubernetes NodePorts
   </td>
   <td>
   </td>
  </tr>
</table>
