---
layout: layout.pug
navigationTitle: Define Infrastructure
title: Define Infrastructure
menuWeight: 50
excerpt: Define the cluster hosts and infrastructure
beta: true
enterprise: false
---

Konvoy needs to know how to access your cluster hosts. This is done using inventory resources. For initial cluster creation, you must define a control-plane and at least one worker pool.

1.  Use the following template to help you define your infrastructure:

    ```yaml
    cat <<EOF > preprovisioned_inventory.yaml
    ---
    apiVersion: infrastructure.cluster.konvoy.d2iq.io/v1alpha1
    kind: PreprovisionedInventory
    metadata:
      name: $CLUSTER_NAME-control-plane
      labels: cluster.x-k8s.io/cluster-name=$CLUSTER_NAME
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

1.  Set the environment variables, and use the `envsubst` command to populate the template and apply the results to the bootstrap cluster:

    ```shell
    export CLUSTER_NAME="$(whoami)-preprovisioned-cluster"
    export CONTROL_PLANE_1_ADDRESS="control-plane-address-1"
    export CONTROL_PLANE_2_ADDRESS="control-plane-address-2"
    export CONTROL_PLANE_3_ADDRESS="control-plane-address-3"
    export WORKER_1_ADDRESS="worker-address-1"
    export WORKER_2_ADDRESS="worker-address-2"
    export WORKER_3_ADDRESS="worker-address-3"
    export WORKER_4_ADDRESS="worker-address-4"
    export SSH_USER="<ssh-user>"
    export SSH_PRIVATE_KEY_SECRET_NAME="$CLUSTER_NAME-ssh-key"

    envsubst < preprovisioned_inventory.yaml | kubectl apply -f -
    ```

After defining the infrastructure, [define the control plane endpoint](../define-control-plane-endpoint).
