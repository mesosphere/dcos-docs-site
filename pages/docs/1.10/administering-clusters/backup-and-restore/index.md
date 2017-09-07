---
layout: layout.pug
title: Backup and Restore
menuWeight: 7
excerpt: ""
featureMaturity: ""
enterprise: 'yes'
navigationTitle:  Backup and Restore
---

As of DC/OS 1.10, you can back up the state of the native Marathon instance of your cluster, and later restore from that backup. Future DC/OS releases will support backing up other DC/OS components as well as select frameworks running on top of DC/OS (including Marathon on Marathon).

You may wish to back up your cluster before performing an upgrade or downgrade. You may need to restore your cluster to a known good state if something goes wrong during an upgrade or if you install a Universe package that does not perform as expected.

### Prerequisites
- A DC/OS Enterprise cluster.
- The [DC/OS CLI installed](/docs/1.10/cli/install/).
- The [DC/OS Enterprise CLI](/docs/1.10/cli/enterprise-cli/) installed.

**Important:** When you perform a backup or restore, Marathon is rebooted in order to be able to perform the operation in a consistent state. This will not affect running tasks, but if a task is launching something at that time, you can experience brief unavailability.

# Back Up Your Cluster

Backups are stored on the local file system of the master node. Backup state is maintained by a service running in the cluster and backup/restore operations are initiated by hitting this service directly.

1. Create a backup and assign it a meaningful label.
   The label has the following restrictions:
   - It must be between 3 and 25 characters in length.
   - It cannot start with `..`.
   - It must be composed of the following characters: [A-Za-z0-9_.-].

   ```bash
   dcos backup create --label=<backup-label>
   ```

1. Verify your backup has been created.

   ```bash
   dcos backup list
   ```

   Or use the following command to refine your search results to the label you used when you created the backup.

   ```bash
   dcos backup list [label]
   ```

   The backup will initially transition into the `STATUS_BACKING_UP` state, and should eventually arrive at `STATUS_READY`. If something goes wrong, it will show a state of `STATUS_ERROR`. Use `dcos show <backup-id>` to inspect why Marathon errored out during the course of the backup.

1. Use the ID produced by `dcos backup list` to refer to your backup in subsequent commands. Your backup ID will resemble `<backup-label>-ea6b49f5-79a8-4767-ae78-3f874c90e3da`.

1. Delete an unneeded backup.

   ```bash
   dcos backup delete <backup-id>
   ```

# Restore your Cluster

1. Choose the backup you want to restore to and make a note of the backup ID.

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

# Limitations

- As of DC/OS 1.10, you can only back up and restore Marathon state.
- You can only perform backup and restore operations from the DC/OS Enterprise CLI <!--or the API-->.
