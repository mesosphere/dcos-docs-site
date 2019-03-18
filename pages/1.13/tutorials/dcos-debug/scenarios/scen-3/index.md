---
layout: layout.pug
title: Scenario 3
navigationTitle: Scenario 3
excerpt: Tutorial - Docker Images
menuWeight: 21
---
#include /include/tutorial-disclaimer.tmpl

# Scenario 3: Docker Images

## Setup

Start by deploying this [`dockerimage.json`](https://raw.githubusercontent.com/dcos-labs/dcos-debugging/master/1.10/dockerimage.json) file:

```bash
$ dcos marathon app add https://raw.githubusercontent.com/dcos-labs/dcos-debugging/master/1.10/dockerimage.json
```

We see the app fail almost immediately:

![Pic of failure](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-17.png)

Figure 1. Task log showing failures

## Resolution

As we learned [earlier](/tutorials/dcos-debug/gen-strat/), with application failures the [first step](/tutorials/dcos-debug/gen-strat/#task-strat) is to check the [task logs](/tutorials/dcos-debug/tools/#task-logs).

![Pic of empty log output](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-18.png)

Figure 2. Empty task log

Unfortunately, it is completely empty. **Normally we would at least see some output from the setup of the task**. This is especially peculiar behavior.

So Step 2 is to check the scheduler logs --- in this case Marathon:

```bash
$ dcos service log marathon
```

which should produce something like the following output in response:

```bash
Mar 27 21:21:11 ip-10-0-5-226.us-west-2.compute.internal marathon.sh[5954]: [2018-03-27 21:21:11,297] INFO  Received status update for task docker-image.c4cdf565-3204-11e8-8a20-82358f3033d1: TASK_FAILED (

Mar 27 21:21:11 ip-10-0-5-226.us-west-2.compute.internal marathon.sh[5954]: ') (mesosphere.marathon.MarathonScheduler:Thread-1723)
```

However, this does not shed much light on why the task failed. So then to [Step 3](/tutorials/dcos-debug/gen-strat/#agent-strat) of our [strategy](/tutorials/dcos-debug/gen-strat/): check the [Mesos agent logs](/tutorials/dcos-debug/tools/#agent-logs) using:

```bash
$ dcos node log --mesos-id=$(dcos task docker-image  --json | jq -r '.[] | .slave_id') --lines=100
```

to output something resembling the following:

```bash
8-4520-af33-53cade35e8f9-0001 failed to start: Failed to run 'docker -H unix:///var/run/docker.sock pull noimage:idonotexist': exited with status 1; stderr='Error: image library/noimage:idonotexist not found

2018-03-27 21:27:15: '

2018-03-27 21:27:15: I0327 21:27:15.325984  4765 slave.cpp:6227] Executor 'docker-image.9dc468b5-3205-11e8-8a20-82358f3033d1' of framework 6512d7cc-b7f8-4520-af33-53cade35e8f9-0001 has terminated with unknown status
```

It looks like **the specific Docker image could not be found**, perhaps because it doesn’t exist. Does the image exist in the specified location (in this case `noimage:idonotexist` in Dockerhub)? If it does not, you will have to correct the location or move the file to the specified location. Furthermore, was there an error in the specified location or file name? Lastly, check whether the container image registry is accessible (especially when using a private registry).
s
### General Pattern

Being an application error, we again start by looking at task logs, followed by scheduler logs.

In this case we have a Docker daemon-specific issue. Many such issues can be uncovered by examining the Mesos Agent logs. In some cases, where we need to dig deeper, accessing the Docker daemon logs is required. First, ssh into the master node:

```bash
$ dcos node ssh --master-proxy --mesos-id=$(dcos task --all | grep docker-image | head -n1 | awk '{print $6}')
```

then to get the logs:

```bash
$ journalct1 -u docker
```

Please note the more complex pattern used here to retrieve the `mesos-id` in comparison to the earlier example. This pattern lists previously failed tasks as well as running tasks, whereas **the earlier pattern only lists running tasks**.

## Cleanup

Run:

```bash
$ dcos marathon app remove docker-image
```
