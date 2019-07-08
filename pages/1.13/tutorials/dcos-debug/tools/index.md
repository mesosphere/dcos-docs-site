---
layout: layout.pug
title: Tools
excerpt: Tutorial - Tools for debugging applications on DC/OS
menuWeight: 11
---
<!-- II. Tools Section -->

#include /include/tutorial-disclaimer.tmpl


<a name="tools"></a>


DC/OS comes with several tools relevant for application debugging:

- [DC/OS web interfaces](#dcos-web)

- [Logs](#logs)

- [Metrics](#metrics)

- [Debugging Tasks Interactively](#interactive)

- [HTTP Endpoints](#endpoints)

- [Community](#community-tool)

- [Other tools](#other-tools)

<a name="dcos-web"></a>

## DC/OS web interfaces

DC/OS provides many web interfaces for various components, these are particularly when debugging application deployment issues:

- [DC/OS web interface](#dcos-ui)

- [Mesos web interface](#mesos-ui)

- [Zookeeper/Exhibitor web interface](#zoo-ui)

<a name="dcos-ui"></a>

### DC/OS web interface

The **DC/OS web interface** is a great place to start debugging as it provides quick access to:

- **Cluster Resource Allocation** to provide an overview of available cluster resources
- **Task Logs** to provide insight into tasks failures
- **Task Debug Information** to provide information about the most recent task offers and/or why a task did not start

![Pic of DC/OS web interface](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-21.png)

Figure 1. Task debug interface

<a name="mesos-ui"></a>

### Mesos web interface

The DC/OS web interface shows the majority of the information you need for debugging. However, sometimes going a step further and accessing the Mesos web interface can be helpful -- especially when checking failed tasked or registered frameworks. The Mesos web interface can be accessed via `https://<cluster-address>/mesos`.

![Pic of Mesos web interface](https://mesosphere.com/wp-content/uploads/2018/04/Screen-Shot-2018-04-15-at-17.56.16.png)

Figure 2. Mesos web interface

<a name="zoo-ui"></a>

### ZooKeeper web interface

As much of the cluster and framework state is stored in Zookeeper, it can sometimes be helpful to check these states using the ZooKeeper/Exhibitor web interface. Frameworks such as Marathon, Kafka, and Cassandra store information with Zookeeper, so this resource can be particularly useful when debugging such frameworks. For example, a failure while uninstalling of one of these frameworks can leave entries behind. So then for sure, if you experience difficulties when reinstalling a framework you have uninstalled earlier, checking this web interface could be very helpful. You can access it via `https://<cluster-address>/exhibitor`.

![Pic of ZooKeeper/Exhibitor web interface](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-13.png)

Figure 3. ZooKeeper/Exhibitor web interface

<a name="logs"></a>

## Logs

Logs are useful tools for seeing events and the conditions that occurred before they emerged. Often logs include error messages that can supply helpful information regarding the cause of the error. As logging is an important topic in its own right, we recommend the [DC/OS logging documentation](/1.13/monitoring/logging/#system-logs), for more information.

DC/OS has a number of different sources for logs. In general, these are the most helpful logs for application debugging:

- [Task/Application Logs](#task-logs)
- [Service Scheduler Logs](#scheduler-logs) (e.g., Marathon)
- [Mesos Agent Logs](#agent-logs)
- [Mesos Master Logs](#master-logs)
- [System Logs](#system-logs)

In DC/OS, there are multiple options for accessing any of these logs: the **DC/OS web interface** the **DC/OS CLI**, or HTTP endpoints. Moreover, DC/OS rotate logs by default to prevent utilizing all available disk space.

<p class="message--note"><strong>NOTE: </strong>Need a scalable way to manage and search your logs? It could be worth building an <a href="/1.12/monitoring/logging/aggregating/filter-elk/">ELK stack</a> for log aggregation and filtering.</p>

Sometimes it can help to increase the level of detail written to a log temporarily to obtain more detailed troubleshooting information for debugging. For most components, this can be done by accessing an endpoint. For example, if you want to increase [the log level of a Mesos Agent](http://mesos.apache.org/documentation/latest/endpoints/logging/toggle/) for 5 minutes after the server receives the API call, you could follow something like this simple two-step process:

##### Connect to Master Node

```bash
$ dcos node ssh --master-proxy --leader
```

##### Raise Log Level on Mesos Agent 10.0.2.219

```bash
$ curl -X POST 10.0.2.219:5051/logging/toggle?level=3&duration=5mins
```

<a name="task-logs"></a>

### Task/Application Logs

Task/application logs are often helpful in understanding the state of the problematic application. By default, applications logs are written (together with execution logs) to the `STDERR` and `STDOUT` files in the task work directory. When looking at the task in the DC/OS web interface, you can just simply view the logs as shown below.

![Pic of task log](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-16.png)

Figure 4. Task log

You can also do the same from the DC/OS CLI:

```bash
$ dcos task log --follow <service-name>
```

<a name="scheduler-logs"></a>

### Scheduler/Marathon Logs

[Marathon](https://mesosphere.github.io/marathon/) is DC/OS's default scheduler when starting an application. Scheduler logs, and Marathon logs in particular, are a great source of information to help you understand why or how something was scheduled (or not) on which node. Recall that the scheduler matches tasks to available resources. So then because the scheduler also receives task status updates, the log also contains detailed information about task failures.

You can retrieve and view a scheduler log about a specific service through the list of services found in the DC/OS web interface, or via the following command:

```bash
$ dcos service log --follow <scheduler-service-name>
```

Note that since Marathon is the “Init” system of DC/OS, it is running as a SystemD unit (same with respect to the other DC/OS system components). Due to this fact, you need the CLI command to access its logs.

<a name="agent-logs"></a>

### Mesos Agent Logs

Mesos agent logs are helpful for understanding how an application was started by the agent and how it may have failed. You can launch the Mesos web interface by navigating to `https://<cluster_name>/mesos` and examining the agent logs as shown below.

![Pic of Mesos agent UI](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-23.png)

Figure 5. Mesos agent interface

Alternatively, you can view the agent logs by first using `dcos node log --mesos-id=<node-id>` from the DC/OS CLI to locate the corresponding node `ID`. Enter:

```bash
$ dcos node
```

where you will see something similar to the following output:

```bash
HOSTNAME        IP                         ID                    TYPE

10.0.1.51    10.0.1.51   ffc913d8-4012-4953-b693-1acc33b400ce-S3  agent

10.0.2.50    10.0.2.50   ffc913d8-4012-4953-b693-1acc33b400ce-S1  agent

10.0.2.68    10.0.2.68   ffc913d8-4012-4953-b693-1acc33b400ce-S2  agent

10.0.3.192   10.0.3.192  ffc913d8-4012-4953-b693-1acc33b400ce-S4  agent

10.0.3.81    10.0.3.81   ffc913d8-4012-4953-b693-1acc33b400ce-S0  agent

master.mesos.  10.0.4.215    ffc913d8-4012-4953-b693-1acc33b400ce   master (leader)
```

Then, in this case, you can enter:

```bash
$ dcos node log --mesos-id=ffc913d8-4012-4953-b693-1acc33b400ce-S0 --follow
```

and get the following log output:

```bash
2018-04-09 19:04:22: I0410 02:38:22.711650  3709 http.cpp:1185] HTTP GET for /slave(1)/state from 10.0.3.81:56595 with User-Agent='navstar@10.0.3.81 (pid 3168)'

2018-04-09 19:04:24: I0410 02:38:24.752534  3708 logfmt.cpp:178] dstip=10.0.3.81 type=audit timestamp=2018-04-10 02:38:24.752481024+00:00 reason="Valid authorization token" uid="dcos_net_agent" object="/slave(1)/state" agent="navstar@10.0.3.81 (pid 3168)" authorizer="mesos-agent" action="GET" result=allow srcip=10.0.3.81 dstport=5051 srcport=56595
```

<a name="master-logs"></a>

### Mesos Master Logs

The Mesos Master is responsible for matching available resources to the scheduler. It also forwards task status updates from the Mesos Agents to the corresponding scheduler. This makes the Mesos Master logs a great resource for understanding the overall state of the cluster.

Be aware that there are typically multiple Mesos Masters for a single cluster. So you should **identify the current leading Mesos Master to get the most recent logs**. In fact, in some cases it might even make sense to retrieve logs from another Mesos master as well: e.g., a master node failed and you want to understand why.

You can either retrieve the master logs from the Mesos web interface via `<cluster-name>/mesos`, via `dcos node log --leader`, or for a specific master node using `ssh master` and `journalctl -u dcos-mesos-master`.

<a name="system-logs"></a>

### System Logs

We have now covered the most important log sources in the DC/OS environment, but there are many more logs available. Every DC/OS component writes a log. As mentioned above, [each DC/OS component](/1.13/overview/architecture/components/) is running as one Systemd unit. You can [retrieve the logs directly](/latest/monitoring/logging/#system-logs) on the particular node by SSHing into the node, and then typing `journalctl -u <systemd-unit-name>`. Two of the more common system units to consider during debugging (besides Mesos and Marathon) are the `docker.service` and the `dcos-exhibitor.service`.

As an example, consider the system unit for the docker daemon on the Mesos agent `ffc913d8-4012-4953-b693-1acc33b400ce-S0` (recall the `dcos node` command retrieves the Mesos ID).

First, we can SSH into that agent using the corresponding SSH key:

```bash
$ dcos node ssh --master-proxy --mesos-id=ffc913d8-4012-4953-b693-1acc33b400ce-S0
```

Then we can use `journatlctl`, to look at the Docker logs:

```bash
$ journalctl -u docker
```

which outputs something like this:

```bash
-- Logs begin at Mon 2018-04-09 23:50:05 UTC, end at Tue 2018-04-10 02:52:41 UTC. --

Apr 09 23:51:50 ip-10-0-3-81.us-west-2.compute.internal systemd[1]: Starting Docker Application Container Engine...

Apr 09 23:51:51 ip-10-0-3-81.us-west-2.compute.internal dockerd[1262]: time="2018-04-09T23:51:51.293577691Z" level=info msg="Graph migration to content-addressability took 0.00 seconds"
```

<a name="metrics"></a>

## Metrics

Metrics are useful because they help identify potential issues before they become actual bugs. For example, imagine a situation wherein a container uses up all allocated memory. If you could detect this while the container is **still running but not yet killed**, you are much more likely to be able to intervene in time.

In DC/OS there are three main endpoints for metrics:

- [DC/OS metrics](https://github.com/dcos/dcos-metrics)
    - endpoint exposing combined metrics from tasks/container, nodes, and applications
- [Mesos metrics](http://mesos.apache.org/documentation/latest/monitoring/)
    - endpoint exposing Mesos-specific metrics
- [Marathon metrics](https://mesosphere.github.io/marathon/docs/metrics.html)
    - endppoint exposing Marathon-specific metrics

One way to leverage metrics to help with debugging is to set up a dashboard. This dashboard would include the most important metrics related to the services you want to monitor. For example, you could [use prometheus and grafana](https://github.com/dcos/dcos-metrics/blob/master/docs/quickstart/prometheus.md#dcos-metrics-with-prometheus-and-grafana) to make a metrics dashboard.

Ideally, with the dashboard configured and functioning, you can identify potential problems before they become actual bugs. Moreover, when issues do arise, this sort of dashboard can be extremely helpful in determining the cause of the bug(e.g. maybe a cluster has no free resources). Each link from the endpoint item listed above provides recommendations for the metrics you should monitor for that endpoint.

<a name="interactive"></a>

## Interactive

Sometimes the task logs provide insufficient help. In these cases, using your favorite Linux tools (e.g. `curl`, `cat`, `ping`, etc...) to get an interactive point of view could be a worthwhile next step.

For example, if you are using a [Universal Container Runtime (UCR)] (https://docs.mesosphere.com/latest/deploying-services/containerizers/ucr/), you can use `dcos task exec` as follows:

```bash
dcos task exec -it <mycontainerid>
```

and be presented with an interactive bash shell inside that container.

<p class="message--important"><strong>IMPORTANT: </strong>If you alter the state of the container when using <code>dcos task exec</code> in the manner above, you must update the stored <code>app-definition</code> and restart the container from that updated <code>app-definition</code>. If you fail to do so, then your changes will be lost the next time the container restarts.</p>

Alternatively, when using a docker containerizer, you can SSH into the node in question and run [`docker exec`](https://docs.docker.com/engine/reference/commandline/exec/) to investigate the running container.

<a name="endpoints"></a>

## HTTP Endpoints

DC/OS has a large number of additional endpoints that could be useful for debugging:

- `<cluster>/mesos/master/state-summary`

### `state-summary`

The [`state-summary` endpoint](http://mesos.apache.org/documentation/latest/endpoints/master/state-summary/) returns a json encoded summary of the agents, tasks, and frameworks inside the cluster. This is especially helpful when considering allocation of resources across the cluster, as it shows you whether there are resources already reserved for a particular role (there are more details on this in [one of the debugging scenarios provided below](#c2).

<p class="message--note"><strong>NOTE: </strong>See the <a href="http://mesos.apache.org/documentation/latest/endpoints/">complete list of Mesos endpoints</a>.

### `queue`

- `<cluster>/marathon/v2/queue`

Marathon's [`queue` endpoint](https://mesosphere.github.io/marathon/api-console/index.html) returns a list of all tasks in the queue to be scheduled by Marathon. This endpoint is valuable when troubleshooting scaling or deployment problems.

<a name="community-tool"></a>

## Community

The [DC/OS community](https://dcos.io/community/?_ga=2.183442662.1394567794.1525106895-1279864600.1520288020) is a great place to ask additional questions either via [Slack](http://chat.dcos.io/?_ga=2.183442662.1394567794.1525106895-1279864600.1520288020) or the [mailing list](https://groups.google.com/a/dcos.io/forum/#!forum/users). Also keep in mind that both [Mesos](http://mesos.apache.org/community/) and [Marathon](https://mesosphere.github.io/marathon/support.html) have their own communities in addition to the DC/OS community.

<a name="other-tools"></a>

## Other Tools

There are other debugging tools as well -- [internal to DC/OS](/1.13/monitoring/debugging/) as well as external tools like [Sysdig](https://sysdig.com/blog/monitoring-mesos/) or [Instana](https://www.instana.com/). These tools can be especially helpful in determining non DC/OS specific issues (e.g., Linux Kernel or networking problems).
