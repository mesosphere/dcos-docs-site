---
layout: layout.pug
navigationTitle:  Health Checks
title: Health Checks
menuWeight: 200
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


You can define health checks for your DC/OS services. Health checks are defined on a per application basis, and are run against that application's tasks.

Health checks perform periodic checks on the containers distributed across a cluster to make sure they’re up and responding. If health checks fail for any reason, Mesos will report the task as unhealthy so that status-aware load balancers can stop sending traffic to the container. After a task reaches the maximum number of consecutive failures, Marathon will kill the task and restart it.

Health checks begin immediately when a task is launched. They are locally executed by Mesos on the agent running the corresponding task. Health checks are performed as close to the task as possible, so they are are not affected by networking failures. Health checks are delegated to the agents running the tasks. This allows the number of tasks that are health checked to scale horizontally along with the number of agents in the cluster.

- The default health check leverages Mesos' knowledge of the task state `TASK_RUNNING => healthy`.
- Marathon provides a `health` member of the task resource via the [REST API](/1.11/deploying-services/marathon-api/) that you can add to your service definition.

A health check is considered passing if both of these conditions are met:

- The HTTP response code is between 200 and 399 inclusive.
- The response is received within the `timeoutSeconds` period. If a task fails more than `maxConsecutiveFailures` health checks consecutively, that task is killed.

You can define health checks in your JSON application definition or in the DC/OS GUI **Services** tab.

You can also define custom commands to be executed for health. These can be defined in your Dockerfile, for example:

```json
{
  "protocol": "COMMAND",
  "command": { "value": "source ./myHealthCheck.sh" }
}
```

# Health check protocols

DC/OS supports the following health check protocols:

- `MESOS_HTTP`
- `MESOS_HTTPS`
- `MESOS_TCP`
- `COMMAND`

# Health check options

When creating a service, you can configure JSON health checks in the DC/OS GUI or directly as JSON. This table shows the equivalent GUI fields and JSON options.

| GUI | JSON | Default | Description |
|----------------------|--------------------------|---------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **GRACE PERIOD(S)** |&nbsp;`gracePeriodSeconds`&nbsp;| `15` | Specifies the amount of time (in seconds) to ignore health checks immediately after a task is started; or until the task becomes healthy for the first time. |
| **INTERVAL(S)** | `intervalSeconds` | `10` | Specifies the amount of time (in seconds) to wait between health checks. |
| **MAX FAILURES** | `maxConsecutiveFailures` | `3` | Specifies the number of consecutive health check failures that can occur before a task is killed. |
| **PROTOCOL** | `protocol` | `HTTP` | Specifies the protocol of the requests: `HTTP`, `HTTPS`, `TCP`, or `Command`. |
| **SERVICE ENDPOINT** | `path` | `\` | If `"protocol": "HTTP"`, this option specifies the path to the task health status endpoint. For example, `“/path/to/health”`. |
| N/A | `portIndex` | `0` | Specifies the port index in the ports array that is used for health requests. A port index allows the app to use any port, such as `“[0, 0, 0]”` and tasks could be started with port environment variables such as `$PORT1`. |
| **TIMEOUT(S)** | `timeoutSeconds` | `20` | Specifies the amount of time (in seconds) before a health check fails, regardless of the response. |

<table class="table">
<tr>
<th>GUI</th>
<th>JSON</th>
<th>Default</th>
<th>Description</th>
</tr>
<tr>
<td><b>GRACE PERIOD(S)</b></td>
<td><code>gracePeriodSeconds</code></td>
<td><code>15</code></td>
<td>Specifies the amount of time (in seconds) to ignore health checks immediately after a task is started; or until the task becomes healthy for the first time. </td>
</tr>
<tr>
<td><b>INTERVAL(S)</b></td>
<td> <code>intervalSeconds</code></td>
<td><code>10</code></td>
<td>Specifies the amount of time (in seconds) to wait between health checks. </td>
</tr>
<tr>
<td><b>MAX FAILURES</b></td>
<td> <code>maxConsecutiveFailures</code></td>
<td><code>3</code></td>
<td>Specifies the number of consecutive health check failures that can occur before a task is killed. </td>
</tr>
<tr>
<td><b>PROTOCOL </b></td>
<td> <code>protocol</code></code></td>
<td><code>HTTP</code></td>
<td>Specifies the protocol of the requests: <code>HTTP</code>, <code>HTTPS</code>, <code>TCP</code>, or <code>Command</code>. </td>
</tr>
<tr>
<td><b>SERVICE ENDPOINT</b></td>
<td> <code>path</code></td>
<td><code>\`</td>
<td> If <code>"protocol": "HTTP"</code>, this option specifies the path to the task health status endpoint. For example, <code>“/path/to/health”</code>. </td>
</tr>
<tr>
<td>N/A </td>
<td> <code>portIndex</code></td>
<td><code>0</code></td>
<td> Specifies the port index in the ports array that is used for health requests. A port index allows the app to use any port, such as </code>“[0, 0, 0]”</code> and tasks could be started with port environment variables such as </code>$PORT1</code>.</td>
</tr>
<tr>
<td><b>TIMEOUT(S)</b> </td>
<td> <code>timeoutSeconds</code></td>
<td><code>20</code></td>
<td>  Specifies the amount of time (in seconds) before a health check fails, regardless of the response.</td>
</tr>
</table>


For example, here is the health check specified as JSON in an application definition.

```json
"healthChecks": [
  {
    "gracePeriodSeconds": 120,
    "intervalSeconds": 30,
    "maxConsecutiveFailures": 0,
    "path": "/admin/healthcheck",
    "portIndex": 0,
    "protocol": "MESOS_HTTP",
    "timeoutSeconds": 5
  } ]
```

And here is the same health check specified by using the DC/OS GUI.

![GUI health check](/1.11/img/health-check-gui.png)

## More information
Check out [this blog post](https://mesosphere.com/blog/2017/05/16/13-factor-app-building-releasing-for-cloud-native/) for more information about health checks.
