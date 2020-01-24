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

Release Notes for {{ model.techName }} version 1.0.1

## {{ model.techName }} New Features

- Added automation for enabling/disabling verbose logging for Spark resource offers
- Notebook Docker image is configurable via service options.
- {{ model.techName }} now stores fetched Hadoop configuration files, hdfs-site.xml and core-site.xml, in `$MESOS_SANDBOX/hadoop_conf` folder so users can modify them without root privileges.

## {{ model.techName }} Bug Fixes

- Fixed Spark configuration dialog in BeakerX kernel.
- Fixed folder permissions so users can install new packages with `conda` or `pip`.
- Fixed static resources paths in host mode for components with UI: Spark, History Server, Tensorboard

## {{ model.techName }} Breaking Changes

- CUDA 9 images will no longer be provided with a bundle; CUDA 10 is the only version used for GPU images.
- `jaas_secret` option removed from security configuration.  `extra_spark_secrets` should be used instead.

## {{ model.techName }} Limitations

- {{ model.techName }} does not fully support `root` service user. It is recommended to use the default user `nobody`.
- {{ model.techName }} does not support the installation of Python packages on CoreOS. It is recommended to use CentOS.
- {{ model.techName }} does not support AWS Classic Load Balancer, because it does not support WebSockets. It is recommended to configure load balancers and proxies to allow WebSockets.
