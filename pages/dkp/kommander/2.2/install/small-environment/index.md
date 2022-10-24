---
layout: layout.pug
navigationTitle: Install on small environment
title: Install Kommander on a small environment
menuWeight: 40
excerpt: Install Kommander on a small environment
beta: false
enterprise: false
---

You can install Kommander on a small environment with smaller memory, storage, and CPU requirements for testing and demo purposes. This topic describes methods for installing Kommander in these environments. Refer to the [Kommander documentation][2.2] for more information.

You can install this minimal setup on networked and air-gapped environments, regardless of the license type (Essential or Enterprise).

<p class="message--important"><strong>Enterprise considerations: </strong>D2iQ recommends performing testing and demo tasks in a single-cluster environment. The Enterprise license is designed for multi-cluster environments and fleet management, which require a minimum amount of resources. Applying an Enterprise license key to the previous installation adds modifications to your environment that can exhaust a small environment’s resources.</p>

## Prerequisites

Ensure you have done the following:

- You have acquired a DKP license.
- You have installed Konvoy.
- You have reviewed the prerequisite section pertaining to your [air-gapped][airgap], or [networked][networked] environment.

## Minimal Kommander installation

The YAML file that is used to install a minimal configuration of Kommander contains the bare minimum setup that allows you to deploy applications, and access the DKP UI. It does **NOT** include applications for cost monitoring, logging, alerting, object storage, etc.

In this YAML file you can find the lines that correspond to all platform applications which would be included in a normal Kommander setup. Applications that have `enabled` set to `false` are not taken into account during installation. If you want to test an additional application, you can enable it individually to be installed by setting `enabled` to `true` on the corresponding line in the YAML file.

For example, if you want to enable the logging stack, set `enabled` to `true` for `grafana-logging`, `grafana-loki`, `logging-operator` and `minio-operator`. Note that depending on the size of your cluster, enabling several platform applications could exhaust your cluster’s resources.

<p class="message--important"><strong>IMPORTANT: </strong>Some applications depend on other applications to work properly. Refer to the <a href="../../workspaces/applications/platform-applications/platform-application-dependencies/">dependencies documentation</a> to find out which other applications you need to enable to test the target application.</p>

1.  Initialize your Kommander installation and name it `kommander_minimal.yaml`:

    ```bash
    dkp install kommander --init --kubeconfig=<cluster-kubeconfig>.conf -oyaml > kommander_minimal.yaml
    ```

1.  Edit your `kommander_minimal.yaml` file to match the following example:

    ```yaml
    apiVersion: config.kommander.mesosphere.io/v1alpha1
    kind: Installation
    apps:
      dex:
        enabled: true
      dex-k8s-authenticator:
        enabled: true
      dkp-insights-management:
        enabled: false
      fluent-bit:
        enabled: true
      gatekeeper:
        enabled: true
      gitea:
        enabled: true
      grafana-logging:
        enabled: false
      grafana-loki:
        enabled: false
      kommander:
        enabled: true
      kube-prometheus-stack:
        enabled: false
      kubefed:
        enabled: true
      kubernetes-dashboard:
       enabled: false
      kubetunnel:
        enabled: false
      logging-operator:
       enabled: false
      minio-operator:
        enabled: false
      prometheus-adapter:
        enabled: false
      reloader:
        enabled: true
      traefik:
        enabled: true
      traefik-forward-auth-mgmt:
        enabled: true
      velero:
        enabled: false
    ageEncryptionSecretName: sops-age
    clusterHostname: ""
    ```

1.  Install Kommander on your cluster with the following command:

    ```bash
    dkp install kommander --installer-config ./kommander_minimal.yaml --kubeconfig=<cluster-kubeconfig>.conf
    ```

    <p class="message--note"><strong>NOTE: </strong>An alternative to using the <code>--kubeconfig=&lt;cluster-config&gt;.conf</code> flag is to initialize the KUBECONFIG environment variable. You can do this by running <code>export KUBECONFIG=&lt;cluster-config&gt;.conf</code>. Setting your KUBECONFIG (either by flag or by environment variable) ensures that Kommander is installed on the workload cluster.</p>

[2.2]: ../../introduction
[airgap]: ../air-gapped#prerequisites
[networked]: ../networked#prerequisites
