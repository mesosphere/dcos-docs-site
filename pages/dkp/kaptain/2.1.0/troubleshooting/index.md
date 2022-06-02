---
layout: layout.pug
navigationTitle: Troubleshooting
title: Troubleshooting Guide
menuWeight: 95
excerpt: Troubleshooting Guide for Kaptain
beta: false
enterprise: false
---

## Kaptain

To print the status of the Kaptain helm installation:

```bash
helm status kaptain
```

To show deployments and pods in the Kaptain operator instance:

```bash
kubectl get deployments -n kubeflow

kubectl get pods -n kubeflow

kubectl describe pod <pod_name> -n kubeflow
```

## Konvoy

To create the Konvoy diagnostics bundle, use:

```bash
konvoy diagnose --logs-all-namespaces --yes
```

Afterwards, check [Konvoy troubleshooting techniques][konvoy-troubleshooting].


## ML workloads

### TFJobs
List all TFJobs runs in user namespace:
```bash
kubectl get tfjobs -n <namespace>
```

Get the details of TFJob run:
```bash
kubectl describe tfjob <job_name> -n <namespace>
```

List all TFJob's pods:
```bash
kubectl get pods -l job-name=<job_name> -n <namespace>
```

Print the logs from TFJob's pods:
```bash
kubectl logs -l job-name=<job_name> --prefix=true -n <namespace>
```

List Kubernetes `Events` associated with TFJob:
```bash
kubectl get events --field-selector involvedObject.kind=TFJob,involvedObject.name=<job_name>  -n <namespace>
```

Delete TFJob:
```bash
kubectl delete tfjob <job_name> -n <namespace>
```

### PyTorchJobs
List all PyTorchJobs runs in user namespace:
```bash
kubectl get pytorchjob -n <namespace>
```

Get the details of PyTorchJob run:
```bash
kubectl describe pytorchjob <job_name> -n <namespace>
```

List all PyTorchJob's pods:
```bash
kubectl get pods -l job-name=<job_name> -n <namespace>
```

Print the logs from PyTorchJob's pods:
```bash
kubectl logs -l pytorch-job-name=<job_name> --prefix=true -n <namespace>
```

List Kubernetes `Events` associated with PyTorchJob:
```bash
kubectl get events --field-selector involvedObject.kind=PyTorchJob,involvedObject.name=<job_name> -n <namespace>
```

Delete PyTorchJob:
```bash
kubectl delete pytorchjob <job_name> -n <namespace>
```

### Experiments
Get the details of an Experiment:
```bash
kubectl describe experiment <experiment_name> -n <namespace>
```

List all Experiments runs in user namespace:
```bash
kubectl get experiments -n <namespace>
```

Get the Experiment's trials:
```bash
kubectl get trials -l experiment=<experiment_name> -n <namespace>
```

### Inference Services

Get the details of Inference Service:
```bash
kubectl describe inferenceservice <inference_service_name> -n <namespace>
```

Get the Inference Service's pods:

```bash
kubectl get pods -l serving.kubeflow.org/inferenceservice=<inference_service_name> -n <namespace>
```

Print Inference Service pod's logs:
```bash
kubectl logs -l serving.kubeflow.org/inferenceservice=<inference_service_name> --prefix=true -c storage-initializer -n <namespace>
kubectl logs -l serving.kubeflow.org/inferenceservice=<inference_service_name> --prefix=true -c kfserving-container -n <namespace>
```

To find Knative revisions that are no longer being used, run this:
```bash
kubectl get revisions -l serving.kubeflow.org/inferenceservice=<inference_service_name> -l serving.knative.dev/routingState=reserve -n <namespace>
```

You can clean up revisions with:
```bash
kubectl delete revision <revision_name> -n <namespace>
```
This will clean up associated with those revisions deployment that have been scaled to 0.


### Kubeflow Pipelines
List all pipeline runs in user namespace:
```bash
kubectl get workflows.argoproj.io -n <namespace>
```

Print the logs from all pipeline steps:
```bash
kubectl logs -l workflows.argoproj.io/workflow=<workflow_name> -c main --prefix=true -n <namespace>
```

Delete all completed pipeline runs:
```bash
kubectl delete workflows.argoproj.io -l workflows.argoproj.io/completed=true -n <namespace>
```

Delete all the pipeline runs with by final status (`Succeeded` or `Failed`):
```bash
kubectl delete -l workflows.argoproj.io -l workflows.argoproj.io/completed=true -l workflows.argoproj.io/phase=Succeeded -n <namespace>
```

### Common issues

Most problems could be identified by checking the following, going from higher-level description to low level details:
- description of the workload (TFJob, PyTorchJob, InferenceService etc.)
  - Events associated with the workload
  - Status of the workload
- pod logs

#### Errors in job code
Check if the job is running:
```bash
$ kubectl get tfjob tfjob-example 
NAME            STATE     AGE
tfjob-example   Running   6m47s
```

Check the pod status of the job:
```bash
$ kubectl get pods -l job-name=tfjob-example
NAME                     READY   STATUS             RESTARTS   AGE
tfjob-example-chief-0    0/1     CrashLoopBackOff   6          7m10s
tfjob-example-worker-0   0/1     CrashLoopBackOff   6          7m10s
tfjob-example-worker-1   0/1     CrashLoopBackOff   6          7m10s
```

In this example, the job is in the `Running` state but the pods are in the `Error` or `CrashLoopBackOff` state.
First start with the `describe` command which provide high-level view of the workload. `Status` and `Events` fields will give an overview of current status of the workload along with associated cluster events.
```bash
$ kubectl describe tfjob tfjob-sample
Name:         tfjob-sample
Namespace:    mynamespace
...
Status:
  Conditions:
    Last Transition Time:  2021-11-14T22:08:40Z
    Last Update Time:      2021-11-14T22:08:40Z
    Message:               TFJob tfjob-sample is created.
    Reason:                TFJobCreated
    Status:                True
    Type:                  Created
    Last Transition Time:  2021-11-14T22:08:49Z
    Last Update Time:      2021-11-14T22:08:49Z
    Message:               TFJob mynamespace/tfjob-sample is running.
    Reason:                TFJobRunning
    Status:                True
    Type:                  Running
  Replica Statuses:
    Chief:
      Active:  1
    Worker:
      Active:  2
  Start Time:  2021-11-14T22:08:41Z
Events:
  Type     Reason                   Age                   From         Message
  ----     ------                   ----                  ----         -------
  Normal   SuccessfulCreatePod      15m                   tf-operator  Created pod: tfjob-sample-chief-0
  Normal   SuccessfulCreateService  15m                   tf-operator  Created service: tfjob-sample-chief-0
  Normal   SuccessfulCreatePod      15m                   tf-operator  Created pod: tfjob-sample-worker-0
  Normal   SuccessfulCreatePod      15m                   tf-operator  Created pod: tfjob-sample-worker-1
  Normal   SuccessfulCreateService  15m                   tf-operator  Created service: tfjob-sample-worker-0
  Normal   SuccessfulCreateService  15m                   tf-operator  Created service: tfjob-sample-worker-1
  Warning  Error                    14m (x2 over 14m)     tf-operator  Error pod tfjob-sample-worker-1 container tensorflow exitCode: 1 terminated message:
  Normal   ExitedWithCode           14m (x2 over 14m)     tf-operator  Pod: mynamespace.tfjob-sample-worker-1 exited with code 1
  Warning  Error                    14m (x5 over 14m)     tf-operator  Error pod tfjob-sample-chief-0 container tensorflow exitCode: 1 terminated message:
  Normal   ExitedWithCode           14m (x2 over 14m)     tf-operator  Pod: mynamespace.tfjob-sample-worker-0 exited with code 1
  Normal   ExitedWithCode           14m (x6 over 14m)     tf-operator  Pod: mynamespace.tfjob-sample-chief-0 exited with code 1
  Warning  Error                    9m54s (x13 over 14m)  tf-operator  Error pod tfjob-sample-worker-0 container tensorflow exitCode: 1 terminated message:
  Warning  CrashLoopBackOff         118s                  tf-operator  Error pod tfjob-sample-worker-1 container tensorflow waiting message: back-off 5m0s restarting failed container=tensorflow pod=tfjob-sample-worker-1_mynamespace(13030281-b595-4486-89eb-1025455ec091)
```

From the events list, it is clear that all pods were created successfully and container `tensorflow` has started but terminated with code 1:
```
Events:
  Type     Reason                   Age                   From         Message
  ----     ------                   ----                  ----         -------
  Normal   SuccessfulCreatePod      15m                   tf-operator  Created pod: tfjob-sample-chief-0
  Normal   SuccessfulCreateService  15m                   tf-operator  Created service: tfjob-sample-chief-0
  Normal   SuccessfulCreatePod      15m                   tf-operator  Created pod: tfjob-sample-worker-0
  Normal   SuccessfulCreatePod      15m                   tf-operator  Created pod: tfjob-sample-worker-1
  Normal   SuccessfulCreateService  15m                   tf-operator  Created service: tfjob-sample-worker-0
  Normal   SuccessfulCreateService  15m                   tf-operator  Created service: tfjob-sample-worker-1
  Warning  Error                    14m (x2 over 14m)     tf-operator  Error pod tfjob-sample-worker-1 container tensorflow exitCode: 1 terminated message:
  Normal   ExitedWithCode           14m (x2 over 14m)     tf-operator  Pod: mynamespace.tfjob-sample-worker-1 exited with code 1
  Warning  Error                    14m (x5 over 14m)     tf-operator  Error pod tfjob-sample-chief-0 container tensorflow exitCode: 1 terminated message:
  Normal   ExitedWithCode           14m (x2 over 14m)     tf-operator  Pod: mynamespace.tfjob-sample-worker-0 exited with code 1
  Normal   ExitedWithCode           14m (x6 over 14m)     tf-operator  Pod: mynamespace.tfjob-sample-chief-0 exited with code 1
  Warning  Error                    9m54s (x13 over 14m)  tf-operator  Error pod tfjob-sample-worker-0 container tensorflow exitCode: 1 terminated message:
  Warning  CrashLoopBackOff         118s                  tf-operator  Error pod tfjob-sample-worker-1 container tensorflow waiting message: back-off 5m0s restarting failed container=tensorflow pod=tfjob-sample-worker-1_mynamespace(13030281-b595-4486-89eb-1025455ec091)
```

This implies that scheduling was successful - the scheduler was able to find enough cluster to schedule the pod and the image was pulled successfully.

The next step is to check the logs for the pod:
```bash
$ kubectl logs -l job-name=tfjob-sample --prefix=true
[pod/tfjob-sample-chief-0/tensorflow] INFO:tensorflow:Using MirroredStrategy with devices ('/job:chief/task:0',)
[pod/tfjob-sample-chief-0/tensorflow] INFO:tensorflow:Waiting for the cluster, timeout = inf
[pod/tfjob-sample-chief-0/tensorflow] INFO:tensorflow:Cluster is ready.
[pod/tfjob-sample-chief-0/tensorflow] INFO:tensorflow:MultiWorkerMirroredStrategy with cluster_spec = ...
[pod/tfjob-sample-chief-0/tensorflow] Traceback (most recent call last):
[pod/tfjob-sample-chief-0/tensorflow]   File "trainer.py", line 131, in <module>
[pod/tfjob-sample-chief-0/tensorflow]     main()
[pod/tfjob-sample-chief-0/tensorflow]   File "trainer.py", line 54, in main
[pod/tfjob-sample-chief-0/tensorflow]     tf.reshape([1, 2, 3], [2, 2])
[pod/tfjob-sample-chief-0/tensorflow]  InvalidArgumentError: Input to reshape is a tensor with 3 values, but the requested shape has 4
[pod/tfjob-sample-worker-0/tensorflow] INFO:tensorflow:Using MirroredStrategy with devices ('/job:worker/task:0',)
[pod/tfjob-sample-worker-0/tensorflow] INFO:tensorflow:Waiting for the cluster, timeout = inf
[pod/tfjob-sample-worker-0/tensorflow] INFO:tensorflow:Cluster is ready.
[pod/tfjob-sample-worker-0/tensorflow] INFO:tensorflow:MultiWorkerMirroredStrategy with cluster_spec = ...
[pod/tfjob-sample-worker-0/tensorflow] Traceback (most recent call last):
[pod/tfjob-sample-worker-0/tensorflow]   File "trainer.py", line 131, in <module>
[pod/tfjob-sample-worker-0/tensorflow]     main()
[pod/tfjob-sample-worker-0/tensorflow]   File "trainer.py", line 54, in main
[pod/tfjob-sample-worker-0/tensorflow]     tf.reshape([1, 2, 3], [2, 2])
[pod/tfjob-sample-worker-0/tensorflow] InvalidArgumentError: Input to reshape is a tensor with 3 values, but the requested shape has 4
[pod/tfjob-sample-worker-1/tensorflow] INFO:tensorflow:Using MirroredStrategy with devices ('/job:worker/task:1',)
[pod/tfjob-sample-worker-1/tensorflow] INFO:tensorflow:Waiting for the cluster, timeout = inf
[pod/tfjob-sample-worker-1/tensorflow] INFO:tensorflow:Cluster is ready.
[pod/tfjob-sample-worker-1/tensorflow] INFO:tensorflow:MultiWorkerMirroredStrategy with cluster_spec = ...
[pod/tfjob-sample-worker-1/tensorflow] Traceback (most recent call last):
[pod/tfjob-sample-worker-1/tensorflow]   File "trainer.py", line 131, in <module>
[pod/tfjob-sample-worker-1/tensorflow]     main()
[pod/tfjob-sample-worker-1/tensorflow]   File "trainer.py", line 54, in main
[pod/tfjob-sample-worker-1/tensorflow]     tf.reshape([1, 2, 3], [2, 2])
[pod/tfjob-sample-worker-1/tensorflow] InvalidArgumentError: Input to reshape is a tensor with 3 values, but the requested shape has 4
```

In the logs above we see the source of the issue - an exception was raised during the running of the trainer code.

#### Missing Image

Check if the job is running:
```bash
$ kubectl get tfjob tfjob-example 
NAME            STATE     AGE
tfjob-example   Running   1m47s
```

Check the pod status of the job:
```bash
$ kubectl get pods -l job-name=tfjob-example
NAME                    READY   STATUS             RESTARTS   AGE
tfjob-sample-chief-0    1/1     Running            0          2m32s
tfjob-sample-worker-0   0/1     ImagePullBackOff   0          2m32s
tfjob-sample-worker-1   0/1     ImagePullBackOff   0          2m32s
```

The worker pods for the Job have [ImagePullBackOff](https://kubernetes.io/docs/concepts/containers/images/#imagepullbackoff) status. 

We can get more details by describing the TFJob:

```bash
$ kubectl describe tfjob tfjob-example
Name:         tfjob-sample
Namespace:    mynamespace
...
API Version:  kubeflow.org/v1
Kind:         TFJob
Spec:
  Tf Replica Specs:
    Chief:
    ...
        Spec:
          Containers:
           ...
            Image:              mesosphere/kubeflow:mnist-sdk-example
            Image Pull Policy:  Always
            Name:               tensorflow
            ...
    Worker:
      Replicas:        2
      ...
        Spec:
          Containers:
          ...
            Image:  mesosphere/kubeflow:mnist-sdk-sample
            Name:   tensorflow
Status:
  Conditions:
    Last Transition Time:  2021-11-14T23:07:19Z
    Last Update Time:      2021-11-14T23:07:19Z
    Message:               TFJob tfjob-sample is created.
    Reason:                TFJobCreated
    Status:                True
    Type:                  Created
    Last Transition Time:  2021-11-14T23:07:25Z
    Last Update Time:      2021-11-14T23:07:25Z
    Message:               TFJob mynamespace/tfjob-sample is running.
    Reason:                TFJobRunning
    Status:                True
    Type:                  Running
  Replica Statuses:
    Chief:
      Active:  1
    Worker:
  Start Time:  2021-11-14T23:07:20Z
Events:
  Type     Reason                   Age                    From         Message
  ----     ------                   ----                   ----         -------
  Normal   SuccessfulCreatePod      10m                    tf-operator  Created pod: tfjob-sample-worker-0
  Normal   SuccessfulCreatePod      10m                    tf-operator  Created pod: tfjob-sample-worker-1
  Normal   SuccessfulCreateService  10m                    tf-operator  Created service: tfjob-sample-worker-0
  Normal   SuccessfulCreateService  10m                    tf-operator  Created service: tfjob-sample-worker-1
  Normal   SuccessfulCreatePod      10m                    tf-operator  Created pod: tfjob-sample-chief-0
  Normal   SuccessfulCreateService  10m                    tf-operator  Created service: tfjob-sample-chief-0
  Warning  ImagePullBackOff         9m32s (x2 over 9m47s)  tf-operator  Error pod tfjob-sample-worker-1 container tensorflow waiting message: Back-off pulling image "mesosphere/kubeflow:mnist-sdk-sample"
  Warning  ErrImagePull             9m31s (x7 over 10m)    tf-operator  Error pod tfjob-sample-worker-0 container tensorflow waiting message: rpc error: code = NotFound desc = failed to pull and unpack image "docker.io/mesosphere/kubeflow:mnist-sdk-sample": failed to resolve reference "docker.io/mesosphere/kubeflow:mnist-sdk-sample": docker.io/mesosphere/kubeflow:mnist-sdk-sample: not found
  Warning  ErrImagePull             9m21s (x6 over 10m)    tf-operator  Error pod tfjob-sample-worker-1 container tensorflow waiting message: rpc error: code = NotFound desc = failed to pull and unpack image "docker.io/mesosphere/kubeflow:mnist-sdk-sample": failed to resolve reference "docker.io/mesosphere/kubeflow:mnist-sdk-sample": docker.io/mesosphere/kubeflow:mnist-sdk-sample: not found
  Warning  ImagePullBackOff         4m2s (x11 over 9m47s)  tf-operator  Error pod tfjob-sample-worker-0 container tensorflow waiting message: Back-off pulling image "mesosphere/kubeflow:mnist-sdk-sample"
```

In the `Events` we can find the message that explains the cause of the issue: the image is not found in the registry:
```
Events:
  Type     Reason                   Age                    From         Message
...
  Warning  ErrImagePull             9m31s (x7 over 10m)    tf-operator  Error pod tfjob-sample-worker-0 container tensorflow waiting message: rpc error: code = NotFound desc = failed to pull and unpack image "docker.io/mesosphere/kubeflow:mnist-sdk-sample": failed to resolve reference "docker.io/mesosphere/kubeflow:mnist-sdk-sample": docker.io/mesosphere/kubeflow:mnist-sdk-sample: not found
```

#### Insufficient resources

Check if the job is running:
```bash
$ kubectl get tfjob tfjob-example 
NAME            STATE     AGE
tfjob-example   Created   90s
```

Check the pod status of the job:
```bash
$ kubectl get pods -l job-name=tfjob-sample
NAME                    READY   STATUS    RESTARTS   AGE
tfjob-sample-chief-0    0/1     Pending   0          109s
tfjob-sample-worker-0   0/1     Pending   0          109s
tfjob-sample-worker-1   0/1     Pending   0          109s
```

All of the pods are in the [Pending](https://kubernetes.io/docs/tasks/debug-application-cluster/debug-application/#my-pod-stays-pending) state.

```bash
 k describe tfjob tfjob-sample
Name:         tfjob-sample
Namespace:    mynamespace
API Version:  kubeflow.org/v1
Kind:         TFJob
...
Spec:
  Tf Replica Specs:
    Chief:
      Replicas:        1
...
        Spec:
          Containers:
...
            Image:  mesosphere/kubeflow:mnist-sdk-example
            Name:   tensorflow
            Resources:
              Requests:
                Memory:  128G
...
    Worker:
      Replicas:        2
...
        Spec:
          Containers:
...
            Image:  mesosphere/kubeflow:mnist-sdk-example
            Name:   tensorflow
            Resources:
              Requests:
                Memory:  128G
Status:
  Conditions:
    Last Transition Time:  2021-11-14T23:26:56Z
    Last Update Time:      2021-11-14T23:26:56Z
    Message:               TFJob tfjob-sample is created.
    Reason:                TFJobCreated
    Status:                True
    Type:                  Created
  Replica Statuses:
    Chief:
    Worker:
  Start Time:  2021-11-14T23:26:57Z
Events:
  Type     Reason                   Age    From         Message
  ----     ------                   ----   ----         -------
  Normal   SuccessfulCreatePod      2m20s  tf-operator  Created pod: tfjob-sample-chief-0
  Normal   SuccessfulCreateService  2m20s  tf-operator  Created service: tfjob-sample-chief-0
  Normal   SuccessfulCreatePod      2m20s  tf-operator  Created pod: tfjob-sample-worker-0
  Normal   SuccessfulCreatePod      2m20s  tf-operator  Created pod: tfjob-sample-worker-1
  Normal   SuccessfulCreateService  2m19s  tf-operator  Created service: tfjob-sample-worker-0
  Normal   SuccessfulCreateService  2m19s  tf-operator  Created service: tfjob-sample-worker-1
  Warning  Unschedulable            2m19s  tf-operator  Error pod tfjob-sample-worker-1 condition message: 0/6 nodes are available: 1 node(s) had taint {node-role.kubernetes.io/master: }, that the pod didn't tolerate, 5 Insufficient memory.
  Warning  Unschedulable            2m19s  tf-operator  Error pod tfjob-sample-chief-0 condition message: 0/6 nodes are available: 1 node(s) had taint {node-role.kubernetes.io/master: }, that the pod didn't tolerate, 5 Insufficient memory.
  Warning  Unschedulable            2m19s  tf-operator  Error pod tfjob-sample-worker-0 condition message: 0/6 nodes are available: 1 node(s) had taint {node-role.kubernetes.io/master: }, that the pod didn't tolerate, 5 Insufficient memory.
```

In the `Events` we can find the message explains the cause of the issue, for example, insufficient memory to schedule the workload:

```
Events:
  Type     Reason                   Age                    From         Message
...
  Warning  Unschedulable            2m19s  tf-operator  Error pod tfjob-sample-worker-1 condition message: 0/6 nodes are available: 1 node(s) had taint {node-role.kubernetes.io/master: }, that the pod didn't tolerate, 5 Insufficient memory.
  Warning  Unschedulable            2m19s  tf-operator  Error pod tfjob-sample-chief-0 condition message: 0/6 nodes are available: 1 node(s) had taint {node-role.kubernetes.io/master: }, that the pod didn't tolerate, 5 Insufficient memory.
  Warning  Unschedulable            2m19s  tf-operator  Error pod tfjob-sample-worker-0 condition message: 0/6 nodes are available: 1 node(s) had taint {node-role.kubernetes.io/master: }, that the pod didn't tolerate, 5 Insufficient memory.
```

## Limitations

### Kubeflow Pipelines

Kubeflow Pipelines steps can fail if the main container exits too quickly and the [Argo sidecar fails to collect artifacts](https://github.com/argoproj/argo/issues/1256).
This can happen when the container image is not available on a node and needs to be pulled from the registry first.
Retry the pipeline run or to pre-download the container image to the relevant nodes.

### Using Kubeflow Fairing with Private Docker Registries

Kubeflow Fairing does not currently support Docker registries using self-signed TLS certificates, certificate chaining, or insecure (plaintext HTTP) registries. It is recommended to use the Kaptain SDK for building and pushing Docker images
as a part of the model development process.

### Spark and Horovod

Running Spark and Horovod on Spark in client mode from a notebook with Istio enabled is not supported.
It is recommended to use the Spark Operator for running Spark applications.

### Pocket Chrome Extension

Users who have the Google Chrome extension for [Pocket](https://getpocket.com/chrome/) installed may not be able to see large portions of the Kaptain UI.
Disable the Pocket extension to ensure the Kaptain UI is completely visible.

## Component Versions

Kaptain includes:
- Kubeflow 1.4.0
  - Notebook controller 1.4.0
  - Argo Workflows 3.1.6
  - Katib 0.12.0
  - KFServing 0.6.1
  - Percona Kubernetes Operator 1.10.0
  - Kubeflow Pipelines 1.7.0
  - Training Operator 1.3.0
  - MinIO Operator 4.0.3
  - MinIO RELEASE.2021-03-01T04-20-55Z
- kubectl 1.21
- Kaniko 1.3.0
- TensorFlow Serving 1.14.0
- ONNX server 0.5.1
- Nvidia TensorRT server 19.05
- Knative 20200410
- TFX MLMD Store Server 0.21.1

Python libraries (excluding transitive dependencies):
- Miniconda 4.10.3
- JupyterLab 3.0.16
- Kaptain SDK 1.0.0
- Kubernetes SDK 18.20.0
- ML Metadata 0.22.0
- Kubeflow Pipelines 1.8.1
- TensorFlow 2.5.0
- PyTorch 1.7.1
- MXNet 1.9.0
- Horovod 0.22.0
- CUDA 11.2
- Matplotlib 3.2.1
- Papermill 2.0.0
- Open MPI
- gensim
- future
- h5py
- Keras
- NLTK
- NumPy
- Pandas
- SciPy
- scikit-learn
- Seaborn
- spaCy
- statsmodels
- typing
- boto3
- ipywidgets
- NodeJS
- Plotly
- Toree

[konvoy-troubleshooting]: /dkp/konvoy/latest/troubleshooting/
