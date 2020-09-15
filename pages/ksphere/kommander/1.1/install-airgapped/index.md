---
layout: layout.pug
navigationTitle: Install air-gapped
title: Install Kommander air-gapped
menuWeight: 35
excerpt: Install Kommander in an air-gapped environment
enterprise: false
---

This document is meant to outline steps required to install kommander in an airgapped environment. It uses documentation of airgapped Konvoy installation as basis and outlines only the steps required to get Kommander running on top of an airgapped Konvoy cluster.

# Naming

Across this document, some terms are used which are defined here:
* management cluster - konvoy cluster that is going to be running kommander
* attached cluster - cluster, be it konvoy or non-konvoy one, which are going to be attached to the management cluster
* docker registry - a registry from which all clusters download docker images used by installation

# Before you begin

Before installing, verify that your environment meets the following basic requirements:

* a docker registry should already contain all the docker images required for installation and this includes also kommander images. The `konvoy_air_gapped.tar.bz2` tarball will contain the required artifacts.

* connectivity with clusters that are going to be attached to the management
  cluster:
  * both management and attached clusters should be able to connect to the docker registry
  * management cluster should be able to connect to attached cluster's API server

* all the prerequisites outlined in [airgapped konvoy installation][https://docs.d2iq.com/ksphere/konvoy/1.6/install/install-airgapped/#before-you-begin] in case of konvoy clusters. For attached clusters that are 3rd party clusters, please refer to the vendor's documentation.

## Control plane nodes

Control plane nodes of Konvoy clusters should meet the minimal requirements outlined in [airgapped konvoy installation][https://docs.d2iq.com/ksphere/konvoy/1.6/install/install-airgapped/#control-plane-nodes]. For 3rd-party clusters control plance requirements refer to the vendor specification.

## Worker nodes

Worker nodes should meet the minimal requirements outlined in [airgapped konvoy installation][https://docs.d2iq.com/ksphere/konvoy/1.6/install/install-airgapped/#worker-nodes].

## Operating system and services for all nodes

All nodes should meet the same minimal requirements outlined in [airgapped konvoy installation][https://docs.d2iq.com/ksphere/konvoy/1.6/install/install-airgapped/#operating-system-and-services-for-all-nodes].

## Defininig inventory file

Installing airgapped Kommander does not require any additional changes in the `inventory.yaml` file.

# Configure the Kubernetes cluster

The `cluster.yaml` file provides the configuration details for creating your Konvoy cluster. Installing Kommander in an airgapped environment requires some additional configuration, which is described below. It is assumed that all the `cluster.yaml` changes outlined in [airgapped konvoy installation][https://docs.d2iq.com/ksphere/konvoy/1.6/install/install-airgapped/#configure-the-image-registry] documentation were also applied.

First of all, Kommander needs to use self-hosted charts repo that will be running on top of Konvoy cluster, as it will not be able to connect to the default one through the public Internet.

```yaml
- name: kommander
  values: |2
    global:
      federate:
        airgapped:
          enabled: true
          chartRepo: http://konvoy-addons-chart-repo.kubeaddons.svc:8879
    kommander-federation:
      clusterAutoscaler:
        chartRepo: http://konvoy-addons-chart-repo.kubeaddons.svc:8879
```

Secondly, Kommander needs to know where the private docker registry is and how to access it. The `registry_ip` variable is the ip address on which private docker registry is available, ${user} and ${password} are username and password if credentials are required.

```yaml
- name: kommander
  values: |2
    kommander-federation:
      konvoy:
        imageRepository: "${registry_ip}:5000/mesosphere/konvoy"
      utilityApiserver:
        extraArgs:
          docker-registry-url: "https://${registry_ip}:5000"
          docker-registry-insecure-skip-tls-verify: true
          docker-registry-username: 'admin'
          docker-registry-password: 'password'
```

And finally, we kommander controller needs to be reconfigured to work in an airgapped environment:

```yaml
- name: kommander
  values: |2
    kommander-federation:
      controller:
        containers:
          manager:
            extraArgs:
              feature-gates: "Airgapped=true"
```

Putting it together, the Kommander addon configuration should look like this:

```yaml
- name: kommander
  enabled: true
  values: |2
    global:
      federate:
        airgapped:
          enabled: true
          chartRepo: http://konvoy-addons-chart-repo.kubeaddons.svc:8879

    kommander-federation:
      controller:
        containers:
          manager:
            extraArgs:
              feature-gates: "Airgapped=true"
      kubeaddonsRepository:
        versionStrategy: mapped-kubernetes-version
        versionMap:
            1.17.11: master
      konvoy:
        imageRepository: "${bastion_ip}:5000/mesosphere/konvoy"
      clusterAutoscaler:
        chartRepo: http://konvoy-addons-chart-repo.kubeaddons.svc:8879
      utilityApiserver:
        extraArgs:
          docker-registry-url: "https://${bastion_ip}:5000"
          docker-registry-insecure-skip-tls-verify: true
          docker-registry-username: 'admin'
          docker-registry-password: 'password'
```
