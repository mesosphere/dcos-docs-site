---
layout: layout.pug
navigationTitle: Deploy a sample application
title: Deploy a sample application
menuWeight: 5
excerpt: Learn how to deploy a sample application on a DKP cluster
beta: false
enterprise: false
---

After you have a basic DKP cluster installed and ready to use, you might want to test operations by deploying a simple, sample application.
This task is **optional** and is only intended to demonstrate the basic steps for deploying applications in a production environment.
If you are configuring the DKP cluster for a production deployment, you can use this section to learn the deployment process.
However, deploying applications on a production cluster typically involves more planning and custom configuration than covered in this example.

This tutorial shows how to deploy a simple application that connects to the `redis` service.
The sample application used in this tutorial is a condensed form of the Kubernetes sample [guestbook][guestbook] application.

## Before you begin

You must have a [DKP cluster running][choose-infra].

Before running the commands below, ensure that your `kubectl` configuration references the DKP cluster on which you want to install the application. You can do this by setting the `KUBECONFIG` environment variable to the appropriate kubeconfig file’s location.

## To deploy the sample application

1.  Deploy the Redis pods and service by running the following commands:

    ```bash
    kubectl apply -f https://k8s.io/examples/application/guestbook/redis-leader-deployment.yaml
    kubectl apply -f https://k8s.io/examples/application/guestbook/redis-leader-service.yaml
    ```

1.  Deploy Redis followers. The leader deployment created above is a single pod. Adding followers (or replicas) makes it highly available to meet greater traffic demands. You must then setup the guestbook application to communicate with the Redis followers to read the data. To do this, set up another service (the `redis-follower-service.yaml` below). Do this by running the following commands:

    ```bash
    kubectl apply -f https://k8s.io/examples/application/guestbook/redis-follower-deployment.yaml
    kubectl apply -f https://k8s.io/examples/application/guestbook/redis-follower-service.yaml
    ```

1.  Deploy the web app frontend by running the following command:

    ```bash
    kubectl apply -f https://k8s.io/examples/application/guestbook/frontend-deployment.yaml
    ```

1.  Confirm that there are three frontend replicas running:

    ```bash
    kubectl get pods -l app=guestbook -l tier=frontend
    ```

1.  Apply the frontend Service:

    ```bash
    kubectl apply -f https://k8s.io/examples/application/guestbook/frontend-service.yaml
    ```

1.  Configure the front end service to use a cloud load balancer:

    ```bash
    cat << EOF | kubectl apply -f -
    apiVersion: v1
    kind: Service
    metadata:
      name: frontend
      labels:
        app: guestbook
        tier: frontend
    spec:
      type: LoadBalancer
      ports:
      - port: 80
      selector:
        app: guestbook
        tier: frontend
    EOF
    ```

1.  View the frontend service via the LoadBalancer by running the following command to get the IP address for the frontend Service:

    ```bash
    kubectl get service frontend
    ```

1.  Copy the external IP address, and load the page in your browser to view your guestbook.

    The service properties provide the name of the load balancer. You can connect to the application by accessing that load balancer address in your web browser.
    Because this sample deployment creates a **cloud load balancer**,  you should keep in mind that creating the load balancer can take up to a few minutes.
    You also might experience a slight delay before it is running properly due to DNS propagation and synchronization.

1.  Remove the sample application by running the following commands:

    ```bash
    kubectl delete deployment -l app=redis
    kubectl delete service -l app=redis
    kubectl delete deployment frontend
    kubectl delete service frontend
    ```

    <p class="message--warning"><strong>WARNING: </strong>
    This step is <b>required</b> because the sample deployment attaches a <b>cloud provider load balancer</b> to the DKP cluster.
    Therefore, you <b>must delete</b> the sample application before tearing down the cluster.
    </p>

1.  **Optional:** Tear down the cluster. If you want to do this on a [networked AWS environment][aws-env], you can do so by running the commands in the [delete cluster topic][delete-aws].

    This destroys the Kubernetes cluster and the infrastructure it runs on.

## Related Information

- [Example: Deploying PHP Guestbook application with Redis][guestbook]

[guestbook]: https://kubernetes.io/docs/tutorials/stateless-application/guestbook/
[choose-infra]: ../../choose-infrastructure
[aws-env]: ../../choose-infrastructure/aws
[delete-aws]: ../../choose-infrastructure/aws/advanced/delete
