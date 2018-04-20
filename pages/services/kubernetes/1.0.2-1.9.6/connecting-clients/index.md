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
kube-node-0-kubelet.kubernetes.mesos   Ready     10m        v1.9.6
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

## Managing multiple clusters

Even though the DC/OS Kubernetes package only supports a single Kubernetes
cluster deployment, users may be managing multiple Kubernetes clusters from
multiple providers. `kubectl` will be configured with multiple contexts and the
user will have to switch as required.

To create the DC/OS Kubernetes config without switching to that context by
default, run:

```bash
$ dcos kubernetes kubeconfig --no-activate-context
kubeconfig context 'test-tf9bc3' created successfully
```

When you want to use this context, either switch kubectl to use it by running:

```bash
$ kubectl config use-context test-tf9bc3
Switched to context "test-tf9bc3".
```

Or specify the context when running commands:

```bash
$ kubectl get nodes --context=test-tf9bc3
NAME                                   STATUS    AGE        VERSION
kube-node-0-kubelet.kubernetes.mesos   Ready     10m        v1.9.6
```

By default, the kubeconfig context name is derived from the DC/OS cluster name.
To make the context name easier to remember and switch between, you can specify
a name by using the `--context-name` flag:

```bash
$ dcos kubernetes kubeconfig --context-name=my-context
```
