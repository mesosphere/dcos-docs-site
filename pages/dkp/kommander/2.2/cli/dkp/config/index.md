---
layout: layout.pug
navigationTitle:  dkp config
title:  dkp config
menuWeight: 10
excerpt: Modify kommander's configuration
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp config

Modify kommander's configuration

### Options

```
      --config string            Config file to use (default "/root/.kommander/config")
      --context string           The name of the kubeconfig context to use
  -h, --help                     help for config
      --kubeconfig string        Path to the kubeconfig file to use for CLI requests.
      --request-timeout string   The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp](/dkp/kommander/2.2/cli/dkp/)	 - 
* [dkp config current-workspace](/dkp/kommander/2.2/cli/dkp/config/current-workspace/)	 - Displays the name of the configured default Workspace
* [dkp config set-workspace](/dkp/kommander/2.2/cli/dkp/config/set-workspace/)	 - Set the name of the default Workspace to use in all commands when none is provided

