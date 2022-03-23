---
layout: layout.pug
navigationTitle:  dkp upgrade catalogapp
title:  dkp upgrade catalogapp
menuWeight: 10
excerpt: Upgrade a Catalog Application to a newer version
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp upgrade catalogapp

Upgrade a Catalog Application to a newer version

```
dkp upgrade catalogapp CATALOGAPP_NAME --to-version VERSION [--workspace WORKSPACE | --project PROJECT] [flags]
```

### Options

```
      --config string            Config file to use (default "/root/.kommander/config")
      --context string           The name of the kubeconfig context to use
  -h, --help                     help for catalogapp
      --kubeconfig string        Path to the kubeconfig file to use for CLI requests.
      --project string           Name of the Project to upgrade the Catalog App in
      --request-timeout string   The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.
      --to-version string        Version the Catalog App should be upgraded to
  -w, --workspace string         Name of the Workspace to upgrade the Catalog App in
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp upgrade](/dkp/kommander/2.2/cli/dkp/upgrade/)	 - Upgrade one of [capi-components, catalogapp, kommander]

