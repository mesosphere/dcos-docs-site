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

DC/OS integrates with storage backends that use the Container Storage Interface (CSI) to interact with the cluster orchestrator (DC/OS in this case). This recently-developed standard is gaining wide adoption in the cloud-native ecosystem. If you want a storage solution which will be developed and supported long into the future, it may be wise to choose one with CSI support.

Note that CSI volumes in DC/OS currently must be pre-provisioned before they are used by a service; dynamic provisioning of CSI volumes on demand is not yet supported. If you require dynamic provisioning, we currently recommend that you use [DVDI volumes](/mesosphere/dcos/2.2/storage/dvdi/) in DC/OS.
 
# Creating an application with a CSI volume

## Marathon app definition

You can specify a CSI volume in your [Marathon app definition](/mesosphere/dcos/2.2/deploying-services/creating-services/).

Find below an example task which mounts a pre-provisioned CSI volume; it may be used as a test to verify that your CSI-based storage backend is working correctly. The `cmd` in this app definition appends the output of the `date` command to `test.txt`, reads the file, and then exits. Marathon will repeatedly re-launch the app after it finishes. You will know that the external volume is being used correctly if you see that the logs of successive runs of the application show more and more lines of `date` output; this mean that the same CSI external volume is mounted and written to each time.

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
        "external": {
          "provider": "csi",
          "name": "pre-provisioned-volume-id-001",
          "pluginName": "csi-plugin-name",
          "options": { 
            "accessMode": "MULTI_NODE_MULTI_WRITER",
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
-  `external.name`: The unique ID that the CSI volume plugin uses to look up your volume. When your task is staged on an agent, the volume plugin queries the storage service for a volume with this name. If one does not exist, the task will fail to launch.
-  `external.pluginName`: The name of the CSI plugin which will mount this volume. This is specified in the CSI plugin configuration on the agent; for the Portworx service, this should be `pxd.portworx.com`. For NFS volumes, this should be `nfs.csi.k8s.io`. For other plugins, see the instructions on plugin installation below.
-  `external.options.accessMode`: The [CSI access mode](https://github.com/container-storage-interface/spec/blob/master/spec.md) to use when mounting the volume. The `XXXX_WRITER` modes will be mounted in read-write, while the `READER_ONLY` modes will be mounted read-only.
-  `external.options.nodeStageSecret` and `external.options.nodePublishSecret`: The names of secrets in the DC/OS secret store which contain the username/password to use with the storage backend when staging and publishing this volume. "Staging" and "publishing" refer to steps in the CSI volume mounting process.
-  `external.options.accessType.fsType`: The type of filesystem to be used on this volume, i.e. "xfs", "ext4", etc.
-  `external.options.accessType.mountFlags`: Flags to be used when mounting the volume on the host.
-  `external.options.volumeContext`: In some cases, the provisioning of a volume results in the creation of volume context metadata which must be passed as key-value pairs in this field.
-  Create multiple volumes by adding additional items in the `container.volumes` array.
-  You cannot change volume parameters after you create the application.
-  Marathon will not launch apps with external volumes if `upgradeStrategy.minimumHealthCapacity` is greater than 0.5, or if `upgradeStrategy.maximumOverCapacity` does not equal 0.

Some of the options above map directly onto fields in the [`NodeStageVolume`](https://github.com/container-storage-interface/spec/blob/master/spec.md#nodestagevolume) and [`NodePublishVolume`](https://github.com/container-storage-interface/spec/blob/master/spec.md#nodepublishvolume) calls in the [CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md); some useful information regarding those parameters can be found in the CSI docs.

## Create an application from the DC/OS UI

1. Click the **Services** tab, then **RUN A SERVICE**.
1. Click **Volumes** and enter your Volume ID, Plugin Name, and Container Path.
1. Click **Deploy**.

# Scaling your app

Marathon apps which use CSI volumes can currently only be scaled to a single instance. This constraint will be relaxed in the future.

# Data mobility

If a Marathon application using a CSI volume fails for some reason, Marathon will relaunch that service wherever available resources are found. Since CSI volumes may be attached to any one of the nodes in the cluster running the CSI plugin, Marathon may place it on a different physical host. This is one major advantage of using external storage with your applications: data mobility means that simple, non-distributed stateful applications can tolerate failure with only a short period of downtime.

# Using 3rd party CSI plugins

If you want to use a third party CSI plugin which has not yet integrated with DC/OS, you can do the following to accomplish this:

1. Install the CSI plugin as a Marathon app. To integrate with DC/OS, the CSI plugin must expose a Unix domain socket which DC/OS can connect to in order to make CSI calls. Install the app with a `hostname:UNIQUE` constraint so that only one instance is installed on each node. To make this storage backend available on all nodes, install the plugin on all private agents by setting the number of instances equal to the number of private agents in the cluster.

2. Place a configuration file on each private agent in the folder `/opt/mesosphere/etc/dcos/storage/csi/` which looks like the following:

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
