---
layout: layout.pug
navigationTitle: Bootstrap Cluster
title: Bootstrap Cluster
menuWeight: 10
excerpt: Configure, set up the control plane for, and create your bootstrap cluster.
beta: false
enterprise: false
---
This section covers the configuration and creation of a bootstrap cluster and it's control plane.

## Configure the bootstrap cluster

1. Set the cluster name using environment variables.

    ```bash
  # Clustername
  CLUSTER_SUFFIX=ABC
  export CLUSTER_NAME=cluster-${CLUSTER_SUFFIX,,}
    ```
<p class="message--note"><strong>NOTE:</strong> Resource types require their names to follow the DNS label standard as defined in RFC 1123. This means the name must:
* Contain at most 63 characters
* Contain only lowercase alphanumeric characters or ‘-’
* Start with an alphanumeric character
* End with an alphanumeric character </p>

1. The following variables are required based on the infrastructure, AWS IAM roles, and policies in order to appropriately setup the bootstrap cluster and control plane.

```bash
# AWS Region
export AWS_REGION=us-gov-east-1

# Existing AWS infrastructure
export AWS_VPC_ID=vpc-058da8b5f1fcb1369
export AWS_SUBNET_IDS=subnet-01e311c571e725790
export AWS_SECURITY_GROUPS=sg-0c343b2847fb7cd48
export AWS_ADDITIONAL_SECURITY_GROUPS=sg-0c343b2847fb7cd48

# AWS AMI
export AWS_AMI_ID=ami-08f1f6c4a711e2d2d

# Instance Profile
export INSTANCE_PROFILE_NAME=ag-role
export INSTANCE_PROFILE_SUFFIX=cluster-api-provider-aws.sigs.k8s.io
export INSTANCE_PROFILE=${INSTANCE_PROFILE_NAME}.${INSTANCE_PROFILE_SUFFIX}
```

1. Configure your cluster to use an existing Docker registry as a mirror when attempting to pull images.

```bash
export DOCKER_REGISTRY_ADDRESS=http://$(hostname -I | awk '{print $1}'):5000
export DOCKER_REGISTRY_CA=<path to the CA on the bootstrap system>
```
<p class="message--note"><strong>NOTE:</strong> DOCKER_REGISTRY_CA is the path on the bastion machine to the Docker registry CA and is optional. Konvoy will configure the cluster nodes to trust this CA. This value is only needed if the registry is using a self-signed certificate and the AMIs are not already configured to trust this CA.</p>

Now that these values are set, create the bootstrap cluster.

## Create the bootstrap cluster

1. Create the bootstrap cluster.

```bash
dkp create bootstrap
```

1. Once the cluster has been created, Generate the cluster yaml.

```bash
dkp create cluster aws \
  --cluster-name=${CLUSTER_NAME} \
  --dry-run \
  -o yaml \
  --region=${AWS_REGION} \
  --vpc-id=${AWS_VPC_ID} \
  --ami=${AWS_AMI_ID} \
  --subnet-ids=${AWS_SUBNET_IDS} \
  --internal-load-balancer=true \
  --control-plane-iam-instance-profile=${INSTANCE_PROFILE} \
  --worker-iam-instance-profile=${INSTANCE_PROFILE} \
  --with-aws-bootstrap-credentials=false \
  --registry-mirror-url=${DOCKER_REGISTRY_ADDRESS} > ${CLUSTER_NAME}.yaml
```
When ready, begin configuring the control plane.

## Configuring the cluster control plane
1.  Apply the cluster configuration.

    ```bash
    kubectl apply -f cluster-abc.yaml
    ```

1.  Monitor the Kubernetes cluster deployment.

    ```bash
    watch dkp describe cluster -c cluster-abc
    ```

## Add cluster controllers

1.  Get the kubeconfig file.

    ```bash
dkp get kubeconfig -c cluster-abc > cluster-abc.conf
    ```

1.  Verify the nodes are ‘Ready’.

    ```bash
    kubectl --kubeconfig cluster-abc.conf get nodes
    ```

1.  Add the ClusterAPI controllers to the cluster

    ```bash
dkp create bootstrap controllers --with-aws-bootstrap-credentials=false --kubeconfig cluster-abc.conf

    ```

1.  When the workload cluster is ready, move the cluster lifecycle services to the workload cluster.

    ```bash
dkp move --to-kubeconfig cluster-abc.conf

    ```

1.  Wait for the cluster control-plane to be ready

    ```bash
    kubectl --kubeconfig cluster-abc.conf wait --for=condition=ControlPlaneReady "clusters/cluster-abc" --timeout=20m
	```

    Output
	```bash
    cluster.cluster.x-k8s.io/aws-example condition met
    ```
At this point, begin exploring your created bootstrap cluster via:
* [Exploring the new Kubernetes cluster in AWS][explore]

Or create more clusters via:
* [Creating another new Kubernetes cluster in AWS][create]

[create][.../air-gapped/new]
[explore][.../air-gapped/explore]
