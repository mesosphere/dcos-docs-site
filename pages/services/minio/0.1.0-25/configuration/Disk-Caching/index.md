---
layout: layout.pug
navigationTitle: Disk Caching in MInio
title: Disk Caching in Minio
menuWeight: 45
excerpt: Disk Caching
featureMaturity:
enterprise: false
---

# Disk Caching in Minio

Disk caching feature refers to the use of caching disks to store content closer to the tenants. Disk Caching feature can be enabled by updating the cache settings in the config.json file of Minio.

Users specify arbitrary number of volumes to be mounted, cache expiry duration in days and any wildcard patterns to exclude from being cached.

You can enable disk caching in Minio by enabling minio cache enable checkbox while installing the Minio service from DC/OS web interface.

  
  [<img src="../../img/Disk_Caching.png" alt="Disk_Caching" width="800"/>](../../img/Disk_Caching.png)

