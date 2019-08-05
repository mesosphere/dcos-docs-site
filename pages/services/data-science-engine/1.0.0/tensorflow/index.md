---
layout: layout.pug
navigationTitle: TensorFlow
excerpt: TensorFlow with DC/OS Data Science Engine
title: HDFS
menuWeight: 4
model: /services/data-science-engine/data.yml
render: mustache
---

# TensorFlow

[TBD]

# TensorFlow on Spark

[TBD]

# TensorBoard

{{ model.techName }} comes with TensorBoard installed. It can be found at
`http://<dcos-url>/service/{{model.serviceName}}/tensorboard/`.

## Log directory

TensorBoard reads log data from specific directory, with the default being `/mnt/mesos/sandbox`. It can be changed
with `advanced.tensorboard_logdir` option. HDFS paths are supported as well.

Here is an example:

1. Install HDFS:

    ```bash
    dcos package install hdfs
    ```

2. Install {{ model.packageName }} with overridden log directory option:

    ```bash
    dcos package install --options=dse-options.json {{ model.serviceName }}
   ```

    With `dse-options.json` having the following content:

    ```json
    {
      "advanced": {
        "tensorboard_logdir": "hdfs://tf_logs"
      }
    }
    ```

3. Open TensorBoard at `https://<dcos-url>/service/{{ model.serviceName }}/tensorboard/` and confirm the change.

## Disabling TensorBoard

{{ model.techName }} can be installed with TensorBoard disabled by using the following configuration:

```json
{
  "advanced": {
    "start_tensorboard": false
  }
}
```
