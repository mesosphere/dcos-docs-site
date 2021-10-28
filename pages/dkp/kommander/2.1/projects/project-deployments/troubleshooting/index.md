---
layout: layout.pug
beta: true
navigationTitle: Troubleshooting
title: Troubleshooting
menuWeight: 40
excerpt: Troubleshooting for Continuous Deployments
---

- Events related to federation are stored in respective `FederatedGitRepository` and or `FederatedKustomization` resources.
- View the events and or logs for `deployments/Kommander-repository-controller` in Kommander namespace in case there are any unexpected errors.
- Enabling the Kommander repository controller for your project namespace will cause a number of [related Flux controller components](https://toolkit.fluxcd.io/components/) to be deployed into the namespace. These are necessary for the proper operation of the repository controller and should not be removed.
