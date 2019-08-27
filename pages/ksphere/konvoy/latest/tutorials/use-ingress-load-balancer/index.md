---
layout: layout.pug
navigationTitle: Configure Ingress for load balancing
title: Configure Ingress for load balancing
menuWeight: 21
excerpt: Learn how to configure Ingress settings for load balancing (layer-7)
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

**Ingress** is the name used to describe an API object that manages external access to the services in a cluster.
Typically, an ingress exposes HTTP and HTTPS routes from outside the cluster to services running within the cluster.

The object is called an ingress because it acts as a gateway for  inbound traffic.
The ingress receives inbound requests and routes them according to the rules you defined for the **ingress resource** as part of your cluster configuration.

This tutorial demonstrates how to expose an application running on the Konvoy cluster by configuring an Ingress for load balancing (layer-7).

## Before you begin

Before starting this tutorial, you should verify the following:

- You must have access to a Linux, macOS, or Windows computer with a supported operating system version.

- You must have a properly deployed and running cluster. For information about deploying Kubernetes with default settings, see the [Quick start][quickstart].

## Expose a pod using an Ingress (L7)

1. Deploy two web application Pods on your Kubernetes cluster by running the following command:

    ```bash
    kubectl run --restart=Never --image hashicorp/http-echo --labels app=http-echo-1 --port 80 http-echo-1 -- -listen=:80 --text="Hello from http-echo-1"
    kubectl run --restart=Never --image hashicorp/http-echo --labels app=http-echo-2 --port 80 http-echo-2 -- -listen=:80 --text="Hello from http-echo-2"
    ```

1. Expose the Pods with a service type of NodePort by running the following commands:

    ```bash
    kubectl expose pod http-echo-1 --port 80 --target-port 80 --type NodePort --name "http-echo-1"
    kubectl expose pod http-echo-2 --port 80 --target-port 80 --type NodePort --name "http-echo-2"
    ```

1. Create the Ingress to expose the application to the outside world by running the following command:

    ```bash
    cat <<EOF | kubectl create -f -
    apiVersion: extensions/v1beta1
    kind: Ingress
    metadata:
      name: echo
    spec:
      rules:
      - host: "http-echo-1.com"
        http:
          paths:
          - backend:
              serviceName: http-echo-1
              servicePort: 80
      - host: "http-echo-2.com"
        http:
          paths:
          - backend:
              serviceName: http-echo-2
              servicePort: 80
    EOF
    ```

    The configuration settings in this example illustrates:
    - setting the `kind` to `Ingress`.
    - setting the `serviceName` to be exposed as each `backend`.

1. Run the following command to get the URL of the load balancer created on AWS for the Traefik service:

    ```bash
    kubectl get svc traefik-kubeaddons -n kubeaddons
    ```

    This command displays the internal and external IP addresses for the exposed service.

    ```bash
    NAME                 TYPE           CLUSTER-IP    EXTERNAL-IP                                                             PORT(S)                                     AGE
    traefik-kubeaddons   LoadBalancer   10.0.24.215   abf2e5bda6ca811e982140acb7ee21b7-37522315.us-west-2.elb.amazonaws.com   80:31169/TCP,443:32297/TCP,8080:31923/TCP   4h22m
    ```

1. Validate that you can access the web application Pods by running the following commands:

    ```bash
    curl -k -H "Host: http-echo-1.com" https://abf2e5bda6ca811e982140acb7ee21b7-37522315.us-west-2.elb.amazonaws.com
    curl -k -H "Host: http-echo-2.com" https://abf2e5bda6ca811e982140acb7ee21b7-37522315.us-west-2.elb.amazonaws.com
    ```

    [quickstart]:../../quick-start/
