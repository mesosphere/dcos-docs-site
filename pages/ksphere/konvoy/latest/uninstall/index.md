---
layout: layout.pug
navigationTitle: Uninstall
title: Uninstall
menuWeight: 14
excerpt: Remove a Konvoy cluster and related infrastructure
enterprise: false
---

Konvoy clusters that have been deployed using the `konvoy up` command can be removed from a public cloud instance or internal network by running the `konvoy down` command.
The `konvoy down` command enables you to remove the cluster and its related infrastructure without manual clean-up operations.
However, the `konvoy down` command requires access to the state files that were created when you deployed the cluster using the `konvoy up` command.

## Identify the state files for a cluster

By default, the `konvoy up` command creates these state files in a specific subdirectory associated with your cluster.
For example, if you installed the Konvoy cluster using the instructions in the [Quick start](../quick-start/),
you might have a subdirectory named `konvoy-quickstart` that you created before running the `konvoy up` command.
The subdirectory contains the state files that are associated with a specific cluster instance.

Before running the `konvoy down` command for any cluster, you should verify that the subdirectory for that cluster's state files exists and is accessible.

## Verify cluster resources to be removed

Before removing a cluster that relies on a public cloud infrastructure, you should keep in mind that running the `konvoy down` command:

- destroys cluster-related infrastructure resources
- is not a reversible operation
- can result in downtime while operations are performed
- removes data associated with the provisioning process

By default, when you run `konvoy up`, the command creates AWS resources through [Terraform][terraform] operations.
After the Konvoy deployment of the Kubernetes cluster is initialized and running, Kubernetes itself can create additional resources such as load balancers, security groups, and storage volumes.

When you run `konvoy down`, the command removes all of the AWS infrastructure resources create for the cluster, including any volumes that are backing PersistentVolumesClaims with a `Delete` [ReclaimPolicy][reclaim-policy].

To completely remove Konvoy cluster resources:

Change to the directory that contains your cluster's state files, then run the following command:

```bash
konvoy down
```

The command prompts you with a time estimate for completing the operation. You can respond by typing `Y` to proceed.

The `konvoy down` command then begins removing cluster resources by deleting load balancers, security groups and volumes.
It deletes these resources using the AWS API to ensure they are deleted quickly.

After `konvoy down` removes these resources, it uses Terraform to delete the resources created by the `konvoy up` command and Terraform provisioning.

## Skip the removal of Kubernetes resources

As an alternative to removing all cluster resources, you can skip deleting resources created by Kubernetes.
To remove AWS resources for a cluster without deleting the resources created by Kubernetes, run the following command:

```bash
konvoy down --skip-clean-kubernetes
```

## Clean up failed teardown operations

If a failure occurs during a `konvoy down` teardown operation, it is possible for some cluster data or infrastructure components to be left behind.
For example, if the Konvoy cluster is deployed on a public cloud such as AWS, an unsuccessful or incomplete teardown operation can potentially leave behind the following cluster components:

- Load balancers
- Amazon Elastic Block Store (EBS) storage volumes
- Amazon Elastic Cloud (EC2) instances
- Key pairs
- Security groups
- Identity and access management roles
- Virtual Private Cloud (VPC) and related networks

If you encounter this issue, you should try re-running the `konvoy down` command.
If the failure was caused by a temporary condition, re-running the `konvoy down` command might resolve the issue.
If the failure persists, however, destroying the cluster might require manual intervention.
For example, you might need to manually remove cluster artifacts to return to a clean state.

### Report failed operations

If a persistent failure occurs during clean-up operations, you should report it.
Reporting the issue can help to ensure that testing and automation can be added to address the cause of the failure.

In most cases, you can address the failure by manually removing resources using your infrastructure provider's API.
However, you should use caution when removing components manually.
Removing resources manually can lead to unexpected downtime and data loss.

### Find resources to remove manually

If you need to manually remove cluster resources, you can find the resources created by Terraform by searching for the `name` in the `cluster.yaml` file.
Many of these resources are named using the following format: `<CLUSTER_NAME><4 character hash>-resource-name`, for example,`cluster_name143a-worker-0`.
Resources are also tagged with `konvoy/clusterName: CLUSTER_NAME` and `ClusterProvisioner.spec.providerOptions.tags` in the `cluster.yaml` file.

Formats for resources created by Kubernetes can vary greatly, but a useful tag is `kubernetes.io/cluster/cluster_name` (ex. `kubernetes.io/cluster/konvoy143a`).

## Get additional information

The following resources contain useful information for AWS-based deployments in particular:

- [Deleting Load Balancers][0]
- [Deleting EBS Storage Volumes][1]
- [Deleting EC2 Instances][2]

[0]:https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-delete.html
[1]:https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-deleting-volume.html
[2]:https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/terminating-instances.html
[terraform]: https://www.terraform.io
[reclaim-policy]: https://kubernetes.io/docs/tasks/administer-cluster/change-pv-reclaim-policy/
