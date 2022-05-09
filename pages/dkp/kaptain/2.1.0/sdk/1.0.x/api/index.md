---
layout: layout.pug
navigationTitle: API Documentation
title: API Documentation
beta: false
menuWeight: 99
excerpt: Kaptain SDK Python API Documentation
---
<!-- vale off -->
<!-- markdownlint-disable -->
# Table of Contents

* [kaptain.config](#kaptain.config)
  * [Config](#kaptain.config.Config)
    * [\_\_init\_\_](#kaptain.config.Config.__init__)
* [kaptain.envs](#kaptain.envs)
  * [\_M](#kaptain.envs._M)
    * [VERBOSE](#kaptain.envs._M.VERBOSE)
    * [VERBOSE](#kaptain.envs._M.VERBOSE)
    * [DEBUG](#kaptain.envs._M.DEBUG)
    * [LOG\_TIMEFORMAT](#kaptain.envs._M.LOG_TIMEFORMAT)
    * [DOCKER\_BUILDER\_CPU\_LIMIT](#kaptain.envs._M.DOCKER_BUILDER_CPU_LIMIT)
    * [DOCKER\_BUILDER\_MEM\_LIMIT](#kaptain.envs._M.DOCKER_BUILDER_MEM_LIMIT)
    * [DOCKER\_BUILDER\_CPU\_REQUEST](#kaptain.envs._M.DOCKER_BUILDER_CPU_REQUEST)
    * [DOCKER\_BUILDER\_MEM\_REQUEST](#kaptain.envs._M.DOCKER_BUILDER_MEM_REQUEST)
    * [KAPTAIN\_SDK\_DELETE\_EXPERIMENT](#kaptain.envs._M.KAPTAIN_SDK_DELETE_EXPERIMENT)
    * [KAPTAIN\_SDK\_TTL\_SECONDS\_AFTER\_FINISHED](#kaptain.envs._M.KAPTAIN_SDK_TTL_SECONDS_AFTER_FINISHED)
    * [KAPTAIN\_SDK\_FORCE\_CLEANUP](#kaptain.envs._M.KAPTAIN_SDK_FORCE_CLEANUP)
* [kaptain.exceptions](#kaptain.exceptions)
  * [InvalidModelProperty](#kaptain.exceptions.InvalidModelProperty)
  * [UndefinedModelProperty](#kaptain.exceptions.UndefinedModelProperty)
  * [UnsupportedAlgorithmException](#kaptain.exceptions.UnsupportedAlgorithmException)
  * [UnsupportedModelDeploymentException](#kaptain.exceptions.UnsupportedModelDeploymentException)
  * [UnsupportedMetricsTypeException](#kaptain.exceptions.UnsupportedMetricsTypeException)
  * [ModelDeploymentException](#kaptain.exceptions.ModelDeploymentException)
  * [ModelValidationException](#kaptain.exceptions.ModelValidationException)
  * [ImageBuildException](#kaptain.exceptions.ImageBuildException)
  * [WorkloadDeploymentError](#kaptain.exceptions.WorkloadDeploymentError)
* [kaptain.utils](#kaptain.utils)
  * [diagnose](#kaptain.utils.diagnose)
  * [list\_jobs](#kaptain.utils.list_jobs)
  * [delete\_job](#kaptain.utils.delete_job)
  * [list\_experiments](#kaptain.utils.list_experiments)
  * [delete\_experiment](#kaptain.utils.delete_experiment)
  * [list\_inference\_services](#kaptain.utils.list_inference_services)
  * [delete\_inference\_service](#kaptain.utils.delete_inference_service)
  * [delete\_jobs](#kaptain.utils.delete_jobs)
  * [delete\_experiments](#kaptain.utils.delete_experiments)
  * [delete\_inference\_services](#kaptain.utils.delete_inference_services)
  * [clean](#kaptain.utils.clean)
  * [clean\_all](#kaptain.utils.clean_all)
  * [list\_all\_resources](#kaptain.utils.list_all_resources)
  * [delete\_resource](#kaptain.utils.delete_resource)
* [kaptain.model](#kaptain.model)
* [kaptain.model.models](#kaptain.model.models)
  * [Model](#kaptain.model.models.Model)
    * [\_\_init\_\_](#kaptain.model.models.Model.__init__)
    * [hyperparameters](#kaptain.model.models.Model.hyperparameters)
    * [build](#kaptain.model.models.Model.build)
    * [train](#kaptain.model.models.Model.train)
    * [tune](#kaptain.model.models.Model.tune)
    * [deploy](#kaptain.model.models.Model.deploy)
    * [deploy\_canary](#kaptain.model.models.Model.deploy_canary)
    * [rollback\_canary](#kaptain.model.models.Model.rollback_canary)
    * [promote\_canary](#kaptain.model.models.Model.promote_canary)
    * [undeploy](#kaptain.model.models.Model.undeploy)
    * [log\_data](#kaptain.model.models.Model.log_data)
    * [log\_metrics](#kaptain.model.models.Model.log_metrics)
    * [meta](#kaptain.model.models.Model.meta)
* [kaptain.model.frameworks](#kaptain.model.frameworks)
* [kaptain.model.states](#kaptain.model.states)
* [kaptain.hyperparameter](#kaptain.hyperparameter)
* [kaptain.hyperparameter.algorithms](#kaptain.hyperparameter.algorithms)
  * [Algorithm](#kaptain.hyperparameter.algorithms.Algorithm)
    * [of](#kaptain.hyperparameter.algorithms.Algorithm.of)
* [kaptain.hyperparameter.domains](#kaptain.hyperparameter.domains)
  * [Double](#kaptain.hyperparameter.domains.Double)
    * [\_\_init\_\_](#kaptain.hyperparameter.domains.Double.__init__)
  * [Integer](#kaptain.hyperparameter.domains.Integer)
    * [\_\_init\_\_](#kaptain.hyperparameter.domains.Integer.__init__)
  * [Discrete](#kaptain.hyperparameter.domains.Discrete)
  * [Categorical](#kaptain.hyperparameter.domains.Categorical)
* [kaptain.platform.config](#kaptain.platform.config)
* [kaptain.platform.config.provider](#kaptain.platform.config.provider)
  * [ConfigurationProvider](#kaptain.platform.config.provider.ConfigurationProvider)
  * [FileBasedConfigurationProvider](#kaptain.platform.config.provider.FileBasedConfigurationProvider)
  * [EnvironmentVariableConfigurationProvider](#kaptain.platform.config.provider.EnvironmentVariableConfigurationProvider)
* [kaptain.platform.config.certificates](#kaptain.platform.config.certificates)
  * [DockerRegistryCertificateProvider](#kaptain.platform.config.certificates.DockerRegistryCertificateProvider)
    * [\_\_init\_\_](#kaptain.platform.config.certificates.DockerRegistryCertificateProvider.__init__)
* [kaptain.platform.config.docker](#kaptain.platform.config.docker)
  * [DockerConfigurationProvider](#kaptain.platform.config.docker.DockerConfigurationProvider)
    * [\_\_init\_\_](#kaptain.platform.config.docker.DockerConfigurationProvider.__init__)
* [kaptain.platform.config.defaults](#kaptain.platform.config.defaults)
* [kaptain.platform.config.s3](#kaptain.platform.config.s3)
  * [S3ConfigurationProvider](#kaptain.platform.config.s3.S3ConfigurationProvider)
    * [\_\_init\_\_](#kaptain.platform.config.s3.S3ConfigurationProvider.__init__)
    * [get\_secret\_body](#kaptain.platform.config.s3.S3ConfigurationProvider.get_secret_body)

<a name="kaptain.config"></a>
# kaptain.config

<a name="kaptain.config.Config"></a>
## Config Objects

```python
class Config()
```

<a name="kaptain.config.Config.__init__"></a>
#### \_\_init\_\_

```python
 | __init__(docker_config_provider: ConfigurationProvider, storage_config_provider: ConfigurationProvider, docker_registry_url: Optional[str] = None, docker_registry_certificate_provider: Optional[ConfigurationProvider] = None, base_dir: str = os.getcwd(), base_model_storage_uri: str = "s3://kaptain/models")
```

Encapsulates platform-specific configuration such as access credentials or AWS
endpoints. `Config` is provided as an argument to the `Model` and is used to instantiate
concrete implementations of lower-level components based on its properties so that users
work with a configuration-based API when it comes to fine-tuning the workloads.

**Arguments**:

- `docker_config_provider`: the configuration provider for Docker registry.
- `storage_config_provider`: the configuration provider for blob storage access. Currently, only S3 and MinIO are supported.
- `docker_registry_url`: private custom Docker registry URL to use with provided TLS certificates.
- `docker_registry_certificate_provider`: the configuration provider for Docker registry certificate.
- `base_dir`: base directory to use for referencing relative file paths of model files. Defaults to current working directory.
- `base_model_storage_uri`: name of a bucket in the remote storage (MinIO or S3) to store the model. Defaults to 's3://kaptain/models'

<a name="kaptain.envs"></a>
# kaptain.envs

<a name="kaptain.envs._M"></a>
## \_M Objects

```python
class _M(types.ModuleType)
```

the environment variables that can change anytime by the user

<a name="kaptain.envs._M.VERBOSE"></a>
#### VERBOSE

```python
 | @property
 | VERBOSE() -> bool
```

this environment variable (KAPTAIN_SDK_VERBOSE) will enable showing pod logs unless overridden to not

<a name="kaptain.envs._M.VERBOSE"></a>
#### VERBOSE

```python
 | @VERBOSE.setter
 | VERBOSE(value: bool) -> None
```

this environment variable (KAPTAIN_SDK_VERBOSE) will enable showing pod logs unless overridden to not

<a name="kaptain.envs._M.DEBUG"></a>
#### DEBUG

```python
 | @property
 | DEBUG() -> bool
```

this environment variable (KAPTAIN_SDK_DEBUG) will show stacktrace for uncaught exceptions

<a name="kaptain.envs._M.LOG_TIMEFORMAT"></a>
#### LOG\_TIMEFORMAT

```python
 | @property
 | LOG_TIMEFORMAT() -> str
```

this environment variable (KAPTAIN_SDK_LOG_TIMEFORMAT) will set the time format to show in logs

<a name="kaptain.envs._M.DOCKER_BUILDER_CPU_LIMIT"></a>
#### DOCKER\_BUILDER\_CPU\_LIMIT

```python
 | @DOCKER_BUILDER_CPU_LIMIT.setter
 | DOCKER_BUILDER_CPU_LIMIT(cpu_limit: str) -> None
```

set cpu limit resource for image builder job

<a name="kaptain.envs._M.DOCKER_BUILDER_MEM_LIMIT"></a>
#### DOCKER\_BUILDER\_MEM\_LIMIT

```python
 | @DOCKER_BUILDER_MEM_LIMIT.setter
 | DOCKER_BUILDER_MEM_LIMIT(mem_limit: str) -> None
```

set memory limit resource for image builder job

<a name="kaptain.envs._M.DOCKER_BUILDER_CPU_REQUEST"></a>
#### DOCKER\_BUILDER\_CPU\_REQUEST

```python
 | @DOCKER_BUILDER_CPU_REQUEST.setter
 | DOCKER_BUILDER_CPU_REQUEST(cpu_request: str) -> None
```

set cpu request resource for image builder job

<a name="kaptain.envs._M.DOCKER_BUILDER_MEM_REQUEST"></a>
#### DOCKER\_BUILDER\_MEM\_REQUEST

```python
 | @DOCKER_BUILDER_MEM_REQUEST.setter
 | DOCKER_BUILDER_MEM_REQUEST(mem_request: str) -> None
```

set memory request resource for image builder job

<a name="kaptain.envs._M.KAPTAIN_SDK_DELETE_EXPERIMENT"></a>
#### KAPTAIN\_SDK\_DELETE\_EXPERIMENT

```python
 | @KAPTAIN_SDK_DELETE_EXPERIMENT.setter
 | KAPTAIN_SDK_DELETE_EXPERIMENT(value: bool) -> None
```

Delete the experiment resource upon the completion of the tuning step. Note: once the experiment is deleted,
it won't be available for viewing in the Katib UI

<a name="kaptain.envs._M.KAPTAIN_SDK_TTL_SECONDS_AFTER_FINISHED"></a>
#### KAPTAIN\_SDK\_TTL\_SECONDS\_AFTER\_FINISHED

```python
 | @KAPTAIN_SDK_TTL_SECONDS_AFTER_FINISHED.setter
 | KAPTAIN_SDK_TTL_SECONDS_AFTER_FINISHED(ttl_seconds: int) -> None
```

Number of seconds after which a completed training job gets automatically deleted.

<a name="kaptain.envs._M.KAPTAIN_SDK_FORCE_CLEANUP"></a>
#### KAPTAIN\_SDK\_FORCE\_CLEANUP

```python
 | @KAPTAIN_SDK_FORCE_CLEANUP.setter
 | KAPTAIN_SDK_FORCE_CLEANUP(value: bool) -> None
```

If set to True, delete completed training jobs automatically ignoring the TTL.

<a name="kaptain.exceptions"></a>
# kaptain.exceptions

<a name="kaptain.exceptions.InvalidModelProperty"></a>
## InvalidModelProperty Objects

```python
class InvalidModelProperty(Exception)
```

Raised when a model property is None or blank.

<a name="kaptain.exceptions.UndefinedModelProperty"></a>
## UndefinedModelProperty Objects

```python
class UndefinedModelProperty(Exception)
```

Raised when a model property is not defined.

<a name="kaptain.exceptions.UnsupportedAlgorithmException"></a>
## UnsupportedAlgorithmException Objects

```python
class UnsupportedAlgorithmException(Exception)
```

Raised when a hyperparameter tuning algorithm is not supported.

<a name="kaptain.exceptions.UnsupportedModelDeploymentException"></a>
## UnsupportedModelDeploymentException Objects

```python
class UnsupportedModelDeploymentException(Exception)
```

Raised when a model deployment is not supported.

<a name="kaptain.exceptions.UnsupportedMetricsTypeException"></a>
## UnsupportedMetricsTypeException Objects

```python
class UnsupportedMetricsTypeException(Exception)
```

Raised when a metric type is not supported.

<a name="kaptain.exceptions.ModelDeploymentException"></a>
## ModelDeploymentException Objects

```python
class ModelDeploymentException(Exception)
```

Raised in case of a model deployment failure.

<a name="kaptain.exceptions.ModelValidationException"></a>
## ModelValidationException Objects

```python
class ModelValidationException(Exception)
```

Raised in case the model configuration properties are missing or model is in a state that
is unsuitable for the operation invoked on the model.

<a name="kaptain.exceptions.ImageBuildException"></a>
## ImageBuildException Objects

```python
class ImageBuildException(Exception)
```

Raised in case of a image build failure.

<a name="kaptain.exceptions.WorkloadDeploymentError"></a>
## WorkloadDeploymentError Objects

```python
class WorkloadDeploymentError(Exception)
```

Raised in case of a workload deployment failure, e.g. failed scheduling

<a name="kaptain.utils"></a>
# kaptain.utils

<a name="kaptain.utils.diagnose"></a>
#### diagnose

```python
diagnose() -> None
```

List all managed resources for the current namespace: TfJobs, PyTorchJobs, Experiments and Inference Services, Secrets, Pods, and Service Accounts

<a name="kaptain.utils.list_jobs"></a>
#### list\_jobs

```python
list_jobs() -> None
```

List all training jobs in current namespace.

<a name="kaptain.utils.delete_job"></a>
#### delete\_job

```python
delete_job(name: str, kind: Optional[str] = None) -> None
```

Deletes a training job based on provided name and kind.

**Arguments**:

- `name`: job name
- `kind`: job kind (optional), e.g. "tfjob", "pytorchjob" of "job".

<a name="kaptain.utils.list_experiments"></a>
#### list\_experiments

```python
list_experiments() -> None
```

Lists Katib experiments.

<a name="kaptain.utils.delete_experiment"></a>
#### delete\_experiment

```python
delete_experiment(name: str) -> None
```

Deletes Katib experiment.

**Arguments**:

- `name`: Name of the experiment

<a name="kaptain.utils.list_inference_services"></a>
#### list\_inference\_services

```python
list_inference_services() -> None
```

Lists deployed inference services.

<a name="kaptain.utils.delete_inference_service"></a>
#### delete\_inference\_service

```python
delete_inference_service(name: str) -> None
```

Deletes inference service.

**Arguments**:

- `name`: Name of the inference service

<a name="kaptain.utils.delete_jobs"></a>
#### delete\_jobs

```python
delete_jobs(force: bool = False) -> None
```

Deletes all training jobs created by the SDK.

**Arguments**:

- `force`: If True, delete all (even running) jobs created by the SDK, otherwise, delete only completed jobs.

<a name="kaptain.utils.delete_experiments"></a>
#### delete\_experiments

```python
delete_experiments(force: bool = False) -> None
```

Deletes all experiments created by the SDK.

**Arguments**:

- `force`: If True, delete all (even running) experiments created by the SDK, otherwise, delete only completed experiments.

<a name="kaptain.utils.delete_inference_services"></a>
#### delete\_inference\_services

```python
delete_inference_services(force: bool = False) -> None
```

Delete all inference services created by the SDK.

**Arguments**:

inference services with 'NotReady' status.
- `force`: If True, delete all (even already deployed) inference services created by the SDK, otherwise, delete

**Returns**:



<a name="kaptain.utils.clean"></a>
#### clean

```python
clean(force: bool = False) -> None
```

Deletes stale resources (such as Secrets and ServiceAccounts which are not used by any workloads).

WARNING: Use with caution! To prevent data loss, please first run this method without any arguments set and check
whether the resources proposed by the method can be safely deleted.

**Arguments**:

- `force`: If False, method only prints unused resource names without actually removing them.

<a name="kaptain.utils.clean_all"></a>
#### clean\_all

```python
clean_all(force: bool = False) -> None
```

Deletes all completed workloads and stale Kubernetes resources created by the SDK.

**Arguments**:

delete only completed workloads and prints stale resources (secrets and service accounts).
- `force`: If True, delete all (even running) workloads and resources created by the SDK, otherwise

**Returns**:



<a name="kaptain.utils.list_all_resources"></a>
#### list\_all\_resources

```python
list_all_resources() -> None
```

Lists all deployed resources: TfJobs, PyTorchJobs, Experiments and Inference Services.

<a name="kaptain.utils.delete_resource"></a>
#### delete\_resource

```python
delete_resource(kind: str, name: str) -> None
```

Deletes inference service.

**Arguments**:

- `name`: Name of the resource
- `kind`: Kind of the resource - one of "tfjob", "pytorchjob", "experiment" or "inferenceservice".

<a name="kaptain.model"></a>
# kaptain.model

<a name="kaptain.model.models"></a>
# kaptain.model.models

<a name="kaptain.model.models.Model"></a>
## Model Objects

```python
class Model()
```

<a name="kaptain.model.models.Model.__init__"></a>
#### \_\_init\_\_

```python
 | __init__(id: str, name: str, description: str, version: str, framework: ModelFramework, framework_version: str, main_file: str, image_name: str, base_image: str, extra_files: Optional[List[str]] = None, requirements: Optional[str] = None, labels: Optional[List[str]] = None, config: Optional[Config] = None, serving_config: Optional[Dict[str, str]] = None)
```

A representation of a machine learning model.

When the model is created for the first time, its internal revision is set to a random UUID
and its internal state is "untrained". Once the model is trained or tuned, its state will
be updated accordingly, hyperparameter values set, its revision refreshed, and it can be
saved or deployed. Each action (train, tune, deploy) alters the revision and is stored
in the model tracking database.

**Arguments**:

Details on the format can be found here: https://pip.pypa.io/en/stable/cli/pip_install/`requirements`-file-format.
- `id`: Unique identifier of model, e.g. "dev/mnist". It is recommended to include the stage of the model (e.g. dev/prod) in the name to make it easier to filter models under active development and in production.
- `name`: Short name of the model, e.g. "MNIST". This name is visible in the model tracking database.
- `description`: Description of the model, e.g. "Digit recognition for MNIST data set". This description is visible in the model tracking database.
- `version`: Model version, e.g. "4.5"
- `main_file`: Main (Python) file that contains the executable model code, e.g. "trainer.py".
- `image_name`: Name of the repository to push the resulting image, e.g. 'kaptain/mnist' Can also contain image tag, e.g. "kaptain/mnist:0.0.1-tensorflow-2.2.0".
- `extra_files`: Auxiliary files, e.g. ["utils.py", "data_loader.py"].
- `requirements`: Path to the file with additional python packages to install into the image in pip compatible format (e.g. "requirements.txt").
- `framework`: Machine learning library or framework used for the model, e.g. "tensorflow".
- `framework_version`: Machine learning library or framework version used by model, e.g. "2.3.2"
- `base_image`: Base container image, e.g. "tensorflow-2.3.2"
- `labels`: Custom labels for deployment-related metadata, e.g. "dev/mnist-tensorflow"
- `config`: Configuration object used for configuring access to Docker registries and blob storage.
- `serving_config`: Configuration specific to model servers

<a name="kaptain.model.models.Model.hyperparameters"></a>
#### hyperparameters

```python
 | @property
 | hyperparameters() -> Optional[Dict[str, Any]]
```

Hyperparameters of the model as defined through an action:
- Train: uses the static values provided to the training procedure.
- Tune: extracts the recommended values after running multiple experiments.

<a name="kaptain.model.models.Model.build"></a>
#### build

```python
 | build(verbose: Optional[bool] = None) -> bool
```

Builds a Docker image with the model training code and dependencies and publishes it to the registry
specified in the configuration.
Label with checksum of the model's content will be included in the image.
Image rebuilding is triggered only if an image with the same name and checksum is not already present
in the registry.

**Arguments**:

- `verbose`: Enable verbose output (can also be set via environment variable KAPTAIN_SDK_VERBOSE).

**Returns**:

True if successful, otherwise False

<a name="kaptain.model.models.Model.train"></a>
#### train

```python
 | train(hyperparameters: Dict[str, Any], args: Optional[Dict[str, Any]] = None, gpus: Optional[int] = None, cpu: Optional[str] = None, memory: Optional[str] = None, resources: Optional[Resources] = None, workers: int = 2, verbose: Optional[bool] = None, ttl_seconds_after_finished: Optional[int] = None, force_cleanup: Optional[bool] = None, timeout: Optional[int] = constants.DEFAULT_TIMEOUT_SECONDS) -> bool
```

Train a model in a distributed manner.

##### Simple / advanced resource API

Resources may be specified via the 'simple' resource parameters::

    model.train(workers=1, cpu=1, memory="2G", gpus=0)

... the model training process will have both the request and limit set for all resource parameters.

More fine-grained resource specification is possible via the 'resources' parameter::

    model.train(workers=workers, resources=Resources(cpu_request=1, memory_limit="2G", gpu_limit=gpus))

It is illegal to specify both the 'resources' parameter or any 'simple' resource parameters (gpus, memory, cpu).

**Arguments**:

Can be set via 'KAPTAIN_SDK_TTL_SECONDS_AFTER_FINISHED' environment variable.

- `args`: Arguments to be passed to the training function.
- `hyperparameters`: Dictionary of hyperparameter values.
- `workers`: Number of parallel workers to use (default: 2).
- `gpus`: Number of GPUs to use (default: 0).
- `memory`: Amount of memory for each worker (optional),
- `cpu`: Number of CPUs to use for each worker (optional).
- `resources`: Advanced API for resource specification. Do not use in tandem with the parameters gpus, memory and cpu (optional).
- `verbose`: Enable verbose output (can also be set via environment variable KAPTAIN_SDK_VERBOSE).
- `ttl_seconds_after_finished`: Number of seconds after which a completed training job gets automatically deleted.
- `force_cleanup`: If set to True, delete completed training jobs automatically ignoring the TTL (can also be set via 'KAPTAIN_SDK_FORCE_CLEANUP' environment variable).
- `timeout`: Number of seconds to wait for the training job to complete before timing-out

**Returns**:

True if successful, otherwise False

<a name="kaptain.model.models.Model.tune"></a>
#### tune

```python
 | tune(hyperparameters: Dict[str, Domain], objectives: List[str], objective_goal: Optional[float] = None, objective_type: str = "maximize", workers: int = 2, gpus: Optional[int] = None, cpu: Optional[str] = None, memory: Optional[str] = None, resources: Optional[Resources] = None, trials: int = 16, parallel_trials: int = 2, failed_trials: int = 4, algorithm: Optional[str] = Algorithm.RANDOM.value, algorithm_setting: Optional[dict] = None, args: Optional[Dict[str, Any]] = None, verbose: Optional[bool] = None, delete_experiment: Optional[bool] = None, ttl_seconds_after_finished: Optional[int] = None, timeout: Optional[int] = constants.DEFAULT_TIMEOUT_SECONDS) -> bool
```

Tunes a model with parallel trials and possibly distributed trials.

##### Simple / advanced resource API

Resources may be specified via the 'simple' resource parameters::

    model.tune(hyperparameters=params, objectives=objectives, cpu=1, memory="2G", gpus=0)

... the deployed tuning process will have both the request and limit set for all resource parameters.

More fine-grained resource specification is possible via the 'resources' parameter::

    model.tune(
      hyperparameters=params,
      objectives=objectives,
      resources=Resources(cpu_request=1, memory_limit="2G", gpu_limit=gpus))

It is illegal to specify both the 'resources' parameter or any 'simple' resource parameters (gpus, memory, cpu).

**Arguments**:


- `args`: Arguments to be passed to the the experiment trial specification.
- `hyperparameters`: Dictionary of hyperparameters and their specified domains.
- `objectives`: List of metrics to track in order of importance. The first one listed is used in conjunction with the objective goal and type.
- `objective_goal`: Main objective's goal, which when reached causes the tuning to stop. The main objective is the first element in `objectives`. If None, the tuning will continue until the maximum number of `trials` has been reached.
- `objective_type`: Whether to "maximize" or "minimize" the main objective's value (default: maximize).
- `workers`: Number of parallel workers to use for each trial (default: 2).
- `gpus`: Number of GPUs to use (default: 0).
- `memory`: Amount of memory for each worker (optional),
- `cpu`: Number of CPUs to use for each worker (optional).
- `resources`: Advanced API for resource specification. Do not use in tandem with the parameters gpus, memory and cpu (optional).
- `trials`: Maximum number of trials (default: 16).
- `parallel_trials`: Maximum number of trials to run in parallel (default: 2).
- `failed_trials`: Maximum number of failed trials before hyperparameter tuning stops (default: 4).
- `algorithm`: Algorithm to use for hyperparameter search (default: random).
- `algorithm_setting`: Algorithm settings. Please see https://www.kubeflow.org/docs/components/hyperparameter-tuning/experiment/ for details.
- `verbose`: Enable verbose output (can also be set via environment variable KAPTAIN_SDK_VERBOSE).
- `delete_experiment`: Delete the experiment resource upon the completion of the tuning step. Can be set via 'KAPTAIN_SDK_DELETE_EXPERIMENT' environment variable. Note: once the experiment is deleted, it won't be available for viewing in the Katib UI.
- `ttl_seconds_after_finished`: Number of seconds after which a completed training job gets automatically deleted.
- `timeout`: Number of seconds to wait for the experiment to complete before timing-out.

**Returns**:

True if successful, otherwise False

<a name="kaptain.model.models.Model.deploy"></a>
#### deploy

```python
 | deploy(model_uri: Optional[str] = None, autoscale: int = 2, gpus: Optional[int] = None, cpu: Optional[str] = None, memory: Optional[str] = None, resources: Optional[Resources] = None, replace: bool = False, **kwargs: str, ,) -> bool
```

Deploys a model.

##### Simple / advanced resource API

Resources may be specified via the 'simple' resource parameters::

model.deploy(model_uri=uri, cpu=1, memory="2G", gpus=0)

... the deployed model process will have both the request and limit set for all resource parameters.

More fine-grained resource specification is possible via the 'resources' parameter::

model.deploy(model_uri=uri, resources=Resources(cpu_request=1, memory_limit="2G", gpu_limit=gpus))

It is illegal to specify both the 'resources' parameter or any 'simple' resource parameters (gpus, memory, cpu).

**Arguments**:


- `model_uri`: URI of the saved model to be loaded. If None, the default location managed by Kaptain is chosen based on the most recent state of the model.
- `autoscale`: Target concurrency (default: 2).
- `gpus`: Number of GPUs to use (default: 0).
- `memory`: Amount of memory for each worker (optional),
- `cpu`: Number of CPUs to use for each worker (optional).
- `resources`: Advanced API for resource specification. Do not use in tandem with the parameters gpus, memory and cpu (optional).
- `replace`: Safety flag to avoid accidental redeployment of the model. If True, the previously deployed model will be replaced. If False, an error will be logged in case the model had been previously deployed.
- `kwargs`: Keyword arguments for the deployment.

**Returns**:

True if successful, otherwise False

<a name="kaptain.model.models.Model.deploy_canary"></a>
#### deploy\_canary

```python
 | deploy_canary(canary_traffic_percentage: int, model_uri: Optional[str] = None, **kwargs: str, ,) -> None
```

Deploys a model in a canary with a pre-determined percentage of traffic.
A canary deployment allows a model to be run in parallel with a baseline or previous model
revision. This allows traffic to be split, so the latest revision can be checked for
possible issues with model (e.g. compared to the baseline) or system (e.g. latency)
performance.
To deploy a model to the canary, a previously deployed model revision must exist.

------------------------------
To deploy canary with 30 percent traffic:

model.deploy_canary(canary_traffic_percentage=30)

To change the canary traffic percentage to 50 (half the traffic):

model.deploy_canary(canary_traffic_percentage=50)

To deploy canary with 30 percent traffic and specified saved model location:

model.deploy_canary(canary_traffic_percentage=30, model_uri=uri)

To change the canary traffic percentage to 50 (half the traffic) for a model deployed
from a specified saved location:

model.deploy_canary(canary_traffic_percentage=50, model_uri=uri)

**Arguments**:

- `canary_traffic_percentage`: the percentage of traffic to route to the canary model.
- `model_uri`: URI of the saved model to be loaded. If None, the default location managed by Kaptain is chosen based on the most recent state of the model.

<a name="kaptain.model.models.Model.rollback_canary"></a>
#### rollback\_canary

```python
 | rollback_canary() -> None
```

Undeploy the model from canary and switch 100% of traffic to the previously deployed
baseline model.

:raises: ModelDeploymentException if canary deployment doesn't exist.

<a name="kaptain.model.models.Model.promote_canary"></a>
#### promote\_canary

```python
 | promote_canary() -> None
```

Promote the model from canary to server 100% of traffic.

:raises: ModelDeploymentException if canary deployment doesn't exist.

<a name="kaptain.model.models.Model.undeploy"></a>
#### undeploy

```python
 | undeploy() -> None
```

Removes existing deployment and canary deployment of a model.

:raises: ModelDeploymentException in case the model was not previously deployed

<a name="kaptain.model.models.Model.log_data"></a>
#### log\_data

```python
 | log_data(name: str, uri: str, description: Optional[str] = None, features: Optional[List[str]] = None, version: Optional[str] = None) -> None
```

Logs an input data set to a model execution.

**Arguments**:

- `name`: Name of the data set.
- `uri`: URI of the data set.
- `description`: Optional description.
- `features`: List of features used.
- `version`: Optional version of the data set.

<a name="kaptain.model.models.Model.log_metrics"></a>
#### log\_metrics

```python
 | log_metrics(metrics: dict, metrics_type: str, uri: Optional[str] = None) -> None
```

Logs model evaluation metrics to a model execution.

**Arguments**:

- `metrics`: A dictionary of metrics names and their values, e.g. {"accuracy", 0.95, "auc": 0.975}.
- `metrics_type`: Evaluation type of the metric: training, testing, validation, or production (for deployed models).
- `uri`: Optional URI to the metrics (e.g. log directory).

<a name="kaptain.model.models.Model.meta"></a>
#### meta

```python
 | meta() -> ModelMeta
```

Creates an immutable snapshot of model properties.

**Returns**:

ModelMeta data class with a copy of all current model field values

<a name="kaptain.model.frameworks"></a>
# kaptain.model.frameworks

<a name="kaptain.model.states"></a>
# kaptain.model.states

<a name="kaptain.hyperparameter"></a>
# kaptain.hyperparameter

<a name="kaptain.hyperparameter.algorithms"></a>
# kaptain.hyperparameter.algorithms

<a name="kaptain.hyperparameter.algorithms.Algorithm"></a>
## Algorithm Objects

```python
class Algorithm(Enum)
```

<a name="kaptain.hyperparameter.algorithms.Algorithm.of"></a>
#### of

```python
 | @staticmethod
 | of(algorithm: Optional[str]) -> Optional["Algorithm"]
```

Converts a hyperparameter tuning algorithm (string) to an Algorithm enum.

**Arguments**:

- `algorithm`: Model framework or library.

**Returns**:

`Algorithm` enum if the algorithm is supported.

<a name="kaptain.hyperparameter.domains"></a>
# kaptain.hyperparameter.domains

<a name="kaptain.hyperparameter.domains.Double"></a>
## Double Objects

```python
class Double(Domain)
```

<a name="kaptain.hyperparameter.domains.Double.__init__"></a>
#### \_\_init\_\_

```python
 | __init__(min: float, max: float)
```

Defines a floating-point (double) hyperparameter with domain [min, max]

**Arguments**:

- `min`: Minimum value
- `max`: Maximum value

<a name="kaptain.hyperparameter.domains.Integer"></a>
## Integer Objects

```python
class Integer(Domain)
```

<a name="kaptain.hyperparameter.domains.Integer.__init__"></a>
#### \_\_init\_\_

```python
 | __init__(min: int, max: int)
```

Defines an integer (int) hyperparameter with domain [min, max]

**Arguments**:

- `min`: Minimum value
- `max`: Maximum value

<a name="kaptain.hyperparameter.domains.Discrete"></a>
## Discrete Objects

```python
class Discrete(Domain)
```

Defines an discrete hyperparameter with a list of possible values of floats

**Arguments**:

- `values`: List of allowed floating-point values

<a name="kaptain.hyperparameter.domains.Categorical"></a>
## Categorical Objects

```python
class Categorical(Domain)
```

Defines an integer hyperparameter with a list of possible values of strings

**Arguments**:

- `values`: List of allowed string values

<a name="kaptain.platform.config"></a>
# kaptain.platform.config

<a name="kaptain.platform.config.provider"></a>
# kaptain.platform.config.provider

<a name="kaptain.platform.config.provider.ConfigurationProvider"></a>
## ConfigurationProvider Objects

```python
class ConfigurationProvider(ABC)
```

The ConfigurationProvider interface defines high-level functions for translating user-provided
credentials for a Docker registry or cloud buckets into Kubernetes Secrets required for
distributed building, training, tuning, and serving components.

<a name="kaptain.platform.config.provider.FileBasedConfigurationProvider"></a>
## FileBasedConfigurationProvider Objects

```python
class FileBasedConfigurationProvider(ConfigurationProvider)
```

The FileBasedConfigurationProvider defines a factory method for creating instances of
ConfigurationProvider from provided configuration file specific for the concrete
implementation.

<a name="kaptain.platform.config.provider.EnvironmentVariableConfigurationProvider"></a>
## EnvironmentVariableConfigurationProvider Objects

```python
class EnvironmentVariableConfigurationProvider(ConfigurationProvider)
```

The EnvironmentVariableConfigurationProvider defines a factory method for creating instances
of ConfigurationProvider from environment variables specific for the concrete implementation.

<a name="kaptain.platform.config.certificates"></a>
# kaptain.platform.config.certificates

<a name="kaptain.platform.config.certificates.DockerRegistryCertificateProvider"></a>
## DockerRegistryCertificateProvider Objects

```python
class DockerRegistryCertificateProvider(FileBasedConfigurationProvider)
```

<a name="kaptain.platform.config.certificates.DockerRegistryCertificateProvider.__init__"></a>
#### \_\_init\_\_

```python
 | __init__(certificate_body: str, certificate_path: Optional[str] = None)
```

Docker Registry Certificate Provider is a container for private Docker registries running
with custom/self-signed TLS certificates which are required for pushing Docker images
containing model training code.

Docker Registry Certificate Provider by default loads the configuration from
`$HOME/.tls/certificate.crt`. It is also possible to specify a custom registry
`certificate.crt` location using
DockerRegistryCertificateProvider.from_file(path=/path/to/certificate.crt).

Docker Registry `certificate.crt` file can be created ad-hoc while using a notebook or
mounted to the notebook from a Secret. To support mounting of a shared Docker certificate.crt
as a volume, the system administrator must create the `PodDefault` resource with a
certificate file to make it available for the user.

**Arguments**:

- `certificate_body`: The configuration string in json format
- `certificate_path`: Path to the certificate file (optional)

<a name="kaptain.platform.config.docker"></a>
# kaptain.platform.config.docker

<a name="kaptain.platform.config.docker.DockerConfigurationProvider"></a>
## DockerConfigurationProvider Objects

```python
class DockerConfigurationProvider(FileBasedConfigurationProvider)
```

<a name="kaptain.platform.config.docker.DockerConfigurationProvider.__init__"></a>
#### \_\_init\_\_

```python
 | __init__(config_json: str)
```

Docker Configuration Provider is a container for user Docker configuration which are
required for pulling and pushing images used in training and tuning jobs.

Docker Configuration Provider supports standard Docker config.json file of the following
format:
```
    {
        "auths": {
                "https://index.docker.io/v1/": {
                        "auth": "<username and password in base64>"
                }
        }
    }
```
The `auth` field is a base64-encoded string of the form "<username>:<password>" where
<username> and <password> are the actual username and password used to login to Docker
registry. To generate value for `auth` field, use the following command:
`echo -n "<username>:<password>" | base64`.

Docker Configuration Provider by default loads the configuration from
`$HOME/.docker/config.json`. It is also possible to specify a custom config.json location
using DockerConfigurationProvider.from_file(path=/path/to/config.json).

Docker `config.json` file can be created ad-hoc while using a notebook or mounted to the
notebook from a Secret. To support mounting of a shared Docker config.json as a volume,
the system administrator must create the `PodDefault` resource with a pre-populated file
to make it available for the user.

**Arguments**:

- `config_json`: The configuration string in json format

<a name="kaptain.platform.config.defaults"></a>
# kaptain.platform.config.defaults

<a name="kaptain.platform.config.s3"></a>
# kaptain.platform.config.s3

<a name="kaptain.platform.config.s3.S3ConfigurationProvider"></a>
## S3ConfigurationProvider Objects

```python
class S3ConfigurationProvider(FileBasedConfigurationProvider,  EnvironmentVariableConfigurationProvider)
```

<a name="kaptain.platform.config.s3.S3ConfigurationProvider.__init__"></a>
#### \_\_init\_\_

```python
 | __init__(aws_access_key_id: str, aws_secret_access_key: str, aws_session_token: Optional[str] = None, region_name: str = _DEFAULT_REGION, s3_endpoint: Optional[str] = None, s3_signature_version: Optional[str] = None, s3_force_path_style: bool = False)
```

S3-specific configuration provider which supports reading configuration from AWS
configuration file and from environment variables. The provider can be used as a
configuration object, or for convenience resolution of the configuration both on the
development side and in containers when configuration is passed in form of environment
variables from Kubernetes `Secrets`.

Constructor arguments represent a subset of
[boto3 configuration properties]
(https://boto3.amazonaws.com/v1/documentation/api/latest/guide/configuration.html)
sufficient for `kaptain`.

**Arguments**:

- `aws_access_key_id`: The access key to authenticate with S3.
- `aws_secret_access_key`: The secret key to authenticate with S3.
- `aws_session_token`: The session token to authenticate with S3.
- `region_name`: The name of AWS region.
- `s3_endpoint`: The complete URL of S3 endpoint. This parameter is required when working with non-standard, S3-compatible storage solutions such as MinIO. It should be set to a resolvable address of the running server.
- `s3_signature_version`: The signature version when signing requests
- `s3_force_path_style`: When enabled, the clients will use path style instead of URL style for accessing buckets

<a name="kaptain.platform.config.s3.S3ConfigurationProvider.get_secret_body"></a>
#### get\_secret\_body

```python
 | get_secret_body() -> Dict[str, str]
```

Transforms the configuration properties into a dict of environment variables. The
resulting dict will be used for creating Kubernetes `Secret` to securely share access
credentials between containers.

**Returns**:

dict of environment variables with associated values

