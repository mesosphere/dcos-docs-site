---
layout: layout.pug
navigationTitle: CLI References
title: CLI References
menuWeight: 50
excerpt: Understanding the command line interface utility for the DC/OS Monitoring Service

enterprise: false
---

The monitoring plugin for the DC/OS command line interface (DC/OS CLI) utility allows you to manage the monitoring stack running on a DC/OS cluster.

Instructions on how to install the DC/OS Monitoring CLI can be found [here](../getting-started/index.md).

To list available commands, run `dcos monitoring` with no parameters:

```bash
$ dcos monitoring

Manage DC/OS monitoring stack

Usage:
    dcos monitoring [command]

Commands:
    debug
        Debug the dcos-monitoring service
    describe
        Show the configuration for dcos-monitoring
    endpoints
        Show the endpoints for dcos-monitoring
    plan
        Manage plans for dcos-monitoring
    pod
        Manage pods for dcos-monitoring
    prometheus
        Query the Prometheus endpoint
    update
        Manage updates for dcos-monitoring

Options:
    -h, --help
        help for monitoring

Use "dcos monitoring [command] --help" for more information about a command.
```

# Specify the monitoring endpoint used by the monitoring CLI

To interact with your monitoring, you may need to set which URL is used.

By default, the monitoring CLI assumes the monitoring stack is accessible using the URL `<cluster-url>/service/dcos-monitoring`.

To set another URL, use `dcos config set monitoring.url`:

```bash
dcos config set monitoring.url <cluster-url>/service/custom-dcos-monitoring-name
```
