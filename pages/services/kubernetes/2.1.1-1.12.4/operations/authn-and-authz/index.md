---
layout: layout.pug
navigationTitle: Authentication and Authorization
title: Authentication and Authorization
menuWeight: 10
excerpt: Authentication and authorization modes for DC/OS Kubernetes
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->

# Authorization Modes

DC/OS Kubernetes supports the following [Kubernetes authorization modes](https://kubernetes.io/docs/reference/access-authn-authz/authorization/#authorization-modules):

* `AlwaysAllow`, the default, all-permissive mode.
* `RBAC`, a fine-grained control of _who_ can access _what_ Kubernetes API resources.

<p class="message--warning"><strong>WARNING: </strong>The authorization mode for a cluster must be chosen when installing the package. Changing the authorization mode after installing the package is not supported.
</p>

## `AlwaysAllow`

The default authorization mode in DC/OS Kubernetes is `AlwaysAllow`. This means that every authenticated request to the Kubernetes API will be authorized.

## `RBAC`

To enable `RBAC` authorization mode set the value of the `kubernetes.authorization_mode` configuration property to `RBAC`.

This is done when installing the package, either via the UI:

![alt text](/services/kubernetes/2.1.1-1.12.4/img/authorization-mode.png "Authorization Mode")

Figure 1. Setting the authorization mode

Or, alternatively, via the CLI, with custom options:

```json
{
  "kubernetes": {
    "authorization_mode": "RBAC"
  }
}
```

# Giving users access to the Kubernetes API

This package does not provide integration with DC/OS authentication or authorization, meaning a DC/OS user will not be a valid Kubernetes user.  This means the following:

* Kubernetes API **Users** will be modelled as Kubernetes service-accounts.
* The install procedure will create a user (`bootstrapper`) with superuser privileges (`cluster-admin` cluster role), that can be used later by the operator to add more users - and their respective permissions if `RBAC` authorization mode is enabled.

<p class="message--warning"><strong>WARNING: </strong>We <strong>highly recommend</strong> the operator to create a service account for every user wanting access to the Kubernetes cluster (for example, using <tt>kubectl create serviceaccount</tt>), and give this service account only the permissions needed by each user (for example, using <tt>kubectl create [cluster]rolebinding</tt>).</p>

We also **highly recommend** that the operator create new service account(s) for themselves and entirely remove the `bootstrapper` service account.


## Creating Kubernetes service accounts, roles and role bindings

<p class="message--note"><strong>NOTE: </strong> Fine-grained authorization control with service accounts will only work when RBAC authorization mode is selected.</p>

Once [kubectl is setup for the bootstrap user](/services/kubernetes/2.1.1-1.12.4/operations/connecting-clients/) you may wish to grant other users access to specific resources running in the cluster.
Below are examples on how to create service accounts and grant those accounts different permissions in the cluster.

### Pre-defined roles

A few roles are [automatically created](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#user-facing-roles) when a Kubernetes cluster is installed; these include `cluster-admin`, `admin`, `edit` and `view`.

Below is an example of creating a user with `view` permissions on the `my-namespace` namespace; this method can be adapted to any other user or role:

```shell
kubectl create serviceaccount my-sa
kubectl create rolebinding my-sa-view \
  --clusterrole=view \
  --serviceaccount=my-namespace:my-sa \
  --namespace=my-namespace
```

### Custom roles

In addition to the pre-defined roles, you may want to grant users customized permissions.
As an example we shall create a user, `my-pod-sa`, that can only view **pods** in the `my-namespace` namespace.

1. First create a service account:

```shell
kubectl create serviceaccount my-pod-sa -n my-namespace
```

2. Then create a `Role` definition called `pod-reader`:

```shell
cat <<EOF | kubectl create -f -
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  namespace: my-namespace
  name: pod-reader
rules:
- apiGroups: [""] # "" indicates the core API group
  resources: ["pods"]
  verbs: ["get", "watch", "list"]
EOF
```

3. Finally, bind the service account `my-pod-sa` to the new `pod-reader` role:

```shell
kubectl create rolebinding my-pod-sa-view \
  --role=pod-reader \
  --serviceaccount=my-namespace:my-pod-sa \
  --namespace=my-namespace
```

To retrieve the generated token for `my-pod-sa` service account that can later be used to configure `kubectl` or access the [Kubernetes Dashboard](/services/kubernetes/2.1.1-1.12.4/operations/kubernetes-dashboard/), get the secret name and then that secret's token:

```shell
export SECRET="$(kubectl get sa my-pod-sa -o 'jsonpath={.secrets[0].name}' -n my-namespace)"
kubectl describe secrets $SECRET -n my-namespace | awk '$1=="token:"{print $2}'
```

See the [Kubernetes RBAC documentation](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#user-facing-roles) for more detail on creating roles and binding those roles to service accounts.
