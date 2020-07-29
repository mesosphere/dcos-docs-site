---
layout: layout.pug
navigationTitle: Setting up local users
title: Setting up local users
menuWeight: 10
excerpt: Manage local users to access your konvoy cluster
enterprise: false
---

In this section, we will walk you through how to manage local users
to access your Konvoy cluster. Local user might come in handy when 
there are no external identity provider or you want to quickly test
certain rbac policies. The recommended way would still be to 
configure an external identity provider in your Konoy cluster.

Your Konvoy cluster contains a [Dex](https://github.com/dexidp/dex) instance 
which can server as a local identity provider. We will configure Dex with local
users.

## Prerequisites

- We assume that you have already created or have access to `cluster.yaml` file. 

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
`email` can either be a username or a valid email address
`hash` is bcrypt hash of the password. There are many online tools that can give you a valid [bcrypt hash][bcrypt] of a string. 

Then, save the `cluster.yaml` and run the following command.

```bash
konvoy up or konvoy deploy addons
```

Following the above steps, we have successfully created local users. However, these users do not have any permissions to access your Konvoy cluster. For that we will have to bind them with certain roles.

## Assign roles to local users

We will use Kubernetes [rbac][rbac] to assign roles to local users. Discussing full RBAC is out of scope of this document. Please refer to Kubernetes [rbac][rbac] for more details. Below is an example of how to assign `cluster-admin` role to a local user

Create following cluster role binding resource

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

After assigning the above role to `user1` you can login to your Konvoy cluster using `user1` credentials

## Modify local users

If you want to change the password or username of a user then you could just update that user in `cluster.yaml` and execute `konvoy deploy addons`. 

If you are changing the `email` address of a user then you will also have to update the name of the user in the cluster role binding

## Delete local users

In order to delete local users, you can just remove those users from the `cluster.yaml` file and execute `konvoy deploy addons`. Additionally, remember to delete all the roles that were assigned to those users.

[bcrypt]: https://www.browserling.com/tools/bcrypt
[rbac]: https://kubernetes.io/docs/reference/access-authn-authz/rbac
