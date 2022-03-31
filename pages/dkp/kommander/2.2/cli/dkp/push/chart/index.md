---
layout: layout.pug
navigationTitle:  dkp push chart
title:  dkp push chart
menuWeight: 10
excerpt: Upload charts to the repository
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp push chart

Upload charts to the repository

```
dkp push chart [chartTarball]... [flags]
```

### Options

```
      --config string            Config file to use (default "/root/.kommander/config")
      --context string           The name of the kubeconfig context to use
  -h, --help                     help for chart
      --kubeconfig string        Path to the kubeconfig file to use for CLI requests.
      --request-timeout string   The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp push](/dkp/kommander/2.2/cli/dkp/push/)	 - Push one of [chart, chart-bundle, image-bundle]

