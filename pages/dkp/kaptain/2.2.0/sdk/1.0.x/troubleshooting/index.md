---
layout: layout.pug
navigationTitle: Troubleshooting
title: Troubleshooting Kaptain SDK
beta: false
menuWeight: 4
---
Kaptain SDK Troubleshooting Guide

## Kubernetes resources created by Kaptain SDK
This section covers the resources created by the Kaptain Python SDK when [building](#building), [training](#training),
[tuning](#hyperparameter-tuning), and [serving](#serving).

### Building
The following are the Kubernetes resources created on the building model's Docker image are:
- `Secret` with Docker credentials for Docker registry authorization.
- `Secret` with S3/Minio credentials.
- `Secret` with a Docker registry certificate for secure communications with a Docker registry.
- `job.batch` builds the image with a model training code and dependencies.

All the resources listed above are removed upon successful build completion or notebook cell interruption.

### Training
The following are the Kubernetes resources created on model training:
- Resources created by the [build](#building) step if image rebuilding is needed.
- Either a `tfjob.kubeflow.org` or `pytorchjob.kubeflow.org` for running a distributed training.

By default, training jobs are not removed after completion for troubleshooting purposes, unless the `force_cleanup` parameter of the `Model.train()` method or the `KAPTAIN_SDK_FORCE_CLEANUP` environment variable is set to `True`.
All the resources listed above are removed upon notebook cell interruption.

### Hyperparameter Tuning
The following are the Kubernetes resources created on model tuning:
- Resources created by the [build](#building) step if image rebuilding is needed.
- `experiment.kubeflow.org` for orchestrating the tuning of either `tfjobs.kubeflow.org` or `pytorchjobs.kubeflow.org`.

If the `delete_experiment` flag is set to `True` in the `Model.tune()` function, the `experiment.kubeflow.org` will be cleaned up on successful completion of the tuning step. All the created resources listed above are removed upon notebook cell interruption.


### Serving
The serving machine learning models is implemented by [KServe](https://github.com/kserve/kserve), which is the component responsible for model serving over HTTP(s) and relies on Knative Serving. When a model is deployed to serving, KServe creates a set of Knative resources such as Service, Route, and Revision.

<p class="message--note"><strong>NOTE: </strong>Starting from the current release, Knative is optional if KServe is configured to work in <code>RawDeployment</code> mode.</p>

One Knative Service is always available per model deployment. However, the number of Revisions can grow with time because every new deployment, for example a new model version with a new image name, has its Revision. When a new Revision is deployed, the older one scales the associated deployment to zero replicas and keeps it.

The following are the Kubernetes resources created on model deployment:
- `Secret` with S3/Minio credentials to access MinIO bucket with a stored model.
- Knative resources: `service.serving.knative.dev`, `route.serving.knative.dev` and `revision.serving.knative.dev`.
- Inference service `serving.kubeflow.org/InferenceService`.

The `Secret` with S3/Minio credentials will be removed on successful completion or cell interruption.
All created the resources listed above are removed upon notebook cell interruption.
