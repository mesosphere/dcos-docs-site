---
layout: layout.pug
navigationTitle: Upgrade
title: Upgrade Kaptain
menuWeight: 7
excerpt: Upgrade Kaptain on your cluster
beta: false
enterprise: false
---

Upgrade the existing Kaptain installation to a newer version.

## Prerequisites

Before you begin, ensure you have:

- Kaptain 1.2.0 installed on a Konvoy cluster.
- The existing cluster meets the criteria listed in the [installation documentation][install].

## Upgrade Kaptain

* Ensure the following base addons that are needed by Kaptain are enabled in your Konvoy cluster:
    ```yaml
    - configRepository: https://github.com/mesosphere/kubernetes-base-addons
      configVersion: stable-1.20-4.3.0
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
        configVersion: stable-1.20-1.4.0
        addonsList:
          - name: knative
            enabled: true
  ```

* [Download][download] the `kubeflow-1.4.0_1.3.0.tgz` tarball from the support website.
* Upgrade Kaptain:
  ```bash
  kubectl kudo upgrade --instance kaptain --namespace kubeflow ./kubeflow-1.4.0_1.3.0.tgz
  ```
* Monitor the upgrade process by running:
  ```bash
  kubectl kudo plan status --instance kaptain --namespace kubeflow
  ```

After the upgrade completes, log in to Kaptain:

* Discover the cluster endpoint and copy it to the clipboard.
  If you are running Kaptain _on-premises_, use this command:
  ```bash
  kf_uri=$(kubectl get svc kubeflow-ingressgateway --namespace kubeflow -o jsonpath="{.status.loadBalancer.ingress[*].ip}") && echo "https://${kf_uri}"
  ```
  Or if you are running Kaptain on _AWS_, use this command:
  ```bash
  kf_uri=$(kubectl get svc kubeflow-ingressgateway --namespace kubeflow -o jsonpath="{.status.loadBalancer.ingress[*].hostname}") && echo "https://${kf_uri}"
  ```
* Get the login credentials from Konvoy to authenticate:
  ```bash
  konvoy get ops-portal
  ```

## Workloads behavior during the upgrades
* When upgrading from Kaptain version `1.2.0` to `1.3.0` the following workloads do not require stopping and can proceed _without interruption during the upgrade_:
  Jupyter Notebooks, Training Jobs (`TFJob`, `PyTorchJob`, `MXNetJob`), Katib `Experiments` and `Trials`,
  and `SparkApplications`), Kubeflow Pipelines.

[breaking-changes]: #breaking-changes
[download]: ../download
[install]: ../install
