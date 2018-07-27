---
layout: layout.pug
navigationTitle:  Configuring Mount Volume
title: Configuring Mount volume
menuWeight: 30
excerpt: Configuring Mount Volume in Minio
featureMaturity:
enterprise: false
---

## Mount Volume Configuration

Below are the steps to be followed to configure Mount Volume:

  1. Create a external volume.
  
  2. Attach these volume to the nodes of the cluster.
  
  3. Identify the nodes of the cluster:
   ```shell
   dcos node
   ```
  4. SSH the node of the cluster:
   ```shell
   ssh-add <cluster key or pem file>
   ```
  5. 
  ```shell
  dcos node ssh --master-proxy --mesos-id=<task ID against the ip address above>cat /var/lib/dcos/mesos-resources
  sudo systemctl stop dcos-mesos-slave.service
  sudo rm -f /var/lib/dcos/mesos-resources
  lsblk
  sudo mkdir -p /dcos/volume0
  sudo mkfs -t ext4 /dev/xvdf
  sudo dd if=/dev/zero of=/dev/xvdf bs=1M count=4000
  sudo losetup /dev/loop0 /dev/xvdf
  sudo mkfs -t ext4 /dev/loop0
  sudo losetup -d /dev/loop0
  echo "/dev/xvdf /dcos/volume0 auto loop 0 2" | sudo tee -a /etc/fstab
  sudo mount /dcos/volume0
  sudo reboot
  ```
wait till the node getting up.now repeat same steps on same node if u want to mount more than one volume. Again wait till the     node getting up. now repeat from step 6 to mount the volume to the other nodes.
   
**Note:** Dont mount the volume to the public slave.
  
  
  
