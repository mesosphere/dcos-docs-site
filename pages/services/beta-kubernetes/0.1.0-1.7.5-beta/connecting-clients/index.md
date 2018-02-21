---
layout: layout.pug
navigationTitle:  Connecting Clients
title: Connecting Clients
menuWeight: 50
excerpt:
featureMaturity:
enterprise: false
---

1. [Install `kubectl`](https://kubernetes.io/docs/tasks/tools/install-kubectl/) on your local machine.

1. Enter the following commands to configure your `kubeconfig` file with the proper details to authenticate with the API server.

   ```
   kubectl config set-cluster dcos-k8s --server=http://localhost:9000
   kubectl config set-context dcos-k8s --cluster=dcos-k8s --namespace=default
   kubectl config use-context dcos-k8s
   ```

1. Access to the API server is done via an SSH tunnel to your DC/OS master.

   Find the public IP address of your master node. Then, create the tunnel.

   ```
   ssh -i <your-private-key> -N -L 9000:apiserver-insecure.kubernetes.l4lb.thisdcos.directory:9000 \
        <ssh-user>@<master-ip>
   ```

# Install add-ons

To install add-ons, clone the [DC/OS Kubernetes Quickstart repository](https://github.com/mesosphere/dcos-kubernetes-quickstart), then run the commands listed here.

## Mandatory add-ons

Presently, only `kube-dns` is a mandatory add-on.

Once you have created the SSH tunnel, run the following commands to install `kube-dns`.

```bash
kubectl create -f add-ons/dns/kubedns-cm.yaml
kubectl create -f add-ons/dns/kubedns-svc.yaml
kubectl create -f add-ons/dns/kubedns-deployment.yaml
```

**NOTE:** The Kubernetes namespace where `kube-dns` will be running is `kube-system`, not `default`.

## Optional add-ons

Install the following add-on to access the Kubernetes Dashboard.

```bash
kubectl create -f add-ons/dashboard/kubernetes-dashboard.yaml
```

If the deployment was successful, point your browser to the url: http://localhost:9000/ui to access the Kubernetes Dashboard.
