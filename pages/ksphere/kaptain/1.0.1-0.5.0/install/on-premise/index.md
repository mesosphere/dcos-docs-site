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

Kaptain natively supports the installation on an on-premise Konvoy cluster. Before installing Kaptain, please follow the [Konvoy On-Premises Installation Guide](https://docs.d2iq.com/ksphere/konvoy/1.5/install/install-onprem/) to set up the on-prem Konvoy cluster. The cluster admin is responsible for configuring the Konvoy `cluster.yaml` correctly and ensuring the requisite addons are enabled.

Please note that the IP address of the kaptain UI will come from the IP address range that is configured in the [MetalLB load balancer](https://docs.d2iq.com/ksphere/konvoy/1.5/install/install-onprem/#configure-metallb-load-balancing).

The steps to install Kaptain on an on-premises cluster are as follows:

* Follow the [Konvoy On-Premises Installation Guide](https://docs.d2iq.com/ksphere/konvoy/1.5/install/install-onprem/) to configure the `cluster.yaml`. An example is shown below.
* Ensure the Knative and NFS addons that are needed by Kaptain are enabled:
    ```yaml
    - configRepository: https://github.com/mesosphere/kubeaddons-kaptain
      configVersion: stable-1.17-0.4.3
      addonsList:
      - name: kubeflow-nfs
        enabled: true
      - name: knative
        enabled: true
    ```
* Spin up the Konvoy cluster:
    ```bash
    konvoy up
    ```
* When the Konvoy cluster is ready, [install Kaptain](../konvoy/).

Here is an example of a `cluster.yaml` for an on-premise installation:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta1
metadata:
  name: konvoy_v1.5.2
  creationTimestamp: "2020-05-19T21:14:16Z"
spec:
  kubernetes:
    version: 1.17.11
    controlPlane:
      controlPlaneEndpointOverride: "172.16.75.89:6443"
      certificate: {}
      keepalived: {}
    networking:
      podSubnet: 192.168.0.0/16
      serviceSubnet: 10.0.0.0/18
    cloudProvider:
      provider: none
    admissionPlugins:
      enabled:
      - AlwaysPullImages
      - NodeRestriction
  containerNetworking:
    calico:
      version: v3.13.5
      encapsulation: ipip
      mtu: 1480
  containerRuntime:
    containerd:
      version: 1.3.7
  osPackages:
    enableAdditionalRepositories: true
  nodePools:
  - name: worker
  addons:
  - configRepository: https://github.com/mesosphere/kubernetes-base-addons
    configVersion: stable-1.17-2.2.0
    addonsList:
    - name: cert-manager
      enabled: true
    - name: dashboard
      enabled: true
    - name: defaultstorageclass-protection
      enabled: true
    - name: dex
      enabled: true
    - name: dex-k8s-authenticator
      enabled: true
    - name: elasticsearch
      enabled: false
    - name: elasticsearch-curator
      enabled: false
    - name: elasticsearchexporter
      enabled: false
    - name: external-dns
      enabled: false
    - name: flagger
      enabled: false
    - name: fluentbit
      enabled: false
    - name: gatekeeper
      enabled: true
    - name: istio # Istio is currently in Preview
      enabled: true
    - name: kibana
      enabled: false
    - name: konvoyconfig
      enabled: true
    - name: kube-oidc-proxy
      enabled: true
    - name: localvolumeprovisioner
      enabled: true
    - name: metallb
      enabled: true
      values: |
        configInline:
          address-pools:
          - name: default
            protocol: layer2
            # configure addresses for your network
            addresses:
            - 172.16.75.225-172.16.75.250
    - name: nvidia
      enabled: false
    - name: opsportal
      enabled: true
    - name: prometheus
      enabled: true
    - name: prometheusadapter
      enabled: true
    - name: reloader
      enabled: true
    - name: traefik
      enabled: true
    - name: traefik-forward-auth
      enabled: true
    - name: velero
      enabled: false
  - configRepository: https://github.com/mesosphere/kubeaddons-dispatch
    configVersion: stable-1.17-1.2.2
    addonsList:
    - name: dispatch
      enabled: false
  - configRepository: https://github.com/mesosphere/kubeaddons-kommander
    configVersion: stable-1.17-1.1.2
    addonsList:
    - name: kommander
      enabled: false
  - configRepository: https://github.com/mesosphere/kubeaddons-kaptain
    configVersion: stable-1.17-0.4.3
    addonsList:
    - name: kubeflow-nfs
      enabled: true
    - name: knative
      enabled: true
  version: v1.5.2
```
