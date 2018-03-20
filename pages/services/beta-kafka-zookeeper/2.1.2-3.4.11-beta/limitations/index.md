---
layout: layout.pug
navigationTitle:
excerpt:
title: Limitations
menuWeight: 100

---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-commons -->


# ZooKeeper Configuration

## Node Count

Only 3 or 5 ZooKeeper nodes are allowed.

## Rack-aware Replication

Rack placement and awareness are not supported at this time.

## Updating ZooKeeper settings
Reconfiguration of certain ZooKeeper settings is not allowed after deployment:
- ticktime
- client port
- follower port
- leader election port

## Kerberos settings

Running Kerberized Apache ZooKeeper currently requires that principals be added to the shared keytab for the hostnames of the agents on which the nodes of the ZooKeeper ensemble are running as well as the DC/OS DNS addresses.

# Out-of-band configuration

Out-of-band configuration modifications are not supported. The service's core responsibility is to deploy and maintain the service with a specified configuration. In order to do this, the service assumes that it has ownership of task configuration. If an end-user makes modifications to individual tasks through out-of-band configuration operations, the service will override those modifications at a later time. For example:

- If a task crashes, it will be restarted with the configuration known to the scheduler, not one modified out-of-band.
- If a configuration update is initiated, all out-of-band modifications will be overwritten during the rolling update.

# Scaling in

To prevent accidental data loss, the service does not support reducing the number of pods.

# Disk changes

To prevent accidental data loss from reallocation, the service does not support changing volume requirements after initial deployment.

# Best-effort installation

If your cluster does not have enough resources to deploy the service as requested, the initial deployment will not complete until either those resources are available or until you reinstall the service with corrected resource requirements. Similarly, scale-outs following initial deployment will not complete if the cluster does not have the needed resources available to complete the scale-out.

# Virtual networks

When the service is deployed on a virtual network, the service may not be switched to host networking without a full re-installation. The same is true for attempting to switch from host to virtual networking.

## Kerberos

Enabling Kerberos is not currently supported on [virtual networks](/1.10/networking/virtual-networks/).

# Task Environment Variables

Each service task has some number of environment variables, which are used to configure the task. These environment variables are set by the service scheduler. While it is _possible_ to use these environment variables in adhoc scripts (e.g. via `dcos task exec`), the name of a given environment variable may change between versions of a service and should not be considered a public API of the service.

<a name="contacting-technical-support"></a>
# Contacting Technical Support

[Submit a suppport request](https://support.mesosphere.com/hc/en-us/requests/new).
