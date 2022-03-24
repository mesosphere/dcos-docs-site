---
layout: layout.pug
navigationTitle: Manually attach a CLI-created cluster 
title: Manually attach CLI-created cluster
menuWeight: 50
excerpt: Manually attach a cluster that was created with the CLI
---

When creating a cluster in a Workspace namespace using the DKP CLI it will not be attached automatically. To automatically attach a cluster you can generate the cluster objects using the DKP CLI `--dry-run -o yaml` flags and then using the [Advanced Creation of Konvoy Clusters][create_cluster_advanced].

If the Cluster is created using the CLI it will appear in the UI as it is being Provisioned. It will then be in an Unattached state when Provisioning is completed.

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