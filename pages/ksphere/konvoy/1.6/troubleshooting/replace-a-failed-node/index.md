---
layout: layout.pug
navigationTitle: Replace a failed node
title: Replace a failed node
menuWeight: 9
excerpt: Replace a failed worker node in a cluster
beta: true
enterprise: false
---

This guide describes how to replace a failed worker node.
If you need to replace a control plane node, go to [replace a failed control plane node][replace a failed control plane node].

Whenever a node crashes due to system failure, Konvoy provides some guidelines to replace it with a new worker.

Initially you should ensure the node is accessible from the `kubectl` command-line interface by running the following command:

```bash
kubectl get nodes
```

If the node is in the `Ready` state, it should be drained, i.e., move all the running pods away from that node prior its destruction:

```bash
kubectl drain <worker-node-id>
```

It may be possible that an error will be shown indicating that draining may not be possible but can continue with certain flags, e.g.

```bash
$ kubectl drain ip-10-0-128-170.us-west-2.compute.internal

node/ip-10-0-128-170.us-west-2.compute.internal cordoned
error: unable to drain node "ip-10-0-128-170.us-west-2.compute.internal", aborting command...

There are pending nodes to be drained:
 ip-10-0-128-170.us-west-2.compute.internal
cannot delete DaemonSet-managed Pods (use --ignore-daemonsets to ignore): kube-system/calico-node-8j5qz, kube-system/ebs-csi-node-ft6b6, kube-system/kube-proxy-9vpxs, kubeaddons/fluentbit-kubeaddons-fluent-bit-k5q7f, kubeaddons/prometheus-kubeaddons-prometheus-node-exporter-xbpsn
cannot delete Pods with local storage (use --delete-local-data to override): kubeaddons/alertmanager-prometheus-kubeaddons-prom-alertmanager-0, kubeaddons/prometheusadapter-kubeaddons-prometheus-adapter-6b8975fc48d6h2b, velero/velero-kubeaddons-5d85fcdcb9-762ll
```

in those cases you can continue by appending the flags hinted at

```bash
kubectl drain ip-10-0-128-170.us-west-2.compute.internal --ignore-daemonsets --delete-local-data
```

If, on the other hand, the node is not in the `Ready` state, you may skip the draining process.

Next, you need to destroy that node to be able to provision a new node.
The procedure depends on whether you have provisioned via a [Cloud-Provider](#cloud-provider) or running machines [On-Prem](#on-prem).

## Cloud-Provider

### AWS

When provisioning a cluster using `Konvoy` on AWS, you can manually delete the machine via the AWS web console.
Once the machine has terminated, the following command will reconcile the state of the cluster and provision a new node.

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

[replace a failed control plane node]: ../replace-failed-control-plane-node
