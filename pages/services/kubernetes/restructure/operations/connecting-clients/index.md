---
layout: layout.pug
navigationTitle: Connecting Clients
title: Connecting Clients
menuWeight: 72
excerpt: Accessing the Kubernetes API with and without TLS verification, and managing multiple clusters
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->

# Prerequisites

- Before attempting to connect to the Kubernetes cluster, ensure that you have correctly exposed the Kubernetes API to outside the DC/OS cluster. This can be achieved, for example, by following the steps described in [Exposing the Kubernetes API](/services/kubernetes/2.2.0-1.13.3/operations/exposing-the-kubernetes-api/).

- Also ensure that [`kubectl`](https://kubernetes.io/docs/tasks/tools/install-kubectl/) is installed and available in the terminal session. If you installed the Kubernetes package through the DC/OS UI, you will also need to install the `dcos kubernetes` CLI:

    ```shell
    dcos package install kubernetes --cli
    ```

- Ensure that `dcos` is adequately configured to access the desired DC/OS cluster before proceeding.

<p class="message--warning"><strong>WARNING: </strong><tt>dcos</tt> <strong>MUST</strong> be configured to access the desired DC/OS cluster over HTTPS before proceeding.
</br>The following command must return a URL that starts with <tt>https://</tt>
</br><tt>$ dcos config show core.dcos_url</tt>
</br></br>In case the returned URL doesn't start with <tt>https://</tt> run:
</br><tt>$ dcos config set core.dcos_url https://&lt;master-ip&gt;</tt>
Also if the TLS certificate used by DC/OS is not trusted you additionally need to run the following command to disable TLS verification:
</br><<tt>$ dcos config set core.ssl_verify false</tt>
</p>

# Without TLS verification

In order to configure `kubectl` to access the Kubernetes API without validating the presented TLS certificate, run the following command, replacing `https://kube-apiserver.example.com:6443` with the URL at which the Kubernetes API is exposed to outside the DC/OS cluster:

```shell
dcos kubernetes cluster kubeconfig \
    --cluster-name=CLUSTER-NAME \
    --apiserver-url https://kube-apiserver.example.com:6443 \
    --insecure-skip-tls-verify
```

# With TLS verification

In order to configure `kubectl` to access the Kubernetes API while validating the presented TLS certificate run the `dcos kubernetes cluster kubeconfig` command.
Use `ca.crt` for the path to the CA certificate that signed the certificate used to expose the Kubernetes API.
Replace `https://kube-apiserver.example.com:6443` with the URL at which the Kubernetes API is exposed to outside the DC/OS cluster.

```shell
dcos kubernetes cluster kubeconfig \
    --cluster-name=CLUSTER-NAME \
    --apiserver-url https://kube-apiserver.example.com:6443 \
    --path-to-custom-ca ca.pem
```

From this point on, any `kubectl` calls should simply work, depending on the Kubernetes API authorization mode configured and the permissions given to the user's Kubernetes service account.

# Managing multiple clusters

To interact with multiple Kubernetes clusters, `kubectl` supports contexts, a group of access parameters that defines how to connect to a cluster.

To create the DC/OS Kubernetes config without switching the context, run:

```bash
$ dcos kubernetes cluster kubeconfig \
    --cluster-name=CLUSTER-NAME \
    --apiserver-url https://kube-apiserver.example.com:6443 \
    --path-to-custom-ca ca.pem \
    --no-activate-context
kubeconfig context 'kube-apiserver-example-com6443' created successfully
```

To switch to the DC/OS Kubernetes cluster context, run:

```shell
$ kubectl config use-context kube-apiserver-example-com6443
Switched to context "kube-apiserver-example-com6443".
```

Or specify the context when running commands:

```shell
$ kubectl get nodes --context=kube-apiserver-example-com6443
NAME                                             STATUS    ROLES     AGE       VERSION
kube-control-plane-0-instance.kubernetes-cluster.mesos   Ready     master    44m       v1.13.3
kube-node-0-kubelet.kubernetes-cluster.mesos             Ready     <none>    43m       v1.13.3
```

By default, the kubeconfig context name is derived from the value of the `--apiserver-url` flag. To make the context name easier to remember and switch between, you can specify a name by using the `--context-name` flag:

```bash
$ dcos kubernetes cluster kubeconfig \
    --cluster-name=CLUSTER-NAME \
    --apiserver-url https://kube-apiserver.example.com:6443 \
    --path-to-custom-ca ca.pem \
    --context-name=my-context
```

<p class="message--note"><strong>NOTE: </strong><tt>dcos kubernetes cluster kubeconfig --cluster-name=CLUSTER-NAME</tt> will refuse to overwrite existing <tt>user</tt>, <tt>context</tt> and <tt>cluster</tt> entries whose name matches the value of the <tt>--context-name</tt> flag (or the value derived from the value of the <tt>--apiserver-url</tt> flag) in case <tt>--context-name</tt> is not specified. As such, make sure to provide a unique, non-existing value for <tt>--context-name</tt>.</p>
