---
layout: layout.pug
navigationTitle: Kubernetes Dashboard
title: Kubernetes Dashboard
menuWeight: 5
excerpt: Accessing the Kubernetes Dashboard
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->

Once [the Kubernetes API is exposed correctly and kubectl set up](/services/kubernetes/2.1.0-1.12.3/operations/connecting-clients/), you will be able to access the Kubernetes Dashboard by running:

```shell
$ kubectl proxy
Starting to serve on 127.0.0.1:8001
```

and pointing your browser at the following URL:

```text
http://127.0.0.1:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/
```

When accessed, and depending on whether you are running DC/OS or DC/OS EE (as well as on your browser's configuration) you may be presented a warning indicating that the TLS certificate being used by the Kubernetes Dashboard is not trusted.
It is generally safe to permanently trust this TLS certificate by adding an exception in your browser, but it is important that you understand how this certificate has been generated:

## DC/OS

In DC/OS, and as described in [Customizing](/services/kubernetes/2.1.0-1.12.3/operations/customizing-install/), a certificate authority is automatically generated when installing the package.
This certificate authority is then used to sign the TLS certificate presented by the Kubernetes Dashboard.
Since this certificate authority is generated on a per-Kubernetes-cluster basis, you will have to manually trust the certificate presented by the Kubernetes Dashboard for every instance of every Kubernetes cluster you install on your DC/OS cluster.

## DC/OS Enterprise

In DC/OS Enterprise, and as described in [Customizing](/services/kubernetes/2.1.0-1.12.3/operations/customizing-install/), the centralized [DC/OS CA](/1.12/security/ent/tls-ssl/) is used in order to provide TLS certificates for the Kubernetes cluster.
This includes the TLS certificate presented by the Kubernetes Dashboard.
If you have already configured the DC/OS CA as a trusted CA in your browser, the browser will automatically accept the certificate presented by every instance of the Kubernetes Dashboard, regardless of the Kubernetes cluster it belongs to.
If you haven't configured the DC/OS CA as a trusted CA in your browser, and depending on the browser itself, it may be necessary to trust every certificate manually.
Hence, permanently trusting the root DC/OS CA is recommended.

# Login view and Authorization

The Kubernetes Dashboard will show you the [login view](https://github.com/kubernetes/dashboard/wiki/Access-control#login-view).
In this screen you should choose the **Kubeconfig** option, click the **Choose kubeconfig file** text box and pick the location of your kubeconfig file (typically, `$HOME/.kube/config`).

The set of actions you can perform within the Kubernetes Dashboard using this login method is tied to the role or cluster role bound to the service account that is being used in the kubeconfig file you specify.
In particular, this means that if you have been granted the `cluster-admin` cluster role, you will have full administrative privileges on the target Kubernetes cluster.
