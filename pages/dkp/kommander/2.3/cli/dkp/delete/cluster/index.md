---
layout: layout.pug
navigationTitle:  dkp delete cluster
title:  dkp delete cluster
menuWeight: 10
excerpt: Delete a Kubernetes cluster
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp delete cluster

Delete a Kubernetes cluster

```
dkp delete cluster [flags]
```

### Options

```
      --aws-service-endpoints string     Custom AWS service endpoints in a semi-colon separated format: ${SigningRegion1}:${ServiceID1}=${URL},${ServiceID2}=${URL};${SigningRegion2}...
  -c, --cluster-name name                Name used to prefix the cluster and all the created resources.
      --delete-kubernetes-resources      Delete Kubernetes resources on the cluster before deleting that cluster (Services with type LoadBalancer) (default true)
  -h, --help                             help for cluster
      --http-proxy string                HTTP proxy for CAPI controllers
      --https-proxy string               HTTPS proxy for CAPI controllers
      --kind-cluster-image string        Kind node image for the bootstrap cluster (default "mesosphere/konvoy-bootstrap:v0.0.0-dev.0")
      --kubeconfig string                Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.
  -n, --namespace string                 If present, the namespace scope for this CLI request. (default "default")
      --no-proxy strings                 No Proxy list for CAPI controllers (default [])
      --self-managed                     When set to true, the required prerequisites and resources are moved from the self managed cluster before deleting. When set to false, the resources are assumed installed in a management cluster.(default false)
      --timeout duration                 The length of time to wait before giving up. Zero means wait forever (e.g. 1s, 2m, 3h). (default 15m0s)
      --wait                             If true, wait for operations to complete before returning. (default true)
      --with-aws-bootstrap-credentials   Set true to use AWS bootstrap credentials from your environment. When false, the instance profile of the EC2 instance where the CAPA controller is scheduled on will be used instead.
      --with-gcp-bootstrap-credentials   Set true to use GCP bootstrap credentials from your environment. When false, the service account of the VM instance where the CAPG controller is scheduled on will be used instead.
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp delete](/dkp/kommander/2.3/cli/dkp/delete/)	 - Delete one of [bootstrap, capi-components, chart, cluster, nodepool]

