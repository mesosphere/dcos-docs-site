---
layout: layout.pug
navigationTitle: 
excerpt:
title: Limits
menuWeight: 0
featureMaturity:

---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-commons -->

# DC/OS Spark Limits
Mesosphere has scale-tested Spark on DC/OS by running a CPU-bound Monte Carlo application on the following hardware:

## Cluster characteristics
- 1024 cores total
- 16 m4.16xlarge EC2 instances
 
### Single executor per node:
- 16 executors
- Each executor: 64 cores, 2GB memory 
- CPU utilization was > 90%, with majority of time spent in task computation

### Multiple executors per node: 

 | Executors | Time to Launch all Executors | Executors per Node |
 | --------- | ---------------------------  | -----------------  |
 | 82        | 7 s.                         | 16                 |
 | 400       | 17 s.                        | 64                 |
 | 820       | 28 s.                        | 64                 |

In all variations, the application completed successfully. 