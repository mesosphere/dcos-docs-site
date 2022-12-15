---
layout: layout.pug
navigationTitle: Bootstrap
title: Bootstrap
menuWeight: 15
excerpt: Bootstrap a kind cluster
beta: false
enterprise: false
---
## Bootstrap a kind cluster and CAPI controllers

Konvoy deploys all cluster lifecycle services to a bootstrap cluster, which deploys a workload cluster. When the workload cluster is ready, move the cluster lifecycle services to the workload cluster, after which the workload cluster manages its own lifecycle.

1.  Download the bootstrap docker image on a machine that has access to this artifact.

    ```docker
    curl -O http://downloads.d2iq.com/konvoy/airgapped/v2.1.4/konvoy-bootstrap_v2.1.4.tar
    ```

1.  Load the bootstrap docker image on your bastion machine.

    ```docker
    docker load -i konvoy-bootstrap_v2.1.4.tar
    ```

1.  Create a bootstrap cluster:

    ```bash
    dkp create bootstrap --kubeconfig $HOME/.kube/config
    ```

1.  (Optional) Refresh the credentials used by the AWS provider at any time, using the command:

    ```bash
    dkp update bootstrap credentials aws
    ```

Then, you can [create a cluster][create-a-cluster].

[aws_credentials]: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html
[capa]: https://github.com/kubernetes-sigs/cluster-api-provider-aws
[install_clusterawsadm]: https://github.com/kubernetes-sigs/cluster-api-provider-aws/releases
[install_docker]: https://docs.docker.com/get-docker/
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[create-a-cluster]: ../new
