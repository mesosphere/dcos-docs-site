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

Kaptain natively supports the installation on an on-premise Konvoy cluster. Before installing Kaptain, please follow the [Konvoy On-Premises Installation Guide](https://docs.d2iq.com/dkp/konvoy/1.5/install/install-onprem/) to set up the on-prem Konvoy cluster. The cluster admin is responsible for configuring the Konvoy `cluster.yaml` correctly and ensuring the requisite addons are enabled.

Please note that the IP address of the Kaptain UI will come from the IP address range that is configured in the [MetalLB load balancer](https://docs.d2iq.com/dkp/konvoy/1.5/install/install-onprem/#configure-metallb-load-balancing).

The steps to install Kaptain on an on-premises cluster are as follows:

* Follow the [Konvoy On-Premises Installation Guide](https://docs.d2iq.com/dkp/konvoy/latest/install/install-onprem/) to configure the `cluster.yaml`. An example is shown below.

* Ensure the following base addons that are needed by Kaptain are enabled:
    ```yaml
    - configRepository: https://github.com/mesosphere/kubernetes-base-addons
      configVersion: stable-1.19-3.2.0
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
      configVersion: stable-1.20-1.1.0
      addonsList:
        - name: knative
          enabled: true
    ```
* Spin up the Konvoy cluster:
    ```bash
    konvoy up
    ```
* When the Konvoy cluster is ready, [install Kaptain](../konvoy/).
