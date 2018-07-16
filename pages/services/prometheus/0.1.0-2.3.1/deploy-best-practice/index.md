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

## Block Device / Storage

Prometheus disk is hard to determine as it all depends on the organization.
Prometheus includes a local on-disk time series database, but also optionally integrates with remote storage systems.

Prometheus has several flags that allow configuring the local storage. The most important ones are:

    --storage.tsdb.path: This determines where Prometheus writes its database. Defaults to data/.
    --storage.tsdb.retention: This determines when to remove old data. Defaults to 15d.

On an average, Prometheus uses around 1-2 bytes per sample. Thus, to plan the capacity of a Prometheus server, one can use the rough formula:

```
needed_disk_space = retention_time_seconds * ingested_samples_per_second * bytes_per_sample

```
