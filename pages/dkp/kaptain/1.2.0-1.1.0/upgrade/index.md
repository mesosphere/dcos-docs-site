---
layout: layout.pug
navigationTitle: Upgrade
title: Upgrade Kaptain
menuWeight: 7
excerpt: Upgrade Kaptain on your cluster
beta: false
enterprise: false
---

Learn how to upgrade the existing Kaptain installation to a newer version.

## Prerequisites

- Kaptain 1.2.0-1.0.0 is installed on a Konvoy cluster.
- The existing cluster meets the criteria listed in the [installation documentation](../install). 

## Upgrading Kaptain

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

* Ensure the Kaptain addon repository is present in your Konvoy `cluster.yaml`:
  ```yaml
      - configRepository: https://github.com/mesosphere/kubeaddons-kaptain
        configVersion: stable-1.20-1.1.0
        addonsList:
          - name: knative
            enabled: true
  ```

* [Download `kubeflow-1.2.0_1.1.0.tgz` tarball](../../download/).
* Upgrade Kaptain:
  ```bash
  kubectl kudo upgrade --instance kaptain --namespace kubeflow ./kubeflow-1.2.0_1.1.0.tgz
  ```
* Monitor the upgrade process by running:
  ```bash
  kubectl kudo plan status --instance kaptain --namespace kubeflow
  ```

Once the upgrade plan completes, you can log in to Kaptain:

* Discover the cluster endpoint and copy it to the clipboard.
  If you are running Kaptain _on-premises_:
  ```bash
  kf_uri=$(kubectl get svc kubeflow-ingressgateway --namespace kubeflow -o jsonpath="{.status.loadBalancer.ingress[*].ip}") && echo "https://${kf_uri}"
  ```
  Or if you are running Kaptain on _AWS_:
  ```bash
  kf_uri=$(kubectl get svc kubeflow-ingressgateway --namespace kubeflow -o jsonpath="{.status.loadBalancer.ingress[*].hostname}") && echo "https://${kf_uri}"
  ```
* Get the login credentials from Konvoy to authenticate:
  ```bash
  konvoy get ops-portal
  ```

## Workloads behavior during the upgrades
* When upgrading from Kaptain version `1.2.0-1.0.0` to `1.2.0-1.1.0`  
  * The following workloads do not require stopping and can proceed _without interruption during the upgrade_:
  Jupyter Notebooks, Training Jobs (`TFJob`, `PyTorchJob`, `MXNetJob`), Katib `Experiments` and `Trials`,
  and `SparkApplications`.
  * Kubeflow Pipelines require a resubmission of the pipeline definitions after the upgrade (see [Breaking changes](#breaking-changes)). It is recommended all running pipelines be halted prior to the upgrade and resubmitted via the Pipelines SDK after the upgrade is complete.
  
## Breaking changes
* Kaptain `1.2.0-1.1.0`
  * Kaptain 1.2.0-1.1.0 comes with a highly-available MySQL storage for pipeline history and metadata persistence.
  This new MySQL cluster is a drop-in replacement for several MySQL databases used previously. Kaptain does not perform the migration of the Pipeline execution history data and metadata during the upgrade from 1.2.0-1.0.0.
  * Kaptain 1.2.0-1.0.0 comes with a highly-available MinIO deployment for the in-cluster block storage which is used for pipeline artifacts and transient data persistence. The new MinIO cluster is a drop-in replacement for the single-instance deployment used previously. Kaptain does not perform the migration of the MinIO data during the upgrade.
