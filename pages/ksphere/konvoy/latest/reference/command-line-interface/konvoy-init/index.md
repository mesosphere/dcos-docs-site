---
layout: layout.pug
navigationTitle: konvoy init
title: konvoy init
menuWeight: 10
notes: Automatically generated, DO NOT EDIT
enterprise: false
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
      --addons-repositories strings   A comma separated list of addons repositories with uri@version (default [https://github.com/mesosphere/kubeaddons-kommander@stable-1.16-1.1.0-beta.0,https://github.com/mesosphere/kubeaddons-dispatch@stable-1.16-1.0.1,https://github.com/mesosphere/kubernetes-base-addons@stable-1.16-1.5.0])
      --cluster-name string           Name used to prefix the cluster and all the created resources (default "konvoy")
  -h, --help                          help for init
      --provisioner string            select a provisoner [aws|azure|gcp|docker|none] (default "aws")
      --verbose                       enable debug level logging
```

### SEE ALSO

* [konvoy](../)	 - deploy and manage Kubernetes clusters

