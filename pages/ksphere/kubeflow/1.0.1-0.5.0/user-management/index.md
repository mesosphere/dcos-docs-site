---
layout: layout.pug
navigationTitle: Manage Users
title: Manage Users and Permissions
menuWeight: 20
excerpt: Manage Kubeflow users and permissions
beta: false
enterprise: false
---

# Manage Kubeflow Users and Permissions

Prerequisites: 
- Administrative access to a properly configured Konvoy cluster via `kubectl`

Because a single Kubeflow user needs to interact with Kubernetes resources across their own Kubeflow `Profile` namespace,
D2iQ recommends appropriately configured `ClusterRole` objects. As with all matters regarding security,
we encourage you to thoroughly review permissions set by our predefined `ClusterRoles` in conjunction with your security team.

_NB: The following tutorial assumes you have already connected an OIDC provider to your Konvoy cluster via Konvoy's
built-in Dex integration. If you have not yet done so, review the documentation
[here](https://docs.d2iq.com/ksphere/konvoy/latest/security/external-idps/) before proceeding._

## Kubeflow Predefined `ClusterRoles`
KUDO for Kubeflow comes with a set of predefined Kubernetes `ClusterRoles` designed to simplify the workflow of Kubeflow
administrators who want to manage the permissions KUDO for Kubeflow users and administrators.

Predefined `ClusterRoles` for Kubeflow tenants are as follows:

1. `kubeflow-admin` - Appropriate for administrators of the Kubeflow instance.
1. `kubeflow-edit` - Appropriate for data scientists, data engineers, MLOps engineers, or other Kubeflow tenants.
1. `kubeflow-view` - Appropriate for those who should have view-only access to the Kubeflow instance.

For a chart of the permissions granted to each `ClusterRole`, see the [Permissions Charts](#permissions-charts).

## Onboarding new users
### Overview
KUDO for Kubeflow provides an abstraction called `Profile` which is assigned to a user and bound to a namespace along with additional
resources such as namespace-scoped service accounts, RBAC `RoleBinding`s, Istio `ServiceRole` and `ServiceRoleBinding`.
Kubeflow grants users with namespace admin permissions for their namespaces.

### Automatic profile creation
When an authenticated user logs into the system and visits the central dashboard for the first time, they
trigger a profile creation automatically.

### Manual profile creation
For a finer-grained control and per-namespace resource quota management, a profiles for the new users can be created
before onboarding them.

#### Step 1 - Create the `Profile` YAML manifest

In your terminal shell, run:

```bash
cat << EOF > user-profile.yaml
apiVersion: kubeflow.org/v1
kind: Profile
metadata:
  name:  "<name of profile>"
spec:
  owner:
    kind: User
    name: "<Email of user>"
  resourceQuotaSpec: {}
EOF
```

#### Step 2 - Edit `user-profile.yaml` with details for the new user

Edit the `metadata.name` to the name of the profile you want to add.

**Note:** This name should be globally unique across your Konvoy cluster, otherwise you may overwrite another profile.

Edit the `spec.owner.name` to match the email address associated with the user's OIDC account.

#### Step 3 - Edit `user-profile.yaml` to configure resource quota (optional)

Edit the `spec.resourceQuotaSpec` to specify user  namespace resource quota.
Example:
```yaml
  resourceQuotaSpec:
    hard:
      cpu: "100"
      memory: 500Gi
      pods: "50"
```

Check [ResourceQuotaSpec](https://godoc.org/k8s.io/api/core/v1#ResourceQuotaSpec) for the `resourceQuotaSpec` format.

#### Step 4 - Apply `user-profile.yaml` to your Konvoy cluster

In your terminal shell, run:

`kubectl apply -f user-profile.yaml`

Your output should look similar to this:

```bash
kubectl apply -f user-profile.yaml

profile.kubeflow.org/<name of profile> created
```

## Modifying Permissions of existing Users

### Adding Permissions for a Kubeflow Administrator     

#### Step 1 - Create the `ClusterRoleBinding` YAML manifest

In your terminal shell, run:

```bash
cat << EOF > add-kubeflow-admin.yaml                                        
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: "<name of user>"
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: kubeflow-admin
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: User
  name: "<Email of user>"
EOF

```

#### Step 2 - Edit `add-kubeflow-admin.yaml` with details for the new user

Edit the `metadata.name` to the name of the user you want to add. 

**Note:** This name should be globally unique across your Konvoy cluster, otherwise you may overwrite another user's permissions.

Edit the `subjects.apiGroup.name` to match the email address associated with the user's OIDC account.


#### Step 3 - Apply `add-kubeflow-admin.yaml` to your Konvoy cluster

In your terminal shell, run:

`kubectl apply -f add-kubeflow-admin.yaml` 

Your output should look similar to this:

```bash
kubectl apply -f add-kubeflow-admin.yaml                              

clusterrolebinding.rbac.authorization.k8s.io/<name of user> created
```

### Adding Permissions for a Kubeflow User

#### Step 1 - Create the `ClusterRoleBinding` YAML manifest

In your terminal shell, run:

```bash
cat << EOF > add-kubeflow-user.yaml                                        
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: "<name of user>"
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: kubeflow-edit
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: User
  name: "<Email of user>"
EOF

```

#### Step 2 - Edit `add-kubeflow-user.yaml` with details for the new user

Edit the `metadata.name` to the name of the user you want to add. 

**Note:** This name should be globally unique across your Konvoy cluster, otherwise you may overwrite another user's permissions.

Edit `subjects.apiGroup.name` to match the email address associated with the user's OIDC account.


#### Step 3 - Apply `add-kubeflow-user.yaml` to your Konvoy cluster

In your terminal shell, run: 

`kubectl apply -f add-kubeflow-user.yaml` 

Your output should look similar to this:

```bash
kubectl apply -f add-kubeflow-user.yaml                              

clusterrolebinding.rbac.authorization.k8s.io/<name of user> created
```

# Permissions Charts

## `kubeflow-admin` permissions

![kf-admin-permissions-chart](../img/kubeflow-admin-permissions.png)

## `kubeflow-edit` permissions

![kf-edit-permissions-chart](../img/kubeflow-edit-permissions.png)

## `kubeflow-view` permissions

![kf-view-permissions-chart](../img/kubeflow-view-permissions.png)
