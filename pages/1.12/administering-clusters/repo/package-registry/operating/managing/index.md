---
layout: layout.pug
navigationTitle: Managing
title: Managing
menuWeight: 35
excerpt: Managing a DC/OS Package Registry
enterprise: true
---

# Updating Settings

Executing `dcos package describe --config package-registry` after installing the bootstrap registry gives you a wide range of configuration options. The service options can be updated only through the DC/OS GUI.

## Monitoring and Health Checks

DC/OS Package Registry service exposes an HTTP API endpoint (`/health`) for checking the health of the registry. When you deploy this service in DC/OS, the Mesos Agent command health checker is configured to check its health. Use the `dcos marathon task list <service-name>` command for a list of all the containers and their health status.

```bash
dcos marathon task list registry
```

# Troubleshooting

## Logs

Use the [`dcos task log`](/1.12/monitoring/logging/quickstart/#view-the-mesos-and-dcos-logs) command to download the logs for DC/OS Package Registry. DC/OS also has support for [log aggregation](/1.12/monitoring/logging/aggregating/). Assuming the default service name, `registry` again, the lastest log entries can be fetched using:

```bash
dcos task log registry
```

## Metrics

DC/OS Package Registry reports application metrics to the DC/OS Metrics service. The latest of these values can be fetched by using `dcos task metrics details`:

```bash
dcos task metrics details registry | sort
```

## Disaster Recovery

DC/OS Package Registry does not have native support for disaster recovery. Instead it is recommended that you backup all DC/OS Packages before adding them to a DC/OS Package Registry.
