---
layout: layout.pug
navigationTitle: Serving PyTorch Models 
title: Serving PyTorch Models
beta: false
menuWeight: 5
---

Serving PyTorch Models with Kaptain SDK

Kaptain supports PyTorch model serving with TorchServe. This requires a specific project files organization
in order to load and serve previously exported model. This page contains various details of the
TorchServe-specific configuration.

## Defining PyTorch Models
TorchServe requires a model definition and the state_dict in order to load and initialize a model for serving.
From the project organization perspective this means that the trainer code and the model class should be defined
in different files. For example: `model.py` for the model class, and `trainer.py` for the trainer code.

The trainer code will contain an import of the model python module so that the same model definition
is used for training, tuning, and serving. Check the [PyTorch notebook tutorial](../../../tutorials/sdk/pytorch)
for examples of the model and the trainer files.

It is important to include the model file as a dependency via `Model.extra_files` so that is present in the
target Docker image and is available for import. For example:
```
model = Model(
    <other properties>
    main_file="trainer.py",
    extra_files=["model.py"],
)
```

### Transfer Learning
For cases when a model extends another pre-trained model (for example,
from [torchvision.models](https://pytorch.org/vision/stable/models.html)), the model class should
extend an existing model and override its `__init__` function to introduce desired customizations. It is
also important to make sure that all the required imports are in place. For example:
```
import torch.nn as nn
from torchvision.models.resnet import ResNet, BasicBlock


class ImageClassifier(ResNet):
    def __init__(self):
        super(ImageClassifier, self).__init__(BasicBlock, [2,2,2,2], num_classes=10)

        self.fc = nn.Sequential(
            nn.Linear(512 * BasicBlock.expansion, 128),
            nn.ReLU(),
            nn.Dropout(.2),
            nn.Linear(128, 10),
            nn.LogSoftmax(dim=1)
        )
```

## Configuration options for model serving
Kaptain `Model` expects a dictionary of string keys and values for serving options specification.
Example:
```
model = Model(
    id="dev/mnist",
    name="MNIST",
    description="MNIST Model",
    version="0.0.1",
    framework="pytorch",
    framework_version="1.7.1",
    main_file="trainer.py",
    extra_files=["model.py"],
    base_image="base_repository/image:tag",
    image_name="target_repository/image:tag",
    serving_config={
        "model_file": "path/to/model.py",
        "handler": "image_classifier",
        "serialized_file": "path/to/model_state_dict.pt",
        "extra_files": "path/to/file_a.py,path/to/file_b.py,",
        "requirements_file": "path/to/serving_requirements.txt",
        "config_properties": "path/to/config.properties",
    },
    requirements="requirements.txt",
)
```
See the detailed explanation of the properties below.

### MAR model packaging
TorchServe requires models to be packaged in a [MAR (Model Archive)](https://github.com/pytorch/serve/tree/master/model-archiver) format.
Kaptain SDK produces a MAR artifact and supports the same properties as the MAR Archiver.
Visit [model-archiver#artifact-details](https://github.com/pytorch/serve/tree/master/model-archiver#artifact-details) for
more details about the contents of the archive.

The following `serving_config` properties are used to provide paths to the artifacts:
* `model_file` - (mandatory) a path to the file with a model definition (for example, `model.py`
* `handler` - (mandatory) either a name of a TorchServe's built-in handler, or a path
to a file with a custom inference logic. Examples: `image_classifier` (built-in), `handler.py` (custom).
See [TorchServe documentation](https://github.com/pytorch/serve/blob/master/docs/custom_service.md) for details.
* `serialized_file` - (optional) a path to the `state_dict` saved locally (for example, `model.pt`).
If not provided, the SDK will download the model `state_dict` exported at the `train` or `tune` phase.
* `extra_files` -  (optional) auxiliary files required for inference (for example, `utils.py`). If not set
explicitly, the SDK will use the `Model.extra_files` value.
* `requirements_file` - (optional) auxiliary files required for inference (for example, `utils.py`). If not set
explicitly, the SDK will use the `Model.requirements` value.

### TorchServe configuration options
TorchServe requires a `config.properties` file to provided alongside the model archive in order to load
the model and start serving it. An example `config.properties` file looks as follows:
```
inference_address=http://0.0.0.0:8085
management_address=http://0.0.0.0:8081
number_of_netty_threads=4
service_envelope=kfserving
install_py_dep_per_model=true
job_queue_size=10
model_store=/mnt/models/model-store
model_snapshot={"name": "startup.cfg", "modelCount": 1, "models": {"<YOUR_MODEL_NAME>": {"1.0": {"defaultVersion": true, "marName": "<YOUR_MODEL_NAME>.mar", "minWorkers": 1, "maxWorkers": 5, "batchSize": 1, "maxBatchDelay": 5000, "responseTimeout": 120}}}}
```

Consult [TorchServe documentation](https://github.com/pytorch/serve/blob/master/docs/configuration.md#configproperties-file)
for the full list of the supported properties.

Kaptain SDK generates the `config.properties` with a specific model name and MAR name unique for the
model during the `deploy` step. To customize the server configuration, consult
[TorchServe documentation](https://github.com/pytorch/serve/blob/master/docs/configuration.md#configproperties-file)
for the full list of the supported properties.

It is possible to generate a default `config.properties` specific for your `Model` by running the
following commands:
```
import os

from kaptain.model.models import Model
from kaptain.platform.serving.packaging.artifact_builder import TorchServingArtifactBuilder
import kaptain.utilities as util

...
# Kaptain Model instantiation
model = Model(...)
...

model_name = util.sanitize_string(model.id)
TorchServingArtifactBuilder.write_config_properties(model_name, f"{model_name}.mar", os.getcwd())
```
The code above will generate a valid `config.properties` file and write it to the current working
directory so it can be modified and provided to the model server.

To provide a path to a custom `config.properties` file, add `config_properties` to the
`serving_config` dictionary:
```
serving_config={
    "config_properties": "path/to/config.properties",
}
```
