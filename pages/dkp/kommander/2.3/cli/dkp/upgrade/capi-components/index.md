---
layout: layout.pug
navigationTitle:  dkp upgrade capi-components
title:  dkp upgrade capi-components
menuWeight: 10
excerpt: Upgrade the CAPI components in the cluster
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp upgrade capi-components

Upgrade the CAPI components in the cluster

```
dkp upgrade capi-components [flags]
```

### Options

```
  -h, --help                help for capi-components
      --kubeconfig string   Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.
      --timeout duration    The length of time to wait before giving up. Zero means wait forever (e.g. 1s, 2m, 3h). (default 10m0s)
      --wait                If true, wait for operations to complete before returning. (default true)
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp upgrade](/dkp/kommander/2.3/cli/dkp/upgrade/)	 - Upgrade one of [addons, capi-components, catalogapp, kommander, workspace]

