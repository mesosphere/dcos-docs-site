---
layout: layout.pug
navigationTitle: Connecting to Kubernetes
title: Connecting to Kubernetes clusters
menuWeight: 10
excerpt: Learn to connect to private Kubernetes clusters and the Kubernetes dashboard via web proxy
---

Now that we have setup and configured our cluster with a pair of Kubernetes clusters on our DC/OS Enterprise cluster, in this next part of [**Getting Started with Kubernetes on DC/OS Enterprise**](services/kubernetes/new/getting-started/) you will configure your DC/OS Enterprise cluster's network so you can:

- communicate with our Kubernetes clusters using the Kubernetes CLI - `kubectl`
- view your Kubernetes dashboard via web proxy

all from outside the DC/OS cluster's secured perimeter.

# Connecting to the Kubernetes clusters using Edge-LB

To connect to your Kubernetes cluster from outside your DC/OS cluster, you will need to setup and configure the Edge-LB service for secure inbound load-balancing. To setup Edge-LB for DC/OS Kubernetes you will need to:
    - [configure Edge-LB on your cluster]() including setting up a service account and installing the [Edge-LB CLI]()
    - [deploy the configured pool]() for Kubernetes

## Setting up and Installing Edge-LB with a service account

1. First, add the [Edge-LB repositories](SUPPORT PORTAL FOR ENT):

    ```bash
    dcos package repo add --index=0 edgelb https://<insert download link>/stub-universe-edgelb.json
    dcos package repo add --index=0 edgelb-pool https://<insert download link>/stub-universe-edgelb-pool.json
    ```

1. Next, create an Edge-LB service account:

    ```bash
    dcos security org service-accounts keypair edge-lb-private-key.pem edge-lb-public-key.pem
    dcos security org service-accounts create -p edge-lb-public-key.pem -d "Edge-LB service account" edge-lb-principal
    dcos security org service-accounts show edge-lb-principal
    dcos security secrets create-sa-secret --strict edge-lb-private-key.pem edge-lb-principal dcos-edgelb/edge-lb-secret
    dcos security org groups add_user superusers edge-lb-principal
    ```

1. Then, create an options JSON file to ass install the package, here we use create `edge-lb-options.json` and add the following configuration snippet:

    ```json
    {
        "service": {
            "secretName": "dcos-edgelb/edge-lb-secret",
            "principal": "edge-lb-principal",
            "mesosProtocol": "https"
        }
    }
    ```

1. Next, install the `edgelb` package on your DC/OS Enterprise cluster:

    ```bash
    dcos package install --options=edge-lb-options.json edgelb --yes
    ```

1. Lastly, install the Edge-LB

## Create and Launch an Edge-LB configured pool deployment for your Kubernetes services

1., save the following Kubernetes/Edge-LB Service configuration as `edgelb.json`:

    ```json
    {
        "apiVersion": "V2",
        "name": "edgelb-kubernetes-cluster-proxy-basic",
        "count": 1,
        "autoCertificate": true,
        "haproxy": {
            "frontends": [{
                    "bindPort": 6443,
                    "protocol": "HTTPS",
                    "certificates": [
                        "$AUTOCERT"
                    ],
                    "linkBackend": {
                        "defaultBackend": "kubernetes-cluster1"
                    }
                },
                {
                    "bindPort": 6444,
                    "protocol": "HTTPS",
                    "certificates": [
                        "$AUTOCERT"
                    ],
                    "linkBackend": {
                        "defaultBackend": "kubernetes-cluster2"
                    }
                }
            ],
            "backends": [{
                    "name": "kubernetes-cluster1",
                    "protocol": "HTTPS",
                    "services": [{
                        "mesos": {
                            "frameworkName": "kubernetes-cluster1",
                            "taskNamePattern": "kube-control-plane"
                        },
                        "endpoint": {
                            "portName": "apiserver"
                        }
                    }]
                },
                {
                    "name": "kubernetes-cluster2",
                    "protocol": "HTTPS",
                    "services": [{
                        "mesos": {
                            "frameworkName": "kubernetes-cluster2",
                            "taskNamePattern": "kube-control-plane"
                        },
                        "endpoint": {
                            "portName": "apiserver"

                        }
                    }]
                }
            ],
            "stats": {
                "bindPort": 6090
            }
        }
    }
    ```

1. Deploy Edge-LB configured pool for Kubernetes:

    In your shell, enter:

    ```bash
    dcos edgelb create edgelb.json
    ```

1. List your edgelb configured pools:

    ```bash
    dcos edgelb list
    ```

    and confirm your output looks similar to the following:

    ```bash
    $ dcos edgelb list
    NAME                                   APIVERSION  COUNT  ROLE          PORTS
    edgelb-kubernetes-cluster-proxy-basic  V2          1      slave_public  6090, 6443, 6444
    ```

1. Check that the status of your Edge-LB deployment is in `TASK_RUNNING` state (under `STATE`):

    ```bash
    dcos edgelb status edgelb-kubernetes-cluster-proxy-basic
    ```

    The responding output should look like the following:

    ```bash
    $ dcos edgelb status edgelb-kubernetes-cluster-proxy-basic
    NAME                  TASK ID                                                     STATE
    edgelb-pool-0-server  edgelb-pool-0-server__a6e4b1a1-e63c-4579-a27e-a54328f31321  TASK_RUNNING
    ```

1. Find the public IP of the deployment:

    ```bash
    dcos task exec -it edgelb-pool-0-server curl ifconfig.co
    ```

1. Save the IP as a variable:

    ```bash
    EDGELB_PUBLIC_AGENT_IP=<output_of_above>
    ```

<!-- If the above commands do not work (maybe due to security reasons, etc.) we can determine the Public Agent IPs that we need by following the Find Public Agent IP Guide Here -->

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

    In your shell, paste in the following and press enter:

    ```bash
    dcos kubernetes cluster kubeconfig \
        --insecure-skip-tls-verify \
        --context-name=kubernetes-cluster2 \
        --cluster-name=kubernetes-cluster2 \
        --apiserver-url=https://${EDGELB_PUBLIC_AGENT_IP}:6444
    ```

    Your `kubectl` commands should now connect to `kubernetes-cluster2`.

1. Then, get the nodes' information for `kubernetes-cluster2`.

    Enter:

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

1. Next, create a NGINX deployment.

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

    ```
    kubectl delete deployment nginx-deployment
    ```

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


# Next: Autoscaling, Self-healing, High Density Kubernetes Clusters

Well done. You have successfully complete the second part of the tutorial [**Getting Started with Kubernetes on DC/OS Enterprise**](services/kubernetes/new/getting-started/).

Now that your cluster is set up to play around with, we can [try out some features that make running Kubernetes on DC/OS stand out]() in the final part of the tutorial.
