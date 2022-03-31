---
layout: layout.pug
navigationTitle:  dkp move
title:  dkp move
menuWeight: 10
excerpt: Move one of [capi-resources]
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp move

Move one of [capi-resources]

### Synopsis

Command "move" is deprecated, use "dkp move capi-resources" instead
Move one of [capi-resources]

```
dkp move [flags]
```

### Options

```
      --from-context string    Context to be used within the from-cluster's kubeconfig file. If empty, current context will be used. (DEPRECATED: use "dkp move capi-resources" instead)
      --from-kubeconfig file   Path to the kubeconfig for pivot's source cluster. If unspecified, default discovery rules apply. (DEPRECATED: use "dkp move capi-resources" instead)
  -h, --help                   help for move
      --to-context string      Context to be used within the to-cluster's kubeconfig file. If empty, current context will be used. (DEPRECATED: use "dkp move capi-resources" instead)
      --to-kubeconfig file     Path to the kubeconfig for pivot's destination cluster (DEPRECATED: use "dkp move capi-resources" instead)
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp](/dkp/kommander/2.2/cli/dkp/)	 - 
* [dkp move capi-resources](/dkp/kommander/2.2/cli/dkp/move/capi-resources/)	 - Move controllers and objects from one cluster to the other

