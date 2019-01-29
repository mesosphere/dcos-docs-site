---
layout: layout.pug
navigationTitle: Examples
title: Examples
menuWeight: 100
excerpt: Demos of different installation options
featureMaturity:
enterprise: false
model: /services/beta-jupyter/data.yml
render: mustache
---

In this section we will assume the role of a Data Scientist and use [{{ model.techShortName }}](https://github.com/{{ model.packageName }}/{{ model.packageName }}) to pre-process and analyze datasets with Spark and TensorFlow.

The technologies used in this section are as follows:

- [{{ model.techShortName }}](https://github.com/{{ model.packageName }}/{{ model.packageName }})
- [HDFS](https://hadoop.apache.org/docs/r1.2.1/hdfs_user_guide.html)
- [Apache Spark](https://spark.apache.org/)
- [TensorFlow](https://www.tensorflow.org/) using the [Yahoo TensorFlowOnSpark distribution](https://github.com/yahoo/TensorFlowOnSpark)
- [Marathon-LB](https://docs.mesosphere.com/services/marathon-lb/) to expose {{ model.techShortName }} externally


- Estimated time for completion (manual installation): 20 minutes
- Target audience: Anyone interested in Data Analytics.

**Table of Contents**:

- [Prerequisites](#prerequisites)
- [Installation](#install)
- [Use the demo](#demo)


# Prerequisites
- A cluster running [DC/OS 1.11](https://dcos.io/releases/) or later,  with at least {{ model.example.nodeDescription }}. Each agent should have {{ model.example.nodeAgent }} available. 
- [DC/OS CLI](https://docs.mesosphere.com/latest/cli/install/) installed

## Optional: Terraform
If you plan to use GPU support we recommend that you use the [dcos-terraform project](https://github.com/dcos/terraform-dcos/blob/master/aws/README.md#adding-gpu-private-agents) to provision DC/OS. Please refer to the [GPU Cluster Provisioning section](https://github.com/dcos/examples/tree/master/{{ model.packageName }}/1.11#install-{{ model.packageName }}-with-gpu-support) in the README for more details.

# Installation
This section will describe how to install the HDFS service and the Marathon-LB service.

## HDFS

You can install the HDFS service from the DC/OS web interface or directly from the CLI:

```bash
$ dcos package install hdfs
```

To learn more about HDFS Service or advanced installation options, see the [HDFS service documentation](/services/hdfs/).

## Marathon-LB

In order to expose {{ model.techShortName }} externally we install [Marathon-LB](/services/marathon-lb/) using

```bash
$ dcos package install marathon-lb
```
To learn more about Marathon-LB or advanced installation options, see the [Marathon-LB documentation](/services/marathon-lb/).

## {{ model.techShortName }}

We can install {{ model.techShortName }} also from the web interface or CLI. In both cases we need to change two parameters:

1. First the `VHOST` for exposing the service on a [public agent](https://docs.mesosphere.com/latest/overview/architecture/node-types/) externally must be changed. This means changing the `networking.external_access.external_public_agent_hostname` to the externally reachable VHOST (e.g., the Public Agent ELB in an AWS environment).
We can check this using the web interface:

![VHOST configuration](/services/beta-jupyter/img/jupyterlab-VHOST_UI.png)

Figure 1. VHOST configuration

Or using a [{{ model.packageName }}_options.json](./{{ model.packageName }}_options.json) file where we need to configure the following setting;
```
"external_access": {
    "enabled": true,
    "external_public_agent_hostname": "<ADD YOUR VHOST NAME HERE *WITHOUT* trailing / NOR http://>"
}
```
2. Since we want to access datasets in HDFS during this demo, we need to configure access to HDFS by exposing the necessary config files from the previously installed HDFS. This can be done with the web interface install:

![HDFS configuration](/services/beta-jupyter/img/{{ model.packageName }}-hdfs_ui.png)

Figure 2. HDFS configuration

Or use the [{{ model.packageName }}_options.json](./{{ model.packageName }}_options.json) with the following setting:
```
"jupyter_conf_urls": "http://api.hdfs.marathon.l4lb.thisdcos.directory/v1/endpoints",
```
3. Furthermore, for better monitoring and debugging, we can enable the following two parameters either via the web interface or in [{{ model.packageName }}_options.json](./{{ model.packageName }}_options.json):
``` json
"start_spark_history_server": true,
"start_tensorboard": true,
```
4. After configuring these settings, we can install {{ model.techShortName }} either by clicking **Run Service** in the web interface:

![Install](/services/beta-jupyter/img/jupyterlab-install_ui.png)

Figure 3. Run Service

or from the CLI:

```
dcos package install {{ model.packageName }} --options={{ model.packageName }}_options.json
```

For more options for installing {{ model.techShortName }}, please refer to the [installation section](/services/jupyterlab/#deploy-via-cli).


# Demo

## Login
1. Log in to {{ model.techShortName }}. If we have used the default name and VHOST setting above it should be reachable via `<VHOST>/{{ model.packageName }}-notebook`.

![Login](/services/beta-jupyter/img/jupyterlab-login.png)

Figure 4. {{ model.techShortName }} login

The default password with the above settings is `jupyter`.

![UI](/services/beta-jupyter/img/jupyterlab-jupyterlab_ui.png)

Figure 5. Default password {{ model.techPassword }}

2. Once logged in you should be able to see the {{ model.techShortName }} Launcher:

![{{ model.techShortName }} Launcher](/services/beta-jupyter/img/jupyterlab-jupyterlab_ui.png)

Figure 6. {{ model.techShortName }} launcher


## SparkPi Job

As a first test let us run the [SparkPi example job](https://github.com/apache/spark/blob/master/examples/src/main/java/org/apache/spark/examples/JavaSparkPi.java).

1. Launch a Terminal from inside the notebook and then use the following command:

``` bash
eval \
  spark-submit \
  ${SPARK_OPTS} \
  --verbose \
  --class org.apache.spark.examples.SparkPi \
  /opt/spark/examples/jars/spark-examples_2.11-2.2.1.jar 100
```

![SparkPi](/services/beta-jupyter/img/jupyterlab-sparkPi.png)

Figure 7. SparkPi on {{ model.techShortName }}


2. You should then see Spark spinning up tasks and computing Pi. If you want, you can check the Mesos web interface via `<cluster>/mesos` and see the Spark tasks being spawned there.

![SparkPi Mesos](/services/beta-jupyter/img/jupyterlab-SparkPi_Mesos.png).

Figure 8. SparkPi Mesos on {{ model.techShortName }}

Once the Spark job has finished, you should be able to see output similar to `Pi is roughly 3.1416119141611913` (followed by the Spark teardown log messages).


## SparkPi with Apache Toree

Let us run the SparkPi example as well directly from a [Apache Toree](https://toree.incubator.apache.org/) notebook.

1. Launch a new notebook with an `Apache Toree Scala` Kernel
1. Use the Scala code below to compute Pi once more:

``` scala
val NUM_SAMPLES = 10000000

val count2 = spark.sparkContext.parallelize(1 to NUM_SAMPLES).map{i =>
  val x = Math.random()
  val y = Math.random()
  if (x*x + y*y < 1) 1 else 0
}.reduce(_ + _)

println("Pi is roughly " + 4.0 * count2 / NUM_SAMPLES)
```

![SparkPiToree](/services/beta-jupyter/img/{{ model.packageName }}-SparkPi_Toree.png)

Figure 9. SparkPiToree on {{ model.techShortName }}


## Optional: Check available GPUs

For GPU enabled {{ model.techShortName}}:

1. Launch a new notebook with Python 3 Kernel and use the following python code to show the available GPUs.

``` python
from tensorflow.python.client import device_lib

def get_available_devices():
    local_device_protos = device_lib.list_local_devices()
    return [x.name for x in local_device_protos]

print(get_available_devices())

```

![GPU](/services/beta-jupyter/img/jupyterlab-gpu.png)

Figure 10. GPU on {{ model.techShortName }}

### MNIST TensorFlowOnSpark

Next let us use [TensorFlowOnSpark](https://github.com/yahoo/TensorFlowOnSpark) and the [MNIST database](http://yann.lecun.com/exdb/mnist/) to train a network recognizing handwritten digits.


1. Clone the [Yahoo TensorFlowOnSpark Github Repo](https://github.com/yahoo/TensorFlowOnSpark) using the notebook's Terminal:
  ``` bash
  git clone https://github.com/yahoo/TensorFlowOnSpark
  ```
2. Retrieve and extract raw MNIST Dataset using the notebook's Terminal:
  ``` bash
  cd $MESOS_SANDBOX
  curl -fsSL -O https://s3.amazonaws.com/vishnu-mohan/tensorflow/mnist/mnist.zip
  unzip mnist.zip
  ```
3.  Check HDFS
Let us briefly confirm that HDFS is working as expected and the `mnist` directory does not exist yet from the notebook's Terminal:

  ``` bash
  hdfs dfs -ls  mnist/
  ls: `mnist/': No such file or directory
  ```

4. Prepare MNIST Dataset in CSV format and store on HDFS from the notebook's Terminal

  ``` bash
  eval \
    spark-submit \
    ${SPARK_OPTS} \
    --verbose \
    $(pwd)/TensorFlowOnSpark/examples/mnist/mnist_data_setup.py \
      --output mnist/csv \
      --format csv
  ```

5. Check for `mnist` directory in HDFS from notebook's Terminal:

  ``` bash
  hdfs dfs -ls -R  mnist
  /drwxr-xr-x   - nobody supergroup          0 2018-08-08 01:33 mnist/csv
  drwxr-xr-x   - nobody supergroup          0 2018-08-08 01:33 mnist/csv/test
  drwxr-xr-x   - nobody supergroup          0 2018-08-08 01:33 mnist/csv/test/images
  -rw-r--r--   3 nobody supergroup          0 2018-08-08 01:33 mnist/csv/test/images/_SUCCESS
  -rw-r--r--   3 nobody supergroup    1810248 2018-08-08 01:33 mnist/csv/test/images/part-00000
  -rw-r--r--   3 nobody supergroup    1806102 2018-08-08 01:33 mnist/csv/test/images/part-00001
  -rw-r--r--   3 nobody supergroup    1811128 2018-08-08 01:33 mnist/csv/test/images/part-00002
  -rw-r--r--   3 nobody supergroup    1812952 2018-08-08 01:33 mnist/csv/test/images/part-00003
  -rw-r--r--   3 nobody supergroup    1810946 2018-08-08 01:33 mnist/csv/test/images/part-00004
  -rw-r--r--   3 nobody supergroup    1835497 2018-08-08 01:33 mnist/csv/test/images/part-00005
  ...
  ```

67. . Train MNIST model with CPUs from the notebook's Terminal:

  ``` bash
  eval \
    spark-submit \
    ${SPARK_OPTS} \
    --verbose \
    --conf spark.mesos.executor.docker.image=dcoslabs/dcos-{{ model.packageName }}:1.2.0-0.33.7 \
    --py-files $(pwd)/TensorFlowOnSpark/examples/mnist/spark/mnist_dist.py \
    $(pwd)/TensorFlowOnSpark/examples/mnist/spark/mnist_spark.py \
    --cluster_size 5 \
    --images mnist/csv/train/images \
    --labels mnist/csv/train/labels \
    --format csv \
    --mode train \
    --model mnist/mnist_csv_model
  ```

<p class="message--note"><strong>NOTE: </strong>If you want to use GPUs, make sure the cluster size matches the number of GPU instances.</p>

  ``` bash
  eval \
      spark-submit \
      ${SPARK_OPTS} \
      --verbose \
      --conf spark.mesos.executor.docker.image=dcoslabs/dcos-{{ model.packageName }}:1.2.0-0.33.7-gpu \
      --conf spark.mesos.gpus.max=2 \
      --conf spark.mesos.executor.gpus=1 \
      --py-files $(pwd)/TensorFlowOnSpark/examples/mnist/spark/mnist_dist.py \
      $(pwd)/TensorFlowOnSpark/examples/mnist/spark/mnist_spark.py \
      --cluster_size 2 \
      --images mnist/csv/train/images \
      --labels mnist/csv/train/labels \
      --format csv \
      --mode train \
      --model mnist/mnist_csv_model
  ```

  As we configured TensorBoard to be enabled, we can go to `<VHOST>/{{ model.packageName }}-notebook/tensorboard` and check the Training progress.
    
![TensorBoard](/services/beta-jupyter/img/jupyterlab-TensorBoard.png)

Figure 11. TensorBoard on {{ model.techShortName }}

7. Verify that the trained model exists on HDFS using the notebook's Terminal:

``` bash
nobody@2442bc8f-94d4-4f74-8321-b8b8b40436d7:~$ hdfs dfs -ls -R mnist/mnist_csv_model
-rw-r--r--   3 nobody supergroup        128 2018-08-08 02:37 mnist/mnist_csv_model/checkpoint
-rw-r--r--   3 nobody supergroup    4288367 2018-08-08 02:37 mnist/mnist_csv_model/events.out.tfevents.1533695777.ip-10-0-7-250.us-west-2.compute.internal
-rw-r--r--   3 nobody supergroup         40 2018-08-08 02:36 mnist/mnist_csv_model/events.out.tfevents.1533695778.ip-10-0-7-250.us-west-2.compute.internal
-rw-r--r--   3 nobody supergroup     156424 2018-08-08 02:36 mnist/mnist_csv_model/graph.pbtxt
-rw-r--r--   3 nobody supergroup     814168 2018-08-08 02:36 mnist/mnist_csv_model/model.ckpt-0.data-00000-of-00001
-rw-r--r--   3 nobody supergroup        408 2018-08-08 02:36 mnist/mnist_csv_model/model.ckpt-0.index
-rw-r--r--   3 nobody supergroup      69583 2018-08-08 02:36 mnist/mnist_csv_model/model.ckpt-0.meta
-rw-r--r--   3 nobody supergroup     814168 2018-08-08 02:37 mnist/mnist_csv_model/model.ckpt-600.data-00000-of-00001
-rw-r--r--   3 nobody supergroup        408 2018-08-08 02:37 mnist/mnist_csv_model/model.ckpt-600.index
-rw-r--r--   3 nobody supergroup      74941 2018-08-08 02:37 mnist/mnist_csv_model/model.ckpt-600.meta
```
