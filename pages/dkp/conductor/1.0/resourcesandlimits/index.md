---
layout: layout.pug
navigationTitle: Resources and Limitations
title: Resources and Limitations
menuWeight: 30
excerpt: Conductor's resource impact and limitations
---

Conductor's general resource impact on the cluster which it is servicing is negligible when no interactive units are running. However, Conductor can allow up to 10 users to be running interactive units simultaneously - each using their own KIND cluster - which do utilize non-trivial cluster resources.

## KIND clusters

### CPU and Memory

When an interactive unit is running a KIND cluster, it is limited to the following resource footprint:

KIND cluster-pod
```bash
resources:
        limits:
          cpu: 1.5
          memory: 3Gi
        requests:
          cpu: 250m
          memory: 2Gi
```
For the cluster itself as well as a resource footprint for the environment in which it is contained:

SSH pod
```bash
resources:
        limits:
          cpu: 500m
          memory: 512Mi
        requests:
          cpu: 250m
          memory: 256Mi
```

So in total, **each KIND cluster-pod *plus* the pod in which it is contained together have a maximum resource impact of 2 vCPUs (1 AWS core) and 3.5 Gi mem, in terms of CPU and memory.**

A standard Conductor installation comes with a maximum capacity of 10 simultaneous interactive labs. **Given this 10 interactive-lab throttle on learning cluster resources overall, the total possible maximum resource impact from KIND clusters is 10 cores (20 vCPUs), 35 GB mem, and 20 GB storage.**

This is a hard limit with the standard install, and if reached you will see an error message notifying you that there are too many users currently trying to use Conductor.

If you want this limit raised, contact your account executive or our sales team at sales@d2iq.com, and we can help you contract a higher limit.
