---
layout: layout.pug
navigationTitle:  Limitations
title: Limitations
menuWeight: 110
excerpt: Understanding configuration limitations
featureMaturity:
enterprise: false
model: /services/couchbase/data.yml
render: mustache
---

## Out-of-band configuration

Out-of-band configuration modifications are not supported. The {{ model.techName }} service's core responsibility is to deploy and maintain the service with a specified configuration. In order to do this, the service assumes that it has ownership of task configuration. If an end-user makes modifications to individual tasks through out-of-band configuration operations, the service will override those modifications at a later time. For example:

- If a task crashes, it will be restarted with the configuration known to the scheduler, not one modified out-of-band.
- If a configuration update is initiated, all out-of-band modifications will be overwritten during the rolling update.

## Scaling

To prevent accidental data loss, the {{ model.techName }} service does not support reducing the number of pods.

## Disk changes

To prevent accidental data loss from reallocation, the {{ model.techName }} service does not support changing volume requirements after initial deployment.

## Best-effort installation

If your cluster does not have enough resources to deploy the service as requested, the initial deployment will not complete until either those resources are available or until you reinstall the service with corrected resource requirements. Similarly, scale-outs following initial deployment will not complete if the cluster does not have the needed available resources to complete the scale-out.

## Virtual networks

When the service is deployed on a virtual network, the service may not be switched to host networking without a full re-installation. The same is true for attempting to switch from host to virtual networking.

## Task Environment Variables

Each service task has some number of environment variables, which are used to configure the task. These environment variables are set by the service scheduler. While it is possible to use these environment variables in ad hoc scripts (e.g., via `dcos task exec`), the name of a given environment variable may change between versions of a service and should not be considered a public API of the service.

## {{ model.techName }} Specific
- Authorization, LDAP and PAM are not supported at this time.
- {{ model.techName }} depends on third party technologies for encryption at rest; this is currently not supported.
- {{ model.techName }} XDCR (cross datacenter replication) is currently not supported.
