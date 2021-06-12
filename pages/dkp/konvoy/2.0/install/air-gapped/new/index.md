---
layout: layout.pug
navigationTitle: Create a New Cluster
title: Create a New Cluster
menuWeight: 20
excerpt: Create a new AWS Kubernetes cluster
beta: true
enterprise: false
---

## Create a new AWS Kubernetes cluster in the existing infrastructure

1.  Give your cluster a name suitable for your environment:

    ```sh
    export CLUSTER_NAME=$(whoami)-aws-air-gapped-cluster
    ```

1.  Export variables for the existing infrastructure details:

    ```sh
    export AWS_VPC_ID=<vpc-...>
    export AWS_SUBNET_IDS=<subnet-...,subnet-...,subnet-...>
    export AWS_ADDITIONAL_SECURITY_GROUPS=<sg-...>
    export AWS_AMI_ID=<ami-...>
    ```

    - `AWS_VPC_ID`: the VPC ID where the cluster will be created.
    - `AWS_SUBNET_IDS`: a comma-separated list of one or more private Subnet IDs with each one in a different Availability Zone. The cluster control-plane and worker nodes will automatically be spread across these Subnets.
    - `AWS_ADDITIONAL_SECURITY_GROUPS`: a comma-seperated list of one or more Security Groups IDs to use in addition to the ones automatically created by [CAPA][capa].
    - `AWS_AMI_ID`: the AMI ID to use for control-plane and worker nodes.

    <p class="message--important"><strong>IMPORTANT: </strong>The VPC requires the <code>ec2</code>, <code>elasticloadbalancing</code>, <code>secretsmanager</code>, and <code>autoscaling</code> VPC endpoints to be already present.</p>

    <p class="message--important"><strong>IMPORTANT: </strong>You must tag the subnets as described below to allow for Kubernetes to create ELBs for services of type <code>LoadBalancer</code> in those subnets. If the subnets are not tagged, they will not receive an ELB and the following error displays: <code>Error syncing load balancer, failed to ensure load balancer; could not find any suitable subnets for creating the  ELB.</code>.</p>

    The tags should be set as follows, where `<CLUSTER_NAME>` corresponds to the name set in `CLUSTER_NAME` environment variable:

    ```text
    kubernetes.io/cluster = <CLUSTER_NAME>
    kubernetes.io/cluster/CLUSTER_NAME = owned
    kubernetes.io/role/internal-elb = 1
    ```

1.  Configure your cluster to use an existing Docker registry as a mirror when attempting to pull images:

    ```sh
    export DOCKER_REGISTRY_ADDRESS=<https/http>://<registry-address>:<registry-port>
    export DOCKER_REGISTRY_CA=<path to the CA on the bastion>
    ```

    - `DOCKER_REGISTRY_ADDRESS`: the address of an existing Docker registry accessible in the VPC that the new cluster nodes will be configured to use a mirror registry when pulling images.
    - `DOCKER_REGISTRY_CA`: (optional) the path on the bastion machine to the Docker registry CA. Konvoy will configure the cluster nodes to trust this CA. This value is only needed if the registry is using a self-signed certificate and the AMIs are not already configured to trust this CA.

1.  Create a Kubernetes cluster:

    ```sh
    konvoy create cluster aws --cluster-name=${CLUSTER_NAME} \
    --vpc-id=${AWS_VPC_ID} \
    --ami=${AWS_AMI_ID} \
    --subnet-ids=${AWS_SUBNET_IDS} \
    --internal-load-balancer=true \
    --additional-security-group-ids=${AWS_ADDITIONAL_SECURITY_GROUPS} \
    --registry-mirror-url=${DOCKER_REGISTRY_ADDRESS} \
    --registry-mirror-cacert=${DOCKER_REGISTRY_CA}
    ```

1.  Inspect the created cluster resources:

    ```sh
    kubectl get clusters,kubeadmcontrolplanes,machinedeployments
    ```

1.  Wait for the cluster control-plane to be ready:

    ```sh
    kubectl wait --for=condition=ControlPlaneReady "clusters/${CLUSTER_NAME}" --timeout=60m
    ```

**Note:** These AMIs are created by the [konvoy-image-builder](https://github.com/mesosphere/konvoy-image-builder) project. They will have container images "baked into" them. You can find the list of container images in this [ansible task](https://github.com/mesosphere/konvoy-image-builder/blob/main/ansible/roles/images/defaults/main.yaml)

[install_docker]: https://docs.docker.com/get-docker/
[install_clusterawsadm]: https://github.com/kubernetes-sigs/cluster-api-provider-aws/releases
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[aws_credentials]: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html
[capa]: https://github.com/kubernetes-sigs/cluster-api-provider-aws
