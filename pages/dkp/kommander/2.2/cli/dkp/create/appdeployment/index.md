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

```
dkp create appdeployment APPDEPLOYMENT_NAME --app NAME [flags]
```

### Options

```
  -a, --app string                Name of the App to deploy
      --config string             Config file to use (default "/root/.kommander/config")
  -c, --config-overrides string   Name of the ConfigMap used to override default configuration of the App
      --context string            The name of the kubeconfig context to use
      --dry-run                   Export in YAML format to stdout
  -h, --help                      help for appdeployment
      --kubeconfig string         Path to the kubeconfig file to use for CLI requests.
  -o, --output string             Output format. One of: yaml|json (default "yaml")
  -p, --project string            Name of the project to create the AppDeployment in. Requires workspace flag (workspace that the project belongs to).
      --request-timeout string    The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.
  -w, --workspace string          Name of the workspace to create the AppDeployment in
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp create](/dkp/kommander/2.2/cli/dkp/create/)	 - Create one of [appdeployment, bootstrap, capi-components, chart-bundle, cluster, image-bundle, nodepool, workspace]

