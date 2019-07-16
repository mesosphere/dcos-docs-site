---
layout: layout.pug
navigationTitle:  dcos edgelb diagnostic
title: dcos edgelb diagnostic
menuWeight: 5
excerpt: Collect diagnostic information for Edge-LB pools and package it in a support bundle
enterprise: true
---

# Description
The `dcos edgelb diagnostic` command collects diagnostic information for Edge-LB pools and packages that information into a compressed archive support file for troubleshooting and analysis.

# Usage

```bash
dcos edgelb diagnostic [<flags>]
```

# Options

| Name, shorthand | Description |
|---------|-------------|
| `--bundles-dir=BUNDLES-DIR` | Specify the folder under which the diagnostic bundle will be located. You can specify the directory using an absolute or relative path. By default, the current directory is used. |
| `--help, h`   | Display usage information. |
| `--pool-names=POOL-NAMES` | List pools, separated by commas (,), for which diagnostics data should be collected. For example, pool_name1,pool_name2. By default, all pools will be included. |
| `--verbose`   | Enable additional logging of requests and responses. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos edgelb](../../cli-reference/) |  Manage Edge-LB. |

# Examples
To collect diagnostic bundles for all Edge-LB pools, run the following command:

```bash
dcos edgelb diagnostic
```

To collect diagnostic bundles for specific Edge-LB pools, include the pool names in a command similar to the following:

```bash
dcos edgelb diagnostic --pool-names=sf-edgelb,roma-edge-lb,hk-edgelb
```

This command generates a diagnostic bundle with the log files from the `sf-edgelb`, `roma-edgelb`, and `hk-edgelb` pools and saves it in the current working directory.

To collect a diagnostic bundle for a specific Edge-LB pool and place the file in a specific directory instead of the current working directory, run a command similar to the following:

```bash
dcos edgelb diagnostic --pool-names=sf-edgelb --bundles-dir=/usr/share/mydiag
```

This command generates a diagnostic bundle for the `sf-edgelb` pool and places the resulting file in the `/usr/share/mydiag` directory on the local computer.