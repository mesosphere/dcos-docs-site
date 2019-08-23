---
layout: layout.pug
navigationTitle:  Backup and Restore
title: Backup and Restore
menuWeight: 7
excerpt: Backing up and restoring the important bits of your cluster
render: mustache
model: /mesosphere/dcos/1.14/data.yml
--- 

You may wish to back up your cluster before performing an upgrade or downgrade. You may need to restore your cluster to a known good state if something goes wrong during an upgrade.

This section provides guidance on how to backup and restore the state of particular DC/OS components via dedicated procedures.

DC/OS Enterprise users may want to backup and restore the native DC/OS Marathon instance state by using the DC/OS backup service.

