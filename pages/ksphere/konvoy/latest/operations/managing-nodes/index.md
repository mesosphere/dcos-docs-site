---
layout: layout.pug
navigationTitle: Managing Nodes
title: Managing Nodes
menuWeight: 5
excerpt: Adding compute capacity to your Konvoy cluster
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

# Adding Nodes to an AWS Cluster

**NOTE** This process only applies to clusters created by Konvoy, using Terraform.
If your cluster was provisioned manually, please follow the steps in [Adding Nodes to an On-Premise Cluster](#adding-nodes-to-an-on-premise-cluster)

**NOTE** This process should only be applied on healthy clusters.
If you're attempting to recover from a node failure, please see [Recovering from Node Failure][node_failure_recovery] instead.

After the initial provisioning of a cluster, the same `konvoy` tools can be used to add nodes.

To safely add nodes to a running AWS cluster, you'll need access to the files from the cluster's maintenance repository:

- The Terraform state file `terraform.tfstate` in the `state` directory.
- The inventory file: `inventory.yaml`.
- The cluster configuration file: `cluster.yaml`.
- The administrative certificates for reaching the Kubernetes API, `admin.conf`.
- The SSH keys used to configure nodes, as referenced in `cluster.yaml`.

**NOTE** Customized Terraform configurations may rely on an S3 bucket for shared state, which would not reqiure this file locally.

With these files in the current working directory, proceed with the following steps:

1. Open `cluster.yaml` in your editor, and find the `nodePools` section.
2. Find the node pool entry with `name: worker`, and increase the `count` property to the desired total.
3. Save and close your editor.
4. Run `konvoy up`.

Once complete, the cluster should report additional ndoes.
You can see them by running the command `kubectl get nodes`.
In the output, you'll see your additional nodes joined to the cluster, with an `AGE` value probably reported in minutes, indicating that they're much newer in the cluster.

# Adding Nodes to an On-Premise Cluster

**NOTE** This process applies to clusters whose infrastructure was manually provisioned.
This will include most on-prem environments, as well as some AWS clusters that were configured without the use of Konvoy's Terraform integration.

To safely add nodes to a running on-prem cluster, you'll need the following files from the cluster's maintenance repository:

- The inventory file: `inventory.yaml`
- The cluster configuration file: `cluster.yaml`
- The administrative certificates for reaching the Kubernetes API, `admin.conf`
- The SSH keys used to configure nodes, as referenced in `cluster.yaml`

In an on-prem or manually provisioned environments, each node must have:

- An IP address reachable from your workstation or bootstrap environment.
- A running SSH daemon, with your key authorized.

With this information and the files above, proceed with the following steps:

1. Open `cluster.yaml` and find the `nodePools` section.
2. Increase the `count` of the relevant named node pool(s) to reflect the nodes you're adding - probably `worker`.
3. Open `inventory.yaml` and find the named node pool you're adding nodes to - probably `node`.
4. Add an entry to the `hosts` field, consistent with the format of the other nodes.
    - The key of the entry is the node's IP address, within the cluster's host network environment.
    - The `node_pool` property must match the node pool name of `cluster.yaml` - i.e. probably `worker`.
    - The `ansible_host` field (optionally) provides an alternate hostname or IP, reachable from your workstation.
5. Save both files (`inventory.yaml` and `cluster.yaml`).
6. Run `konvoy up`.

# Related Community Resources

- [Assign Pods to Nodes][assign-pods-to-nodes]
- [Node Taints and Tolerations][taints-and-tolerations]
- [Scheduling workloads with node labels and affinities][node-labels-affinity]

[node-labels-affinity]: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/
[taints-and-tolerations]: https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/
[assign-pods-to-nodes]: https://kubernetes.io/docs/tasks/configure-pod-container/assign-pods-nodes/
[node_failure_recovery]: ../../troubleshooting/replacing-a-failed-node/
