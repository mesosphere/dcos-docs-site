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

Before you begin:

- Install Kaptain 1.2.0 on a Konvoy cluster.
- Ensure the existing cluster meets the criteria listed in the [installation documentation][install]. 
- [Download][download] the `kubeflow-1.4.0_1.3.0.tgz` tarball from the support website.

- Ensure the following base addons that are needed by Kaptain are enabled in your Konvoy cluster:
    
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

- Ensure the Kaptain addon repository is present in your Konvoy `cluster.yaml`:
  
  ```yaml
      - configRepository: https://github.com/mesosphere/kubeaddons-kaptain
        configVersion: stable-1.20-1.4.0
        addonsList:
          - name: knative
            enabled: true
  ```
  
## Upgrade Kaptain 

Run the upgrade according to your Konvoy version:

### For Konvoy 1.x: 

1.  Add these properties to your `params.yaml` file:

  ```bash
  dkpPlatformVersion: "1" 
  installMinioOperator: "true"
  ```

1.  Upgrade Kaptain: 

  ```bash
  kubectl kudo upgrade --instance kaptain --namespace kubeflow ./kubeflow-1.4.0_1.3.0.tgz -P params.yaml
  ```
  
### For Konvoy 2.x:

1.  Upgrade Kaptain:

  ```bash
  kubectl kudo upgrade --instance kaptain --namespace kubeflow ./kubeflow-1.4.0_1.3.0.tgz
  ```

1.  Monitor the upgrade process by running:
  
  ```bash
  kubectl kudo plan status --instance kaptain --namespace kubeflow
  ```

1.  Log in to Kaptain after the upgrade completes.

1.  Locate the cluster endpoint and copy it to your clipboard.
  
  If you are running Kaptain _on-premises_, use this command:

  ```bash
  kf_uri=$(kubectl get svc kubeflow-ingressgateway --namespace kubeflow -o jsonpath="{.status.loadBalancer.ingress[*].ip}") && echo "https://${kf_uri}"
  ```

  **OR** If you are running Kaptain on _AWS_, use this command:
  
  ```bash
  kf_uri=$(kubectl get svc kubeflow-ingressgateway --namespace kubeflow -o jsonpath="{.status.loadBalancer.ingress[*].hostname}") && echo "https://${kf_uri}"
  ```

1.  Obtain the login credentials from Konvoy to authenticate:
  
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
