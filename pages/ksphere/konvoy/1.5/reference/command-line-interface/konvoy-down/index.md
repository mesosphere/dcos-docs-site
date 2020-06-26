---
layout: layout.pug
navigationTitle: konvoy down
title: konvoy down
menuWeight: 10
notes: Automatically generated, DO NOT EDIT
enterprise: false
excerpt: Destroy the Kubernetes cluster
---

## konvoy down

Destroy the Kubernetes cluster

### Synopsis

Destroy the Kubernetes cluster

```
konvoy down [flags]
```

### Options

```
  -h, --help                    help for down
      --provisioner string      select a provisoner [aws|azure|gcp|docker|none] (default "aws")
      --skip-clean-kubernetes   skip cleaning Kubernetes resources before deleting provisioner resources
      --verbose                 enable debug level logging
  -y, --yes                     run command without prompting
```

### SEE ALSO

* [konvoy](../)	 - deploy and manage Kubernetes clusters

