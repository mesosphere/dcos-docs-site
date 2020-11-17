---
layout: layout.pug
navigationTitle: konvoy deploy addons
title: konvoy deploy addons
menuWeight: 10
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
excerpt: Deploy Kubernetes addons
---

## konvoy deploy addons

Deploy Kubernetes addons

### Synopsis

Deploy Kubernetes addons

```
konvoy deploy addons [flags]
```

### Options

```
      --cluster-name string        name used to prefix the cluster and all the created resources (default "konvoy")
      --force-push                 force push the cluster state
  -h, --help                       help for addons
      --skip-credentials-display   skip displaying the admin credentials after the install
      --skip-state-upload          skip the upload of the state to Kubernetes cluster
      --verbose                    enable debug level logging
  -y, --yes                        run command without prompting
```

### SEE ALSO

* [konvoy deploy](../)	 - Deploy a fully functioning Kubernetes cluster and addons

