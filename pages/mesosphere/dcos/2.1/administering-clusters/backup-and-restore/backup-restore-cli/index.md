---
layout: layout.pug
navigationTitle:  Backup and Restore CLI
title: Backup and Restore CLI
menuWeight: 0
excerpt: Backing up and restoring your cluster using the CLI
enterprise: true
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---
You can use the CLI to create and restore backups of your cluster. You can also choose to back up and restore the state of [ZooKeeper](#zookeeper) running inside a DC/OS cluster.


# Prerequisites
- A DC/OS Enterprise cluster
- The [DC/OS CLI](/mesosphere/dcos/2.0/cli/install/) installed
- The [DC/OS Enterprise CLI](/mesosphere/dcos/2.0/cli/enterprise-cli/) installed

<p class="message--important"><strong>IMPORTANT: </strong>See the <a href="/mesosphere/dcos/latest/administering-clusters/backup-and-restore/#limitations">Limitations</a> section of Backup and Restore.</p>

# Backing up a cluster

Backups are stored on the local file system of the master node. The backup state is maintained by a service running in the cluster, and backup/restore operations are initiated by hitting this service directly.

1. Create a backup and assign it a meaningful label. The label has the following restrictions:
   - It must be between 3 and 25 characters in length.
   - It cannot start with `..`.
   - It must be composed of the following characters: [A-Za-z0-9_.-].

   ```bash
   dcos backup create --label=<backup-label>
   ```

1. Verify that your backup has been created.

   ```bash
   dcos backup list
   ```

   Or use the following command to restrict your search results to the label you used when you created the backup.

   ```bash
   dcos backup list [label]
   ```

   The backup will initially transition into the `STATUS_BACKING_UP` state, and should eventually arrive at `STATUS_READY`. If something goes wrong, it will show a state of `STATUS_ERROR`. Use `dcos backup show <backup-id>` to discover why Marathon errored out during the course of the backup.

1. Use the ID produced by `dcos backup list` to refer to your backup in subsequent commands. A backup ID will resemble `<backup-label>-ea6b49f5-79a8-4767-ae78-3f874c90e3da`.

## Deleting a backup

Delete an unneeded backup.

   ```bash
   dcos backup delete <backup-id>
   ```

# Restoring a cluster

1. List the available backups, choose the backup you want to restore to, and make a note of the backup ID.

   ```bash
   dcos backup list
   ```

1. Restore from the selected backup.

   ```bash
   dcos backup restore <backup-id>
   ```

1. Monitor the status of the restore operation.

   ```bash
   dcos backup show <backup-id>
   ```

   The `restores.component_status.marathon` parameter of the JSON output will show `STATUS_RESTORING`, and then `STATUS_READY`.

<a name="zookeeper"></a>

# ZooKeeper backup and restore

This section describes the process of backing up and restoring the state of ZooKeeper running inside a DC/OS cluster.

Backing up ZooKeeper will allow you to return a cluster to a known good state. Therefore we highly recommend that you back up your ZooKeeper state regularly, to be prepared for the worst-case scenario. When performing maintenance operations, such as an upgrade or downgrade, you may wish to back up the ZooKeeper state before beginning the maintenance.

<p class="message--important"><strong>IMPORTANT: </strong>
Restoring ZooKeeper from a backup should be the last resort to recover a DC/OS cluster. It is only applicable after confirming that the cluster has suffered permanent data loss, including the ZooKeeper state.
</p>


## Backing up a ZooKeeper cluster

The ZooKeeper cluster within DC/OS is a system that provides distributed consensus between member nodes. An instance of ZooKeeper is running on each master node and these instances service the entire cluster. The ZooKeeper state can only progress once all nodes in the cluster have seen and agreed on a certain value. This implies that state of any one ZooKeeper node will contain the entire state information up until a certain point in time. Therefore backing up only one ZooKeeper node is sufficient to get reasonably close to the latest state for a ZooKeeper cluster backup. Creating the backup takes time and therefore the live system at the end of the backup will most likely no longer reflect the current state. However, the data available at the beginning of the procedure will be captured.

### Prerequisites

* Make sure there is enough disk space available to temporarily store the ZooKeeper backup on a particular master node.
* Any shell commands must be issued as a privileged Linux user.

1. Stop the ZooKeeper instance on only one particular master node via the Exhibitor `systemd` unit.

    ```bash
    systemctl stop dcos-exhibitor
    ```

1. Create a ZooKeeper backup via the provided DC/OS ZooKeeper backup script on the same master node.

    ```bash
    /opt/mesosphere/bin/dcos-shell dcos-zk backup <backup-tar-archive-path> -v
    ```

1. Start the previously stopped ZooKeeper instance again on the same master node.

    ```bash
    systemctl start dcos-exhibitor
    ```

1. Download the created ZooKeeper backup tar archive from this master node to a safe location outside of the DC/OS cluster.

1. Remove the ZooKeeper backup tar archive from the master node.

## Restoring from a ZooKeeper backup

You can restore from a single ZooKeeper node backup that is physically replicated to all ZooKeeper nodes in the cluster.
This ensures that all nodes return to operation from the same state that was recorded up until the point when the backup procedure  finished. Restoring requires all ZooKeeper nodes to be stopped, meaning this is only an option when an outage is tolerable or ongoing.

1. Copy the previously created single ZooKeeper backup tar archive to every master node's file system.

1. Stop the ZooKeeper instances on every master node via the Exhibitor `systemd` unit.

    ```bash
    systemctl stop dcos-exhibitor
    ```

1. Initiate the restore procedure via the provided DC/OS ZooKeeper restore script on every master node.

    ```bash
    /opt/mesosphere/bin/dcos-shell dcos-zk restore <backup-tar-archive-path> -v
    ```

1. Start the previously stopped ZooKeeper instances again on every master node.

    ```bash
    systemctl start dcos-exhibitor
    ```

1. Monitor the Exhibitor state of the DC/OS cluster via the Exhibitor cluster status API endpoint (no authentication required).

    ```bash
    curl https://<master-host-ip>/exhibitor/exhibitor/v1/cluster/status
    [
      {
        "code": 3,
        "description": "serving",
        "hostname": "172.31.12.169",
        "isLeader": true
      },
      {
        "code": 3,
        "description": "serving",
        "hostname": "172.31.13.255",
        "isLeader": false
      },
      {
        "code": 3,
        "description": "serving",
        "hostname": "172.31.17.144",
        "isLeader": false
      }
    ]
    ```

The restore procedure is successful when all instances are in `serving` state and a leader has been elected.


## Limitations to ZooKeeper backups
- Backing up the ZooKeeper state in the current form requires stopping one ZooKeeper node. In cases where you are using 3 master nodes, this significantly reduces the tolerance of master node outages for a DC/OS cluster while a backup is taken, and impacts the resilience to a lesser degree when using 5 master nodes.
- Restoring from a ZooKeeper backup requires stopping all ZooKeeper instances within DC/OS. Hence this is only recommended as a last resort for restoring an otherwise non-recoverable cluster.
