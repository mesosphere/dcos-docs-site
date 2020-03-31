---
layout: layout.pug
navigationTitle: TensorFlow
excerpt: Using TensorFlow with DC/OS Data Science Engine
title: TensorFlow
menuWeight: 12
model: /mesosphere/dcos/services/data-science-engine/data.yml
render: mustache
enterprise: true

---
TensorFlow is an end-to-end open source platform for machine learning. It is included in your {{ model.techName }} installation.

# Using TensorFlow with Python

Open a `Python Notebook` and put the following sections in different code cells.

1. Prepare the test data:
    ```python
    import tensorflow as tf
    (x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data()

    x_train = x_train.reshape(x_train.shape[0], 28, 28, 1)
    x_test = x_test.reshape(x_test.shape[0], 28, 28, 1)
    input_shape = (28, 28, 1)

    x_train = x_train.astype('float32')
    x_test = x_test.astype('float32')

    x_train /= 255
    x_test /= 255
    ```
1. Define a model:
    ```python
    from tensorflow.keras.models import Sequential
    from tensorflow.keras.layers import Dense, Conv2D, Dropout, Flatten, MaxPooling2D

    model = Sequential()
    model.add(Conv2D(28, kernel_size=(3,3), input_shape=input_shape))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Flatten())
    model.add(Dense(256, activation=tf.nn.relu))
    model.add(Dropout(0.2))
    model.add(Dense(10,activation=tf.nn.softmax))
    ```
    ```python
    # Training and evaluating the model
    model.compile(optimizer='adam',
                  loss='sparse_categorical_crossentropy',
                  metrics=['accuracy'])
    model.fit(x=x_train,y=y_train, epochs=10)

    model.evaluate(x_test, y_test)
    ```
1. Use the model to predict a hand-written number:
    ```python 
    image_index = 5555 # should be '3'
    pred = model.predict(x_test[image_index].reshape(1, 28, 28, 1))
    print("predicted number: {}".format(pred.argmax()))
    ```

# TensorFlow on Spark

{{ model.techName }} includes `TensorFlow on Spark` integration, which allows you to run TensorFlow in a distributed mode, using Apache Spark as an engine.

Here is an example notebook of `Tensorflow on Spark` using `HDFS` as a storage backend. 

1. Launch **Terminal** from Notebook UI.

1. Clone the `TensorFlow on Spark` repository and download the sample dataset:

    ```bash
    rm -rf TensorFlowOnSpark && git clone https://github.com/yahoo/TensorFlowOnSpark
    rm -rf mnist && mkdir mnist
    curl -fsSL -O https://infinity-artifacts.s3-us-west-2.amazonaws.com/jupyter/mnist.zip
    unzip -d mnist/ mnist.zip
    ```

1. List files in the target HDFS directory and remove it if it is not empty.

    ```bash
    hdfs dfs -ls -R mnist/ && hdfs dfs -rm -R mnist/
    ```

1. Generate sample data and save to HDFS.

    ```bash
    spark-submit \
      --verbose \
      $(pwd)/TensorFlowOnSpark/examples/mnist/mnist_data_setup.py \
      --output mnist/csv \
      --format csv

    hdfs dfs -ls -R  mnist
    ```

1. Train the model and checkpoint it to the target directory in HDFS.

    ```bash
    spark-submit \
      --verbose \
      --py-files $(pwd)/TensorFlowOnSpark/examples/mnist/spark/mnist_dist.py \
      $(pwd)/TensorFlowOnSpark/examples/mnist/spark/mnist_spark.py \
      --cluster_size 4 \
      --images mnist/csv/train/images \
      --labels mnist/csv/train/labels \
      --format csv \
      --mode train \
      --model mnist/mnist_csv_model
    ```

1. Verify that model has been saved.

    ```bash
    hdfs dfs -ls -R mnist/mnist_csv_model
    ```

# TensorBoard

{{ model.techName }} comes with `TensorBoard` installed. It can be found at
`http://<dcos-url>/service/{{model.serviceName}}/tensorboard/`.

## Log directory

TensorBoard reads log data from specific directory, with the default being `/mnt/mesos/sandbox`. It can be changed
with `advanced.tensorboard_logdir` option. HDFS paths are supported as well.

Here is an example:

1. Install HDFS:

    ```bash
    dcos package install hdfs
    ```

1. Install `{{ model.packageName }}` with overridden log directory option:

    ```bash
    dcos package install --options=options.json {{ model.serviceName }}
   ```

    With `options.json` having the following content:

    ```json
    {
      "advanced": {
        "tensorboard_logdir": "hdfs://tf_logs"
      }
    }
    ```

1. Open TensorBoard at `https://<dcos-url>/service/{{model.serviceName}}/tensorboard/` and confirm the change.

## Disabling TensorBoard

{{ model.techName }} can be installed with `TensorBoard` disabled by using the following configuration:

```json
{
  "advanced": {
    "start_tensorboard": false
  }
}
```
