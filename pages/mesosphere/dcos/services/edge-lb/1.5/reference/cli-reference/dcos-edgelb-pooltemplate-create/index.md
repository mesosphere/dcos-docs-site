---
layout: layout.pug
navigationTitle: dcos edge-lb pool-template create
title: dcos edge-lb pool-template create
menuWeight: 33
excerpt: Reference for the dcos edge-lb pool-template create command
enterprise: true
---

Use this command to create an Auto Pool template.

The configuration for a pool is generated using a template named `pool.json.ctmpl`. Advanced users can modify and upload a custom version of this template.

## Usage

```bash
dcos edgelb pool-template create <name>
```

## Options

| Name, shorthand | Description |
|---------|-------------|
| `--help, h`   | Display usage. |
| `--verbose`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Name of the service instance to query. |
| `--json` | Show unparsed JSON response. |

<!--### Permissions-->

## Examples
