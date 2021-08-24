---
layout: layout.pug
navigationTitle: Define Infrastructure
title: Define Infrastructure
menuWeight: 50
excerpt: Define the cluster nodes and their partitioning in your infrastructure
beta: true
enterprise: false
---

<!-- markdownlint-disable MD030 MD034 -->

Konvoy needs to know how to access your cluster nodes and how to partition them. This is done using inventory resources. For initial cluster bootstrapping, you must define a control-plane and at least one worker pool.

1.  Use the following template to help you define your infrastructure:

    ```yaml
    ---
    apiVersion: infrastructure.cluster.konvoy.d2iq.io/v1alpha1
    kind: PreprovisionedInventory
    metadata:
      name: $CLUSTER_NAME-control-plane
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
        user: core
        privateKeyRef:
          # This is the name of the secret you created in the previous step. It must exist in the same
          # namespace as this inventory object.
          name: ${SSH_PRIVATE_KEY_SECRET_NAME}
          namespace: default
    ---
    apiVersion: infrastructure.cluster.konvoy.d2iq.io/v1alpha1
    kind: PreprovisionedInventory
    metadata:
      name: $CLUSTER_NAME-md-0
    spec:
      hosts:
        - address: $WORKER_1_ADDRESS
        - address: $WORKER_2_ADDRESS
      sshConfig:
        port: 22
        user: core
        privateKeyRef:
          name: ${SSH_PRIVATE_KEY_SECRET_NAME}
          namespace: default
    ```

1.  Save the completed template to `preprovisioned_inventory.yaml`

1.  Set the environment variables, and use the `envsubst` command to populate the template and apply the results to the bootstrap cluster:

    ```shell
    export CLUSTER_NAME="cluster_1"
    export CONTROL_PLANE_1_ADDRESS="address_1"
    export CONTROL_PLANE_2_ADDRESS="address_2"
    export CONTROL_PLANE_3_ADDRESS="address_3"
    export WORKER_1_ADDRESS="worker_address_1"
    export WORKER_2_ADDRESS="worker_address_2"
    export SSH_PRIVATE_KEY_FILE="<ssh-private-key-secret-name>"

    envsubst < preprovisioned_inventory.yaml | kubectl apply -f
    ```

After defining the infrastructure, [define the API server endpoints](../define-apiserver-endpoints).
