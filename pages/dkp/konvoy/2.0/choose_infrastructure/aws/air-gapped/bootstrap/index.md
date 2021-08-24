---
layout: layout.pug
navigationTitle: Bootstrap
title: Bootstrap
menuWeight: 15
excerpt: bootstrap a kind cluster
beta: false
enterprise: false
---
## Bootstrap a kind cluster and CAPI controllers

Konvoy deploys all cluster lifecycle services to a bootstrap cluster, which deploys a workload cluster. When the workload cluster is ready, move the cluster lifecycle services to the workload cluster, after which the workload cluster manages its own lifecycle.

1.  Pull the bootstrap Docker image and save it as tar.gz locally. The image version should correspond to the version of Konvoy as returned by `dkp version`:

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

[install_docker]: https://docs.docker.com/get-docker/
[install_clusterawsadm]: https://github.com/kubernetes-sigs/cluster-api-provider-aws/releases
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[aws_credentials]: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html
[capa]: https://github.com/kubernetes-sigs/cluster-api-provider-aws
