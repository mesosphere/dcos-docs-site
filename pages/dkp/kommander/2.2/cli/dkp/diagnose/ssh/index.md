---
layout: layout.pug
navigationTitle:  dkp diagnose ssh
title:  dkp diagnose ssh
menuWeight: 10
excerpt: Collect node-level diagnostics data over SSH
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp diagnose ssh

Collect node-level diagnostics data over SSH

```
dkp diagnose ssh path/to/inventory-file.yaml [flags]
```

### Options

```
  -h, --help                help for ssh
      --redactors strings   Names of the additional redactors to use (default [])
      --timeout duration    Timeout for collecting bundle per node (default 5m0s)
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp diagnose](/dkp/kommander/2.2/cli/dkp/diagnose/)	 - Generate a support bundle

