---
layout: layout.pug
navigationTitle: NodeSync Options
title: NodeSync
menuWeight: 20
excerpt: Configurating NodeSync for DSE 6.0.2
featureMaturity:
enterprise: true
model: /services/dse/data.yml
render: mustache
---

# NodeSync:
NodeSync is an easy to use continuous background repair that has low overhead and provides consistent performance.

 -  Continuously validates that data is in sync on all replica.
 -  Always running but low impact on cluster performance
 -  Fully automatic, no manual intervention needed
 -  Completely replace anti-entropy repairs


## Starting and Stopping the NodeSync service

 The NodeSync service automatically starts with the `dse cassandra` command. You can manually start and stop the service on each node.
 
 **Procedure:**

 Verify the status of the NodeSync service:

```
    nodetool nodesyncservice status
```

  The output should indicate running.
  
```
    The NodeSync service is running
```

### Disable the NodeSync service:

```
    nodetool nodesyncservice disable
```

 On the next restart of DataStax Enterprise service (DSE), the NodeSync service will start up.


Verify the status of the NodeSync service:

```
    nodetool nodesyncservice status
```

The output should indicate not running.

```
    The NodeSync service is not running
```
## NodeSync parameters

```
  nodesync:
    rate_in_kb: 1024
```
See [NodeSync Parameters](https://docs.datastax.com/en/dse/6.0/dse-dev/datastax_enterprise/config/configCassandra_yaml.html?hl=tpc#configCassandra_yaml__parametersNodesync) for further reference.

The `rate_in_kb` sets the per node rate of the local NodeSync service. It controls the maximum number of bytes per second used to validate data. There is a fundamental tradeoff between how fast NodeSync validates data and how many resources it consumes. The rate is a limit on the amount of resources used and a target that NodeSync tries to achieve by auto-tuning internals.

### Setting the rate:

**Initial rate setting -**
   There is no strong requirement to keep all nodes validating at the same rate. Some nodes will simply validate more data than others. When setting the rate, use the simplest method first by using the defaults.

 - Check the `rate_in_kb` setting within the nodesync section in the `cassandra` configuration tab.
 
 - Try increasing or decreasing the value at run time:
```
    nodetool nodesyncservice setrate value_in_kb_sec
```
 - Check the configured rate.
```
    nodetool nodesyncservice getrate
```
  Tip: The configured rate is different from the effective rate, which can be found in the NodeSync Service metrics.

