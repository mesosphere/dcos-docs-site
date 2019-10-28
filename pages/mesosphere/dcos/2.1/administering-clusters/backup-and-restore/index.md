---
layout: layout.pug
navigationTitle:  Backup and Restore
title: Backup and Restore
menuWeight: 7
excerpt: Backing up and restoring the important bits of your cluster
render: mustache
model: /mesosphere/dcos/2.0/data.yml
--- 

You may wish to back up your cluster before performing an upgrade or downgrade. You may need to restore your cluster to a known good state if something goes wrong during an upgrade or if you install a {{ model.packageRepo }} package that does not perform as expected.

This section provides guidance on how to back up and restore the state of particular DC/OS components via dedicated procedures.

DC/OS Enterprise users may want to back up and restore the native DC/OS Marathon instance state by using the DC/OS backup service. You can back up the state of the native Marathon instance of your cluster, and later restore from that backup. You can also choose to back up and restore the state of [ZooKeeper](/mesosphere/dcos/2.0/administering-clusters/backup-and-restore/backup-restore-cli/#zookeeper-backup-and-restore) running inside a DC/OS cluster.


# Limitations

- As of DC/OS 1.10, backups include only the state of Marathon running on master nodes.
- You can perform backup and restore operations only from the DC/OS Enterprise [backup and restore CLI](/mesosphere/dcos/2.0/administering-clusters/backup-and-restore/backup-restore-cli/) and the [backup and restore API](/mesosphere/dcos/2.0/administering-clusters/backup-and-restore/backup-restore-api/).

<p class="message--important"><strong>IMPORTANT: </strong>When you perform a backup or restore, Marathon is rebooted in order to perform the operation in a consistent state. This will not affect running tasks, but if a task is launching something at that time, it may be briefly unavailable.</p>



