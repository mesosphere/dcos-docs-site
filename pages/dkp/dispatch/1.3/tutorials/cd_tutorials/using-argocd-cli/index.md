---
layout: layout.pug
title: Configure the ArgoCD CLI with Dispatch
navigationTitle: Configure the ArgoCD CLI with Dispatch
beta: false
menuWeight: 105
excerpt: This tutorial describes how to use the ArgoCD CLI to operate the instance of ArgoCD that is bundled with Dispatch.
---

# Using the ArgoCD CLI with Dispatch

The Dispatch CLI has a `dispatch gitops [...]` sub-command that wraps some functions of the upstream ArgoCD CLI. Advanced users may want to use the ArgoCD CLI directly to administer the ArgoCD instance that is installed with Dispatch.

## Authentication

### Ingress controller

By default, Dispatch disables ArgoCD's built-in authentication and authorization. Instead, Dispatch relies on the Ingress controller to authenticate requests to ArgoCD (at the `/dispatch/argo-cd` URL path.) When Dispatch is installed on Konvoy, the default behaviour is for the Ingress controller to require the client to be logged in to view the ArgoCD UI or use the ArgoCD CLI.

As the ArgoCD CLI has no notion of the Ingress controller's authentication mechanism, users must specify the `--port-forward-namespace=dispatch` flag whenever they execute an ArgoCD CLI command. If this flag is specified, the ArgoCD CLI sets up a [port-forward to the `argocd-server` pod](https://kubernetes.io/docs/tasks/access-application-cluster/port-forward-access-application-cluster/) that runs in the `dispatch` namespace. The ArgoCD CLI then performs its request via the forwarded connection, bypassing any authentication challenge that the Ingress controller would normally perform.

As the request is forwarded directly to the pod, the connection must occur in plaintext (by specifying `--plaintext`). This is secure as the HTTP request is performed over the secure tunnel set up by the port-forward.

In order to use port forwarding, the kubectl context must point to the cluster in which Dispatch is installed, and the user must have the `pods/port-forward` permission.

The following example lists ArgoCD applications.

```bash
# List applications
argocd --port-forward-namespace=dispatch --plaintext app list
```

### ArgoCD Single Sign-On

As part of the Dispatch installation the administrator can [enable Single Sign-On for ArgoCD](../../../install/configure-argocd/index.md#single-sign-on-sso) and rely on ArgoCD to perform its own user authentication and authorization. In that case, the Ingress controller does not authenticate requests to ArgoCD. Instead, ArgoCD performs its own authentication and authorization using Single Sign-On.

In this case, there is no need to port-forward as the ArgoCD server is directly accessible. Instead, the `--server=<cluster-hostname>` option must be set to the fully qualified domain name where Dispatch is installed. In addition, the `--grpc-web-root-path=/dispatch/argo-cd` option must be specified, where `/dispatch/argo-cd` is the absolute URL path to the ArgoCD server.

Since ArgoCD RBAC is enabled, the first step is to perform a `argocd login` command using the ArgoCD CLI:

```bash
argocd --server=infra.example.com --grpc-web-root-path=/dispatch/argo-cd login infra.example.com
```

You will be prompted for username / password credentials. If you are the administrator, you can use `admin` for the username and the ArgoCD admin user's password as the password. By default, the admin user's password is equal to the name of the `argocd-server` pod. It can be modified at install time through helm configuration, or manually after installation.

If, instead, you want to log in via the cluster's OpenID Connect Identity Provider, set the `--sso` flag as follows:

```bash
argocd --server=infra.example.com --grpc-web-root-path=/dispatch/argo-cd login infra.example.com --sso
```

This will open your web browser and prompt you to log in through the OIDC Provider configured for your Konvoy cluster.

The login command saves the authentication token and server details to the `$HOME/.argocd/config` file. It will be reused for subsequent commands.

View the currently active ArgoCD context as follows:

```bash
argocd context
```

The following example output shows two context entries. The user has performed the `argocd login` command twice: once to add the `infra.example.com` server, and once to add `test.example.com`. The `infra.example.com` context is currently active.

```
CURRENT  NAME               SERVER
         test.example.com   test.example.com
*        infra.example.com  infra.example.com
```

The ArgoCD CLI can now be used as follows:

```bash
argocd app list
```
