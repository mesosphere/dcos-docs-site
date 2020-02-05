---
layout: layout.pug
navigationTitle: Uninstall
excerpt: Uninstalling Hive Metastore
title: Uninstalling Hive Metastore
menuWeight: 55
model: /mesosphere/dcos/services/hive-metastore/data.yml
render: mustache
---

Uninstalling the service is simple.

From the DC/OS CLI, enter 

```shell
dcos package uninstall --app-id=<service-name> {{ model.packageName }}
```

### Uninstall process

<p class="message--warning"><strong>WARNING: </strong>Once the uninstall operation has begun, it cannot be cancelled because doing so can leave the service in an uncertain, half-destroyed state. Any data stored in reserved disk resources will be irretrievably lost.</p>

Uninstalling the service consists of the following steps:

1. The service scheduler is relaunched with the environment variable `SDK_UNINSTALL` set to "true". This puts the service into an uninstall mode.
1. The service scheduler performs the uninstall with the following actions:
    - All running tasks for the service are terminated.
    - All reserved resources are unreserved by the scheduler.
    - Once all known resources have been unreserved, the scheduler's persistent state is deleted.
1. The cluster automatically removes the scheduler task once it advertises the completion of the uninstall process.

## Debugging an uninstall

There are certain situations under which the automated uninstall process cannot complete without manual intervention.

### <a name="zombie-service-scheduler"></a>Zombie service scheduler

If the service scheduler reports in its `stdout` that the uninstall is complete, but the scheduler is not removed from the system, you can safely delete it via Marathon.

### Missing DC/OS agent

The service will not complete the uninstall if it is not able to unreserve all the resources it has previously reserved. A common cause of this is a DC/OS agent for which the service had reserved resources, which is no longer part of the DC/OS cluster.

- If the agent is only temporarily gone due to maintenance, the service will unreserve the resources when the agent returns to the cluster.

- If the agent has been permanently removed, then the uninstall will hang indefinitely. The easiest way to prevent this, is to perform `pod replace` on any pod deployed to the lost agent before initiating the uninstall.

- If the missing agent is only discovered after the uninstall is initiated, then the following process can be used to allow the uninstall to complete.

First determine what resources the service is waiting on.

- CLI: `dcos {{ model.packageName }} --name={{ model.serviceName }} plan show deploy` (after running `dcos package install --cli {{ model.packageName }}` if needed)
- HTTP: `https://yourcluster.com/service/{{ model.serviceName }}/v1/plans/deploy`

```bash
dcos {{ model.packageName }} --name={{ model.serviceName }} plan show deploy
deploy (IN_PROGRESS)
├─ kill-tasks (COMPLETE)
│  ├─ kill-task-node-0-server__1a4114bc-48bb-47f6-be99-1b5ca6d55c4e (COMPLETE)
│  ├─ kill-task-node-1-server__0c42118e-04fd-40e1-b49d-0d3f71d2d243 (COMPLETE)
│  └─ kill-task-node-2-server__e00cad38-f27f-4332-b1df-5118ca480d50 (COMPLETE)
├─ unreserve-resources (IN_PROGRESS)
│  ├─ unreserve-f41351a2-b478-4e13-a94c-705f530989ef (COMPLETE)
│  ├─ unreserve-48f64612-8427-4cde-86f4-4edeb9efff37 (COMPLETE)
│  ├─ unreserve-402d51f5-6014-4ca3-bd13-324dae62b888 (PENDING)
│  ├─ unreserve-cb95e869-277f-48b9-954f-08c0d7a26bcf (PENDING)
│  ├─ unreserve-cbd748d0-df7b-4d01-b0b7-6acf915d8f98 (COMPLETE)
│  ├─ unreserve-00ed63d6-427c-4492-9713-772390cc5241 (COMPLETE)
│  ├─ unreserve-5dd56b1d-4522-4bbd-88b5-de9fa0f181f2 (PENDING)
│  └─ unreserve-c9915f07-f446-4e14-a6b4-12c8dd2f914b (COMPLETE)
└─ deregister-service (PENDING)
   └─ deregister (PENDING)
```

As we can see above, some of the resources to unreserve are stuck in a `PENDING` state. We can force them into a `COMPLETE` state, and thereby allow the scheduler to finish the uninstall operation. This may be done using either of the following methods:
- CLI: `dcos {{ model.packageName }} --name={{ model.serviceName }} plan show deploy`
- HTTP: `https://yourcluster.com/service/{{ model.serviceName }}/v1/plans/deploy/forceComplete?phase=unreserve-resources&step=unreserve-<UUID>`

```bash
dcos {{ model.packageName }} --name={{ model.serviceName }} plan force-complete deploy unreserve-resources unreserve-402d51f5-6014-4ca3-bd13-324dae62b888
dcos {{ model.packageName }} --name={{ model.serviceName }} plan force-complete deploy unreserve-resources unreserve-cb95e869-277f-48b9-954f-08c0d7a26bcf
dcos {{ model.packageName }} --name={{ model.serviceName }} plan force-complete deploy unreserve-resources unreserve-5dd56b1d-4522-4bbd-88b5-de9fa0f181f2
```

At this point the scheduler should show a `COMPLETE` state for these steps in the plan, allowing it to proceed normally with the uninstall operation:

```shell
dcos {{ model.packageName }} --name={{ model.serviceName }} plan show deploy
deploy (IN_PROGRESS)
├─ kill-tasks (COMPLETE)
│  ├─ kill-task-node-0-server__1a4114bc-48bb-47f6-be99-1b5ca6d55c4e (COMPLETE)
│  ├─ kill-task-node-1-server__0c42118e-04fd-40e1-b49d-0d3f71d2d243 (COMPLETE)
│  └─ kill-task-node-2-server__e00cad38-f27f-4332-b1df-5118ca480d50 (COMPLETE)
├─ unreserve-resources (COMPLETE)
│  ├─ unreserve-f41351a2-b478-4e13-a94c-705f530989ef (COMPLETE)
│  ├─ unreserve-48f64612-8427-4cde-86f4-4edeb9efff37 (COMPLETE)
│  ├─ unreserve-402d51f5-6014-4ca3-bd13-324dae62b888 (COMPLETE)
│  ├─ unreserve-cb95e869-277f-48b9-954f-08c0d7a26bcf (COMPLETE)
│  ├─ unreserve-cbd748d0-df7b-4d01-b0b7-6acf915d8f98 (COMPLETE)
│  ├─ unreserve-00ed63d6-427c-4492-9713-772390cc5241 (COMPLETE)
│  ├─ unreserve-5dd56b1d-4522-4bbd-88b5-de9fa0f181f2 (COMPLETE)
│  └─ unreserve-c9915f07-f446-4e14-a6b4-12c8dd2f914b (COMPLETE)
└─ deregister-service (PENDING)
   └─ deregister (PENDING)
```

<p class="message--note"><strong>NOTE: </strong>As it may take the operator some time to complete these actions, the service scheduler may be left in a zombie state after the uninstall is complete.
See the "Zombie service scheduler" section above for instructions on how to correct this.</p>
