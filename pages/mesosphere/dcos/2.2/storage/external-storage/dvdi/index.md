---
layout: layout.pug
navigationTitle:  DVDI Storage
title: DVDI Storage
menuWeight: 20
excerpt: Using DVDI volumes with Marathon
render: mustache
model: /mesosphere/dcos/2.2/data.yml
beta: false
enterprise: false
---

Use external volumes when fault tolerance is crucial for your app. If a host fails, the native Marathon instance reschedules your app on another host, along with its associated data, without user intervention. External volumes also typically offer a larger amount of storage.

Marathon applications normally lose their state when they terminate and are relaunched. In some contexts, for instance, if your application uses MySQL, you will want your application to preserve its state. You can use an external storage service, such as Amazon's Elastic Block Store (EBS), to create a persistent volume that follows your application instance.

**Note** Volume sizes are specified in gibibyte (GiB) units.
 
# Create an application with a DVDI volume

## Marathon app definition

You can specify a DVDI volume in your [Marathon app definition](/mesosphere/dcos/2.2/deploying-services/creating-services/).

### Use the Universal Container Runtime

The `cmd` in this app definition appends the output of the `date` command to `test.txt`. You will know that the external volume is being used correctly if you see that the logs of successive runs of the application show more and more lines of `date` output.

```json
{
  "id": "hello",
  "instances": 1,
  "cpus": 0.1,
  "mem": 32,
  "cmd": "date >> test-rexray-volume/test.txt; cat test-rexray-volume/test.txt",
  "container": {
    "type": "MESOS",
    "volumes": [
      {
        "containerPath": "test-rexray-volume",
        "external": {
          "size": 100,
          "name": "my-test-vol",
          "provider": "dvdi",
          "options": { "dvdi/driver": "rexray" }
          },
        "mode": "RW"
      }
    ]
  },
  "upgradeStrategy": {
    "minimumHealthCapacity": 0,
    "maximumOverCapacity": 0
  }
}
```

#### Volume configuration options

-  `containerPath`: The path where the volume is mounted inside the container. For Mesos external volumes, this must be a single-level path relative to the container; it cannot contain a forward slash (`/`). For more information, see [the REX-Ray documentation on data directories](https://rexray.readthedocs.io/en/v0.9.0/user-guide/config/#data-directories).
-  `mode`: The access mode of the volume. Currently, `"RW"` is the only possible value and will let your application read from and write to the volume.
-  `external.size`: The size of the volume in **GiB**.
-  `external.name`: The name that your volume driver uses to look up your volume. When your task is staged on an agent, the volume driver queries the storage service for a volume with this name. If one does not exist, it is [created implicitly](#implicit-vol). Otherwise, the existing volume is reused.
-  `external.options["dvdi/driver"]`: which Docker volume driver to use for storage. The only Docker volume driver provided with DC/OS is `rexray`. Learn more about [REX-Ray](https://rexray.readthedocs.io/en/v0.9.0/user-guide/schedulers/).
-  You can specify additional options with `container.volumes[x].external.options[optionName]`. The dvdi provider for Mesos containers uses `dvdcli`, which offers the following [options](https://github.com/emccode/dvdcli#extra-options). The availability of any option depends on your volume driver.
-  Create multiple volumes by adding additional items in the `container.volumes` array.
-  You cannot change volume parameters after you create the application.
-  Marathon will not launch apps with external volumes if `upgradeStrategy.minimumHealthCapacity` is greater than 0.5, or if `upgradeStrategy.maximumOverCapacity` does not equal 0.

### Use a Docker engine to specify external volume

Below is a sample app definition that uses a Docker Engine and specifies an external volume. The `cmd` in this app definition appends the output of the `date` command to `test.txt`. You can verify that the external volume is being used correctly if you see that the logs of successive runs of the application show more and more lines of `date` output.

```json
{
  "id": "/test-docker",
  "instances": 1,
  "cpus": 0.1,
  "mem": 32,
  "cmd": "date >> /data/test-rexray-volume/test.txt; cat /data/test-rexray-volume/test.txt",
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "alpine:3.1",
      "network": "HOST",
      "forcePullImage": true
    },
    "volumes": [
      {
        "containerPath": "/data/test-rexray-volume",
        "external": {
          "name": "my-test-vol",
          "provider": "dvdi",
          "options": { "dvdi/driver": "rexray" }
        },
        "mode": "RW"
      }
    ]
  },
  "upgradeStrategy": {
    "minimumHealthCapacity": 0,
    "maximumOverCapacity": 0
  }
}
```

#### Volume configuration options

* `containerPath` must be absolute.
*  Only certain versions of Docker are compatible with the REX-Ray volume driver. Refer to the [REX-Ray documentation](https://rexray.readthedocs.io/en/v0.9.0/user-guide/schedulers/#docker-containerizer-with-marathon).

## Create an application from the DC/OS UI

1. Select the **Services** tab, then **RUN A SERVICE**.
1. If you are using a Docker container, select **Container Settings** and configure your container runtime.
1. Select **Volumes** and enter your Volume Name and Container Path.
1. Select **Deploy**.

<a name="implicit-vol"></a>

# Implicit volumes

The default implicit volume size is 16 GiB. If you are using the Universal Container Runtime, you can modify this default for a particular volume by setting `volumes[x].external.size`. You cannot modify this default for a particular volume if you are using the Docker Engine. For both runtimes, however, you can modify the default size for all implicit volumes by modifying the [REX-Ray configuration](https://rexray.readthedocs.io/en/v0.9.0/user-guide/config/).

# Scale your app

Apps that use external volumes can only be scaled to a single instance because a volume can only attach to a single task at a time.

If you scale your app down to 0 instances, the volume is detached from the agent where it was mounted, but it is not deleted. If you scale your app up again, the data that was associated with it is still be available.

# Use a 3rd party Docker volume driver

If you want to use a 3rd party Docker volume driver rather than REX-Ray (e.g., [NetApp Trident](https://github.com/NetApp/trident)), take the following steps on each agent node (Trident is used as an example in the steps below):

1. Install the volume driver as a Docker plugin.
    ```
    $ docker plugin install netapp/trident-plugin:19.10 --alias netapp --grant-all-permissions
    ```

1. Register the volume driver to Docker plugin directory. Refer to [Docker Plugin API](https://docs.docker.com/engine/extend/plugin_api/#plugin-discovery) to learn how Docker discovers plugins.

    ```
    $ sudo mkdir -p /etc/docker/plugins/
    $ sudo bash -c 'echo "unix:///run/docker/plugins/<plugin-id>/netapp.sock" > /etc/docker/plugins/netapp.spec'
    ```

Now the volume driver is ready for you to use it in DC/OS. When you create an application, set the option `external.options["dvdi/driver"]` to the name of the volume driver (e.g., `netapp`).

# Potential issues

*   You can assign only one task per volume. Your storage provider might have other limitations.
*   The volumes you create are not automatically cleaned up. If you delete your cluster, you must go to your storage provider and delete the volumes you no longer need. If you're using EBS, find them by searching by the `container.volumes.external.name` that you set in your Marathon app definition. This name corresponds to an EBS volume `Name` tag.
*   Volumes are namespaced by their storage provider. Choose unique volume names to avoid conflicts.
*   If you are using Docker, you must use a compatible Docker version. Refer to the [REX-Ray documentation](https://rexray.readthedocs.io/en/v0.9.0/user-guide/schedulers/#docker-containerizer-with-marathon) to learn which versions of Docker are compatible with the REX-Ray volume driver.
*   Launch time might increase for applications that create volumes implicitly. The amount of the increase depends on several factors which include the size and type of the volume. Your storage provider's method of handling volumes can also influence launch time for implicitly created volumes.

##   EBS specific
Volumes created on the same AWS account share a namespace. Choose unique volume names to avoid conflicts when multiple clusters are launched under the same account.

EBS volumes are also namespaced by their availability zone (AZ), and an EBS volume [can only be attached to an EC2 instance in the same AZ](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-attaching-volume.html). As a result, attempts to launch a task in an agent running in a different AZ will lead to the creation of a new volume of the same name. If you create a cluster in one AZ, destroy it, be sure to create your cluster in the same AZ if you wish to reuse any external volumes. If a cluster spans multiple AZs, use Marathon constraints to only launch an instance in the same AZ.

REX-Ray by default will fail after 13 EBS volumes are attached. Use the [config option useLargeDeviceRange to extend this limit](https://rexray.readthedocs.io/en/v0.11.0/user-guide/storage-providers/aws/#configuration-notes), which was introduced in RexRay v0.11.4.

EBS volumes present as non-volatile memory express (NVMe) devices on certain newer EC2 instance types. Support for NVMe was only added to RexRay in v0.11.4. You will need to take the following prerequisite steps for RexRay to work with NVMe devices on CentOS (on newer CoreOS AMIs this is unnecessary):

   
1. Install the NVMe CLI command.
    
    ```bash
    $ yum install -y nvme-cli
    ```

1. Install the necessary udev rule and helper script. These are taken from the [RexRay user guide](https://github.com/rexray/rexray/blob/362035816046e87f7bc5a6ca745760d09a69a40c/.docs/user-guide/storage-providers/aws.md#nvme-support).

    ```bash
    $ cat <<EOF > /etc/udev/rules.d/999-aws-ebs-nvme.rules
    KERNEL=="nvme[0-9]*n[0-9]*", ENV{DEVTYPE}=="disk", ATTRS{model}=="Amazon Elastic Block Store", PROGRAM="/usr/local/bin/ebs-nvme-mapping /dev/%k", SYMLINK+="%c"
    EOF
    ```
1. Create the helper script.
    ```bash
    $ cat <<EOF > /usr/local/bin/ebs-nvme-mapping
    #!/bin/bash
    #/usr/local/bin/ebs-nvme-mapping
    vol=$(/usr/sbin/nvme id-ctrl --raw-binary "${1}" | \
          cut -c3073-3104 | tr -s ' ' | sed 's/ $//g')
    vol=${vol#/dev/}
    [ -n "${vol}" ] && echo "${vol/xvd/sd} ${vol/sd/xvd}"
    EOF
1. Set the file permissions on the scripts and reload the udev rules.      
    ```bash
    $ chown root:root /usr/local/bin/ebs-nvme-mapping
    $ chmod 700 /usr/local/bin/ebs-nvme-mapping
    $ udevadm control --reload
    ```

## External volumes   

To troubleshoot external volumes, see the agent or system logs. If you are using REX-Ray on DC/OS, you can also see the `systemd` journal for the `dcos-rexray.service` unit logs.
