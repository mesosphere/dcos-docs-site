---
layout: layout.pug
navigationTitle: Troubleshooting Kaptain
title: Troubleshooting Kaptain 
menuWeight: 10
excerpt: View troubleshooting information for Kaptain
beta: false
enterprise: false
---

## Known Limitations

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
- Kubeflow 1.2.0
  - Notebook controller
  - PyTorch operator 1.0.0
  - TensorFlow operator 1.0.0
  - MXNet operator 1.0.0
  - Pipelines 0.5.0
  - Katib 0.8
  - Metadata 0.1.11
  - KFServing 0.3.0
- Argo 2.3.0
- kubectl 1.16
- CoreDNS 1.6.2
- Istio/Citadel 1.4.3
- Istio 1.6.4
- Kudobuilder 0.15.0
- MySQL 5.6
- KUDO Spark 3.0.0
- MinIO 2018-02-09
- Kaniko 0.19.0
- TensorFlow Serving 1.14.0
- ONNX server 0.5.1
- Nvidia TensorRT server 19.05
- Knative 20200410
- TFX MLMD Store Server 0.21.1
- Kiali 1.18
- NFS provisioner 2.3.0
- Jaeger tracing 1.16

Python libraries (excl. transitive dependencies):
- Miniconda 4.8.2
- JupyterLab 2.0.0
- Kaptain SDK 0.0.3
- kubernetes SDK 10.0.1
- ML Metadata 0.22.0
- Kubeflow Metadata 0.3.1
- Kubeflow Pipelines 1.0.4
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
