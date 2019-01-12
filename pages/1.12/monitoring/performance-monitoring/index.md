---
layout: layout.pug
navigationTitle:  Performance Monitoring
title: Performance Monitoring
menuWeight: 1
excerpt: Monitoring a DC/OS cluster

enterprise: false
---

Here are some recommendations for monitoring a DC/OS cluster. You can use any monitoring tools. The endpoints listed below will help you troubleshoot when issues occur.

Your monitoring tools should leverage historic data points so that you can track changes and deviations. You should monitor your cluster when it is known to be in a healthy state as well as unhealthy. This will give you a baseline for what is “normal” in the DC/OS environment. With this historical data, you can fine tune your tools and set appropriate thresholds and conditions. When these thresholds are exceeded, you can send alerts to administrators.

Mesos and Marathon expose the following types of metrics:

*   Gauges are metrics that provide the current state at the moment it was queried.
*   Counters have metrics that are additive and include past and present results. These metrics are not persisted across failover.

Marathon has a timer metric that determines how long an event has taken place. Timer does not exist for Mesos observability metrics.

## Marathon metrics

Marathon provides a number of [metrics][1] for monitoring. You can query the metrics HTTP endpoint in your DC/OS cluster at `<Master-Public-IP>/marathon/metrics`. Here are the ones that are particularly useful to DC/OS.

### Important metrics

*   `marathon.apps.active.gauge` — the number of active apps.
*   `marathon.deployments.active.gauge` — the number of active deployments.
*   `marathon.deployments.counter` — the count of deployments received since the current Marathon instance became a leader.
*   `marathon.deployments.dismissed.counter` — the count of deployments dismissed since the current Marathon instance became a leader; a deployment might be dismissed by Marathon, when there are too many concurrent deployments.
*   `marathon.groups.active.gauge` — the number of active groups.
*   `marathon.leadership.duration.gauge.seconds` — the duration of current leadership. This metric provides the amount of time. Use this metric to diagnose stability problems and determine the frequency of leader election.
*   `marathon.persistence.gc.runs.counter` — the count of Marathon GC runs since it became a leader.
*   `marathon.persistence.gc.compaction.duration.timer.seconds` — a histogram of Marathon GC compaction phase durations, and a meter for compaction durations.
*   `marathon.persistence.gc.scan.duration.timer.seconds` — a histogram of Marathon GC scan phase durations, and a meter for scan durations.
*   `marathon.instances.running.gauge` — the number of running instances at the moment.
*   `marathon.instances.staged.gauge` — the number of instances staged at the moment. Instances are staged immediately after they are launched. A consistently high number of staged instances might indicate a high number of instances cannot be started quickly or are being restarted.
*   `marathon.uptime.gauge.seconds` — uptime of the current Marathon instance. Use this metric to diagnose stability problems that can cause Marathon to restart.

#### Mesos-specific metrics

*   `marathon.tasks.launched.counter` — the count of Mesos tasks launched by the current Marathon instance since it became a leader.
*   `marathon.mesos.calls.revive.counter` — the count of Mesos `revive` calls made since the current Marathon instance became a leader.
*   `marathon.mesos.calls.suppress.counter` — the count of Mesos `suppress` calls made since the current Marathon instance became a leader.
*   `marathon.mesos.offer-operations.launch-group.counter` — the count of `LaunchGroup` offer operations made since the current Marathon instance became a leader.
*   `marathon.mesos.offer-operations.launch.counter` — the count of `Launch` offer operations made since the current Marathon instance became a leader.
*   `marathon.mesos.offer-operations.reserve.counter` — the count of `Reserve` offer operations made since the current Marathon instance became a leader.
*   `marathon.mesos.offers.declined.counter` — the count of offers declined since the current Marathon instance became a leader.
*   `marathon.mesos.offers.incoming.counter` — the count of offers received since the current Marathon instance became a leader.
*   `marathon.mesos.offers.used.counter` — the count of offers used since the current Marathon instance became a leader.

#### HTTP-specific metrics

*   `marathon.http.event-streams.responses.size.counter.bytes` — the size of data sent to clients over event streams since the current Marathon instance became a leader.
*   `marathon.http.requests.size.counter.bytes` — the total size of all requests since the current Marathon instance became a leader.
*   `marathon.http.requests.size.gzipped.counter.bytes` — the total size of all gzipped requests since the current Marathon instance became
  a leader.
*   `marathon.http.responses.size.counter.bytes` — the total size of all responses since the current Marathon instance became a leader.
*   `marathon.http.responses.size.gzipped.counter.bytes` — the total size of all gzipped responses since the current Marathon instance became a leader.
*   `marathon.http.requests.active.gauge` — the number of active requests.
*   `marathon.http.responses.1xx.rate` — the rate of `1xx` responses.
*   `marathon.http.responses.2xx.rate` — the rate of `2xx` responses.
*   `marathon.http.responses.3xx.rate` — the rate of `3xx` responses.
*   `marathon.http.responses.4xx.rate` — the rate of `4xx` responses.
*   `marathon.http.responses.5xx.rate` — the rate of `5xx` responses.
*   `marathon.http.requests.duration.timer.seconds` — a histogram of request durations, and a meter for request durations.
*   `marathon.http.requests.get.duration.timer.seconds` — the same but for `GET` requests only.
*   `marathon.http.requests.post.duration.timer.seconds` — the same but for `POST` requests only.
*   `marathon.http.requests.put.duration.timer.seconds` — the same but for `PUT` requests only.
*   `marathon.http.requests.delete.duration.timer.seconds` — the same but for `DELETE` requests only.

For further details on Marathon metrics please refer to its [documentation][1].

## Mesos metrics

Mesos provides a number of [metrics][2] for monitoring. Here are the ones that are particularly useful to DC/OS.

### Master

**These metrics should not increase over time** If these metrics increase, something is probably wrong.

*   `master/slave_reregistrations` (counter) This metric provides the number of agent re-registrations and restarts. Use this metric along with historical data to determine deviations and spikes of when a network partition occurs. If this number drastically increases, then the cluster has experienced an outage but has reconnected.
*   `master/slave_removals` (counter) This metric provides the number of agents removed for various reasons, including maintenance. Use this metric to determine network partitions after a large number of agents have disconnected. If this number greatly deviates from the previous number, your system administrator should be notified (PagerDuty etc).
*   `master/tasks_error` (counter) This metric provides the number of invalid tasks.
*   `master/tasks_failed` (counter) This metric provides the number of failed tasks.
*   `master/tasks_killed` (counter) This metric provides the number of killed tasks.
*   `master/tasks_lost` (counter) This metric provides the number of lost tasks. A lost task means a task was killed or disconnected by an external factor. Use this metric when a large number of task deviate from the previous historic number.
*   `master/slaves_disconnected` (gauge) This metric provides the number of disconnected agents. This metric is helpful along with `master/slave_removals`. If an agent disconnects this number will increase. If an agent reconnects, this number will decrease.
*   `master/messages_kill_task` (counter) This metric provides the number of kill task messages.
*   `master/slave_removals` (counter) This metric provides the number of agents that were not re-registered during master failover. This is a broad endpoint that combines `../reason_unhealthy`, `../reason_unregistered`, and `../reason_registered`. You can monitor this explicitly or leverage `master/slave_removals/reason_unhealthy`, `master/slave_removals/reason_unregistered`, and `master/slave_removals/reason_registered` for specifics.
*   `master/slave_removals/reason_unhealthy` (counter) This metric provides the number of agents failed because of failed health checks. This endpoint returns the total number of agents that were unhealthy.
*   `master/slave_removals/reason_unregistered` (counter) This metric provides the number of agents unregistered. If this number increases drastically, this indicates that the master or agent is unable to communicate properly. Use this endpoint to determine network partition.
*   `master/slave_removals/reason_registered` (counter) This metric provides the number of agents that were removed when new agents were registered at the same address. New agents replaces old agents. This should be a rare event. If this number increases, your system administrator should be notified (PagerDuty etc).

**These metrics should not decrease over time**

*   `master/slaves_active` (counter) This metric provides the number of active agents. The number of active agents is calculated by adding `slaves_connected` and `slave_disconnected`.
*   `master/slaves_connected` (counter) This metric provides the number of connected agents. This number should equal the total number of Mesos agents (`slaves_active`). Use this metric to determine the general health of your cluster as a percentage of the total.
*   `master/elected` (gauge) This metric indicates whether this is the elected master. This metric should be fetched from all masters, and add up to 1. If this number is not 1 for a period of time, your system administrator should be notified (PagerDuty etc).
*   `master/uptime_secs` (gauge) This metric provides the master uptime, in seconds. This number should be at least 5 minutes (300 seconds) to indicate a stable master. You can use this metric to detect "flapping". For example, if the master has an uptime of less than 1 minute (60 seconds) for more than 10 minutes, it has probably restarted 10 or more times.
*   `master/messages_decline_offers` (counter) This metric provides the number of declined offers. This number should equal the number of agents x the number of frameworks. If this number drops to a low value, something is probably getting starved.

### Agent

**These metrics should not decrease over time**

*   `slave/uptime_secs` (gauge) This metric provides the agent uptime, in seconds. This number should be always increasing. The moment this number resets to `0`, this indicates that the agent process has been rebooted. You can use this metric to detect "flapping". For example, if the agent has an uptime of less than 1 minute (60 seconds) for more than 10 minutes, it has probably restarted 10 or more times.
*   `slave/registered` (gauge) This metric indicates whether this agent is registered with a master. This value should always be `1`. A `0` indicates that the agent is looking to join a new master.

## General

*   Check the Marathon App Health API [endpoint][3] for critical applications API endpoint.
*   Check for agents being shut down:
    *   Tail `/var/log/mesos` warning logs and watch for `Shutting down`
    *   Mesos endpoint that indicates how many agents have been shut down increases
*   Check for mesos masters having short uptimes, which is exposed in Mesos metrics.
*   Change mom-marathon-service logging level from `WARN` to `INFO`.
*   Modify the `mesos-master` log rotation configuration to store the complete logs for at least one day.

    *   Make sure the master nodes have plenty of disk space.
    *   Change the `logrotation` option from `rotate 7` to `maxage 14` or more. For example:

        ```
        ...
        /var/log/mesos/* {
            olddir /var/log/mesos/archive
            maxsize 2000k
            daily
            maxage 14
            copytruncate
            postrotate
                find  /var/log/mesos /var/log/mesos/archive -mtime +14 -delete
            endscript
        }
        EOF
        ...
        ```


See the Apache Mesos [documentation](http://mesos.apache.org/documentation/latest/monitoring/) for Mesos basic alerts.

 [1]: https://mesosphere.github.io/marathon/docs/metrics.html
 [2]: http://mesos.apache.org/documentation/latest/monitoring/
 [3]: /1.12/deploying-services/marathon-api/#/apps/
