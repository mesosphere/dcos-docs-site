---
layout: layout.pug
navigationTitle:  dkp create bootstrap controllers
title:  dkp create bootstrap controllers
menuWeight: 10
excerpt: Create management controllers
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp create bootstrap controllers

Create management controllers

```
dkp create bootstrap controllers [flags]
```

### Options

```
      --aws-service-endpoints string          Custom AWS service endpoints in a semi-colon separated format: ${SigningRegion1}:${ServiceID1}=${URL},${ServiceID2}=${URL};${SigningRegion2}...
  -h, --help                                  help for controllers
      --kubeconfig string                     Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.
      --management-plane-http-proxy string    HTTP proxy for management plane
      --management-plane-https-proxy string   HTTPS proxy for management plane
      --management-plane-no-proxy strings     No Proxy list for management plane
      --timeout duration                      The length of time to wait before giving up. Zero means wait forever.
      --wait                                  If true, wait for operations to complete before returning.
      --with-aws-bootstrap-credentials        Set false to skip deploying AWS bootstrap credentials from your environment. The instance profiles of the node where the CAPA controller is scheduled on will be used instead.
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp create bootstrap](/dkp/kommander/2.2/cli/dkp/create/bootstrap/)	 - Create bootstrap cluster

