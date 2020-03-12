---
layout: layout.pug
navigationTitle: dcos edge-lb diagnostic
title: dcos edge-lb diagnostic
menuWeight: 15
excerpt: Reference for the dcos edge-lb diagnostic command
enterprise: true
---

Use the `dcos edgelb diagnostic` command to collect diagnostic information for Edge-LB pools and package the diagnostics in a support bundle for troubleshooting and analysis.

## Usage
```bash
dcos edgelb diagnostic [options]
```

## Options
| Name, shorthand | Description |
|-----------------|-------------|
| `--bundles-dir=BUNDLES-DIR` | Specify the folder in which the diagnostic bundle will reside. You can specify the directory using an absolute or relative path. The default value is the current directory. |
| `--pool-names=POOL-NAMES` | List pools, separated by commas (,), for which diagnostics data should be collected, in the format, pool_name1,pool_name2. By default, all pools are included. |
| `--help, -h`   | Display usage information. |
| `--verbose, -v` | Enable additional logging of requests and responses. |

## Permissions
To create a diagnostic bundle for Edge-LB pools, the Edge-LB service account or user account must have the following permission for a specified pool:

```
dcos:adminrouter:service:edgelb:/v2/pools full
```

## Examples
To collect diagnostic bundles for all Edge-LB pools, use the command:

```bash
dcos edgelb diagnostic
```

To collect diagnostic bundles for specific Edge-LB pools, include the pool names in a command similar to the following:

```bash
dcos edgelb diagnostic --pool-names=sf-edgelb,roma-edge-lb,hk-edgelb
```

This command generates diagnostic bundle with the logs files from the `sf-edgelb`, `roma-edgelb`, and `hk-edgelb` pools and saves it in the current working directory.

To collect diagnostic bundles for a specific Edge-LB pool and place the file in a specific directory, instead of the current working directory, run a command similar to the following:

```bash
dcos edgelb diagnostic --pool-names=sf-edgelb --bundles-dir=/usr/share/mydiag
```

This command generates a diagnostic bundle for the `sf-edgelb` pool and places the resulting file in the `/usr/share/mydiag` directory on the local computer.
