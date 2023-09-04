---
layout: layout.pug
navigationTitle:  CSI Storage
title: CSI Storage
menuWeight: 20
excerpt: Using CSI volumes with Marathon
render: mustache
model: /mesosphere/dcos/2.2/data.yml
beta: false 
enterprise: false
---

DC/OS integrates with storage backends that use the Container Storage Interface (CSI) to interact with the cluster orchestrator (DC/OS in this case). This recently-developed standard is gaining wide adoption in the cloud-native ecosystem. If you want a storage solution that will be developed and supported long into the future, choose one with CSI support.

**Note** Currently, CSI volumes in DC/OS must be pre-provisioned before they are used by a service; dynamic provisioning of CSI volumes on demand is not yet supported. If you require dynamic provisioning, we currently recommend that you use [DVDI volumes](/mesosphere/dcos/2.2/storage/dvdi/) in DC/OS.
 
# Create an application with a CSI volume

## Marathon app definition

You can specify a CSI volume in your [Marathon app definition](/mesosphere/dcos/2.2/deploying-services/creating-services/).

Find below an example task which mounts a pre-provisioned CSI volume; it can be used as a test to verify that your CSI-based storage backend is working correctly. The `cmd` in this app definition appends the output of the `date` command to `test.txt`, reads the file, and then exits. Marathon will repeatedly re-launch the app after it finishes. You will know that the external volume is being used correctly if you see that the logs of successive runs of the application show more and more lines of `date` output; this mean that the same CSI external volume is mounted and written to each time.

```json
{
  "id": "csi-volume-test-app",
  "instances": 1,
  "cpus": 0.1,
  "mem": 32,
  "cmd": "date >> test-csi-volume/test.txt; cat test-csi-volume/test.txt",
  "container": {
    "type": "MESOS",
    "volumes": [
      {
        "containerPath": "test-csi-volume",
        "mode": "rw",
        "external": {
          "provider": "csi",
          "name": "pre-provisioned-volume-id-001",
          "options": { 
            "pluginName": "csi-plugin-name",
            "capability": {
              "accessType": "mount",
              "accessMode": "MULTI_NODE_MULTI_WRITER",
              "fsType": "ext4"
            }
            "nodeStageSecret": {
              "username": "username_secret_001",
              "password": "password_secret_001"
            },
            "nodePublishSecret": {
              "username": "username_secret_001",
              "password": "password_secret_001"
            }
          }
        }
      }
    ]
  }
}
```

### Volume configuration options

-  `containerPath`: The path where the volume is mounted inside the container.
-  `mode`: The mode, either read-only or read-write, with which the volume will be mounted. The value of this field should be either "ro" or "rw".
-  `external.name`: The unique ID that the CSI volume plugin uses to look up your volume. When your task is staged on an agent, the volume plugin queries the storage service for a volume with this name. If one does not exist, the task will fail to launch.
-  `external.options.pluginName`: The name of the CSI plugin which will mount this volume. This is specified in the CSI plugin configuration on the agent; for the Portworx service, this should be `pxd.portworx.com`. For NFS volumes, this should be `nfs.csi.k8s.io`. For other plugins, see the instructions on plugin installation below.
-  `external.options.capability.accessType`: Whether this volume will be accessed as a block device or a mounted volume. The value of this field should be either "mount" or "block".
-  `external.options.capability.accessMode`: The [CSI access mode](https://github.com/container-storage-interface/spec/blob/master/spec.md) that this volume is capable of. This is a property of the CSI volume, and it should not conflict with the value of the `mode` field (for example, a CSI access mode of `MULTI_NODE_READER_ONLY` is not compatible with a read-write mount.
-  `external.options.nodeStageSecret` and `external.options.nodePublishSecret`: The names of secrets in the DC/OS secret store which contain the username/password to use with the storage backend when staging and publishing this volume. "Staging" and "publishing" refer to steps in the CSI volume mounting process.
-  `external.options.accessType.fsType`: The type of filesystem to be used on this volume, i.e. "xfs", "ext4", etc.
-  `external.options.accessType.mountFlags`: Flags to be used when mounting the volume on the host; these should be valid flags for the Linux `mount` command, such as "noexec" and "sync".
-  `external.options.volumeContext`: In some cases, the provisioning of a volume results in the creation of volume context metadata which must be passed as key-value pairs in this field. For an NFS volume, this might be something like `{ "server": "192.168.10.10", "share": "/share_dir" }`.
-  Attach multiple volumes by adding additional items in the `container.volumes` array.

Some of the options above map directly into fields in the [`NodeStageVolume`](https://github.com/container-storage-interface/spec/blob/master/spec.md#nodestagevolume) and [`NodePublishVolume`](https://github.com/container-storage-interface/spec/blob/master/spec.md#nodepublishvolume) calls in the [CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md); some useful information regarding those parameters can be found in the CSI docs.

## Create an application from the DC/OS UI

1. Select the **Services** tab, then **RUN A SERVICE**.
1. Select **Volumes** and enter your Volume ID, Plugin Name, and Container Path.
1. Select **Deploy**.

# Scale your app

Marathon apps that use CSI volumes can currently only be scaled to a single instance. This constraint will be relaxed in the future.

# Data mobility

If a Marathon application using a CSI volume fails, Marathon will relaunch that service wherever available resources are found. Since CSI volumes may be attached to any one of the nodes in the cluster running the CSI plugin, Marathon may place it on a different physical host. This is one major advantage of using external storage with your applications: data mobility means that simple, non-distributed stateful applications can tolerate failure with only a short period of downtime.

# Use 3rd party CSI plugins

If you want to use a third party CSI plugin which has not yet integrated with DC/OS, you can do the following:

1. Install the CSI plugin as a Marathon app. 

To integrate with DC/OS, the CSI plugin must expose a Unix domain socket which DC/OS can connect to in order to make CSI calls. Install the app with a `hostname:UNIQUE` constraint so that only one instance is installed on each node. To make this storage backend available on all nodes, install the plugin on all private agents by setting the number of instances equal to the number of private agents in the cluster.

2. Place a configuration file that looks like the following on each private agent in the folder `/opt/mesosphere/etc/dcos/storage/csi/`:

```json
{
  "type": "test.pluginname.com",
  "endpoints": [
    {
      "csi_service": "NODE_SERVICE",
      "endpoint": "unix:///var/lib/pluginname/csi.sock"
    }
  ],
  "target_path_root": "/var/lib/pluginname/target_root"
}
```

The `target_path_root` parameter specifies the root directory, managed by the CSI plugin, where mount targets will be created. Once the app is successfully running on all agents, the plugin is ready for you to use it in DC/OS. The `type` parameter contains the unique name of the CSI plugin which should be passed in the `pluginName` field of the external volume in your Marathon app definitions.

Note that the current implementation of CSI support in DC/OS only makes calls against the [node service](https://github.com/container-storage-interface/spec/blob/master/spec.md#node-service-rpc) of the plugin; this means that any plugins which require calls against the controller service are not currently supported. Support for such plugins is planned in the future.

# Potential issues

* If a task with a CSI volume fails, look in the "Debug" tab of the service's detail view in the DC/OS UI. In the "Last Task Failure" section, look for any CSI errors which may be causing the task to fail to launch.
* If a CSI plugin is installed on just a subset of the cluster rather than the entire cluster, then node labels must be used on the agents running the plugin. This allows a label constraint to be used on Marathon apps consuming those volumes, ensuring that such an app lands on a capable agent.
* Note that CSI volumes are only supported when using the DC/OS Universal Container Runtime (UCR), not the Docker container runtime. This means that Marathon apps/pods which attach to CSI volumes should use `MESOS` type containers.
