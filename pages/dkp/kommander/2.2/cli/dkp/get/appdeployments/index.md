---
layout: layout.pug
navigationTitle:  dkp get appdeployments
title:  dkp get appdeployments
menuWeight: 10
excerpt: Get AppDeployments from a Workspace, Project, or all Workspaces and Projects
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp get appdeployments

Get AppDeployments from a Workspace, Project, or all Workspaces and Projects

```
dkp get appdeployments [APPDEPLOYMENT_NAME] [flags]
```

### Options

```
  -A, --all-namespaces           If present, list the requested object(s) across all namespaces.
      --config string            Config file to use (default "/root/.kommander/config")
      --context string           The name of the kubeconfig context to use
  -h, --help                     help for appdeployments
      --kubeconfig string        Path to the kubeconfig file to use for CLI requests.
  -o, --output string            Output format. One of: table|yaml
  -p, --project string           Name of the project to show AppDeployments from. Requires workspace flag (workspace that the project belongs to).
      --request-timeout string   The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.
  -w, --workspace string         Name of the workspace to show AppDeployments from
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp get](/dkp/kommander/2.2/cli/dkp/get/)	 - Get one of [appdeployments, chart, clusters, kubeconfig, nodepools, workspaces]

