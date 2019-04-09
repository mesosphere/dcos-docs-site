---
layout: layout.pug
navigationTitle: Job Scheduling  
excerpt: Scheduling jobs with DC/OS Apache Spark
title: Job Scheduling
menuWeight: 110
featureMaturity:
render: mustache
model: /services/spark/data.yml
---

This section is a simple overview of material described in greater detail in the Apache {{ model.techShortName }} documentation [here][1] and [here][2].

# Modes

{{ model.techShortName }} on Mesos supports two modes of operation: coarse-grained mode and fine-grained mode. Coarse-grained mode provides lower latency, whereas fine-grained mode provides higher utilization. You can find nore information [here][2].

# Coarse-grained mode

With the **Coarse-grained mode**, each {{ model.techShortName }} **executor** is represented by a single Mesos task. As a result, executors have a constant size throughout their lifetime.

*   **Executor memory**: `spark.executor.memory`
*   **Executor CPUs**: `spark.executor.cores`, or all the cores in the offer.
*   **Number of Executors**: `spark.cores.max` / `spark.executor.cores`. Executors are brought up until
    `spark.cores.max` is reached. Executors survive for duration of the job.
*   **Executors per agent**: Multiple

<p class="message--important"><strong>IMPORTANT: </strong>We highly recommend you set <code>spark.cores.max</code>. If you do not, your {{ model.techShortName }} job may consume all available resources in your cluster, resulting in unhappy peers.</p>

# Quota for drivers and executors

Setting [Mesos Quota](http://mesos.apache.org/documentation/latest/quota/) for the drivers prevents the Dispatcher from consuming too many resources and assists queueing behavior. 

To control the number of drivers the {{ model.techShortName }} service runs concurrently, you should set a quota for the drivers. The quota guarantees that the {{ model.techShortName }} Dispatcher has resources available to launch drivers **and** limits the total impact on the cluster due to drivers. 

Optionally, you can set a quota for the drivers to consume to ensure that drivers are not starved of resources by other frameworks and make sure they do not consume too much of the cluster. For more information, see [coarse-grained mode](#coarse-grained-mode) above.

## Best practices for setting drivers

The quota for the drivers allows the operator of the cluster to ensure that only a given number of drivers are concurrently running. As additional drivers are submitted, they are queued by the {{ model.techShortName }} Dispatcher.

Use the following guidelines to achieve best results:
- Set the quota conservatively, but be aware that the setting affects the number of jobs that can run concurrently.
- Decide how much of your cluster's resources to allocate to running drivers. Allocated resources are only be used for the {{ model.techShortName }} drivers, meaning that you can decide roughly how many concurrent jobs you would like to have running at a time. As additional jobs are submitted, they are queued and run with first-in-first-out semantics.
- For the most predictable behavior, enforce uniform driver resource requirements and a particular quota size for the Dispatcher. For example, if each driver consumes 1.0 cpu and it is desirable to run up to 5 {{ model.techShortName }} jobs concurrently, you should create a quota that specifies 5 CPUs.

### Setting quota for the drivers

1. SSH to the Mesos master and set the quota for a role (`dispatcher` in this example):

    ```bash
    $ cat dispatcher-quota.json
    {
    "role": "dispatcher",
    "guarantee": [
      {
        "name": "cpus",
        "type": "SCALAR",
        "scalar": { "value": 5.0 }
      },
      {
        "name": "mem",
        "type": "SCALAR",
        "scalar": { "value": 5120.0 }
      }
    ]
    }
    $ curl -d @dispatcher-quota.json -X POST http://<master>:5050/quota
    ```

1. Install the {{ model.techShortName }} service with the following options (at a minimum):

    ```bash
    $ cat options.json
    {
        "service": {
            "role": "dispatcher"
        }
    }
    $ dcos package install spark --options=options.json
    ```

## Best practices for the executors

It is recommended to allocate a quota for {{ model.techShortName }} job executors.  Allocating quota for the {{ model.techShortName }} executors provides:
* A guarantee that {{ model.techShortName }} jobs  receive the requested amount of resources.
* Additional assurance that even if misconfigured (for example, with a driver with `spark.cores.max` unset), {{ model.techShortName }} jobs do not consume resources that impact other tenants on the cluster.

The drawback to allocating quota to the executors is that quota resources cannot be used by other frameworks in the cluster.

### Setting quota for the executors

Quota can be allocated for {{ model.techShortName }} executors in the same way it is allocated for {{ model.techShortName }} dispatchers.  If you want to run 100 executors concurrently, each with 1.0 CPU and 4096 MB of memory, you would do the following:

```bash
$ cat executor-quota.json
{
  "role": "executor",
  "guarantee": [
    {
      "name": "cpus",
      "type": "SCALAR",
      "scalar": { "value": 100.0 }
    },
    {
      "name": "mem",
      "type": "SCALAR",
      "scalar": { "value": 409600.0 }
    }
  ]
}
$ curl -d @executor-quota.json -X POST http://<master>:5050/quota

```

When {{ model.techShortName }} jobs are submitted, they must indicate the role for which the quota has been set to consume resources from this quota. For example:

```bash
$ dcos spark run --verbose --name=spark --submit-args="\
--driver-cores=1 \
--driver-memory=1024M \
--conf spark.cores.max=8 \
--conf spark.mesos.role=executor \
--class org.apache.spark.examples.SparkPi \
http://downloads.mesosphere.com/spark/assets/spark-examples_2.11-2.0.1.jar 3000"
```

<p class="message--important"><strong>IMPORTANT: </strong>: To prevent a single long-running or streaming {{ model.techShortName }} job from consuming the entire quota, you should set the maximum CPUs for the {{ model.techShortName }} job to roughly one “job’s worth” of the quota’s resources. This setting ensures that the {{ model.techShortName }} job gets sufficient resources to make progress, and prevents the job from starving other {{ model.techShortName }} jobs of resources and provides predictable offer suppression semantics.

## Permissions when using quota with strict mode

Strict mode clusters (see [security modes](/1.12/security/ent/#security-modes)) require extra
permissions to be set before you can use quota. Follow the instructions in [installing](https://github.com/mesosphere/spark-build/blob/master/docs/install.md) and add the additional permissions for the roles you intend to use, as detailed below.

Using the example above, you would set permissions as follows:

1. First set the quota for the Dispatcher's role (`dispatcher`):

    ```bash
    $ cat dispatcher-quota.json
    {
      "role": "dispatcher",
      "guarantee": [
        {
          "name": "cpus",
          "type": "SCALAR",
          "scalar": { "value": 5.0 }
        },
        {
          "name": "mem",
          "type": "SCALAR",
          "scalar": { "value": 5120.0 }
        }
      ]
    }
    ```

    If you have downloaded the CA certificate,`dcos-ca.crt` to your local machine from the `https://<dcos_url>/ca/dcos-ca.crt` endpoint, set the quota **from your local machine**:

    ```bash
    curl -X POST --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/mesos/quota -d @dispatcher-quota.json -H 'Content-Type: application/json'
    ```

1. Optionally, set the quota for the executors using the same settings as above:

    ```bash
    $ cat executor-quota.json
    {
      "role": "executor",
      "guarantee": [
        {
          "name": "cpus",
          "type": "SCALAR",
          "scalar": { "value": 100.0 }
        },
        {
          "name": "mem",
          "type": "SCALAR",
          "scalar": { "value": 409600.0 }
        }
      ]
    }
    ```

1. If you have not already done so, set the quota from your local machine. For example, assuming you have `dcos-ca.crt` locally:

    ```bash
    curl -X POST --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/mesos/quota -d @executor-quota.json -H 'Content-Type: application/json'
    ```

1. Install {{ model.techShortName }} with these minimal configuration settings:

    ```bash
    {
        "service": {
                "service_account": "spark-principal",
                "role": "dispatcher",
                "user": "root",
                "service_account_secret": "spark/spark-secret"
        }
    }
    ```
1. Now you are ready to run a {{ model.techShortName }} job using the principal you set and the roles:

    ```bash
    dcos spark run --verbose --submit-args=" \
    --conf spark.mesos.principal=spark-principal \
    --conf spark.mesos.role=executor \
    --conf spark.mesos.containerizer=mesos \
    --class org.apache.spark.examples.SparkPi http://downloads.mesosphere.com/spark/assets/spark-examples_2.11-2.0.1.jar 100"
    ```

# Setting `spark.cores.max`

To improve {{ model.techShortName }} job execution reliability, set the maximum number of cores consumed by any given job. This avoids any particular {{ model.techShortName }} job from consuming too many resources in a cluster. It is highly recommended that each {{ model.techShortName }} job be submitted with a limitation on the maximum number of cores (CPUs) it can consume. This is especially important for long-running and streaming {{ model.techShortName }} jobs.

  ```bash
  $ dcos spark run --verbose --name=spark --submit-args="\
  --driver-cores=1 \
  --driver-memory=1024M \
  --conf spark.cores.max=8 \ #<< Very important!
  --class org.apache.spark.examples.SparkPi \
  http://downloads.mesosphere.com/spark/assets/spark-examples_2.11-2.0.1.jar 3000"
  ```

When running multiple concurrent {{ model.techShortName }} jobs, consider setting `spark.cores.max` between `<total_executor_quota>/<max_concurrent_jobs>` and `<total_executor_quota>`, depending on your workload characteristics and goals.

# Fine-grained mode (deprecated)

<p class="message--note"><strong>NOTE: </strong>Fine-grained mode has been deprecated and does not have all of the features of coarse-grained mode.</p>

In "fine-grained" mode, each {{ model.techShortName }} **task** is represented by a single Mesos task. When a {{ model.techShortName }} task finishes, the resources represented by its Mesos task are relinquished. Fine-grained mode enables finer-grained resource allocation at
the cost of task startup latency.

* **Executor memory**: `spark.executor.memory`
* **Executor CPUs**: Increases and decreases as tasks start and terminate.
* **Number of Executors**: Increases and decreases as tasks start and terminate.
* **Executors per agent**: At most 1

# Properties

The following is a description of the most common {{ model.techShortName }} scheduling properties on Mesos. For a full list, see the [{{ model.techShortName }}
configuration page][1] and the [{{ model.techShortName }} on Mesos configuration page][2].

<table class="table">
<tr>
<th>property</th>
<th>default</th>
<th>description</th>
</tr>

<tr>
<td>spark.mesos.coarse</td>
<td>true</td>
<td>Described above.</td>
</tr>

<tr>
<td>spark.executor.memory</td>
<td>1g</td>
<td>Executor memory allocation.</td>
</tr>

<tr>
<td>spark.executor.cores</td>
<td>All available cores in the offer</td>
<td>Coarse-grained mode only. DC/OS {{ model.techName }} >= 1.6.1. Executor CPU allocation.</td>
</tr>

<tr>
<td>spark.cores.max</td>
<td>unlimited</td>
<td>Maximum total number of cores to allocate.</td>
</tr>
</table>

[1]: http://spark.apache.org/docs/latest/configuration.html
[2]: http://spark.apache.org/docs/latest/running-on-mesos.html
