---
layout: layout.pug
navigationTitle: Remote Storage
title: Prometheus Remote Storage to InfluxDB
menuWeight: 40
excerpt: Integrating Prometheus with remote storage InfluxDB
featureMaturity:
enterprise: false
---

# Remote Storage

DC/OS Prometheus local storage is not supposed to be long term data storage; rather, it is an ephemeral cache. The remote write and remote read features of Prometheus allow transparent sending and receiving of samples.

## Prometheus remote storage on Influx DB

Prometheus supports a remote read and write API, which stores scraped data to other data storages. Writes get forwarded onto the remote store.


### Prerequisites

  1. Install InfluxDB
  2. Start InfluxDB service
  3. Create user and password
  3. Create db (where you would want Prometheus metrics to be stored).

### Integration with InfluxDB

  Once the InfluxDB service is up and running, the following configuration is required at the Prometheus end:

**Template:**

```
# Remote write configuration (for Graphite, OpenTSDB, or InfluxDB).
remote_write:
 - url: "http://<Public ip of influx server>:<influx service port>/api/v1/prom/write?u=<user>&p=<password>&db=<dbname>"

# Remote read configuration (for InfluxDB only at the moment).
remote_read:
 - url: "http://<Public ip of influx server>:<influx service port>/api/v1/prom/read?u=<user>&p=<password>&db=<dbname>"Sample :# Remote write configuration (for Graphite, OpenTSDB, or InfluxDB).
```

**Example:**

```
# Remote write configuration (for Graphite, OpenTSDB, or InfluxDB).
remote_write:
 - url: "http://52.79.251.5:8086/api/v1/prom/write?u=<user>&p=<password>&db=prometheus_demo"

# Remote read configuration (for InfluxDB only at the moment).
remote_read:
 - url: "http://52.79.251.5:8086/api/v1/prom/read?u=<user>&p=<password>&db=prometheus_demo"
```

InfluxDB listens at port number 8086, by default.
