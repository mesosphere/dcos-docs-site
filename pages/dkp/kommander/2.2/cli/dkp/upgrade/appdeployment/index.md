---
layout: layout.pug
navigationTitle:  dkp upgrade appdeployment
title:  dkp upgrade appdeployment
menuWeight: 10
excerpt: Upgrade an AppDeployment to a newer version
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp upgrade appdeployment

Upgrade an AppDeployment to a newer version

```
dkp upgrade appdeployment APPDEPLOYMENT_NAME --to-version VERSION [--workspace WORKSPACE | --project PROJECT] [flags]
```

### Options

```
  -h, --help                help for appdeployment
      --project string      Name of the Project to update the AppDeployment in
      --to-version string   Version the AppDeployment should be upgraded to
  -w, --workspace string    Name of the Workspace to update the AppDeployment in
```

### Options inherited from parent commands

```
      --config string            Config file to use
      --context string           The name of the kubeconfig context to use
      --kubeconfig string        Path to the kubeconfig file to use for CLI requests.
      --request-timeout string   The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.
  -v, --verbose int              Output verbosity
```

### SEE ALSO

* [dkp upgrade](/dkp/kommander/2.2/cli/dkp/upgrade/)	 - Upgrade a specific DKP component running on the cluster

