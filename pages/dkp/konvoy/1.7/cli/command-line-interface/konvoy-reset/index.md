---
layout: layout.pug
navigationTitle: konvoy reset
title: konvoy reset
menuWeight: 10
notes: Automatically generated, DO NOT EDIT
enterprise: false
excerpt: Remove any modifications to the nodes made by the installer, and cleanup file artifacts
---

## konvoy reset

Remove any modifications to the nodes made by the installer, and cleanup file artifacts

### Synopsis

Remove any modifications to the nodes made by the installer, and cleanup file artifacts

```
konvoy reset [flags]
```

### Options

```
      --clean-local-volumes   remove any data in local volumes
      --cluster-name string   name used to prefix the cluster and all the created resources (default "konvoy")
  -h, --help                  help for reset
      --verbose               enable debug level logging
  -y, --yes                   run command without prompting
```

### SEE ALSO

* [konvoy](../)	 - Deploy and manage Kubernetes clusters

