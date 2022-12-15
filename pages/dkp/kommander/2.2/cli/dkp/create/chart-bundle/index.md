---
layout: layout.pug
navigationTitle:  dkp create chart-bundle
title:  dkp create chart-bundle
menuWeight: 10
excerpt: Create charts bundle based on a catalog applications git repository
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp create chart-bundle

Create charts bundle based on a catalog applications git repository

```
dkp create chart-bundle [flags]
```

### Options

```
      --catalog-repository string         Git repository containing catalog application definitions
      --config string                     Config file to use (default "/root/.kommander/config")
      --context string                    The name of the kubeconfig context to use
      --dry-run                           Export in YAML format to stdout
      --extra-charts strings              Extra charts to include in the bundle, in the format <repo-url1>|<chart-name1>,<repo-url2>|<chart-name2>:<chart-version2>,... (default [])
  -h, --help                              help for chart-bundle
      --kommander-charts-version string   Kommander helm charts version to download. Default: download all available versions
      --kubeconfig string                 Path to the kubeconfig file to use for CLI requests.
  -o, --output string                     Output format. One of: yaml|json (default "yaml")
      --request-timeout string            The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.
      --skip-charts strings               Charts to not to include in the bundle, in the format <chart-name1>,<chart-name2>:<chart-version2>,... (default [])
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp create](/dkp/kommander/2.2/cli/dkp/create/)	 - Create one of [appdeployment, bootstrap, capi-components, chart-bundle, cluster, image-bundle, nodepool, workspace]

