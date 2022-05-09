---
layout: layout.pug
navigationTitle: Konvoy Port Usage
title: Konvoy Ports
menuWeight: 50
excerpt: Understanding configured ports for Konvoy deployment
beta: false
enterprise: false
---

This section describes ports used by the different Kubernetes components in your Konvoy cluster running on you pre-provisioned infrastructure.

## Control-plane nodes

| **Port**    | **Konvoy Component**     | **Notes**        |
| ----------- | ------------------------ | ---------------- |
| 22          | Ansible                  | ssh              |
| 179         | calico-node              | BGP              |
| 1338        | Containerd               | metrics          |
| 2379        | etcd                     | client           |
| 2380        | etcd                     | peer             |
| 6443        | kube-apiserver           |                  |
| 9091        | calico-node              | felix metrics    |
| 9092        | calico-node              | bird metrics     |
| 9099        | calico-node              | felix liveliness |
| 9100        | prometheus node-exporter | metrics          |
| 10248       | kubelet                  | health           |
| 10249       | kube-proxy               | metrics          |
| 10250       | kubelet                  |                  |
| 10256       | kube-proxy               | health           |
| 10257       | kube-controller-manager  | secure port      |
| 10259       | kube-scheduler           | secure port      |
| 30000-32767 | Kubernetes NodePorts     |                  |

## Worker nodes

| **Port**    | **Konvoy Component**     | **Notes**        |
| ----------- | ------------------------ | ---------------- |
| 22          | Ansible                  | ssh              |
| 179         | calico-node              | BGP              |
| 1338        | Containerd               | metrics          |
| 5473        | calico-typha             | syncserver       |
| 9091        | calico-node              | felix metrics    |
| 9092        | calico-node              | bird metrics     |
| 9093        | calico-typha             | metrics          |
| 9099        | calico-node              | felix liveliness |
| 9100        | prometheus node-exporter | metrics          |
| 9400        | NVIDIA GPU DCGM          | metrics          |
| 10248       | kubelet                  | health           |
| 10249       | kube-proxy               | metrics          |
| 10250       | kubelet                  |                  |
| 10256       | kube-proxy               | health           |
| 30000-32767 | Kubernetes NodePorts     |                  |
