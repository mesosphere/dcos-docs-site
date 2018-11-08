---
layout: layout.pug
navigationTitle: Operating DSE
excerpt: Operations and backup service for DSE
title: Operations
menuWeight: 30
model: /services/dse/data.yml
render: mustache
---

#include /services/include/operations.tmpl

## DSE OpsCenter Backup Service

<p class="message--warning"><strong>WARNING: </strong>Regular backups should be performed via the DSE OpsCenter Backup Service in production environments.  Backups and restores should be tested in a staging environment.</p>

The [OpsCenter Backup Service](https://docs.datastax.com/en/latest-opscenter/opsc/online_help/services/opscBackupService.html) allows you to create automatic or manual backups of your cluster data, from all the keyspaces in a cluster to specific keyspaces. You can perform both local and remote backups, and restoration ("cloning") to a different cluster. Backup data is stored locally on each node, and optionally in cloud-based storage services like Amazon S3.
