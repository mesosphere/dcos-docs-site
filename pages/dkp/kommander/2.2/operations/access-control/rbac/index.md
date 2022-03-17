---
layout: layout.pug
navigationTitle: Granting Access to Kubernetes and Kommander Resources
title: Granting Access to Kubernetes and Kommander Resources
menuWeight: 10
excerpt: Grant access to Kommander and Kubernetes resources using RBAC
beta: false
enterprise: false
---

## Granting Access to External Users

Users and groups from an external identity provider initially have no access to kubernetes resources. Privileges must be granted explicitly by interacting with the RBAC API. This section provides some basic examples for general usage. More information about the RBAC API can be found in the [Kubernetes documentation](https://kubernetes.io/docs/reference/access-authn-authz/rbac/).

### The Basics

Kubernetes does not provide an identity database for standard users. Users and group membership must be provided by a trusted identity provider. In Kubernetes, RBAC policies are additive, which means that a subject (user, group, or service account) is denied access to a resource unless explicitly granted access by a cluster administrator. You can grant access by binding a subject to a role, which grants some level of access to one or more resources. Kubernetes ships with some [default roles](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#default-roles-and-role-bindings), which aid in creating broad access control policies.

For example, if you want to make `mary@example.com` a cluster administrator, bind her username to the `cluster-admin` default role as follows:

```shell
cat << EOF | kubectl apply -f -
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: mary-admin
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: User
  name: mary@example.com
EOF
```

This user now has the highest level of access which can be achieved. Use the `cluster-admin` role and `system:masters` group sparingly.

### Restricting a User to Namespace

A more common example would be to grant a user access to a specific namespace, by creating a RoleBinding (RoleBindings are namespaced scoped). For example, to make the user `bob@example.com` a _reader_ of the `baz` namespace, bind the user to the `view` role:

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

One important distinction from adding users is that all external groups are prefixed with `oidc:`, so a group name becomes `oidc:devops`. This prevents collision with locally defined groups.

## Kommander Dashboard Authorization

The Kommander Dashboard, and other HTTP applications protected by Kommander forward authentication, are also authorized by the Kubernetes RBAC API. In addition to Kubernetes API resources, it is possible to define rules which map to HTTP URIs and HTTP verbs. Kubernetes RBAC calls these `nonResourceURLs`, Kommander forward authentication uses these rules to grant or deny access to HTTP endpoints.

### Default Roles

Roles have been created for granting access to the dashboard and select applications which expose an HTTP server through the ingress controller. The `cluster-admin` role is actually a system role that defines grants permission to all actions (verbs) on any resource; including non-resource URLs. The default dashboard user is bound to this role.

<p class="message--note"><strong>NOTE: </strong>Granting user <code>admin</code> privileges on <code>/dkp/*</code> grants <code>admin</code> privileges to all sub-resources, even if bindings exist for sub-resources with less privileges</p>

| Dashboard           | Role                                         | Path                                 | access              |
| ------------------- | -------------------------------------------- | ------------------------------------ | ------------------- |
| \*                  | cluster-admin                                | \*                                   | read, write, delete |
| kommander           | dkp-view                                     | /dkp/\*                              | read                |
| kommander           | dkp-edit                                     | /dkp/\*                              | read, write         |
| kommander           | dkp-admin                                    | /dkp/\*                              | read, write, delete |
| kommander-dashboard | dkp-kommander-view                           | /dkp/kommander/dashboard/\*          | read                |
| kommander-dashboard | dkp-kommander-edit                           | /dkp/kommander/dashboard/\*          | read, write         |
| kommander-dashboard | dkp-kommander-admin                          | /dkp/kommander/dashboard/\*          | read, write, delete |
| alertmanager        | kube-prometheus-stack-dkp-alertmanager-view  | /dkp/alertmanager/\*                 | read                |
| alertmanager        | kube-prometheus-stack-dkp-alertmanager-edit  | /dkp/alertmanager/\*                 | read, write         |
| alertmanager        | kube-prometheus-stack-dkp-alertmanager-admin | /dkp/alertmanager/\*                 | read, write, delete |
| centralized-grafana | centralized-grafana-dkp-grafana-view  | /dkp/kommander/monitoring/grafana/\* | read                |
| centralized-grafana | centralized-grafana-dkp-grafana-edit  | /dkp/kommander/monitoring/grafana/\* | read, write         |
| centralized-grafana | centralized-grafana-dkp-grafana-admin | /dkp/kommander/monitoring/grafana/\* | read, write, delete |
| centralized-kubecost | dkp-centralized-kubecost-view  | /dkp/kommander/kubecost/\* | read                |
| centralized-kubecost | dkp-centralized-kubecost-edit  | /dkp/kommander/kubecost/\* | read, write         |
| centralized-kubecost | dkp-centralized-kubecost-admin | /dkp/kommander/kubecost/\* | read, write, delete |
| grafana             | kube-prometheus-stack-dkp-grafana-view       | /dkp/grafana/\*                      | read                |
| grafana             | kube-prometheus-stack-dkp-grafana-edit       | /dkp/grafana/\*                      | read, write         |
| grafana             | kube-prometheus-stack-dkp-grafana-admin      | /dkp/grafana/\*                      | read, write, delete |
| grafana-logging     | dkp-grafana-logging-view                             | /dkp/logging/grafana/\*              | read                |
| grafana-logging     | dkp-grafana-logging-edit                             | /dkp/logging/grafana/\*              | read, write         |
| grafana-logging     | dkp-grafana-logging-admin                            | /dkp/logging/grafana/\*              | read, write, delete |
| karma               | dkp-karma-view       | /dkp/kommander/monitoring/karma/\*                      | read                |
| karma               | dkp-karma-edit       | /dkp/kommander/monitoring/karma/\*                      | read, write         |
| karma               | dkp-karma-admin      | /dkp/kommander/monitoring/karma/\*                      | read, write, delete |
| kubernetes-dashboard | dkp-kubernetes-dashboard-view       | /dkp/kubernetes/\*                      | read                |
| kubernetes-dashboard | dkp-kubernetes-dashboard-edit       | /dkp/kubernetes/\*                      | read, write         |
| kubernetes-dashboard | dkp-kubernetes-dashboard-admin      | /dkp/kubernetes/\*                      | read, write, delete |
| prometheus          | kube-prometheus-stack-dkp-prometheus-view    | /dkp/prometheus/\*                   | read                |
| prometheus          | kube-prometheus-stack-dkp-prometheus-edit    | /dkp/prometheus/\*                   | read, write         |
| prometheus          | kube-prometheus-stack-dkp-prometheus-admin   | /dkp/prometheus/\*                   | read, write, edit   |
| traefik             | dkp-traefik-view                             | /dkp/traefik/\*                      | read                |
| traefik             | dkp-traefik-edit                             | /dkp/traefik/\*                      | read, edit          |
| traefik             | dkp-traefik-admin                            | /dkp/traefik/\*                      | read, edit, delete  |
| thanos              | dkp-thanos-query-view       | /dkp/kommander/monitoring/query/\*                      | read                |
| thanos              | dkp-thanos-query-edit       | /dkp/kommander/monitoring/query/\*                      | read, write         |
| thanos              | dkp-thanos-query-admin      | /dkp/kommander/monitoring/query/\*                      | read, write, delete |

This section provides a few examples of binding subjects to the default roles defined for the Kommander dashboard endpoints.

### Examples

#### User

To grant the user `mary@example.com` administrative access to all Kommander resources, bind the user to the `dkp-admin` role:

```shell
cat << EOF | kubectl apply -f -
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: dkp-admin-mary
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: dkp-admin
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: User
  name: mary@example.com
EOF
```

If you inspect the role, you see what access is now granted:

```shell
$ kubectl describe clusterroles dkp-admin
Name:         dkp-admin
Labels:       app.kubernetes.io/instance=kommander
              app.kubernetes.io/managed-by=Helm
              app.kubernetes.io/version=v2.0.0
              helm.toolkit.fluxcd.io/name=kommander
              helm.toolkit.fluxcd.io/namespace=kommander
              rbac.authorization.k8s.io/aggregate-to-admin=true
Annotations:  meta.helm.sh/release-name: kommander
              meta.helm.sh/release-namespace: kommander
PolicyRule:
  Resources  Non-Resource URLs  Resource Names  Verbs
  ---------  -----------------  --------------  -----
             [/dkp/*]           []              [delete]
             [/dkp]             []              [delete]
             [/dkp/*]           []              [get]
             [/dkp]             []              [get]
             [/dkp/*]           []              [head]
             [/dkp]             []              [head]
             [/dkp/*]           []              [post]
             [/dkp]             []              [post]
             [/dkp/*]           []              [put]
             [/dkp]             []              [put]
```

The user can now use the HTTP verbs HEAD, GET, DELETE, POST, and PUT when accessing any URL at or under `/dkp`. Provided the downstream application follows REST conventions, this effectively allows read, edit, and delete privileges.

<p class="message--note"><strong>NOTE: </strong>To allow users to access the Kommander UI, ensure they have the appropriate <code>dkp-kommander-</code> role in addition to the Kommander roles granted in the Kommander UI. For more information, see the <a href="../">Access Control section of the Kommander documentation</a>.</p>

#### Group

In order to grant view access to the `/dkp/*` endpoints and edit access to the grafana logging endpoint to group `logging-ops`, create the following ClusterRoleBindings:

```shell
cat << EOF | kubectl apply -f -
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: dkp-view-logging-ops
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: dkp-view
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: Group
  name: oidc:logging-ops
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: dkp-logging-edit-logging-ops
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: dkp-logging-edit
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: Group
  name: oidc:logging-ops
EOF
```

**Note: external groups must be prefixed by `oidc:`**

Members of `logging-ops` are now able to `view` all resources under `/dkp` and edit all resources under `/dkp/logging/grafana`.

## Accessing the Kubernetes Dashboard

The Kubernetes dashboard offloads authorization directly to the Kubernetes API server. Once authenticated, all users may access the dashboard at `/dkp/kubernetes/` without needing a `dkp` role. However, access to the underlying kubernetes resources exposed by the dashboard are protected by the cluster RBAC policy.

## Further Reading

This page has provides some basic examples of operations which provide the building blocks of creating an access control policy. For more information about creating your own roles and advanced policies, we highly recommend reading the Kubernetes [RBAC documentation](https://kubernetes.io/docs/reference/access-authn-authz/rbac/).
