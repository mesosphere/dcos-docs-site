---
layout: layout.pug
navigationTitle: Install Kaptain on Konvoy
title: Install Kaptain on Konvoy
menuWeight: 8
excerpt: Install Kaptain on Konvoy
beta: false
enterprise: false
---

## Install

* Ensure the following base addons that are needed by Kaptain are enabled:
    ```yaml
    - configRepository: https://github.com/mesosphere/kubernetes-base-addons
      configVersion: stable-1.18-3.0.0
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

* Add Kaptain addon repository in your Konvoy `cluster.yaml` to install Kaptain dependencies,
then follow the Konvoy documentation to deploy the addons:
  ```yaml
      - configRepository: https://github.com/mesosphere/kubeaddons-kaptain
        configVersion: stable-1.18-0.6.0
        addonsList:
          - name: knative
            enabled: true
          - name: kubeflow-nfs
            enabled: true
  ```
* Please note that KUDO parameters are not supported in this installation option due to Konvoy API limitation.

* After the Konvoy cluster has been deployed (incl. Istio and Knative), install KUDO:
  ```bash
  kubectl kudo init
  ```
* [Download `kubeflow-1.0.1_0.5.0.tgz` tarball](../../download/).
* Install Kubeflow:
  ```bash
  kubectl kudo install --namespace kubeflow --create-namespace ./kubeflow-1.0.1_0.5.0.tgz
  ```
* If you would like to inject additional annotations to Kaptain's default gateway `kubeflow-ingressgateway`, you can pass in the service annotations as parameters:
  ```bash
  kubectl kudo install --namespace kubeflow --create-namespace ./kubeflow-1.0.1_0.5.0.tgz -p kubeflowIngressGatewayServiceAnnotations='{"foo": "abc","bar": "xyz"}'
  ```
* Monitor the installation by running:
  ```bash
  kubectl kudo plan status --instance kubeflow-instance -n kubeflow
  ```

Once all components have been deployed, you can log in to Kaptain:

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

## Uninstall Kaptain
  
* Use the following commands to uninstall Kaptain.
  ```bash
  kubectl kudo uninstall --instance kubeflow-instance --namespace kubeflow
  kubectl wait --for=delete pod --selector istio=kubeflow-ingressgateway -n kubeflow --timeout=1m
  kubectl delete operatorversions.kudo.dev kubeflow-0.5.0 --namespace kubeflow
  kubectl delete operators.kudo.dev kubeflow --namespace kubeflow
  ```
