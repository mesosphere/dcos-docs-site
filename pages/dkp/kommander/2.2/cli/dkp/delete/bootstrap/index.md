---
layout: layout.pug
navigationTitle:  dkp delete bootstrap
title:  dkp delete bootstrap
menuWeight: 10
excerpt: Delete bootstrap cluster
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp delete bootstrap

Delete bootstrap cluster

```
dkp delete bootstrap [flags]
```

### Options

```
  -h, --help                       help for bootstrap
      --kind-cluster-name string   Kind cluster name for the bootstrap cluster
      --kubeconfig string          Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.
      --timeout duration           The length of time to wait before giving up. Zero means wait forever.
      --wait                       If true, wait for operations to complete before returning.
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp delete](/dkp/kommander/2.2/cli/dkp/delete/)	 - Delete one of [bootstrap (resources), cluster, nodepool]
* [dkp delete bootstrap controllers](/dkp/kommander/2.2/cli/dkp/delete/bootstrap/controllers/)	 - Delete management controllers
