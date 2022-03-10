---
layout: layout.pug
navigationTitle:  dkp attach cluster
title:  dkp attach cluster
menuWeight: 10
excerpt: Attach a cluster
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp attach cluster

Attach a cluster

```
dkp attach cluster -n NAME --attached-kubeconfig FILENAME [flags]
```

### Options

```
      --attached-kubeconfig string   Path of the kubeconfig file of the cluster to be attached
  -h, --help                         help for cluster
  -n, --name string                  Desired name of the attached cluster
  -w, --workspace string             Name of the workspace of the attached cluster
```

### Options inherited from parent commands

```
      --config string            Config file to use
      --context string           The name of the kubeconfig context to use
      --kubeconfig string        Path to the kubeconfig file to use for CLI requests.
      --request-timeout string   The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.
  -v, --verbose int              Output verbosity
```

### SEE ALSO

* [dkp attach](/dkp/kommander/2.2/cli/dkp/attach/)	 - Attach one of [cluster]

