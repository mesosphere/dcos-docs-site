---
layout: layout.pug
navigationTitle: Testing Connections
title: Testing Connections and Viewing the Kubernetes Dashboard
menuWeight: 9
excerpt: Learn to test your connection to private Kubernetes clusters and view the Kubernetes dashboard.
enterprise: true
---

In this section, we will test our connections to our Kubernetes clusters one at a time and then lastly connect to the Kubernetes dashboard and view our Kubernetes clusters' information. To test our connections we must ensure that the right ports are open, set our cluster's context with the DC/OS Kubernetes service, get Kubernetes nodes' information, and test with a simple NGINX deployment.

## Check that Port `:6443` and `:6444` are open.

Before attempting to connect `kubectl` to the MKE clusters, you will want to check to ensure that ports `:6443` and `:6444` are accessible by your local machine to the DC/OS Cluster. Closed ports `:6443` and `:6444` will cause `kubectl` commands to just hang. Typically, these settings are handled by your systems administrator. Or, if using a cloud provider such as AWS, these would be rules configured in your **EC2-->Security Groups** tab.

## Test the connection to `kubernetes-cluster1` at port `:6443`

1. <strong>First, configure your</strong> `context`<strong> to</strong> `kubernetes-cluster1` <strong>at port </strong>`:6443`<strong>.</strong>

    In your CLI, enter the following snippet:

    ```bash
    dcos kubernetes cluster kubeconfig \
        --insecure-skip-tls-verify \
        --context-name=kubernetes-cluster1 \
        --cluster-name=kubernetes-cluster1 \
        --apiserver-url=https://${EDGELB_PUBLIC_AGENT_IP}:6443
    ```

    which will configure DC/OS Kubernetes to connect to `kubernetes-cluster1` from the Kubernetes CLI, `kubectl`. The `EDGELB_PUBLIC_AGENT_IP` should still be cached in your terminal environment from the previous section, if not, make sure to insert the proper value.

1. <strong>Next, get your Kubernetes nodes' info for </strong>`kubernetes-cluster1`<strong>.</strong>

    In your CLI, enter:

    ```bash
    kubectl get nodes
    ```
    to receive details regarding your the nodes of `kubernetes-cluster1`.

    <!-- better validation here of this step:OUTPUT ^^ -->
    If you do not get an almost immediate response, check your firewall settings and ensure that you can communicate with your public agent node.


1. <strong>Then, create a NGINX deployment on </strong>`kubernetes-cluster1`<strong>.</strong>

    Enter the following in your CLI:

    ```bash
    kubectl apply -f https://k8s.io/examples/application/deployment.yaml
    ```

    to launch the deployment.

1. <strong>View the NGINX deployment just launched.</strong>

    In your CLI, run:

    ```bash
    kubectl get deployments
    ```

    The resulting output should look similar to the following:

    ```bash
    $ kubectl get deployments
    NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    nginx-deployment   2         2         2            2           23s
    ```

1. <strong>Lastly, delete the NGINX deployment to finish up this connection test for</strong> `kubernetes-cluster1`<strong>.</strong>

    Run the following command in your CLI:

    ```bash
    kubectl delete deployment nginx-deployment
    ```

    and the deployment will be deleted.

## Test the connection to `kubernetes-cluster2` at port `:6444`

Now you will do the same to test `kubernetes`

1. <strong>Connect the second Kubernetes cluster to the `kubeconfig` in order to send</strong> `kubectl` <strong>commands to it.</strong>

    In your CLI, paste in the following, again, your `EDGELB_PUBLIC_AGENT_IP` should still be cached in your terminal environment from the previous section:

    ```bash
    dcos kubernetes cluster kubeconfig \
        --insecure-skip-tls-verify \
        --context-name=kubernetes-cluster2 \
        --cluster-name=kubernetes-cluster2 \
        --apiserver-url=https://${EDGELB_PUBLIC_AGENT_IP}:6444
    ```

    Your `kubectl` commands should now connect to `kubernetes-cluster2`.

    Once the 2 contexts are configured, they will be saved in ~/.kube/config. To switch, you can either set the context generally:

    ```bash
    kubectl config use-context kubernetes-cluster2
    ```

    Or use the flag `--context kubernetes-cluster1` in commands like so:

    ```bash
    kubectl get nodes --context kubernetes-cluster1
    ```

1. <strong>As before for </strong>`kubernetes-cluster1`<strong>, get the nodes' information for </strong>`kubernetes-cluster2`<strong>.</strong>

    In your CLI, enter:

    ```bash
    kubectl get nodes
    ```

    and note that the output should show that you are now using `kubernetes-cluster2`, similar to the following:

    ```bash
    $ kubectl get nodes
    NAME                                                      STATUS   ROLES    AGE    VERSION
    kube-control-plane-0-instance.kubernetes-cluster2.mesos   Ready    master   145m   v1.12.4
    kube-node-0-kubelet.kubernetes-cluster2.mesos             Ready    <none>   142m   v1.12.4
    ```

1. <strong>Next, create a NGINX deployment on</strong> `kubernetes-cluster1`<strong>:</strong>

    Enter the following in your CLI:

    ```bash
    kubectl apply -f https://k8s.io/examples/application/deployment.yaml
    ```

    and the deployment will begin.

1. <strong>View that NGINX deployment in action:</strong>

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

1. <strong>Finally, delete your test deployment.</strong>

    Simply enter:

    ```bash
    kubectl delete deployment nginx-deployment
    ```

    and the deployment will be shut down.

## Access the Kubernetes Dashboard from your browser

In one simple but satisfying validation of our connection into our Kubernetes cluster manager from outside the cluster, we will access the Kubernetes Dashboard and view our cluster currently in context.

1. <strong> Access the Kubernetes dashboard.</strong>

    In your CLI, enter:

    ```bash
    kubectl proxy
    ```

    which should start the proxy server.

    <!-- better validation here of this step:OUTPUT ^^ -->

1. <strong>Then, navigate to:</strong>  [http://127.0.0.1:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/](http://127.0.0.1:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/) and you should see your Kubernetes dashboard and information.

When the Kubernetes login screen is shown, you should choose the **Kubeconfig** option, click the **Choose kubeconfig file** text box and pick the location of your kubeconfig file (typically, `$HOME/.kube/config`).

**Note:** When accessed, and depending on whether you are running DC/OS or DC/OS EE (as well as on your browser's configuration) you may be presented a warning indicating that the TLS certificate being used by the Kubernetes Dashboard is not trusted. It is generally safe to permanently trust this TLS certificate by adding an exception in your browser, or to skip past it. To learn more about TLS certificates, visit the [Kubernetes Dashboard](/services/kubernetes/2.1.1-1.12.4/operations/kubernetes-dashboard/) section.

    <!-- better validation here of this step:Screenshot ^^ -->

## Mission Complete!

Well done! You have successfully completed the [Getting Started Guide for Kubernetes](/services/kubernetes/2.1.1-1.12.4/getting-started/). You have set up your DC/OS Enterprise cluster to be able to run Kubernetes as a service on DC/OS.

For more information regarding operating Kubernetes as a service on DC/OS, check out the [Operations](/services/kubernetes/2.1.1-1.12.4/operations/) section.
