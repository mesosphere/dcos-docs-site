---
layout: layout.pug
navigationTitle:  dkp describe cluster
title:  dkp describe cluster
menuWeight: 10
excerpt: Describe a Kubernetes cluster status
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp describe cluster

Describe a Kubernetes cluster status

```
dkp describe cluster [flags]
```

### Options

```
  -c, --cluster-name name   Name used to prefix the cluster and all the created resources.
  -h, --help                help for cluster
      --kubeconfig string   Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.
  -n, --namespace string    If present, the namespace scope for this CLI request. (default "default")
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp describe](/dkp/kommander/2.2/cli/dkp/describe/)	 - Describe one of [cluster]

