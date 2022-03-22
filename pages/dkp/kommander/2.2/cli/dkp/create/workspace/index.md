---
layout: layout.pug
navigationTitle:  dkp create workspace
title:  dkp create workspace
menuWeight: 10
excerpt: Create a Workspace
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp create workspace

Create a Workspace

```
dkp create workspace WORKSPACE_NAME [flags]
```

### Options

```
      --config string            Config file to use (default "/root/.kommander/config")
      --context string           The name of the kubeconfig context to use
      --dry-run                  Export in YAML format to stdout
  -h, --help                     help for workspace
      --kubeconfig string        Path to the kubeconfig file to use for CLI requests.
  -n, --namespace string         Name of the Namespace to create for the workspace
  -o, --output string            Output format. One of: yaml|json (default "yaml")
      --request-timeout string   The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp create](/dkp/kommander/2.2/cli/dkp/create/)	 - Create one of [appdeployment, bootstrap, capi-components, cluster, image-bundle, nodepool, workspace]

