---
layout: layout.pug
navigationTitle: Replace a failed node
title: Replace a failed node
menuWeight: 9
excerpt: Replace a failed worker node in a cluster
enterprise: false
---

Whenever a node crashes due to system failure, Konvoy provides some guidelines to replace it with a new worker.

Initially you should ensure the node is accessible from the `kubectl` command-line interface by running the following command:

```bash
kubectl get nodes
```

If the node is in the `Ready` state, it should be drained, i.e., move all the running pods away from that node prior its destruction:

```bash
kubectl drain node_to_replace_name
```

If the node is not in the `Ready` state, you may skip the draining process.

Next, you need to destroy that node to be able to provision a new node.
The procedure depends if you have provisioned via a `cloud provider` or running machines `on-prem`.

## Cloud-Provider

When provisioning a cluster using `Konvoy` on AWS, you can manually delete the machine via the AWS web console.
Once the machine was terminated, the following command will reconcile the state of the cluster and provision a new node.
Likewise, Kubernetes components should be installed in this new worker node.
To do so, you can use the following command:

```bash
konvoy up
```

That command will reconcile the state of the cluster and configure the new node.
Now this new worker node should appear `Ready` when running `kubectl get nodes`.

## On-Prem

When provisioning your own infrastructure via an `inventory.yaml` file, you can manually delete the node by removing it from the `inventory.yaml` file.
Next you should add the new worker node entry in the inventory file and run:

```bash
konvoy up
```

That command will install all the pre-requisites and Kubernetes components to join the cluster and start allocating pods in this node.
