---
layout: layout.pug
navigationTitle:  Limitations
title: Limitations
menuWeight: 110
excerpt: Understanding configuration limitations
featureMaturity:
enterprise: false
---


## Scaling in

To prevent accidental data loss, the service does not support reducing the number of pods.

## Disk changes

To prevent accidental data loss from reallocation, the service does not support changing volume requirements after initial deployment.

## Best-effort installation

If your cluster does not have enough resources to deploy the service as requested, the initial deployment will not complete until either those resources are available or you reinstall the service with corrected resource requirements. Similarly, scale-outs following initial deployment will not complete if the cluster does not have the needed available resources to complete the scale-out.

## Virtual networks

When the service is deployed on a virtual network, the service may not be switched to host networking without a full re-installation. The same is true for attempts to switch from host to virtual networking.

## Task environment variables

Each service task has some number of environment variables, which are used to configure the task. These environment variables are set by the service scheduler. While it is possible to use these environment variables in ad hoc scripts (e.g. via `dcos task exec`), the name of a given environment variable may change between versions of a service and should not be considered a public API of the service.

## Configurations

The “disk” configuration value is denominated in MB. We recommend you set the configuration value `log_retention_bytes` to a value smaller than the indicated “disk” configuration. See the Configuring section for instructions for customizing these values.
