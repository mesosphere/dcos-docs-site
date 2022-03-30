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

- A Konvoy cluster with [Kommander installed][kommander-install].
- An [Identity Provider][id-provider-git]. This tutorial uses GitHub's identity provider.
- A configured [group][groups] in Kommander.
- At least one user in that group.

## Access a cluster

If your group can access a cluster managed by Kommander, you can connect to that cluster from the Kommander landing page.

In this example, the Kommander cluster has two managed clusters on Azure but, as a user, you can only access the management cluster. In a different scenario, if you do have access to the other clusters, follow these steps to create a kubectl token for the desired attached or managed cluster.

1.  Go to the landing page provided by an administrator, and select **Generate Kubectl Token**.

    ![Konvoy Landing Page](/dkp/kommander/1.4/img/konvoy-landing-page.png)

1.  Select the cluster you want to log into.

    ![Generate Kubernetes Token](/dkp/kommander/1.4/img/generate-kubernetes-token.png)

1.  Login using an identity provider.

    ![Login Identity Provider](/dkp/kommander/1.4/img/login-identity-provider.png)

1.  Attach `kubectl` to the cluster using the instructions provided in the UI.

    ![Connection Instructions](/dkp/kommander/1.4/img/kubectl-connection-instructions.png)

Your local `kubectl` can now communicate with the cluster.
Depending on your rights, you can view and edit different api-resources.

## Switch from a cluster to another cluster

To log in to another cluster that is part of your Kommander infrastructure, use the [Access a cluster][access-cluster] procedure again for the other cluster.

Once `kubectl` is on this new cluster, you can switch between clusters using [contexts][k8s-contexts]. Open-source tools such as [`kubectx`][kubectx] can make this operation faster.

### Messages when attached to a cluster that you do not have access

The [Access a Cluster][access-cluster] instructions work for any clusters (management and attached ones) even if you do not have access to them.

The difference is that, once you have attached the cluster, none of the `kubectl` commands will succeed as the user does not have access:

```bash
kubectl get pods -A
```

```sh
Error from server (Forbidden): pods is forbidden: User "user@yourcompany.com" cannot list resource "pods" in API group "" at the cluster scope
```

### Downloading a kubeconfig from the UI

You can use the UI to download certain managed clusters' kubeconfigs.

If you are in the **Clusters** page from the **Global** workspace view, or the **Clusters** page from any workspace with clusters, you can click on the three button action menu from the card, and select **Download kubeconfig**.

   ![Kommander Cards View](/dkp/kommander/1.4/img/download-kubeconfig-clusters-page.png)

If you are in the detailed page for the specific cluster, you can click on the top right **Actions** dropdown menu, and select **Download kubeconfig**.

  ![Kommander cluster details View](/dkp/kommander/1.4/img/download-kubeconfig-details-page.png)

After it is downloaded, you can apply this kubeconfig to your `kubectl`.

If you select the **Download kubeconfig** from the UI and Kommander presents a modal that says the kubeconfig is not available for download, you must retrieve the Kubernetes credentials using the [Access a cluster instructions][access-cluster].

## Related information

- [Installing and configuring Kommander][kommander-install]
- [Identity Providers in Kommander][identity-provider]
- [Configuring a GitHub Identity Provider in Kommander][id-provider-git]
- [Granting access to Kubernetes resources in the CLI][rbac]
- [Access control in Kommander][access-control]
- [Kubernetes RBAC authorization][k8s-rbac]

[access-cluster]: #access-a-cluster
[access-control]: /dkp/kommander/1.4/operations/access-control/
[groups]: /dkp/kommander/1.4/operations/identity-providers/#groups
[id-provider-git]: /dkp/kommander/1.4/tutorials/authorize-all-users/
[identity-provider]: /dkp/kommander/1.4/operations/identity-providers/
[k8s-contexts]: https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/#context
[k8s-rbac]: https://kubernetes.io/docs/reference/access-authn-authz/rbac/
[kommander-install]: /dkp/kommander/1.4/install
[kubectx]: https://github.com/ahmetb/kubectx
[rbac]: /dkp/konvoy/1.8/access-authentication/install-rbac/
