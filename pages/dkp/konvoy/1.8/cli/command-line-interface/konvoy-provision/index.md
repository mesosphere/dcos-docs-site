---
layout: layout.pug
navigationTitle: konvoy provision
title: konvoy provision
menuWeight: 10
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
excerpt: Provision the nodes according to the provided Terraform variables file
---

## konvoy provision

Provision the nodes according to the provided Terraform variables file

```
konvoy provision [cluster name] [flags]
```

### Options

```
      --addons-repositories strings   A comma separated list of addons repositories with uri@version (default [https://github.com/mesosphere/kubeaddons-kommander@testing-1.20-1.4.3-rc.2,https://github.com/mesosphere/kubeaddons-dispatch@stable-1.20-1.4.6,https://github.com/mesosphere/kubernetes-base-addons@stable-1.20-4.3.0])
      --cluster-name string           name used to prefix the cluster and all the created resources (default "konvoy")
      --force-push                    force push the cluster state
      --force-reduce-control-plane    allow a reduction for the number of control plane nodes in a cluster
  -h, --help                          help for provision
      --mode string                   apply operating mode to configuration, supported modes [default, fips] (default "default")
      --plan-only                     show planned changes but don't provision
      --provisioner string            select a provisioner [aws|azure|gcp|vsphere|docker|none] (default "aws")
      --skip-provisioning-retry       do not retry the provisioning stage in case of errors
      --skip-state-upload             skip the upload of the state to Kubernetes cluster
      --verbose                       enable debug level logging
  -y, --yes                           run command without prompting
```

### SEE ALSO

* [konvoy](../)	 - Deploy and manage Kubernetes clusters

