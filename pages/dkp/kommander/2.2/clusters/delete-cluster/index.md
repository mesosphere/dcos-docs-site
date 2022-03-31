---
layout: layout.pug
beta: false
navigationTitle: Disconnect or Delete Clusters
title: Disconnect or Delete Clusters
menuWeight: 50
excerpt: Disconnect or delete a cluster
---

## Disconnect vs. delete

When you attach a cluster to Kommander that was not created with Kommander, you can later disconnect it. This does not alter the running state of the cluster, but simply removes it from the Kommander UI. User workloads, platform services, and other Kubernetes resources are not cleaned up at detach.

<p class="message--warning"><strong>WARNING: </strong>
After successfully detaching the cluster, manually disconnect the attached cluster's Flux installation from the management Git repository. Otherwise, changes to apps in the managed cluster's workspace will still be reflected on the cluster you just detached. Ensure your `dkp` configuration references the cluster, where you want to run the upgrade. You can do this by setting the `KUBECONFIG` environment variable [to the appropriate kubeconfig file location](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/). An alternative to initializing the `KUBECONFIG` environment variable is to use the `–kubeconfig=cluster_name.conf` flag. Then, run <code>kubectl -n kommander-flux patch gitrepo management -p '{"spec":{"suspend":true}}' --type merge</code> to make the cluster's workloads not managed by Kommander, anymore.
</p>

If you created the managed clusters with Kommander, you cannot disconnect the cluster, but you can delete the cluster. This completely removes the cluster and all of its cloud assets.

<p class="message--warning"><strong>WARNING: </strong>
If you delete the management (Konvoy) cluster, you can not use Kommander to delete any managed clusters created by Kommander. If you want to delete all clusters, ensure you delete any managed clusters before finally deleting the management cluster.
</p>

### Statuses

See [Statuses](/dkp/kommander/2.1/clusters#statuses) for a list of possible states a cluster can have when it is getting disconnected or deleted.

## Troubleshooting

### I cannot detach an attached cluster that is "Pending"

Sometimes attaching a Kubernetes cluster to Kommander causes that cluster to get stuck in the "Pending" state. This can happen because the wrong `kubeconfig` file is used or the cluster is just not reachable by Kommander.
In order to detach the cluster so it does not show in Kommander, follow these steps:

1.  Determine the `KommanderCluster` resource backing the cluster you tried to attach. Enter the following command:

    ```bash
    kubectl -n WORKSPACE_NAMESPACE get kommandercluster
    ```

    Replace `WORKSPACE_NAMESPACE` with the actual current workspace name. You can find this name by going to `https://YOUR_CLUSTER_DOMAIN_OR_IP_ADDRESS/dkp/kommander/dashboard/workspaces` in your browser.

1.  Delete the cluster. Enter the following. command:

    ```bash
    kubectl -n WORKSPACE_NAMESPACE delete kommandercluster CLUSTER_NAME
    ```

1.  If the resource does not go after a short time, remove its finalizers. Enter the following command:

    ```bash
    kubectl -n WORKSPACE_NAMESPACE patch kommandercluster CLUSTER_NAME --type json -p '[{"op":"remove", "path":"/metadata/finalizers"}]'
    ```

    This removes the cluster from the Kommander UI.
