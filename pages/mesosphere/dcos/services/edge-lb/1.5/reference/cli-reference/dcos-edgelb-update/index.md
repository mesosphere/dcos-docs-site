---
layout: layout.pug
navigationTitle: dcos edge-lb update
title: dcos edge-lb update
menuWeight: 72
excerpt: Reference for the dcos edge-lb update command
enterprise: true
---

Use this command to upload a new pool configuration file to the Edge-LB `apiserver`, updating the running pool of load balancers.

## Usage
```bash
dcos edgelb update [options] <pool-file>
```

## Options
| Name, shorthand       | Description |
|-----------------------|-------------|
| `--help, -h`          | Display usage information. |
| `--verbose, -v`       | Enable additional logging of requests and responses. |
| `--name="<name>"`     | Specify the name of the service instance to query. |
| `--json` | Show unparsed JSON response. |

## Permissions
To update an existing pool, the Edge-LB service account or user account must have the following permissions for a specified pool:

```
dcos:adminrouter:service:edgelb:/v2/pools/<pool-name> full
dcos:service:marathon:marathon:services:/dcos-edgelb/pools/<pool-name> full
```

If you are working with the API specification for v1, the permissions required are:

```
dcos:adminrouter:service:edgelb:/v1/loadbalancers/<pool-name>
dcos:service:marathon:marathon:services:/dcos-edgelb/pools/<pool-name>
```

## Examples
To update the pool configuration settings for an existing Edge-LB pool, you would run a command similar to the following:

```bash
dcos edgelb update <pool-configuration-file>
```

For example, if you want to update a pool to use the `mysampleconfig` pool configuration file:

```bash
dcos edgelb update mysampleconfig
```
