---
layout: layout.pug
navigationTitle:  dkp update controlplane azure
title:  dkp update controlplane azure
menuWeight: 10
excerpt: Update a Konvoy cluster control plane in Azure
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp update controlplane azure

Update a Konvoy cluster control plane in Azure

```
dkp update controlplane azure [flags]
```

### Options

```
  -c, --cluster-name name           Name used to prefix the cluster and all the created resources.
  -h, --help                        help for azure
      --kubeconfig string           Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.
      --kubernetes-version string   Kubernetes version
      --machine-size string         Worker machine size (ex. 'Standard_D2s_v3')
  -n, --namespace string            If present, the namespace scope for this CLI request. (default "default")
      --use-context string          Use a specific context in a kubeconfig file.
      --wait                        If true, wait for operations to complete before returning. (default true)
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp update controlplane](/dkp/kommander/2.3/cli/dkp/update/controlplane/)	 - Update a Kubernetes cluster control plane, one of [aws, azure, eks, gcp, preprovisioned, vsphere]

