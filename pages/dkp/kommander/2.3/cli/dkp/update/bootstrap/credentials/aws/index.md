---
layout: layout.pug
navigationTitle:  dkp update bootstrap credentials aws
title:  dkp update bootstrap credentials aws
menuWeight: 10
excerpt: Update AWS credentials in the cluster and restart CAPA controllers
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp update bootstrap credentials aws

Update AWS credentials in the cluster and restart CAPA controllers

```
dkp update bootstrap credentials aws [flags]
```

### Options

```
      --context string      The name of the kubeconfig context to use
  -h, --help                help for aws
      --kubeconfig string   Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.
      --print-only          Print the credentials and exit the function. Without modifying cluster
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp update bootstrap credentials](/dkp/kommander/2.2/cli/dkp/update/bootstrap/credentials/)	 - Update credentials in the cluster

