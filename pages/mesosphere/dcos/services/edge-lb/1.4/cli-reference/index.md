---
layout: layout.pug
navigationTitle:  CLI Reference
title: CLI Reference
menuWeight: 70
excerpt: Reference for all CLI commands in the Edge-LB package
enterprise: false
---

# Description
The Edge-LB CLI subcommands allow you to configure and manage your Edge-LB load balancer(s) from the DC/OS CLI.

# Usage

```bash
dcos edgelb [options] <command> [<args>]
```

# Options
The following general purpose options can be added to most `dcos edgelb` commands.

| Name, shorthand       | Description |
|-----------------------|-------------|
| `--help, -h`          | Display usage information. |
| `--verbose, -v`       | Enable additional logging of requests and responses. |
| `--name="<name>"`     | Specify the name of the service instance to query. |
