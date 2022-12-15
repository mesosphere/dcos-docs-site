---
layout: layout.pug
navigationTitle:  dkp update controlplane vsphere
title:  dkp update controlplane vsphere
menuWeight: 10
excerpt: Update a Konvoy cluster control plane in vSphere
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp update controlplane vsphere

Update a Konvoy cluster control plane in vSphere

```
dkp update controlplane vsphere [flags]
```

### Options

```
  -c, --cluster-name name           Name used to prefix the cluster and all the created resources.
      --cpus int                    The number of virtual processors in a virtual machine.
      --disk-size int               The size of a virtual machine's disk, in GB.
  -h, --help                        help for vsphere
      --kubeconfig string           Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.
      --kubernetes-version string   Kubernetes version
      --memory int                  The size of a virtual machine's memory, in GB.
  -n, --namespace string            If present, the namespace scope for this CLI request. (default "default")
      --use-context string          Use a specific context in a kubeconfig file.
      --vm-template string          The virtual machine template to use for a virtual machine.
      --wait                        If true, wait for operations to complete before returning. (default true)
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp update controlplane](/dkp/kommander/2.3/cli/dkp/update/controlplane/)	 - Update a Kubernetes cluster control plane, one of [aws, azure, eks, gcp, preprovisioned, vsphere]

