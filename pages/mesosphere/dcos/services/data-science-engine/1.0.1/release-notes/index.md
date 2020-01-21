---
layout: layout.pug
navigationTitle: Release Notes
excerpt: Release notes for DC/OS Data Science Engine
title: Release Notes
menuWeight: 0
enterprise: true
model: /mesosphere/dcos/services/data-science-engine/data.yml
render: mustache
---

# Release notes for {{ model.techName }} version 1.0.1

## {{ model.techName }} new features

- Added automation for enabling/disabling verbose logging for Spark resource offers
- Notebook Docker image is configurable via service options
- {{ model.techName }} now stores fetched Hadoop configuration files, hdfs-site.xml and core-site.xml, in `$MESOS_SANDBOX/hadoop_conf` folder so users can modify them without root privileges

## {{ model.techName }} bug fixes

- Fixed configuration of BeakerX kernel so it displays Spark configuration dialog
- Fixed folder permissions so users can install new packages with conda or pip
- Fixed static resources paths in host mode for components with UI: Spark, History Server, Tensorboard

## {{ model.techName }} breaking changes

- CUDA 9 images will no longer be provided with a bundle, CUDA 10 is the only version used for GPU images
- jaas_secret option removed from security configuration, `extra_spark_secrets` should be used instead

## {{ model.techName }} limitations

- {{ model.techName }} does not fully support root service user, it is recommended to use the default user nobody
- {{ model.techName }} does not support the installation of Python packages on CoreOS. It is recommended to use CentOS.
- {{ model.techName }} does not support AWS Classic Load Balancer, because it does not support WebSockets. It is recommended to configure load balancers and proxies to allow WebSockets.


# Release notes for {{ model.techName }} version 1.0.0

This is the first release for {{ model.techName }}.

{{ model.techName }} was released on 6 August 2019.

{{ model.techName }} works on any infrastructure (cloud, bare metal and virtual).

## {{ model.techName }} components

{{ model.techName }} 1.0.0 includes the following components:

- Framework lifecycle for upgrades and updates
- 24/7 Mesosphere engineering support for all components included in the stack
    - {{ model.techName }}
    - Spark and Spark History Server 2.4.0
    - TensorFlow 1.13.1
    - TensorFlow on Spark
    - Tensorboard
    - Integration to pool CPU and GPU compute resources in the entire cluster
    - Easy configurable resource quota to dynamically share cluster resources
    - Secure AuthN+Z to the Notebook UI with OpenID Connect
    - Secured access to datasets on Kerberized HDFS and Authenticated S3 Buckets
    - Pre-installed Python, R, Scala, and many more kernels
    - Pre-installed Apache Toree kernels (Spark, R, Scala)
    - Pre-installed popular Python and R libraries
