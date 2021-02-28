---
navigationTitle: MxNet
excerpt: Using MxNet with DC/OS Data Science Engine
title: MxNet
menuWeight: 12
model: /mesosphere/dcos/services/data-science-engine/data.yml
enterprise: true
---

To Install {{ model.techName }} with MxNet. Run the following command:

```bash
dcos package install --options=options.json {{ model.serviceName }}
```

With `options.json` having the following content:

```json
{
    "service": {
        "jupyter_notebook_type": "MxNet-1.6.0"
    }
}
```

# MxNet local machine learning

Open a `Python 3` Notebook and put the following sections in different code cells.

1. Training settings

    ```python
    batch_size = 100
    epochs = 1
    ```

1. Describe layers of the model

   ```python
    import mxnet as mx
    import logging

    logging.getLogger().setLevel(logging.DEBUG)  # logging to stdout
    
    mnist = mx.test_utils.get_mnist()
    
    train_iter = mx.io.NDArrayIter(mnist['train_data'], mnist['train_label'], batch_size, shuffle=True)
    val_iter = mx.io.NDArrayIter(mnist['test_data'], mnist['test_label'], batch_size)
    
    data = mx.sym.var('data')

    # first conv layer
    conv1 = mx.sym.Convolution(data=data, kernel=(5,5), num_filter=20)
    tanh1 = mx.sym.Activation(data=conv1, act_type="tanh")
    pool1 = mx.sym.Pooling(data=tanh1, pool_type="max", kernel=(2,2), stride=(2,2))

    # second conv layer
    conv2 = mx.sym.Convolution(data=pool1, kernel=(5,5), num_filter=50)
    tanh2 = mx.sym.Activation(data=conv2, act_type="tanh")
    pool2 = mx.sym.Pooling(data=tanh2, pool_type="max", kernel=(2,2), stride=(2,2))

    # first fullc layer
    flatten = mx.sym.flatten(data=pool2)
    fc1 = mx.symbol.FullyConnected(data=flatten, num_hidden=500)
    tanh3 = mx.sym.Activation(data=fc1, act_type="tanh")

    # second fullc
    fc2 = mx.sym.FullyConnected(data=tanh3, num_hidden=10)

    # softmax loss
    lenet = mx.sym.SoftmaxOutput(data=fc2, name='softmax')
    ```

1. Create a trainable module

    ```python
    context = mx.cpu()
    if mx.context.num_gpus() > 0:
        context = mx.gpu()
    
    lenet_model = mx.mod.Module(symbol=lenet, context=context)
    # train with the same
    lenet_model.fit(train_iter,
                    eval_data=val_iter,
                    optimizer='sgd',
                    optimizer_params={'learning_rate':0.1},
                    eval_metric='acc',
                    batch_end_callback = mx.callback.Speedometer(batch_size, 100),
                    num_epoch=epochs)
    
    test_iter = mx.io.NDArrayIter(mnist['test_data'], None, batch_size)
    prob = lenet_model.predict(test_iter)
    test_iter = mx.io.NDArrayIter(mnist['test_data'], mnist['test_label'], batch_size)
    ```

1. Predict accuracy

    ```python    
    acc = mx.metric.Accuracy()
    lenet_model.score(test_iter, acc)
    print(acc)
    ```

# MxNet Distributed Learning with Horovod on Spark

Open a `Python 3 `Notebook and put the following sections in different code cells.

1. Function to get mnist iterator given a rank

    ```python
    def get_mnist_iterator(rank, size, batch_size):
        import zipfile
        import mxnet as mx
        import os
        from mxnet.test_utils import download
        
        data_dir = "data-%d" % rank
        if not os.path.isdir(data_dir):
            os.makedirs(data_dir)
        zip_file_path = download('http://data.mxnet.io/mxnet/data/mnist.zip',
                                 dirname=data_dir)
        with zipfile.ZipFile(zip_file_path) as zf:
            zf.extractall(data_dir)
    
        input_shape = (1, 28, 28)
    
        train_iter = mx.io.MNISTIter(
            image="%s/train-images-idx3-ubyte" % data_dir,
            label="%s/train-labels-idx1-ubyte" % data_dir,
            input_shape=input_shape,
            batch_size=batch_size,
            shuffle=True,
            flat=False,
            num_parts=size,
            part_index=rank
        )
    
        val_iter = mx.io.MNISTIter(
            image="%s/t10k-images-idx3-ubyte" % data_dir,
            label="%s/t10k-labels-idx1-ubyte" % data_dir,
            input_shape=input_shape,
            batch_size=batch_size,
            flat=False,
            num_parts=size,
            part_index=rank
        )
    
        return train_iter, val_iter
    ```

1. Describe layers of the model

    ```python
    def conv_net():
        import mxnet as mx
        
        # placeholder for data
        data = mx.sym.var('data')
        # first conv layer
        conv1 = mx.sym.Convolution(data=data, kernel=(5, 5), num_filter=10)
        relu1 = mx.sym.Activation(data=conv1, act_type='relu')
        pool1 = mx.sym.Pooling(data=relu1, pool_type='max', kernel=(2, 2),
                               stride=(2, 2))
        # second conv layer
        conv2 = mx.sym.Convolution(data=pool1, kernel=(5, 5), num_filter=20)
        relu2 = mx.sym.Activation(data=conv2, act_type='relu')
        pool2 = mx.sym.Pooling(data=relu2, pool_type='max', kernel=(2, 2),
                               stride=(2, 2))
        # first fully connected layer
        flatten = mx.sym.flatten(data=pool2)
        fc1 = mx.symbol.FullyConnected(data=flatten, num_hidden=50)
        relu3 = mx.sym.Activation(data=fc1, act_type='relu')

        # second fully connected layer
        fc2 = mx.sym.FullyConnected(data=relu3, num_hidden=10)

        # softmax loss
        loss = mx.sym.SoftmaxOutput(data=fc2, name='softmax')
        return loss
    ```

1. Implement distributed training function using `Horovod`

    ```python
    def train_hvd():
        import horovod.mxnet as hvd
        import mxnet as mx
        
        batch_size = 100
        epochs = 2
        is_cuda = True if mx.context.num_gpus() != 0 else False
        
        # initialize Horovod
        hvd.init()
    
        # Horovod: pin context to process
        context = mx.cpu(hvd.local_rank()) if not is_cuda else mx.gpu(hvd.local_rank())
    
        # load data
        train_iter, val_iter = get_mnist_iterator(hvd.rank(), hvd.size(), batch_size)
    
        net = conv_net()
        model = mx.mod.Module(symbol=net, context=context)
    
        # initialize parameters
        initializer = mx.init.Xavier(rnd_type='gaussian', factor_type="in",
                                     magnitude=2)
        model.bind(data_shapes=train_iter.provide_data,
                   label_shapes=train_iter.provide_label)
        model.init_params(initializer)
    
        # Horovod: fetch and broadcast parameters
        (arg_params, aux_params) = model.get_params()
        if arg_params is not None:
            hvd.broadcast_parameters(arg_params, root_rank=0)
        if aux_params is not None:
            hvd.broadcast_parameters(aux_params, root_rank=0)
        model.set_params(arg_params=arg_params, aux_params=aux_params)
    
        # create optimizer
        optimizer_params = {'learning_rate': 0.05 * hvd.size(),
                            'rescale_grad': 1.0 / batch_size}
        opt = mx.optimizer.create('sgd', **optimizer_params)
    
        # Horovod: wrap optimizer with DistributedOptimizer
        opt = hvd.DistributedOptimizer(opt)
    
        # fit and train model
        batch_cb = None
        if hvd.rank() == 0:
            batch_cb = mx.callback.Speedometer(batch_size * hvd.size())
        model.fit(train_iter,  # train data
                  kvstore=None,  # no kvstore
                  eval_data=val_iter,  # validation data
                  optimizer=opt,  # use SGD to train
                  eval_metric='acc',  # report accuracy during training
                  batch_end_callback=batch_cb,  # report training speed
                  num_epoch=epochs)  # train for at most 10 dataset passes
    
        # evaluate model accuracy
        acc = mx.metric.Accuracy()
        model.score(val_iter, acc)
    
        if hvd.rank() == 0:
            print(acc)
    ```

1. Create Spark Session

    ```python
    from pyspark.sql import SparkSession
    spark = SparkSession.builder.appName("MxNetHorovodOnSpark").getOrCreate()
    ```

1. Run distributed training 

    ```python
    # Horovod: run training.
    import horovod.spark
    horovod.spark.run(train_hvd, verbose=2)
    ```

1. Shutdown Spark workers

    ```python
    spark.stop()
    ```
