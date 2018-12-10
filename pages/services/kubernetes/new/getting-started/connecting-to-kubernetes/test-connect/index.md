---
layout: layout.pug
navigationTitle: Testing Connections
title: Testing your connections to Kubernetes clusters and viewing the Kuberneters Dashboard
menuWeight: 10
excerpt: Learn to test your connection to private Kubernetes clusters and view the Kubernetes dashboard via public web proxy
---

# Testing your connections to your Kubernetes clusters and viewing the Kubernetes Dashboard

Presumably, you have now [configured Edge-LB to connect to Kubernetes]() in the previous step of this [**Getting Started with Kubernetes on DC/OS Enterprise**](services/kubernetes/new/getting-started/).

In this section, we will test our connections to our Kubernetes clusters one at a time and then finally connect to the Kubernetes Dashboard.

## Connect to `kubernetes-cluster1` and `kubernetes-cluster2` via NGINX web proxy

### Check that Port `:6443` and `:6444` are open.

Before attempting to connect `kubectl` to the MKE clusters, you will want to check to ensure that ports `:6443` and `:6444` are accessible by your local machine to the DC/OS Cluster. Closed ports `:6443` and `:6444` will cause `kubectl` commands to just hang. Moreover, if using a cloud provider such as AWS, these would typically be rules configured in your **EC2-->Security Groups** tab.

### Test the connection to `kubernetes-cluster1` at port `:6443`

1. First, configure your `context` to `kubernetes-cluster1` at port `:6443`.

    In your shell, enter the following snippet:

    ```bash
    dcos kubernetes cluster kubeconfig \
        --insecure-skip-tls-verify \
        --context-name=kubernetes-cluster1 \
        --cluster-name=kubernetes-cluster1 \
        --apiserver-url=https://${EDGELB_PUBLIC_AGENT_IP}:6443
    ```

    which will configure DC/OS Kubernetes to connect to `kubernetes-cluster1` from the Kubernetes CLI, `kubectl`.

1. Next, get your Kubernetes nodes' info for `kubernetes-cluster1`:

    ```bash
    kubectl get nodes
    ```

1. Then, create a NGINX deployment on `kubernetes-cluster1`:

    ```bash
    kubectl apply -f https://k8s.io/examples/application/deployment.yaml
    ```

1. View the NGINX deployment just launched:

    ```bash
    kubectl get deployments
    ```

    The resulting output should look similar to the following:

    ```bash
    $ kubectl get deployments
    NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    nginx-deployment   2         2         2            2           23s
    ```

1. Lastly, delete the NGINX deployment to finish up this connection test for `kubernetes-cluster1`.

    In the shell, enter:

    ```bash
    kubectl delete deployment nginx-deployment
    ```

    and the deployment will be deleted.

### Test the connection to `kubernetes-cluster2` at port `:6444`

1. Switch contexts for inbound `kubectl` commands to your second Kubernetes cluster `kubernetes-cluster2`.

    In your shell, paste in the following and press run the command:

    ```bash
    dcos kubernetes cluster kubeconfig \
        --insecure-skip-tls-verify \
        --context-name=kubernetes-cluster2 \
        --cluster-name=kubernetes-cluster2 \
        --apiserver-url=https://${EDGELB_PUBLIC_AGENT_IP}:6444
    ```

    Your `kubectl` commands should now connect to `kubernetes-cluster2`.

1. Then, get the nodes' information for `kubernetes-cluster2`.

    In your terminal, enter:

    ```bash
    kubectl get nodes
    ```

    and note that the output should show that you are now using `kubernetes-cluster2`, similar to the following:

    ```bash
    $ kubectl get nodes
    NAME                                                      STATUS   ROLES    AGE    VERSION
    kube-control-plane-0-instance.kubernetes-cluster2.mesos   Ready    master   145m   v1.12.1
    kube-node-0-kubelet.kubernetes-cluster2.mesos             Ready    <none>   142m   v1.12.1
    ```

1. Next, create a NGINX deployment on `kubernetes-cluster1`:

    Enter:

    ```bash
    kubectl apply -f https://k8s.io/examples/application/deployment.yaml
    ```

    and the deployment will begin.

1. View that NGINX deployment in action:

    ```bash
    kubectl get deployments
    ```

    The resulting output should look similar to below:

    ```bash
    $ kubectl get deployments
    NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    nginx-deployment   2         2         2            2           23s
    Delete NGINX deployment:
    ```

1. Finally, delete your test deployment.

    Simply enter:

    ```bash
    kubectl delete deployment nginx-deployment
    ```

    and the deployment will be shutdown.

## Access the Kubernetes Dashboard from your brower

In one simple but satisfying validation of our connection into our Kubernetes cluster manager from outside the cluster, we will access the Kubernetes Dashboard and view our clusters.

1. Access the Kubernetes dashboard.

    In your shell, enter:

    ```bash
    kubectl proxy
    ```

    which should start the proxy server.

    <!-- better validation here of this step:OUTPUT ^^ -->

1. Then, simply point your browser at the following URL:

    http://127.0.0.1:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/

    and you should see your Kubernetes dashboard and both clusters' information.

    <!-- better validation here of this step:Screenshot ^^ -->

# [Next: Autoscaling, Self-healing, and High Density Kubernetes Clusters](services/kubernetes/new/getting-started/autoscaleHD-selfheal/)

Well done. You have successfully complete the second part of [**Getting Started with Kubernetes on DC/OS Enterprise**](/services/kubernetes/new/getting-started/).

Now that your cluster is set up to play around with, we can [try out some features that make running Kubernetes on DC/OS stand out](services/kubernetes/new/getting-started/autoscaleHD-selfheal/) in the next and final part of the tutorial.
