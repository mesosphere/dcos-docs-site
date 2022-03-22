---
layout: layout.pug
navigationTitle:  dkp detach cluster
title:  dkp detach cluster
menuWeight: 10
excerpt: Detach a cluster
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp detach cluster

Detach a cluster

```
dkp detach cluster CLUSTER_NAME [flags]
```

### Options

```
  -h, --help               help for cluster
  -w, --workspace string   Name of the workspace of the attached cluster
```

### Options inherited from parent commands

```
      --config string            Config file to use (default "/root/.kommander/config")
      --context string           The name of the kubeconfig context to use
      --kubeconfig string        Path to the kubeconfig file to use for CLI requests.
      --request-timeout string   The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.
  -v, --verbose int              Output verbosity (default -1)
```

### SEE ALSO

* [dkp detach](/dkp/kommander/2.2/cli/dkp/detach/)	 - Detach one of [cluster]

