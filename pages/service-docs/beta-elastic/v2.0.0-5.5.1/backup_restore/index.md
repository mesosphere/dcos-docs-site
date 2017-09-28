---
layout: layout.pug
navigationTitle:  Backup and Restore
title: Backup and Restore
menuWeight: 34
excerpt:
featureMaturity: preview
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-commons -->


# Backup and Restore

You interact with the Elasticsearch cluster directly to perform snapshot and restore operations. Elasticsearch's built in [snapshot and restore module](https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-snapshots.html) allows you to create snapshots of individual indices or an entire cluster into a remote repository like a shared file system, S3, or HDFS.    
