---
layout: layout.pug
navigationTitle: Installation
title: Dispatch Installation on Konvoy
menuWeight: 40
beta: false
excerpt: Install and Configure Dispatch
---
<p class="message--warning"><strong>WARNING: </strong>D2iQ Dispatch has been deprecated in favor of Flux. See the <a href="https://d2iq.com/blog/goodbye-dispatch-hello-fluxcd">D2iQ blog post</a> for more information.</p>

# Prerequisites

Before you install Dispatch, be sure you have completed the [Prerequisites](../install/prerequisites/).

# Installing Dispatch into a D2iQ Konvoy Cluster

The easiest way to install Dispatch is on [Konvoy](https://d2iq.com/solutions/dkp/konvoy).

* Configure kubectl to point to the correct Kubernetes cluster.
* Install the [Dispatch CLI](../install/cli/).

1. In your existing `cluster.yaml`, set the Dispatch addon field `enabled` to `true`:

    ```yaml
    apiVersion: konvoy.mesosphere.io/v1beta1
    kind: ClusterConfiguration
    spec:
      addons:
      - configRepository: https://github.com/mesosphere/kubeaddons-dispatch
        configVersion: stable-1.19-1.4.1
        addonsList:
        - name: dispatch
          enabled: true
    ```

2. If this is a CD-only deployment, set `ci.enabled` to false:

    ```yaml
    apiVersion: konvoy.mesosphere.io/v1beta1
    kind: ClusterConfiguration
    spec:
      addons:
      - configRepository: https://github.com/mesosphere/kubeaddons-dispatch
        configVersion: stable-1.19-1.4.1
        addonsList:
        - name: dispatch
          enabled: true
          values: |
            ci:
              enabled: false
    ```

3. Install Dispatch into the cluster.

    ```bash
    konvoy up
    ```

4. Verify that the Dispatch components are set up correctly.

    ```bash
    helm test dispatch-kubeaddons
    ```

## Configuring the Dispatch Installation

Dispatch installation can be customized by setting various options via `values.yaml` if using `dispatch init` command or via `values` field in Dispatch Addon configuration.

| Field | Type | Default value | Description |
| ----- | ---- | ------------- | ----------- |
| `dispatch.dashboardMode`   | String (one of `dispatch` or `tekton`) | `dispatch` | Specify the default dashboard to link the PipelineRun Details link(s) on SCM page |

# Next steps

At this point, you've successfully installed Dispatch. Next, you can add a new application to Dispatch CI. To do so, follow the steps
at [Setting up a repository to use Dispatch](../tutorials/ci_tutorials/repo-setup/).

Additionally, your installation of Dispatch may require customization of [MinIO](configure-minio/) to meet the requirements.
