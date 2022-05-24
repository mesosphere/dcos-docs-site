---
layout: layout.pug
navigationTitle: Create a New Cluster
title: Create a New Cluster
menuWeight: 20
excerpt: Use Konvoy to create a new Kubernetes cluster
enterprise: false
---

## Prerequisites

- Before you begin, make sure you have created a [Bootstrap][bootstrap] cluster.

## Create a new GCP cluster
<!NEED CONFIRMATION OF STEPS PRE-RELEASE>
1. Create the cluster:

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

## Create a new GCP Kubernetes cluster
<!NEED CONFIRMATION OF STEPS PRE-RELEASE>
1.  Ensure your GCP credentials are up to date. Refresh the credentials:

    ```bash
    dkp update bootstrap credentials gcp
    ```

1.  Generate the Kubernetes cluster objects:

<p class="message--note"><strong>NOTE: </strong>To increase <a href="https://docs.docker.com/docker-hub/download-rate-limit/">Dockerhub's rate limit</a> use your Dockerhub credentials when creating the cluster, by setting the following flag <code>--registry-mirror-url=https://registry-1.docker.io --registry-mirror-username= --registry-mirror-password=</code> on the <code>dkp create cluster command</code>.</p>

    ```bash
    dkp create cluster gcp --cluster-name=${CLUSTER_NAME} \
    --dry-run \
    --output=yaml \
    > ${CLUSTER_NAME}.yaml
    ```

## Explore the cluster

1.  Get the kubeconfig:

    ```
    clusterctl get kubeconfig $CLUSTER_NAME > $CLUSTER_NAME/$CLUSTER_NAME.conf
    export KUBECONFIG=$CLUSTER_NAME/$CLUSTER_NAME.conf
    ```

1.  Verify the API server is up (the Nodes will not be ready until CSI is deployed):

    ```
    kubectl get nodes
    ```

[bootstrap]: ../bootstrap
[capi_concepts]: https://cluster-api.sigs.k8s.io/user/concepts.html
[download_aws_cli]: https://aws.amazon.com/cli/
[k8s_custom_resources]: https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/