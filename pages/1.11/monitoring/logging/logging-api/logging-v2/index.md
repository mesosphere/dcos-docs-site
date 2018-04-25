---
layout: layout.pug
navigationTitle: Logging API
excerpt:
title: Logging API
menuWeight: 2

---

The Logging API exposes node, component, and container (task) logs.

The Logging API is backed by the [DC/OS Log component](/1.11/overview/architecture/components/#dcos-log), which runs on all nodes in the cluster.

For more information about using the Logging API, see [Logging](/1.11/monitoring/logging/index.md).

For usage examples, see [Logging API Examples](/1.11/monitoring/logging/logging-api-examples/index.md).

## Compatibility

### Previous Versions

The Logging API was first added in DC/OS 1.9.0. Prior to DC/OS 1.9.0, all node, component, and container logs were managed by Logrotate.

In DC/OS 1.9.0 up to 1.11.0, node and component logs are managed by journald. However, the [Mesos task journald log sink was disabled](https://github.com/dcos/dcos/pull/1269) due to [journald performance issues](https://github.com/systemd/systemd/issues/5102). So container log files for those versions are only accessible via the [Mesos task sandbox files API](http://mesos.apache.org/documentation/latest/sandbox/).

### New Logging features in DC/OS v1.11

The Logging API v2 has been updated in DC/OS 1.11.0

As noted above, in DC/OS versions prior to 1.11.0 task logs were available via [files API](http://mesos.apache.org/documentation/latest/endpoints/#files-1), starting DC/OS 1.11.0. Now the user can leverage the consolidated API *for both component and task logs*.

## Routes

Access to the Logging API is proxied through the Admin Router on each node using the following route:

```
/system/v1/logs/
```

Access to the Logging API of the agent nodes is proxied through the master node to the appropriate agent node based on `{agent_id}`:

```
/system/v1/agent/{agent_id}/
```

To determine the address of your cluster, see [Cluster Access](/1.11/api/access/).


### Master routes
Master routes which are serving task logs are also called discovery endpoints. When the user makes a GET request to one of the discovery endpoint, the user will get back a temporarily redirect to the appropriate agent node with the right endpoint.



### Agent routes
Agent routes which are serving task logs, are being redirected to by a discovery endpoints from the master node. Typically user should not call these endpoints directly, but rather rely on master node to construct the correct endpoint on agent node.

The parameters used in the request are coming from mesos state.json and are called task metadata.

`



## Format
The API request header can be any the following:

`text/plain, text/html, */*_ request logs in text format, ending with _\n`.

`text/event-stream` request logs in Server-Sent-Events format

DC/OS Logging v2 follows the [Server-Sent-Event specifications](https://www.w3.org/TR/2009/WD-eventsource-20090421/). It supports reading the log entry from a specific cursor position, if client specifies a request header Last-Event-ID as defined in SSE specifications. Every log entry in SSE format, contains an id with a token id: <token>. This allows client to know the current log entry and gives ability to resume logs consumption if it was interrupted.

## Auth
All Logging API routes require authentication to use.

To authenticate API requests, see [Obtaining an authentication token](https://docs.mesosphere.com/1.11/security/ent/iam-api/#/obtaining-an-authentication-token) and [Passing an authentication token](https://docs.mesosphere.com/1.11/security/ent/iam-api/#/passing-an-authentication-token).
The Logging API also requires authorization via the following permissions:
| Route |  Permission |
| :---  | :---        |
| /system/v1/logs/v2/ | dcos:adminrouter:ops:system-logs |
| /system/v1/agent/{agent_id}/logs/v2/ | dcos:adminrouter:system:agent |

All routes may also be reached by users with the _dcos:superuser_ permission.

To assign permissions to your account, see Permissions Reference.

 # Resources

 The following resources are available under both of the above routes:

 [swagger api='/1.11/api/logs2.yaml']
