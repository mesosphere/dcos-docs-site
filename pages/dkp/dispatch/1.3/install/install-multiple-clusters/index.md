---
layout: layout.pug
navigationTitle:  Install Dispatch on Multiple Clusters
title: Install Dispatch on Multiple Clusters
menuWeight: 35
beta: false
excerpt: Installing Dispatch on Multiple Clusters
---
# Install Dispatch into Multiple Clusters

This procedure should be followed if you are choosing to install Dispatch on multiple clusters at the same time.

You must configure access to the individual Kubernetes cluster onto which you want to install Dispatch.

You then must configure access to multiple Kubernetes clusters. See the [Kubernetes documentation](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/).

You must set up a &#x3c;kubernetes context&#x3e; before executing the `use-context` command; &#x3c;kubernetes context&#x3e; defines the Kubernetes API server to connect to the user to use to authenticate, and the namespace which the user can access by default.

You must run

```bash
kubectl config use-context <kubernetes context>
```
before you run `dispatch init`.
