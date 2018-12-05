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

DC/OS {{ model.techName }} Service is an automated service that makes it easy to deploy and manage {{ model.techName }} on Mesosphere [DC/OS](https://mesosphere.com/product/). For more information on {{ model.techName }}, see the [{{ model.techName }} documentation](https://docs.minio.io/).

## Benefits
DC/OS {{ model.techName }} offers the following benefits:
1. Based on the proven DC/OS framework/operator SDK underpinning all DC/OS-certified frameworks
2. {{ model.techName }} is a lightweight object storage server.
3. {{ model.techName }} deploys Amazon S3 compatible object storage server in seconds.
4. Provides consistent deployment across multi-cloud environments.
5. Backup and restore operations use AWS S3 as backing store

## DC/OS {{ model.techName }}'s main features are:
1. **Erasure Code**: {{ model.techName }} protects data against hardware failures and silent data corruption using erasure code and checksums.
2. **Bit rot protection**: {{ model.techName }} provides bit rot protection using the HighwayHash algorithm.
3. **Bucket Notification Service**: {{ model.techName }} provides a bucket notification service. Events occurring on objects in a bucket can be monitored using bucket event notifications.
4. **Gateway**: {{ model.techName }} adds Amazon S3 compatibility to Azure Blob Storage, GCP and NAS.
5. **Large Bucket Support**: Allows a single {{ model.techName }} bucket to expand over multiple erasure code deployment sets.
6. **Disk Cache**: Disk caching allows caching disks to store content closer to  tenants.
7. **Monitoring**: {{ model.techName }} server exposes monitoring data over an unauthenticated endpoints so monitoring tools can pick the data without you having to share {{ model.techName }} server credentials.

## Dynamic Scaling Out

{{ model.techName }} does not support horizontal scaling;  if a {{ model.techName }} cluster has started with eight {{ model.techName }} servers then a ninth {{ model.techName }} server cannot be added to the {{ model.techName }} cluster.
