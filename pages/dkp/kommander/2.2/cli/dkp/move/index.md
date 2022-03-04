---
layout: layout.pug
navigationTitle:  dkp move
title:  dkp move
menuWeight: 10
excerpt: Move controllers and objects from one cluster to the other
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp move

Move controllers and objects from one cluster to the other

```
dkp move [flags]
```

### Options

```
      --from-context string    Context to be used within the from-cluster's kubeconfig file. If empty, current context will be used.
      --from-kubeconfig file   Path to the kubeconfig for pivot's source cluster. If unspecified, default discovery rules apply.
  -h, --help                   help for move
      --to-context string      Context to be used within the to-cluster's kubeconfig file. If empty, current context will be used.
      --to-kubeconfig file     Path to the kubeconfig for pivot's destination cluster
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp](/dkp/kommander/2.2/cli/dkp/)	 - 

