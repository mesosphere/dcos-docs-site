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
Federation allows for pulling aggregates up the hierarchy, for federatiojn you would require external lables to be added along with default prometheus yml configuration a, metrics path and match field.

external labels : Attach these labels to any time series or alerts when communicating with external systems
meterics_path : default metrics path is /metrics , for federation it has to be changed to /federate.

match : match[] here requests all job-level time series, so by following this naming convention you don’t have to adjust the config every time there’s a new job.

slave prometheus : slave terminology is used for prometheus sever from where data would get federated to global, slave could be more than one.
global prometheus : global terminology is used here for prometheus server where it will be top in the hierarchy and would be having all the data from respective slave prometheus servers.

#Template for global prometheus server configuration :

my global config
 global:

  scrape_interval: 15s " Set the scrape interval to every 15 seconds. Default is every 1 minute"

   external_labels:
     job: '~".+"'

     "A scrape configuration containing exactly one endpoint to scrape:"

     "Here it's Prometheus itself.# Alert Rules"

rule_files:

 - alert.rules.ymlscrape_configs:

"The job name is added as a label `job=<job_name>` to any timeseries scraped from this config"

 - job_name: prometheus

     static_configs:

       - targets: ['localhost:9090']  - job_name: agent-metrics

     file_sd_configs:
   
   metrics_path: /federate

    params:

    match[]:

     - '{job=~".+"}'

   static_configs:

    - targets: ['prometheus endpoints1','prometheus endpoints2']






























