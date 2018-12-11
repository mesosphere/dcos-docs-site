---
layout: layout.pug
navigationTitle: Troubleshooting
title: Troubleshooting
menuWeight: 80
excerpt: Troubleshooting DC/OS Kubernetes
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->

# Troubleshooting Kubernetes

## Scheduler is not starting at all

If the scheduler task is not starting at all for your Kubernetes cluster, confirm that your DC/OS cluster contains enough resources to launch the cluster.
If it appears that there are enough resources available, verify that there are no existing quotas for that installation. If there are, verify that it contains correct values.  

See the [Resources section](/services/kubernetes/2.0.0-1.12.1/getting-started/install-basic/#resources) of the [Installing](/services/kubernetes/2.0.0-1.12.1/getting-started/install-basic/) page for more detail on setting up your cluster.

## Scheduler is restarting

If the scheduler task is starting for your Kubernetes cluster but is in a "Failed" restart loop, verify all of the installation [prerequisites](/services/kubernetes/2.0.0-1.12.1/getting-started/install-basic/#prerequisites) have been met.
This might include improperly configured Service Account and/or Service Account secret or other issues.

The simplest way is to look at the Kubernetes cluster's scheduler logs for any error messages. Here are a few examples of what you might see.

Service Account and Service Account secret was not specified or is not created:

```text
Exception in thread "main" java.lang.IllegalStateException: com.mesosphere.sdk.state.ConfigStoreException: Configuration failed validation without any prior target configurationavailable for fallback. Initial launch with invalid configuration? 1 Errors: 1: Field: 'service.service_account_secret'; Value: 'null'; Message: 'MUST specify a service account secret in DC/OS Enterprise.' (reason: LOGIC_ERROR)
	at com.mesosphere.sdk.scheduler.SchedulerBuilder.updateConfig(SchedulerBuilder.java:660)
	at com.mesosphere.sdk.scheduler.SchedulerBuilder.getDefaultScheduler(SchedulerBuilder.java:379)
	at com.mesosphere.sdk.scheduler.SchedulerBuilder.build(SchedulerBuilder.java:322)
	at com.mesosphere.sdk.scheduler.SchedulerRunner.run(SchedulerRunner.java:89)
	at com.mesosphere.sdk.kubernetes.scheduler.Main.main(Main.java:269)
Caused by: com.mesosphere.sdk.state.ConfigStoreException: Configuration failed validation without any prior target configurationavailable for fallback. Initial launch with invalid configuration? 1 Errors: 1: Field: 'service.service_account_secret'; Value: 'null'; Message: 'MUST specify a service account secret in DC/OS Enterprise.' (reason: LOGIC_ERROR)
	at com.mesosphere.sdk.config.DefaultConfigurationUpdater.updateConfiguration(DefaultConfigurationUpdater.java:119)
	at com.mesosphere.sdk.config.DefaultConfigurationUpdater.updateConfiguration(DefaultConfigurationUpdater.java:33)
	at com.mesosphere.sdk.scheduler.SchedulerBuilder.updateConfig(SchedulerBuilder.java:657)
```

Service Account and Service Account secret were specified but does not have the correct permissions:

```text
Exception in thread "main" java.lang.RuntimeException: java.io.IOException: Unable to list secret at 'dev/kubernetes0q': query='GET http://master.mesos/secrets/v1/secret/default/dev/kubernetes01?list=true HTTP/1.1', code=403, reason='Forbidden'
    at com.mesosphere.sdk.kubernetes.scheduler.tls.SecretsClientTLSStore.cleanupTempSecrets(SecretsClientTLSStore.java:267)
    at com.mesosphere.sdk.kubernetes.scheduler.tls.SecretsClientTLSStore.create(SecretsClientTLSStore.java:84)
    at com.mesosphere.sdk.kubernetes.scheduler.tls.EnterpriseTLSProvisioner.<init>(EnterpriseTLSProvisioner.java:79)
    at com.mesosphere.sdk.kubernetes.scheduler.tls.TLSProvisioner.create(TLSProvisioner.java:583)
    at com.mesosphere.sdk.kubernetes.scheduler.tls.TLSProvisioner.init(TLSProvisioner.java:119)
    at com.mesosphere.sdk.kubernetes.scheduler.Main.main(Main.java:239)
Caused by: java.io.IOException: Unable to list secret at 'dev/kubernetes0q': query='GET http://master.mesos/secrets/v1/secret/default/dev/kubernetes01?list=true HTTP/1.1', code=403, reason='Forbidden'
    at com.mesosphere.sdk.dcos.clients.SecretsClient.query(SecretsClient.java:158)
    at com.mesosphere.sdk.dcos.clients.SecretsClient.list(SecretsClient.java:93)
    at com.mesosphere.sdk.kubernetes.scheduler.tls.SecretsClientTLSStore.cleanupTempSecrets(SecretsClientTLSStore.java:265)
    ... 5 more
```

## Scheduler started but other tasks are not being launched

If the scheduler is running but no other tasks are being launched and the DC/OS cluster is running in strict mode, verify that the service account was [created correctly](/services/kubernetes/2.0.0-1.12.1/operations/customizing-install/#tls).
Below is an example of what you might see in the scheduler logs in such as a scenario:

```text
com.mesosphere.mesos.HTTPAdapter.MesosToSchedulerDriverAdapter:subscribe(115): Sending SUBSCRIBE call
[pool-13-thread-1] com.mesosphere.mesos.HTTPAdapter.MesosToSchedulerDriverAdapter:scheduleNextSubscription(134): Backing off for: 2180
[pool-13-thread-1] com.mesosphere.mesos.HTTPAdapter.MesosToSchedulerDriverAdapter:subscribe(115): Sending SUBSCRIBE call
[pool-13-thread-1] com.mesosphere.mesos.HTTPAdapter.MesosToSchedulerDriverAdapter:scheduleNextSubscription(134): Backing off for: 3314
[pool-13-thread-1] com.mesosphere.mesos.HTTPAdapter.MesosToSchedulerDriverAdapter:subscribe(115): Sending SUBSCRIBE call
[pool-13-thread-1] com.mesosphere.mesos.HTTPAdapter.MesosToSchedulerDriverAdapter:scheduleNextSubscription(134): Backing off for: 7042
[pool-13-thread-1] com.mesosphere.mesos.HTTPAdapter.MesosToSchedulerDriverAdapter:subscribe(115): Sending SUBSCRIBE call
[pool-13-thread-1] com.mesosphere.mesos.HTTPAdapter.MesosToSchedulerDriverAdapter:scheduleNextSubscription(134): Backing off for: 8962
[pool-13-thread-1] com.mesosphere.mesos.HTTPAdapter.MesosToSchedulerDriverAdapter:subscribe(115): Sending SUBSCRIBE call
[pool-13-thread-1] com.mesosphere.mesos.HTTPAdapter.MesosToSchedulerDriverAdapter:scheduleNextSubscription(134): Backing off for: 29982
```

## A restarting or unhealthy DC/OS task

In rare situations a DC/OS Kubernetes task may become unstable and require manual intervention.
In this case use the `dcos kubernetes cluster debug pod` [CLI](../cli#debug-pod-1) to assist in debugging and recovering failed, flapping or otherwise misbehaving tasks.

First run `dcos kubernetes cluster debug pod restart <pod> --cluster-name <cluster-name>` to simply restart the task on the same agent.
If that does not work or you know that specific agent is unhealthy, run `dcos kubernetes cluster debug pod replace <pod> --cluster-name <cluster-name>` to force the pod to be scheduled on a new agent.
It is also worth mentioning that the pod will only get scheduled to a new agent if there are enough resources available.

<p class="message--note"><strong>NOTE: </strong>Take precautions when dealing with unhealthy <tt>etcd</tt> tasks, see the section below for more detail.</p>

## Decommission a DC/OS agent

### Kube-node tasks

When one or more of your DC/OS agents require to be decommissioned it is important to first safely move any Kubernetes workloads from the nodes that are scheduled on that agent.

1. First drain one of the impacted Kubernetes nodes, forcing Kubernetes to reschedule any running pods onto other nodes:

```shell
kubectl drain <node name>
```

<p class="message--note"><strong>NOTE: </strong>Depending on the running workloads, you may need to include the flags <code>--delete-local-data</code> and/or <code>--ignore-daemonsets</code> when running the above command.</p>

2. Next, `replace` the corresponding DC/OS pod that is running on the to be decommissioned agent, this will schedule the pod onto a different agent:

```shell
dcos kubernetes cluster debug pod replace <pod> --cluster-name <cluster-name>
```

3. After the replaced DC/OS pod is in `Running` state and the Kubernetes node's status is `Ready,SchedulingDisabled`, it is safe to uncordon the node, allowing for workloads to be scheduled onto it once again:

```shell
kubectl uncordon <node name>
```

<p class="message--note"><strong>NOTE: </strong>Kubernetes will not actively rebalance the existing workloads onto the newly uncordoned node; however any future pods will be scheduled there.</p>

4. Repeat for all other kube nodes and DC/OS tasks that are scheduled on the same DC/OS agent replacing `<node name>`, `<pod>` and `<cluster-name>` with the appropriate values.

5. Finally, once all of the tasks have been successfully moved to different agents, it is safe to decommission the DC/OS agent:

```shell
dcos node decommission <mesos-id>
```

### Kube-control-plane tasks

Unlike with kube-node tasks, kube-control-plane tasks do not require draining before replacing.
However, to avoid downtime when decommissioning an agent with a kube-control-plane task, ensure the `kubernetes.high_availability` option set to `true`.

If HA mode is enabled, it is safe to run the command below and move the kube-control-plane task to a different agent:

```shell
dcos kubernetes cluster debug pod replace <pod> --cluster-name <cluster-name>
```

### Etcd tasks

As described in the [etcd section below](#troubleshooting-etcd) it is only possible to move an `etcd` task when the `kubernetes.high_availability` option is set to `true` and quorum is established.

Once you have confirmed that is the case, run the command below to move the `etcd` task to a different agent:

```shell
dcos kubernetes cluster debug pod replace <pod> --cluster-name <cluster-name>
```

# Troubleshooting `etcd`

The DC/OS Kubernetes package goes to great lengths to ensure proper operation of the `etcd` cluster in the presence of failures.
However, it is not possible to foresee and mitigate all possible situations, and in some cases manual intervention by the end-user may be required.
For instance, if an `etcd` process that has been added to an existing cluster crashes before actually being able to establish a connection with the other members, the cluster may become unstable or, in some circumstances, inoperable.
This document presents a number of best-practices that help reducing the chances of permanently losing an `etcd` cluster and the associated data. You should be familiar with the [Disaster Recovery](../disaster-recovery) section before reading this document.

## Failure Scenarios

There are four main failure scenarios that can lead to permanent failures in an `etcd` cluster created and managed by DC/OS Kubernetes:

1. **(Scenario 1)** When first creating the cluster, as when first installing DC/OS Kubernetes;
1. **(Scenario 2)** When scaling up the cluster, as when updating the value of `kubernetes.high_availability`;
1. **(Scenario 3)** When `kubernetes.high_availability` is `false` and the single member crashes, as when the DC/OS agent where the member is running permanently fails;
1. **(Scenario 4)** When `kubernetes.high_availability` is `true` and one or more members crash, as when there is a major outage of the DC/OS cluster.

### Scenario 1

The first scenario deals with failures that may happen when first installing DC/OS Kubernetes.
It is the least risky one as there is no pre-existing data stored in `etcd`, and hence there will be no data loss.

In this scenario, the easiest way towards recovery is to uninstall and re-install DC/OS Kubernetes.
Before re-installing DC/OS Kubernetes, make sure that all DC/OS agents are healthy, and that the DC/OS cluster itself is healthy and that there are no networking problems, and meets all the [prerequisites](/services/kubernetes/2.0.0-1.12.1/getting-started/install-basic/#prerequisites).

### Scenario 2

The second scenario deals with failures that may happen when switching the value of the `kubernetes.high_availability` from `false` to `true` (i.e. when scaling up the existing `etcd` cluster).
In this scenario there is the risk (albeit low) of permanently losing the `etcd` cluster and the associated data.
To prevent this situation or be prepared in case it arises, you can take a number of preventive measures.

#### Perform a backup of the existing installation

Before switching the value of `kubernetes.high_availability`, it is **STRONGLY ADVISED** to perform a backup of the current installation using the instructions in [Disaster Recovery](../disaster-recovery).
In the unlikely event of a failure in the `etcd` cluster while the scale-up operation is performed, uninstall DC/OS Kubernetes and use `dcos kubernetes cluster restore --cluster-name=CLUSTER-NAME` to restore the backup to a new cluster.
After the restore, retry updating the value of `kubernetes.high_availability` from `false` to `true`.
If this operation fails for the second or third time in a row, the DC/OS cluster may be unhealthy, and you are encouraged to contact technical support in order to further troubleshoot the problem.

#### Perform a snapshot of the `etcd` keyspace

In addition to creating a backup using `dcos kubernetes cluster backup --cluster-name=CLUSTER-NAME` as described above, it may also be a good idea to create a snapshot of the `etcd` keyspace using `etcdctl`.
This snapshot can be later used to restore an `etcd` cluster running outside DC/OS.
1. Run the following command (replacing the `<SERVICE_NAME>` placehold as appropriate) to create a snapshot:

```shell
dcos task exec <SERVICE_NAME>__etcd-0-peer \
    find . -name etcdctl -exec {} \
    --endpoints https://etcd-0-peer.<SERVICE_NAME>.mesos:2379 \
    --cacert ca-crt.pem \
    --cert etcd-crt.pem \
    --key etcd-key.pem \
    snapshot save etcd-0-peer.db \;
```

This will create a file named `etcd-0-peer.db` in the working directory of the `etcd-0-peer` task containing a snapshot of the `etcd` keyspace.
2. You should then fetch the `etcd-0-peer.db` file from inside the `etcd-0-peer` task and store it in a safe place (i.e. in their workstation or cloud storage).
3. To fetch the `etcd-0-peer.db` file from inside the `etcd-0-peer` task use the DC/OS UI or manually `scp` from the DC/OS agent.

#### Start with `kubernetes.high_availability=true` if setting up production

For production DC/OS Kubernetes clusters it is highly recommended to set `kubernetes.high_availability=true` when first installing the package.
This reduces the chance of data loss, and all failures occuring from this point fall into the previously described [Scenario 1](#scenario-1).

### Scenario 3

The third scenario deals with failures in the single `etcd` member that is in use when `kubernetes.high_availability` is set to `false`.
Two main types of failures can occur in this scenario:

1. The `etcd-0-peer` task crashes but the DC/OS agent remains healthy;
1. The DC/OS agent permanently fails.

When the `etcd-0-peer` task crashes but the DC/OS agent where it was running remains healthy, the task will simply be restarted on the same agent and the existing data will be preserved.
The DC/OS Kubernetes cluster as a whole may experience some instability, and some other tasks (such as `kube-control-plane-0-instance`) may also restart, but existing `etcd` data will be safe.
There is usually no need for manual intervention in this scenario.

When the DC/OS agent where `etcd-0-peer` was running permanently fails, and as mentioned in [Limitations](/services/kubernetes/2.0.0-1.12.1/limitations/), the contents of the `etcd` data directory will be **PERMANENTLY LOST**.
In order to restore data you will have to use `dcos kubernetes cluster restore --cluster-name=CLUSTER-NAME` as described in [Disaster Recovery](../disaster-recovery).
For this reason, it is **STRONGLY ADVISED** to periodically back up the DC/OS Kubernetes cluster(s) using `dcos kubernetes cluster backup --cluster-name=CLUSTER-NAME`, and to avoid running production workloads in a cluster where `kubernetes.high_availability` is set to `false`.

### Scenario 4

The fourth scenario deals with failures of `etcd` members when using `kubernetes.high_availability=true`.
Two main types of failures can occur in this scenario:

1. A single `etcd` task (e.g., `etcd-0-peer`) crashes permanently;
1. Two or more `etcd` task crash permanently.

Permanently losing a single `etcd` member does not pose a problem since quorum in the `etcd` cluster is not lost.
Data stored in `etcd` is also not lost, since there are still two active members holding the data.
In this scenario, simply clean up and re-launch a failed `etcd` member in a different DC/OS agent by running the following command (replacing `<SERVICE_NAME>` and `<etcd-task-name>` as appropriate):

```shell
$ dcos kubernetes cluster debug --cluster-name=CLUSTER-NAME pod replace <pod-name>
{
  "pod": "etcd-1",
  "tasks": [
    "etcd-1-peer",
    "etcd-1-recover"
  ]
}
```

However, permanently losing two or more members will cause the `etcd` cluster to lose quorum and become inoperable.
In this scenario you must use `dcos kubernetes cluster restore --cluster-name=CLUSTER-NAME` to re-create the DC/OS Kubernetes cluster from a previous backup, as described in [Disaster Recovery](../disaster-recovery).

## Further Reading

In order to gain a better insight on `etcd` troubleshooting and disaster recovery, as well as on why some of the described scenarios represent permanent quorum loss and failure of the `etcd` cluster, it is strongly recommended to read the official `etcd` [Disaster Recovery](https://coreos.com/etcd/docs/latest/op-guide/recovery.html) and [FAQ](https://coreos.com/etcd/docs/latest/faq.html) documents.
