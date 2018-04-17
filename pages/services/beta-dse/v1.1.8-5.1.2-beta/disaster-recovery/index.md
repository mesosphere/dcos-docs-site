---
layout: layout.pug
navigationTitle:  Disaster Recovery
title: Disaster Recovery
menuWeight: 70
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/dse-private -->


DC/OS does not provide any specific disaster recovery capabilities.  As such, a disaster recovery plan must center around features of DSE.  **Regular backups should be performed via the DSE OpsCenter Backup Service in production environments.  Backups and restores should be tested in a staging environment.**

## DSE OpsCenter Backup Service
The [OpsCenter Backup Service](https://docs.datastax.com/en/latest-opscenter/opsc/online_help/services/opscBackupService.html) allows you to create automatic or manual backups of your cluster data, from all the keyspaces in a cluster to specific keyspaces. You can perform both local and remote backups, point-in-time restores, and restoration ("cloning") to a different cluster. Backup data is stored locally on each node, and optionally in cloud-based storage services like Amazon S3.  
