---
layout: layout.pug
navigationTitle: Install on-premises
title: Install Kaptain on an on-premises cluster
menuWeight: 9
excerpt: Install Kaptain on an on-premises cluster
beta: false
enterprise: false
---

## On-Premise Installation

Kaptain natively supports the installation on an on-premise cluster. Before installing Kaptain, please follow the [Konvoy On-Premises Installation Guide][konvoy-on-prem] or [Kommander Installation Guide in a networked environment][dkp-install] to set up the on-prem cluster. The cluster admin is responsible for configuring the cluster correctly and ensuring the requisite cluster-level applications are enabled.

Please note that the IP address of the Kaptain UI will come from the IP address range that is configured in the [MetalLB load balancer][metallb-load-balancer].

The steps to install Kaptain on an on-premises cluster are as follows:

* Follow the [Konvoy On-Premises Installation Guide][konvoy-on-prem] to configure the `cluster.yaml`. An example is shown below.

* Ensure the following base addons that are needed by Kaptain are enabled:
    ```yaml
    - configRepository: https://github.com/mesosphere/kubernetes-base-addons
      configVersion: stable-1.20-4.1.0
      addonsList:
        - name: istio
          enabled: true
        - name: dex
          enabled: true
        - name: cert-manager
          enabled: true
        - name: prometheus
          enabled: true
    ```

* Ensure the Knative and NFS addons that are needed by Kaptain are enabled:
    ```yaml
    - configRepository: https://github.com/mesosphere/kubeaddons-kaptain
      configVersion: stable-1.20-1.3.0
      addonsList:
        - name: knative
          enabled: true
    ```
* Spin up the Konvoy cluster:
    ```bash
    konvoy up
    ```
* When the Konvoy cluster is ready, [install Kaptain](../konvoy-dkp/).

[konvoy-on-prem]: /dkp/konvoy/1.8/install/install-onprem/
[dkp-install]: /dkp/kommander/latest/install/networked/
[metallb-load-balancer]: /dkp/konvoy/1.8/install/install-onprem/#configure-metallb-load-balancing
