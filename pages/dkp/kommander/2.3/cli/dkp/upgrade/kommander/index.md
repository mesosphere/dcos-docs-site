---
layout: layout.pug
navigationTitle:  dkp upgrade kommander
title:  dkp upgrade kommander
menuWeight: 10
excerpt: Upgrade the Kommander version of the targeted cluster
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp upgrade kommander

Upgrade the Kommander version of the targeted cluster

### Synopsis

Upgrades all Kommander components and platform applications running on the targeted cluster. No attached clusters and applications running on them are affected by this action.

```
dkp upgrade kommander [flags]
```

### Options

```
      --charts-bundle stringArray                  Path to charts-bundle to upload to chartmuseum, apart from parsing the kommander applications repository (default [])
      --config string                              Config file to use (default "/root/.kommander/config")
      --context string                             The name of the kubeconfig context to use
      --core-app-timeout duration                  Timeout to wait for upgrade of each kommander core application (default 20m0s)
      --disable-appdeployments strings             List of AppDeployments to be disabled during upgrade (default [fluent-bit])
      --disallow-charts-download                   make CLI rely solely on provided chart bundles and do not try to download charts from the Internet
      --gitea-kommander-repository-name string     gitea kommander repository name (default "kommander")
  -h, --help                                       help for kommander
      --kommander-applications-repository string   git repository with application definitions (default "v2.3.2-rc.2")
      --kommander-charts-version string            Kommander helm charts version to download. Default: download all available versions
      --kubeconfig string                          Path to the kubeconfig file to use for CLI requests.
      --platform-apps-timeout duration             Timeout to wait for upgrade of the set of platform applications (default 30m0s)
      --request-timeout string                     The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests.
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp upgrade](/dkp/kommander/2.3/cli/dkp/upgrade/)	 - Upgrade one of [addons, capi-components, catalogapp, kommander, workspace]

