---
layout: layout.pug
navigationTitle: konvoy init
title: konvoy init
menuWeight: 10
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: true
excerpt: Create the provision and deploy configuration with default values
---

## konvoy init

Create the provision and deploy configuration with default values

### Synopsis

Create the provision and deploy configuration with default values

```
konvoy init [flags]
```

### Options

```
      --addons-repositories strings   A comma separated list of addons repositories with uri@version (default [https://github.com/mesosphere/kubeaddons-kommander@testing-1.17-1.2.0-beta.1,https://github.com/mesosphere/kubeaddons-dispatch@stable-1.17-1.2.2,https://github.com/mesosphere/kubeaddons-conductor@stable-1.17-1.0.0,https://github.com/mesosphere/kubernetes-base-addons@testing-1.17-2.4.0])
      --cluster-name string           name used to prefix the cluster and all the created resources (default "konvoy")
  -h, --help                          help for init
      --provisioner string            select a provisioner [aws|azure|gcp|docker|none] (default "aws")
      --verbose                       enable debug level logging
```

### SEE ALSO

* [konvoy](../)	 - Deploy and manage Kubernetes clusters

