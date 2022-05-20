---
layout: layout.pug
navigationTitle: Integrate microservices using Istio
title: Integrate microservices using Istio
menuWeight: 24
excerpt: Learn how to integrate microservices managed by Istio into a Konvoy cluster
beta: false
experimental: true
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

Istio helps you manage cloud-based deployments by providing an open-source service mesh to connect, secure, control, and observe microservices.

This tutorial demonstrates how to expose an application running on the Konvoy cluster using the LoadBalancer (layer-4) service type.

<p class="message--note"><strong>NOTE: </strong>Usage and installation of Istio on Konvoy is currently a self-service feature.</p>

## Before you begin
Before starting this tutorial, you should verify the following:

- You must have access to a Linux, macOS, or Windows computer with a supported operating system version.

- You must have a properly deployed and running cluster. For information about deploying Kubernetes with default settings, see the [Quick start][quickstart].

- You must have `cert-manager` enabled and deployed through your `cluster.yaml` addon configuration.

## Deploy Istio using Konvoy

Istio can be deployed through `konvoy` by adding it to the list of configured addons for your cluster.

1. Look for a line like the following in your `cluster.yaml`:

    ```markdown
      addons:
      - configRepository: https://github.com/mesosphere/kubernetes-base-addons
        addonsList:
        - name: istio # is currently in Experimental status. More information: https://docs.d2iq.com/dkp/konvoy/latest/version-policy/#experimental-status
          enabled: false
    ```

2. Create an entry if it  _does not_ exist.

3. Set `enabled: true` for the Istio addon.

4. Run the following command to deploy Istio to your cluster:

    ```bash
    konvoy deploy addons
    ```

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

4. You should now be able to run the following commands and see output like this:

    ```bash
    $ istioctl version
    client version: <your istio version here>
    control plane version: <your istio version here>
    data plane version: <your istio version here> (1 proxies)
    ```

## Deploy a sample application on Istio

The Istio BookInfo sample application is composed of four separate microservices that demonstrate various Istio features.

1. Deploy the sample `bookinfo` application on the Kubernetes cluster by running the following commands:

    ```bash
    kubectl apply -f <(istioctl kube-inject -f samples/bookinfo/platform/kube/bookinfo.yaml)
    kubectl apply -f samples/bookinfo/networking/bookinfo-gateway.yaml
    ```

1. Get the URL of the load balancer created on AWS for this service by running the following command:

    ```bash
    kubectl get svc istio-ingressgateway -n istio-system
    ```

    The command displays output similar to the following:

    ```bash
    NAME                   TYPE           CLUSTER-IP    EXTERNAL-IP                                                               PORT(S)                                                                                                                                      AGE
    istio-ingressgateway   LoadBalancer   10.0.29.241   a682d13086ccf11e982140acb7ee21b7-2083182676.us-west-2.elb.amazonaws.com   15020:30380/TCP,80:31380/TCP,443:31390/TCP,31400:31400/TCP,15029:30756/TCP,15030:31420/TCP,15031:31948/TCP,15032:32061/TCP,15443:31232/TCP   110s
    ```

1. Open a web browser and navigate to the external IP address for the load balancer to access the application.

    For example, the external IP address in the sample output is `a682d13086ccf11e982140acb7ee21b7-2083182676.us-west-2.elb.amazonaws.com`, enabling you to access the application using the following URL: `http://a682d13086ccf11e982140acb7ee21b7-2083182676.us-west-2.elb.amazonaws.com/productpage`

1. Follow the steps in the Istio [BookInfo Application][istiobook] documentation to understand the different Istio features.

See also [Legal attributions](../../legal/open-source-attribution/)

[istiobook]:https://istio.io/docs/examples/bookinfo/
[quickstart]:../../quick-start/
