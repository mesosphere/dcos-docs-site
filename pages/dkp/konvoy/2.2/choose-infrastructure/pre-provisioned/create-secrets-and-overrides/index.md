---
layout: layout.pug
navigationTitle: Creating Secrets and Overrides
title: Create Necessary Secrets and Overrides
menuWeight: 40
excerpt: Create necessary secrets and overrides for pre-provisioned clusters
beta: false
enterprise: false
---

Konvoy needs SSH access to your infrastructure with superuser privileges. You must provide an unencrypted SSH private key to Konvoy.

Populate this key and create the required secret, on your bootstrap cluster using the following procedure.

1.  Set the $CLUSTER_NAME environment variable to the name you assigned this cluster:

    ```sh
    CLUSTER_NAME=my-preprovisioned-cluster
    ```

    See [define infrastructure](../define-infrastructure/index.md#name-your-cluster) about naming your cluster.

1.  Create a secret that contains the SSH key with these commands:

    ```shell
    kubectl create secret generic $CLUSTER_NAME-ssh-key --from-file=ssh-privatekey=<path-to-ssh-private-key>
    kubectl label secret $CLUSTER_NAME-ssh-key clusterctl.cluster.x-k8s.io/move=
    ```

## Create overrides

If your pre-provisioned machines have [overrides](../../../image-builder/override-files) you must create a secret that includes all of the overrides you wish to provide in one file. For example, if you wish to provide an override with Docker credentials and a different source for EPEL on a CentOS7 machine, you can create a file like this:

```yaml
image_registries_with_auth:
- host: "registry-1.docker.io"
  username: "my-user"
  password: "my-password"
  auth: ""
  identityToken: ""

epel_centos_7_rpm: https://my-rpm-repostory.org/epel/epel-release-latest-7.noarch.rpm

```

You can then create the related secret by running the following command:

```shell
kubectl create secret generic $CLUSTER_NAME-user-overrides --from-file=overrides.yaml=overrides.yaml
kubectl label secret $CLUSTER_NAME-user-overrides clusterctl.cluster.x-k8s.io/move=
```

When this step is complete, [define the infrastructure nodes and partitions](../define-infrastructure).
