---
post_title: Limitations
menu_order: 110
enterprise: 'no'
---

## Service user		
		
The DC/OS Mongo Service uses a Docker image to manage its dependencies for Percona Server for MongoDB. Since the Docker image contains a full Linux userspace with its own `/etc/users` file, it is possible for the default service user `nobody` to have a different UID inside the container than on the host system. Although user `nobody` has UID `65534` by convention on many systems, this is not always the case. As Mesos does not perform UID mapping between Linux user namespaces, specifying a service user of `nobody` in this case will cause access failures when the container user attempts to open or execute a filesystem resource owned by a user with a different UID, preventing the service from launching. If the hosts in your cluster have a UID for `nobody` other than 65534, you will need to specify a service user of `root` to run DC/OS Mongo Service.
		
To determine the UID of `nobody`, run the command `id nobody` on a host in your cluster:		
```		
$ id nobody		
uid=65534(nobody) gid=65534(nobody) groups=65534(nobody)		
```		
		
If the returned UID is not `65534`, then the DC/OS Mongo Service can be installed as root by setting the service user at install time:		
```		
"service": {		
        "user": "root",		
        ...		
}		
...		
```

## MongoDB Configuration

Below are limitations regarding the MongoDB Configuration.

The framework currently supports the [configuration file options](https://docs.mongodb.com/v3.4/reference/configuration-options/) available in MongoDB version 3.4 only!

### Experimental and Deprecated Options
For stability, configuration options marked *"experimental"* or *"deprecated"* are not configurable via the DC/OS UI.

### Security

For security, this framework requires [MongoDB Authentication](https://docs.mongodb.com/manual/core/authentication/) and [MongoDB Internal Authentication](https://docs.mongodb.com/manual/core/security-internal-authentication/) is enabled. These configuration options cannot be changed as a result. **Your application and MongoDB database driver must support (and utilise) [MongoDB Authentication](https://docs.mongodb.com/manual/core/authentication/) to use this framework!**

Passwords and Internal Authentication keyFile can be manually defined at service creation time, otherwise a default is used. We **strongly recommend** you change the default key and passwords to something unique and secure!

### Storage

Currently storage engine cache sizes cannot be defined when using WiredTiger, InMemory or RocksDB as a storage engine.

These storage engines will use their default logic to determine a cache size value, which is typically 50% of the container available memory.

## Removing a Node

Removing a node is not supported at this time.

## Rack-aware Replication

Rack placement and awareness are not supported at this time.

## Overlay network configuration updates
When a pod from your service uses the overlay network, it does not use the port resources on the agent machine, and thus does not have them reserved. For this reason, we do not allow a pod deployed on the overlay network to be updated (moved) to the host network, because we cannot guarantee that the machine with the reserved volumes will have ports available. To make the reasoning simpler, we also do not allow for pods to be moved from the host network to the overlay. Once you pick a networking paradigm for your service the service is bound to that networking paradigm.

## Out-of-band configuration

Out-of-band configuration modifications are not supported. The service's core responsibility is to deploy and maintain the service with a specified configuration. In order to do this, the service assumes that it has ownership of task configuration. If an end-user makes modifications to individual tasks through out-of-band configuration operations, the service will override those modifications at a later time. For example:
- If a task crashes, it will be restarted with the configuration known to the scheduler, not one modified out-of-band.
- If a configuration update is initiated, all out-of-band modifications will be overwritten during the rolling update.

## Scaling in

To prevent accidental data loss, the service does not support reducing the number of pods.

## Disk changes

To prevent accidental data loss from reallocation, the service does not support changing volume requirements after initial deployment.

## Best-effort installation

If your cluster doesn't have enough resources to deploy the service as requested, the initial deployment will not complete until either those resources are available or until you reinstall the service with corrected resource requirements. Similarly, scale-outs following initial deployment will not complete if the cluster doesn't have the needed available resources to complete the scale-out.

## Virtual networks

When the service is deployed on a virtual network, the service may not be switched to host networking without a full re-installation. The same is true for attempting to switch from host to virtual networking.

## Task Environment Variables

Each service task has some number of environment variables, which are used to configure the task. These environment variables are set by the service scheduler. While it is _possible_ to use these environment variables in adhoc scripts (e.g. via `dcos task exec`), the name of a given environment variable may change between versions of a service and should not be considered a public API of the service.
