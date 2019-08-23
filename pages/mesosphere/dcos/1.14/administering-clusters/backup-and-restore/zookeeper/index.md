---
layout: layout.pug
navigationTitle: ZooKeeper State
title: Back up and Restore ZooKeeper
menuWeight: 1
excerpt: Backing up and restoring DC/OS ZooKeeper state
render: mustache
model: /mesosphere/dcos/1.14/data.yml
--- 

Back up the state of ZooKeeper inside a DC/OS cluster, and later restore from that backup.

You may wish to back up the ZooKeeper state of your cluster before performing an upgrade or downgrade. You may need to restore your cluster to a known good state if something goes wrong during an upgrade. It is highly recommended to backup ZooKeeper state regularly to be prepared for the worst-case scenario.

<p class="message--important"><strong>IMPORTANT: </strong>
Restoring ZooKeeper from a backup should be the last resort to recover a DC/OS cluster. It is only applicable after confirming that the cluster has suffered permanent data loss including the ZooKeeper state.
</p>

# Explanation

## Backup

The ZooKeeper cluster within DC/OS is a system that provides distributed consensus between its nodes running on each master node. The ZooKeeper state can only progress once all nodes in the cluster have seen and agreed on a certain value. This implies that state of any one ZooKeeper node will contain the entire state information up until a certain point in time. Therefore backing up only one ZooKeeper node is sufficient to get reasonably close to the latest state for a ZooKeeper cluster backup. Creating the backup takes time and therefore in live system the backed up information will not be current. This problem could be avoided by stopping all ZooKeeper instances but that is not desirable in highly available system.

## Restore

Restoring is done from a single ZooKeeper node backup that is physically replicated to all ZooKeeper nodes in the cluster.
This ensures that all nodes return to operation from the same state that was recorded up until the point in time of when the backup procedure had finished. Restoring requires all ZooKeeper nodes to be stopped meaning this is only an option when an outage is tolerable or ongoing.

# Procedure 

* Make sure there is enough disk space available to temporarily store the ZooKeeper backup on a particular master nodes.
* Any shell commands in this guide must be issued as a privileged Linux user.

## Creating a ZooKeeper backup

1. Stop the ZooKeeper instance on only one particular master node via the Exhibitor systemd unit.

```bash
systemctl stop dcos-exhibitor
```

2. Create a ZooKeeper backup via the provided DC/OS ZooKeeper backup script on the very same master node.

```bash
/opt/mesosphere/bin/dcos-shell dcos-zk backup <backup-tar-archive-path> -v
```

3. Start the previously stopped ZooKeeper instance again on the very same master node.

```bash
systemctl start dcos-exhibitor
```

4. Download the created ZooKeeper backup tar archive from this master node to a safe location outside of the DC/OS cluster.

5. Remove the ZooKeeper backup tar archive from the master node.


## Restoring from a ZooKeeper backup

1. Copy the previously created single ZooKeeper backup tar archive to every master nodes file system.

2. Stop the ZooKeeper instances on every master node via the Exhibitor systemd unit.

```bash
systemctl stop dcos-exhibitor
```

3. Initiate the restore procedure via the provided DC/OS ZooKeeper restore script on every master node.

```bash
/opt/mesosphere/bin/dcos-shell dcos-zk restore <backup-tar-archive-path> -v
```

3. Start the previously stopped ZooKeeper instances again on every master node.

```bash
systemctl start dcos-exhibitor
```

4. Monitor the Exhibitor state of the DC/OS cluster via the Exhibitor cluster status API endpoint (no authentication required).

```bash
curl https://<master-host-ip>/exhibitor/exhibitor/v1/cluster/status
```

Once all instances are in `serving` state and a leader has been elected the restore procedure was successful.


# Limitations
- Backing up the ZooKeeper state in the current form requires stopping one ZooKeeper node. This significantly reduces the tolerance of master node outages for a DC/OS cluster while a backup is taken in the case of using 3 master nodes and impacts the resilience to a lesser degree when using 5 master nodes.
- Restoring from a ZooKeeper backup requires stopping all ZooKeeper instances within DC/OS. Hence this is only recommended as a last resort for restoring an otherwise not recoverable cluster.
