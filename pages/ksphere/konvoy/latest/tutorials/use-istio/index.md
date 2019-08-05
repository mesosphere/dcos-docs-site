---
layout: layout.pug
navigationTitle: Integrate microservices using Istio
title: Integrate microservices using Istio
menuWeight: 24
excerpt: Learn how to integrate microservices managed by Istio into a Konvoy cluster
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

Istio helps you manage cloud-based deployments by providing an open-source service mesh to connect, secure, control, and observe microservices.

This tutorial demonstrates how to expose an application running on the Konvoy cluster using the LoadBalancer (layer-4) service type.

## Before you begin
Before starting this tutorial, you should verify the following:

- You must have access to a Linux, macOS, or Windows computer with a supported operating system version.

- You must have a properly deployed and running cluster. For information about deploying Kubernetes with default settings, see the [Quick start][quickstart].

## Deploy Istio using Helm

1. Download the latest release of Istio by running the following command:

    ```bash
    curl -L https://git.io/getLatestIstio | ISTIO_VERSION=1.1.8 sh -
    ```

1. Change to the Istio directory and set your PATH environment variable by running the following commands:

    ```bash
    cd istio*
    export PATH=$PWD/bin:$PATH
    ```

1. Install Istio using Helm by runbubg the following commands:

    ```bash
    helm install install/kubernetes/helm/istio-init --name istio-init --namespace istio-system
    helm install install/kubernetes/helm/istio --name istio --namespace istio-system
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

1. Open a web browser and naviage to the external IP address for the load balancer to access the application.

    For example, the external IP address in the sample output is `a682d13086ccf11e982140acb7ee21b7-2083182676.us-west-2.elb.amazonaws.com`, enabling you to access the application using the following URL: `http://a682d13086ccf11e982140acb7ee21b7-2083182676.us-west-2.elb.amazonaws.com/productpage`

1. Follow the steps in the Istio [BookInfo Application][istiobook] documentation to understand the different Istio features.

[istiobook]:https://istio.io/docs/examples/bookinfo/
[quickstart]:../../quick-start/
