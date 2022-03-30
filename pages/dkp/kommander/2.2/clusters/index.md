---
layout: layout.pug
beta: false
navigationTitle: Managing Clusters
title: Managing Clusters
menuWeight: 40
excerpt: View clusters created with Kommander or any connected Kubernetes cluster
---

Kommander allows you to monitor and manage large numbers of clusters. Use the features described in this area to connect existing clusters, or to create new clusters whose lifecycle is managed by Konvoy. You can view clusters from the Clusters tab in the navigation pane on the left. You can see the details for a cluster by selecting the **View Details** link at the bottom of the cluster card or the cluster name in either the card or the table view.

## Types

Several types of clusters display in the Clusters tab. The cluster type appears in the cluster card just under the cluster name.

The type values include:

- **Attached**: An Attached cluster is one that was not created with Kommander. You cannot manage an Attached cluster's lifecycle, but you can monitor it.
- **Managed**: A Managed cluster is a DKP cluster that was created with Kommander. You can use Kommander to manage a Managed cluster's lifecycle.
- **Management**: This is the DKP cluster that hosts Kommander.

## Statuses

A cluster card's status line displays both the current status and the version of Kubernetes running in the cluster.

The status list includes these values:

| Status         | Description                                                                                                                                                                                                 |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pending        | This is the initial state when a cluster is created or connected.                                                                                                                                           |
| Pending Setup  | The cluster has networking restrictions that require additional setup, and is not yet connected or attached.                                                                                                |
| Loading Data   | The cluster has been added to Kommander and we are fetching details about the cluster. This is the status before `Active`.                                                                                  |
| Active         | The cluster is connected to API server.                                                                                                                                                                     |
| Provisioning\* | The cluster is being created on your cloud provider. This process may take some time.                                                                                                                       |
| Provisioned\*  | The cluster's infrastructure has been created and configured.                                                                                                                                               |
| Joining        | The cluster is being joined to the management cluster for federation.                                                                                                                                       |
| Joined         | The join process is done, and waiting for the first data from the cluster to arrive.                                                                                                                        |
| Deleting\*     | The cluster and its resources are being removed from your cloud provider. This process may take some time.                                                                                                  |
| Error          | There has been an error connecting to the cluster or retrieving data from the cluster.                                                                                                                      |
| Join Failed    | This status can appear when kubefed does not have permission to create entities in the target cluster.                                                                                                      |
| Unjoining      | Kubefed is cleaning up after itself, removing all installed resources on the target cluster.                                                                                                                |
| Unjoined       | The cluster has been disconnected from the management cluster.                                                                                                                                              |
| Unjoin Failed  | The Unjoin from kubefed failed or there is some other error with deleting or disconnecting.                                                                                                                 |
| Unattached\*   | The cluster was created manually and the infrastructure has been created and configured. However, the cluster is not attached. Review the [Manually attach a CLI-created cluster][manually_attach_cluster] page to resolve this status. |

<p class="message--note"><strong>*</strong>These statuses only appear on Managed clusters.</p>

## Resources

The Resources graphs on a cluster card show you a cluster's resource requests, limits, and usage. This allows a quick, visual scan of cluster health. Hover over each resource to get specific details for that specific cluster resource.

| Resource        | Description                                                                                                                                                |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CPU Requests    | The requested portion of the total allocatable CPU resource for the cluster, measured in number of cores, such 0.5 cores.                                  |
| CPU Limits      | The portion of the total allocatable CPU resource to which the cluster is limited, measured in number of cores, such as 0.5 cores.                         |
| CPU Usage       | The amount of the allocatable CPU resource being consumed. Cannot be higher than the configured CPU limit. Measured in number of cores, such as 0.5 cores) |
| Memory Requests | The requested portion of the total allocatable memory resource for the cluster, measured in bytes, such as 64 GiB.                                         |
| Memory Limits   | The portion of the allocatable memory resource to which the cluster is limited, measured in bytes, such as 64 GiB.                                         |
| Memory Usage    | The amount of the allocatable memory resource being consumed. Cannot be higher than the configured memory limit. Measured in bytes, such as 64 GiB.        |
| Disk Requests   | The requested portion of the allocatable ephemeral storage resource for the cluster, measured in bytes, such as 64 GiB.                                    |
| Disk Limits     | The portion of the allocatable ephemeral storage resource to which the cluster is limited, measured in bytes, such as 64 GiB.                              |

For more detailed information, see the [Kubernetes documentation][k8s_docs] about resources.

## Platform applications

Platform applications, formerly called Addons, are services that the management cluster installs. You can visit a cluster's detail page to see which platform applications are enabled under the "Platform Applications" section.

![Cluster Detail Page](/dkp/kommander/2.1/img/cluster-detail-page.png)
Figure 1. Cluster detail page

Review the [workspace platform service resource requirements][platform_applications_req] to ensure that the attached clusters have sufficient resources. For more information on platform applications and how to customize them, see [workspace platform services][workspace_platform_applications].

## Edit a cluster

<TBD Need some info for this.>

![Edit a Cluster Action](/dkp/kommander/2.1/img/edit-cluster-action.png)

### Edit an attached cluster

<TBD Need some info for this.>

For an attached cluster, you can only edit labels assigned to that cluster.

![Edit an Attached Cluster](/dkp/kommander/2.1/img/edit-cluster-attached-1-1-0.png)

[k8s_docs]: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
[workspace_platform_applications]: ../workspaces/applications/platform-applications/
[platform_applications_req]: ../workspaces/applications/platform-applications/platform-application-requirements/
[manually_attach_cluster]: ./attach-cluster/manually-attach-cluster/
