---
layout: layout.pug
navigationTitle: Use Istio
title: Use Istio
menuWeight: 24
excerpt: Learn how to integrate microservices managed by Istio into a DKP cluster
beta: false
experimental: true
---


Istio helps you manage cloud-based deployments by providing an open-source service mesh to connect, secure, control, and observe microservices.

This topic describes how to expose an application running on the DKP cluster using the LoadBalancer (layer-4) service type.

<p class="message--note"><strong>NOTE: </strong>Usage and installation of Istio on DKP is currently a self-service feature.</p>

## Before you begin
Before you begin, verify the following:

- You must have access to a Linux, macOS, or Windows computer with a supported operating system version.

- You must have a properly deployed and running cluster.

## Deploy Istio using DKP

Review the [list of available applications](../../workspaces/applications/platform-applications#workspace-platform-applications) to obtain the current 'APP NAME' for the Istio application, as you will need this name later in this procedure.

1.  Enable the deployment of Istio to [your existing attached cluster](../../clusters/attach-cluster/) by creating an `AppDeployment` resource.

1.  Within the `AppDeployment`, define the `appRef` to specify which `App` will be enabled:

    ```yaml
    cat <<EOF | kubectl apply -f -
    apiVersion: apps.kommander.d2iq.io/v1alpha2
    kind: AppDeployment
    metadata:
      name: istio
      namespace: ${WORKSPACE_NAMESPACE}
    spec:
      appRef:
        name: istio-1.14.1
        kind: ClusterApp
    EOF
    ```

1.  Create the resource in the workspace you just created, which instructs Kommander to deploy the `AppDeployment` to the `KommanderCluster`s in the same workspace.

<p class="message--note"><strong>NOTE: </strong>The <code>appRef.name</code> must match the app <code>name</code> from the list of available applications.</p>

## Download the Istio command line utility

1. Store a local environment variable containing the current Istio version running in your cluster:

    ```bash
    export KONVOY_ISTIO_VERSION="$(kubectl get clusteraddons istio -o go-template='{{ .spec.chartReference.version }}')"
    ```

2. Pull a copy of the corresponding Istio command line to your system:

    ```bash
    curl -L https://istio.io/downloadIstio | ISTIO_VERSION=${KONVOY_ISTIO_VERSION} sh -
    ```

3. Change to the Istio directory and set your PATH environment variable by running the following commands:

    ```bash
    cd istio*
    export PATH=$PWD/bin:$PATH
    ```

4. You should now be able to run the following `istioctl` command and view the subsequent output:

    ```bash
    istioctl version
    ```
    
    ```sh
    client version: <your istio version here>
    control plane version: <your istio version here>
    data plane version: <your istio version here> (1 proxies)
    ```

## Deploy a sample application on Istio

The Istio BookInfo sample application is composed of four separate microservices that demonstrate various Istio features.

1. Deploy the sample `bookinfo` application on the Kubernetes cluster by running the following commands:

    <p class="message--warning"><strong>IMPORTANT:</strong> Ensure your <code>dkp</code> configuration references the cluster where you deployed Istio by setting the <code>KUBECONFIG</code> environment variable, or using the <code>--kubeconfig</code> flag, <a href="https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/">in accordance with Kubernetes conventions</a>.

    ```bash
    kubectl apply -f <(istioctl kube-inject -f samples/bookinfo/platform/kube/bookinfo.yaml)
    kubectl apply -f samples/bookinfo/networking/bookinfo-gateway.yaml
    ```

1. Get the URL of the load balancer created on AWS for this service by running the following command:

    ```bash
    kubectl get svc istio-ingressgateway -n istio-system
    ```

    The command displays output similar to the following:

    ```sh
    NAME                   TYPE           CLUSTER-IP    EXTERNAL-IP                                                               PORT(S)                                                                                                                                      AGE
    istio-ingressgateway   LoadBalancer   10.0.29.241   a682d13086ccf11e982140acb7ee21b7-2083182676.us-west-2.elb.amazonaws.com   15020:30380/TCP,80:31380/TCP,443:31390/TCP,31400:31400/TCP,15029:30756/TCP,15030:31420/TCP,15031:31948/TCP,15032:32061/TCP,15443:31232/TCP   110s
    ```

1. Open a web browser and navigate to the external IP address for the load balancer to access the application.

    For example, the external IP address in the sample output is `a682d13086ccf11e982140acb7ee21b7-2083182676.us-west-2.elb.amazonaws.com`, enabling you to access the application using the following URL: `http://a682d13086ccf11e982140acb7ee21b7-2083182676.us-west-2.elb.amazonaws.com/productpage`

1. Follow the steps in the Istio [BookInfo Application][istiobook] documentation to understand the different Istio features.

[istiobook]:https://istio.io/docs/examples/bookinfo/
