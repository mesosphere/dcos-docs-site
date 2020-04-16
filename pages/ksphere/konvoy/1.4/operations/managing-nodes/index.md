---
layout: layout.pug
navigationTitle: Managing Nodes
title: Managing Nodes
menuWeight: 5
excerpt: Adding compute capacity to your Konvoy cluster
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

# Adding Nodes to an AWS / Azure Cluster

<p class="message--note"><strong>NOTE: </strong> This process only applies to clusters created by Konvoy, using Terraform.
If your cluster was provisioned manually, please follow the steps in <a href="#adding-nodes-to-an-on-premise-cluster">Adding Nodes to an On-Premise Cluster</a>.</p>

<p class="message--note"><strong>NOTE: </strong> This process should only be applied to healthy clusters.
If you are attempting to recover from a node failure, please see <a href="../troubleshooting/replace-a-failed-node">Recovering from Node Failure</a> instead.</p>

After the initial provisioning of a cluster, the same `konvoy` tools can be used to add nodes.

To safely add nodes to a running AWS cluster, you will need access to the files from the cluster's maintenance repository:

- The Terraform state file `terraform.tfstate` in the `state` directory.
- The inventory file: `inventory.yaml`.
- The cluster configuration file: `cluster.yaml`.
- The administrative certificates for reaching the Kubernetes API, `admin.conf`.
- The SSH keys used to configure nodes, as referenced in `cluster.yaml`.

<p class="message--note"><strong>NOTE: </strong>Customized Terraform configurations may rely on an S3 bucket for shared state, which would not reqiure this file locally.</p>

With these files in the current working directory, proceed with the following steps:

1. Run `konvoy get nodepools`
1. Find the relevant node pool entry, probably `worker`, and observe the number of nodes in the `COUNT` column.
1. Run `konvoy scale nodepool <NAME> --count <NUMBER>` to change the number of nodes.
1. Run `konvoy up` to apply the change.

Once complete, the cluster should report additional ndoes.
You can see them by running the command `kubectl get nodes`.
In the output, you will see your additional nodes joined to the cluster, with an `AGE` value probably reported in minutes, indicating that they are much newer in the cluster.

# Adding Nodes to an On-Premise Cluster

<p class="message--note"><strong>NOTE: </strong>This process applies to clusters whose infrastructure was manually provisioned. This will include most on-prem environments, as well as some AWS clusters that were configured without the use of Konvoy's Terraform integration.</p>

To safely add nodes to a running on-prem cluster, you will need the following files from the cluster's maintenance repository:

- The inventory file: `inventory.yaml`
- The cluster configuration file: `cluster.yaml`
- The administrative certificates for reaching the Kubernetes API, `admin.conf`
- The SSH keys used to configure nodes, as referenced in `cluster.yaml`

In an on-prem or manually provisioned environments, each node must have:

- An IP address reachable from your workstation or bootstrap environment.
- A running SSH daemon, with your key authorized.

With this information and the files above, proceed with the following steps:

1. Open `cluster.yaml` and find the `nodePools` section.
1. Increase the `count` of the relevant named node pool(s) to reflect the nodes you're adding - probably `worker`.
1. Open `inventory.yaml` and find the named node pool you're adding nodes to - probably `node`.
1. Add an entry to the `hosts` field, consistent with the format of the other nodes.
    - The key of the entry is the node's IP address, within the cluster's host network environment.
    - The `node_pool` property must match the node pool name of `cluster.yaml` - i.e. probably `worker`.
    - The `ansible_host` field (optionally) provides an alternate hostname or IP, reachable from your workstation.
1. Save both files (`inventory.yaml` and `cluster.yaml`).
1. Run `konvoy up` to apply the change.

# Changing Nodes in an AWS / Azure Cluster

Sometimes you need to change the nodes you have already deployed. For example, to use a newer machine image, you must change a `imageID` property of the node pool to the ID of the newer machine image.

<p class="message--important"><strong>IMPORTANT: </strong> Changing some properties of a deployed node pool, and running `konvoy provision` or `konvoy up`, may destroy and re-create the machines in the node pool, disrupting your workloads on these machines.</p>

To avoid disrupting workloads on a node pool, migrate them to a new node pool by following these steps:

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
