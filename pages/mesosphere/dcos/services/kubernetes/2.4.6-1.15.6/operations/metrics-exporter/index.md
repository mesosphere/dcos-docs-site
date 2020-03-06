---
layout: layout.pug
navigationTitle: Metrics Exporter
title: Metrics Exporter
menuWeight: 5
excerpt: Planning and sizing clusters for increased performance
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->

# Integration with dcos-monitoring

To expose your Kubernetes cluster metrics and have them automatically ingested to the dcos-monitoring package you simply need to enable the Kubernetes metrics exporter task using the following setting:

```json
{
  "kubernetes": {
    "metrics_exporter": {
      "enabled": true
    }
  }
}
```

# Sizing Kubernetes cluster metrics exporter task

By default, the Kubernetes metrics exporter task requires 1 cpu, 1 GB of memory and 1 GB of disk and will expose metrics on port 9901. These values can be configured using the following settings:

```json
{
  "kubernetes": {
    "metrics_exporter": {
      "enabled": true,
      "cpus": 1,
      "mem": 1000,
      "disk": 1000,
      "port": 9901
    }
  }
}
```
