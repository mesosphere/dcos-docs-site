---
layout: layout.pug
navigationTitle: Manually attach Cluster created with CLI
title: Attach a Cluster manually created with CLI
menuWeight: 50
excerpt: Attach a Cluster manually created with CLI
---

When creating a cluster in a Workspace namespace using the DKP CLI it will not be attached automatically. To automatically attach a cluster you can generate the cluster objects using the DKP CLI `--dry-run -o yaml` flags and then using the [Advanced Creation of Konvoy Clusters][create_cluster_advanced].

If the Cluster is created using the CLI it will appear in the UI as it is being Provisioned. It will then be in an Unattached state when Provisioning is completed.

## Manually attach Cluster created with CLI

From the CLI find the `name` of the `Cluster` created so that it can be referenced.

```bash
$ kubectl -n <workspace_namespace> get clusters
```

Attach the Cluster by creating a `KommanderCluster` from the CLI.

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