---
layout: layout.pug
navigationTitle: Troubleshooting etcd
title: Troubleshooting etcd
menuWeight: 80
excerpt:
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


# Troubleshooting `etcd`

The DC/OS Kubernetes package goes to great lengths to ensure proper operation of
the `etcd` cluster in the presence of failures. However, it is not possible to
foresee and mitigate all possible situations, and in some cases manual
intervention by the end-user may be required. For instance, if an `etcd` process
that has been added to an existing cluster crashes before actually being able to
establish a connection with the other members, the cluster may become unstable
or, under some circumstances, inoperable. This document presents a number of
best-practices that help reducing the chances of permanently losing an `etcd`
cluster and the associated data. One is recommended to be familiar with the
[Disaster Recovery](../disaster-recovery) document before reading this document.

## Failure Scenarios

There are four main failure scenarios that can lead to permanent failures in
an `etcd` cluster created and managed by DC/OS Kubernetes:

1. **(Scenario 1)** When first creating the cluster (i.e. when first installing
   DC/OS Kubernetes);
1. **(Scenario 2)** When scaling up the cluster (i.e. when updating the value of
   `kubernetes.high_availability`);
1. **(Scenario 3)** When `kubernetes.high_availability` is `false` and the
   single member crashes (e.g. when the DC/OS agent where the member is
   running permanently fails);
1. **(Scenario 4)** When `kubernetes.high_availability` is `true` and one or
   more members crash (e.g. when there is a major outage of the DC/OS cluster).

### Scenario 1

The first scenario deals with failures that may happen when first installing
DC/OS Kubernetes. It is the less risky one since there is no pre-existing data
stored in `etcd`, and hence there may be no data loss.

In this scenario, and should any `etcd` member (i.e. task) fail to start, the
easiest way towards recovery is to uninstall and re-install DC/OS Kubernetes.
Before re-installing DC/OS Kubernetes, one should make sure that each DC/OS
agent is healthy, and that the DC/OS cluster itself is healthy (e.g. that there
are no networking problems) and meets all the [pre-requisites](../install).

### Scenario 2

The second scenario deals with failures that may happen when switching the value
of the `kubernetes.high_availability` from `false` to `true` (i.e. when scaling
up the existing `etcd` cluster). In this scenario there is the risk (albeit low)
of permanently losing the `etcd` cluster and the associated data. In order to
prevent this situation (but be prepared in case it arises), one can take a
number of preventive measures.

#### Perform a backup of the existing installation

Before transitioning the value of `kubernetes.high_availability`, one is
**STRONGLY ADVISED** to perform a backup of the current installation using the
instructions in [Disaster Recovery](../disaster-recovery). In the unlikely event
of a failure in the `etcd` cluster while the scale-up operation is performed,
one should uninstall DC/OS Kubernetes and use `dcos beta-kubernetes restore` in order
to restore the backup to a new cluster. One can then retry updating the value of `kubernetes.high_availability` from `false` to `true`. If this operation fails
for the second or third times in a row, one's DC/OS cluster may be unhealthy,
and one is encouraged to contact technical support in order to further
troubleshoot the problem.

#### Perform a snapshot of the `etcd` keyspace

Besides creating a backup using `dcos beta-kubernetes backup` as described above, it
may also be a good idea to create a snapshot of the `etcd` keyspace using
`etcdctl`. This snapshot can, if necessary, be restored to an `etcd` cluster
running outside DC/OS. In order to snapshot the `etcd` keyspace, one can run the
following command (replacing the `<SERVICE_NAME>` placehold as appropriate):

```
# dcos task exec <SERVICE_NAME>__etcd-0-peer \
    find . -name etcdctl -exec {} \
        --endpoints https://etcd-0-peer.<SERVICE_NAME>.mesos:2379 \
        --cacert ca-crt.pem \
        --cert etcd-crt.pem \
        --key etcd-key.pem \
        snapshot save etcd-0-peer.db \
    \;
```

This will create a file named `etcd-0-peer.db` in the working directory of the
`etcd-0-peer` task containing a snapshot of the `etcd` keyspace. One should then
fetch the `etcd-0-peer.db` file from inside the `etcd-0-peer` task and store it
in a safe place (i.e. in their workstation or cloud storage). In order to fetch
the `etcd-0-peer.db` file from inside the `etcd-0-peer` task one can use the
DC/OS UI or manually `scp` from the DC/OS agent.

#### Start with `kubernetes.high_availability=true` if setting up production

If one intends, from the very beginning, on setting up a production DC/OS
Kubernetes cluster, it is recommended that one uses
`kubernetes.high_availability=true` when first installing the package. This
reduces the chance of data loss, and all failures occuring from this point fall
into the previously described [Scenario 1](#scenario-1).

### Scenario 3

The third scenario deals with failures in the single `etcd` member that is in
use when `kubernetes.high_availability` is set to `false`. Two main types of
failures can occur in this scenario:

1. The `etcd-0-peer` task crashes but the DC/OS agent remains healthy;
1. The DC/OS agent permanently fails.

When the `etcd-0-peer` task crashes but the DC/OS agent where it is running
remains healthy, the task will simply be restarted in the same agent and the
existing data will be preserved. The DC/OS Kubernetes cluster as a whole may
experience some instability, and some other tasks (e.g.
`kube-control-plane-0-instance`) may also restart, but existing `etcd` data will
be safe. There is usually no need for manual intervention in this scenario.

When the DC/OS agent where `etcd-0-peer` is running permanently fails, and as
mentioned in [Limitations](../limitations), the contents of the `etcd` data
directory will be **PERMANENTLY LOST**. In order to restore data one will have
to use `dcos beta-kubernetes restore` as described in
[Disaster Recovery](../disaster-recovery). For this reason, one is **STRONLY
ADVISED** to periodically backup their DC/OS Kubernetes cluster using
`dcos beta-kubernetes backup`, and to avoid running production workloads in a cluster
where `kubernetes.high_availability` is set to `false`.

### Scenario 4

The fourth scenario deals with failures of `etcd` members when using
`kubernetes.high_availability=true`. Two main types of failures can occur in
this scenario:

1. A single `etcd` task (e.g., `etcd-0-peer`) crashes permanently;
1. Two or more `etcd` task crash permanently.

Permanently losing a single `etcd` member does not represent a problem, since
quorum in the `etcd` cluster is not lost. Data stored in `etcd` is also not
lost, since there are still two active members holding the data. In this
scenario, one may cleanup and re-launch a failed `etcd` member in a different
DC/OS agent by running the following command (replacing `<SERVICE_NAME>` and
`<etcd-task-name>` as appropriate):

```
# dcos beta-kubernetes --name=<SERVICE_NAME> pod replace <pod-name>
{
  "pod": "etcd-1",
  "tasks": [
    "etcd-1-peer",
    "etcd-1-recover"
  ]
}
```

However, permanently losing two or more members will cause the `etcd` cluster
to lose quorum and become inoperable. In this scenario one must use
`dcos beta-kubernetes restore` to re-create the DC/OS Kubernetes cluster from a
previous backup, as described in [Disaster Recovery](../disaster-recovery).


## Further Reading

In order to gain a better insight on `etcd` troubleshooting and disaster
recovery, as well as on why some of the described scenarios represent permanent
quorum loss and failure of the `etcd` cluster, one is strongly recommended to
read the official `etcd`
[Disaster Recovery](https://coreos.com/etcd/docs/latest/op-guide/recovery.html)
and [FAQ](https://coreos.com/etcd/docs/latest/faq.html) documents.
