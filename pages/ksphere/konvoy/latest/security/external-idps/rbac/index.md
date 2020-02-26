---
layout: layout.pug
navigationTitle: Granting Access to Kubernetes Resources
title: Granting Access to Kubernetes Resources
menuWeight: 10
excerpt: Grant access to Kubernetes resources using RBAC
enterprise: false
---

## Granting Access to External Users

Users and groups from [an external identity provider](../../external-idps) will initially have no access to kubernetes resources. Privileges must be granted explicitly by interacting with the RBAC API. This section provides some basic examples for general usage. More information about the RBAC API can be found in the [Kubernetes documentation](https://kubernetes.io/docs/reference/access-authn-authz/rbac/).

### The Basics

Kubernetes does not provide an identity database for standard users. Users and group membership must be provided by a [trusted identity provider](../../external-idps). In Kubernetes, RBAC policies are additive. This means that a subject (user, group, or service account) is denied access to a resource unless explicitly granted access by a cluster administrator. Access is granted by binding a subject to a role which grants some level of access to one or more resources. Kubernetes ships with some [default roles](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#default-roles-and-role-bindings) which aid in creating broad access control policies.

As an example, if we wanted to make `marry@example.com` a cluster administrator, we would bind her username to the `cluster-admin` default role:

```shell
cat << EOF | kubectl apply -f -
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: merry-admin
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: User
  name: marry@example.com
EOF
```

This user now has the highest level of access which can be achieved. Use the `cluster-admin` role and `system:masters` group sparingly.

### Restricting a User to Namespace

A more common example would be to grant a user access to a specific namespace. This is done by creating a RoleBinding (RoleBindings are namespaced scoped). For example, to make the user `bob@example.com` a *reader* of the `baz` namespace, bind the user to the `view` role:

```shell
cat << EOF | kubectl apply -f -
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: bob-view
  namespace: baz
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: view
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: User
  name: bob@example.com
EOF
```

The user can now perform non-destructive operations targeting resources in the `baz` namespace only.

### Groups

If your external identity provider supports group claims, you can also bind groups to roles. To make the `devops` LDAP group administrators of the `production` namespace bind the group to the `admin` role:

```shell
cat << EOF | kubectl apply -f -
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: devops-admin
  namespace: production
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: admin
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: Group
  name: oidc:devops
EOF
```

One important distinction from adding users is that all external groups are prefixed with `oidc:`. So our group name becomes `oidc:devops`. This is needed to prevent collision with locally defined groups.

## Portal Authorization

The Operations Portal, and other HTTP applications protected by Konvoy forward authentication, are also authorized by the Kubernetes RBAC API. In addition to kubernetes API resources, it is possible to define rules which map to HTTP URIs and HTTP verbs. Kubernetes RBAC calls these `nonResourceURLs`, Konvoy forward authentication uses these rules to grant or deny access to HTTP endpoints.

### Default Roles

Roles have been created for granting access to the operations portal and select addons which expose an HTTP server through the ingress controller. The `cluster-admin` role is actually a system role that defines grants permission to all actions (verbs) on any resource; including non-resource URLs. The default operations portal user is bound to this role.

**Note: Granting user `admin` privileges on `/ops/portal/*` will grant `admin` privileges to all sub-resources, even if bindings exist for sub-resources with less privileges**

| App               |  Role                        | Path                       | access              |
| ----------------- | ---------------------------- | -------------------------- | ------------------- |
| *                 | cluster-admin                | *                          | read, write, delete |
| opsportal         | opsportal-view               | /ops/portal/*              | read                |
| opsportal         | opsportal-edit               | /ops/portal/*              | read, write         |
| opsportal         | opsportal-admin              | /ops/portal/*              | read, write, delete |
| kibana            | opsportal-kibana-view        | /ops/portal/kibana/*       | read                |
| kibana            | opsportal-kibana-edit        | /ops/portal/kibana/*       | read, write         |
| kibana            | opsportal-kibana-admin       | /ops/portal/kibana/*       | read, write, delete |
| alertmanager      | opsportal-alertmanager-view  | /ops/portal/alertmanager/* | read                |
| alertmanager      | opsportal-alertmanager-edit  | /ops/portal/alertmanager/* | read, write         |
| alertmanager      | opsportal-alertmanager-admin | /ops/portal/alertmanager/* | read, write, delete |
| grafana           | opsportal-grafana-view       | /ops/portal/grafana/*      | read                |
| grafana           | opsportal-grafana-edit       | /ops/portal/grafana/*      | read, write         |
| grafana           | opsportal-grafana-admin      | /ops/portal/grafana/*      | read, write, delete |
| prometheus        | opsportal-prometheus-view    | /ops/portal/prometheus/*   | read                |
| prometheus        | opsportal-prometheus-edit    | /ops/portal/prometheus/*   | read, write         |
| prometheus        | opsportal-prometheus-admin   | /ops/portal/prometheus/*   | read, write, edit   |
| traefik           | opsportal-traefik-view       | /ops/portal/traefik/*      | read                |
| traefik           | opsportal-traefik-edit       | /ops/portal/traefik/*      | read, edit          |
| traefik           | opsportal-traefik-admin      | /ops/portal/traefik/*      | read, edit, delete  |

 This section will provide a few examples of binding subjects to the default roles defined for the operations portal endpoints.

### Examples
To grant the user `marry@example.com` administrative access to all operations portal resources, bind the user to the `opsportal-admin` role:

```shell
cat << EOF | kubectl apply -f -
 ---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: opsportal-admin-marry
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: opsportal-admin
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: User
  name: marry@example.com
EOF
```

If we inspect the role, we can see what access has been granted:

```shell
$ kubectl describe clusterroles opsportal-admin
describe clusterroles opsportal-admin
Name:         opsportal-admin
Labels:       app.kubernetes.io/instance=opsportal-kubeaddons
              app.kubernetes.io/managed-by=Tiller
              app.kubernetes.io/version=1.0.0
Annotations:  <none>
PolicyRule:
  Resources  Non-Resource URLs  Resource Names  Verbs
  ---------  -----------------  --------------  -----
             [/ops/portal/*]    []              [delete]
             [/ops/portal]      []              [delete]
             [/ops/portal/*]    []              [get]
             [/ops/portal]      []              [get]
             [/ops/portal/*]    []              [head]
             [/ops/portal]      []              [head]
             [/ops/portal/*]    []              [post]
             [/ops/portal]      []              [post]
             [/ops/portal/*]    []              [put]
             [/ops/portal]      []              [put]
```

The user can now use the HTTP verbs HEAD, GET, DELETE, POST, and PUT when accessing any URL at or under `/ops/portal`. Provided the downstream application follows REST conventions, this effectively allows read, edit, and delete privileges.

## Groups

In order to grant view access to the `/ops/portal/*` endpoints and edit access to the kibana endpoint to group `kibana-ops`, create the following ClusterRoleBindings:

```shell
cat << EOF | kubectl apply -f -
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: opsportal-view-kibana-ops
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: opsportal-view
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: Group
  name: oidc:kibana-ops
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: opsportal-kibana-edit-kibana-ops
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: opsportal-kibana-edit
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: Group
  name: oidc:kibana-ops
EOF
```

**Note: external groups must be prefixed by `oidc:`**

Members of `kibana-ops` are now able to `view` all resources under `/ops/portal` and edit all resources under `/ops/portal/kibana`

## Accessing the Kubernetes Dashboard

The Kubernetes dashboard offloads authorization directly to the Kubernetes API server. Once authenticated, all users may access the dashboard at `/ops/portal/kubernetes` without needing an `opsportal` role. However, access to the underlying kubernetes resources exposed by the dashboard are protected by the cluster RBAC policy.

## Further Reading

This page has provides some basic examples of operations which provide the building blocks of creating an access control policy. For information about creating your own roles and more advanced policies, we highly recommend reading the Kubernetes [RBAC documentation](https://kubernetes.io/docs/reference/access-authn-authz/rbac/).
