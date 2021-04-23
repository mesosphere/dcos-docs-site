---
layout: layout.pug
navigationTitle: TensorFlow
excerpt: Use TensorFlow with DC/OS Data Science Engine
title: TensorFlow
menuWeight: 12
model: /mesosphere/dcos/services/data-science-engine/data.yml
render: mustache
enterprise: true
---

To Install {{ model.techName }} with TensorFlow 2.1.0. {{ model.techName }} comes with TensorFlow 2.1.0 support by default. Run the following command:

```bash
dcos package install {{ model.serviceName }}
```

To Install {{ model.techName }} with TensorFlow 1.15. Run the following command:

```bash
dcos package install --options=options.json {{ model.serviceName }}
```

With `options.json` having the following content:

```json
{
    "service": {
        "jupyter_notebook_type": "TensorFlow-1.15"
    }
}
```

# TensorFlow local machine learning

Open a `Python 3` Notebook and put the following sections in different code cells.

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

1. Training and Evaluating the model

    ```python
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
    print("Predicted Number: {}".format(pred.argmax()))
    ```

# TensorFlow 2.1.0 Distributed Learning with Horovod on Spark

{{ model.techName }} includes `Horovod on Spark` integration, which allows you to run TensorFlow in a distributed mode, using Apache Spark as an engine.

Open a `Python 3` Notebook and put the following sections in different code cells.

1. Define Utility functions to prepare dataset and model

    ```python
    def get_dataset(rank=0, size=1):
        import tensorflow as tf
        (x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data('MNIST-data-%d' % rank)
        x_train = x_train[rank::size]
        y_train = y_train[rank::size]
        x_test = x_test[rank::size]
        y_test = y_test[rank::size]
        # Normalizing the RGB codes by dividing it to the max RGB value.
        x_train, x_test = x_train / 255.0, x_test / 255.0
        return (x_train, y_train), (x_test, y_test)
    
    def get_model(num_classes=10):
        import tensorflow as tf
        model = tf.keras.models.Sequential([
            tf.keras.layers.Flatten(input_shape=(28, 28)),
            tf.keras.layers.Dense(128, activation='relu'),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.Dense(10, activation='softmax')
        ])
        
        return model
    
    def deserialize(model_bytes):
        import horovod.tensorflow.keras as hvd
        import h5py
        import io
        bio = io.BytesIO(model_bytes)
        with h5py.File(bio,'a') as f:
            return hvd.load_model(f)
    ```

1. Implement distributed training function using `Horovod`

    ```python
    def train_hvd(num_classes=10, learning_rate=0.001, batch_size=128, epochs=2):
        import os
        import tempfile
        import tensorflow as tf
        import horovod.tensorflow.keras as hvd
    
        hvd.init()
        
        # Horovod: pin GPU to be used to process local rank (one GPU per process)
        gpus = tf.config.experimental.list_physical_devices('GPU')
        for gpu in gpus:
            tf.config.experimental.set_memory_growth(gpu, True)
        if gpus:
            tf.config.experimental.set_visible_devices(gpus[hvd.local_rank()], 'GPU')
        
        (x_train, y_train), (x_test, y_test) = get_dataset(hvd.rank(), hvd.size())
        model = get_model(num_classes)
    
        # Horovod: add Horovod DistributedOptimizer.
        optimizer = hvd.DistributedOptimizer(tf.keras.optimizers.Adam(lr=learning_rate * hvd.size()))
    
        model.compile(optimizer=optimizer,
                    loss='sparse_categorical_crossentropy',
                    experimental_run_tf_function=False,
                    metrics=['accuracy'])
        
        callbacks = [
          hvd.callbacks.BroadcastGlobalVariablesCallback(0),
          hvd.callbacks.LearningRateWarmupCallback(warmup_epochs=3, verbose=1),
        ]
    
        # Horovod: save checkpoints only on worker 0 to prevent other workers from corrupting them.
        # Model checkpoint location.
        ckpt_dir = tempfile.mkdtemp()
        ckpt_file = os.path.join(ckpt_dir, 'checkpoint.h5')
        
        if hvd.rank() == 0:
            callbacks.append(tf.keras.callbacks.ModelCheckpoint(ckpt_file, monitor='accuracy', mode='max', save_best_only=True))
    
        history = model.fit(x_train, y_train,
                batch_size=batch_size,
                callbacks=callbacks,
                epochs=epochs,
                verbose=2,
                validation_data=(x_test, y_test))
    
        if hvd.rank() == 0:
            with open(ckpt_file, 'rb') as f:
                #returning a tuple of history and model bytes
                return history.history, f.read()
    ```

1. Create Spark Session

    ```python
    from pyspark.sql import SparkSession
    spark = SparkSession.builder.appName("TF2HorovodOnSpark").getOrCreate()
    ```

1. Run distributed training

    ```python
    import horovod.spark
    model_bytes = horovod.spark.run(train_hvd, verbose=2)[0][1]
    ```
   
1. Evaluate model

    ```python
    (x_train, y_train), (x_test, y_test) = get_dataset()
    model = deserialize(model_bytes)
    evaluation = model.evaluate(x_test,  y_test, verbose=2)
    print('Model Evaluation:', evaluation)
    ```

1. Shutdown Spark workers

    ```python
    spark.stop()
    ```

# TensorFlow 1.15 Distributed Learning with Horovod on Spark

Open a `Python 3` Notebook and put the following sections in different code cells.

1. Describe layers of the model

    ```python
    def conv_model(feature, target, mode):
        import tensorflow as tf
        
        layers = tf.layers
        
        """2-layer convolution model."""
        # Convert the target to a one-hot tensor of shape (batch_size, 10) and
        # with a on-value of 1 for each one-hot vector of length 10.
        target = tf.one_hot(tf.cast(target, tf.int32), 10, 1, 0)
    
        # Reshape feature to 4d tensor with 2nd and 3rd dimensions being
        # image width and height final dimension being the number of color channels.
        feature = tf.reshape(feature, [-1, 28, 28, 1])
    
        # First conv layer will compute 32 features for each 5x5 patch
        with tf.variable_scope('conv_layer1'):
            h_conv1 = layers.conv2d(feature, 32, kernel_size=[5, 5],
                                    activation=tf.nn.relu, padding="SAME")
            h_pool1 = tf.nn.max_pool(
                h_conv1, ksize=[1, 2, 2, 1], strides=[1, 2, 2, 1], padding='SAME')
    
        # Second conv layer will compute 64 features for each 5x5 patch.
        with tf.variable_scope('conv_layer2'):
            h_conv2 = layers.conv2d(h_pool1, 64, kernel_size=[5, 5],
                                    activation=tf.nn.relu, padding="SAME")
            h_pool2 = tf.nn.max_pool(
                h_conv2, ksize=[1, 2, 2, 1], strides=[1, 2, 2, 1], padding='SAME')
            # reshape tensor into a batch of vectors
            h_pool2_flat = tf.reshape(h_pool2, [-1, 7 * 7 * 64])
    
        # Densely connected layer with 1024 neurons.
        h_fc1 = layers.dropout(
            layers.dense(h_pool2_flat, 1024, activation=tf.nn.relu),
            rate=0.5, training=mode == tf.estimator.ModeKeys.TRAIN)
    
        # Compute logits (1 per class) and compute loss.
        logits = layers.dense(h_fc1, 10, activation=None)
        loss = tf.losses.softmax_cross_entropy(target, logits)
    
        return tf.argmax(logits, 1), loss
    ```

1. Implement train input generator

    ```python
    def train_input_generator(x_train, y_train, batch_size=64):
        import numpy as np
        
        assert len(x_train) == len(y_train)
        while True:
            p = np.random.permutation(len(x_train))
            x_train, y_train = x_train[p], y_train[p]
            index = 0
            while index <= len(x_train) - batch_size:
                yield x_train[index:index + batch_size], \
                      y_train[index:index + batch_size],
                index += batch_size
    ```

1. Implement distributed training function using `Horovod`

    ```python
    def train_hvd():
        import os
        import tensorflow as tf
        import horovod.tensorflow as hvd
        import numpy as np
        from tensorflow import keras
        
        tf.logging.set_verbosity(tf.logging.INFO)
        
        # Horovod: initialize Horovod.
        hvd.init()
    
        # Download and load MNIST dataset.
        (x_train, y_train), (x_test, y_test) = \
            keras.datasets.mnist.load_data('MNIST-data-%d' % hvd.rank())
    
        # The shape of downloaded data is (-1, 28, 28), hence we need to reshape it
        # into (-1, 784) to feed into our network. Also, need to normalize the
        # features between 0 and 1.
        x_train = np.reshape(x_train, (-1, 784)) / 255.0
        x_test = np.reshape(x_test, (-1, 784)) / 255.0
    
        # Build model...
        with tf.name_scope('input'):
            image = tf.placeholder(tf.float32, [None, 784], name='image')
            label = tf.placeholder(tf.float32, [None], name='label')
        predict, loss = conv_model(image, label, tf.estimator.ModeKeys.TRAIN)
    
        lr_scaler = hvd.size()
    
        # Horovod: adjust learning rate based on lr_scaler.
        opt = tf.train.AdamOptimizer(0.001 * lr_scaler)
    
        # Horovod: add Horovod Distributed Optimizer.
        opt = hvd.DistributedOptimizer(opt, op=hvd.Average)
    
        global_step = tf.train.get_or_create_global_step()
        train_op = opt.minimize(loss, global_step=global_step)
    
        hooks = [
            # Horovod: BroadcastGlobalVariablesHook broadcasts initial variable states
            # from rank 0 to all other processes. This is necessary to ensure consistent
            # initialization of all workers when training is started with random weights
            # or restored from a checkpoint.
            hvd.BroadcastGlobalVariablesHook(0),
    
            # Horovod: adjust number of steps based on number of CPUs/GPUs.
            tf.train.StopAtStepHook(last_step=20 // hvd.size()),
    
            tf.train.LoggingTensorHook(tensors={'step': global_step, 'loss': loss},
                                       every_n_iter=10),
        ]
    
        # Horovod: save checkpoints only on worker 0 to prevent other workers from
        # corrupting them.
        checkpoint_dir = '/tmp/checkpoints' if hvd.rank() == 0 else None
        training_batch_generator = train_input_generator(x_train,
                                                         y_train, batch_size=100)
        
        # Horovod: pin GPU to be used to process local rank (one GPU per process)
        config = tf.ConfigProto()
        if tf.test.is_gpu_available():
            config.gpu_options.allow_growth = True
            config.gpu_options.visible_device_list = str(hvd.local_rank())
        
        # The MonitoredTrainingSession takes care of session initialization,
        # restoring from a checkpoint, saving to a checkpoint, and closing when done
        # or an error occurs.
        step = 0
        with tf.train.MonitoredTrainingSession(checkpoint_dir=checkpoint_dir,
                                               hooks=hooks,
                                               config=config) as mon_sess:
            while not mon_sess.should_stop():
                # Run a training step synchronously.
                image_, label_ = next(training_batch_generator)
                mon_sess.run(train_op, feed_dict={image: image_, label: label_})
                step += 1
        print('Total Step Taken: {}'.format(step))
    ```

1. Create Spark Session

    ```python
    from pyspark.sql import SparkSession
    spark = SparkSession.builder.appName("TF1HorovodOnSpark").getOrCreate()
    ```

1. Run distributed training

    ```python
    import horovod.spark
    horovod.spark.run(train_hvd, verbose=2)
    ```

1. Shutdown Spark workers

    ```python
    spark.stop()
    ```

# TensorBoard

{{ model.techName }} comes with `TensorBoard` installed. It can be found at
`http://<dcos-url>/service/{{ model.serviceName }}/tensorboard/`.

## Log directory

TensorBoard reads log data from specific directory, with the default being `/mnt/mesos/sandbox`. It can be changed with `advanced.tensorboard_logdir` option. HDFS paths are supported as well.

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

1. Open TensorBoard at `https://<dcos-url>/service/{{ model.serviceName }}/tensorboard/` and confirm the change.

## Disabling TensorBoard

{{ model.techName }} can be installed with `TensorBoard` disabled by using the following configuration:

```json
{
  "advanced": {
    "start_tensorboard": false
  }
}
```
