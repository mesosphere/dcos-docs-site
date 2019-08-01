---
layout: layout.pug
navigationTitle: Prometheus Federation
title: Federation
menuWeight: 35
excerpt: Configurating Federation for Prometheus
featureMaturity:
enterprise: false
---

## DC/OS Prometheus Federation
Federation allows you to pull aggregates up the hierarchy to a global Prometheus server. External labels, metrics path and match fields are required in the default Prometheus configuration yml, to set up federation configuration.

- **external labels:** Attach these labels when communicating with external systems.
- **metrics path:** The default metrics path is /metrics. For federation, it should be changed to /federate.
- **match:** match[] here requests all job-level time series.
- **global prometheus:** The Prometheus server which will recieve data from slave Prometheus server.

Template for global Prometheus server configuration:

```
# my global config
global:
 scrape_interval: 15s # Set the scrape interval to every 15 seconds. Default is every 1 minute.
 external_labels:
   job: '~".+"'
# A scrape configuration containing exactly one endpoint to scrape:
# Here it is Prometheus itself.
# Alert Rules
 rule_files:
 - alert.rules.yml
 scrape_configs:
 # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.    
 # Self Monitoring
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

### Use Case

To federate data from two or more Prometheus servers, we must launch the Prometheus service as a Global Prometheus Service and pass Global Prometheus server endpoints as targets to the `slave prometheus` service. To launch a Global Prometheus server, check the template given in the previous section.

<p class="message--note"><strong>NOTE: </strong> A Global Prometheus service will only help with federated data from other Prometheus servers and would not be monitoring anything, unlike another <code>-prometheus</code> server.</p>

Prometheus Service1, Prometheus Service2: Cluster of two prometheus servers monitoring different targets and federating data to Global Prometheus servers.

In case of a standalone Prometheus server, the default scrape path is `/metrics`, whereas in case of a Global Prometheus server the default scrape path is `/federate`; targets for a Global Prometheus server are other Prometheus services.  
