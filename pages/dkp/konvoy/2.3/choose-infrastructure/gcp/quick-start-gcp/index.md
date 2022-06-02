---
layout: layout.pug
navigationTitle: Quick Start GCP
title: Quick Start GCP
excerpt: Get started by installing a cluster with default configuration settings on GCP
beta: false
enterprise: false
menuWeight: 6
---

This Quick Start guide provides simplified instructions for using Konvoy to get your Kubernetes cluster up and running with minimal configuration requirements on a Google Cloud Platform (GCP).

## Prerequisites

Before starting the Konvoy installation, verify that you have:

- An x86_64-based Linux or macOS machine with a supported version of the operating system.
- The `dkp` binary on this machine.
- [Docker][install_docker] version 18.09.2 or later.
- [kubectl][install_kubectl] for interacting with the running cluster.
- A valid GCP account with [credentials configured](https://github.com/kubernetes-sigs/cluster-api-provider-gcp).

# Create a Cluster in Google Cloud Platform 
<!NEED CONFIRMATION OF STEPS PRE-RELEASE>
## Setup your gcloud CLI

The following steps will be performed using clusterctl.
1.  Install the CLI by following [GCP Install](https://cloud.google.com/sdk/docs/install). Select location for cluster using dkp create cluster gcp --location where the --location will default to us-west-1. ????????

1.  Create a Service account
   
    ```
    export GCP_PROJECT=eng-ksphere-platform
    export GOOGLE_APPLICATION_CREDENTIALS="$HOME/.gcloud/credentials.json"

    gcloud iam service-accounts create "$USER"
    gcloud projects add-iam-policy-binding $GCP_PROJECT --member="serviceAccount:$USER@$GCP_PROJECT.iam.gserviceaccount.com" --role=roles/editor
    gcloud iam service-accounts keys create $GOOGLE_APPLICATION_CREDENTIALS --iam-account="$USER@$GCP_PROJECT.iam.gserviceaccount.com"
    ```

##  Create a VPC network

1.  Export required environment variables:

    ```
    export GCP_PROJECT=eng-ksphere-platform
    export CLUSTER_NAME=$USER-gcp-quickstart
    export GCP_NETWORK_NAME=$CLUSTER_NAME
    export GCP_REGION=us-west1
    ```

1.  Create the VPC network:

    ```
    gcloud compute networks create "${CLUSTER_NAME}" --project="$GCP_PROJECT" --subnet-mode=auto --mtu=1460 --bgp-routing-mode=regional

    gcloud compute firewall-rules create "${CLUSTER_NAME}-allow-ssh" --project="$GCP_PROJECT" --network="projects/$GCP_PROJECT/global/networks/${CLUSTER_NAME}" --description=Allows\ TCP\ connections\ from\ any\ source\ to\ any\ instance\ on\ the\ network\ using\ port\ 22. --direction=INGRESS --priority=65534 --source-ranges=0.0.0.0/0 --action=ALLOW --rules=tcp:22
    ```

### Setup Cloud NAT

Kubernetes nodes, to communicate with the control plane, pull container images from registried (e.g. gcr.io or dockerhub) need to have NAT access or a public ip. By default, the provider creates Machines without a public IP.

1.  Create the router:

    ```
    gcloud compute routers create "${CLUSTER_NAME}-router" --project="${GCP_PROJECT}" --region="${GCP_REGION}" --network="${GCP_NETWORK_NAME}"

    gcloud compute routers nats create "${CLUSTER_NAME}-nat" --project="${GCP_PROJECT}" --router-region="${GCP_REGION}" --router="${CLUSTER_NAME}-router" --nat-all-subnet-ip-ranges --auto-allocate-nat-external-ips
    ```

## Build an image

Google Cloud Platform does not publish images. You must first build the image.

<p class="message--note"><strong>Note:</strong> You may also skip this step and reuse one that already exists by exporting it.</p> ????

```
export IMAGE_NAME=cluster-api-ubuntu-2004-v1-21-10-1651240802
```

1.  Export required environment variables:

    ```
    export GCP_PROJECT_ID=$GCP_PROJECT
    ```

2.  Clone the `image-builder` project:

    ```
    git clone https://github.com/kubernetes-sigs/image-builder.git image-builder
    cd image-builder/images/capi
    ```

3.  Update `packer.json` with network configuration by inserting these new values into `builders[0]`:

    ```
    "network": "{{ user `network` }}",
    "subnetwork": "{{ user `subnetwork`  }}",
    ```

4.  Update packer template to support a non-default network:

    ```
    cat <<EOF >packer/gce/ubuntu-2004.json
    {
      "build_name": "ubuntu-2004",
      "distribution_release": "focal",
      "distribution_version": "2004",
      "zone": "${GCP_REGION}-b",
      "network": "${CLUSTER_NAME}",
      "subnetwork": "${CLUSTER_NAME}"
    }
    EOF
    ```

5.  Use `image-builder` to build an image:

    ```
    make build-gce-ubuntu-2004
    ```

6.  Save the created image name:

    ```
    export IMAGE_NAME=<>
    ```

## Create a cluster

If you use these instructions to create a cluster on GCP using the DKP default settings without any edits to configuration files or additional flags, your cluster is deployed on an Ubuntu 20.04 operating system image with 3 control plane nodes, and 4 worker nodes.

The following instructions come from [Kubernetes CAPI Quick Start](https://cluster-api.sigs.k8s.io/user/quick-start.html).

For a quick start, you will do the following in order.
 - create a bootstrap cluster
- move the CAPI controllers from the workload cluster back to the bootstrap cluster
- delete the workload cluster
- delete the bootstrap cluster

1.  Create a bootstrap cluster:

    ```
    kind create cluster
    ```

1.  Initialize the CAPG controller:

    ```
    GCP_B64ENCODED_CREDENTIALS=$( cat $GOOGLE_APPLICATION_CREDENTIALS | base64 | tr -d '\n' ) clusterctl init --infrastructure gcp
    ```

2.  Export infrastructure variables:

    ```
    export KUBERNETES_VERSION=1.21.10
    export GCP_CONTROL_PLANE_MACHINE_TYPE=n1-standard-2
    export GCP_NODE_MACHINE_TYPE=n1-standard-2
    export IMAGE_ID=projects/${GCP_PROJECT}/global/images/${IMAGE_NAME}
    export SERVICE_ACCOUNT_EMAIL=$(cat $GOOGLE_APPLICATION_CREDENTIALS | jq -r .client_email)
    ```

3.  Create kuztomize override file to set `ServiceAccount`:

    ```
    mkdir -p $CLUSTER_NAME

    cat <<EOF >$CLUSTER_NAME/kustomization.yaml
    apiVersion: kustomize.config.k8s.io/v1beta1
    kind: Kustomization
    metadata:
      name: cluster-kustomize
    bases:
    - cluster.yaml
    patchesStrategicMerge:
    - sa.yaml
    EOF

    cat <<EOF >$CLUSTER_NAME/sa.yaml
    apiVersion: infrastructure.cluster.x-k8s.io/v1beta1
    kind: GCPMachineTemplate
    metadata:
      name: $CLUSTER_NAME-control-plane
      namespace: default
    spec:
      template:
        spec:
          serviceAccounts:
            email: ${SERVICE_ACCOUNT_EMAIL}
            scopes:
              - https://www.googleapis.com/auth/cloud-platform            
    ---
    apiVersion: infrastructure.cluster.x-k8s.io/v1beta1
    kind: GCPMachineTemplate
    metadata:
      name: $CLUSTER_NAME-md-0
      namespace: default
    spec:
      template:
        spec:
          serviceAccounts:
            email: ${SERVICE_ACCOUNT_EMAIL}
            scopes:
              - https://www.googleapis.com/auth/cloud-platform
    EOF
    ```

4.  Create the cluster file:

    ```
    clusterctl generate cluster $CLUSTER_NAME \
    --kubernetes-version $KUBERNETES_VERSION \
    --control-plane-machine-count=3 \
    --worker-machine-count=4 \
    > $CLUSTER_NAME/cluster.yaml
    ```

5.  Add the `ServiceAccount` customization:

    ```
    kustomize build --reorder=none $CLUSTER_NAME -o $CLUSTER_NAME/cluster.yaml
    ```

6.  Create the cluster:

    ```
    kubectl apply -f $CLUSTER_NAME/cluster.yaml
    ```


7.  Tail the CAPG controller logs:

    ```
    kubectl logs -n capg-system -l cluster.x-k8s.io/provider=infrastructure-gcp -f
    ```

8.  Check the status of the cluster

    ```
    clusterctl describe cluster $CLUSTER_NAME
    ```

## Explore the new Kubernetes cluster

1.  Get the kubeconfig:

    ```
    clusterctl get kubeconfig $CLUSTER_NAME > $CLUSTER_NAME/$CLUSTER_NAME.conf
    export KUBECONFIG=$CLUSTER_NAME/$CLUSTER_NAME.conf
    ```

1.  Verify the API server is up (the Nodes will not be ready until CSI is deployed):

    ```
    kubectl get nodes
    ```


## Deploy Addons

1.  Deploy Calico CNI:

    ```
    kubectl apply -f https://docs.projectcalico.org/v3.22/manifests/calico.yaml
    ```

1.  Deploy GCP CSI:

    ```
    export CSI_DRIVER_DIR=$(go env GOPATH)/src/sigs.k8s.io/gcp-compute-persistent-disk-csi-driver
    mkdir -p $CSI_DRIVER_DIR
    git clone github.com:kubernetes-sigs/gcp-compute-persistent-disk-csi-driver.git $CSI_DRIVER_DIR

    GOPATH=$(go env GOPATH) GCE_PD_DRIVER_VERSION=noauth $CSI_DRIVER_DIR/deploy/kubernetes/deploy-driver.sh
    ```
    
1.  Create a StorageClass:

    ```
    kubectl apply -f $CSI_DRIVER_DIR/examples/kubernetes/demo-zonal-sc.yaml
    ```

1.  Test CIS by creating a pod with a PVC:

    ```
    kubectl apply -f $CSI_DRIVER_DIR/examples/kubernetes/demo-pod.yaml
    ```

## Delete the Kubernetes cluster and cleanup your environment
????????????
If you no longer need the cluster and want to delete it, you can do so using the DKP CLI.

1.  Update the GCP bootstrap credentials:

    ```bash
    dkp update bootstrap credentials gcp --kubeconfig=${CLUSTER_NAME}.conf
    ```

1.  Delete the provisioned Kubernetes cluster:

    ```bash
    dkp delete cluster \
    --cluster-name=${CLUSTER_NAME} \
    --kubeconfig=${CLUSTER_NAME}.conf \
    --self-managed
    ```

    You will see output similar to:

    ```sh
	 ✓ Creating a bootstrap cluster
	 ✓ Initializing new CAPI components
	 ✓ Moving cluster resources
	You can now view resources in the moved cluster by using the --kubeconfig flag with kubectl. For example: kubectl --kubeconfig=gcp-example-bootstrap.conf get nodes

    Similar to `create cluster`, use the flag `--self-managed` with the `delete cluster`command:



To understand how this process works step by step, you can follow the workflow in [Delete Cluster](../advanced/delete).
