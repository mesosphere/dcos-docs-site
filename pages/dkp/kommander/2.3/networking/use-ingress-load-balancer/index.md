---
layout: layout.pug
navigationTitle: Configure Ingress for load balancing
title: Configure Ingress for load balancing
menuWeight: 25
excerpt: Learn how to configure Ingress settings for load balancing (layer-7)
beta: false
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

**Ingress** is the name used to describe an API object that manages external access to the services in a cluster.
Typically, an Ingress exposes HTTP and HTTPS routes from outside the cluster to services running within the cluster.

The object is called an Ingress because it acts as a gateway for inbound traffic.
The Ingress receives inbound requests and routes them according to the rules you defined for the **Ingress resource** as part of your cluster configuration.

This tutorial demonstrates how to expose an application running on the Konvoy cluster by configuring an Ingress for load balancing (layer-7).

## Prerequisites

Before you begin, you must:

- Have access to a Linux, macOS, or Windows computer with a supported operating system version.
- Have a properly deployed and running cluster.

## Expose a pod using an Ingress (L7)

1. Deploy two web application Pods on your Kubernetes cluster by running the following command:

    ```bash
    kubectl run --restart=Never --image hashicorp/http-echo --labels app=http-echo-1 --port 80 http-echo-1 -- -listen=:80 --text="Hello from http-echo-1"
    kubectl run --restart=Never --image hashicorp/http-echo --labels app=http-echo-2 --port 80 http-echo-2 -- -listen=:80 --text="Hello from http-echo-2"
    ```

1. Expose the Pods with a service type of ClusterIP by running the following commands:

    ```bash
    kubectl expose pod http-echo-1 --port 80 --target-port 80 --name "http-echo-1"
    kubectl expose pod http-echo-2 --port 80 --target-port 80 --name "http-echo-2"
    ```

1. Create the Ingress to expose the application to the outside world by running the following command:

    ```bash
    cat <<EOF | kubectl create -f -
    apiVersion: networking.k8s.io/v1
    kind: Ingress
    metadata:
      annotations:
        kubernetes.io/ingress.class: kommander-traefik
        traefik.ingress.kubernetes.io/router.tls: "true"
      generation: 7
      name: echo
      namespace: default
    spec:
      rules:
      - http:
          paths:
          - backend:
              service:
                name: http-echo-1
                port:
                  number: 80
            path: /echo1
            pathType: Prefix
      - http:
          paths:
          - backend:
              service:
                name: http-echo-2
                port:
                  number: 80
            path: /echo2
            pathType: Prefix
    EOF
    ```

    The configuration settings in this example illustrates:
    - setting the `kind` to `Ingress`.
    - setting the `service.name` to be exposed as each `backend`.

1. Run the following command to get the URL of the load balancer created on AWS for the Traefik service:

    ```bash
    kubectl get svc kommander-traefik -n kommander
    ```

    This command displays the internal and external IP addresses for the exposed service.
    (Note that IP addresses and host names are for illustrative purposes. Always use the information from your own cluster)

    ```bash
    NAME                 TYPE           CLUSTER-IP    EXTERNAL-IP                                                             PORT(S)                                     AGE
    kommander-traefik    LoadBalancer   10.0.24.215   abf2e5bda6ca811e982140acb7ee21b7-37522315.us-west-2.elb.amazonaws.com   80:31169/TCP,443:32297/TCP,8080:31923/TCP   4h22m
    ```

1. Validate that you can access the web application Pods by running the following commands:
  (Note that IP addresses and host names are for illustrative purposes. Always use the information from your own cluster)

    ```bash
    curl -k https://abf2e5bda6ca811e982140acb7ee21b7-37522315.us-west-2.elb.amazonaws.com/echo1
    curl -k https://abf2e5bda6ca811e982140acb7ee21b7-37522315.us-west-2.elb.amazonaws.com/echo2
    ```
