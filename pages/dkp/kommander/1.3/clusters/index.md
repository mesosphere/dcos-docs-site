---
layout: layout.pug
beta: false
navigationTitle: Managing Clusters
title: Managing Clusters
menuWeight: 7
excerpt: View clusters created with Kommander or any connected Kubernetes cluster
---

Kommander allows you to monitor and manage very large numbers of clusters, so it's easy to either connect existing clusters or create new clusters whose lifecycle is managed by Konvoy.

## Types

There are several types of clusters to be aware of in the Clusters tab.

- **Attached**: A cluster that was not created with Kommander. Attached clusters' lifecycle cannot be managed.
- **Managed**: A Konvoy cluster that was created with Kommander. Managed clusters' lifecycle can be managed.
- **Management**: The Konvoy cluster that hosts Kommander.

## Statuses

| Status         | Description                                                                                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pending        | This is the initial state when a cluster is created or connected.                                                                                                   |
| Loading Data   | The cluster has been added to Kommander and we are fetching details about the cluster. This is the status before `Active`.                                          |
| Active         | The cluster is connected to API server                                                                                                                              |
| Provisioning\* | The cluster is being created on your cloud provider. This process can take a long time. To follow the progress of creation, select **View Logs** in the drop-down menu. |
| Joining        | Cluster is being joined to the management cluster for federation.                                                                                                   |
| Joined         | The join process is done, we wait for the first bit of data from the cluster to arrive                                                                              |
| Deleting       | Cluster is being deleted. This process may take a long time.                                                                                                             |
| Error          | There has been an error connecting to the cluster or retrieving data from the cluster.                                                                              |
| Failed\*       | The cluster has failed to be provisioned. For more info on the failure, select **View Logs** in the drop-down menu.                                                     |
| Join Failed    | This can happen when kubefed does not have permission to create entities in the target cluster.                                                                     |
| Unjoining      | Kubefed cleans up after itself, removing all installed resources on the target cluster.                                                                             |
| Unjoined       | The cluster has been disconnected from the management cluster.                                                                                                      |
| Unjoin Failed  | Unjoining from kubefed failed or some other error with deleting or disconnecting.                                                                                   |
| Deleting       | The cluster and its resources are being removed from your cloud provider. Select **View Logs** in the drop-down menu to follow progress. This process may take a long time.  |
| Deleted        | The cluster and its resources have been removed from your cloud provider.                                                                                           |
| Provisioned\*  | The cluster has been created on your cloud provider.                                                                                                                |

\* These statuses only happen on Managed clusters

## Resources

![Cluster card with resources](/dkp/kommander/1.3/img/cluster-card.png)

Figure 1. A cluster card with resources

| Resource        | Description                                                                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CPU Requests    | The portion of the allocatable CPU resource that the cluster is requesting to be allocated. Measured in number of cores (e.g.: .5 cores)                      |
| CPU Limits      | The portion of the allocatable CPU resource that the cluster is limited to allocating. Measured in number of cores (e.g.: .5 cores)                           |
| CPU Usage       | How much of the allocatable CPU resource that is being consumed. Cannot be higher than the configured CPU limit. Measured in number of cores (e.g.: .5 cores) |
| Memory Requests | The portion of the allocatable memory resource that the cluster is requesting to be allocated. Measured in bytes (e.g.: 64 GiB)                               |
| Memory Limits   | The portion of the allocatable memory resource that the cluster is limited to allocating. Measured in bytes (e.g.: 64 GiB)                                    |
| Memory Usage    | How much of the allocatable memory resource that is being consumed. Cannot be higher than the configured memory limit. Measured in bytes (e.g.: 64 GiB)       |
| Disk Requests   | The portion of the allocatable ephemeral storage resource that the cluster is requesting to be allocated. Measured in bytes (e.g.: 64 GiB)                    |
| Disk Limits     | The portion of the allocatable ephemeral storage resource that the cluster is limited to allocating. Measured in bytes (e.g.: 64 GiB)                         |

For more detailed information, see the [Kubernetes documentation][k8s_docs] about resources.

## Platform services

Services that have been installed by your management cluster. You can visit a cluster's detail page to see which platform services have been enabled under the "Addons" section.

![Cluster Detail Page](/dkp/kommander/1.3/img/cluster-detail-page.png)
<br />_Cluster detail page_

Review the [workspace platform service resource requirements](/dkp/kommander/1.3/workspaces/platform-service-requirements/) to ensure that the attached clusters have sufficient resources. For more information on platform services and how to customize them, see [workspace platform services](/dkp/kommander/1.3/workspaces/workspace-platform-services/).

### Custom service cards

Custom service cards can be added to the cluster detail page's Addons section by creating a `ConfigMap` on the cluster. The `ConfigMap` must have a `d2iq.io/addon` label and must contain both `name` and `dashboardLink` data keys to be displayed. Upon creation of the `ConfigMap`, the GUI will show a card corresponding to the data provided in the `ConfigMap`. Custom cards have a Kubernetes icon and can link to a service running in the cluster or use an absolute URL to link to any accessible URL.

#### ConfigMap example

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: "my-service"
  namespace: "kommander"
  labels:
    "d2iq.io/addon": "my-service"
data:
  name: "My Service"
  dashboardLink: "/path/to/service"
```

| Key | Description | Required |
| :--- | :--- | :---: |
| metadata . labels . "d2iq.io/addon" | The platform service name (id) | X |
| data . name | The display name used to describe the service and shown on the Card in the GUI. | X |
| data . dashboardLink | The link to the service. This can be an absolute link "https://www.d2iq.com" or a relative link "/ops/portal". If a relative link is used, the link will be built using the cluster's path as the base of the URL to the service. | X |
| data . docsLink | Link to documentation about the service, this is displayed on the service card, but omitted if not present. | |
| data . category | Category to group the custom service with, if not provided the service is grouped under the category "None." | |
| data . version | A version string for the service, if not provided "N/A" is displayed on the service card in the GUI. | |

How to create a new custom service `ConfigMap`:

```bash
$ cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ConfigMap
metadata:
  name: "my-service"
  namespace: "kommander"
  labels:
    "d2iq.io/addon": "my-service"
data:
  name: "My Service"
  dashboardLink: "/path/to/service"
EOF
```

[k8s_docs]: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
