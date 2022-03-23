---
layout: layout.pug
navigationTitle:  dkp create capi-components
title:  dkp create capi-components
menuWeight: 10
excerpt: Create the CAPI components in the cluster
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp create capi-components

Create the CAPI components in the cluster

```
dkp create capi-components [flags]
```

### Options

```
      --aws-service-endpoints string     Custom AWS service endpoints in a semi-colon separated format: ${SigningRegion1}:${ServiceID1}=${URL},${ServiceID2}=${URL};${SigningRegion2}...
  -h, --help                             help for capi-components
      --http-proxy string                HTTP proxy for CAPI controllers
      --https-proxy string               HTTPS proxy for CAPI controllers
      --kubeconfig string                Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.
      --no-proxy strings                 No Proxy list for CAPI controllers (default [])
      --timeout duration                 The length of time to wait before giving up. Zero means wait forever. (default 10m0s)
      --wait                             If true, wait for operations to complete before returning. (default true)
      --with-aws-bootstrap-credentials   Set false to skip deploying AWS bootstrap credentials from your environment. The instance profiles of the node where the CAPA controller is scheduled on will be used instead. (default true)
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp create](/dkp/kommander/2.2/cli/dkp/create/)	 - Create one of [appdeployment, bootstrap, capi-components, chart-bundle, cluster, image-bundle, nodepool, workspace]

