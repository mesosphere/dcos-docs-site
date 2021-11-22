---
layout: layout.pug
beta: false
navigationTitle: Troubleshooting
title: Troubleshooting
menuWeight: 40
excerpt: Troubleshooting for Continuous Deployments
---

- Events related to federation are stored in respective `FederatedGitRepository`, `FederatedKustomization`, or both resources.
- View the events and logs for `deployments/Kommander-repository-controller` in Kommander namespace, if there are any unexpected errors.
- Enabling the Kommander repository controller for your project namespace causes a number of [related Flux controller components](https://toolkit.fluxcd.io/components/) to deploy into the namespace. These are necessary for the proper operation of the repository controller and should not be removed.
- Ensure your Gitops repository doesn't contain any manifests that are cluster-scoped - for example, `Namespace`, `ClusterRole`, `ClusterRoleBinding`, and so on. All of the manifests must be namespace-scoped.
- Ensure your Gitops repository does not contain any `HelmRelease` and `Kustomization` resources that are targeting a different namespace than the project namespace.
