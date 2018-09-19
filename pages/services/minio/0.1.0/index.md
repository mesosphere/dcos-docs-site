---
layout: layout.pug
navigationTitle: Minio 0.1.0
title: Minio 0.1.0
menuWeight: 50
excerpt: Documentation for DC/OS Minio 0.1.0
model: /services/minio/data.yml
render: mustache
featureMaturity:
enterprise: false
---

DC/OS {{ model.techName }} Service is an automated service that makes it easy to deploy and manage {{ model.techName }} on Mesosphere [DC/OS](https://mesosphere.com/product/). For more information on Minio, see the [Minio documentation](https://docs.minio.io/).

## Benefits
DC/OS {{ model.techName }} offers the following benefits:
1. Based on the battle-proven DC/OS framework/operator SDK underpinning all DC/OS-certified frameworks
2. Minio is a lightweight object storage server.
3. Minio deploys Amazon S3 compatible object storage server in seconds.
4. Provides Consistent deployment across multi-cloud environments.
5. Backup and restore using AWS S3 as backing store

## DC/OS {{ model.techName }}'s main features are:
1. Erasure Code: Minio protects data against hardware failures and silent data corruption using erasure code and checksums.
2. Bit rot protection: Minio provides Bit rot protection using HighwayHash algorithm.
3. Bucket Notification Service: Minio provides a bucket notification service. Events occurring on objects in a bucket can be monitored using bucket event notifications.
4. Gateway: Minio adds Amazon S3 compatibility to Azure Blob Storage, GCP and NAS.
5. Large Bucket Support: It allows a single Minio bucket to expand over multiple erasure code deployment sets.
6. Disk Cache: Disk caching feature refers to the use of caching disks to store content closer to the tenants.
7. Monitoring: Minio server exposes monitoring data over an unauthenticated endpoints so monitoring tools can pick the data without you having to share Minio server credentials.
