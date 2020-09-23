---
layout: layout.pug
navigationTitle:  Installation
title: Dispatch Installation on Konvoy
menuWeight: 40
beta: false
excerpt: Install and Configure Dispatch
---
# Prerequisites

Before you install Dispatch, be sure you have completed the [Prerequisites](../install/prerequisites/).

[button color="purple" href="https://support.d2iq.com/s/entitlement-based-product-downloads"]Download Dispatch [/button]

# Installing Dispatch into a D2iQ Konvoy Cluster

The easiest way to install Dispatch is on [Konvoy](https://d2iq.com/solutions/ksphere/konvoy).

* Configure kubectl to point to the correct Kubernetes cluster.
* Install the [Dispatch CLI](../install/cli/).

1. In your existing `cluster.yaml`, set the Dispatch addon field `enabled` to `true`:

    ```yaml
    apiVersion: konvoy.mesosphere.io/v1beta1
    kind: ClusterConfiguration
    spec:
      addons:
      - configRepository: https://github.com/mesosphere/kubeaddons-dispatch
        configVersion: stable-1.16-1.2.0
        addonsList:
        - name: dispatch
          enabled: true
    ```

2. Install Dispatch into the cluster.

    ```bash
    konvoy up
    ```

3. Verify that the Dispatch components are set up correctly.

    ```bash
    helm test dispatch-kubeaddons
    ```

# Next steps

At this point, you've successfully installed Dispatch. Next, you can add a new application to Dispatch CI. To do so, follow the steps
at [Setting up a repository to use Dispatch](../tutorials/ci_tutorials/repo-setup/).

Additionally, your installation of Dispatch may require customization of [ArgoCD](configure-argocd/) or [MinIO](configure-minio/) to meet the requirements.