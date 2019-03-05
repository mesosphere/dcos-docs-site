---
layout: layout.pug
navigationTitle: Testing Connections
title: Testing Connections and Viewing the Kubernetes Dashboard
menuWeight: 9
excerpt: Learn to test your connection to private Kubernetes clusters and view the Kubernetes dashboard.
enterprise: true
---

In this section, we will 
1. Test our connections to our Kubernetes clusters one at a time 
1. Connect to the Kubernetes dashboard and view our Kubernetes clusters' information. 

To test our connections we must 
1. Ensure that the right ports are open, 
1. Set our cluster's context with the DC/OS Kubernetes service, get Kubernetes nodes' information, and 
1. Test with a simple NGINX deployment.

## Check that ports are open

Before attempting to connect `kubectl` to the MKE clusters, you will want to check that ports `:6443` and `:6444` are accessible by your local machine to the DC/OS Cluster. If ports `:6443` and `:6444` are closed, this will cause `kubectl` commands to hang. Typically, these settings are handled by your systems administrator. Or, if using a cloud provider such as AWS, these would be rules configured in your **EC2-->Security Groups** tab.

## Test port connections 

1. Configure your `context` to `kubernetes-cluster1` at port </strong>`:6443`. In your CLI, enter the following snippet:

    ```bash
    dcos kubernetes cluster kubeconfig \
        --insecure-skip-tls-verify \
        --context-name=kubernetes-cluster1 \
        --cluster-name=kubernetes-cluster1 \
        --apiserver-url=https://${EDGELB_PUBLIC_AGENT_IP}:6443
    ```

    This will configure DC/OS Kubernetes to connect to `kubernetes-cluster1` from the Kubernetes CLI, `kubectl`. The `EDGELB_PUBLIC_AGENT_IP` should still be cached in your terminal environment from the previous section, if not, make sure to insert the proper value.

1. Get your Kubernetes nodes' info for `kubernetes-cluster1`. From your CLI, enter:

    ```bash
    kubectl get nodes
    ```
    to receive details regarding your the nodes of `kubernetes-cluster1`.

    <!-- better validation here of this step:OUTPUT ^^ -->
    If you do not get an almost immediate response, check your firewall settings and ensure that you can communicate with your public agent node.


1. Create an NGINX deployment on `kubernetes-cluster1`. To launch the deployment, enter the following in your CLI:

    ```bash
    kubectl apply -f https://k8s.io/examples/application/deployment.yaml
    ```

1. View the NGINX deployment just launched. From the CLI, run:

    ```bash
    kubectl get deployments
    ```

    The resulting output should look similar to the following:

    ```bash
    $ kubectl get deployments
    NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    nginx-deployment   2         2         2            2           23s
    ```

1. Delete the NGINX deployment to finish up this connection test for `kubernetes-cluster1`. Run the following command from your CLI:

    ```bash
    kubectl delete deployment nginx-deployment
    ```

    The deployment will be deleted.

## Test connection to `kubernetes`

Now you will do the same to test `kubernetes`.

1. Connect the second Kubernetes cluster to the `kubeconfig` in order to send `kubectl` commands to it. From the CLI, paste in the following; again, your `EDGELB_PUBLIC_AGENT_IP` should still be cached in your terminal environment from the previous section:

    ```bash
    dcos kubernetes cluster kubeconfig \
        --insecure-skip-tls-verify \
        --context-name=kubernetes-cluster2 \
        --cluster-name=kubernetes-cluster2 \
        --apiserver-url=https://${EDGELB_PUBLIC_AGENT_IP}:6444
    ```

    Your `kubectl` commands should now connect to `kubernetes-cluster2`. Once the 2 contexts are configured, they will be saved in `~/.kube/config`. To switch, you can either set the context generally:

    ```bash
    kubectl config use-context kubernetes-cluster2
    ```

    or use the flag `--context kubernetes-cluster1` in commands like this:

    ```bash
    kubectl get nodes --context kubernetes-cluster1
    ```

1. As before for `kubernetes-cluster1`, get the nodes' information for `kubernetes-cluster2`.  From the CLI, enter:

    ```bash
    kubectl get nodes
    ```

    Note that the output should show that you are now using `kubernetes-cluster2`, similar to the following:

    ```bash
    $ kubectl get nodes
    NAME                                                      STATUS   ROLES    AGE    VERSION
    kube-control-plane-0-instance.kubernetes-cluster2.mesos   Ready    master   145m   v1.13.3
    kube-node-0-kubelet.kubernetes-cluster2.mesos             Ready    <none>   142m   v1.13.3
    ```

1. Create a NGINX deployment on `kubernetes-cluster1`. Enter the following from the CLI:

    ```bash
    kubectl apply -f https://k8s.io/examples/application/deployment.yaml
    ```

    The deployment will begin.

1. View the NGINX deployment in action:

    ```bash
    kubectl get deployments
    ```

    The resulting output should look similar to this:

    ```bash
    $ kubectl get deployments
    NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    nginx-deployment   2         2         2            2           23s
    Delete NGINX deployment:
    ```

1. Delete your test deployment:

    ```bash
    kubectl delete deployment nginx-deployment
    ```

    The deployment will be shut down.

## Access the Kubernetes Dashboard

In one simple validation of our connection into our Kubernetes cluster manager from outside the cluster, we will access the Kubernetes Dashboard and view our cluster currently in context.

1. Access the Kubernetes dashboard. From the CLI, enter:

    ```bash
    kubectl proxy
    ```

    This will start the proxy server.

    <!-- better validation here of this step:OUTPUT ^^ -->

1. Navigate to: [http://127.0.0.1:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/](http://127.0.0.1:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/) and you should see your Kubernetes dashboard and information.

When the Kubernetes login screen is shown, you should choose the **Kubeconfig** option, click the **Choose kubeconfig file** text box and pick the location of your kubeconfig file (typically, `$HOME/.kube/config`).

<p class="message--note"><strong>NOTE: </strong> When accessed, and depending on whether you are running DC/OS or DC/OS EE (as well as on your browser's configuration) you may be presented a warning indicating that the TLS certificate being used by the Kubernetes Dashboard is not trusted. It is generally safe to permanently trust this TLS certificate by adding an exception in your browser, or to skip past it. To learn more about TLS certificates, visit the [Kubernetes Dashboard](/services/kubernetes/2.2.0-1.13.3/operations/kubernetes-dashboard/) section.</p>

<!-- better validation here of this step:Screenshot ^^ -->

**Mission Complete!**

Well done! You have successfully completed the [Getting Started Guide for Kubernetes](/services/kubernetes/2.2.0-1.13.3/getting-started/). You have set up your DC/OS Enterprise cluster to be able to run Kubernetes as a service on DC/OS.

For more information regarding operating Kubernetes as a service on DC/OS, check out the [Operations](/services/kubernetes/2.2.0-1.13.3/operations/) section.
