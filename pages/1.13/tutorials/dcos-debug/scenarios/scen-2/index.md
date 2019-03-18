---
layout: layout.pug
title: Scenario 2
navigationTitle: Scenario 2
excerpt: Tutorial - Out of Memory
menuWeight: 11
---

<a name=c2></a>

## Scenario 2: Out of Memory

### Setup

Deploy the file [`app-oom.json`](https://raw.githubusercontent.com/dcos-labs/dcos-debugging/master/1.10/app-oom.json):

```bash
$ dcos marathon app add https://raw.githubusercontent.com/dcos-labs/dcos-deb
```

Once deployed, when we take a look at the DC/OS web interface, we see some strange results under CPU Allocation:

![Pic of CPU allocation](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-25.png)

Figure 1. CPU allocation display

**How is it that CPU Allocation is continually oscillating between 0 and 8 percent?** Let’s take a look at the application details in the web interface:

![Pic of Task tab](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-24.png)

Figure 2. Application details

Based on this, **the application runs for a few seconds and then fails**.

### Resolution

To get a better handle on understanding this unexpected behavior, let us start by looking at the application logs --- either in the web interface or via the CLI. You can find the application logs in the web interface by looking under 'Output' in the 'Logs' tab of the application:

![Pic of app logs](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-15.png)

Figure 3. Application log displa y

The log output “Eating Memory” is a pretty generous hint that the issue might be related to memory. Despite this, there is no direct failure message regarding memory allocation(keep in mind that **most apps are not so friendly as to log that they are eating up memory**).

As suspected, this might be an application-related issue, and this application is scheduled via Marathon. So let’s check the Marathon logs using the CLI:

```bash
$ dcos service log marathon
```
We see a log entry similar to:

```bash
Mar 27 00:46:37 ip-10-0-6-109.us-west-2.compute.internal marathon.sh[5866]: [2018-03-27 00:46:36,960] INFO  Acknowledge status update for task app-oom.4af344fa-3158-11e8-b60b-a2f459e14528: TASK_FAILED (Memory limit exceeded: Requested: 64MB Maximum Used: 64MB
```
<p class="message--note"><strong>NOTE: </strong> One helpful time-saving tip can be to <code>grep</code> for </code>TASK_FAILED</code>.</p>

**Now we have confirmed that we exceeded the previously set container memory limit in [`app-oom.json`](https://github.com/dcos-labs/dcos-debugging/blob/master/1.10/app-oom.json#L6)**

If you’ve been paying close attention you might shout now “wait a sec” because you noticed that the memory limit we set in the app definition is 32 MB, but the error message mentions 64MB. DC/OS automatically reserves some overhead memory for the [executor](/1.13/overview/architecture/task-types/#executors) which in this case is 32 MB.

Please note that OOM `kill` is performed by the Linux kernel itself, hence we can also check the kernel logs directly:

```bash
dcos node ssh --master-proxy --mesos-id=$(dcos task app-oom --json | jq -r '.[] | .slave_id')

journalctl -f _TRANSPORT=kernel

Mar 27 01:15:36 ip-10-0-1-103.us-west-2.compute.internal kernel: [ pid ]   uid  tgid total_vm      rss nr_ptes nr_pmds swapents oom_score_adj name

Mar 27 01:15:36 ip-10-0-1-103.us-west-2.compute.internal kernel: [16846]     0 16846    30939    11021      62       3        0             0 mesos-container

Mar 27 01:15:36 ip-10-0-1-103.us-west-2.compute.internal kernel: [16866]     0 16866   198538    12215      81       4        0             0 mesos-executor

Mar 27 01:15:36 ip-10-0-1-103.us-west-2.compute.internal kernel: [16879]     0 16879     2463      596      11       3        0             0 sh

Mar 27 01:15:36 ip-10-0-1-103.us-west-2.compute.internal kernel: [16883]     0 16883  1143916    14756      52       6        0             0 oomApp

Mar 27 01:15:36 ip-10-0-1-103.us-west-2.compute.internal kernel: Memory cgroup out of memory: Kill process 16883 (oomApp) score 877 or sacrifice child

Mar 27 01:15:36 ip-10-0-1-103.us-west-2.compute.internal kernel: Killed process 16883 (oomApp) total-vm:4575664kB, anon-rss:57784kB, file-rss:1240kB, shmem-rss:0kB

Mar 27 01:15:36 ip-10-0-1-103.us-west-2.compute.internal kernel: oom_reaper: reaped process 16883 (oomApp), now anon-rss:0kB, file-rss:0kB, shmem-rss:0kB
```

The resolution in such cases is to either increase the resource limits for that container, in case it was configured too low to begin with. Or, as in this case, fix the memory leak in the application itself.

### General Pattern

As we are dealing with a failing task it is good to check the application and scheduler logs (in this case our scheduler is Marathon). If doing this is insufficient, it can help to look at the Mesos Agent logs and/or to use `dcos task exec` when using UCR (or in a Docker containerizer, ssh into the node and use `docker exec`).

### Cleanup

Remove the application with

```bash
$ dcos marathon app remove /app-oom
```
