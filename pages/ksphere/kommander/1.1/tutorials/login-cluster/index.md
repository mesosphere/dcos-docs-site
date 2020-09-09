---
layout: layout.pug
navigationTitle: Log in a specific cluster
title: Log in a specific cluster
menuWeight: 1
excerpt: Access a specific cluster as a user
---

## Before you begin

This procedure requires the following configurations and background:

- A Konvoy cluster with [Kommander installed](https://docs.d2iq.com/ksphere/kommander/1.1/install/).
- An [Identity Provider](https://docs.d2iq.com/ksphere/kommander/1.1/tutorials/authorize-all-users/) (this tutorial uses GitHub's identity provider).
- A configured [group](https://docs.d2iq.com/ksphere/kommander/1.1/operations/identity-providers/) in Kommander.
- At least one user in that group.

## Access a cluster

If you are a user of a group that has access to a cluster managed by Kommander, you can use the landing page of the Kommander cluster to connect to it.

In this example, the Kommander cluster has two managed clusters on Azure but, as a user, I can only access the management cluster.

First, access the landing page provided by an administrator and select "Generate kubectl Token":

![Konvoy Landing Page](/ksphere/kommander/1.1/img/konvoy-landing-page.png)

You will then have to choose the cluster you wish to log in to:

![Generate Kubernetes Token](/ksphere/kommander/1.1/img/generate-kubernetes-token.png)

As a user having access to the management cluster, select the `Main` cluster and then log in using the identity provider available (GitHub):

![Login GitHub](/ksphere/kommander/1.1/img/login-identity-provider.png)

The user interface provides instructions to attach `kubectl` to the cluster:

![Connection Instructions](/ksphere/kommander/1.1/img/kubectl-connection-instructions.png)

Once you will have followed these instructions, your local `kubectl` will be able to communicate with the cluster.
Depending on your rights, you will be able to view and edit different kind of api-resources.

## Switch from a cluster to another

If you wish to login to another cluster that is part of your Kommander infrastructure, you will have to follow the steps described above with another cluster.

Once `kubectl` is attached to this new cluster, you can switch between clusters using [contexts](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/#context). Open-source tools such as [`kubectx`](https://github.com/ahmetb/kubectx) are available to make this operation faster.

### Messages when attached to a cluster that you do not have access to

The instructions described above actually work for any clusters (management and attached ones) even if you do not have access to it.

The difference will be that, once you have attached the cluster, none of the `kubectl` commands will succeed as the user does not have access:

```
$ kubectl get pods -A
Error from server (Forbidden): pods is forbidden: User "user@yourcompany.com" cannot list resource "pods" in API group "" at the cluster scope
```

## Related information

- [Installing and configuring Kommander](https://docs.d2iq.com/ksphere/kommander/1.1/install/)
- [Identity Providers in Kommander](https://docs.d2iq.com/ksphere/kommander/1.1/operations/identity-providers/)
- [Configuring a GitHub Identity Provider in Kommander](https://docs.d2iq.com/ksphere/kommander/1.1/tutorials/authorize-all-users/)
- [Granting access to Kubernetes resources in the CLI](https://docs.d2iq.com/ksphere/konvoy/1.4/security/external-idps/rbac/)
- [Access control in Kommander](https://docs.d2iq.com/ksphere/kommander/1.1/operations/access-control/)
- [Kubernetes RBAC authorization](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)
