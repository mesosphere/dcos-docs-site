---
layout: layout.pug
navigationTitle: Logging API v2
excerpt:
title: Logging API v2
menuWeight: 2

---


# Logging API V2
The Logging API exposes node, component, and container (task) logs.

The Logging API is backed by the DC/OS Log component, which runs on all nodes in the cluster.

For more information about using the Logging API, see Logging.
For usage examples, see Logging API Examples.

## Compatibility
The Logging API v2 was added in DC/OS 1.11.0

In DC/OS < 1.11.0 task logs were available via [files API](http://mesos.apache.org/documentation/latest/endpoints/#files-1), starting DC/OS 1.11.0, the user can leverage the consolidated API for both component and task logs.

## Routes
Access to the Logging API v2 is proxied through the Admin Router on each node using the following route:

`/system/v1/logs/v2/`

Access to the Logging API of the agent nodes is proxied through the master nodes to appropriate agent node based on {agent_id}:

`/system/v1/agent/{agent_id}/logs/v2/`


### Any node
`/system/v1/logs/v2/component` - Read the entire journald log.

`/system/v1/logs/v2/component/{component_name}` - Read the journald logs for a given component name.

### Master routes
Master routes which are serving task logs are also called discovery endpoints. When the user makes a GET request to one of the discovery endpoint, the user will get back a temporarily redirect to the appropriate agent node with the right endpoint.

`/system/v1/logs/v2/task/{task_id}` - Read default stdout file for the given task.

`/system/v1/logs/v2/task/{task_id}/file/{filename}` - Read the {filename} for the given task.

`/system/v1/logs/v2/task/{task_id}/browse` - List the files from the sandbox for the given task.

`/system/v1/logs/v2/task/{task_id}/download` - Download default file `stdout` from the sandbox for the given task.

`/system/v1/logs/v2/task/{task_id}/file/{filename}/download` - Download the specific file {filename} from the sandbox.

### Agent routes
Agent routes which are serving task logs, are being redirected to by a discovery endpoints from the master node. Typically user should not call these endpoints directly, but rather rely on master node to construct the correct endpoint on agent node.

The parameters used in the request are coming from mesos state.json and are called task metadata.

`{framework_id}, {executor_id}, {container_id}, {id}` {filename} stands for a requested file from the sandbox.

`/system/v1/logs/v2/task/frameworks/{framework_id}/executors/{executor_id}/runs/{id}/files/browse` - Browse standalone task files.

`/system/v1/logs/v2/task/frameworks/{framework_id}/executors/{executor_id}/runs/{id}/tasks/{container_id}/files/browse` - Browse pod task files.

`/system/v1/logs/v2/task/frameworks/{framework_id}/executors/{executor_id}/runs/{id}/tasks/{container_id}/{filename}` - Read the standalone task log.

`/system/v1/logs/v2/task/frameworks/{framework_id}/executors/{executor_id}/runs/{container_id}/{filename}` - Read the pod task log.

`/system/v1/logs/v2/task/frameworks/{framework_id}/executors/{executor_id}/runs/{id}/tasks/{container_id}/{filename}/download` - Download the standalone task log file.

`/system/v1/logs/v2/task/frameworks/{framework_id}/executors/{executor_id}/runs/{container_id}/{filename}/download` - Download the pod task log file.

## GET parameters
`?limit=<N>` limits the number of log entries in lines

`?skip=<+/-N>` skips a number of lines

`?cursor=<string|BEG|END>` sets the cursor to a particular position in the log. For component logs it would be a cursor string, for task logs it would be an offset

`?filter=<key:value> *` (can only be used for component logs at the moment) filters logs by key:value pair.

For example `?filter=_SYSTEMD_UNIT:dcos-mesos-master.service`



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
 
 
