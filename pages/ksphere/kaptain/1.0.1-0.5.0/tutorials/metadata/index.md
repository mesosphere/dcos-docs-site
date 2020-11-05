---
layout: layout.pug
navigationTitle: Metadata SDK
title: Metadata SDK
menuWeight: 13
excerpt: Tutorial for Metadata SDK
beta: false
enterprise: false
---

<p class="message--note"><strong>NOTE: </strong>All tutorials in Jupyter Notebook format are available for
<a href="https://downloads.mesosphere.io/kudo-kubeflow/d2iq-tutorials-1.0.1-0.5.0.tar.gz">download</a>. You can either
download them to a local computer and upload to the running Jupyter Notebook or run
<code>wget -O - https://downloads.mesosphere.io/kudo-kubeflow/d2iq-tutorials-1.0.1-0.5.0.tar.gz | tar xz</code>
from a Jupyter Notebook Terminal running in your Kaptain installation.
</p>
<p class="message--note"><strong>NOTE: </strong>Please note that these notebook tutorials have been built for and
tested on D2iQ's Kaptain. Without the requisite Kubernetes operators and custom Docker images, these notebook
will likely not work.</p>


# Metadata SDK

## Introduction
All information about executions, models, data sets as well as the files and objects that are a part of a machine learning workflow are referred to as metadata.
The [Metadata SDK](https://www.kubeflow.org/docs/components/metadata/) allows you to manage all ML assets:

- An [`Execution`](https://kubeflow-metadata.readthedocs.io/en/latest/source/md.html#kubeflow.metadata.metadata.Execution) captures metadata of a single run of an ML workflow, which can be either a pipeline or a notebook. Any derived data that is used or produced in the context of a single execution is referred to as an **artifact**.
- Metadata of a [`Model`](https://kubeflow-metadata.readthedocs.io/en/latest/source/md.html#kubeflow.metadata.metadata.Model) includes a URI to its location, a name and description, training framework (e.g. TensorFlow, PyTorch, MXNet), hyperparameters and their values, and so on.
- [`Metrics`](https://kubeflow-metadata.readthedocs.io/en/latest/source/md.html#kubeflow.metadata.metadata.Metrics) collect evaluation metrics of the model
- A [`DataSet`](https://kubeflow-metadata.readthedocs.io/en/latest/source/md.html#kubeflow.metadata.metadata.DataSet) describes the data that is either the input or output of a component within an ML workflow.

Behind the scenes, the Metadata SDK uses the gRPC service of [MLMD](https://github.com/google/ml-metadata/blob/master/g3doc/get_started.md), the ML Metadata library, which was originally designed for [TFX](https://github.com/tensorflow/tfx) (TensorFlow eXtended) and offers both implementations for SQLite and MySQL.

With the Metadata SDK you can also add so-called [metadata watchers](https://github.com/kubeflow/metadata/blob/master/watcher/README.md) to check up on Kubernetes resource changes and to save the related data in the metadata service.

### What You'll Learn
In this notebook, you'll learn how to use the Metadata SDK to display information about executions and interact with the metadata available within Kubeflow.

### What You'll Need
Nothing except this notebook.

## How to Create a Workspace
A [workspace](https://kubeflow-metadata.readthedocs.io/en/latest/source/md.html#kubeflow.metadata.metadata.Workspace) is a grouping of pipelines, notebooks, and their artifacts.
A single workspace can hold multiple executions.

To define various objects (e.g. executions, runs, models) you therefore need to create a workspace.
Unless you define multiple workspaces within the same context, you do not have to specify it after you have created 

Let's import the metadata modules and store the default DNS for the host as well as the port for the [metadata store](https://kubeflow-metadata.readthedocs.io/en/latest/source/md.html#kubeflow.metadata.metadata.Store) in a couple of variables:


```python
from kubeflow.metadata import metadata
```


```python
METADATA_STORE_HOST = "metadata-grpc-service.kubeflow"
METADATA_STORE_PORT = 8080

METADATA_STORE = metadata.Store(
    grpc_host=METADATA_STORE_HOST, grpc_port=METADATA_STORE_PORT
)
```


```python
ws = metadata.Workspace(
    store=METADATA_STORE,
    name="demo workspace",
    description="A workspace for our demo",
    labels={"some_key": "a-value"},
)
```

This creates a `demo workspace` with a custom label `some_key` that holds the `a-value`.
Labels are typically used to enable easier filtering.
These are (as of yet) not part of the Kubeflow central dashboard, but they can be used to filter by means of the SDK.

## How to Create a Run in a Workspace
The difference between runs and executions is subtle: an execution records the run of a component or step in a machine learning workflow (along with its runtime parameters).

A run is an instance of an executable step. 

An execution therefore always _refers_ to a run.

We'll also define a helper function:


```python
from uuid import uuid4


def add_suffix(name: str) -> str:
    """
    Appends an underscore and hexidecimal UUID to `name`

    :param str name: String to be suffixed
    :return: Suffixed string
    :rtype: str
    """
    return f"{name}_{uuid4().hex}"
```

The run itself is then defined as follows:


```python
run = metadata.Run(
    workspace=ws, name=add_suffix("run"), description="A run in our workspace",
)
```

## How to Create an Execution of a Run


```python
exec = metadata.Execution(
    name=add_suffix("execution"),
    workspace=ws,
    run=run,
    description="An execution of our run",
)

print(f"Execution ID: {exec.id}")
```

    Execution ID: 19


## How to Log Artifacts for an Execution
An execution can have both _input_ and _output_ artifacts.
Artifacts that can be logged for executions are `Model`, `DataSet`, `Metrics`, or a [custom artifact type](https://kubeflow-metadata.readthedocs.io/en/latest/source/md.html#kubeflow.metadata.metadata.Artifact).

You can see defined artifacts by navigating to the Kubeflow Central Dashboard's Artifact Store.


### How to Log a Data Set
A data set that is used by the model itself is an input artifact.
It can be registered as follows:


```python
date_set_version = add_suffix("ds")

data_set = exec.log_input(
    metadata.DataSet(
        description="Sample data",
        name="mytable-dump",
        owner="owner@my-company.com",
        uri="file://path/to/dataset",
        version=date_set_version,
        query="SELECT * FROM mytable",
    )
)

print(f"Data set ID:      {data_set.id}")
print(f"Data set version: {data_set.version}")
```

    Data set ID:      25
    Data set version: ds_2f9dd04cf4584b87bd670ad474879b85


The data itself is available at the specified `uri`.
The `query` is optional and _documents_ how this data is fetched from the source.
It is not used to retrieve it.
After all, the data does not have to live in a relational database at all.

### How to Log a Model
If a step of a machine learning workflow generates a model, it is logged as an output artifact:


```python
model_version = add_suffix("model")

model = exec.log_output(
    metadata.Model(
        name="MNIST",
        description="Model to recognize handwritten digits",
        owner="owner@my-company.com",
        uri="gcs://my-bucket/mnist",
        model_type="neural network",
        training_framework={"name": "tensorflow", "version": "v1.0"},
        hyperparameters={
            "learning_rate": 0.5,
            "layers": [10, 3, 1],
            "early_stop": True,
        },
        version=model_version,
        labels={"a_label": "some-value"},
    )
)

print(f"Model ID:      {model.id}")
print(f"Model version: {model.version}")
```

    Model ID:      26
    Model version: model_fb6da2a4ea0c4bb5be7a42fc09221797


The reason it is an output artifact is simple yet perhaps not obvious: until a model has been run (i.e. trained) its weights and values are not yet computed.
The trained model is therefore the output of a step in the workflow.

Please note that the model type is a [free-form text field](https://kubeflow-metadata.readthedocs.io/en/latest/source/md.html#kubeflow.metadata.metadata.Model). Only `uri` and `name` are required, although `version` is highly recommended.

<div style="color: #31708f; background-color: #d9edf7; border-color: #bce8f1; padding: 15px; margin-top: 10px; margin-bottom: 10px; border: 1px solid transparent; border-radius: 4px;">
<b>Models as Input Artifacts</b><br>
    You may wonder whether a model can ever be an input artifact.<br>
    The answer is: Yes!<br><br>Model serving is probably the most common case for a model to be listed as an input artifact to an execution, but there is another possibility.
    In transfer learning, the knowledge gained from a base model is 'transferred' to another problem that is related but different.
    Suppose you have to build an application to classify pictures of drinks into four categories: tea, coffee, soft drinks, and alcohol.
    The basic task of identifying cups, mugs, glasses, liquids, and so on requires a lot of data and hardware, so it makes sense to rely on a pre-trained network for feature extraction.
    Since the (dense) layers near the output of the model are more specific to the task at hand than the (convolutional) layers near the input, you cut the base network after the convolutional layers and add in your own dense layers to perform the necessary task-dependent classification.
    The problem of classifying drinks is related to image recognition, and the knowledge gained from the latter (i.e. features extracted that are needed to classify general images) is transferred to the former.
    If your own data set is huge, the recommendation is to train the base model.
    If, however, your own data set is small, it's advantageous to freeze the base model. 
    The base model is then an input artifact to an execution.<br><br>
    Examples of classifiers based on pre-trained base models (e.g. <a href="https://www.tensorflow.org/tutorials/images/transfer_learning">cats vs dogs (in TensorFlow)</a>, <a href="https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html">ants vs bees (in PyTorch)</a>, <a href="https://gluon-cv.mxnet.io/build/examples_classification/transfer_learning_minc.html">various materials (in MXNet)</a>) are available in case you want to know more.
</div>

### How to Log the Evaluation of a Model


```python
metrics = exec.log_output(
    metadata.Metrics(
        name="MNIST evaluation",
        description="Evaluation of the MNIST model",
        owner="owner@my-company.com",
        uri="gcs://my-bucket/mnist-eval.csv",
        data_set_id=str(data_set.id),
        model_id=str(model.id),
        metrics_type=metadata.Metrics.VALIDATION,
        values={"accuracy": 0.95},
        labels={"mylabel": "l1"},
    )
)

print(f"Metrics ID: {metrics.id}")
```

    Metrics ID: 27


Possible values for `metrics_type`:
- `TRAINING`
- `VALIDATION`
- `TESTING`
- `PRODUCTION`

If you are not familiar with the distinction between validation and training, please check out the [notebook on hyperparameter tuning](../katib), which explains the difference and the need for an additional evaluation step.

## How to Add Metadata for Serving the Model
Once you're satisfied with the model, you want to serve it.
The model server is an execution with a model as input artifact:


```python
app = metadata.Execution(
    name="Serving the MNIST model",
    workspace=ws,
    description="An execution to represent the model serving component",
)

served_model = metadata.Model(
    name="MNIST", uri="gcs://my-bucket/mnist", version=model.version,
)

m = app.log_input(served_model)

print(f"Serving model with ID:      {m.id}")
print(f"Serving model with version: {m.version}")
```

    Serving model with ID:      26
    Serving model with version: model_fb6da2a4ea0c4bb5be7a42fc09221797


Please note that we use the `name`, `uri`, and `version` to identify the model.
As stated before, only the first two are required, but it's a good practice to also include the version.

## How to List All Models in a Workspace
The Artifact Store is user interface that displays artifacts across all workspaces.
Not all fields are available, which means we cannot filter easily on, say, custom labels.

Fortunately, we can ask for all artifacts of a certain type: `Model`, `Metrics`, `DataSet`, or a custom artifact.
Here's how to list all models:


```python
artifacts = ws.list(metadata.Model.ARTIFACT_TYPE_NAME)
artifacts
```




    [{'id': 26,
      'workspace': 'demo workspace',
      'run': 'run_5faf20cfbba941c9a400fbfbe02cd654',
      'model_type': 'neural network',
      'create_time': '2020-04-20T13:21:12.320745Z',
      'version': 'model_fb6da2a4ea0c4bb5be7a42fc09221797',
      'owner': 'owner@my-company.com',
      'description': 'Model to recognize handwritten digits',
      'name': 'MNIST',
      'uri': 'gcs://my-bucket/mnist',
      'training_framework': {'name': 'tensorflow', 'version': 'v1.0'},
      'hyperparameters': {'learning_rate': 0.5,
       'layers': [10, 3, 1],
       'early_stop': True},
      'labels': {'a_label': 'some-value'},
      'kwargs': {}}]



The output is not exactly fabulous for humans, so we can restructure it to make it easier to manipulate:


```python
import pandas as pd

pd.DataFrame.from_dict(artifacts)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>id</th>
      <th>workspace</th>
      <th>run</th>
      <th>model_type</th>
      <th>create_time</th>
      <th>version</th>
      <th>owner</th>
      <th>description</th>
      <th>name</th>
      <th>uri</th>
      <th>training_framework</th>
      <th>hyperparameters</th>
      <th>labels</th>
      <th>kwargs</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>26</td>
      <td>demo workspace</td>
      <td>run_5faf20cfbba941c9a400fbfbe02cd654</td>
      <td>neural network</td>
      <td>2020-04-20T13:21:12.320745Z</td>
      <td>model_fb6da2a4ea0c4bb5be7a42fc09221797</td>
      <td>owner@my-company.com</td>
      <td>Model to recognize handwritten digits</td>
      <td>MNIST</td>
      <td>gcs://my-bucket/mnist</td>
      <td>{'name': 'tensorflow', 'version': 'v1.0'}</td>
      <td>{'learning_rate': 0.5, 'layers': [10, 3, 1], '...</td>
      <td>{'a_label': 'some-value'}</td>
      <td>{}</td>
    </tr>
  </tbody>
</table>
</div>



You can see the output includes the labels.
Labels are particularly helpful when monitoring many (versions of) models in production, both with regard to system and model performance, as both can affect the overall user experience; a bad prediction (e.g. recommendation) from a responsive service negatively affects the user experience, as does an unresponsive service with good predictions.
Model as well as system performance metrics need to be tracked over time and across versions to ensure a solid user experience.
With (shared) labels it's possible to monitor both simultaneously.

## How to Track Lineage
The same is true of executions and artifacts that belong to certain models


```python
model_events = ws.store.get_events_by_artifact_ids([model.id])

execution_ids = set(e.execution_id for e in model_events)
print(f"Executions related to the model: {execution_ids}")

trainer_events = ws.store.get_events_by_execution_ids([exec.id])
artifact_ids = set(e.artifact_id for e in trainer_events)
print(f"Artifacts related to the trainer: {artifact_ids}")
```

    Executions related to the model: {19, 20}
    Artifacts related to the trainer: {25, 26, 27}

