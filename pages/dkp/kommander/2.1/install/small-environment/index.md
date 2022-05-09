---
layout: layout.pug
navigationTitle: Install on small environment
title: Install Kommander on a small environment
menuWeight: 40
excerpt: Install Kommander on a small environment
beta: false
enterprise: false
---

You can install Kommander on a small environment with smaller memory, storage, and CPU requirements for testing and demo purposes. This topic describes methods for installing Kommander in these environments. Refer to the [Kommander documentation][2.1] for more information.

You can install this minimal setup on networked and air-gapped environments, regardless of the license type (Essential or Enterprise).

## Prerequisites

Ensure you have done the following:

- You have acquired a DKP license.
- You have installed Konvoy.
- You have reviewed the prerequisite section pertaining to your [air-gapped][airgap], or [networked][networked] environment.

## Minimal Kommander installation

The `yaml` file that is used to install a minimal configuration of Kommander contains the bare minimum setup that allows you to deploy applications, access the DKP UI, create and attach clusters. It does **NOT** include applications for cost monitoring, logging, alerting, object storage, etc.

In this `yaml` file you can find commented lines, that correspond to all platform applications which would be included in a normal Kommander setup. Since these lines are commented, they are not taken into account during installation. If you want to test an additional platform application, you can enable it individually to be installed by uncommenting the corresponding line in the `yaml` file.

<p class="message--important"><strong>IMPORTANT: </strong>Some applications depend on other applications to work properly. Refer to the <a href="../../workspaces/applications/platform-applications/platform-application-dependencies/">dependencies documentation</a> to find out which other applications you need to enable to test the target application.</p>

For example, if you want to test Grafana to allow monitoring, remove the pound sign preceding `grafana-logging: null`. Since Grafana depends on Loki, you also have to remove the pound preceding `grafana-loki: null` and `minio-operator: null`. Note that depending on the size of the Kubernetes cluster, enabling several platform applications could exhaust your cluster’s resources.

1.  Edit your `cluster.yaml` file to match the following example:

    ```yaml
    apiVersion: config.kommander.mesosphere.io/v1alpha1
    kind: Installation
    apps:
    #centralized-grafana: null
    #centralized-kubecost: null
    dex: null
    dex-k8s-authenticator: null
    #fluent-bit: null
    #gatekeeper: null
    #grafana-logging: null
    #grafana-loki: null
    #karma: null
    #karma-traefik: null
    kommander: null
    #kube-prometheus-stack: null
    #kubecost: null
    #kubecost-thanos-traefik: null
    kubefed: null
    #kubernetes-dashboard: null
    #kubetunnel: null
     #kube-oidc-proxy was not included in the generated --init
    kube-oidc-proxy: null
    #logging-operator: null
    #minio-operator: null
    #metallb:
        #values: |
        #configInline:
            #address-pools:
            #- name: default
            #protocol: layer2
            #addresses:
            #- 192.168.251.1-192.168.251.254
    #prometheus-adapter: null
    #prometheus-thanos-traefik: null
    reloader: null
    #thanos: null
    traefik: null
    traefik-forward-auth-mgmt: null
    #velero: null
    ageEncryptionSecretName: sops-age
    clusterHostname: ""
    appManagementImageTag: v2.1.1
    appManagementImageRepository: mesosphere/kommander2-appmanagement
    kommanderChartsVersion: v2.1.1
    ```

1.  Create your Kommander cluster using the following command:

    ```bash
    kommander install --init > install.yaml --kubeconfig=<cluster-kubeconfig>
    ```

    <p class="message--note"><strong>NOTE: </strong>An alternative to using the <code>--kubeconfig=&lt;cluster-config&gt;</code> flag is to initialize the KUBECONFIG environment variable. You can do this by running <code>export KUBECONFIG=&lt;cluster-config&gt;</code>. Setting your KUBECONFIG (either by flag or by environment variable) ensures that Kommander is installed on the workload cluster.</p>

[2.1]: ../../release-notes
[airgap]: ../air-gapped#prerequisites
[networked]: ../networked#prerequisites
