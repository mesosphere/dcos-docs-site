---
layout: layout.pug
navigationTitle:  Deployment Best Practices
title: Deployment Best Practices
menuWeight: 30
excerpt: Best practices for production deployment
featureMaturity:
enterprise: false
---
# Deployment Best Practices

Note that the Node Exporter is best run on the host system, uncontainerized, so that it can cleanly expose all the host system metrics.

## Configuration Best Practices for Production
## Hardware Sizing Recommendations

In practice this can only really be determined empirically, as it varies organisation by organisation and machine by machine.
Below link will help deciding on how much ram does your prometheus would need :
    
    https://www.robustperception.io/how-much-ram-does-my-prometheus-need-for-ingestion/

## Block Device / Storage

Prometheus disk is hard to determing as it all depends on the organization to organization.
Prometheus includes a local on-disk time series database, but also optionally integrates with remote storage systems.

Prometheus has several flags that allow configuring the local storage. The most important ones are:

    --storage.tsdb.path: This determines where Prometheus writes its database. Defaults to data/.
    --storage.tsdb.retention: This determines when to remove old data. Defaults to 15d.

On average, Prometheus uses only around 1-2 bytes per sample. Thus, to plan the capacity of a Prometheus server, you can use the rough formula:

needed_disk_space = retention_time_seconds * ingested_samples_per_second * bytes_per_sample


We recommend the following:

1. Always prefer locally-attached storage. Remote storage adds points of failure, add latency/overhead to block requests and are more complicated to troubleshoot.  
2. For better performance, use Solid-State Disks vs. Spinning disks or allocate more memory to cache more data, reducing the use of disks.
