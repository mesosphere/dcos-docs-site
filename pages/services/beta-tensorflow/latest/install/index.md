---
layout: layout.pug
navigationTitle:
excerpt:
title: Install and Customize
menuWeight: 20
model: /services/beta-tensorflow/data.yml
render: mustache
---

#include /services/include/install1.tmpl

## Running custom models

The default {{ model.techName }} installation runs a simple example that is used as a sanity check. In order to use {{ model.techShortName }} to train a machine learning model, the model must be specified as custom installation options.

<!-- TODO: Add mnist URL -->
For example, consider an existing model archive at `https://uri.path.to.model/models.tar.gz` that contains a `models/mnist.py` file defining an [MNIST](https://TODO.ADD.URL) model. If we wanted to start a {{ model.techName }} service with the name `{{ model.serviceName }}-models-mnist`, using three GPU workers each with two GPUs and a single parameter server, create an `options.json` file with the following contents:
```json
{
  "service": {
    "name": "{{ model.serviceName }}-models-mnist",
    "job_url":"https://uri.path.to.model/models.tar.gz",
    "job_path": "models",
    "job_name": "mnist",
  },
  "gpu_worker": {
    "count": 3,
    "gpus": 2
  },
  "parameter_server": {
    "count": 1
  }
}
```

The service (starting the model training) can then be installed using the command:
```bash
$ dcos package install {{ model.packageName }} --options=options.json
```

<!-- TODO: Check the relative link -->
For more information on how to define a DC/OS {{ model.techShortName }} model, see the [../model-definition] documentation. More options for configuring the {{ modlel.techName }} service are listed in the [../configuration] documentation.

#include /services/include/install2.tmpl
