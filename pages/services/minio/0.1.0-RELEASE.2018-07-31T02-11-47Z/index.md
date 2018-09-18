---
layout: layout.pug
navigationTitle: Minio 0.1.0-25
title: Minio 0.1.0-RELEASE.2018-06-29T02-11-29Z
menuWeight: 50
excerpt: Overview of DC/OS Minio 0.1.0-RELEASE.2018-06-29T02-11-29Z
featureMaturity:
enterprise: false
---

DC/OS Minio Service is an automated service that makes it easy to deploy and manage Minio on Mesosphere [DC/OS](https://mesosphere.com/product/). For more information on Minio, see the [Minio documentation](https://docs.minio.io/).

## Benefits
DC/OS Minio offers the following benefits :
1. Minio is a lightweight object storage server.
2. Minio deploys Amazon S3 compatible object storage server in seconds.
3. Provides Consistent deployment across multi-cloud environments.
4. Provides object storage API access to Docker volumes.

## DC/OS Minio's main features are:
1. Erasure Code: Minio protects data against hardware failures and silent data corruption using erasure code and checksums.
2. Bit rot protection: Minio provides Bit rot protection using HighwayHash algorithm.
3. Bucket Notification Service: Minio provides a bucket notification service. Events occurring on objects in a bucket can be monitored using bucket event notifications.
4. Gateway: Minio adds Amazon S3 compatibility to Azure Blob Storage, GCP and NAS.
5. Large Bucket Support: It allows a single Minio bucket to expand over multiple erasure code deployment sets. 
6. Disk Cache: Disk caching feature refers to the use of caching disks to store content closer to the tenants. 
7. Monitoring: Minio server exposes monitoring data over an unauthenticated endpoints so monitoring tools can pick the data without you having to share Minio server credentials.
