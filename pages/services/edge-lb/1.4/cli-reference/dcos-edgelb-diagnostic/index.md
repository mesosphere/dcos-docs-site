---
layout: layout.pug
navigationTitle:  dcos edgelb diagnostic
title: dcos edgelb diagnostic
menuWeight: 5
excerpt: Collect diagnostic information for Edge-LB pools and package it in a support bundle
enterprise: true
---

# Description
The `dcos edgelb diagnostic` command collects diagnostic information for Edge-LB pools and packages it in a support bundle for troubleshooting and analysis.

# Usage

```bash
dcos edgelb diagnostic [flags]
```

# Options

| Name, shorthand | Description |
|---------|-------------|
| `--bundles-dir | Specify the folder under which the diagnostic bundle will be located. By default, the current directory is used. |
| `--help, h`   | Display usage information. |
| `--pool-names` | List pools, separated by commas (,), for which diagnostics data should be collected. For example, pool_name1,pool_name2. By default, all pools will be included. |
| `--verbose`   | Enable additional logging of requests and responses. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos edgelb](../../cli-reference/) |  Manage Edge-LB. |

# Examples
To collect diagnostic bundles for specific Edge-LB pools, include the pool names in a command similar to the following:

```bash
dcos edgelb diagnostic --pool-names=sf-edgelb, roma-edge-lb, hk-edgelb
```

This command generates diagnostic bundle with the logs files from the sf-edgelb, roma-edgelb, and hk-edgelb pools.

For more information about using command-line programs, see [Edge-LB Usage](../../usage/).