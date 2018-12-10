---
layout: layout.pug
navigationTitle: Connecting to Kubernetes
title: Connecting to Kubernetes clusters
menuWeight: 10
excerpt: Learn to connect to private Kubernetes clusters and the Kubernetes dashboard via web proxy
---

Connecting to the Kubernetes API
Option #1 - Using Edge-LB
Add the Edge-LB Repository (Get links from the DC/OS Support Page):

dcos package repo add --index=0 edgelb  https://<insert download link>/stub-universe-edgelb.json
dcos package repo add --index=0 edgelb-pool https://<insert download link>/stub-universe-edgelb-pool.json
Create Edge-LB Service Account:

dcos security org service-accounts keypair edge-lb-private-key.pem edge-lb-public-key.pem
dcos security org service-accounts create -p edge-lb-public-key.pem -d "Edge-LB service account" edge-lb-principal
dcos security org service-accounts show edge-lb-principal
dcos security secrets create-sa-secret --strict edge-lb-private-key.pem edge-lb-principal dcos-edgelb/edge-lb-secret
dcos security org groups add_user superusers edge-lb-principal
Create edge-lb-options.json:

{
    "service": {
        "secretName": "dcos-edgelb/edge-lb-secret",
        "principal": "edge-lb-principal",
        "mesosProtocol": "https"
    }
}
Install Edge-LB and the Edge-LB CLI:

dcos package install --options=edge-lb-options.json edgelb --yes
Save Kubernetes Edge-LB Service Config as edgelb.json:

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
To Deploy:

dcos edgelb create edgelb.json
Find the edgelb-pool Public Agent IP
List your edgelb configured pools:

dcos edgelb list
Output should looks similar to below:

$ dcos edgelb list
  NAME                                   APIVERSION  COUNT  ROLE          PORTS
  edgelb-kubernetes-cluster-proxy-basic  V2          1      slave_public  6090, 6443, 6444
Make sure that the status of your edgelb deployment is in TASK_RUNNING state:

dcos edgelb status edgelb-kubernetes-cluster-proxy-basic
Output should look like below:

$ dcos edgelb status edgelb-kubernetes-cluster-proxy-basic
  NAME                  TASK ID                                                     STATE
  edgelb-pool-0-server  edgelb-pool-0-server__a6e4b1a1-e63c-4579-a27e-a54328f31321  TASK_RUNNING
To find the public IP:

dcos task exec -it edgelb-pool-0-server curl ifconfig.co
Save the IP as a variable:

EDGELB_PUBLIC_AGENT_IP=<output_of_above>
Finding Public IP if the above doesnt work
If the above commands do not work (maybe due to security reasons, etc.) we can determine the Public Agent IPs that we need by following the Find Public Agent IP Guide Here

Make Sure Port :6443 and :6444 are open
Before attempting to connect kubectl to the MKE clusters, make sure that port :6443 and :6444 are accessible by your local machine to the DC/OS Cluster. If using a cloud provider such as AWS, these would typically be rules configured in your EC2 --> Security Groups tab

Failure to open up port :6443 and :6444 will cause kubectl commands to hang

Connect to Kubernetes Cluster #1 at port :6443
dcos kubernetes cluster kubeconfig \
    --insecure-skip-tls-verify \
    --context-name=kubernetes-cluster1 \
    --cluster-name=kubernetes-cluster1 \
    --apiserver-url=https://${EDGELB_PUBLIC_AGENT_IP}:6443
Quick Test for Kubernetes Cluster #1
kubectl get nodes
Create a NGINX deployment:

kubectl apply -f https://k8s.io/examples/application/deployment.yaml
View NGINX deployment:

kubectl get deployments
Output should look similar to below:

$ kubectl get deployments
NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   2         2         2            2           23s
Delete NGINX deployment:

kubectl delete deployment nginx-deployment
Connect to Kubernetes Cluster #2 at port :6444:
dcos kubernetes cluster kubeconfig \
    --insecure-skip-tls-verify \
    --context-name=kubernetes-cluster2 \
    --cluster-name=kubernetes-cluster2 \
    --apiserver-url=https://${EDGELB_PUBLIC_AGENT_IP}:6444
Quick Test for Kubernetes Cluster #2:
kubectl get nodes
Note that the output should show that you are now using kubernetes-cluster2:

$ kubectl get nodes
NAME                                                      STATUS   ROLES    AGE    VERSION
kube-control-plane-0-instance.kubernetes-cluster2.mesos   Ready    master   145m   v1.12.1
kube-node-0-kubelet.kubernetes-cluster2.mesos             Ready    <none>   142m   v1.12.1
Create a NGINX deployment:

kubectl apply -f https://k8s.io/examples/application/deployment.yaml
View NGINX deployment:

kubectl get deployments
Output should look similar to below:

$ kubectl get deployments
NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   2         2         2            2           23s
Delete NGINX deployment:

kubectl delete deployment nginx-deployment
Option #2 - Using Marathon-LB
If trying to connect to the Kubernetes API through Marathon-LB instead of Edge-LB, Click here for the guide on how to use Marathon-LB

Accessing the Dashboard
Once kubectl is configured correctly, access the dashboard using:

kubectl proxy
Point your browser at the following URL:

http://127.0.0.1:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/
