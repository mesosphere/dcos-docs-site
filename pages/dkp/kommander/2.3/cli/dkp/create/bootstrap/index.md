---
layout: layout.pug
navigationTitle:  dkp create bootstrap
title:  dkp create bootstrap
menuWeight: 10
excerpt: Create bootstrap cluster
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp create bootstrap

Create bootstrap cluster

```
dkp create bootstrap [flags]
```

### Options

```
      --aws-service-endpoints string     Custom AWS service endpoints in a semi-colon separated format: ${SigningRegion1}:${ServiceID1}=${URL},${ServiceID2}=${URL};${SigningRegion2}...
  -h, --help                             help for bootstrap
      --http-proxy string                HTTP proxy for CAPI controllers
      --https-proxy string               HTTPS proxy for CAPI controllers
      --kind-cluster-image string        Kind node image for the bootstrap cluster (default "mesosphere/konvoy-bootstrap:v0.0.0-dev.0")
      --kubeconfig string                Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.
      --no-proxy strings                 No Proxy list for CAPI controllers (default [])
      --timeout duration                 The length of time to wait before giving up. Zero means wait forever. (default 10m0s)
      --wait                             If true, wait for operations to complete before returning. (default true)
      --with-aws-bootstrap-credentials   Set true to use AWS bootstrap credentials from your environment. When false, the instance profile of the EC2 instance where the CAPA controller is scheduled on will be used instead.
      --with-gcp-bootstrap-credentials   Set true to use GCP bootstrap credentials from your environment. When false, the service account of the VM instance where the CAPG controller is scheduled on will be used instead.
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp create](/dkp/kommander/2.3/cli/dkp/create/)	 - Create one of [appdeployment, bootstrap, capi-components, chart-bundle, cluster, image-bundle, nodepool, workspace]

