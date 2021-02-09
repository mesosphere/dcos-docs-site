---
layout: layout.pug
navigationTitle: Setting up local users
title: Setting up local users
menuWeight: 10
excerpt: Manage local users to access your konvoy cluster
beta: false
enterprise: false
---

This section shows how to manage local users to access your Konvoy cluster.
Local users are useful when there are no external identity providers or
you want to quickly test certain RBAC policies. The recommended way is still to
configure an external identity provider in your Konvoy cluster.

Your Konvoy cluster contains a [Dex](https://github.com/dexidp/dex) instance
which can serve as a local identity provider. This procedure shows how to configure Dex with local
users.

## Before you begin

- You must have created or have access to your `cluster.yaml` file.

## Create local users

Modify `cluster.yaml` and configure the `dex` addon like the following

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

Where,
`email` can either be a username or a valid email address.
`hash` is a bcrypt hash of the password. You could use command line tool
`htpasswd` to generate bcrypt password.

```bash
htpasswd -bnBC 10 "" password | tr -d ':\n' && echo
```

Save the `cluster.yaml` file and run the following command:

```bash
konvoy up
```

or alternatively

```bash
konvoy deploy addons
```

 You have successfully created local users. However, these users do not have any permissions to access your Konvoy cluster. For that, you will have to assign them certain roles.

## Assign roles to local users

We use Kubernetes RBAC to assign roles to local users. For more information, please refer to the official Kubernetes [RBAC][rbac] documentation. Below is an example of how to assign the `cluster-admin` role to a local user.

Create the following `ClusterRoleBinding` resource:

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

To change the password or username of a user, update that user in `cluster.yaml` and execute `konvoy deploy addons`.

If you change the `email` address of a user you also have to update the name of the user in the cluster role binding.

## Delete local users

To delete local users, remove those users from the `cluster.yaml` file and execute `konvoy deploy addons`. Remember to delete all the role bindings that were also assigned to those users.

[rbac]: https://kubernetes.io/docs/reference/access-authn-authz/rbac
