---
layout: layout.pug
navigationTitle: dcos edge-lb delete
title: dcos edge-lb delete
menuWeight: 12
excerpt: Reference for the dcos edge-lb delete command
enterprise: true
---

Use this command to delete an existing pool and uninstall the deployed load balancers.

## Usage

```bash
dcos edgelb delete <pool-name> [options]
```

## Options
| Name, shorthand   | Description |
|-------------------|-------------|
| `--help, -h`      | Display usage information. |
| `--verbose, -v`   | Enable additional logging of requests and responses. |
| `--name="<name>"` | Specify the name of the service instance to query. |

## Permissions
To delete an existing pool and uninstall the deployed load balancers, the Edge-LB service account or user account must have the following permission for a specified pool:

```
dcos:adminrouter:service:edgelb:/v2/pools/<pool-name> full
```

## Examples
To delete the Edge-LB pool named `pubs-multi-lb`, you would run the following command:

```bash
dcos edgelb delete pubs-multi-lb
```

If the pool name you specified is currently deployed, the command returns information similar to the following:

```bash
Successfully deleted pubs-delete-lb. Check the DC/OS web UI for pool uninstall status.
```

To see detailed logging information when deleting the `pubs-multi-lb` pool file, you would use the command:

```bash
dcos edgelb delete pubs-multi-lb --verbose
```
