---
layout: layout.pug
navigationTitle: Cluster Sizing
title: Cluster Sizing
menuWeight: 5
excerpt: Planning and sizing clusters for increased performance
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->

DC/OS Kubernetes supports clusters that meet all the following criteria:

* No more than 85 Kubernetes nodes ([total of private and public](#sum-private-public-85)).
* No more than 8500 total Kubernetes pods.
* No more than 17000 total containers.
* No more than 100 Kubernetes pods per Kubernetes node.
* No more than 10 Kubernetes pods per core running on a Kubernetes node.

Note that these values are based on lightweight pods or containers like NGINX.
It is up to you as the DC/OS cluster operator to size each Kubernetes cluster appropriately for the specific type of workload you plan on running atop of it.
Also, please note that these criteria work on a _per Kubernetes cluster_ basis (e.g. it is possible to have 170 Kubernetes nodes on the same DC/OS cluster by creating two separate Kubernetes clusters).

# Planning the number of Kubernetes nodes

## Private Kubernetes nodes

Before creating a Kubernetes cluster, it is important to consider what your scale requirements are.
It is your responsibility to ensure there are enough resources available in the DC/OS cluster to satisfy the requirements of the Kubernetes cluster(s) you intend on creating.

A good way to size your Kubernetes cluster(s) is to ask yourself "_how many pods do I require?_".
From this, you can work out the minimum number of nodes that your Kubernetes cluster(s) will require to satisfy this requirement:

    Number of pods / 100 = Minimum number of private nodes

It is your responsibility to ensure that both the DC/OS cluster and each Kubernetes cluster have sufficient capacity, and that there is enough spare capacity to ensure the stability of each Kubernetes cluster.

## Public Kubernetes nodes

Another important question you must ask yourself is "_do I require ingress traffic into my Kubernetes cluster(s)?_".
If the answer to this question is positive, you need at least one public Kubernetes node - and hence at least one public DC/OS agent.
Please note that contrary to what happens with private Kubernetes nodes (of which there can by multiple instances per DC/OS agent), each public Kubernetes node require a _dedicated_ public DC/OS agent.

## Other considerations

### Enabling or disabling Calico's Typha

If your requirements dictate that your Kubernetes cluster must have more than 50 Kubernetes nodes, you must enable [Calico's Typha](https://github.com/projectcalico/typha) using the `calico.typha.enabled` package option.
The recommended number of Typha replicas in this scenario is 3, and you should set `calico.typha.replicas` accordingly.

### Maximum number of Kubernetes nodes

<a id="sum-private-public-85"></a>

Finally, a very important aspect to have in mind is that the number of private and public Kubernetes nodes **MUST NOT** exceed 85 _per Kubernetes cluster_.
In other words, you **MUST** ensure that the following condition is respected _at any given time_:

    kubernetes.private_node_count + kubernetes.public_node_count <= 85

You must take this into consideration when doing capacity planning and, if necessary, create multiple Kubernetes clusters to accomodate your scale requirements - distributing your workloads among them.
Failure to abide by this rule will result in a failed cluster, which may in turn result in permanent data loss.

# Planning the capacity of each Kubernetes node

After having performed large-scale testing we conclude that the default configuration works well in most scenarios.
However, you may still want to tweak the resources reserved for Kubernetes workloads in private Kubernetes nodes.
You can do this by specifying the following package options for private Kubernetes nodes, and their public counterparts for public Kubernetes nodes:

* `kubernetes.private_reserved_resources.kube_cpus`
* `kubernetes.private_reserved_resources.kube_mem`
* `kubernetes.private_reserved_resources.kube_disk`

You should take into consideration that, for each Kubernetes node, the value specified for `kubernetes.private_reserved_resources.kube_disk` is shared by the following entities:

* Kubernetes volumes of type `emptyDir` requested by Kubernetes pods running on said Kubernetes node;
* Images for the containers used by Kubernetes pods running on said Kubernetes node;
* Logs for each Kubernetes pod running on said Kubernetes node;
* Logs for the `kubelet` process itself;

You should also take into consideration that depending on the amount of Kubernetes pods running on each particular Kubernetes node, you may need to tweak the following package options (and/or their public counterparts):

* `kubernetes.private_reserved_resources.system_cpus`
* `kubernetes.private_reserved_resources.system_mem`

However, scenarios where this is required are uncommon.
In any case, and as mentioned above, you are responsible for making sure that each DC/OS agent have sufficient capacity to accomodate your Kubernetes cluster's resource requirements.

# Planning the capacity of the Kubernetes control-plane

By default, DC/OS Kubernetes deploys a single `etcd` and control-plane node per Kubernetes cluster.
However, whenever the intended usage of your Kubernetes cluster is running production workloads, you are **STRONGLY ADVISED** to set `kubernetes.high_availability` to `true`.
This can either be done when first creating the Kubernetes cluster, or later on when promoting said Kubernetes cluster to production.

Given that each control-plane task is itself a Kubernetes node, there are control-plane-specific counterparts to most of the abovementioned node-related options:

* `kubernetes.control_plane_reserved_resources.cpus`
* `kubernetes.control_plane_reserved_resources.mem`
* `kubernetes.control_plane_reserved_resources.disk`

We find the default values for these options to be sufficient for most clusters given the current limitation of 85 Kubernetes nodes per Kubernetes cluster.
However, these can also be tweaked at will when required.
This is especially important if your workloads make heavy usage of the Kubernetes API (e.g. when you are deploying workloads such as [`etcd-operator`](https://github.com/coreos/etcd-operator) or [`cert-manager`](https://github.com/jetstack/cert-manager)).

## Increasing `etcd`'s performance

Kubernetes uses [`etcd`](https://coreos.com/etcd/) as its data store.
Hence, increasing the performance of `etcd` can lead to significant performance and stability benefits to a Kubernetes cluster.

DC/OS Kubernetes provides reasonable defaults for `etcd`, but in order to get the best performance out of it, it is important to use fast disks.
Therefore, when possible, it is advised to back `etcd`'s storage with an SSD.
Like in the scenarios described above, it is your responsibility to provision these disks in your DC/OS cluster.

Finally, you may find it necessary to tweak the value of the following options under some circumstances:

* `etcd.cpus`
* `etcd.mem`
* `etcd.wal_disk`
* `etcd.data_disk`

It should be noted that `etcd.wal_disk` and `etcd.data_disk` **MUST NOT** be updated after the Kubernetes cluster has been created.
Doing so will cause permanent data loss.
