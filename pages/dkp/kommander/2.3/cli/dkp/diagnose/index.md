---
layout: layout.pug
navigationTitle:  dkp diagnose
title:  dkp diagnose
menuWeight: 10
excerpt: Generate a support bundle
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp diagnose

Generate a support bundle

### Synopsis

A support bundle is an archive of files, output, metrics and state
from a server that can be used to assist when troubleshooting a Kubernetes cluster.

```
dkp diagnose [flags]
```

### Options

```
      --allow-insecure-connections     When set, do not verify TLS certs when retrieving spec and reporting results
      --as string                      Username to impersonate for the operation. User could be a regular user or a service account in a namespace.
      --as-group stringArray           Group to impersonate for the operation, this flag can be repeated to specify multiple groups. (default [])
      --as-uid string                  UID to impersonate for the operation.
      --bootstrap-kubeconfig string    Path to the kubeconfig file to use for requests towards an additional bootstrap cluster
      --cache-dir string               Default cache directory (default "/root/.kube/cache")
      --certificate-authority string   Path to a cert file for the certificate authority
      --client-certificate string      Path to a client certificate file for TLS
      --client-key string              Path to a client key file for TLS
      --cluster string                 The name of the kubeconfig cluster to use
      --collect-without-permissions    Always generate a support bundle, even if it some require additional permissions (default true)
      --context string                 The name of the kubeconfig context to use
  -h, --help                           help for diagnose
      --insecure-skip-tls-verify       If true, the server's certificate will not be checked for validity. This will make your HTTPS connections insecure
      --kubeconfig string              Path to the kubeconfig file to use for CLI requests.
  -n, --namespace string               If present, the namespace scope for this CLI request
      --redactors strings              Names of the additional redactors to use (default [])
      --request-timeout string         The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.
  -s, --server string                  The address and port of the Kubernetes API server
      --since string                   Force pod logs collectors to return logs newer than a relative duration like 5s, 2m, or 3h.
      --since-time string              Force pod logs collectors to return logs after a specific date (RFC3339)
      --tls-server-name string         Server name to use for server certificate validation. If it is not provided, the hostname used to contact the server is used
      --token string                   Bearer token for authentication to the API server
      --user string                    The name of the kubeconfig user to use
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp](/dkp/kommander/2.3/cli/dkp/)	 - 
* [dkp diagnose default-config](/dkp/kommander/2.3/cli/dkp/diagnose/default-config/)	 - Prints the default configuration of the diagnostics bundle collectors
* [dkp diagnose ssh](/dkp/kommander/2.3/cli/dkp/diagnose/ssh/)	 - Collect node-level diagnostics data over SSH

