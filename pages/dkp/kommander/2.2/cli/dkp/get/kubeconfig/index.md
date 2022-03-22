---
layout: layout.pug
navigationTitle:  dkp get kubeconfig
title:  dkp get kubeconfig
menuWeight: 10
excerpt: Retrieve cluster kubeconfig and modify local kubeconfig file
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp get kubeconfig

Retrieve cluster kubeconfig and modify local kubeconfig file

```
dkp get kubeconfig [flags]
```

### Options

```
      --cluster string      Kommander Cluster to get kubeconfig for
  -c, --cluster-name name   Name used to prefix the cluster and all the created resources.
  -h, --help                help for kubeconfig
      --kubeconfig string   Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.
  -n, --namespace string    If present, the namespace scope for this CLI request. (default "default")
  -w, --workspace string    Name of the workspace to show clusters from
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp get](/dkp/kommander/2.2/cli/dkp/get/)	 - Get one of [appdeployments, clusters, kubeconfig, nodepools, workspaces]

