---
layout: layout.pug
navigationTitle:  dkp move capi-resources
title:  dkp move capi-resources
menuWeight: 10
excerpt: Move controllers and objects from one cluster to the other
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp move capi-resources

Move controllers and objects from one cluster to the other

```
dkp move capi-resources [flags]
```

### Options

```
      --from-context string    Context to be used within the from-cluster's kubeconfig file. If empty, current context will be used.
      --from-kubeconfig file   Path to the kubeconfig for pivot's source cluster. If unspecified, default discovery rules apply.
  -h, --help                   help for capi-resources
      --to-context string      Context to be used within the to-cluster's kubeconfig file. If empty, current context will be used.
      --to-kubeconfig file     Path to the kubeconfig for pivot's destination cluster
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp move](/dkp/kommander/2.3/cli/dkp/move/)	 - Move one of [capi-resources]

