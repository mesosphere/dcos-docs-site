---
layout: layout.pug
navigationTitle:  Telemetry
title: Telemetry
menuWeight: 7
excerpt: Understanding the telemetry reporting component
render: mustache
model: /mesosphere/dcos/2.0/data.yml
enterprise: false
---


To improve the Mesosphere&reg; DC/OS&reg; experience continuously, a telemetry component is included that reports anonymous usage data to D2iQ&reg;. This data is used to monitor the reliability of core DC/OS components, installations, user interface, and to find out which features are most popular.

- [Core telemetry](#core)
- [User interface telemetry](#user-interface)

# <a name="core"></a>Core telemetry
The [DC/OS Signal](/mesosphere/dcos/2.0/overview/architecture/components/#dcos-signal) component queries the diagnostics service `/system/health/v1/report` endpoint on the leading master and sends this data to [Segment&reg;](https://segment.com/docs/) which Mesosphere then uses to track usage metrics and customer support.

The information reported by DC/OS Signal comes from several components: DC/OS Diagnostics, Apache&reg; Mesos&reg;, and DC/OS Package Manager (Cosmos).

For each category this data is collected:

<table class="table">
<tr>
<th>Type</th>
<th>Description</th>
</tr>
<tr><td>anonymousId</td>
<td>This is an anonymous ID that is created for every cluster at startup. This ID persists across your cluster. For example:
<pre>
"anonymousId": "70b28f00-e38f-41b2-a723-aab344f535b9
</pre></td></tr>
<tr><td>clusterId</td>
<td>This is the <code>anonymousID</code> value that is created for every cluster at startup. This ID persists across your cluster. For example:
<pre>
"clusterId": "70b28f00-e38f-41b2-a723-aab344f535b9"
</pre>
</td></tr>
<tr><td>customerKey (DC/OS Enterprise)</td>
<td>This is the DC/OS Enterprise customer key. Customer keys are delivered by email to the Authorized Support Contact. For example:
<pre>
"customerKey": "ab1c23de-45f6-7g8h-9012-i345j6k7lm8n",
</pre>
</td></tr>
<tr><td>licenseId (DC/OS Enterprise)</td>
<td>This is the DC/OS Enterprise license ID. License IDs are delivered by email to the Authorized Support Contact. For example:
<pre>
"licenseId": "acme-dev-cluster",
</pre>
</td></tr>
<tr><td>event</td>
<td>This is the category that appears in Segment. Possible values are <code>package_list</code> (Package Manager), <code>health</code> (Diagnostics), and <code>mesos_track</code> (Mesos). For example:
<pre>
"event": "package_list"
</pre>
</td>
</tr>
<tr><td>environmentVersion</td>
<td>This is the version of DC/OS. For example, if you are using DC/OS 2.0:
<pre>
"environmentVersion": "2.0",
</pre></td></tr>
<tr><td>provider</td>
<td>This is the platform on which DC/OS is running. Possible values are <code>aws</code>, <code>on-prem</code>, and <code>azure</code>. For example, if you are running on AWS&reg;:
<pre>
"provider": "aws",
</pre></td></tr>
<tr><td>source</td>
<td>This is a hard-coded setting that indicates a cluster. For example:
<pre>
"source": "cluster",
</pre></td></tr>
<tr><td>variant</td>
<td>This indicates whether the cluster is DC/OS or DC/OS Enterprise. For example, if you are using DC/OS Open Source:
<pre>
"variant": "open"
</pre>
</td></tr>
</table>


## Diagnostics

This information is collected from the [DC/OS Diagnostics](/mesosphere/dcos/2.0/overview/architecture/components/#dcos-diagnostics) component. For every `systemd` unit, the following information is collected, where `<UNIT_NAME>` is component name:

```bash
"health-unit-dcos-<UNIT_NAME>-total": 3, "health-unit-dcos-<UNIT_NAME>-unhealthy": 0,
```

## Mesos
This information is collected from the [Apache Mesos](/mesosphere/dcos/2.0/overview/architecture/components/#apache-mesos) component.

<table class="table">
<tr>
<th>Type</th>
<th>Description</th>
</tr>
<tr><td>agents_active</td><td>Number of active agents. For example: <pre>"agents_active": 2,</pre></td></tr>
<tr><td>agents_connected</td><td>Number of connected agents. For example: <pre>"agents_connected": 2,</pre></td></tr>
<tr><td>cpu_total</td><td>Number of CPUs available. For example: <pre>"cpu_total": 8,</pre></td></tr>
<tr><td>cpu_used</td><td>Number of allocated CPUs. For example: <pre>"cpu_used": 0,</pre></td></tr>
<tr><td>disk_total</td><td>Disk space available in MB. For example: <pre>"disk_total": 71154,</pre></td></tr>
<tr><td>disk_used</td><td>Allocated disk space in MB. For example: <pre>"disk_used": 0,</pre></td></tr>
<tr><td>framework_count</td><td>Number of installed DC/OS services. For example: <pre>"framework_count": 2,</pre></td></tr>
<tr><td>frameworks</td><td>Which DC/OS services are installed. For example:
<pre>
"frameworks": [
                {
                    "name": "marathon"
                },
                {
                    "name": "metronome"
                }
            ],
</pre></td></tr>
<tr><td>mem_total</td><td>Memory available in MB. For example: <pre>"mem_total": 28036,</pre></td></tr>
<tr><td>mem_used</td><td>Memory allocated in MB. For example: <pre>"mem_used": 0,</pre></td></tr>
<tr><td>task_count</td><td>Number of tasks. For example: <pre>"task_count": 0,</pre></td></tr>
</tr>
</table>


## Package Manager
This information is collected from the [DC/OS Package Manager (Cosmos)](/mesosphere/dcos/2.0/overview/architecture/components/#dcos-package-manager) component.

<table class="table">
<tr>
<th>Type</th>
<th>Description</th>
</tr>
<tr>
<td>package_list</td>
<td>Which packages are installed. For example, if you had Kafka and Spark:
<pre>"package_list": [
{
"name": "kafka"
},
{
"name": "spark"
}
],
</pre></td>
</tr>
</table>

Here is an example of the JSON telemetry report that is collected:

```json
{
    "cosmos": {
        "properties": {
            "clusterId": "70b28f00-e38f-41b2-a723-aab344f535b9",
            "customerKey": "",
            "licenseId": "acme-dev-cluster",
            "environmentVersion": "1.8",
            “package_list”: [
            {
            “name”: “kafka”
            },
            {
            “name”: “spark”
            }
            ],
            "provider": "aws",
            "source": "cluster",
            "variant": "open"
        },
        "anonymousId": "70b28f00-e38f-41b2-a723-aab344f535b9",
        "event": "package_list"
    },
    "diagnostics": {
        "properties": {
            "clusterId": "70b28f00-e38f-41b2-a723-aab344f535b9",
            "customerKey": "",
            "licenseId": "acme-dev-cluster",
            "environmentVersion": "1.8",
            "health-unit-dcos-diagnostics-service-total": 3,
            "health-unit-dcos-diagnostics-service-unhealthy": 0,
            "health-unit-dcos-diagnostics-socket-total": 2,
            "health-unit-dcos-diagnostics-socket-unhealthy": 0,
            "health-unit-dcos-adminrouter-agent-service-total": 2,
            "health-unit-dcos-adminrouter-agent-service-unhealthy": 0,
            "health-unit-dcos-adminrouter-reload-service-total": 3,
            "health-unit-dcos-adminrouter-reload-service-unhealthy": 0,
            "health-unit-dcos-adminrouter-reload-timer-total": 3,
            "health-unit-dcos-adminrouter-reload-timer-unhealthy": 0,
            "health-unit-dcos-adminrouter-service-total": 1,
            "health-unit-dcos-adminrouter-service-unhealthy": 0,
            "health-unit-dcos-cosmos-service-total": 1,
            "health-unit-dcos-cosmos-service-unhealthy": 0,
            "health-unit-dcos-epmd-service-total": 3,
            "health-unit-dcos-epmd-service-unhealthy": 0,
            "health-unit-dcos-exhibitor-service-total": 1,
            "health-unit-dcos-exhibitor-service-unhealthy": 0,
            "health-unit-dcos-gen-resolvconf-service-total": 3,
            "health-unit-dcos-gen-resolvconf-service-unhealthy": 0,
            "health-unit-dcos-gen-resolvconf-timer-total": 3,
            "health-unit-dcos-gen-resolvconf-timer-unhealthy": 0,
            "health-unit-dcos-history-service-total": 1,
            "health-unit-dcos-history-service-unhealthy": 0,
            "health-unit-dcos-logrotate-agent-service-total": 2,
            "health-unit-dcos-logrotate-agent-service-unhealthy": 0,
            "health-unit-dcos-logrotate-agent-timer-total": 2,
            "health-unit-dcos-logrotate-agent-timer-unhealthy": 0,
            "health-unit-dcos-logrotate-master-service-total": 1,
            "health-unit-dcos-logrotate-master-service-unhealthy": 0,
            "health-unit-dcos-logrotate-master-timer-total": 1,
            "health-unit-dcos-logrotate-master-timer-unhealthy": 0,
            "health-unit-dcos-marathon-service-total": 1,
            "health-unit-dcos-marathon-service-unhealthy": 0,
            "health-unit-dcos-mesos-dns-service-total": 1,
            "health-unit-dcos-mesos-dns-service-unhealthy": 0,
            "health-unit-dcos-mesos-master-service-total": 1,
            "health-unit-dcos-mesos-master-service-unhealthy": 0,
            "health-unit-dcos-mesos-slave-public-service-total": 1,
            "health-unit-dcos-mesos-slave-public-service-unhealthy": 0,
            "health-unit-dcos-mesos-slave-service-total": 1,
            "health-unit-dcos-mesos-slave-service-unhealthy": 0,
            "health-unit-dcos-metronome-service-total": 1,
            "health-unit-dcos-metronome-service-unhealthy": 0,
            "health-unit-dcos-navstar-service-total": 3,
            "health-unit-dcos-navstar-service-unhealthy": 0,
            "health-unit-dcos-oauth-service-total": 1,
            "health-unit-dcos-oauth-service-unhealthy": 0,
            "health-unit-dcos-pkgpanda-api-service-total": 3,
            "health-unit-dcos-pkgpanda-api-service-unhealthy": 0,
            "health-unit-dcos-pkgpanda-api-socket-total": 3,
            "health-unit-dcos-pkgpanda-api-socket-unhealthy": 0,
            "health-unit-dcos-rexray-service-total": 2,
            "health-unit-dcos-rexray-service-unhealthy": 0,
            "health-unit-dcos-signal-service-total": 1,
            "health-unit-dcos-signal-service-unhealthy": 0,
            "health-unit-dcos-signal-timer-total": 3,
            "health-unit-dcos-signal-timer-unhealthy": 0,
            "health-unit-dcos-spartan-service-total": 3,
            "health-unit-dcos-spartan-service-unhealthy": 0,
            "health-unit-dcos-spartan-watchdog-service-total": 3,
            "health-unit-dcos-spartan-watchdog-service-unhealthy": 0,
            "health-unit-dcos-spartan-watchdog-timer-total": 3,
            "health-unit-dcos-spartan-watchdog-timer-unhealthy": 0,
            "health-unit-dcos-vol-discovery-priv-agent-service-total": 1,
            "health-unit-dcos-vol-discovery-priv-agent-service-unhealthy": 0,
            "health-unit-dcos-vol-discovery-pub-agent-service-total": 1,
            "health-unit-dcos-vol-discovery-pub-agent-service-unhealthy": 0,
            "provider": "aws",
            "source": "cluster",
            "variant": "open"
        },
        "anonymousId": "70b28f00-e38f-41b2-a723-aab344f535b9",
        "event": "health"
    },
    "mesos": {
        "properties": {
            "agents_active": 2,
            "agents_connected": 2,
            "clusterId": "70b28f00-e38f-41b2-a723-aab344f535b9",
            "licenseId": "acme-dev-cluster",
            "cpu_total": 8,
            "cpu_used": 0,
            "customerKey": "",
            "disk_total": 71154,
            "disk_used": 0,
            "environmentVersion": "1.8",
            "framework_count": 2,
            "frameworks": [
                {
                    "name": "marathon"
                },
                {
                    "name": "metronome"
                }
            ],
            "mem_total": 28036,
            "mem_used": 0,
            "provider": "aws",
            "source": "cluster",
            "task_count": 0,
            "variant": "open"
        },
        "anonymousId": "70b28f00-e38f-41b2-a723-aab344f535b9",
        "event": "mesos_track"
    }
}
```


# <a name="user-interface"></a>User interface telemetry

The DC/OS UI sends two types of notifications to [Segment](https://segment.com/docs/), which Mesosphere then uses to track usage metrics and customer support:

- Login information
- The pages you have viewed while navigating the UI

## Opting Out

You can also choose to opt out of the telemetry features. For more information, see [Opt-Out](/mesosphere/dcos/2.0/installing/production/deploying-dcos/opt-out/).
