---
layout: layout.pug
navigationTitle: Deploy a sample application
title: Deploy a sample application
menuWeight: 5
excerpt: Learn how to deploy a sample application on the Konvoy cluster
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

After you have a basic Konvoy cluster installed and ready to use, you might want to test operations by deploying a simple, sample application.
This task is **optional** and is only intended to demonstrate the basic steps for deploying applications in a production environment.
If you are configuring the Konvoy cluster for a production deployment, you can use this section to learn the deployment process.
However, deploying applications on a production cluster typically involves more planning and custom configuration than covered in this example.

This tutorial demonstrates how you can deploy a simple application that connects to the Redis service.
The sample application used in this tutorial is a condensed form of the Kubernetes sample [guestbook][guestbook] application.

To deploy the sample application:

1. Deploy the Redis master pods and service by running the following commands:

    ```bash
    kubectl apply -f https://k8s.io/examples/application/guestbook/redis-master-deployment.yaml
    kubectl apply -f https://k8s.io/examples/application/guestbook/redis-master-service.yaml
    ```

1. Deploy the Redis agents by running the following commands:

    ```bash
    kubectl apply -f https://k8s.io/examples/application/guestbook/redis-slave-deployment.yaml
    kubectl apply -f https://k8s.io/examples/application/guestbook/redis-slave-service.yaml
    ```

1. Deploy the webapp frontend by running the following command:

    ```bash
    kubectl apply -f https://k8s.io/examples/application/guestbook/frontend-deployment.yaml
    ```

1. Deploy the load balancer for the sample application using a cloud `LoadBalancer` service type instead of a `NodePort` service type by running the following command:

    ```bash
    curl -L https://k8s.io/examples/application/guestbook/frontend-service.yaml | sed "s@NodePort@LoadBalancer@" | kubectl apply -f -
    ```

    This step has been specifically modified to optimize load balancing for a default Konvoy cluster.

1. Check the availability of the deployed service by running the following command:

    ```bash
    kubectl get pods -l app=guestbook -l tier=frontend  # check the app pods
    kubectl get service frontend                        # check the load balancer
    ```

    The service properties provide the name of the load balancer. You can connect to the application by accessing that load balancer address in your web browser.

    Because this sample deployment creates a **cloud load balancer**,  you should keep in mind that creating the load balancer can up to a few minutes.
    You also might experience a slight delay before it is running properly due to DNS propagation and synchronization.

1. Remove the sample application by running the following commands:

    ```bash
    kubectl delete service frontend
    kubectl delete service redis-master
    kubectl delete service redis-slave
    kubectl delete deployment frontend
    kubectl delete deployment redis-master
    kubectl delete deployment redis-slave
    ```

    You should note that this step is **required** because the sample deployment attaches a **cloud provider load balancer** to the Konvoy cluster.
    Therefore, you **must delete** the sample application before tearing down the cluster.

1. Tear down the cluster by running the following command:

    ```bash
    konvoy down
    ```

    This command destroys the Kubernetes cluster and the infrastructure it runs on.
