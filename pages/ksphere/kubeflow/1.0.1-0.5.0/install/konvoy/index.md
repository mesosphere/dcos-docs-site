---
layout: layout.pug
navigationTitle: Install KUDO for Kubeflow on Konvoy
title: Install KUDO for Kubeflow on Konvoy
menuWeight: 8
excerpt: Install KUDO for Kubeflow on Konvoy
beta: false
enterprise: false
---

* After the Konvoy cluster has been deployed successfully (including Istio and Knative), install KUDO:
  ```bash
  kubectl kudo init
  ```
* [Download `kubeflow-1.0.1-0.5.0.tgz` tarball](../../download/).
* Install Kubeflow:
  ```bash
  kubectl kudo install --namespace kubeflow --create-namespace ./kubeflow-1.0.1-0.5.0.tgz
  ```
* If you would like to inject additional annotations to KUDO for Kubeflow's default gateway `kubeflow-ingressgateway`, you can pass in the service annotations as parameters:
  ```bash
  kubectl kudo install --namespace kubeflow --create-namespace ./kubeflow-1.0.1-0.5.0.tgz -p kubeflowIngressGatewayServiceAnnotations='{"foo": "abc","bar": "xyz"}'
  ```
* Monitor the installation by running:
  ```bash
  kubectl kudo plan status --instance kubeflow-instance -n kubeflow
  ```

Once all components have been deployed, you can log in to KUDO for Kubeflow:

* Discover the cluster endpoint and copy it to the clipboard:
  ```bash
  kf_uri=$(kubectl get svc kubeflow-ingressgateway --namespace kubeflow -o jsonpath="{.status.loadBalancer.ingress[*].ip}") && echo "https://${kf_uri}"
  ```
* Get the login credentials from Konvoy to authenticate:
  ```bash
  konvoy get ops-portal
  ```

## Uninstall KUDO for Kubeflow
```bash
kubectl kudo uninstall --instance kubeflow-instance --namespace kubeflow
kubectl wait --for=delete pod --selector istio=kubeflow-ingressgateway -n kubeflow --timeout=1m
kubectl delete operatorversions.kudo.dev kubeflow-0.5.0 --namespace kubeflow
kubectl delete operators.kudo.dev kubeflow --namespace kubeflow
```
