---
layout: layout.pug
navigationTitle: Authorization
title: Authorization
menuWeight: 75
excerpt:
---

# Authorization

DC/OS Kubernetes supports the following
[Kubernetes authorization modes](https://kubernetes.io/docs/reference/access-authn-authz/authorization/#authorization-modules):

- `AlwaysAllow`, the default, all-permissive mode.
- `RBAC`, a more fine-grained control of _who_ can access _what_ Kubernetes
  API resources.

<div style="border: thin solid black; background-color: #FAFAFA; border-radius: 5px; padding: 10px; margin-bottom: 20px;">
<p><b>WARNING</b></p>
<p>The authorization mode for a cluster must be chosen when installing the package. Changing the authorization mode after installing the package is not supported.</p>
</div>

## `AlwaysAllow`

The default authorization mode in DC/OS Kubernetes is `AlwaysAllow`. This means
that every authenticated request to the Kubernetes API will be authorized.

## `RBAC`

In order to enable `RBAC` authorization mode, the user must set the value of
the `kubernetes.authorization_mode` configuration property to `RBAC`.

This is done when installing the package, either via the UI:

![alt text](/services/kubernetes/1.3.0-1.10.8/img/authorization-mode.png "Authorization Mode")

Or, alternatively, via the CLI, with custom options:

```json
{
  "kubernetes": {
    "authorization_mode": "RBAC"
  }
}
```

## Giving users access to the Kubernetes API

This package does not provide integration with DC/OS authentication or
authorization, meaning a DC/OS user will not be a valid Kubernetes user.
This means the following:

- Kubernetes API _Users_ will be modelled as Kubernetes service-accounts;
- The install procedure will create a user (`bootstrapper`) with superuser
  privileges (`cluster-admin` cluster role), that can be used later by the
  operator to add more users - and their respective permissions if `RBAC`
  authorization mode is enabled.

<div style="border: thin solid black; background-color: #FAFAFA; border-radius: 5px; padding: 10px; margin-bottom: 20px;">
<p><b>WARNING</b></p>
<p>We <b>highly recommend</b> the operator to create a service account for every user wanting access to the Kubernetes cluster (e.g. using <tt>kubectl create serviceaccount</tt>), and give this service account only the permissions needed by each user (e.g. using <tt>kubectl create [cluster]rolebinding</tt>).</p>
<p>We also <b>highly recommend</b> the operator to create new service account(s) for themselves and entirely remove the <tt>bootstrapper</tt> service account.</p>
</div>
