---
layout: layout.pug
navigationTitle: Use the LoadBalancer service type
title: Use the LoadBalancer service type
menuWeight: 20
excerpt: Learn how to expose applications using the LoadBalancer (layer-4) service type
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

Kubernetes enables you to define a logical set of **pods** and an access policy as a **Service**.
You can then use services and **service types** to control how your applications receive traffic.
The **LoadBalancer** service type creates an external load balancer in the public cloud infrastructure and assigns a fixed, external IP to the service.
Authorized users can then access the service through the exposed IP address.

This tutorial demonstrates how to expose an application running on the Konvoy cluster using the LoadBalancer (layer-4) service type.

## Before you begin

Before starting this tutorial, you should verify the following:

- You must have access to a Linux, macOS, or Windows computer with a supported operating system version.

- You must have a properly deployed and running cluster. For information about deploying Kubernetes with default settings, see the [Quick start][quickstart].

## Expose a pod using the LoadBalancer (L4) service

1. Deploy a Redis Pod on your Kubernetes cluster by running the following command:

    ```bash
    cat <<EOF | kubectl create -f -
    apiVersion: v1
    kind: Pod
    metadata:
      labels:
        app: redis
      name: redis
    spec:
      containers:
      - name: redis
        image: redis:5.0.3
        ports:
        - name: redis
          containerPort: 6379
          protocol: TCP
    EOF
    ```

1. Create a service with the service type of LoadBalancer by running the following command:

    ```bash
    cat <<EOF | kubectl create -f -
    apiVersion: v1
    kind: Service
    metadata:
      labels:
        app: redis
      name: redis
    spec:
      type: LoadBalancer
      selector:
        app: redis
      ports:
      - protocol: TCP
        port: 6379
        targetPort: 6379
    EOF
    ```

    The configuration settings in this example illustrate:
    - setting the `kind` to `Service`.
    - setting the `app` to be exposed to `redis`.
    - setting the service `type` to `LoadBalancer`.

1. Get the URL of the load balancer created by the cloud provider (AWS) for the Redis service by running the following command:

    ```bash
    kubectl get svc redis
    ```

    This command displays the internal and external IP addresses for the service.

    ```bash
    NAME    TYPE           CLUSTER-IP   EXTERNAL-IP                                                               PORT(S)          AGE
    redis   LoadBalancer   10.0.51.32   a92b6c9216ccc11e982140acb7ee21b7-1453813785.us-west-2.elb.amazonaws.com   6379:31423/TCP   43s
    ```

1. Validate that you can access the Redis pod by connecting to the external IP address using the `telnet` command:

    ```bash
    telnet a92b6c9216ccc11e982140acb7ee21b7-1453813785.us-west-2.elb.amazonaws.com 6379
    Trying 52.27.218.48...
    Connected to a92b6c9216ccc11e982140acb7ee21b7-1453813785.us-west-2.elb.amazonaws.com.
    Escape character is '^]'.
    quit
    +OK
    Connection closed by foreign host.
    ```

    [quickstart]:../../quickstart/
