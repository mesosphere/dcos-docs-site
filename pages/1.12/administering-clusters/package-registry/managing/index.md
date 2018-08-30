---
layout: layout.pug
navigationTitle: Managing Package Registry
title: Managing Package Registry
menuWeight: 35
excerpt: Managing DC/OS Package Registry
beta: true
enterprise: true
---

### Updating Settings

Executing `dcos package describe --config package-registry` after installing the bootstrap registry gives the wide range of configuration options. The service options can be updated only through GUI.

### Monitoring and Health Checks

The DC/OS Package Registry service exposes an HTTP API endpoint (/health) for checking the health of the registry. As part of deploy this service in DC/OS, it is configured for the Mesos Agent command health checker to check its health. Use the `dcos marathon task list <service-name>` command for a list of all the containers and their health.

```bash
dcos marathon task list registry
```

### Troubleshooting

#### Logs

Use the "dcos task log" command to download the logs for the DC/OS Package registry. For detail information on how to use that command please see the documentation. DC/OS also has support for aggregating log by following this documentation. For the default service name fetch the latest log entries with:

```bash
dcos task log registry
```

#### Metrics

The DC/OS Package Registry reports application metrics to the DC/OS Metrics service. The latest values can be fetch by using the `dcos task metrics details` command. For the default service name fetch the latest metrics with:

```bash
dcos task metrics details registry | sort
```

For information on how to integrate DC/OS Metrics with Datadog see the documentation.

#### Disaster Recovery

The DC/OS Package Registry doesn't have built in support for disaster recovery. Instead it is recommend that you backup every DC/OS Package before adding them to the DC/OS Package Registry.
