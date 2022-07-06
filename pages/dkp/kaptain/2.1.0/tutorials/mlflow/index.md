---
layout: layout.pug
navigationTitle: MLflow
title: MLflow
menuWeight: 18
excerpt: Use MLflow with Kaptain
beta: false
enterprise: false
---

You can use the MLflow platform with Kaptain to collect data and manage the lifecycle of your Machine Learning and Artificial Intelligence models and experiments. MLflow supports distributed architectures, where the tracking servers, backend store, and artifact store can reside in remote hosts. When using MLflow with Kaptain, Percona handles the backend store and MinIO handles the artifact storage per default. The tracking server is handled by Kaptain.

With MLflow, you are able to:

- Gather and track data related to experiments for analysis.
- Package ML/AI code and share it with other data scientists or transfer to production environments.
- Manage and deploy models from ML libraries to model serving and inference platforms.
- Manage the full lifecycle of an MLflow model from a centralized store (model versioning, stage transitions, annotations, etc.)

## Prerequisites

- You have launched a Jupyter notebook with Kaptain. (Using another notebook would require you to build a custom image for this purpose)

  <p class="message--important"><strong>IMPORTANT: </strong>If you decide to use your own custom image or an image not provided by Kaptain to run a distributed training job, create an image following the <a href="../sdk/image-builder/">recommended container image creation steps</a>. Also ensure MLflow has been installed on it.</p>

- Optional: If you are using SDK, you have [set up Kaptain SDK for your desired training framework](../sdk/).

## Set up MLflow

MLflow is available in every notebook per default. You do not need to download, nor install it.

To use Kaptain’s MLflow tracking server from an image that is not part of Kaptain’s distribution, nor a child-image of one, the image should have [MLflow Python SDK](https://pypi.org/project/mlflow/1.25.1/) installed on it and the environment variable should be set as:

```bash
MLFLOW_TRACKING_URI=http://mlflow-tracking-server.kubeflow
```

## Use MLflow

For more information on how to use MLflow Tracking, MLflow Projects, or MLflow Models, refer to the [MLflow][mlflow_docs] documentation.

If you want to see an example of how to log SDK metrics in MLflow, refer to the [Log and Hyperparameters Metrics to MLFlow][tutorial] tutorial.

[mlflow_docs]: https://mlflow.org/docs/1.25.1/index.html
[tutorial]: ../sdk/quick-start#log-and-hyperparameters-metrics-to-mlflow
