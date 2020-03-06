---
layout: layout.pug
navigationTitle: Connecting to Kubernetes using Edge-LB
title: Connecting to Kubernetes using Edge-LB
menuWeight: -1
excerpt: How to connect to Kubernetes from a DC/OS Enterprise cluster using Edge-LB load balancer
enterprise: true
---

**%%% This topic was hidden from view using a negative menuWeight value - is it correct and should we display it?**

This tutorial demonstrates how to connect to a Kubernetes&reg; cluster using the Edge-LB service for inbound load-balancing. In this tutorial, you will configure one Edge-LB pool to handle load-balancing for requests to access Kubernetes.

For more information about setting up and working with Kubernetes clusters, see [Kubernetes](/mesosphere/dcos/services/kubernetes/git).  ***%%%...to which K8s git repo should this link resolve?***

# Before you begin
You can use Edge-LB to provide inbound load balancing when you connect to a private Kubernetes cluster from outside of a DC/OS&reg; cluster.

To prepare Edge-LB to work with DC/OS and Kubernetes:

- Download and install the required components for the DC/OS Enterprise cluster.
- Download, configure, and install the Kubernetes cluster.
- Download the Edge-LB package.
- Create, configure, and deploy at least one Edge-LB pool for Kubernetes with a service account for secure routing of inbound traffic to the appropriate application backend.

# Set up the Edge-LB service account

1. Download the current Edge-LB repository files using the [latest available binaries](https://support.d2iq.com/s/downloads).

    For example, you can download the repositories from the support site using your browser if you log in to the [D2iQ&reg; Support portal](http://support.d2iq.com) with an enterprise customer service account.
    
    Alternatively, you can run commands similar to the following to download DC/OS Edge-LB packages:

    ```bash
    dcos package repo add --index=0 edgelb https://<insert download link>/stub-universe-edgelb.json
    dcos package repo add --index=0 edgelb-pool https://<insert download link>/stub-universe-edgelb-pool.json
    ```

1. Create an Edge-LB service account with a public/private key pair using these DC/OS enterprise CLI shell commands to create the service account and certificate credentials:

    ```bash
    dcos security org service-accounts keypair edge-lb-private-key.pem edge-lb-public-key.pem
    dcos security org service-accounts create -p edge-lb-public-key.pem -d "Edge-LB service account" edge-lb-principal
    dcos security org service-accounts show edge-lb-principal
    dcos security secrets create-sa-secret --strict edge-lb-private-key.pem edge-lb-principal dcos-edgelb/edge-lb-secret
    dcos security org groups add_user superusers edge-lb-principal
    ```

1. Create a customized configuration JSON file to install Edge-LB with its service account by creating a text file named `edge-lb-options.json` and add the following configuration settings to it:

    ```json
    {
        "service": {
            "secretName": "dcos-edgelb/edge-lb-secret",
            "principal": "edge-lb-principal",
            "mesosProtocol": "https"
        }
    }
    ```

1. Save the customized configuration file.

1. Install the `edgelb` package on the DC/OS Enterprise cluster:

    ```bash
    dcos package install --options=edge-lb-options.json edgelb --yes
    ```

# Create and launch the Edge-LB pool for Kubernetes

1. Copy and save the following Kubernetes and Edge-LB service configuration settings in a file named <strong>`edgelb.json`</strong>.

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

1. Deploy the Edge-LB pool for your Kubernetes service:

    ```bash
    dcos edgelb create edgelb.json
    ```

1. Verify the Edge-LB pool is properly configured using the `list` subcommand:

    ```bash
    dcos edgelb list
    ```
    
1. Review the command results and confirm that your output looks similar to the following:

    ```bash
    $ dcos edgelb list
    NAME                                   APIVERSION  COUNT  ROLE          PORTS
    edgelb-kubernetes-cluster-proxy-basic  V2          1      slave_public  6090, 6443, 6444
    ```

1. Check that the status of your Edge-LB deployment is in <strong>`TASK_RUNNING`</strong> state (under <strong>`STATE`</strong>):

    ```bash
    dcos edgelb status edgelb-kubernetes-cluster-proxy-basic
    ```

    The command output should look similar to the following:

    ```bash
    $ dcos edgelb status edgelb-kubernetes-cluster-proxy-basic
    NAME                  TASK ID                                                     STATE
    edgelb-pool-0-server  edgelb-pool-0-server__a6e4b1a1-e63c-4579-a27e-a54328f31321  TASK_RUNNING
    ```

1. Find the public IP address for the Edge-LB deployment:

    ```bash
    dcos task exec -it edgelb-pool-0-server curl ifconfig.co
    ```

1. Save the IP address as a variable:

    ```bash
    export EDGELB_PUBLIC_AGENT_IP=<output_of_above>
    ```

# Test Kubernetes connections and view the dashboard

After you have configured Edge-LB to connect to your Kubernetes clusters, you can [test connections and view the Kubernetes Dashboard](/mesosphere/dcos/services/kubernetes/2.4.5-1.15.5/getting-started/test-connect/) using a web proxy on your browser.
