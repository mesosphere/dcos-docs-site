---
layout: layout.pug
navigationTitle: Quick Start
title: Quick Start
beta: false
menuWeight: 0
---

The Kaptain SDK provides a high-level API to support model development workflows and deals with Kubernetes specifics for the
users' benefit. The main building blocks required for model development are a user-provided model definition,
training source code, and a configured instance of the `Model` class from the SDK.

The SDK automatically packs user-provided files into a Docker image which is then used in the model training and
tuning. The SDK also provides utilities to simplify the export of the trained models to the supported storage locations.

# Using the SDK from a Jupyter Notebook

## Configure Docker credentials

In order to use the SDK from a Jupyter Notebook, you must configure credentials for accessing a Docker
registry. It is recommended to distribute registry configuration and credentials by following the
[Accessing Docker and Cloud Storage][credentials] guide.

However, for a quick start, it is also sufficient to create a valid Docker credentials file from a notebook
running in Kaptain. The file has the following format and must be saved at `$HOME/.docker/config.json`:

    {
        "auths": {
                "https://index.docker.io/v1/": {
                        "auth": "<username and password in base64>"
                }
        }
    }

The `auth` field is a base64-encoded string of the form `<username>:<password>` where `<username>` and `<password>` are
the actual username and password used to login to Docker registry. To generate the value for the `auth` field, use the following
command: `echo -n "<username>:<password>" | base64`.

<p class="message--note">
<strong>NOTE: </strong>You can also inject your docker credentials by creating a secret and
mounting it at <code>/home/kaptain/.docker/config.json</code>.  See the <a href="../credentials/">credentials documentation</a> for more details.
</p>

## Prepare the model training

### Tensorflow

What follows is an example of how to deploy a training model for MNIST image classification:

1.  Create a file named `train.py` with the following contents:

    ```
    import argparse
    import tensorflow as tf

    from kaptain.platform.model_export_util import ModelExportUtil


    def main():
        # We need to expose hyperparameters so that we can pass different values during the
        # training and tuning without the need of rebuilding the model image.

        parser = argparse.ArgumentParser(description="TensorFlow MNIST Training Job")
        parser.add_argument(
            "--epochs",
            type=int,
            default=5,
            metavar="N",
            help="Number of epochs to train (default: 5)",
        )
        parser.add_argument(
            "--steps",
            type=int,
            default=10,
            metavar="N",
            help="Number of batches to train the model on in each epoch (default: 10)",
        )
        args, _ = parser.parse_known_args()

        # import MNIST dataset
        mnist = tf.keras.datasets.mnist

        (x_train, y_train), (x_test, y_test) = mnist.load_data()
        x_train, x_test = x_train / 255.0, x_test / 255.0

        # define and compile the model
        model = tf.keras.models.Sequential(
            [
                tf.keras.layers.Flatten(input_shape=(28, 28)),
                tf.keras.layers.Dense(128, activation="relu"),
                tf.keras.layers.Dropout(0.2),
                tf.keras.layers.Dense(10),
            ]
        )

        model.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])

        # train the model
        model.fit(x_train, y_train, epochs=args.epochs, steps_per_epoch=args.steps)

        # save the model locally and export it to the storage system of choice.
        model.save("mnist")
        ModelExportUtil().upload_model("mnist")


    if __name__ == "__main__":
        main()
    ```

2.  From a notebook, create an instance of the `Model` class and specify
    `train.py` as the main file:

    ```
    from kaptain.model.models import Model

    model = Model(
        id="dev/mnist",
        name="MNIST",
        description="MNIST Model",
        version="0.0.1",
        framework="tf",
        framework_version="2.4.0",
        main_file="train.py",
        base_image="mesosphere/kubeflow:1.2.0-tensorflow-2.4.0",
        image_name="mesosphere/kaptain",  # replace with your docker repository with a tag (optional), e.g. "repository/image"  or "repository/image:tag"
    )
    ```

<p class="message--note">The Docker repository passed via the <code>image_name</code> argument must exist or be created before using it.</p>

3.  Execute model training in a distributed mode using 3 workers:

```python
    model.train(
      workers=3,
      hyperparameters={"--steps": "10", "--epochs": "5"}
    )
```

4. Verify the model was exported to the default location, by launching a Notebook terminal to connect to MinIO and listing the
uploaded trained model files:

```bash
    # configure connection to the default MinIO installed as a part of Kaptain
    mc --no-color alias set minio http://minio.kubeflow minio minio123

    # list the files located in the kaptain models bucket
    mc --no-color ls -r minio/kaptain/models

    # example output
    [2021-05-19 19:32:14 UTC]  99KiB dev/mnist/trained/3af79dcf3e784d4788af4973a9f30d88/0001/saved_model.pb
    [2021-05-19 19:32:14 UTC] 2.7MiB dev/mnist/trained/3af79dcf3e784d4788af4973a9f30d88/0001/variables/variables.data-00000-of-00001
    [2021-05-19 19:32:14 UTC] 1.5KiB dev/mnist/trained/3af79dcf3e784d4788af4973a9f30d88/0001/variables/variables.index
    ...
```

6.  Deploy the model to start serving:

```python
model.deploy()

# example output
NAME                 READY      DEFAULT_TRAFFIC CANARY_TRAFFIC  URL
dev-mnist            Unknown
dev-mnist            False
dev-mnist            False
dev-mnist            False
dev-mnist            True       100                             http://dev-mnist.demo.example.com
```

Follow the [Kaptain SDK][kaptain_sdk] tutorial for more detailed information.

## Environment Variables

Several environment variables can be specified to modify some of the behavior of the SDK:

- **KAPTAIN_SDK_VERBOSE**: will set the output to show all of pod logs and any event related to Job, Pods, Secrets, and
    Service Accounts.
- **KAPTAIN_SDK_LOG_TIMEFORMAT**: a string used to change the format of the log date time from the default "%Y-%m-%d
    %H:%M:%S,%f" following strftime format.
- **KAPTAIN_SDK_DEBUG**: will set the logging level to DEBUG for Kaptain related logging.

A `"true"` value is any of `"true"`, `"yes"`, `"y"`, or `"1"`, anything else is interpreted as `"false"`. Changing the environment
variables `KAPTAIN_SDK_LOG_TIMEFORMAT` and `KAPTAIN_SDK_DEBUG` only take effect if used at the beginning of the script or
Notebook.

You can also change these environment variables from Python/Jupyter using the variables in `kaptain.envs`. Changing them this way
will make the changes take effect immediately for all.

```python
import kaptain.envs as envs   # (showing default values)

envs.DEBUG = False
envs.VERBOSE = False
envs.LOG_TIMEFORMAT = "%Y/%m/%d %H:%M:%S,%f"
```
[credentials]: ../credentials/
[kaptain_sdk]: ../../../tutorials/sdk
