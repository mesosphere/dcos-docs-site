---
layout: layout.pug
navigationTitle:  Release Notes for Kaptain 1.2.0
title: Release Notes for Kaptain 1.2.0
menuWeight: 5
beta: false
excerpt: View release-specific information for Kaptain
---

# Release Notes

## 1.2.0 - Released 16 August 2021

This document describes the new features, caveats, and resolved issues in D2iQ Kaptain.

### New features
* New Kaptain Dashboard for ML workload monitoring
* Automatic installation of Grafana dashboards for Kaptain monitoring
* Added Tensorboard Controller for easy deployment of Tensorboards
* Added Volume Manager to simplify volumes creation and deletion from the UI
* New Kaptain SDK 0.3.0:
  * New `Resources` API for fine-grained resource specification
  * Explicit feedback in case a workload is unschedulable because of insufficient resources
  * New `Model.build()` API for building custom Docker images
  * Content-based conditional image builds to speedup the model development
  * Canary model deployments
  * Configurable SDK logging to suppress debug-level messages by default
  * Improved feedback on failed workload scheduling
  * Auto-generated API documentation

### Improvements
* Konvoy 1.8.2 support
* Kubernetes 1.21 support

### Software updates
* Kubeflow 1.3.0
* Argo Workflows 2.12.9
* Katib 0.11.0
* KFServing 0.5.1
* Kubeflow Pipelines 1.5.0
* KNative Serving 0.18.3
* JupyterLab 3.0.16

### Limitations
* When running on Konvoy 1.8.2 with GPU, the default base addons version `stable-1.20-4.1.0` doesn't report GPU
metrics to Prometheus, and thus the Kaptain Dashboard is unable to display them. Consider using a newer version of the base
addons, or the previous version: `stable-1.20-4.0.0` in your Konvoy `cluster.yaml`:
  ```
  addons:
    - configRepository: https://github.com/mesosphere/kubernetes-base-addons
      configVersion: stable-1.20-4.0.0
  ```

### Breaking changes
* Automatic Profile creation on the first login is disabled by default for security purposes.
Consult the documentation on [onboarding new users][onboarding-new-users] for details.

[onboarding-new-users]: ../../user-management#onboarding-new-users
