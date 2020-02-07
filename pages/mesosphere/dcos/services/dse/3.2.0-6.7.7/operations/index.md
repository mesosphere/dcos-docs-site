---
layout: layout.pug
navigationTitle: Operations
excerpt: Operations and backup service for DSE
title: Operations
menuWeight: 30
model: /mesosphere/dcos/services/dse/data.yml
render: mustache
---

#include /mesosphere/dcos/services/include/operations.tmpl

## {{ model.techShortName }} {{ model.techOpsName }} Backup Service

<p class="message--warning"><strong>WARNING: </strong>Regular backups should be performed via the {{ model.techShortName }} {{ model.techOpsName }} Backup Service in production environments.  Backups and restorations should be tested in a staging environment.</p>

The [{{ model.techOpsName }} Backup Service](https://docs.datastax.com/en/latest-opscenter/opsc/online_help/services/opscBackupService.html) allows you to create automatic or manual backups of your cluster data, from all the keyspaces in a cluster to specific keyspaces. You can perform both local and remote backups, and restoration ("cloning") to a different cluster. Backup data is stored locally on each node, and optionally in cloud-based storage services like Amazon S3.
