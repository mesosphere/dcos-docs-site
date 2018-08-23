---
layout: layout.pug
navigationTitle: Managing
title: Managing
menuWeight: 35
excerpt: Managing a DC/OS Package Registry
beta: true
enterprise: true
---

Managing
Updating Settings
Executing “dcos package describe --config package-registry” after installing the bootstrap registry gives the wide range of configuration options. The service options can be updated only through UI.
Upgrading
TODO detail instructions : Currently we have only one version of package registry.
Monitoring and Health Checks
The DC/OS Package Registry service exposes an HTTP API endpoint (/health) for checking the health of the registry. As part of deploy this service in DC/OS, it is configured for the Mesos Agent command health checker to check its health. Use the "dcos marathon task list <service-name>" command for a list of all the containers and their health.

dcos marathon task list registry
Troubleshooting
Logs
Use the "dcos task log" command to download the logs for the DC/OS Package registry. For detail information on how to use that command please see the documentation. DC/OS also has support for aggregating log by following this documentation. For the default service name fetch the latest log entries with:

dcos task log registry
Metrics
The DC/OS Package Registry reports application metrics to the DC/OS Metrics service. The latest values can be fetch by using the "dcos task metrics details" command. For the default service name fetch the latest metrics with:

dcos task metrics details registry | sort

Note: For information on how to integrate DC/OS Metrics with Datadog see the documentation.
Disaster Recovery
The DC/OS Package Registry doesn't have built in support for disaster recovery. Instead it is recommend that you backup every DC/OS Package before adding them to the DC/OS Package Registry.
