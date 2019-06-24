---
layout: layout.pug
navigationTitle:  Backup and Restore
title: Backup and Restore
menuWeight: 7
excerpt: Backing up and restoring the native Marathon instance of your clusters
enterprise: true
render: mustache
model: ../../data.yml
--- 

You can back up the state of the native Marathon instance of your cluster, and later restore from that backup.

You may wish to back up your cluster before performing an upgrade or downgrade. You may need to restore your cluster to a known good state if something goes wrong during an upgrade or if you install a {{ model.packageRepo }} package that does not perform as expected.

# Limitations

- As of DC/OS 1.10, backups include only the state of Marathon running on master nodes.
- You can perform backup and restore operations only from the DC/OS Enterprise [backup and restore CLI](/1.13/administering-clusters/backup-and-restore/backup-restore-cli/) and the [backup and restore API](/1.13/administering-clusters/backup-and-restore/backup-restore-api/).

<p class="message--important"><strong>IMPORTANT: </strong>When you perform a backup or restore, Marathon is rebooted in order to perform the operation in a consistent state. This will not affect running tasks, but if a task is launching something at that time, it may be  unavailable briefly.</p>

