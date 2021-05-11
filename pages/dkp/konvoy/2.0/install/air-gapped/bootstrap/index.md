---
layout: layout.pug
navigationTitle: Bootstrap
title: Bootstrap
menuWeight: 15
excerpt: bootstrap a kind cluster
beta: true
enterprise: false
---
## Bootstrap a kind cluster and CAPI controllers

1.  Load the bootstrap docker image, the image version should correspond to the version of Konvoy as returned by `konvoy2 version`:

    ```sh
    docker load -i <path to mesosphere/konvoy2-bootstrap image>
    ```

1.  Create a bootstrap cluster:

    ```sh
    konvoy2 create bootstrap
    ```

[install_docker]: https://docs.docker.com/get-docker/
[install_clusterawsadm]: https://github.com/kubernetes-sigs/cluster-api-provider-aws/releases
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[aws_credentials]: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html
[capa]: https://github.com/kubernetes-sigs/cluster-api-provider-aws
