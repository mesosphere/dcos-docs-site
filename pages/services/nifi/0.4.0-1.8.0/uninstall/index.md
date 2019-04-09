---
layout: layout.pug
navigationTitle:  Uninstalling
title: Uninstalling
menuWeight: 40
excerpt: Uninstalling DC/OS NiFi Services
featureMaturity:
enterprise: false
model: ../../data.yml
render: mustache
---

# Uninstalling in DC/OS 1.10 or later

If you are using DC/OS 1.10 or later:

Uninstall the service from the DC/OS CLI, by entering `dcos package uninstall <package_name> --app-id=<app-id>`.
For example, to uninstall the {{ model.techName }} instance named {{ model.packageName }}-dev, run:

```shell
dcos package uninstall --app-id={{ model.packageName }}-dev {{ model.packageName }}
```

## Uninstall Flow
<p class="message--warning"><strong>WARNING: </strong>Any data stored in reserved disk resources will be irretrievably lost.</p>

The scheduler is relaunched in Marathon with the environment variable SDK_UNINSTALL set to “true”. This puts the Scheduler in an uninstall mode.

The scheduler performs the uninstall with the following actions:

1. All running tasks for the service are terminated so that Mesos will reoffer their resources.
1. As the task resources are offered by Mesos, they are unreserved by the scheduler.
1. Once all known resources have been unreserved, the scheduler’s persistent state in ZooKeeper is deleted.

The cluster automatically removes the scheduler task once it advertises the completion of the uninstall process.

<p class="message--warning"><strong>WARNING: </strong>Once the uninstall operation has begun, it cannot be cancelled because it can leave the service in an uncertain, half-destroyed state.</p>

## Debugging an uninstall

In the vast majority of cases, this uninstall process goes off without a hitch. However, in certain situations, there can be snags along the way. For example, perhaps a machine in the cluster has permanently gone away, and the service being uninstalled had some resources allocated on that machine. This can result in the uninstall becoming stuck, because Mesos will never offer those resources to the uninstalling scheduler. As such, the uninstalling scheduler will not be able to successfully unreserve the resources it had reserved on that machine.

This situation is indicated by looking at the deploy plan while the uninstall is proceeding. The deploy plan may be viewed using either of the following methods:

- CLI: 
    ```
    dcos {{ model.packageName }} --name={{ model.packageName }} plan show deploy (after running dcos package install --cli {{ model.packageName }} if needed)
    ```
- HTTP:
    ```
    https://yourcluster.com/service/{{ model.packageName }}/v1/plans/deploy
    ```

**Deploy Plan in Progress**

```shell
dcos {{ model.packageName }} --name={{ model.packageName }} plan show deploy
deploy (serial strategy) (IN_PROGRESS)
└─ node (serial strategy) (IN_PROGRESS)
   ├─ {{ model.packageName }}-0:[init] (COMPLETE)
   ├─ {{ model.packageName }}-0:[node] (COMPLETE)
   ├─ {{ model.packageName }}-0:[metrics] (STARTING)
   ├─ {{ model.packageName }}-1:[node] (PENDING)
   └─ {{ model.packageName }}-1:[metrics] (PENDING)   
```    
**Deploy Plan after Completion**

```shell
deploy (serial strategy) (COMPLETE)
└─ node (serial strategy) (COMPLETE)
   ├─ {{ model.packageName }}-0:[init] (COMPLETE)
   ├─ {{ model.packageName }}-0:[node] (COMPLETE)
   ├─ {{ model.packageName }}-0:[metrics] (COMPLETE)
   ├─ {{ model.packageName }}-1:[node] (COMPLETE)
   └─ {{ model.packageName }}-1:[metrics] (COMPLETE)
```       
As we can see above, some of the resources to unreserve are stuck in a PENDING state. We can force them into a COMPLETE state, and thereby allow the scheduler to finish the uninstall operation. This may be done using either of the following methods:

- CLI: 
    ```
    dcos {{ model.packageName }} --name={{ model.packageName }} plan show deploy
    ```
- HTTP: 
    ```
    https://yourcluster.com/service/{{ model.packageName }}/v1/plans/deploy/forceComplete?phase=unreserve-resources&step=unreserve-<UUID>
    ```

At this point the scheduler should show a COMPLETE state for these steps in the plan, allowing it to proceed normally with the uninstall operation:

```shell
dcos {{ model.packageName }} --name={{ model.packageName }} plan show deploy
deploy (serial strategy) (COMPLETE)
├─ kill-tasks (parallel strategy) (COMPLETE)
│  ├─ kill-task- (COMPLETE)
│  ├─ kill-task-{{ model.packageName }}-0-init__4ea667b6-e784-4982-9c68-61af8732f552 (COMPLETE)
│  ├─ kill-task-{{ model.packageName }}-0-metrics__d438f4b5-d6d1-480c-8fd7-439943f5cba9 (COMPLETE)
│  ├─ kill-task-{{ model.packageName }}-0-node__3e16d999-0b72-4ca2-bee4-74c910acd8a3 (COMPLETE)
│  ├─ kill-task- (COMPLETE)
│  ├─ kill-task- (COMPLETE)
│  ├─ kill-task-{{ model.packageName }}-1-metrics__d0d1b9ca-e803-4392-9210-8088ee234df4 (COMPLETE)
│  ├─ kill-task-{{ model.packageName }}-1-node__a7704212-ce1f-4150-aa75-5f08a5fabbab (COMPLETE)
│  └─ kill-task- (COMPLETE)
├─ unreserve-resources (parallel strategy) (COMPLETE)
│  ├─ unreserve-91283d5b-2b0a-440e-a30d-f992f75320db (COMPLETE)
│  ├─ unreserve-70747305-1e3d-4792-b20d-07340f616e93 (COMPLETE)
│  ├─ unreserve-d42be42d-19e8-40ab-9635-48f70635c85f (COMPLETE)
│  ├─ unreserve-d35dd634-0476-4304-a198-66394f51621b (COMPLETE)
│  ├─ unreserve-66813bfa-9388-4ae2-bf77-78e409bf2551 (COMPLETE)
│  ├─ unreserve-2c50d053-bfdd-45f7-a5dc-4f525cc3339b (COMPLETE)
│  ├─ unreserve-45fe3b63-7182-4169-a44d-0d858085587e (COMPLETE)
│  ├─ unreserve-6ce13249-080d-4313-b3d6-a5e52cef9ab3 (COMPLETE)
│  ├─ unreserve-8673c61d-ad4d-43dc-bd6f-7ca0af45a531 (COMPLETE)
│  ├─ unreserve-04c83dd6-530f-4d52-a605-7658b8d90886 (COMPLETE)
│  ├─ unreserve-0eebd063-b804-455d-a066-8fd376d2feb5 (COMPLETE)
│  ├─ unreserve-523ce9e8-a467-4a5d-8b8e-ca7b09059982 (COMPLETE)
│  ├─ unreserve-1e540d1b-34d3-4e09-b9e5-5d66435c5f79 (COMPLETE)
│  ├─ unreserve-9b73d19f-67bc-4f10-8f44-b7e80c93d81f (COMPLETE)
│  ├─ unreserve-66a115e8-2249-4f65-8116-6984bf6e1bf2 (COMPLETE)
│  ├─ unreserve-ce0f4ba7-daf2-437c-aa2d-c786e77ba5c5 (COMPLETE)
│  ├─ unreserve-ad4a5977-c69d-4d9b-bbe0-0d12b69da414 (COMPLETE)
│  ├─ unreserve-a30655dd-2830-4b04-a0b2-865d6fb59c2e (COMPLETE)
│  ├─ unreserve-75861ac7-795a-45e9-8d2b-498a43597884 (COMPLETE)
│  ├─ unreserve-4698fdb8-0299-4db9-bd85-26416bad78b4 (COMPLETE)
│  ├─ unreserve-4007049a-9f6c-44cb-9433-ad1a24061749 (COMPLETE)
│  ├─ unreserve-9cf96948-28e6-4829-872a-58a0175459ef (COMPLETE)
│  ├─ unreserve-eeae0a40-8ae5-4bd2-ac31-9258cf5486ad (COMPLETE)
│  ├─ unreserve-c894002c-3559-4a01-bd50-01de1adfa2e6 (COMPLETE)
│  ├─ unreserve-887598ea-d9ec-4735-91c8-6a6998da0b5a (COMPLETE)
│  ├─ unreserve-bbb7a239-a36e-4443-b3a5-ff5a94545781 (COMPLETE)
│  ├─ unreserve-c35b60ed-7ad4-4c80-bd9a-2ceecf8f58e6 (COMPLETE)
│  ├─ unreserve-333a7c31-d637-482a-9c29-8e2aa2d5bdda (COMPLETE)
│  ├─ unreserve-3b2d0928-884d-41c4-a09c-369b310f9d0b (COMPLETE)
│  ├─ unreserve-c8eb2502-c14d-4365-863a-38081bd29dc5 (COMPLETE)
│  ├─ unreserve-39cca304-3cdc-4d52-a9d9-9253fc85ab26 (COMPLETE)
│  ├─ unreserve-dcc3bf75-45e9-484b-baac-8d5bae1d203f (COMPLETE)
│  ├─ unreserve-f3a60859-20de-4f81-a57f-6133ab3cfee5 (COMPLETE)
│  ├─ unreserve-79c62a5e-1ce2-40eb-9fb7-5896c2e324e3 (COMPLETE)
│  ├─ unreserve-6f33bb34-07bd-44cd-95c7-650cd19dcc4f (COMPLETE)
│  └─ unreserve-223dfa31-d221-4401-b9f1-cee1683a6b20 (COMPLETE)
└─ deregister-service (serial strategy) (COMPLETE)
   └─ deregister (COMPLETE)
```    

## Manual uninstall    

If all else fails, you can manually perform the uninstall yourself. To do this, perform the following steps:

1. Delete the uninstalling scheduler from Marathon.
1. Unregister the service from Mesos using its UUID as follows:

```shell
dcos service --inactive | grep {{ model.packageName }}
{{ model.packageName }}     False     3    3.3  6240.0  15768.0  97a0fd27-8f27-4e14-b2f2-fb61c36972d7-0096
dcos service shutdown 97a0fd27-8f27-4e14-b2f2-fb61c36972d7-0096
```

# Uninstalling in DC/OS 1.9

If you are running DC/OS 1.9, follow these steps:

1. Stop the service. From the DC/OS CLI, enter
    ```shell
    dcos package uninstall --app-id=<service_name>  <package_name>
    ```    
    For example:
    ```shell
    dcos package uninstall --app-id=/test/{{ model.serviceName }} {{ model.packageName }}
    ```                   
1. Clean up remaining reserved resources with the framework cleaner script, janitor.py. See [DC/OS documentation](https://docs.mesosphere.com/latest/deploying-services/uninstall/#framework-cleaner) for more information about the framework cleaner script.

    ```shell
    dcos package uninstall --app-id=/test/{{ model.packageName }} {{ model.packageName }}
    dcos node ssh --master-proxy --leader "docker run mesosphere/janitor /janitor.py \
    -r /test/{{ model.packageName }}-role \
    -p /test/{{ model.packageName }}-principal \
    -z dcos-service-/test/{{ model.packageName }}"
    ```      
