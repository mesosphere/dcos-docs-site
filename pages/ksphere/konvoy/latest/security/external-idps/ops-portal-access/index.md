---
layout: layout.pug
navigationTitle: Granting Access to the Operations Portal
title: Granting Access to the Operations Portal
menuWeight: 10
excerpt: Add external users to the Operations Portal Whitelist
enterprise: false
---

## Allowing External Users Access to the Operations Portal

When a new cluster is created by Konvoy an operations user is generated with a random password. This user is added to the `whitelist` of the `traefik-foward-auth` service and is the only user which can access the Operations Portal. After [configuring an external identity provider](../../external-idps), you may want to allow external users access to the Operations Portal and Kubernetes dashboard. The default configuration for `traefik-forward-auth` addon must be updated to achieve this.

## Adding Individual Users

Users from external identity providers are identified by their email address. To add the users marry@example.com and bob@example.com, modify the addon configuration for `traefik-forward-auth` in the `cluster.yaml`

```yaml
- name: traefik-forward-auth
  enabled: true
  values: |
    traefikForwardAuth:  
      allowedUser:
        valueFrom:
          secretKeyRef: null
      whitelist:
        - marry@example.com
        - bob@example.com
        - operations_user
```

`operations_user` should be replaced by the operations user for your cluster. You can retrieve the username from a running cluster by running:

```shell
konvoy get ops-portal
```

If you would like to disable access for the default operations user, remove the user from the whitelist.

## Adding Users by Email Domain

It is possible to grant access to all users who belong to a common email domain. To allow access to the `foo.com` and `bar.net` domains modify the configuration to resemble:

```yaml
- name: traefik-forward-auth
  enabled: true
  values: |
    traefikForwardAuth:  
      allowedUser:
        valueFrom:
          secretKeyRef: null
      whitelist:
        - marry@example.com
        - bob@example.com
        - operations_user
      domain: foo.com,bar.net
```

This configuration will allow any user access to the Operations Portal who is a user in the `foo.com` or `bar.net` domains. The users Marry and Bob will retain access as well. Note that domain is a comma separated list without spaces between the entries.

## Security concerns

Any user or domain member in the whitelist has full access to the Operations Portal and any addon dashboard exposed through the ingress, such as the Kibana dashboard. Future versions of the Operations portal will support RBAC, allowing for granular control over access to exposed resources. The Kubernetes dashboard implements RBAC internally and is not affected by this issue, accessing the Kubernetes dashboard with external users is documented in the next section.

## Accessing the Kubernetes Dashboard

The Kubernetes dashboard is protected by the cluster Role-based Access Control (RBAC) policy. Users which are authenticated by external identity providers will not have any privileges when accessing the dashboard. Privileges must be granted explicitly by interacting with the RBAC API. This section will provide some basic examples for general usage. Full documentation for the RBAC API can be found in the [Kubernetes documentation](https://kubernetes.io/docs/reference/access-authn-authz/rbac/).

To make the user `marry@example.com` a cluster administrator, we will need to bind her username to the `cluster-admin` role:

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

To make the user `bob@example.com` a reader of the `baz` namespace, bind the user to the `view` role:

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

If your external identity provider supports group claims, it is possible to bind groups to roles as well. To make the `devops` LDAP group an administrators of the `production` namespace bind the group to the `admin` role:

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

For information about creating more advanced policies, see the [Kubernetes documentation](https://kubernetes.io/docs/reference/access-authn-authz/rbac/).
