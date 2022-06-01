---
layout: layout.pug
navigationTitle:  dkp delete nodepool
title:  dkp delete nodepool
menuWeight: 10
excerpt: Delete a nodepool for a given cluster
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp delete nodepool

Delete a nodepool for a given cluster

```
dkp delete nodepool name [flags]
```

### Options

```
  -c, --cluster-name name   Name used to prefix the cluster and all the created resources.
      --dry-run             Only print the objects that would be created, without creating them.
  -h, --help                help for nodepool
      --kubeconfig string   Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.
  -n, --namespace string    If present, the namespace scope for this CLI request. (default "default")
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp delete](/dkp/kommander/2.3/cli/dkp/delete/)	 - Delete one of [bootstrap, capi-components, chart, cluster, nodepool]

