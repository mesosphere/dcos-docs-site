---
layout: layout.pug
navigationTitle:  dkp prepare-to-adopt cluster preprovisioned
title:  dkp prepare-to-adopt cluster preprovisioned
menuWeight: 10
excerpt: Prepare to adopt an on-prem Konvoy v1 cluster
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp prepare-to-adopt cluster preprovisioned

Prepare to adopt an on-prem Konvoy v1 cluster

```
dkp prepare-to-adopt cluster preprovisioned [flags]
```

### Options

```
      --allow-missing-template-keys         If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.
      --dry-run                             Only print the objects that would be created, without creating them.
  -h, --help                                help for preprovisioned
      --konvoy-1-cluster-artifacts string   directory with artifacts from the konvoy 1 cluster (ca.{crt,key}, etcd-ca.{crt,key}, front-proxy-ca.{crt,key}, sa.{key,pub}, encryption-config.yaml)
      --konvoy-1-state-dir string           path to the konvoy1 directory containing the cluster.yaml, inventory.yaml, and state directory
      --kubeconfig string                   Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.
  -o, --output string                       Output format. One of: json|yaml|name|go-template|go-template-file|template|templatefile|jsonpath|jsonpath-as-json|jsonpath-file.
      --override-secret-name string         Name of the secret for any provided overrides on a preprovisioned cluster.All overrides defined at provisioning should be present in this secret.
      --show-managed-fields                 If true, keep the managedFields when printing objects in JSON or YAML format.
      --template string                     Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp prepare-to-adopt cluster](/dkp/kommander/2.2/cli/dkp/prepare-to-adopt/cluster/)	 - Prepare to adopt a Konvoy v1 cluster, one of [aws, preprovisioned]

