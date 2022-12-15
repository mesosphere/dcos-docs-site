---
layout: layout.pug
navigationTitle: Insights Setup and Configuration
title: Insights Setup and Configuration
excerpt: Enable DKP Insights Engine
menuWeight: 20
beta: false
enterprise: false
techPreview: true
---

DKP Insights Management installs by default on your Management Cluster, when you install or upgrade to DKP 2.2 and higher.

To receive insight items on the Insights Dashboard, enable the DKP Insights Engine manually on each Managed or Attached or cluster.

## Enable the DKP Insights Engine

1.  Add DKP Insights Engine Addon by applying the following YAML from the CLI:

    ```yaml
    kubectl apply -f - <<EOF
    apiVersion: source.toolkit.fluxcd.io/v1beta1
    kind: GitRepository
    metadata:
      name: insights-catalog-applications
      namespace: kommander
      labels:
        kommander.d2iq.io/gitapps-gitrepository-type: dkp
        kommander.d2iq.io/workspace-default-catalog-repository: "true"
    spec:
      interval: 1m0s
      ref:
        branch: main
      timeout: 20s
      url: https://github.com/mesosphere/insights-catalog-applications
    EOF
    ```

    This grants all Attached clusters the ability to enable the Insights Engine, and to display DKP Insights under Applications.

1.  Enable the DKP Insights Engine on each Attached cluster from the DKP UI by selecting: **Applications** from within the relevant workspace, then select **Enable** from the vertical 3-dot menu in the bottom right of the Insights application tile.

   **Note**: The option for *Enable Another Instance* is not suggested as it is not supported in this technical preview release.

## Disable DKP Insights Management


The DKP Insights Management component can be disabled using the instructions for [configuring a Kommander installation.](../../install/configuration/)

1.  Initialize a default configuration file:

    ```
    dkp install kommander --init > kommander.yaml
    ```

1.  Set `enabled` to `false` to disable `dkp-insights-management`:
    
    ```
    apiVersion: config.kommander.mesosphere.io/v1alpha1
    kind: Installation
    apps:
      dkp-insights-management:
        enabled: false
    ```

1.  Install Kommander using the updated configuration file:

    ```
    dkp install kommander --installer-config kommander.yaml
    ```
