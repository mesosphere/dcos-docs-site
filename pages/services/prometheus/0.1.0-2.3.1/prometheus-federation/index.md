---
layout: layout.pug
navigationTitle: Prometheus Federation
title: Federation 
menuWeight: 25
excerpt: Configurating federation for prometheus
featureMaturity:
enterprise: false
---

## DC/OS Prometheus Federation:
Federation allows for pulling aggregates up the hierarchy to a global Prometheus server. 
External labels, metrics path and match fields are required in the default Prometheus configuration yml, to setup federation configuration.

**External labels** : Attach these labels when communicating with external systems.
metrics path : default metrics path is /metrics , for federation it has to be changed to /federate.

**match** : match[] here requests all job-level time series.

**slave prometheus** : The prometheus sever from where data would get federated to global. It can be more than one.

**global prometheus** : The prometheus server which will recieve data from slave prometheus server.

**Template for global prometheus server configuration :**

```
# my global config
global:
 scrape_interval: 15s # Set the scrape interval to every 15 seconds. Default is every 1 minute.
 external_labels:
   job: '~".+"'
# A scrape configuration containing exactly one endpoint to scrape:
# Here it's Prometheus itself.# Alert Rules
rule_files:
 - alert.rules.ymlscrape_configs:
 # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.    # Self Monitoring
 - job_name: prometheus
   static_configs:
     - targets: ['localhost:9090']  - job_name: agent-metrics
   # All agent nodes are written regularly to discovery/agents.json
   file_sd_configs:
   - files: ['discovery/agents.json']  - job_name: 'globalprometheus'
   # scheme defaults to 'http'.
   metrics_path: /federate
   params:
    match[]:
     - '{job=~".+"}'
   static_configs:
    - targets: ['Slave Prometheus endpoint1','Slave Prometheus endpoint2']
```





























