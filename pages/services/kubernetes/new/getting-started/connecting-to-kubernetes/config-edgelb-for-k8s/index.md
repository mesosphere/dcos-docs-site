---
layout: layout.pug
navigationTitle: Configuring Edge-LB
title: Configuring Edge-LB to Connect to Kubernetes
menuWeight: 10
excerpt: Learn to install and configure Edge-LB on top of your DC/OS Enterprise cluster to enable connecting to your Kubernetes clusters
---

# Configuring Edge-LB on DC/OS to connect to your Kubernetes clusters

To connect to your Kubernetes cluster from outside your DC/OS cluster, you will need to setup and configure the Edge-LB service for secure inbound load-balancing to your private Kubernetes clusgerbefore moving to the next part of this [**Getting Started with Kubernetes on DC/OS Enterprise**](services/kubernetes/new/getting-started/).

To setup Edge-LB for DC/OS Kubernetes you will need to:

- [Configure Edge-LB on your cluster]() and [deploy the configured pool]() for Kubernetes including:
    * setting up a service account for Edge-LB
    * installing the [Edge-LB CLI]()
- [Test your connection to your Kubernetes clusters and view the Kubernetes Dashboard]

## Set up and Install Edge-LB with service account

1. First, add the [Edge-LB repositories](LINK TO SUPPORT PORTAL FOR ENT):

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

1. Then, create an options JSON file to install Edge-LB with its service account.

    Create here we create `edge-lb-options.json` and add the following configuration snippet:

    ```json
    {
        "service": {
            "secretName": "dcos-edgelb/edge-lb-secret",
            "principal": "edge-lb-principal",
            "mesosProtocol": "https"
        }
    }
    ```

    Save the file.

1. Lastly, install the `edgelb` package on your DC/OS Enterprise cluster and the latest [Edge-LB CLI]().

    In your terminal, enter:

    ```bash
    dcos package install --options=edge-lb-options.json edgelb --yes
    ```

    Then, enter:

     ```bash
    dcos package install --options=edge-lb-options.json edgelb --yes
    ```

## Create and launch an Edge-LB configured pool deployment for your Kubernetes services

1. Next, save the following Kubernetes/Edge-LB Service configuration as `edgelb.json`:

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

1. Deploy Edge-LB configured pool for your Kubernetes service:

    In your terminal shell, enter:

    ```bash
    dcos edgelb create edgelb.json
    ```

1. List your Edge-LB configured pools:

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

<!-- If the above commands do not work to find the public agent IP of the Edge-LB (maybe due to security reasons, etc.) we can determine the Public Agent IPs that we need by following the [Find Public Agent IP Guide here]() -->

# [Next: Test your Kubernetes connections and view the Kubernetes Dashboard](/services/kubernetes/new/getting-started/connecting-to-kubernetes/test-connect/)

Now you have configured Edge-LB to connect to your Kubernetes clusters. Next, [you can test those connections](/services/kubernetes/new/getting-started/connecting-to-kubernetes/) and then - upon success - view the [Kubernetes Dashboard](/services/kubernetes/new/getting-started/connecting-to-kubernetes/) via a web proxy on your browser, completing this second part of the [**Getting Started with Kubernetes on DC/OS Enterprise**](services/kubernetes/new/getting-started/).
