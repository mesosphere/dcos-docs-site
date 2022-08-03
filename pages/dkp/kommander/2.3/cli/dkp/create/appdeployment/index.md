---
layout: layout.pug
navigationTitle:  dkp create appdeployment
title:  dkp create appdeployment
menuWeight: 10
excerpt: Create an AppDeployment
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp create appdeployment

Create an AppDeployment

### Synopsis

Creates an AppDeployment in a workspace or project.

When [--clusters C1,C2..] is not specified, it targets all existing clusters in the specified workspace or project.



```
dkp create appdeployment APPDEPLOYMENT_NAME --app NAME [flags]
```

### Options

```
      --add-cluster-config-overrides strings   Comma-separated list of mappings of kommanderCluster name to cluster configuration override ConfigMap name to apply to the targeting clusters. (e.g., cluster-1:override-1-cm,cluster-2:override-2-cm)(only valid for dkp clusters version 2.3.x and up) (default [])
  -a, --app string                             Name of the App to deploy
      --clusters strings                       List of names of kommanderClusters to select for the command. (e.g., cluster-1,cluster-2)(only valid for dkp clusters version 2.3.x and up) (default [])
      --config string                          Config file to use (default "/root/.kommander/config")
  -c, --config-overrides string                Name of the ConfigMap used to override default configuration of the App
      --context string                         The name of the kubeconfig context to use
      --dry-run                                Export in YAML format to stdout
  -h, --help                                   help for appdeployment
      --kubeconfig string                      Path to the kubeconfig file to use for CLI requests.
  -o, --output string                          Output format. One of: yaml|json (default "yaml")
  -p, --project string                         Name of the project to create the AppDeployment in. Requires workspace flag (workspace that the project belongs to).
      --request-timeout string                 The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.
  -w, --workspace string                       Name of the workspace to create the AppDeployment in
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp create](/dkp/kommander/2.3/cli/dkp/create/)	 - Create one of [appdeployment, bootstrap, capi-components, chart-bundle, cluster, image-bundle, nodepool, workspace]

