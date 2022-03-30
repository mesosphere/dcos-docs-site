---
layout: layout.pug
navigationTitle: Manually attach a CLI-created cluster 
title: Manually attach CLI-created cluster
menuWeight: 50
excerpt: Manually attach a cluster that was created with the CLI
---

When you create a cluster in a Workspace namespace using the DKP CLI, it does not attach automatically. To automatically attach a cluster, generate the cluster objects using the DKP CLI `--dry-run -o yaml` flags and create a cluster as stated in the [Advanced Creation of DKP Clusters][create_cluster_advanced] guide.

However, if you created the cluster using the CLI, you will still need to attach it. You will be able to see the new cluster in the UI while it is being provisioned. Once provisioning is completed, the status will change to Unattached.

## Manually attach a cluster that was created with the CLI

From the CLI find out the `name` of the created `Cluster` so you can reference it later:

```bash
$ kubectl -n <workspace_namespace> get clusters
```

Attach the cluster by creating a `KommanderCluster`:

```yaml
cat << EOF | kubectl apply -f -
apiVersion: kommander.mesosphere.io/v1beta1
kind: KommanderCluster
metadata:
  name: <cluster_name>
  namespace: <workspace_namespace>
spec:
  kubeconfigRef:
    name: <cluster_name>-kubeconfig
  clusterRef:
    capiCluster:
      name: <cluster_name>
EOF
```

[create_cluster_advanced]: ../../creating-konvoy-cluster-advanced/