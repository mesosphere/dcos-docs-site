---
layout: layout.pug
navigationTitle: Bootstrap
title: Bootstrap
menuWeight: 30
excerpt: Bootstrap a kind cluster
beta: true
enterprise: false
---

A bootstrap cluster refers to a special type of local Kubernetes cluster used to bootstrap other clusters. The bootstrap cluster is required because the controllers that create other Kubernetes clusters require a Kubernetes cluster to run.

Konvoy deploys all cluster lifecycle services to a bootstrap cluster, which deploys a workload cluster. When the workload cluster is ready, move the cluster lifecycle services to the workload cluster. The workload cluster then manages its own lifecycle.

## Bootstrap a kind cluster and CAPI controllers

1.  Pull the bootstrap Docker image and save it as tar.gz locally using the command that follows. The image version should correspond to the version of Konvoy as returned by the `dkp version` command. The Docker image will contain all artifacts to start without requiring access to the Internet.

    ```sh
    docker pull mesosphere/konvoy-bootstrap:<version> && docker save mesosphere/konvoy-bootstrap:<version> -o mesosphere_konvoy-bootstrap:<version>.tar.gz
    ```

1.  Copy the image tar file to the machine where the bootstrap cluster will run.

1.  Load the bootstrap Docker image. The image version should correspond to the version of Konvoy as returned by `dkp version`:

    ```sh
    docker load -i <path to mesosphere/konvoy-bootstrap image>
    ```

1.  Create a bootstrap cluster:

    ```sh
    dkp create bootstrap
    ```

When the bootstrap cluster is up, [install an SSH key](../install-ssh-key).
