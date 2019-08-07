---
layout: layout.pug
navigationTitle:  dcos edgelb delete
title: dcos edgelb delete
menuWeight: 10
excerpt: Delete and uninstall an existing pool
enterprise: true
---

# Description
The `dcos edgelb delete` command deletes a pool and uninstalls the deployed load balancers.

# Usage

```bash
dcos edgelb delete <pool-name> [options]
```

# Options

| Name, shorthand | Description |
|-----------------|-------------|
| `--help, -h`    | Display usage. |
| `--verbose`     | Enable additional logging of requests and responses. |
| `--name="<name>"` | Specify the name of the service instance to query. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos edgelb](../../cli-reference/) |  Manage Edge-LB. |

# Examples

To delete the Edge-LB pool named `pubs-multi-lb`, you would run the following command:

```bash
dcos edgelb delete pubs-multi-lb
```

If the pool name you specified is currently deployed, the command returns information similar to the following:

```bash
Successfully deleted pubs-delete-lb. Check the DC/OS web UI for pool uninstall status.
```

To see detailed logging information when deleting the `pubs-multi-lb` pool file, you would run the following command:

```bash
dcos edgelb delete pubs-multi-lb --verbose
```