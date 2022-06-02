---
layout: layout.pug
navigationTitle:  dkp scale nodepool
title:  dkp scale nodepool
menuWeight: 10
excerpt: Scale a nodepool of a given cluster to the number of replicas
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp scale nodepool

Scale a nodepool of a given cluster to the number of replicas

```
dkp scale nodepool name [flags]
```

### Options

```
  -c, --cluster-name name         Name used to prefix the cluster and all the created resources.
  -h, --help                      help for nodepool
      --kubeconfig string         Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.
  -n, --namespace string          If present, the namespace scope for this CLI request. (default "default")
      --nodes-to-delete strings   A list of node names to mark for deletion when scaling down a node pool. If left empty, the nodes to delete will be selected at random. (default [])
      --replicas int              The new desired number of replicas.
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp scale](/dkp/kommander/2.3/cli/dkp/scale/)	 - Scale one of [nodepool]

