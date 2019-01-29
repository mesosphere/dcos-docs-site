---
layout: layout.pug
navigationTitle:  Backup and Restore
title: Backup and Restore
menuWeight: 7
excerpt: Backing up and restoring the native Marathon instance of your clusters

enterprise: true
---

You can back up the state of the native Marathon instance of your cluster, and later restore from that backup.

You may wish to back up your cluster before performing an upgrade or downgrade. You may need to restore your cluster to a known good state if something goes wrong during an upgrade or if you install a Universe package that does not perform as expected.

# Limitations

- As of DC/OS 1.10, backups include only the state of Marathon running on master nodes.
- You can perform backup and restore operations only from the DC/OS Enterprise [backup and restore CLI](/1.11/administering-clusters/backup-and-restore/backup-restore-cli/) and the [backup and restore API](/1.11/administering-clusters/backup-and-restore/backup-restore-api/).

<table class=“table” bgcolor=#858585>
<tr> 
  <td align=justify style=color:white><strong>Important:</strong> When you perform a backup or restore, Marathon is rebooted in order to be able to perform the operation in a consistent state. This will not affect running tasks, but if a task is launching something at that time, you can experience brief unavailability.</td> 
</tr> 
</table>
