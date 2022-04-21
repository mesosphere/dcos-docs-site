---
layout: layout.pug
navigationTitle: Troubleshooting
title: Troubleshooting Guide
menuWeight: 95
excerpt: Troubleshooting Guide for Kaptain
beta: false
enterprise: false
---

## Kaptain and KUDO

To print the status of the Kaptain operator instance:

```bash
kubectl kudo plan status -n kubeflow --instance kaptain
```

To show deployments and pods in the Kaptain operator instance:

```bash
kubectl get deployments -n kubeflow

kubectl get pods -n kubeflow

kubectl describe pod <pod_name> -n kubeflow
```

To print the logs from the KUDO controller:

```bash
kubectl logs -n kudo-system kudo-controller-manager-0 -f
```

### Kubeflow Pipelines
List all pipeline runs in user namespace:
```
kubectl get workflows.argoproj.io -n <namespace>
```

Print the logs from all pipeline steps:
```
kubectl logs -l workflows.argoproj.io/workflow=<workflow_name> -c main --prefix=true -n <namespace>
```

Delete all completed pipeline runs:
```
kubectl delete workflows.argoproj.io -l workflows.argoproj.io/completed=true -n <namespace>
```

Delete all the pipeline runs with by final status (`Succeeded` or `Failed`):
```
kubectl delete -l workflows.argoproj.io -l workflows.argoproj.io/completed=true -l workflows.argoproj.io/phase=Succeeded -n <namespace>
```

## Konvoy

To create the Konvoy diagnostics bundle, use:

```bash
konvoy diagnose --logs-all-namespaces --yes
```

Afterwards, check [Konvoy troubleshooting techniques][konvoy-troubleshooting].

## Limitations

### Kubeflow Pipelines

Kubeflow Pipelines steps can fail if the main container exits too quickly and the [Argo sidecar fails to collect artifacts](https://github.com/argoproj/argo/issues/1256).
This can happen when the container image is not available on a node and needs to be pulled from the registry first.
Retry the pipeline run or to pre-download the container image to the relevant nodes.

### Using Kubeflow Fairing with Private Docker Registries

Kubeflow Fairing does not currently support Docker registries using self-signed TLS certificates, certificate chaining, or insecure (plaintext HTTP) registries. It is recommended to use the Kaptain SDK for building and pushing Docker images
as a part of the model development process.

### Spark and Horovod

Running Spark and Horovod on Spark in client mode from a notebook with Istio enabled is not supported.
It is recommended to use the Spark Operator for running Spark applications.

### Pocket Chrome Extension

Users who have the Google Chrome extension for [Pocket](https://getpocket.com/chrome/) installed may not be able to see large portions of the Kaptain UI.
Disable the Pocket extension to ensure the Kaptain UI is completely visible.

## Component Versions

Kaptain includes:
- Kubeflow 1.3.0
  - Notebook controller 1.3.0
  - Argo Workflows 2.12.9
  - Katib 0.11.0
  - KFServing 0.5.1
  - Percona Kubernetes Operator 1.7.0
  - Kubeflow Pipelines 1.5.0
  - PyTorch Operator 0.7.0
  - Tensorflow Operator 1.1.0
  - MinIO Operator 4.0.3
  - MXNet Operator 1.1.0
  - MinIO RELEASE.2021-03-01T04-20-55Z
- kubectl 1.19
- Kudobuilder 0.19.0
- KUDO Spark 3.0.0
- Kaniko 1.3.0
- TensorFlow Serving 1.14.0
- ONNX server 0.5.1
- Nvidia TensorRT server 19.05
- Knative 20200410
- TFX MLMD Store Server 0.21.1

Python libraries (excluding transitive dependencies):
- Miniconda 4.8.2
- JupyterLab 3.0.16
- Kaptain SDK 0.3.0
- kubernetes SDK 10.0.1
- ML Metadata 0.22.0
- Kubeflow Pipelines 1.4.0
- Kubeflow Fairing 1.0.1
- TensorFlow 2.4.0
- PyTorch 1.7.1
- MXNet 1.8.0
- Horovod 0.21.0
- CUDA 11.0
- Matplotlib 3.2.1
- Papermill 2.0.0
- Open MPI
- gensim
- future
- h5py
- Keras
- NLTK
- NumPy
- Pandas
- SciPy
- scikit-learn
- Seaborn
- spaCy
- statsmodels
- typing
- boto3
- ipywidgets
- NodeJS
- Plotly
- Toree

[konvoy-troubleshooting]: https://docs.d2iq.com/dkp/konvoy/latest/troubleshooting/
