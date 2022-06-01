---
layout: layout.pug
navigationTitle:  dkp get chart
title:  dkp get chart
menuWeight: 10
excerpt: Obtain information about charts stored in the repository
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp get chart

Obtain information about charts stored in the repository

```
dkp get chart [chartName] [chartVersion] [flags]
```

### Options

```
  -A, --all-namespaces           If present, list the requested object(s) across all namespaces.
      --config string            Config file to use (default "/root/.kommander/config")
      --context string           The name of the kubeconfig context to use
  -h, --help                     help for chart
      --kubeconfig string        Path to the kubeconfig file to use for CLI requests.
  -o, --output string            Output format. One of: table|yaml
      --request-timeout string   The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp get](/dkp/kommander/2.3/cli/dkp/get/)	 - Get one of [appdeployments, chart, clusters, kubeconfig, nodepools, workspaces]

