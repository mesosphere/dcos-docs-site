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

## Name your cluster

Give your cluster a unique name suitable for your environment.

Set the environment variable to be used throughout this procedure:

```bash
export CLUSTER_NAME=preprovisioned-example
```

## Tips and Tricks

(Optional) If you want to create a unique cluster name, use this command.
This creates a unique name every time you run it, so use it carefully.

```bash
export CLUSTER_NAME=preprovisioned-example-$(LC_CTYPE=C tr -dc 'a-z0-9' </dev/urandom | fold -w 5 | head -n1)
echo $CLUSTER_NAME
```

```sh
preprovisioned-example-pf4a3
```

## Create a secret

Create a secret that contains the SSH key with these commands:

```bash
export SSH_PRIVATE_KEY_FILE="<path-to-ssh-private-key>" 
```

```bash
export SSH_PRIVATE_KEY_SECRET_NAME=$CLUSTER_NAME-ssh-key
```

```bash
kubectl create secret generic ${SSH_PRIVATE_KEY_SECRET_NAME} --from-file=ssh-privatekey=${SSH_PRIVATE_KEY_FILE}
kubectl label secret ${SSH_PRIVATE_KEY_SECRET_NAME} clusterctl.cluster.x-k8s.io/move=
```

```sh
secret/preprovisioned-example-ssh-key created
secret/preprovisioned-example-ssh-key labeled
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

```bash
kubectl create secret generic $CLUSTER_NAME-user-overrides --from-file=overrides.yaml=overrides.yaml
kubectl label secret $CLUSTER_NAME-user-overrides clusterctl.cluster.x-k8s.io/move=
```

```sh
secret/preprovisioned-example-user-overrides-md-1 created
secret/preprovisioned-example-user-overrides-md-1 labeled
```

When this step is complete, [define the infrastructure nodes and partitions](../define-infrastructure).
