---
layout: layout.pug
navigationTitle: Tested Limits
excerpt: Mesosphere has scale-tested Spark on DC/OS
title: Tested Limits
menuWeight: 140
featureMaturity:
render: mustache
model: /services/spark/data.yml
---

# DC/OS {{ model.techShortName }} limits
Mesosphere has scale-tested {{ model.techShortName }} on DC/OS by running a CPU-bound Monte Carlo application on the following hardware:

## Cluster characteristics
- 2560 cores total
- 40 m4.16xlarge EC2 instances

### Single executor per node
- 40 executors
- Each executor: 64 cores, 2GB memory
- CPU utilization was > 90%, with majority of time spent in task computation

### Multiple executors per node
On a smaller, 1024-core, 16 node (m4.16xlarge) cluster, the following variations were tested:

 Executors | Time to launch all executors | Executors per node
 --------- | --------------------------- | -----------------
 82 | 7 s. | 16
 400 | 17 s. | 64
 820 | 28 s. | 64

In all tests, the application completed successfully.
