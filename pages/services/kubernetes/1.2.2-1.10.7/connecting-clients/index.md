---
layout: layout.pug
navigationTitle: Connecting Clients
title: Connecting Clients
menuWeight: 72
excerpt:
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


## Connecting Clients

Before attempting to connect to the Kubernetes cluster, the user should ensure
that they have correctly exposed the Kubernetes API to outside the DC/OS
cluster. This can be achieved, for example, by following the steps described in
[Exposing the Kubernetes API](../exposing-the-kubernetes-api).

They should also ensure that
[`kubectl`](https://kubernetes.io/docs/tasks/tools/install-kubectl/) is
installed and available to their terminal session. If the user has installed the
Kubernetes package through the DC/OS UI, then they further need to install the
`dcos kubernetes` command:

```
# dcos package install kubernetes --cli
```

The user should also ensure that `dcos` is adequately configured to access the
desired DC/OS cluster before proceeding.

<div style="border: thin solid black; background-color: #FAFAFA; border-radius: 5px; padding: 10px; margin-bottom: 20px;">
<p><b>WARNING</b></p>
<p>
<tt>dcos</tt> <b>MUST</b> be configured to access the desired DC/OS cluster
over HTTPS before proceeding. One must make sure that
<p><tt>$ dcos config show core.dcos_url</tt></p> returns a URL that starts with
<tt>https://</tt> and. In case the returned URL doesn't start with
<tt>https://</tt>, one must run
<p><tt>$ dcos config set core.dcos_url https://&lt;master-ip&gt;</tt></p>
In case the TLS certificate used by DC/OS is not trusted one additionally needs
to run the following command to disable TLS verification:
<p><tt>$ dcos config set core.ssl_verify false</tt></p>
</p>
</div>

### Without TLS verification

In order to configure `kubectl` to access the Kubernetes API without validating
the presented TLS certificate, the user must run the following command:

```
$ dcos kubernetes kubeconfig \
    --apiserver-url https://kube-apiserver.example.com:6443 \
    --insecure-skip-tls-verify
```

The user must replace `https://kube-apiserver.example.com:6443` with the URL at
which the Kubernetes API is exposed to outside the DC/OS cluster.

### With TLS verification

In order to configure `kubectl` to access the Kubernetes API while validating
the presented TLS certificate, the user must run the following command:

```
$ dcos kubernetes kubeconfig \
    --apiserver-url https://kube-apiserver.example.com:6443 \
    --path-to-custom-ca ca.pem
```

where `ca.crt` is the path to the certificate of the CA that signed the
certificate used to expose the Kubernetes API. The user must replace
`https://kube-apiserver.example.com:6443` with the URL at which the Kubernetes
API is exposed to outside the DC/OS cluster.

From this point on, any `kubectl` calls should simply work, depending on the
Kubernetes API authorization mode configured and the permissions given to the
user's Kubernetes service account.

## Managing multiple clusters

As this is written, DC/OS Kubernetes supports only one Kubernetes cluster
deployment. However, users may want to use multiple Kubernetes clusters, say
clusters running on other Kubernetes providers.

`kubectl` supports multiple contexts that the user can then switch to as
desired.

To create the DC/OS Kubernetes config without switching the context, run:

```bash
$ dcos kubernetes kubeconfig \
    --apiserver-url https://kube-apiserver.example.com:6443 \
    --path-to-custom-ca ca.pem \
    --no-activate-context
kubeconfig context 'kube-apiserver-example-com6443' created successfully
```

Whenever the user wants to switch to the DC/OS Kubernetes cluster context,
the user is to run:

```bash
$ kubectl config use-context kube-apiserver-example-com6443
Switched to context "kube-apiserver-example-com6443".
```

Or specify the context when running commands:

```bash
$ kubectl get nodes --context=kube-apiserver-example-com6443
NAME                                   STATUS    AGE        VERSION
kube-node-0-kubelet.kubernetes.mesos   Ready     10m        v1.10.7
```

By default, the kubeconfig context name is derived from the value of the
`--apiserver-url` flag. To make the context name easier to remember and switch
between, one can specify a name by using the `--context-name` flag:

```bash
$ dcos kubernetes kubeconfig \
    --apiserver-url https://kube-apiserver.example.com:6443 \
    --path-to-custom-ca ca.pem \
    --context-name=my-context
```

One should note that `dcos kubernetes kubeconfig` will refuse to overwrite
existing `user`, `context` and `cluster` entries whose name matches the value of
the `--context-name` flag (or the value derived from the value of the
`--apiserver-url` flag in case `--context-name` is not specified). As such, one
should make sure one provides a unique, non-existing value for `--context-name`.
