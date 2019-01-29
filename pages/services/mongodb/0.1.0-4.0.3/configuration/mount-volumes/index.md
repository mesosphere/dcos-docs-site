---
layout: layout.pug
navigationTitle: Mount Volumes
title: Configuring Mount Volumes for MongoDB
menuWeight: 40
excerpt: Configuring Mount Volumes for MongoDB
featureMaturity:
enterprise: false
model: /services/mongodb/data.yml
render: mustache
---
 
With DC/OS you can configure Mesos to mount disk resources across your cluster by mounting storage resources on Agents using a well-known path. When a DC/OS Agent starts, it scans for volumes that match the pattern `/dcos/volumeN`, where N is an integer. The Agent is then automatically configured to offer these disk resources to other services.

A disk resource is added to a DC/OS Agent after mounting external volumes to it.

# How to configure a mount volume
  
  1. Identify the nodes of the cluster:
   ```shell
   dcos node
   ```
  2. Connect to an agent in the cluster with SSH.
   ```shell
   ssh-add <cluster key or pem file>
   dcos node ssh --master-proxy --mesos-id=<Mesos ID of the node>
   ```
  3. Examine the current agent resource state. Note that there are no references yet for `/dcos/volume0`.     
  ```shell
  cat /var/lib/dcos/mesos-resources
  ```
  4. Stop the agent.
  ```shell
  sudo systemctl stop dcos-mesos-slave.service
  ``` 
  5. Clear agent state.  Remove the Volume Mount Discovery resource state with this command:
  ```shell
  sudo rm -f /var/lib/dcos/mesos-resources
  ``` 
  6. Create an external volume. For example :
  ```shell
  aws ec2 create-volume --size <value> --region <value> --availability-zone <value> --volume-type gp2
  ```
  7. Attach these volumes to the nodes of the cluster. For example :
  ```shell
  aws ec2 attach-volume --volume-id <value> --instance-id <value> --device /dev/sdf
  ```
  8. Check the name of the device mounted on the respective node of the cluster.
  ```shell
  lsblk
  ```
  For example:
  ```shell
  NAME                          MAJ:MIN RM  SIZE 
  xvdf                           7:0    0  208M 
  xvdh                           7:1    0  456M
  ```
  9. Create a loopback device.
  ```shell
  sudo mkdir -p /dcos/volume0
  sudo mkfs -t ext4 /dev/xvdf
  sudo dd if=/dev/zero of=/dev/xvdf bs=1M count=4000
  sudo losetup /dev/loop0 /dev/xvdf
  sudo mkfs -t ext4 /dev/loop0
  sudo losetup -d /dev/loop0
  ```
  10. Create `fstab` entry and mount.
      Ensure the volume is mounted automatically at boot time. Something similar can also be done with a Systemd Mount unit.
  ```shell
  echo "/dev/xvdf /dcos/volume0 auto loop 0 2" | sudo tee -a /etc/fstab
  sudo mount /dcos/volume0
  ```
  11. Reboot.
  ```shell
  sudo reboot
  ```
  12. SSH to the Agent and verify a new resource state.     Review the `journald` logs for reference to the new volume `/dcos/volume0`. In particular, there should be an entry for the agent starting up and the new `volume0` Mounted Disk Resource.

  ```shell
  dcos node ssh --master-proxy --mesos-id=<Mesos ID of the node>

  journalctl -b | grep '/dcos/volume0'
May 05 19:18:40 dcos-agent-public-01234567000001 systemd[1]: Mounting /dcos/volume0...
May 05 19:18:42 dcos-agent-public-01234567000001 systemd[1]: Mounted /dcos/volume0.
May 05 19:18:46 dcos-agent-public-01234567000001 make_disk_resources.py[888]: Found matching mounts : [('/dcos/volume0', 74)]
May 05 19:18:46 dcos-agent-public-01234567000001 make_disk_resources.py[888]: Generated disk resources map: [{'name': 'disk', 'type': 'SCALAR', 'disk': {'source': {'mount': {'root': '/dcos/volume0'}, 'type': 'MOUNT'}}, 'role': '*', 'scalar': {'value': 74}}, {'name': 'disk', 'type': 'SCALAR', 'role': '*', 'scalar': {'value': 47540}}]
May 05 19:18:58 dcos-agent-public-01234567000001 mesos-slave[1891]: " --oversubscribed_resources_interval="15secs" --perf_duration="10secs" --perf_interval="1mins" --port="5051" --qos_correction_interval_min="0ns" --quiet="false" --recover="reconnect" --recovery_timeout="15mins" --registration_backoff_factor="1secs" --resources="[{"name": "ports", "type": "RANGES", "ranges": {"range": [{"end": 21, "begin": 1}, {"end": 5050, "begin": 23}, {"end": 32000, "begin": 5052}]}}, {"name": "disk", "type": "SCALAR", "disk": {"source": {"mount": {"root": "/dcos/volume0"}, "type": "MOUNT"}}, "role": "*", "scalar": {"value": 74}}, {"name": "disk", "type": "SCALAR", "role": "*", "scalar": {"value": 47540}}]" --revocable_cpu_low_priority="true" --sandbox_directory="/mnt/mesos/sandbox" --slave_subsystems="cpu,memory" --strict="true" --switch_user="true" --systemd_enable_support="true" --systemd_runtime_directory="/run/systemd/system" --version="false" --work_dir="/var/lib/mesos/slave"
```
Wait until the node is up, and then repeat the steps to mount more than one volume on the same node. Follow the same procedure from step 5 to mount a volume on other nodes.
   

