---
layout: layout.pug
navigationTitle:  Limitations
title: Limitations in Percona Server for MongoDB
menuWeight: 110
excerpt: Limitations in service user, security, networking and other functions
featureMaturity:
enterprise: false
model: /services/percona-server-mongodb/data.yml
render: mustache
---

## Service user

The DC/OS {{ model.techName }} service uses a Docker image to manage its dependencies for {{ model.techName }}. Since the Docker image contains a full Linux userspace with its own `/etc/users` file, it is possible for the default service user `nobody` to have a different UID inside the container than on the host system. Although user `nobody` has UID `65534` by convention on many systems, this is not always the case. As Mesos does not perform UID mapping between Linux user namespaces, specifying a service user of `nobody` in this case will cause access failures when the container user attempts to open or execute a filesystem resource owned by a user with a different UID, preventing the service from launching. If the hosts in your cluster have a UID for `nobody` other than 65534, you will need to specify a service user of `root` to run DC/OS Mongo Service.

To determine the UID of `nobody`, run the command `id nobody` on a host in your cluster:
    ```shell
    $ id nobody
    uid=65534(nobody) gid=65534(nobody) groups=65534(nobody)
    ```

If the returned UID is not `65534`, then the DC/OS {{ model.techName }} service can be installed as root by setting the service user at install time:
    ```javascript
    "service": {
            "user": "root",
            ...
    }
    ...
    ```

## {{ model.dbName }}

<a name="mongodb-node-count"></a>

### Node Count

Curently all nodes (excluding a backup hidden-secondary node) have one vote in [Replica Set Elections](https://docs.mongodb.com/manual/core/replica-set-elections/#replica-set-elections).

To provide an odd number of votes, only a node count of 1, 3 (default), 5 or 7 is supported by the service. No more than seven nodes are supported due to the [7-member voting limit in {{ model.dbName }}](https://docs.mongodb.com/manual/reference/limits/#Number-of-Voting-Members-of-a-Replica-Set).

### {{ model.techName }} Version

This {{ model.techName }} package was designed for use with the [{{ model.techName }}](https://www.percona.com/software/mongo-database/percona-server-for-mongodb) 3.6 major-release only, starting from version 3.6.6. The use of other versions is not possible.

### Configuration limitations

The framework currently supports the [configuration file options](https://docs.mongodb.com/v3.6/reference/configuration-options/) available in {{ model.dbName }} version 3.6 only.

### Replica Set Name

Changing the replica set after service startup is currently unsupported. As a workaround, use the backup and restore features of this package to migrate data to a new `{{ model.serviceName }}` service with a different replica set name.

### Storage Engine

Changing the storage engine of the replica set members after service startup is currently unsupported. As a workaround, use the backup and restore features of this package to migrate to a new `{{ model.serviceName }}` service with a different storage engine.

#### Experimental and Deprecated Options
For stability, configuration options marked "experimental" or "deprecated" are not configurable via the DC/OS UI.

#### Security

For security, this framework requires that [{{ model.dbName }} Authentication](https://docs.mongodb.com/manual/core/authentication/) and [{{ model.dbName }} Internal Authentication](https://docs.mongodb.com/manual/core/security-internal-authentication/) be enabled. As a result, these configuration options cannot be changed.

<p class="message--important"><strong>IMPORTANT: </strong>Your application and MongDB database driver must use <a href="https://docs.mongodb.com/manual/core/authentication/">MongoDB Authentication</a> to connect to MongoDB.</p>

Passwords and Internal Authentication keyFiles must be manually defined at service creation time.

For safety, the service enforces the following:
1. System user (monitoring, backup, admin users) passwords must 10 characters long or longer.
2. The {{ model.dbName }} Key must be 1023 to 1024 characters long. The following OpenSSL command is recommended to generate this:

    ```bash
    $ openssl rand -base64 756
    ```

## Removing a node

Removing a node is not supported at this time; however, scaling down the number of members is possible.

## Rack-aware replication

Rack placement and awareness are not supported at this time.

## Overlay network configuration updates
When a pod from your service uses the overlay network, it does not use the port resources on the agent machine, and thus does not have them reserved. For this reason, we do not allow a pod deployed on the overlay network to be updated (moved) to the host network, because we cannot guarantee that the machine with the reserved volumes will have ports available. To make the reasoning simpler, we also do not allow for pods to be moved from the host network to the overlay. Once you pick a networking paradigm for your service the service is bound to that networking paradigm.

## Out-of-band configuration

Out-of-band configuration modifications are not supported. The service's core responsibility is to deploy and maintain the service with a specified configuration. In order to do this, the service assumes that it has ownership of task configuration. If an end-user makes modifications to individual tasks through out-of-band configuration operations, the service will override those modifications at a later time. For example:
- If a task crashes, it will be restarted with the configuration known to the scheduler, not one modified out-of-band.
- If a configuration update is initiated, all out-of-band modifications will be overwritten during the rolling update.

## Disk changes

To prevent accidental data loss from reallocation, the service does not support changing volume requirements after initial deployment.

## Best-effort installation

If your cluster does not have enough resources to deploy the service as requested, the initial deployment will not complete until either those resources are available or you reinstall the service with corrected resource requirements. Similarly, scale-outs following initial deployment will not complete if the cluster does not have the needed available resources to complete the scale-out.

## Virtual networks

When the service is deployed on a virtual network, the service may not be switched to host networking without a full re-installation. The same is true for attempting to switch from host to virtual networking.

## Task Environment Variables

Each service task has some number of environment variables, which are used to configure the task. These environment variables are set by the service scheduler. While it is **possible** to use these environment variables in adhoc scripts (for example, via `dcos task exec`), the name of a given environment variable may change between versions of a service and should not be considered a public API of the service.
