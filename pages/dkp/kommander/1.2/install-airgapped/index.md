---
layout: layout.pug
navigationTitle: Install air gapped
title: Install Kommander air gapped
menuWeight: 35
excerpt: Install Kommander in an air gapped environment
beta: true
enterprise: false
---

This document shows how to install Kommander in an air gapped environment. Using the air gapped Konvoy installation documentation as the basis, this shows how to get Kommander running on top of an air gapped Konvoy cluster.

# Naming

This document uses the following terms:
- Management cluster - Konvoy cluster running Kommander
- Attached cluster - Konvoy or non-Konvoy cluster attached to the management cluster
- Docker registry - a registry containing all Docker images that clusters access and download during installation

# Before you begin

Before installing, make sure your environment has the following basic requirements:

- a Docker registry containing all the necessary Docker installation images. This also includes Kommander images. The `konvoy_air_gapped.tar.bz2` tarball has the required artifacts.

- connectivity with clusters attaching to the management
  cluster:
  - both management and attached clusters must connect to the Docker registry
  - management cluster must connect to the attached cluster's API server
  - management cluster must connect to load balancers created by some addons. For example, Thanos, part of the Prometheus addon, connects to those load balancers.

- all the prerequisites in [air gapped Konvoy installation][air-gap-before-you-begin] in case of Konvoy clusters.

## Control plane nodes

Control plane nodes of Konvoy clusters should meet the minimal requirements outlined in [air gapped Konvoy installation][air-gap-control-plane].

## Worker nodes

Worker nodes must meet the minimal requirements outlined in [air gapped Konvoy installation][air-gap-worker-nodes].

## Operating system and services for all nodes

All nodes must meet the same minimal requirements outlined in [air gapped Konvoy installation][air-gap-os-system].

## Define the inventory file

Installing air gapped Kommander does not require any changes in the `inventory.yaml` file.

# Configure the Kubernetes cluster

The `cluster.yaml` file provides the configuration details for creating your Konvoy cluster. Installing Kommander in an air-gapped environment requires extra configuration. Make sure the `cluster.yaml` has all the changes outlined in [air gapped Konvoy installation][air-gap-config-image-reg] documentation. On top of that, you need to edit your `cluster.yaml` as outlined below to meet the following requirements:

1.  Make sure Kommander can use the self-hosted charts repository running on top of the Konvoy cluster. It can not connect to the default one through the public Internet.
1.  Make sure Kommander can find and access the private Docker registry. The `registry_ip` variable in the code snippet below references the IP address of the available private Docker registry. You can omit the username and password lines if your registry does not require authentication. This example assumes the registry uses a custom CA certificate which has to be injected into Kommander as an Addon value.
1.  Reconfigure the Kommander controller to work in an air gapped environment.

Your `cluster.yaml` file should look similar to the following for Kommander Addon configuration (ensure to replace `KONVOY_VERSION` with the specific version that you retrieve from your management cluster's `cluster.yaml` `spec.version` field):

```yaml
- name: kommander
  enabled: true
  values: |2
    global:
      federate:
        airgapped:
          enabled: true
          chartRepo: http://konvoy-addons-chart-repo.kubeaddons.svc:8879
          addons:
            image:
              tag: KONVOY_VERSION
    kommander-federation:
      controller:
        containers:
          manager:
            extraArgs:
              feature-gates: Airgapped=true
      kubeaddonsRepository:
        versionStrategy: mapped-kubernetes-version
        versionMap:
            1.17.11: master
      konvoy:
        imageRepository: "${registry_ip}:5000/mesosphere/konvoy"
      clusterAutoscaler:
        chartRepo: http://konvoy-addons-chart-repo.kubeaddons.svc:8879
      utilityApiserver:
        dockerRegistryCaBundle: |
          -----BEGIN CERTIFICATE-----
          [...]
          ----END CERTIFICATE-----
        extraArgs:
          docker-registry-url: "https://${registry_ip}:5000"
          docker-registry-username: 'admin'
          docker-registry-password: 'password'
```

 If you wish to disable the Docker registry certificate verification, set `docker-registry-insecure-skip-tls-verify` to `true` in the `utilityApiserver`'s `extraArgs`. We encourage you to keep the certificate verification enabled to validate all TLS connections to the registry.

[air-gap-before-you-begin]: /dkp/konvoy/1.6/install/install-airgapped/#before-you-begin
[air-gap-control-plane]: /dkp/konvoy/1.6/install/install-airgapped/#control-plane-nodes
[air-gap-config-image-reg]: /dkp/konvoy/1.6/install/install-airgapped/#configure-the-image-registry
[air-gap-os-system]: /dkp/konvoy/1.6/install/install-airgapped/#operating-system-and-services-for-all-nodes
[air-gap-worker-nodes]: /dkp/konvoy/1.6/install/install-airgapped/#worker-nodes
