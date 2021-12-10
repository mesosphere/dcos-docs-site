---
layout: layout.pug
navigationTitle: konvoy init
title: konvoy init
menuWeight: 10
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
excerpt: Create the provision and deploy configuration with default values
---

## konvoy init

Create the provision and deploy configuration with default values

```
konvoy init [flags]
```

### Options

```
      --addons-repositories strings   A comma separated list of addons repositories with uri@version (default [https://github.com/mesosphere/kubeaddons-kommander@testing-1.20-1.4.3-rc.2,https://github.com/mesosphere/kubeaddons-dispatch@stable-1.20-1.4.6,https://github.com/mesosphere/kubernetes-base-addons@stable-1.20-4.3.0])
      --cluster-name string           name used to prefix the cluster and all the created resources (default "konvoy")
  -h, --help                          help for init
      --mode string                   apply operating mode to configuration, supported modes [default, fips] (default "default")
      --provisioner string            select a provisioner [aws|azure|gcp|vsphere|docker|none] (default "aws")
      --verbose                       enable debug level logging
```

### SEE ALSO

* [konvoy](../)	 - Deploy and manage Kubernetes clusters
