---
layout: layout.pug
navigationTitle: Kubernetes Dashboard
title: Kubernetes Dashboard
menuWeight: 75
excerpt:
---

# Kubernetes Dashboard

## Default deployment

Once [the Kubernetes API is exposed correctly and kubectl setup](../connecting-clients), the user will be able to access the Kubernetes Dashboard by running:

```
# kubectl proxy
Starting to serve on 127.0.0.1:8001
```

and pointing their browser at:

```text
http://127.0.0.1:8001/api/v1/namespaces/kube-system/services/http:kubernetes-dashboard:/proxy/
```

<div style="border: thin solid black; background-color: #FAFAFA; border-radius: 5px; padding: 10px; margin-bottom: 20px;">
<p><b>WARNING</b></p>
<p>
The user <b>MUST NOT</b> modify the default deployment of the Kubernetes Dashboard in any way (besides, eventually, the way described in the next section).
</p>
</div>

## Recommended deployment

The default deployment of the Kubernetes Dashboard in DC/OS Kubernetes gives full administrative privileges to the `kubernetes-dashboard` service account.
This is in contrast with `2.0.0-1.12.1` and later versions, in which a more conservative deployment is performed.
Moving to `2.0.0-1.12.1` or later is [strongly recommended](https://mesosphere-community.force.com/s/article/Critical-Issue-Kubernetes-Upgrade-MSPH-2018-0007).

In scenarios where moving to one of these versions is not possible, users are strongly advised to run the following commands in order to restrict the set of permissions given to the above mentioned service account:

```shell
kubectl -n kube-system delete service kubernetes-dashboard
kubectl -n kube-system delete deployment kubernetes-dashboard
kubectl -n kube-system delete clusterrolebinding kubernetes-dashboard
kubectl -n kube-system delete serviceaccount kubernetes-dashboard
kubectl create -f https://raw.githubusercontent.com/kubernetes/dashboard/v1.10.0/src/deploy/recommended/kubernetes-dashboard.yaml
```

The user will then be able to access the Kubernetes Dashboard by running:

```
# kubectl proxy
Starting to serve on 127.0.0.1:8001
```

and pointing their browser at the following URL instead:

```text
http://127.0.0.1:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/
```

When opening the URL above, the Kubernetes Dashboard will show the user the [login view](https://github.com/kubernetes/dashboard/wiki/Access-control#login-view).
In this screen, the user should choose the **Kubeconfig** option, click the **Choose kubeconfig file** text box and pick the location of their kubeconfig file (typically, `$HOME/.kube/config`).

The set of actions the user can perform within the Kubernetes Dashboard using this login method will be tied to the role or cluster role bound to the service account that is being used in the kubeconfig file they specify.
In particular, this means that if the user has been granted the `cluster-admin` cluster role, they will have full administrative privileges on the target Kubernetes cluster.

<div style="border: thin solid black; background-color: #FAFAFA; border-radius: 5px; padding: 10px; margin-bottom: 20px;">
<p><b>WARNING</b></p>
<p>
The user <b>MUST NOT</b> modify the deployment of the Kubernetes Dashboard in any other way.
</p>
</div>
