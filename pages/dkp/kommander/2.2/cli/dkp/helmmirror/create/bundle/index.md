---
layout: layout.pug
navigationTitle:  dkp helmmirror create bundle
title:  dkp helmmirror create bundle
menuWeight: 10
excerpt: Create charts bundle based on a catalog applications git repository
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp helmmirror create bundle

Create charts bundle based on a catalog applications git repository

```
dkp helmmirror create bundle [flags]
```

### Options

```
      --catalog-repository string         Git repository containing catalog application definitions (default "github.com/mesosphere/kommander-applications.git?ref=main")
      --extra-charts strings              Extra charts to include in the bundle, in the format <repo-url1>|<chart-name1>,<repo-url2>|<chart-name2>:<chart-version2>,... (default [])
  -h, --help                              help for bundle
      --kommander-charts-version string   Kommander helm charts version to download. Default: download all available versions
  -o, --output string                     File path to write charts bundle to (default "charts-bundle.tar.gz")
      --skip-charts strings               Charts to not to include in the bundle, in the format <chart-name1>,<chart-name2>:<chart-version2>,... (default [])
```

### Options inherited from parent commands

```
      --config string            Config file to use (default "/root/.kommander/config")
      --context string           The name of the kubeconfig context to use
      --kubeconfig string        Path to the kubeconfig file to use for CLI requests.
      --request-timeout string   The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.
  -v, --verbose int              Output verbosity (default -1)
```

### SEE ALSO

* [dkp helmmirror create](/dkp/kommander/2.2/cli/dkp/helmmirror/create/)	 - Create a bundle

