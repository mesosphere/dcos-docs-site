---
layout: layout.pug
navigationTitle:  dcos edgelb version
title: dcos edgelb version
menuWeight: 70
excerpt: Display the current Edge-LB version
enterprise: true
---

# Description
The `dcos edgelb version` command displays the current Edge-LB version.

# Usage

```bash
dcos edgelb [options] version
```

# Options

| Name, shorthand | Description |
|-----------------|-------------|
| `--help, -h`    | Display usage information. |
| `--verbose, -v`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Specify the name of the service instance to query. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos edgelb](../../cli-reference/) |  Manage Edge-LB. |

# Examples

To display version information for the Edge-LB API server and pool if you have an Edge-LB service instance named `edgelb-eu`, you would run the following command:

```bash
dcos edgelb --name="edgelb-eu" version
```

The command returns information similar to the following:

```bash
client = v1.4.0
server = v1.4.0
```