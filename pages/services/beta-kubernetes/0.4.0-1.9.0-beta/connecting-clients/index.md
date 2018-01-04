---
post_title: Connecting Clients
nav_title: Connecting Clients
menu_order: 50
post_excerpt: ""
feature_maturity: ""
enterprise: 'no'
---

# Connecting Clients

First, [install `kubectl`](https://kubernetes.io/docs/tasks/tools/install-kubectl/) locally, in a path your session understands,
e.g. `/usr/local/bin`.

Next, configure your `kubeconfig` file with the proper details to authenticate with the API server:

```
kubectl config set-cluster dcos-k8s --server=http://localhost:9000
kubectl config set-context dcos-k8s --cluster=dcos-k8s --namespace=default
kubectl config use-context dcos-k8s
```

Currently, access to the API server is done via an SSH tunnel to any of your DC/OS agents.
Once Kubernetes is running, create the tunnel.

```
ssh -4 -i <YOUR PRIVATE KEY> -N -L 9000:apiserver-insecure.kubernetes.l4lb.thisdcos.directory:9000 \
        <SSH_USER>@<MASTER_IP>
```

If `kubectl` is properly configured and the tunnel established successfully, you can validate
your cluster by running:

```shell
kubectl get nodes
```

The output should look like:

```
NAME                                   STATUS    AGE        VERSION
kube-node-0-kubelet.kubernetes.mesos   Ready     10m        v1.9.0
kube-node-1-kubelet.kubernetes.mesos   Ready     10m        v1.9.0
kube-node-2-kubelet.kubernetes.mesos   Ready     10m        v1.9.0
```