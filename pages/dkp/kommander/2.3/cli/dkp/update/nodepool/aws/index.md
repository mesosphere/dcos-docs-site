---
layout: layout.pug
navigationTitle:  dkp update nodepool aws
title:  dkp update nodepool aws
menuWeight: 10
excerpt: Update a Konvoy cluster node pool in AWS
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp update nodepool aws

Update a Konvoy cluster node pool in AWS

```
dkp update nodepool aws [flags]
```

### Options

```
      --ami string                  AMI id to use for node pool machines
  -c, --cluster-name name           Name used to prefix the cluster and all the created resources.
  -h, --help                        help for aws
      --instance-type string        Instance type to use for node pool machines
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

* [dkp update nodepool](/dkp/kommander/2.3/cli/dkp/update/nodepool/)	 - Upate a Kubernetes cluster node pool, one of [aws, azure, eks, gcp, preprovisioned, vsphere]

