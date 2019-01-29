---
layout: layout.pug
navigationTitle:  Logging API
title: Logging API
menuWeight: 3
excerpt: Using the Logging API
beta: false
enterprise: false
---


The Logging API exposes node, component, and container (task) logs.

The Logging API is backed by the [DC/OS Log component](/1.12/overview/architecture/components/#dcos-log), which runs on all nodes in the cluster. For more information about using the Logging API, see [Logging](/1.12/monitoring/logging/). For usage examples, see [Logging API Examples](/1.12/monitoring/logging/logging-api-examples/).

# Compatibility

The Logging API has been updated significantly for DC/OS 1.11 and later.

In versions of DC/OS prior to 1.11, task logs were available via [files API](http://mesos.apache.org/documentation/latest/endpoints/#files-1). Now you can leverage the consolidated API *for both component and task logs*.

In versions of DC/OS prior to 1.11, node and component logs were managed by `journald`. However, the [Mesos task journald log sink was disabled due to [journald performance issues](https://docs.mesosphere.com/1.12/installing/production/advanced-configuration/configuration-reference/#mesos-container-log-sink). So container log files for older versions are only accessible via the [Mesos task sandbox files API](http://mesos.apache.org/documentation/latest/sandbox/).

The following code may be useful:

```
FRAMEWORK_NAME="marathon"
APP_ID="nginx"

# get the mesos task state json
MESOS_STATE="$(curl -k -H "Authorization: token=${DCOS_AUTH_TOKEN}" ${DCOS_URL}/mesos/state)"
TASK_STATE="$(echo "${MESOS_STATE}" | jq ".frameworks[] | select(.name == \"${FRAMEWORK_NAME}\") | .tasks[] | select(.name == \"${APP_ID}\")")"

# extract values from the task json
AGENT_ID="$(echo "${TASK_STATE}" | jq -r '.slave_id')"
TASK_ID="$(echo "${TASK_STATE}" | jq -r '.id')"
FRAMEWORK_ID="$(echo "${TASK_STATE}" | jq -r '.framework_id')"
EXECUTOR_ID="$(echo "${TASK_STATE}" | jq -r '.executor_id')"
CONTAINER_ID="$(echo "${TASK_STATE}" | jq -r '.statuses[0].container_status.container_id.value')"

# default to container ID when executor ID is empty
EXECUTOR_ID="${EXECUTOR_ID:-${TASK_ID}}"

# Using Mesos API, agent/files endpoint
curl -k -H "Authorization: token=${DCOS_AUTH_TOKEN}" "${DCOS_URL}/agent/${AGENT_ID}/files/read?path=/var/lib/mesos/slave/slaves/${AGENT_ID}/frameworks/${FRAMEWORK_ID}/executors/${EXECUTOR_ID}/runs/${CONTAINER_ID}/stdout&offset=0&length=50000"
```

<a name="routes"></a>
# Routes

Access to the Logging API is proxied through Admin Router on each node using the following route:

```
/system/v1/logs/
```

Access to the Logging API of the agent nodes is proxied through the master node to the appropriate agent node based on `{agent_id}`:

```
/system/v1/agent/{agent_id}/
```

To determine the address of your cluster, see [Cluster Access](/1.12/api/access/).


## Discovery Endpoints

Master routes which are serving task logs are also called *'discovery endpoints'*. When the user makes a GET request to a discovery endpoint, the user is redirected to the agent node with the desired endpoint.

The parameters used in the request come from mesos `state.json` and are called "task metadata".


# Auth

All Logging API routes require authentication to use. To authenticate API requests, see [Obtaining an authentication token](/1.12/security/ent/iam-api/#/obtaining-an-authentication-token/) and [Passing an authentication token](/1.12/security/ent/iam-api/#/passing-an-authentication-token/).

The Logging API also requires authorization via the following permissions:
| Path |  Permission |
| :---  | :---        |
| /system/v1/logs/v2/ | dcos:adminrouter:ops:system-logs |
| /system/v1/agent/{agent_id}/logs/v2/ | dcos:adminrouter:system:agent |

All routes may also be reached by users with the _dcos:superuser_ permission. To assign permissions to your account, see [Permissions Reference](/1.12/security/ent/perms-reference/).

# Format

The API request header can be any of the following:

- `text/plain`, `text/html`, `*/*` request logs in text format, ending with `\n`.
- `application/json` request logs in JSON format.
- `text/event-stream` request logs in Server-Sent-Events format.

DC/OS Logging follows the [Server-Sent-Event specifications](https://www.w3.org/TR/2009/WD-eventsource-20090421/). It supports reading the log entry from a specific cursor position, if the client specifies a request header Last-Event-ID as defined in SSE specifications. Every log entry in SSE format contains an ID with a token ID: <token>. This allows the client to know the current log entry and gives you the ability to resume logs consumption if it was interrupted.

# Resources

 The following resources are available under both of the [above routes](#routes):

 [swagger api='/1.12/api/logs2.yaml']
