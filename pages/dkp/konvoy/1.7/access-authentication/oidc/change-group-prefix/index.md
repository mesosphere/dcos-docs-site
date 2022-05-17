---
layout: layout.pug
navigationTitle: Change the Group Prefix
title: Change the Group Prefix
menuWeight: 30
excerpt: Access and change the OIDC Group Prefix
beta: false
enterprise: false
---

By default, kube-oidc-proxy prefixes `oidc:` to all group names returned for the user. For example, if the Identity Provider reports that the user belongs to the group `accounting` , then Dex changes this to `odic:accounting`.

When you refer to a group in RBAC RoleBindings and ClusterRoleBindings, you need to use the prefixed name.

If the default prefix does not work for you, change it by following these steps:

1.  Open `cluster.yaml`.
1.  Add the following under the `kube-oidc-proxy` addon configuration. Substitute `<group-prefix>` with the name you want to use as the group prefix.

    ```yaml
    - name: kube-oidc-proxy
    enabled: true
    values: |
        oidc:
        groupsPrefix: <group-prefix>
    ```

1.  Run `konvoy deploy addons`, or `konvoy up`, if you have not deployed the cluster.
1.  If you ran `konvoy deploy addons`, restart the `kube-oidc-proxy` pod to load the updated config.

    ```bash
    kubectl delete pods --namespace kubeaddons --selector=app.kubernetes.io/name=kube-oidc-proxy
    ```
