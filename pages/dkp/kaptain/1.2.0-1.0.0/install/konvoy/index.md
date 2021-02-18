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

Before proceeding, verify that your environment meets the following basic requirements:

- Control plane
  - min. 3 nodes
  - min. 4 cores _per node_
  - min. 200 GiB free disk space _per node_
  - min. 16 GiB RAM _per node_
- Workers
  - min. 6 nodes
  - min. 8 cores _per node_
  - min. 200 GiB free disk space _per node_
  - min. 32 GiB RAM _per node_
- GPUs (optional)
  - NVIDIA only
  - min. 200 GiB free disk space per instance
  - min. 64 GiB RAM per instance
  - min. 12 GiB GPU RAM per instance
  
Please note that these numbers are for the bare minimum.
Running any realistic machine learning workloads on Kaptain bumps these requirements for nodes, CPUs, RAM, GPUs, and persistent disk.
In particular, the number of CPU and/or GPU workers as well as RAM must be increased considerably.
The amounts depend on the number, complexity, and size of the workloads as well as the amount of metadata and log data stored with each run.

For on-premise installations, horizontal scalability is limited by the overall size of the cluster and quotas therein.
For cloud installations, scaling out can be limited by resource quotas.

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

* Add Kaptain addon repository in your Konvoy `cluster.yaml` to install Kaptain dependencies, then follow the Konvoy documentation to deploy the addons:
  ```yaml
      - configRepository: https://github.com/mesosphere/kubeaddons-kaptain
        configVersion: stable-1.18-0.6.0
        addonsList:
          - name: knative
            enabled: true
          - name: kubeflow-nfs
            enabled: true
  ```

* After the Konvoy cluster has been deployed (incl. Istio and Knative), install KUDO:
  ```bash
  kubectl kudo init
  ```
* [Download `kubeflow-1.2.0_1.0.0.tgz` tarball](../../download/).
* Install Kaptain:
  ```bash
  kubectl kudo install --instance kaptain --namespace kubeflow --create-namespace ./kubeflow-1.2.0_1.0.0.tgz
  ```
* If you would like to inject additional annotations to Kaptain's default gateway `kubeflow-ingressgateway`, you can pass in the service annotations as parameters:
  ```bash
  kubectl kudo install --instance kaptain --namespace kubeflow --create-namespace ./kubeflow-1.2.0_1.0.0.tgz -p kubeflowIngressGatewayServiceAnnotations='{"foo": "abc","bar": "xyz"}'
  ```
* Monitor the installation by running:
  ```bash
  kubectl kudo plan status --instance kaptain  -n kubeflow
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
  kubectl kudo uninstall --instance kaptain --namespace kubeflow --wait
  kubectl delete operatorversions.kudo.dev kubeflow-1.2.0-1.0.0 --namespace kubeflow
  kubectl delete operators.kudo.dev kubeflow --namespace kubeflow
  ```
