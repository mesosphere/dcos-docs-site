---
layout: layout.pug
navigationTitle: Node Pools
title: Node Pools
menuWeight: 50
excerpt: Configure node pools for the Konvoy cluster
beta: true
enterprise: false
---

<p class="message--warning"><strong>WARNING: </strong> You can not change the configuration of your control plane nodes. Any attempts to add or remove nodes, which could break the cluster, are prevented and an error message is displayed.</p>

In this section, you will learn how to configure multiple node pools for a Konvoy cluster.
Node pools allow the cluster administrator to use different configurations for different sets of worker nodes in a heterogeneous environment.

<p class="message--important"><strong>IMPORTANT: </strong> Do not change the configuration of a deployed node pool. Changing the configuration of a deployed node pool, and running  `konvoy provision` or `konvoy up`, destroys and re-creates the machines, disrupting your workloads on these machines. To change the configuration of a node pool, see <a href="../../operations/managing-nodes#changing-nodes-in-an-aws-azure-cluster">Changing Nodes in an AWS / Azure Cluster</a>.</p>

## Configure multiple node pools for an on-premises cluster

The following example will show you how to configure multiple node pools for an on-premises Konvoy cluster.

Assume that the cluster administrator wants to have a dedicated host for the monitoring pipeline (such as Prometheus), because it is very critical to the entire cluster and should not be interfered with by any other pods.

Since this is an on-premises deployment, you need to specify the [Ansible][ansible] inventory file (such as `inventory.yaml`) manually, as in the following:

```yaml
control-plane:
  hosts:
    10.0.194.142:
      ansible_host: 10.0.194.142
    10.0.198.130:
      ansible_host: 10.0.198.130
    10.0.200.148:
      ansible_host: 10.0.200.148

node:
  hosts:
    10.0.130.168:
      ansible_host: 10.0.130.168
      node_pool: worker
    10.0.133.221:
      ansible_host: 10.0.133.221
      node_pool: worker
    10.0.139.120:
      ansible_host: 10.0.139.120
      node_pool: worker
    10.0.131.62:
      ansible_host: 10.0.131.62
      node_pool: monitoring

all:
  vars:
    version: v1beta1
    order: sorted
    ansible_user: "centos"
    ansible_port: 22
```

Notice that in the `nodes` section, each host has a string attribute called `node_pool`.
This field specifies the node pool to which a host belongs.

In this case, node `10.0.131.62` belongs to node pool `monitoring`, and the rest of the nodes belong to node pool `worker`.

Since the `monitoring` node pool is dedicated for the monitoring pipeline, you need to [taint][taint_toleration] the nodes in that node pool so that regular pods will not be scheduled on those hosts.
You may also want to add some special labels to the nodes in the node pool so that users can use node selectors to schedule pods on those nodes.

To configure the taints and labels, edit the cluster configuration file (such as `cluster.yaml`) like the following:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  nodePools:
  - name: worker
  - name: monitoring
    labels:
      - key: dedicated
        value: monitoring
    taints:
      - key: dedicated
        value: monitoring
        effect: NoExecute
```

The above configuration will add the label `dedicated: monitoring` and apply the `dedicated: monitoring` taint to all nodes in the `monitoring` node pool.

Note that all node pools specified in the inventory file (such as `inventory.yaml`) should have a corresponding entry in the `spec.nodePools` section of `ClusterConfiguration`.
If not, the validation will fail.

Then, configure the Prometheus addon like the following so that it will be scheduled on the dedicated node (such as `monitoring` node pool).

```yaml
- name: prometheus
  enabled: true
  values: |
    prometheus:
      prometheusSpec:
        tolerations:
          - key: "dedicated"
            operator: "Equal"
            value: "monitoring"
            effect: "NoExecute"
        nodeSelector:
          dedicated: "monitoring"
```

Once all configurations are complete, run `konvoy up` to install the cluster.
The labels and taints will be applied accordingly to the corresponding nodes. Prometheus will be scheduled on the dedicated node for monitoring purposes.

During the install process, all of the nodes will also be labeled with `konvoy.mesosphere.com/node_pool=<node_pool>`, where `<node_pool` corresponds to the value specified in the `inventory.yaml` file.
If the `node_pool` property is empty, the control-plane  node(s) will be automatically labeled with `konvoy.mesosphere.com/node_pool=konvoy.mesosphere.com_control-plane`, similarly the worker nodes will be labeled with `konvoy.mesosphere.com/node_pool=konvoy.mesosphere.com_default-node-pool`.

## Configure multiple node pools for as AWS cluster

Configuring node pools for AWS deployment is mostly the same as on-premises deployment; however, you do not need to configure the inventory file manually, as it is automatically generated by the AWS provisioner.

You can add node pools to the `ClusterProvisioner` configuration like the following:

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  nodePools:
  - name: worker
    count: 3
    machine:
      rootVolumeSize: 80
      rootVolumeType: gp2
      imagefsVolumeEnabled: true
      imagefsVolumeSize: 160
      imagefsVolumeType: gp2
      imagefsVolumeDevice: xvdb
      type: m4.4xlarge
  - name: control-plane
    controlPlane: true
    count: 3
    machine:
      rootVolumeSize: 80
      rootVolumeType: gp2
      imagefsVolumeEnabled: true
      imagefsVolumeSize: 160
      imagefsVolumeType: gp2
      imagefsVolumeDevice: xvdb
      type: i3.xlarge
  - name: monitoring
    count: 1
    machine:
      rootVolumeSize: 80
      rootVolumeType: gp2
      type: m4.4xlarge
```

The rest of the configuration will be the same as that in the on-premises case.

[ansible]: https://www.ansible.com/
[taint_toleration]: https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/
