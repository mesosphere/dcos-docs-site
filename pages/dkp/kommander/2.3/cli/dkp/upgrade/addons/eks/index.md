---
layout: layout.pug
navigationTitle:  dkp upgrade addons eks
title:  dkp upgrade addons eks
menuWeight: 10
excerpt: Upgrade the core Addons in a EKS cluster
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp upgrade addons eks

Upgrade the core Addons in a EKS cluster

```
dkp upgrade addons eks [flags]
```

### Options

```
      --allow-missing-template-keys   If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats. (default true)
  -c, --cluster-name name             Name used to prefix the cluster and all the created resources.
      --dry-run                       Only print the objects that would be created, without creating them.
  -h, --help                          help for eks
      --kubeconfig string             Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.
  -n, --namespace string              If present, the namespace scope for this CLI request. (default "default")
  -o, --output string                 Output format. One of: json|yaml|name|go-template|go-template-file|template|templatefile|jsonpath|jsonpath-as-json|jsonpath-file.
      --show-managed-fields           If true, keep the managedFields when printing objects in JSON or YAML format.
      --template string               Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp upgrade addons](/dkp/kommander/2.3/cli/dkp/upgrade/addons/)	 - Upgrade the core Addons in a cluster, one of [aws, azure, eks, gcp, preprovisioned, vsphere]

