---
layout: layout.pug
navigationTitle: konvoy provision
title: konvoy provision
menuWeight: 10
notes: Automatically generated, DO NOT EDIT
enterprise: false
excerpt: Provision the nodes according to the provided Terraform variables file
---

## konvoy provision

Provision the nodes according to the provided Terraform variables file

### Synopsis

Provision the nodes according to the provided Terraform variables file

```
konvoy provision [cluster name] [flags]
```

### Options

```
      --addons-repositories strings   A comma separated list of addons repositories with uri@version (default [https://github.com/mesosphere/kubeaddons-kommander@stable-1.17-1.1.2,https://github.com/mesosphere/kubeaddons-dispatch@stable-1.17-1.2.2,https://github.com/mesosphere/kubeaddons-conductor@stable-1.17-1.0.0,https://github.com/mesosphere/kubernetes-base-addons@stable-1.17-2.2.0])
      --cluster-name string           Name used to prefix the cluster and all the created resources (default "konvoy")
      --force-reduce-control-plane    allow a reduction for the number of control plane nodes in a cluster
  -h, --help                          help for provision
      --plan-only                     show planned changes but don't provision
      --provisioner string            select a provisoner [aws|azure|gcp|docker|none] (default "aws")
      --skip-state-upload             skip the upload of the state to Kubernetes cluster
      --verbose                       enable debug level logging
  -y, --yes                           run command without prompting
```

### SEE ALSO

* [konvoy](../)	 - Deploy and manage Kubernetes clusters

