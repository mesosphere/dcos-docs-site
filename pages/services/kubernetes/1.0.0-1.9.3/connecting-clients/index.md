---
layout: layout.pug
navigationTitle: Connecting Clients
title: Connecting Clients
menuWeight: 70
excerpt:
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


# Connecting Clients

First, [install `kubectl`](https://kubernetes.io/docs/tasks/tools/install-kubectl/) locally, in a path your session understands,
e.g. `/usr/local/bin`.

Next, make sure `dcos` is adequately configured to access your DC/OS cluster,
and run

```
$ dcos kubernetes kubeconfig
```

You should now be able to validate your cluster by running:

```shell
kubectl get nodes
```

The output should look something like:

```
NAME                                   STATUS    AGE        VERSION
kube-node-0-kubelet.kubernetes.mesos   Ready     10m        v1.9.3
```

For running more advanced commands such as `kubectl proxy`, an SSH tunnel is
still required. To create the tunnel, run

```
$ ssh -4 -i <YOUR PRIVATE KEY> -N -L 9000:apiserver-insecure.kubernetes.l4lb.thisdcos.directory:9000 \
        <SSH_USER>@<MASTER_IP>
```

You must then re-configure `kubectl` by running

```
$ kubectl config set-cluster dcos-k8s --server=http://localhost:9000
$ kubectl config set-context dcos-k8s --cluster=dcos-k8s --namespace=default
$ kubectl config use-context dcos-k8s
```

If `kubectl` is properly configured and the tunnel established successfully, you
should now be able to run `kubectl proxy` as well as any other command.
