---
layout: layout.pug
navigationTitle: Configuring Edge-LB
title: Configuring Edge-LB to Connect to Kubernetes
menuWeight: 7
excerpt: Learn to connect to Kubernetes of top of your DC/OS Enterprise cluster using DC/OS' Edge-LB load balancer.
enterprise: true
---

To connect to your Kubernetes cluster from outside your DC/OS cluster, you will now need to set up and configure the Edge-LB service for inbound load-balancing to your private Kubernetes cluster.

To set up Edge-LB for DC/OS Kubernetes you will need to:

- Configure Edge-LB on your cluster and deploy the configured pool for Kubernetes including:
    * setting up a service account for Edge-LB
    * installing Edge-LB, including the CLI plugin

## Set up and Install Edge-LB with service account

1. <strong>First, add the Edge-LB repositories, replacing the download links with the [latest available binaries](https://support.mesosphere.com/s/downloads), this example links to DC/OS Edge-LB 1.2.3:</strong>

    ```bash
    dcos package repo add --index=0 edgelb https://<insert download link>/stub-universe-edgelb.json
    dcos package repo add --index=0 edgelb-pool https://<insert download link>/stub-universe-edgelb-pool.json
    ```

    <p class="message--important"><strong>IMPORTANT: </strong>If you wish to download the repositories from the support site using your browser, you will need to be logged in with an enterprise customer service account.</p>

1. <strong>Next, create an Edge-LB service account:</strong>

    ```bash
    dcos security org service-accounts keypair edge-lb-private-key.pem edge-lb-public-key.pem
    dcos security org service-accounts create -p edge-lb-public-key.pem -d "Edge-LB service account" edge-lb-principal
    dcos security org service-accounts show edge-lb-principal
    dcos security secrets create-sa-secret --strict edge-lb-private-key.pem edge-lb-principal dcos-edgelb/edge-lb-secret
    dcos security org groups add_user superusers edge-lb-principal
    ```

1. <strong>Then, create an options JSON file to install Edge-LB with its service account.</strong>

    Here we create `edge-lb-options.json` and add the following configuration snippet:

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

1. <strong>Lastly, install the</strong> `edgelb`<strong> package on your DC/OS Enterprise cluster</strong>.

    In your CLI, enter:

    ```bash
    dcos package install --options=edge-lb-options.json edgelb --yes
    ```

## Create and launch an Edge-LB configured pool deployment for your Kubernetes services

1. <strong>Next, save the following Kubernetes/Edge-LB Service configuration as </strong>`edgelb.json`<strong>.</strong>

    Copy for your convenience:

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
    and paste in the file using your text editor.

1. <strong>Next, deploy the Edge-LB configured pool for your Kubernetes service:</strong>

    In your CLI, enter:

    ```bash
    dcos edgelb create edgelb.json
    ```

1. <strong>List your Edge-LB configured pools.</strong>

    ```bash
    dcos edgelb list
    ```

    and confirm your output looks similar to the following:

    ```bash
    $ dcos edgelb list
    NAME                                   APIVERSION  COUNT  ROLE          PORTS
    edgelb-kubernetes-cluster-proxy-basic  V2          1      slave_public  6090, 6443, 6444
    ```

1. <strong>Check that the status of your Edge-LB deployment is in</strong> `TASK_RUNNING`<strong> state (under</strong> `STATE`<strong>):</strong>

    ```bash
    dcos edgelb status edgelb-kubernetes-cluster-proxy-basic
    ```

    The responding output should look like the following:

    ```bash
    $ dcos edgelb status edgelb-kubernetes-cluster-proxy-basic
    NAME                  TASK ID                                                     STATE
    edgelb-pool-0-server  edgelb-pool-0-server__a6e4b1a1-e63c-4579-a27e-a54328f31321  TASK_RUNNING
    ```

1. <strong>Find the public IP of the deployment:</strong>

    ```bash
    dcos task exec -it edgelb-pool-0-server curl ifconfig.co
    ```

1. <strong>Save the IP as a variable:</strong>

    ```bash
    export EDGELB_PUBLIC_AGENT_IP=<output_of_above>
    ```

<!-- If the above commands do not work to find the public agent IP of the Edge-LB (maybe due to security reasons, etc.) we can determine the Public Agent IPs that we need by following the [Find Public Agent IP Guide here]() -->

## Next Step: Test Kubernetes connections and view the Kubernetes dashboard

Now you have configured Edge-LB to connect to your Kubernetes clusters. In the last section, you will [test connections and view the Kubernetes Dashboard](/services/kubernetes/2.1.1-1.12.4/getting-started/test-connect/) via a web proxy on your browser.
