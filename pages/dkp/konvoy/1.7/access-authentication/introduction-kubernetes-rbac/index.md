---
layout: layout.pug
navigationTitle: Introduction to RBAC
title: Introduction to RBAC
menuWeight: 5
excerpt: Learn the basics of RBAC
beta: false
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

Here we will be introducing the security model for accessing Kubernetes resources named RBAC [1][1].
RBAC is one of the two main approaches to regulating access to resources which had been considered by the community.
It was settled as the right approach to Kubernetes because: it's less complex, simpler to manage and maintain, and would not require handling ssh-keys nor restarts to the api-server [2][2].

Role Based Access Control (RBAC) is the mechanism of authorization that determines what actors (those that want to do things) can and cannot do inside a Kubernetes cluster.

### Roles and ClusterRoles

Roles are the means by which you define authorization to perform actions on resources.
Roles and ClusterRoles differ in that Roles are namespaced objects, meaning they can only define authorization within the namespace in which they persist.
Here is an example of a `namespace` role:

Create a file called `my_role.yaml`, similar to the example below.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: my-namespace
  name: addon-reader
rules:
- apiGroups: ["kubeaddons.mesosphere.io/v1beta2"] # indicates the core API group
  resources: ["addons"] # what resources you wish to authorize
  verbs: ["get", "watch", "list"] # what actions are permitted
```

To create the resource in Kubernetes run:

```bash
kubectl apply -f my_role.yaml
```

The example above defines an `addon-reader` Role and allows the consumer of this role to view the api object `addons` in the apiGroup: `kubeaddons.mesosphere.io/v1beta2`.
Specifically, it allows the consumer of this role to `get`, `watch`, and `list` addons, only.
No changes of the resource are allowed as that would require additional entries in the `verbs` field.
A ClusterRole is similar to a Role except it is not namespaced and is of `kind: ClusterRole`.

Create a file called `my_clusterrole.yaml`, similar to the example below.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: cluster-addon-reader
rules:
- apiGroups: ["kubeaddons.mesosphere.io/v1beta2"] # "" indicates the core API group
  resources: ["addons"] # what resources you wish to authorize
  verbs: ["get", "watch", "list"] # What actions you wish to perform on them
```

To create the ClusterRole, use the following command:

```bash
kubectl apply -f my_clusterrole.yaml
```

### Authorized Subjects

Next consider who or what can be assigned Roles and ClusterRoles.
In Kubernetes, we assign Roles to Subject.
We use the following three subjects:

```yaml
- kind: User
  name: My-name # case sensitive
  apiGroup: rbac.authorization.k8s.io

- kind: Group
  name:  My-names-Group # case sensitive
  apiGroup: rbac.authorization.k8s.io

- kind: ServiceAccount
  name: a-service-account #  case sensitive
  apiGroup: rbac.authorization.k8s.io
```

The `ServiceAccount` is a namespaced Kubernetes Resource and can be assigned to deployments, jobs, and statefulsets to give pods access to other Kubernetes resources.
Much consideration must be made when creating a `ServiceAccount`.  Modifying a `ServiceAccount` can cause pods to require restarting.

### RoleBindings and ClusterRoleBindings

We assign roles and subjects using `RoleBindings` and `ClusterRoleBindings`.
As the name implies `ClusterRoleBindings` are applied cluster wide, while `RoleBindings` apply to a particular namespace.

Here is an example `RoleBinding`:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: addon-reader-binding
  namespace: my-namespace
roleRef:
  # "roleRef" specifies the binding to a Role / ClusterRole
  kind: Role #  a Role or ClusterRole
  name: addon-reader # must match the name of the Role (RoleBinding) or ClusterRole (ClusterRoleBinding) this binds to
  apiGroup: rbac.authorization.k8s.io
subjects:
# Who gets assigned the role in roleRef
- kind: User
  name: My-name
  apiGroup: rbac.authorization.k8s.io
- kind: Group
  name:  My-names-Group # case sensitive
  apiGroup: rbac.authorization.k8s.io
- kind: ServiceAccount
  name: a-service-account
  apiGroup: rbac.authorization.k8s.io
```

This example assigns a User `My-name`, a Group `My-names-Group`, and a ServiceAccount `a-service-account` the role `addon-reader`.
A similar story for a ClusterRoleBindings where again we would leave out the namespace as it would apply cluster wide.

Once a binding has been created, you cannot change a `roleRef`. This would cause a validation warning.
In those cases you must delete the binding and create a new binding.

With the binding created, we have successfully mapped roles (things that can be done) with actors (those that want to do things).

## Conclusion

RBAC, as a concept, fits neatly in the Kubernetes realm of resource and resource management.
We have seen how to create roles with actors in the form of roles and roleBindings, both of which are Kubernetes resources.

[1]: https://kubernetes.io/docs/reference/access-authn-authz/rbac/
[2]: https://kubernetes.io/blog/2017/04/rbac-support-in-kubernetes/
