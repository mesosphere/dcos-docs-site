---
layout: layout.pug
navigationTitle: Add, Change, and Remove Nodes
title: Add, Change, and Remove Nodes
menuWeight: 5
excerpt: Add, change, and remove nodes your Konvoy cluster
beta: false
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

<p class="message--note"><strong>NOTE: </strong>The operations described in this document apply only to healthy clusters. If you are attempting to recover from a node failure, please see <a href="../../troubleshooting/replace-a-failed-node">Replace a Failed Node</a>, or <a href="../../troubleshooting/replace-failed-control-plane-node">Replace a Failed Control Plane Node</a>, instead.</p>

# Add Nodes to an AWS, Azure, or GCP Cluster

<p class="message--note"><strong>NOTE: </strong> This process only applies to clusters whose infrastructure Konvoy provisions, using Terraform. If your cluster is provisioned manually, please follow the steps in <a href="#add-nodes-to-an-on-premises-cluster">Add Nodes to an On-Premises Cluster</a>.</p>

After you use `konvoy` to provision an AWS, Azure, or GCP cluster, you can use it to add more nodes. To safely add nodes, make sure your current working directory contains the following:

```shell
.
├── admin.conf                  | Kubeconfig for the cluster administrator
├── cluster.yaml                | Cluster configuration
├── cluster-ssh-key.pem         | SSH private key
├── cluster-ssh-key.pub         | SSH public key, copied to nodes
├── inventory.yaml              | Ansible inventory
└── state                       | Directory for terraform state
    └── terraform.tfstate       | Terraform state
```

<p class="message--note"><strong>NOTE: </strong>A custom Terraform configuration that uses remote state, e.g. using AWS S3, may not require the `state` directory.</p>

With these files in the current working directory, proceed with the following steps:

1. Run `konvoy get nodepools`
1. Find the relevant node pool entry, probably `worker`, and observe the number of nodes in the `COUNT` column.
1. Run `konvoy scale nodepool <NAME> --count <NUMBER>` to change the number of nodes.
1. Run `konvoy up` to apply the change.

To see the new nodes, run `kubectl get nodes --sort-by=.metadata.creationTimestamp`. The newest nodes are at the bottom of the list.

# Add Nodes to an On-Premises Cluster

<p class="message--note"><strong>NOTE: </strong>This process only applies to clusters whose infrastructure is provisioned manually. This includes on-premises clusters, and AWS, Azure, or GCP clusters whose infrastructure is not provisioned by Konvoy.</p>

To safely add nodes, make sure your current working directory contains the following:

```shell
    .
    ├── admin.conf                  | Kubeconfig for the cluster administrator
    ├── cluster.yaml                | Cluster configuration
    ├── cluster-ssh-key.pem         | SSH private key
    ├── cluster-ssh-key.pub         | SSH public key, copied to nodes
    └── inventory.yaml              | Ansible inventory
```

In manually provisioned environments, or on-premises, each node must have:

1. An IP address reachable from the environment where `konvoy` runs.
1. A user whose SSH authorized keys include the cluster SSH public key.
1. A running SSH daemon.

With this information and the files above, proceed with the following steps:

1. To add nodes to a new node pool, add the node pool to `cluster.yaml`. Otherwise, skip to the next step.
    1.  Open `cluster.yaml`. Find the `nodePools` field.
    1.  Add an entry, consistent with the following format:

        ```yaml
        kind: ClusterConfiguration
        apiVersion: konvoy.mesosphere.io/v1beta2
        spec:
          nodePools:
          - name: newname
        ```

    1. Save `cluster.yaml`.
1. Open `inventory.yaml`. If you are adding a node, find the `node` field. If you are adding a control plane node, find the `control-plane` field.
1. Add an entry to the `hosts` field, consistent with the following format:

    ```yaml
    node:                               # The field for nodes. The `control-plane` field is for control plane nodes only.
      hosts:                            # The field for the list of hosts
        10.50.62.20:                    # The IP address of the host
          ansible_host: 172.100.23.10   # The IP address for SSH, only if different from the above IP address
          ansible_port: 2022            # The SSH port, only if different from 22
          node_pool: newname            # The node pool name
          controlplane: false           # Is the node a control-plane node
          bastion: false                # Is the node a bastion node
    ```

1. Save `inventory.yaml`.
1. Run `konvoy up` to apply the change.

# Change Nodes in an AWS, Azure, or GCP Cluster

<p class="message--note"><strong>NOTE: </strong> This process only applies to clusters whose infrastructure Konvoy provisions, using Terraform. If your cluster is provisioned manually, please follow the steps in <a href="#adding-nodes-to-an-on-premises-cluster">Adding Nodes to an On-Premises Cluster</a>.</p>

Sometimes you need to change the nodes you have already deployed. For example, to use a newer machine image, you must change a `imageID` property of the node pool to the ID of the newer machine image.

<p class="message--important"><strong>IMPORTANT: </strong>If you change some properties of a deployed node pool, and run `konvoy provision` or `konvoy up`, konvoy may destroy and re-create the machines in the node pool, disrupting your workloads on these machines. Konvoy prevents disruptive changes to the control plane node pool.</p>

To avoid disrupting workloads on a node pool, migrate them to a new node pool. To safely migrate workloads, make sure your current working directory contains the following:

```shell
    .
    ├── admin.conf                  | Kubeconfig for the cluster administrator
    ├── cluster.yaml                | Cluster configuration
    ├── cluster-ssh-key.pem         | SSH private key
    ├── cluster-ssh-key.pub         | SSH public key, copied to nodes
    ├── inventory.yaml              | Ansible inventory
    └── state                       | Directory for terraform state
        └── terraform.tfstate       | Terraform state
```

<p class="message--note"><strong>NOTE: </strong>A custom Terraform configuration that uses remote state, e.g. using AWS S3, may not require the `state` directory.</p>

With these files in the current working directory, proceed with the following steps:

1. Run `konvoy create nodepool <NAME_OF_NEW_NODE_POOL>` to create a new node pool to provide resources for your workloads. Use the `--from <NAME_OF_EXISTING_NODE_POOL>` flag to copy configuration from an existing node pool.
1. Run `konvoy up` to apply the change.
1. Run `konvoy drain nodepool <NAME_OF_EXISTING_NODE_POOL>` to move workloads from the existing node pool. For more information on draining, see [Safely Drain a Node][drain-node].
1. Verify that your workloads are running on other nodes and that they are healthy.
1. Run `konvoy scale nodepool <NAME_OF_EXISTING_NODE_POOL> --count=0` to remove all machines from the existing node pool.
1. Run `konvoy up` to apply the change.

# Related Community Resources

- [Assign Pods to Nodes][assign-pods-to-nodes]
- [Node Taints and Tolerations][taints-and-tolerations]
- [Scheduling workloads with node labels and affinities][node-labels-affinity]
- [Safely Drain a Node][drain-node]

[node-labels-affinity]: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/
[taints-and-tolerations]: https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/
[assign-pods-to-nodes]: https://kubernetes.io/docs/tasks/configure-pod-container/assign-pods-nodes/
[replace-failed-node]: ../../troubleshooting/replace-a-failed-node/
[drain-node]: https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/
