---
layout: layout.pug
navigationTitle:  dkp update controlplane preprovisioned
title:  dkp update controlplane preprovisioned
menuWeight: 10
excerpt: Update a Konvoy cluster control plane in Preprovisioned
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp update controlplane preprovisioned

Update a Konvoy cluster control plane in Preprovisioned

```
dkp update controlplane preprovisioned [flags]
```

### Options

```
  -c, --cluster-name name           Name used to prefix the cluster and all the created resources.
  -h, --help                        help for preprovisioned
      --kubeconfig string           Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.
      --kubernetes-version string   Kubernetes version
  -n, --namespace string            If present, the namespace scope for this CLI request. (default "default")
      --use-context string          Use a specific context in a kubeconfig file.
      --wait                        If true, wait for operations to complete before returning. (default true)
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp update controlplane](/dkp/kommander/2.2/cli/dkp/update/controlplane/)	 - Update a Kubernetes cluster control plane, one of [aws, azure, preprovisioned]

