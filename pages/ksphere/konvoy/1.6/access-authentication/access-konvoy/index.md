---
layout: layout.pug
navigationTitle: Access Konvoy Locally
title: Access Konvoy Locally
menuWeight: 10
excerpt: Manage local users to access your Konvoy cluster
beta: true
enterprise: false
---

This section shows how to manage local users to access your Konvoy cluster. Local users are useful when there are no external identity providers or you want to test certain RBAC policies. The recommended way is to configure an external identity provider in your Konvoy cluster.

Your Konvoy cluster contains a [Dex](https://github.com/dexidp/dex) instance which can serve as a local identity provider. This procedure shows how to configure Dex with local users.

## Before you begin

- You must have created or have access to your `cluster.yaml` file.

## Create local users

1.  Modify `cluster.yaml` and configure the `dex` addon like the following

    ```yaml
    - name: dex
      enabled: true
      values: |
        config:
          staticPasswords:
          - email: user1
            hash: $2a$10$LEwSMOehwNmT1sLdeQ5LCuqEV81oViBRW.oEohcyF.KPHe/.enmVW
          - email: user2
            hash: $2a$10$oTvFTsdwHYuwGOS9VNMa6.gP60X8POdTzpBE63GRjbvU3i5QuQGOK
    ```

    Where, `email` is either a username or a valid email address.  `hash` is a bcrypt hash of the password. You can use the command line tool `htpasswd` to generate bcrypt passwords.

    ```bash
    htpasswd -bnBC 10 "" password | tr -d ':\n' && echo
    ```

1.  Save the `cluster.yaml` file and run the following command:

    ```bash
    konvoy up
    ```

    or alternatively

    ```bash
    konvoy deploy addons
    ```

You have created local users. These users do not have any permissions to access your Konvoy cluster. For access you have to assign them certain roles.

## Assign roles to local users

Konvoy uses Kubernetes Role Based Access Control (RBAC) to assign roles to local users. For more information, refer to the official Kubernetes [RBAC][rbac] documentation. The following procedure is an example of how to assign the `cluster-admin` role to a local user.

1.  Create the following `ClusterRoleBinding` resource:

    ```bash
    cat <<EOF | kubectl apply -f -
    apiVersion: rbac.authorization.k8s.io/v1
    kind: ClusterRoleBinding
    metadata:
      name: cluster-admin
    roleRef:
      apiGroup: rbac.authorization.k8s.io
      kind: ClusterRole
      name: cluster-admin
    subjects:
    - apiGroup: rbac.authorization.k8s.io
      kind: User
      name: user1
    EOF
    ```

    After assigning the above role to `user1` you can login to your Konvoy cluster using `user1` credentials.

## Modify local users

To change the password or username of a user, update that user information in the `cluster.yaml` file and execute `konvoy deploy addons`.

<p class="message--note"><strong>NOTE: </strong>If you change the <code>email</code> address of a user you must update the name of the user in the cluster role binding.</p>

## Delete local users

To delete local users, remove those users from the `cluster.yaml` file and execute `konvoy deploy addons`.

<p class="message--note"><strong>NOTE: </strong>Remember to delete all the role bindings that were assigned to those users.</p>

[rbac]: https://kubernetes.io/docs/reference/access-authn-authz/rbac
