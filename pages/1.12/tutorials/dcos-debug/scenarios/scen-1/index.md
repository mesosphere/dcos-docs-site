---
layout: layout.pug
title: Scenario 1
navigationTitle: Scenario 1
excerpt: Tutorial - Resource Allocation
menuWeight: 1
---
#include /include/tutorial-disclaimer.tmpl

<a name=c1></a>

## Scenario 1: Resource Allocation

### Setup

For this first scenario, deploy [this app definition](https://raw.githubusercontent.com/dcos-labs/dcos-debugging/master/1.10/app-scaling1.json) as follows:

```bash
$ dcos marathon app add https://raw.githubusercontent.com/dcos-labs/dcos-debugging/master/1.10/app-scaling1.json
```

Check the application status using the DC/OS web interface, you should see something like the following:

![Pic of web interface](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-14.png)

Figure 1. DC/OS web interface showing app status

with the status of the application most likely to be “Waiting” followed by some number of thousandths “x/1000”. "Waiting" refers to the overall application status and the number; "x" here represents how many instances have successfully deployed (6 in this example).

You can also check this status from the CLI:

```bash
$ dcos marathon app list
```

would produce the following output in response:

```bash
ID              MEM   CPUS  TASKS   HEALTH  DEPLOYMENT  WAITING  CONTAINER  CMD

/app-scaling-1  128    1    6/1000   ---      scale     True       mesos    sleep 10000
```

Or, if you want to see all ongoing deployments, enter:

```bash
$ dcos marathon deployment list
```

to see something like the following:

```bash
APP             POD  ACTION  PROGRESS  ID

/app-scaling-1  -    scale     1/2     c51af187-dd74-4321-bb38-49e6d224f4c8
```

So now we know that some (6/1000) instances of the application have successfully deployed, but the overall deployment status is “Waiting”. But what does this mean?

### Resolution

The “Waiting” state means that DC/OS (or more precisely Marathon) is waiting for a suitable resource offer. So it seems to be an deployment issue and we should start by checking the available resources.

If we look at the DC/OS dashboard, we should see a pretty high CPU allocation similar to the following (of course, the exact percentage depends on your cluster):

![Pic of CPU Allocation](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-20.png)

Figure 2. DC/OS resource allocation display

Since we are not yet at 100% allocation, but we are still waiting to deploy, something interesting is going on. So let’s look at the recent resource offers in the debug view of the DC/OS web interface.

![Pic of relevant instance of web interface](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-21.png)

Figure 3. Recent resource offers

We can see that there are no matching CPU resources. But again, the overall CPU allocation is only at 75%. Further puzzling, when we take a look at the 'Details' section further below, we see that the latest offers from a different host match the resource requirements of our application. So, for example, the first offer coming from host `10.0.0.96` matched the role, constraint (not present in this `app-definition`) memory, disk, port resource requirements --- but failed the CPU resource requirements. The offer before this also seemed like it should have met the resource requirements. **So despite it looking like we have enough CPU resources available, the application seems to be failing for just this reason**.

Let's look at the 'Details' more closely.

![Pic of details](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-22.png)

Figure 4. Rsource allocation details

Interesting. According to this, some of the remaining CPU resources are allocated to a different [Mesos resource role](http://mesos.apache.org/documentation/latest/roles/) and so cannot be used by our application (it runs in role '*', the default role).

To check the roles of different resources let us have a [look at the state-summary endpoint](/tutorials/dcos-debug/tools/#state-summary), which you can access at `https://<master-ip>/mesos/state-summary`.

That endpoint will give us a rather long json output, so it is helpful to use jq to make the output readable:

```bash
curl -skSL

-X GET

-H "Authorization: token=$(dcos config show core.dcos_acs_token)"

-H "Content-Type: application/json"

"$(dcos config show core.dcos_url)/mesos/state-summary" |

jq '.'
```

When looking at the agent information we can see two different kinds of agent.

![Pic of cluster information](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-19.png)

Figure 5. Cluster information

The first kind has no free CPU resources and also no reserved resources. Of course, this might be different if you had other workloads running on your cluster prior to these exercises. Note that these unreserved resources correspond to the default role '*' --- the role by which we are trying to deploy our tasks.

The second kind has unused CPU resources, but these resources are reserved in the role 'slave_public'.

We now know that **the issue is that there are not enough resources in the desired resource role across the entire cluster**. As a solution we could either scale down the application (1000 instances does seem a bit excessive), or we need to add more resources to the cluster.

### General Pattern

##### When your application framework (e.g. Marathon) is not accepting resource offers, check whether there are sufficient resources available in the respective resource role.

This was a straightforward scenario with too few CPU resources. Typically resource issues are more likely caused by more complex factors - such as improperly configured [port resources](/deploying-services/service-ports/) or [placement constraints](/deploying-services/marathon-constraints/). Nonetheless, this general workflow pattern still applies.

### Cleanup

Remove the application from the cluster with:

`$ dcos marathon app remove /app-scaling-1`
