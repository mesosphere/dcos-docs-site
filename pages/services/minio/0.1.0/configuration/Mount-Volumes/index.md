---
layout: layout.pug
navigationTitle: Mount Volumes
title: Configuring Mount Volumes for Minio
menuWeight: 40
excerpt: Configuring Mesos mount disk resources across your cluster
featureMaturity:
enterprise: false
model: /services/minio/data.yml
render: mustache
---


With DC/OS you can configure Mesos mount disk resources across your cluster by mounting storage resources on agents using a well-known path. When a DC/OS agent initially starts, it scans for volumes that match the pattern `/dcos/volumeN`, where N is an integer. The agent is then automatically configured to offer these disk resources to other services.

A disk resource is added to a DC/OS agent after mounting external volumes to it.

## Configuring a mount volume 


1. Identify the nodes of the cluster:
    ```shell
    dcos node
    ```
1. Connect to an agent in the cluster with SSH.
    ```shell
    ssh-add <cluster key or pem file>
    ```
    ```shell
    dcos node ssh --master-proxy --mesos-id=<Mesos ID of the node>
    ```
1. Examine the current agent resource state.  Note that there are no references yet for `/dcos/volume0`.     
    ```shell
    cat /var/lib/dcos/mesos-resources
    ```
1. Stop the agent.
    ```shell
    sudo systemctl stop dcos-mesos-slave.service
    ``` 
1. Clear agent state.  Remove Volume Mount Discovery resource state with this command:
    ```shell
    sudo rm -f /var/lib/dcos/mesos-resources
    ``` 
1. Create an external volume. For example:
    ```shell
    aws ec2 create-volume --size <size> --region <region> --availability-zone <availability-zone> --volume-type gp2
    ```
   
1. Attach these volumes to the nodes of the cluster.
    ```shell
    aws ec2 attach-volume --volume-id <volume-id> --instance-id <instance-id> --device /dev/sdf
    ```
  
1. Check the name of the device mounted on the respective node of the cluster.
    ```shell
    lsblk
    ```
    Example output:
    ```shell
    NAME                          MAJ:MIN RM  SIZE 
    xvdf                           7:0    0  208M 
    xvdh                           7:1    0  456M
    ```
1. Create a loopback device.
    ```shell
    sudo mkdir -p /dcos/volume0
    sudo mkfs -t ext4 /dev/xvdf
    sudo dd if=/dev/zero of=/dev/xvdf bs=1M count=4000
    sudo losetup /dev/loop0 /dev/xvdf
    sudo mkfs -t ext4 /dev/loop0
    sudo losetup -d /dev/loop0
    ```
1. Create `fstab` entry and mount. Ensure the volume is mounted automatically at boot time. Something similar can also be done with a System Mount unit.
    ```shell
    echo "/dev/xvdf /dcos/volume0 auto loop 0 2" | sudo tee -a /etc/fstab
    sudo mount /dcos/volume0
    ```
1. Reboot.
    ```shell
    sudo reboot
    ```
1. SSH to the agent and verify a new resource state. 
   ```shell
   dcos node ssh --master-proxy --mesos-id=<Mesos ID of the node>
   ```
    <!-- Please include commands for this step. -->
    <!-- Done. -->

1. Review the `journald` logs for reference to the new volume `/dcos/volume0`. In particular, there should be an entry for the agent starting up and the new volume0 Mounted Disk Resource.
    ```shell
    journalctl -b | grep '/dcos/volume0'
    May 05 19:18:40 dcos-agent-public-01234567000001 systemd[1]: Mounting /dcos/volume0...
    May 05 19:18:42 dcos-agent-public-01234567000001 systemd[1]: Mounted /dcos/volume0.
    May 05 19:18:46 dcos-agent-public-01234567000001 make_disk_resources.py[888]: Found matching mounts : [('/dcos/volume0', 74)]
    May 05 19:18:46 dcos-agent-public-01234567000001 make_disk_resources.py[888]: Generated disk resources map: [{'name': 'disk', 'type': 'SCALAR', 'disk': {'source': {'mount': {'root': '/dcos/volume0'}, 'type': 'MOUNT'}}, 'role': '*', 'scalar': {'value': 74}}, {'name': 'disk', 'type': 'SCALAR', 'role': '*', 'scalar': {'value': 47540}}]
    May 05 19:18:58 dcos-agent-public-01234567000001 mesos-slave[1891]: " --oversubscribed_resources_interval="15secs" --perf_duration="10secs" --perf_interval="1mins" --port="5051" --qos_correction_interval_min="0ns" --quiet="false" --recover="reconnect" --recovery_timeout="15mins" --registration_backoff_factor="1secs" --resources="[{"name": "ports", "type": "RANGES", "ranges": {"range": [{"end": 21, "begin": 1}, {"end": 5050, "begin": 23}, {"end": 32000, "begin": 5052}]}}, {"name": "disk", "type": "SCALAR", "disk": {"source": {"mount": {"root": "/dcos/volume0"}, "type": "MOUNT"}}, "role": "*", "scalar": {"value": 74}}, {"name": "disk", "type": "SCALAR", "role": "*", "scalar": {"value": 47540}}]" --revocable_cpu_low_priority="true" --sandbox_directory="/mnt/mesos/sandbox" --slave_subsystems="cpu,memory" --strict="true" --switch_user="true" --systemd_enable_support="true" --systemd_runtime_directory="/run/systemd/system" --version="false" --work_dir="/var/lib/mesos/slave"
    ```


Wait until the node gets up and then repeat the steps to mount more than one volume on the same node. Follow the same procedure from step 5 to mount a volume on the other nodes.
   

