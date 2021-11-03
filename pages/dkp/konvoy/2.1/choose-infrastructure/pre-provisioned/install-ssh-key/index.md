---
layout: layout.pug
navigationTitle: Install SSH Key
title: Install an SSH Key
menuWeight: 40
excerpt: Create a Secret for your SSH key for use with a pre-provisioned provider
beta: false
enterprise: false
---

Konvoy needs SSH access to your infrastructure with superuser privileges. You must provide an unencrypted SSH private key to Konvoy. Populate this key on your bootstrap cluster using the following command:

Set the environment variable to the name you assigned this cluster.

```sh
CLUSTER_NAME=my-preprovisioned-cluster
```

See [define infrastructure](../define-infrastructure#name-your-cluster) about naming your cluster.

```shell
kubectl create secret generic $CLUSTER_NAME-ssh-key --from-file=ssh-privatekey=<path-to-ssh-private-key>
kubectl label secret $CLUSTER_NAME-ssh-key clusterctl.cluster.x-k8s.io/move=
```

When this step is complete, [define the infrastructure nodes and partitions](../define-infrastructure).
