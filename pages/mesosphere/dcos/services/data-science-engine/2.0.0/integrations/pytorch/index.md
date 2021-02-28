---
navigationTitle: PyTorch
excerpt: Use PyTorch with DC/OS Data Science Engine
title: PyTorch
menuWeight: 12
model: /mesosphere/dcos/services/data-science-engine/data.yml
enterprise: true

---

To Install {{ model.techName }} with PyTorch. Run the following command:

```bash
dcos package install --options=options.json {{ model.serviceName }}
```

With `options.json` having the following content:

```json
{
    "service": {
        "jupyter_notebook_type": "PyTorch-1.4.0"
    }
}
```

# PyTorch local machine learning

Open a `Python 3` Notebook and put the following sections in different code cells.

1. Training settings

   ```python
    batch_size = 1000        # input batch size for training
    test_batch_size = 1000   # input batch size for testing
    epochs = 1               # number of epochs to train
    lr = 1.0                 # learning rate
    gamma = 0.7              # learning rate step gamma
    seed = 1                 # random seed
    log_interval = 10        # how many batches to wait before logging training status
    ```

1. Describe layers of the model

    ```python
    from __future__ import print_function
    import torch
    import torch.nn as nn
    import torch.nn.functional as F
    import torch.optim as optim
    from torchvision import datasets, transforms
    from torch.optim.lr_scheduler import StepLR
    
    class Net(nn.Module):
        def __init__(self):
            super(Net, self).__init__()
            self.conv1 = nn.Conv2d(1, 32, 3, 1)
            self.conv2 = nn.Conv2d(32, 64, 3, 1)
            self.dropout1 = nn.Dropout2d(0.25)
            self.dropout2 = nn.Dropout2d(0.5)
            self.fc1 = nn.Linear(9216, 128)
            self.fc2 = nn.Linear(128, 10)
    
        def forward(self, x):
            x = self.conv1(x)
            x = F.relu(x)
            x = self.conv2(x)
            x = F.max_pool2d(x, 2)
            x = self.dropout1(x)
            x = torch.flatten(x, 1)
            x = self.fc1(x)
            x = F.relu(x)
            x = self.dropout2(x)
            x = self.fc2(x)
            output = F.log_softmax(x, dim=1)
            return output
    ```

1. Implement train function

    ```python
    def train(model, device, train_loader, optimizer, epoch, log_interval):
        model.train()
        for batch_idx, (data, target) in enumerate(train_loader):
            data, target = data.to(device), target.to(device)
            optimizer.zero_grad()
            output = model(data)
            loss = F.nll_loss(output, target)
            loss.backward()
            optimizer.step()
            if batch_idx % log_interval == 0:
                print('Train Epoch: {} [{}/{} ({:.0f}%)]\tLoss: {:.6f}'.format(
                    epoch, batch_idx * len(data), len(train_loader.dataset),
                    100. * batch_idx / len(train_loader), loss.item()))
    ```

1. Implement test function

    ```python
    def test(model, device, test_loader):
        model.eval()
        test_loss = 0
        correct = 0
        with torch.no_grad():
            for data, target in test_loader:
                data, target = data.to(device), target.to(device)
                output = model(data)
                test_loss += F.nll_loss(output, target, reduction='sum').item()  # sum up batch loss
                pred = output.argmax(dim=1, keepdim=True)  # get the index of the max log-probability
                correct += pred.eq(target.view_as(pred)).sum().item()
    
        test_loss /= len(test_loader.dataset)
    
        print('\nTest set: Average loss: {:.4f}, Accuracy: {}/{} ({:.0f}%)\n'.format(
            test_loss, correct, len(test_loader.dataset),
            100. * correct / len(test_loader.dataset)))
    ```

1. Training model

    ```python
    use_cuda = torch.cuda.is_available()
    
    torch.manual_seed(seed)
    device = torch.device("cuda" if use_cuda else "cpu")
    
    kwargs = {'num_workers': 1, 'pin_memory': True} if use_cuda else {}
    train_loader = torch.utils.data.DataLoader(
        datasets.MNIST('./data', train=True, download=True,
                       transform=transforms.Compose([
                           transforms.ToTensor(),
                           transforms.Normalize((0.1307,), (0.3081,))
                       ])),
        batch_size=batch_size, shuffle=True, **kwargs)
   
    model = Net().to(device)
    optimizer = optim.Adadelta(model.parameters(), lr=lr)
    
    scheduler = StepLR(optimizer, step_size=1, gamma=gamma)
    for epoch in range(1, epochs + 1):
        train(model, device, train_loader, optimizer, epoch, log_interval)
        test(model, device, test_loader)
        scheduler.step()
    ```

# PyTorch Distributed Learning with Horovod on Spark

Open a `Python 3 `Notebook and put the following sections in different code cells.

1. Describe layers of the model

    ```python
    import torch
    import torch.nn as nn
    import torch.nn.functional as F
    import torch.multiprocessing as mp
    import torch.optim as optim
    from torchvision import datasets, transforms
    import torch.utils.data.distributed
    import horovod.torch as hvd
    
    class Net(nn.Module):
        def __init__(self):
            super(Net, self).__init__()
            self.conv1 = nn.Conv2d(1, 10, kernel_size=5)
            self.conv2 = nn.Conv2d(10, 20, kernel_size=5)
            self.conv2_drop = nn.Dropout2d()
            self.fc1 = nn.Linear(320, 50)
            self.fc2 = nn.Linear(50, 10)
    
        def forward(self, x):
            x = F.relu(F.max_pool2d(self.conv1(x), 2))
            x = F.relu(F.max_pool2d(self.conv2_drop(self.conv2(x)), 2))
            x = x.view(-1, 320)
            x = F.relu(self.fc1(x))
            x = F.dropout(x, training=self.training)
            x = self.fc2(x)
            return F.log_softmax(x)
    ```

1. Implement training function

    ```python
    def train(optimizer, epoch, is_cuda, model, train_sampler, train_loader):
        model.train()
        # Horovod: set epoch to sampler for shuffling.
        train_sampler.set_epoch(epoch)
        for batch_idx, (data, target) in enumerate(train_loader):
            if is_cuda:
                data, target = data.cuda(), target.cuda()
            optimizer.zero_grad()
            output = model(data)
            loss = F.nll_loss(output, target)
            loss.backward()
            optimizer.step()
            if batch_idx % 10 == 0:
                # Horovod: use train_sampler to determine the number of examples in
                # this worker's partition.
                print('Train Epoch: {} [{}/{} ({:.0f}%)]\tLoss: {:.6f}'.format(
                    epoch, batch_idx * len(data), len(train_sampler),
                    100. * batch_idx / len(train_loader), loss.item()))
    
    ```

1. Averaging of the input tensor over all the Horovod processes

    ```python
    def metric_average(val, name):
        tensor = torch.tensor(val)
        avg_tensor = hvd.allreduce(tensor, name=name)
        return avg_tensor.item()
    ```

1. Implement test function

    ```python
    def test(is_cuda, model, test_sampler, test_loader):
        model.eval()
        test_loss = 0.
        test_accuracy = 0.
        for data, target in test_loader:
            if is_cuda:
                data, target = data.cuda(), target.cuda()
            output = model(data)
            # sum up batch loss
            test_loss += F.nll_loss(output, target, size_average=False).item()
            # get the index of the max log-probability
            pred = output.data.max(1, keepdim=True)[1]
            test_accuracy += pred.eq(target.data.view_as(pred)).cpu().float().sum()
    
        # Horovod: use test_sampler to determine the number of examples in
        # this worker's partition.
        test_loss /= len(test_sampler)
        test_accuracy /= len(test_sampler)
    
        # Horovod: average metric values across workers.
        test_loss = metric_average(test_loss, 'avg_loss')
        test_accuracy = metric_average(test_accuracy, 'avg_accuracy')
    
        # Horovod: print output only on first rank.
        if hvd.rank() == 0:
            print('\nTest set: Average loss: {:.4f}, Accuracy: {:.2f}%\n'.format(
                test_loss, 100. * test_accuracy))
    ```

1. Implement distributed training function using `Horovod`

    ```python
    def train_hvd():   
        batch = 1000
        epochs = 2
        is_cuda = torch.cuda.is_available()
    
        # Horovod: initialize library.
        hvd.init()
        torch.manual_seed(42)
    
        if is_cuda:
            # Horovod: pin GPU to local rank.
            torch.cuda.set_device(hvd.local_rank())
            torch.cuda.manual_seed(42)
        
        # Horovod: limit # of CPU threads to be used per worker.
        torch.set_num_threads(1)
    
        kwargs = {'num_workers': 1, 'pin_memory': True} if is_cuda else {}
        # When supported, use 'forkserver' to spawn dataloader workers instead of 'fork' to prevent
        # issues with Infiniband implementations that are not fork-safe
        if (kwargs.get('num_workers', 0) > 0 and hasattr(mp, '_supports_context') and
                mp._supports_context and 'forkserver' in mp.get_all_start_methods()):
            kwargs['multiprocessing_context'] = 'forkserver'
    
        train_dataset = \
            datasets.MNIST('data-%d' % hvd.rank(), train=True, download=True,
                           transform=transforms.Compose([
                               transforms.ToTensor(),
                               transforms.Normalize((0.1307,), (0.3081,))
                           ]))

        # Horovod: use DistributedSampler to partition the training data.
        train_sampler = torch.utils.data.distributed.DistributedSampler(
            train_dataset, num_replicas=hvd.size(), rank=hvd.rank())
        train_loader = torch.utils.data.DataLoader(
            train_dataset, batch_size=batch, sampler=train_sampler, **kwargs)
    
        model = Net()
    
        # By default, Adasum doesn't need scaling up learning rate.
        lr_scaler = hvd.size()
    
        if is_cuda:
            # Move model to GPU.
            model.cuda()
            # If using GPU Adasum allreduce, scale learning rate by local_size.
            if hvd.nccl_built():
                lr_scaler = hvd.local_size()
    
        # Horovod: scale learning rate by lr_scaler.
        optimizer = optim.SGD(model.parameters(), lr=0.01 * lr_scaler,
                              momentum=0.5)
    
        # Horovod: broadcast parameters & optimizer state.
        hvd.broadcast_parameters(model.state_dict(), root_rank=0)
        hvd.broadcast_optimizer_state(optimizer, root_rank=0)
    
        # Horovod: (optional) compression algorithm.
        compression = hvd.Compression.none
    
        # Horovod: wrap optimizer with DistributedOptimizer.
        optimizer = hvd.DistributedOptimizer(optimizer,
                                             named_parameters=model.named_parameters(),
                                             compression=compression,
                                             op=hvd.Average)
    
        for epoch in range(1, epochs + 1):
            train(optimizer, epoch, is_cuda, model, train_sampler, train_loader)
            test(is_cuda, model, test_sampler, test_loader)
    ```

1. Create Spark Session

    ```python
    from pyspark.sql import SparkSession
    spark = SparkSession.builder.appName("PyTorchHorovodOnSpark").getOrCreate()
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
