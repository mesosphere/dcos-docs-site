---
layout: layout.pug
beta: false
navigationTitle: Log in a specific cluster
title: Log in a specific cluster
menuWeight: 1
excerpt: Access a specific cluster as a user
---

## Before you begin

This procedure requires the following configurations and background:

- A Konvoy cluster with [Kommander installed](/dkp/kommander/1.2/install/).
- An [Identity Provider](/dkp/kommander/1.2/tutorials/authorize-all-users/). This tutorial uses GitHub's identity provider.
- A configured [group](/dkp/kommander/1.2/operations/identity-providers/) in Kommander.
- At least one user in that group.

## Access a cluster

If your group can access a cluster managed by Kommander, you can connect to that cluster from the Kommander landing page.

In this example, the Kommander cluster has two managed clusters on Azure but, as a user, you can only access the management cluster.

1. Go to the landing page, provided by an administrator, and select **Generate kubectl Token**.

![Konvoy Landing Page](/dkp/kommander/1.2/img/konvoy-landing-page.png)

2. Select the cluster you want to log into.

![Generate Kubernetes Token](/dkp/kommander/1.2/img/generate-kubernetes-token.png)

3. As a user having access to the management cluster, select the `Main` cluster and log in using an identity provider.

![Login Identity Provider](/dkp/kommander/1.2/img/login-identity-provider.png)

4. Attach `kubectl` to the cluster using the interface instructions.

![Connection Instructions](/dkp/kommander/1.2/img/kubectl-connection-instructions.png)

Your local `kubectl` can now communicate with the cluster.
Depending on your rights, you can view and edit different api-resources.

## Switch from a cluster to another cluster

To log in to another cluster that is part of your Kommander infrastructure, use the [Access a cluster](*access-a-cluster) procedure again for the other cluster.

Once `kubectl` is on this new cluster, you can switch between clusters using [contexts](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/#context). Open-source tools such as [`kubectx`](https://github.com/ahmetb/kubectx) can make this operation faster.

### Messages when attached to a cluster that you do not have access

The [Access a Cluster](#access_a_cluster) instructions work for any clusters (management and attached ones) even if you do not have access to them.

The difference is that, once you have attached the cluster, none of the `kubectl` commands will succeed as the user does not have access:

```
$ kubectl get pods -A
Error from server (Forbidden): pods is forbidden: User "user@yourcompany.com" cannot list resource "pods" in API group "" at the cluster scope
```

## Related information

- [Installing and configuring Kommander](/dkp/kommander/1.2/install/)
- [Identity Providers in Kommander](/dkp/kommander/1.2/operations/identity-providers/)
- [Configuring a GitHub Identity Provider in Kommander](/dkp/kommander/1.2/tutorials/authorize-all-users/)
- [Granting access to Kubernetes resources in the CLI](/dkp/konvoy/1.4/security/external-idps/rbac/)
- [Access control in Kommander](/dkp/kommander/1.2/operations/access-control/)
- [Kubernetes RBAC authorization](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)
