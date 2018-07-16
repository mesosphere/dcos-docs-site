---
layout: layout.pug
navigationTitle: Prometheus Remote Storage
title: Prometheus Remote Storage to Influx db
menuWeight: 25
excerpt: Integrating prometheus with remote storage influx db
featureMaturity:
enterprise: false
---

# Remote Storage 

 DC/OS Prometheus local storage is not supposed to be a long term data storage, rather an ephemeral cache.
 The remote write and remote read features of Prometheus allow transparent sending and receiving of samples.

## Prometheus remote storage on Influx DB

  Prometheus has support for a remote read and write API, which stores scraped data to other data storages. Writes get forwarded onto the remote store.


### prerequisite

  1. Install Influx DB 
  2. Start Influx DB service
  3. Create user and password
  3. Create db (where you would want prometheus metrics to be stored).

### Integration with Influx db 

  Once the Influx db servie up and running, following is the configuration required at the Prometheus end :

Template :

```
# Remote write configuration (for Graphite, OpenTSDB, or InfluxDB).
remote_write:
 - url: "http://<Public ip of influx server>:<influx service port>/api/v1/prom/write?u=<user>&p=<password>&db=<dbname>"

# Remote read configuration (for InfluxDB only at the moment).
remote_read:
 - url: "http://<Public ip of influx server>:<influx service port>/api/v1/prom/read?u=<user>&p=<password>&db=<dbname>"Sample :# Remote write configuration (for Graphite, OpenTSDB, or InfluxDB).
```

Example : 

```
# Remote write configuration (for Graphite, OpenTSDB, or InfluxDB).
remote_write:
 - url: "http://52.79.251.5:8086/api/v1/prom/write?u=<user>&p=<password>&db=prometheus_demo"

# Remote read configuration (for InfluxDB only at the moment).
remote_read:
 - url: "http://52.79.251.5:8086/api/v1/prom/read?u=<user>&p=<password>&db=prometheus_demo"
```

Influx db listens at port number 8086, by default.
