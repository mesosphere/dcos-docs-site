---
layout: layout.pug
navigationTitle:  dkp upgrade workspace
title:  dkp upgrade workspace
menuWeight: 10
excerpt: Upgrade all platform applications in the given workspace and its projects to the same version as platform applications running on the management cluster
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp upgrade workspace

Upgrade all platform applications in the given workspace and its projects to the same version as platform applications running on the management cluster

```
dkp upgrade workspace WORKSPACE_NAME [--dry-run] [flags]
```

### Options

```
      --config string                    Config file to use (default "/root/.kommander/config")
      --context string                   The name of the kubeconfig context to use
      --core-app-timeout duration        Timeout to wait for upgrade of each kommander core application (default 20m0s)
      --disable-appdeployments strings   List of AppDeployments to be disabled during upgrade (default [fluent-bit])
      --dry-run                          Do not upgrade, just list the AppDeployments that would be upgraded
  -h, --help                             help for workspace
      --kubeconfig string                Path to the kubeconfig file to use for CLI requests.
      --platform-apps-timeout duration   Timeout to wait for upgrade of the set of platform applications (default 30m0s)
      --request-timeout string           The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp upgrade](/dkp/kommander/2.3/cli/dkp/upgrade/)	 - Upgrade one of [addons, capi-components, catalogapp, kommander, workspace]

