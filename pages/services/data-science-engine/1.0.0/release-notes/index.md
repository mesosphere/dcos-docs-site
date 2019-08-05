---
layout: layout.pug
navigationTitle: Release Notes
excerpt: Release notes for 1.0
title: Release Notes
menuWeight: 0
model: /services/data-science-engine/data.yml
render: mustache
---

# Release notes for {{ model.techName }} version 1.0

This is the first release for {{ model.techName }}.

{{ model.techName }} was released on 6 August 2019.

{{ model.techName }} works on any infrastructure (cloud, bare metal and virtual)


## {{ model.techName }} components

{{ model.techName }} 1.0 includes the following components:

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
    - Pre-installed Python, R , Scala and many more kernels
    - Pre-installed Apache Toree kernels (Spark, R, Scala)
    - Pre-installed popular Python and R libraries
