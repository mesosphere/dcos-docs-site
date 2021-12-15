---
layout: layout.pug
navigationTitle: Define Infrastructure
title: Define Infrastructure
menuWeight: 50
excerpt: Define the cluster hosts and infrastructure
beta: false
enterprise: false
---

Konvoy needs to know how to access your cluster hosts. This is done using inventory resources. For initial cluster creation, you must define a control-plane and at least one worker pool.

## Name your cluster

Give your cluster a unique name suitable for your environment.

Set the environment variable to be used throughout this procedure:

```sh
CLUSTER_NAME=my-preprovisioned-cluster
```

Note: If you want to create a unique cluster name, use this command.
This creates a unique name every time you run it, so use it carefully.

```sh
CLUSTER_NAME=$(whoami)-preprovisioned-cluster-$(LC_CTYPE=C tr -dc 'a-z0-9' </dev/urandom | fold -w 5 | head -n1)
echo $CLUSTER_NAME
```

```text
hunter-aws-cluster-pf4a3
```

## Define your infrastructure

1.  Export these environment variables:

    ```shell
    export CONTROL_PLANE_1_ADDRESS="control-plane-address-1"
    export CONTROL_PLANE_2_ADDRESS="control-plane-address-2"
    export CONTROL_PLANE_3_ADDRESS="control-plane-address-3"
    export WORKER_1_ADDRESS="worker-address-1"
    export WORKER_2_ADDRESS="worker-address-2"
    export WORKER_3_ADDRESS="worker-address-3"
    export WORKER_4_ADDRESS="worker-address-4"
    export SSH_USER="<ssh-user>"
    export SSH_PRIVATE_KEY_SECRET_NAME="$CLUSTER_NAME-ssh-key"
    ```

1.  Use the following template to help you define your infrastructure. The environment variables that you set in the previous step automatically replace the variable names when the file is created.

    ```yaml
    cat <<EOF > preprovisioned_inventory.yaml
    ---
    apiVersion: infrastructure.cluster.konvoy.d2iq.io/v1alpha1
    kind: PreprovisionedInventory
    metadata:
      name: $CLUSTER_NAME-control-plane
      namespace: default
      labels:
        cluster.x-k8s.io/cluster-name: $CLUSTER_NAME
        clusterctl.cluster.x-k8s.io/move: ""
    spec:
      hosts:
        # Create as many of these as needed to match your infrastructure
        - address: $CONTROL_PLANE_1_ADDRESS
        - address: $CONTROL_PLANE_2_ADDRESS
        - address: $CONTROL_PLANE_3_ADDRESS
      sshConfig:
        port: 22
        # This is the username used to connect to your infrastructure. This user must be root or
        # have the ability to use sudo without a password
        user: $SSH_USER
        privateKeyRef:
          # This is the name of the secret you created in the previous step. It must exist in the same
          # namespace as this inventory object.
          name: $SSH_PRIVATE_KEY_SECRET_NAME
          namespace: default
    ---
    apiVersion: infrastructure.cluster.konvoy.d2iq.io/v1alpha1
    kind: PreprovisionedInventory
    metadata:
      name: $CLUSTER_NAME-md-0
      namespace: default
      labels:
        clusterctl.cluster.x-k8s.io/move: ""
    spec:
      hosts:
        - address: $WORKER_1_ADDRESS
        - address: $WORKER_2_ADDRESS
        - address: $WORKER_3_ADDRESS
        - address: $WORKER_4_ADDRESS
      sshConfig:
        port: 22
        user: $SSH_USER
        privateKeyRef:
          name: $SSH_PRIVATE_KEY_SECRET_NAME
          namespace: default
    EOF
    ```

1.  Apply the new infrastructure file with the command:

    ```shell
    envsubst < preprovisioned_inventory.yaml | kubectl apply -f -
    ```

## Prepare your machines

For DKP to install completely, you must stop `firewalld`, if enabled.

Verify `firewalld` is running before you deploy DKP. Use SSH to access each of the machines onto which you are deploying DKP, and check to see if 'firewalld' is running, using the command:

```sh
systemctl status firewalld
```

If it is active, you will need to stop `firewalld`:

```sh
systemctl stop firewalld
```

After defining the infrastructure, [define the control plane endpoint](../define-control-plane-endpoint).
