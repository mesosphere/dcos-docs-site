---
layout: layout.pug
navigationTitle:  dkp adopt cluster aws
title:  dkp adopt cluster aws
menuWeight: 10
excerpt: Prepare to adopt an AWS Konvoy v1 cluster
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp adopt cluster aws

Prepare to adopt an AWS Konvoy v1 cluster

```
dkp adopt cluster aws [flags]
```

### Options

```
  -h, --help                        help for aws
      --konvoy-1-state-dir string   path to the konvoy1 directory containing the cluster.yaml, inventory.yaml, and state directory
      --kubeconfig string           Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp adopt cluster](/dkp/kommander/2.2/cli/dkp/adopt/cluster/)	 - Adopt a Konvoy v1 cluster, one of [aws, preprovisioned]

