---
layout: layout.pug
navigationTitle: Model training and inference with scikit-learn and Feast
title: Model training and inference with scikit-learn and Feast
menuWeight: 10
excerpt: Tutorial for Model training and inference with scikit-learn and Feast
beta: false
enterprise: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

[//]: # "WARNING: This page is auto-generated from Jupyter notebooks and should not be modified directly."

<p class="message--note"><strong>NOTE: </strong>All tutorials in Jupyter Notebook format are available for
<a href="https://downloads.d2iq.com/kaptain/d2iq-tutorials-2.2.0.tar.gz">download</a>. You can either
download them to a local computer and upload to the running Jupyter Notebook or run the following command
from a Jupyter Notebook Terminal running in your Kaptain installation:

```bash
curl -L https://downloads.d2iq.com/kaptain/d2iq-tutorials-2.2.0.tar.gz | tar xz
```

</p>
<p class="message--note"><strong>NOTE: </strong>These notebook tutorials have been built for and
tested on D2iQ's Kaptain. Without the requisite Kubernetes operators and custom Docker images, these notebooks
will likely not work.</p>


# Model training and inference with scikit-learn and Feast

## Prerequisites
- You have configured Docker credentials to be used within the notebook as shown in the [Manage Docker Credentials Tutorial
](https://docs.d2iq.com/dkap/2.2/kaptain-manage-secrets#KaptainManageSecrets-ManageDockerCredentialsTutorial).
- You have created a `Secret` with Feast environment variables and a `ConfigMap` with the Feast repository configuration. You have also mounted these to the notebook server via a `PodDefault` resource as described in the [Feature Store with Feast](https://docs.d2iq.com/dkap/2.2/feature-store-with-feast) documentation.

## About Feast

[Feast](https://feast.dev/) is a highly-customizable data system that allows managing and serving machine learning features to real-time models.

Feast allows ML platform teams to:
- Make features consistently available for training and serving by managing an offline store (to process historical data for scale-out batch scoring or model training), and a low-latency online store (for real-time prediction).
- Avoid data leakage by producing the point-in-time correct feature sets, so data scientists can focus on feature engineering rather than debugging error-prone dataset joining logic.
- Decouple ML from data infrastructure by providing a single data access layer that abstracts feature storage from feature retrieval, ensuring model portability when moving from training models to serving models, from batch models to real-time models, as well as from one data infrastructure to another.

## What you will learn
This notebook shows how to:
- Deploy a local feature store with a Parquet file offline store, Redis online store and scalable registry based on MySQL
- Build a training dataset using the time series features from our Parquet files
- Train a simple wine class recognition model with scikit-learn using the generated training dataset
- Materialize batch features and streaming features (via a Push API) into the online store
- Implement a transformer component to read the latest features from the online store for real-time inference
- Deploy the model and run the inference

## Prepare the dataset

For this tutorial, you will use the [wine recognition dataset](https://scikit-learn.org/stable/datasets/toy_dataset.html#wine-dataset) to build your model. Feast supports file data sources stored on disk or on S3. Currently, only Parquet files are supported.


```python
# Import required packages
import warnings

with warnings.catch_warnings():
    warnings.filterwarnings("ignore",category=DeprecationWarning)
    import pandas as pd
    
    import os
    from sklearn import datasets

    from datetime import datetime, timedelta
    
    from feast import Entity, Field, FeatureView, FileSource, ValueType, FeatureStore
    from feast.types import Float32, Int64
    from feast import FeatureStore

    from kaptain import envs
    from kaptain.model.models import Model
    from kaptain.model.frameworks import ModelFramework

    from kaptain.platform.image_builder_util import ImageBuilderUtil
    from kaptain.platform.constants import CONFIG_MAP_KIND, SECRET_KIND
    from kaptain.platform.serving.transformer import Transformer
```


```python
# Load a toy dataset into a DataFrame
data = datasets.load_wine()
data_df = pd.DataFrame(data=data.data, columns=data.feature_names)
print(data_df.head())
```

       alcohol  malic_acid   ash  alcalinity_of_ash  magnesium  total_phenols  \
    0    14.23        1.71  2.43               15.6      127.0           2.80   
    1    13.20        1.78  2.14               11.2      100.0           2.65   
    2    13.16        2.36  2.67               18.6      101.0           2.80   
    3    14.37        1.95  2.50               16.8      113.0           3.85   
    4    13.24        2.59  2.87               21.0      118.0           2.80   
    
       flavanoids  nonflavanoid_phenols  proanthocyanins  color_intensity   hue  \
    0        3.06                  0.28             2.29             5.64  1.04   
    1        2.76                  0.26             1.28             4.38  1.05   
    2        3.24                  0.30             2.81             5.68  1.03   
    3        3.49                  0.24             2.18             7.80  0.86   
    4        2.69                  0.39             1.82             4.32  1.04   
    
       od280/od315_of_diluted_wines  proline  
    0                          3.92   1065.0  
    1                          3.40   1050.0  
    2                          3.17   1185.0  
    3                          3.45   1480.0  
    4                          2.93    735.0  


Split the dataset into the arbitrary set of features. Next, add two generated columns: event timestamp and arbitrary IDs for feature rows.<br>*Event timestamps* are used during point-in-time joins to ensure that the latest feature values are joined from feature views onto entity rows. Feast also uses them to ensure that old feature values are not served to models during online serving.<br>The *join key* is used to identify the physical primary key on which feature values should be joined together to be retrieved during feature retrieval. Lastly, export DataFrame objects to Parquet files.


```python
# Split the dataset into arbitrary sets of features
data_df1 = data_df[data.feature_names[:7]]
data_df2 = data_df[data.feature_names[7:13]]
target_df = pd.DataFrame(data=data.target, columns=["target"])

# Create timestamps
timestamps = pd.date_range(
    end=pd.Timestamp.now(),
    periods=len(data_df),
    freq='S').to_frame(name="event_timestamp", index=False)

# Create a list of arbitrary IDs for feature rows
wine_sample_ids = pd.DataFrame(data=list(range(len(data_df))), columns=["wine_sample_id"])

# Add the timestamp and ID columns to each DataFrame
data_df1 = pd.concat(objs=[wine_sample_ids, timestamps, data_df1], axis=1)
data_df2 = pd.concat(objs=[wine_sample_ids, timestamps, data_df2], axis=1)
target_df = pd.concat(objs=[wine_sample_ids, timestamps, target_df], axis=1)

# Write DataFrames to Parquet files
data_df1.to_parquet(path='df1.parquet')
data_df2.to_parquet(path='df2.parquet')
target_df.to_parquet(path='target_df.parquet')
```

## Register feature definitions and deploy your feature store

An *Entity* is a collection of semantically related features. Features are grouped together with *Feature Views*. Feature Views map zero, one or multiple entities.<br>In the next cell, you will define an entity with a name `wine` and `wine_sample_id` as an entity join key. Feature data for each *Feature View* can be stored in different data sources.


```python
# Declare an entity for the dataset
wine = Entity(name="wine", join_keys=["wine_sample_id"])

# Declare the source for the first set of features
f_source1 = FileSource(
    path=r"df1.parquet",
    timestamp_field="event_timestamp"
)

# Define the first set of features
df1_fv = FeatureView(
    name="df1_feature_view",
    ttl=timedelta(days=1),
    entities=[wine],
    schema=[
        Field(name="alcohol", dtype=Float32),
        Field(name="malic_acid", dtype=Float32),
        Field(name="ash", dtype=Float32),
        Field(name="alcalinity_of_ash", dtype=Float32),
        Field(name="magnesium", dtype=Float32),
        Field(name="total_phenols", dtype=Float32),
        Field(name="flavanoids", dtype=Float32)
        ],
    source=f_source1
)

# Declare the source for the second set of features
f_source2 = FileSource(
    path=r"df2.parquet",
    timestamp_field="event_timestamp"
)

# Define the second set of features
df2_fv = FeatureView(
    name="df2_feature_view",
    ttl=timedelta(days=3),
    entities=[wine],
    schema=[
        Field(name="nonflavanoid_phenols", dtype=Float32),
        Field(name="proanthocyanins", dtype=Float32),
        Field(name="color_intensity", dtype=Float32),
        Field(name="hue", dtype=Float32),
        Field(name="od280/od315_of_diluted_wines", dtype=Float32),
        Field(name="proline", dtype=Float32)
        ],
    source=f_source2
)

# Declare the source of the targets
target_source = FileSource(
    path=r"target_df.parquet",
    timestamp_field="event_timestamp"
)

# Define the targets
target_fv = FeatureView(
    name="target_feature_view",
    entities=[wine],
    ttl=timedelta(days=3),
    schema=[
        Field(name="target", dtype=Int64)
        ],
    source=target_source
)
```

    Feast is an open source project that collects anonymized error reporting and usage statistics. To opt out or learn more see https://docs.feast.dev/reference/usage


Once the required `Entities` and corresponding `FeatureViews` are defined, you are ready to deploy the feature store:


```python
store = FeatureStore(repo_path="wine")
store.apply([wine, df1_fv, df2_fv, target_fv])
```

The features have been registered - now you can build a training dataset using our time series features from our Parquet files:


```python
store = FeatureStore(repo_path="wine")

# Read our targets as an entity DataFrame
entity_df = pd.read_parquet(path="target_df.parquet")

# Get the indicated historical features
# and join them with our entity DataFrame
training_data = store.get_historical_features(
    entity_df=entity_df,
    features=[
        "df1_feature_view:alcohol",
        "df1_feature_view:malic_acid",
        "df1_feature_view:ash",
        "df1_feature_view:alcalinity_of_ash",
        "df1_feature_view:magnesium",
        "df1_feature_view:total_phenols",
        "df1_feature_view:flavanoids",
        "df2_feature_view:nonflavanoid_phenols",
        "df2_feature_view:proanthocyanins",
        "df2_feature_view:color_intensity",
        "df2_feature_view:hue",
        "df2_feature_view:od280/od315_of_diluted_wines",
        "df2_feature_view:proline"
    ]
)

training_data.to_df().to_parquet(path='wine_dataset.parquet')
```

## Train the model with the generated dataset using Kaptain SDK

Next, you will define the training code for the new model. The script accepts a few arguments, such as dataset location, label column name (target column), as well as features that should be ignored during the training. The code lines added at the bottom of the script ensure the model training works with Kaptain SDK.


```python
%%writefile train.py
import os
import argparse
import time
import pandas as pd

from sklearn import datasets, svm, metrics
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

from joblib import dump

from kaptain.platform.model_export_util import ModelExportUtil
from kaptain.platform.metadata_util import MetadataUtil


def main():
    parser = argparse.ArgumentParser()

    # Arguments that will be passed to your training code
    parser.add_argument(
        "--dataset",
        type=str,
        default="wine_dataset.parquet",
        help="Trainig dataset location"
    )
    parser.add_argument(
        "--labels",
        type=str,
        default="target",
        help="Labels column name"
    )
    parser.add_argument(
        "--ignore-features",
        type=str, nargs="+",
        default=["target", "event_timestamp", "wine_sample_id"],
        help="A list of features to exclude from the training dataset."
    )


    args, _ = parser.parse_known_args()

    # Retrieve the saved dataset and convert it to a DataFrame
    training_df = pd.read_parquet(args.dataset)

    # Separating the features and labels
    labels = training_df[args.labels]
    features = training_df.drop(
        labels=args.ignore_features,
        axis=1)

    # Split the dataset into train and test sets
    X_train, X_test, y_train, y_test = train_test_split(features,
                                                        labels,
                                                        test_size=0.1,
                                                        random_state=1,
                                                        stratify=labels)

    # Create and train LogisticRegression
    model = LogisticRegression(max_iter=4000)

    model.fit(X=X_train[sorted(X_train)], y=y_train)

    # Predict the value of the digit on the test subset
    predicted = model.predict(X_test[sorted(X_test)])

    print(
        f"Classification report for classifier {model}:\n"
        f"{metrics.classification_report(y_test, predicted)}\n"
    )

    cm = metrics.confusion_matrix(y_test, predicted)
    print(f"Confusion matrix:\n{cm}")

    score = model.score(X_test[sorted(X_test)], y_test)
    print(f"\nModel accuracy: {score}")

    # Save the model
    model_upload_path = os.getenv("TRAINED_MODEL_UPLOAD_PATH")
    if model_upload_path:
        model_file_name = "model.joblib"

        print(f"Exporting model to {model_upload_path}/{model_file_name} ...")

        dump(model, model_file_name)
        ModelExportUtil().upload_model(model_file_name)

        print("Export completed.")

        # Record model accuracy metrics
        MetadataUtil.record_metrics({"accuracy": score})

        # Because the job executes too quickly, we need to wait to allow the metric collector container fetch the metrics
        time.sleep(10)

if __name__ == "__main__":
    main()
```

Verify that the training code is working correctly:


```sh
%%sh
python train.py
```

    Classification report for classifier LogisticRegression(max_iter=4000):
                  precision    recall  f1-score   support
    
               0       1.00      1.00      1.00         6
               1       1.00      1.00      1.00         7
               2       1.00      1.00      1.00         5
    
        accuracy                           1.00        18
       macro avg       1.00      1.00      1.00        18
    weighted avg       1.00      1.00      1.00        18
    
    
    Confusion matrix:
    [[6 0 0]
     [0 7 0]
     [0 0 5]]
    
    Model accuracy: 1.0


It works! The example you are using for this tutorial is simple and doesn't require a lot of memory to accommodate the data or processing power to run the training, so it can be run inside the notebook.<br>But what if you need to allocate resources to perform the training that are available outside the notebook? What if you need to schedule a job on a node with GPU to speed up the training process?<br>The Kaptain SDK can help you achieve that! With the Kaptain SDK, your can schedule a training job on the Kubernetes cluster without a single line of YAML code.

First, you need to define the model parameters, such as base image, target image name and extra files to pack into the image - in this case, the training dataset is stored as a Parquet file.


```python
base_image = "mesosphere/kubeflow:2.2.0-base"
image_name = "mesosphere/kubeflow:wine-recognition-sklearn"
```


```python
dataset_file = "wine_dataset.parquet"
extra_files = [dataset_file]
```

Next, you need to instantiate an object of the `Model` class and set some metadata along the previously defined parameters.


```python
envs.VERBOSE = True

model = Model(
    id="dev/wine",
    name="Wine Classification",
    description="Wine Classification Model",
    version="0.0.1",
    framework=ModelFramework.SKLEARN,
    framework_version="1.1.2",
    main_file="train.py",
    image_name=image_name,
    base_image=base_image,
    extra_files=extra_files
)
```

Define the resources you want to allocate for the training job, such as number of CPUs, GPUs and memory.


```python
gpus = 0  # assing GPU if needed
memory = "1G"
cpu = "1"
```

The model has been initialized - you can run the `train()` method to launch the training job on the cluster. The job will build the target image that will be used for the training job, including the training code and the dataset.


```python
model.train(
    cpu=cpu,
    memory=memory,
    gpus=gpus,
    hyperparameters={},
    args={"--dataset": dataset_file},
)
```

    2022-10-05 10:52:45,594 kaptain-log[INFO]: Building Docker image.
    2022-10-05 10:52:45,595 kaptain-log[INFO]: Creating secret docker-b45f4141b3fc0adb in namespace user1.
    2022-10-05 10:52:45,607 kaptain-log[INFO]: Creating secret context-b45f4141b3fc0adb in namespace user1.
    2022-10-05 10:52:45,612 kaptain-log[INFO]: Creating job kaniko-b45f4141b3fc0adb in namespace user1.
    2022-10-05 10:52:51,026 kaptain-log[INFO]: Waiting for Image Build to start...
    2022-10-05 10:52:52,226 kaptain-log[INFO]: Image Build started in pod: kaniko-b45f4141b3fc0adb-4l9f6.
    <...>
    2022-10-05 10:55:52,827 kaptain-log[INFO]: Image build completed successfully. Image pushed: mesosphere/kubeflow:wine-recognition-sklearn
    2022-10-05 10:55:52,828 kaptain-log[INFO]: Deleting job kaniko-b45f4141b3fc0adb in namespace user1.
    2022-10-05 10:55:52,838 kaptain-log[INFO]: Deleting secret docker-b45f4141b3fc0adb in namespace user1.
    2022-10-05 10:55:52,848 kaptain-log[INFO]: Deleting secret context-b45f4141b3fc0adb in namespace user1.
    2022-10-05 10:55:52,875 kaptain-log[INFO]: Creating secret train-d6559c3972d8a46f in namespace user1.
    2022-10-05 10:55:52,893 kaptain-log[INFO]: Creating secret train-registry-b533d50e179dd246 in namespace user1.
    2022-10-05 10:55:52,900 kaptain-log[INFO]: Submitting a new training job "wine-classification-job-3468c056".
    2022-10-05 10:55:52,901 kaptain-log[INFO]: Creating job wine-classification-job-3468c056 in namespace user1.
    2022-10-05 10:55:52,920 kaptain-log[INFO]: Waiting for the training job to complete...
    2022-10-05 10:55:58,317 kaptain-log[INFO]: Waiting for Master Node Training Model to start...
    2022-10-05 10:56:59,969 kaptain-log[INFO]: Master Node Training Model started in pod: wine-classification-job-3468c056-zk8jm.
    2022-10-05 10:57:12,576 kaptain-log[INFO]: [wine-classification-job-3468c056-zk8jm/sklearn] logs:
    Classification report for classifier LogisticRegression(max_iter=4000):
                  precision    recall  f1-score   support
               0       1.00      1.00      1.00         6
               1       1.00      1.00      1.00         7
               2       1.00      1.00      1.00         5
        accuracy                           1.00        18
       macro avg       1.00      1.00      1.00        18
    weighted avg       1.00      1.00      1.00        18
    Confusion matrix:
    [[6 0 0]
     [0 7 0]
     [0 0 5]]
    Model accuracy: 1.0
    Exporting model to s3://kaptain/models/dev/wine/trained/3f32e7e45b2d4070b23a9d7ded4fc914/model.joblib ...
    Export completed.
    2022-10-05 10:57:13,593 kaptain-log[INFO]: Deleting secret train-d6559c3972d8a46f in namespace user1.
    2022-10-05 10:57:13,599 kaptain-log[INFO]: Deleting secret train-registry-b533d50e179dd246 in namespace user1.
    2022-10-05 10:57:13,605 kaptain-log[INFO]: Model training is completed.


## Ingest batch features into an online store

Serialize the latest values of features since the beginning of time to prepare for serving with `materialize-incremental()`. This serializes all new features since the last materialize call.


```python
store.materialize_incremental(end_date=datetime.now())
```

    Materializing [1m[32m3[0m feature views to [1m[32m2022-10-05 11:05:32+00:00[0m into the [1m[32mredis[0m online store.
    
    [1m[32mdf1_feature_view[0m from [1m[32m2022-10-04 11:05:32+00:00[0m to [1m[32m2022-10-05 11:05:32+00:00[0m:


    100%|████████████████████████████████████████████████████████████| 178/178 [00:00<00:00, 931.91it/s]


    [1m[32mdf2_feature_view[0m from [1m[32m2022-10-02 11:05:33+00:00[0m to [1m[32m2022-10-05 11:05:32+00:00[0m:


    100%|██████████████████████████████████████████████████████████| 178/178 [00:00<00:00, 10743.64it/s]


    [1m[32mtarget_feature_view[0m from [1m[32m2022-10-02 11:05:33+00:00[0m to [1m[32m2022-10-05 11:05:32+00:00[0m:


    100%|██████████████████████████████████████████████████████████| 178/178 [00:00<00:00, 14410.63it/s]


## Implement a KServe Transformer component

The *Transformer* is an *InferenceService* component that performs pre- and post-processing alongside with model inference. The most common use-case for using transformers is to convert raw input to the input format the model server supports. To learn more about creating your own transformer, refer to the [KServe documentation](https://kserve.github.io/website/master/modelserving/v1beta1/transformer/torchserve_image_transformer/).

In the next cell, you will implement your own transformer by extending the `kserve.Model` class and by implementing the `preprocess` method to retrieve the latest features from the Feast online store.


```python
%%writefile transformer.py

import argparse
import logging
import kserve

from typing import List, Dict
from feast import FeatureStore

logging.basicConfig(level=kserve.constants.KSERVE_LOGLEVEL)


class WineTransformer(kserve.Model):
    """KServe transformer for online feature augmentation as part of preprocessing.

    Args:
        kserve (class object): The Model class from the KServe
        module is passed here.
    """
    def __init__(self, name: str,
                 predictor_host: str,
                 entity_ids: List[str],
                 features: List[str],
                 feast_project_path: str):
        super().__init__(name)
        self.predictor_host = predictor_host
        self.entity_ids = entity_ids
        self.features = features
        self.feast_project_path = feast_project_path

        logging.info("Model name: %s", name)
        logging.info("Predictor host: %s", predictor_host)
        logging.info("Entity ids: %s", entity_ids)
        logging.info("Features: %s", features)
        logging.info("Feast project path: %s", feast_project_path)

    def preprocess(self, inputs: Dict) -> Dict:
        """Pre-process inference requiest by extracting the features based on the record ids.
        Args:
            inputs (Dict): http request
        Returns:
            Dict: Returns the request input after ingesting online features
        """
        # Initialize FeastStore from the existing configuration
        store = FeatureStore(repo_path="wine")

        # Get the latest features from Feast online store
        feast_features = store.get_online_features(
            features=self.features,
            entity_rows=inputs["instances"]
        ).to_dict()

        feast_features = dict(sorted(feast_features.items()))
        for entity_id in self.entity_ids:
            feast_features.pop(entity_id)
        outputs = {"instances": [list(i) for i in zip(*feast_features.values())]}

        logging.info("The input for model predict is %s", outputs)

        return outputs

    def postprocess(self, inputs: List) -> List:
        logging.info("The output from model predict is %s", inputs)

        return inputs


if __name__ == "__main__":
    parser = argparse.ArgumentParser(parents=[kserve.model_server.parser])
    parser.add_argument(
        "--predictor_host",
        help="The URL for the model predict function", required=True
    )
    parser.add_argument(
        "--model_name", default="model_name",
        help='The name that the model is served under.')
    parser.add_argument(
        "--feast_project_path", default="wine",
        help='Path to the folder where the feature_store.yaml file is stored.')
    parser.add_argument(
        "--entity_ids",
        type=str, nargs="+",
        help="A list of entity ids to use as join keys in the feature store.",
        required=True)
    parser.add_argument(
        "--features",
        type=str, nargs="+",
        help="A list of features to retrieve from the feature store.",
        required=True)

    args, _ = parser.parse_known_args()
    transformer = WineTransformer(
        name=args.model_name,
        predictor_host=args.predictor_host,
        entity_ids=args.entity_ids,
        features=args.features,
        feast_project_path=args.feast_project_path)
    kfserver = kserve.ModelServer()
    kfserver.start(models=[transformer])
```

Transformer code is executed in a container, which means you need to build an image. Kaptain SDK provides an API, that allows you to build and publish images without even leaving the notebook.<br>All you have to do is define the `Dockerfile` with a set of instructions to set up the environment and allow the transformer script to run. In this example, you need to have the `kserve` and `feast[readis]` packages installed, as well as `pymysql` for Feast to work with MySQL's scalable registry.<br>You also need to set the base image and the target image name to use for the transformer.


```python
transformer_image = "mesosphere/kubeflow:feast-kserve-wine-transformer"
```


```python
from_image = "python:3.9-slim-buster"
main_file = "transformer.py"

dockerfile = f'''
FROM {from_image}
COPY {main_file} .
RUN pip install kserve==0.9.0 \
     && pip install feast[redis]==0.25.0 pymysql==1.0.2
ENTRYPOINT ["python", "-u", "{main_file}"]
'''

builder = ImageBuilderUtil.builder(
  image_name=transformer_image,
  dockerfile_content=dockerfile,
  files=[main_file]
)
builder.build_image()
```

    2022-10-05 11:24:59,728 kaptain-log[INFO]: Building Docker image.
    2022-10-05 11:24:59,728 kaptain-log[INFO]: Creating secret docker-4a4a7fda8815e4c7 in namespace user1.
    2022-10-05 11:24:59,750 kaptain-log[INFO]: Creating secret context-4a4a7fda8815e4c7 in namespace user1.
    2022-10-05 11:24:59,756 kaptain-log[INFO]: Creating job kaniko-4a4a7fda8815e4c7 in namespace user1.
    2022-10-05 11:25:05,169 kaptain-log[INFO]: Waiting for Image Build to start...
    2022-10-05 11:25:06,673 kaptain-log[INFO]: Image Build started in pod: kaniko-4a4a7fda8815e4c7-lf4xr.
    <...>
    2022-10-05 11:28:47,306 kaptain-log[INFO]: Image build completed successfully. Image pushed: mesosphere/kubeflow:feast-kserve-wine-transformer
    2022-10-05 11:28:47,307 kaptain-log[INFO]: Deleting job kaniko-4a4a7fda8815e4c7 in namespace user1.
    2022-10-05 11:28:47,317 kaptain-log[INFO]: Deleting secret docker-4a4a7fda8815e4c7 in namespace user1.
    2022-10-05 11:28:47,323 kaptain-log[INFO]: Deleting secret context-4a4a7fda8815e4c7 in namespace user1.


## Deploy the model and run the inference

Once the transformer image has been pushed to the registry, you are ready to deploy your model. A `Transformer` object is initialized with the image name, the arguments to pass into the container, and the Feast configuration. The name of the `ConfigMap` contains the repository configuration file (`feast_repository.yaml`), and the `Secret` with the environment variables (refer to the "Prerequisites" section for more details).


```python
model.deploy(
    transformer=Transformer(
        image_name=transformer_image,
        args=[
            "--feast_project_path",
            "/wine",
            "--entity_ids",
            "wine_sample_id",
            "--features",
            "df1_feature_view:alcohol",
            "df1_feature_view:malic_acid",
            "df1_feature_view:ash",
            "df1_feature_view:alcalinity_of_ash",
            "df1_feature_view:magnesium",
            "df1_feature_view:total_phenols",
            "df1_feature_view:flavanoids",
            "df2_feature_view:nonflavanoid_phenols",
            "df2_feature_view:proanthocyanins",
            "df2_feature_view:color_intensity",
            "df2_feature_view:hue",
            "df2_feature_view:od280/od315_of_diluted_wines",
            "df2_feature_view:proline"],
        volumes=[
            {
                "name": "feature-store",
                "type": CONFIG_MAP_KIND,
                "path": "/wine"
            },
        ],
        env_from={
            "name": "feast-conf",
            "type": SECRET_KIND
        }
    )
)
```

    2022-10-05 12:11:12,142 kaptain-log[INFO]: Building deployment artifacts and uploading to s3://kaptain/models/dev/wine/deploy/3f0972e5222947bb9422e30eb7bbc90a
    2022-10-05 12:11:12,229 kaptain-log[INFO]: Deploying model from s3://kaptain/models/dev/wine/deploy/3f0972e5222947bb9422e30eb7bbc90a
    2022-10-05 12:11:12,231 kaptain-log[INFO]: Reading secrets dev-wine-secret in namespace user1.
    2022-10-05 12:11:12,241 kaptain-log[INFO]: Creating secret dev-wine-secret in namespace user1.
    2022-10-05 12:11:12,248 kaptain-log[INFO]: Reading service account dev-wine-service-account in namespace user1.
    2022-10-05 12:11:12,254 kaptain-log[INFO]: Creating service account dev-wine-service-account in namespace user1.


    NAME                 READY      PREV                      LATEST                    URL                                                              
    dev-wine             Unknown                                                                                                                         
    dev-wine             Unknown                                                                                                                         
    dev-wine             Unknown    0                         100                                                                                        
    dev-wine             True       0                         100                       http://dev-wine.user1.example.com                                


    2022-10-05 12:12:25,257 kaptain-log[INFO]: Model dev/wine deployed successfully. Cluster URL: http://dev-wine.user1.svc.cluster.local


The model is ready to serve the inference requests. Each request is pre-processed in the transformer by enriching the input with recent features from the Feast online store based on the entity join key. Transformed input is then passed to the predictor. As a response, we expect the model to determine wine class (Class 0, 1 or 2) based on the sample characteristics.


```bash
%%bash
set -o errexit

# Prepare the request payload and save it to input.json
cat << EOF > input.json
{
    "instances": [
        {"wine_sample_id": 123},
        {"wine_sample_id": 10},
        {"wine_sample_id": 167}
    ]
}
EOF

# Build the model inference URL and submit the request
model_name="dev-wine"
namespace=$(cat /var/run/secrets/kubernetes.io/serviceaccount/namespace)

model_url=http://${model_name}.${namespace}.svc.cluster.local/v1/models/${model_name}:predict

# Wait until all model components are fully deployed
until curl -s -f -o /dev/null "http://${model_name}-predictor-default.${namespace}.svc.cluster.local/v1/models/${model_name}"; do sleep 10; done

# Send a prediction request
curl --location \
     --silent \
     --fail \
     --retry 10 \
     --retry-max-time 300 \
     --retry-connrefused \
     --header "Content-Type: application/json" \
     ${model_url} \
     -d@input.json | python -m json.tool
```

    {
        "predictions": [
            1,
            0,
            2
        ]
    }


This tutorial includes code from the MinIO Project (“MinIO”), which is © 2015-2021 MinIO, Inc. MinIO is made available subject to the terms and conditions of the [GNU Affero General Public License 3.0](https://www.gnu.org/licenses/agpl-3.0.en.html). The complete source code for the versions of MinIO packaged with Kaptain 2.1.0 are available at these URLs: [https://github.com/minio/minio/tree/RELEASE.2021-02-14T04-01-33Z](https://github.com/minio/minio/tree/RELEASE.2021-02-14T04-01-33Z) and [https://github.com/minio/minio/tree/RELEASE.2022-02-24T22-12-01Z](https://github.com/minio/minio/tree/RELEASE.2022-02-24T22-12-01Z)

For a full list of attributed 3rd party software, see d2iq.com/legal/3rd
