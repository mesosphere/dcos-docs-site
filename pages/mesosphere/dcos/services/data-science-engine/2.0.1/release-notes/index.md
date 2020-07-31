---
layout: layout.pug
navigationTitle: Release Notes
excerpt: Discover the new features, updates, and known limitations in this release of the DC/OS Data Science Engine
title: Release Notes
menuWeight: 0
enterprise: true
model: /mesosphere/dcos/services/data-science-engine/data.yml
render: mustache
---

# {{ model.techName }} 2.0.1 was released on 31, July 2020

## New Features

- {{ model.techName }} now allows multiple Spark UI instances to be accessible


# {{ model.techName }} 2.0.0 was released on 12, June 2020

## New Features

- Horovod for supporting distributed training with TensorFlow, PyTorch, and MXNet
- Horovod-on-Spark integration for dynamic allocation of cluster resources
- User management and filesystem permissions by adding the ability to access host path volumes with custom UID/GID
- Seamless upgrade process
- EdgeLB integration (limited to notebooks only)
- Pre-baked Notebook images with different flavors of ML libraries
- TensorFlow, PyTorch, MXNet as the main ML distributions
- Added Horovod + Spark for distributed use-cases
- Notebook image has two flavors: local and distributed
- Each image has CPU and GPU variant
- Mounting host path support
- Upgrading Jupyter and other frameworks to the latest versions:
  - JupyterLab 2.0 
  - TensorFlow 1.15
  - TensorFlow 2.1.0
  - PyTorch 1.4.0
  - MXNet 1.6.0
  - Horovod 0.19.0

## Bug Fixes

- Fixed allowing spaces in the notebook name
- Fixed Conda packages directory path for conda virtual environment creation

## Limitations

- BeakerX kernels have been removed from the distribution. Now only IPython, Toree, and R kernels supported

# Release Notes for {{ model.techName }} version 1.0.2

## New Features

- Updated miniconda version from `4.6.14` to `4.7.12.1`

## Bug Fixes

- Fixed LD_LIBRARY_PATH to point to correct version of CUDA libraries
- Fixed Spark Environment to have SPARK_DIST_CLASSPATH set
- Fixed Service Account file path to allow notebooks to run from any directory
- Fixed BeakerX configuration file path to allow BeakerX Spark Magic to work from any directory

## Limitations

- {{ model.techName }} does not support notebook having spaces in the name. It is recommended to use underscore (`_`) instead of (` `) in the notebook name.


# Release Notes for {{ model.techName }} version 1.0.1

## New Features

- Added automation for enabling/disabling verbose logging for Spark resource offers
- Notebook Docker image is configurable via service options.
- {{ model.techName }} now stores fetched Hadoop configuration files, hdfs-site.xml and core-site.xml, in `$MESOS_SANDBOX/hadoop_conf` folder so users can modify them without root privileges.

## Bug Fixes

- Fixed Spark configuration dialog in BeakerX kernel.
- Fixed folder permissions so users can install new packages with `conda` or `pip`.
- Fixed static resources paths in host mode for components with UI: Spark, History Server, Tensorboard

## Breaking Changes

- CUDA 9 images will no longer be provided with a bundle; CUDA 10 is the only version used for GPU images.
- `jaas_secret` option removed from security configuration.  `extra_spark_secrets` should be used instead.

## Limitations

- {{ model.techName }} does not fully support `root` service user. It is recommended to use the default user `nobody`.
- {{ model.techName }} does not support the installation of Python packages on CoreOS. It is recommended to use CentOS.
- {{ model.techName }} does not support AWS Classic Load Balancer, because it does not support WebSockets. It is recommended to configure load balancers and proxies to allow WebSockets.
