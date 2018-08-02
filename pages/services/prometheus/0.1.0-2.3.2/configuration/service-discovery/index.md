---
layout: layout.pug
navigationTitle: Service Discovery
title: Service Discovery Configuration Options
menuWeight: 45
excerpt: Service Discovery
featureMaturity:
enterprise: false
---

# Service Discovery configuration templates :
Prometheus DC/OS offers the following service discovery mechanism: service discovery can be configured along with the default Prometheus configuration. You would use the following templates to pass along a default Prometheus configuration using the Prometheus yml.   

## Consul_sd_config

Consul SD configurations allow you to retrieve scrape targets from Consul's Catalog API. Finding targets happens in two stages.

- First, a service discovery method such as Consul returns potential targets with metadata.
- Second, relabelling allows you to choose which of those targets you want to scrape, and how to convert the metadata into target labels.

Let's say you wanted to monitor all services with a `prod` tag and use the Consul service name as the job label. Your scrape configuration would look like:

Template for consul sd config :

```
# The information to access the Consul API. It is to be defined
# as the Consul documentation requires
scrape_configs:
  - job_name: dummy
    consul_sd_configs:
      - server: 'localhost:8500'
    relabel_configs:
      - source_labels: [__meta_consul_tags]
        regex: .*,prod,.*
        action: keep
      - source_labels: [__meta_consul_service]
        target_label: job

```
The first relabel action says to keep processing only those targets which have a `prod` tag. Prometheus exposes the Consul tags as a comma separated list in the label called `__meta_consul_tags`, with leading and trailing commas added for convenience.

The second relabel action says to copy the service name from the `__meta_consul_service` label to the job label. This is done to take advantage of the default values for relabel actions, as a straight copy from one label to another is common.

## Dns_sd_condig

A DNS-based service discovery configuration allows you to specify a set of DNS domain names which are periodically queried to discover a list of targets. This service discovery method only supports basic DNS A, AAAA and SRV record queries,

Default `dns sd` configuration in `dcos prometheus`:

```
scrape_configs:
- job_name: master-metrics #job name
  # All master nodes are available at master.mesos via their A record
  dns_sd_configs:
    - names: ['master.mesos'] # A list of DNS domain names to be queried.
      type: 'A' # The type of DNS query to perform.
      port: 61091 # The port number used if the query type is not SRV.
```

## EC2_sd_config

EC2 SD configurations allow you to retrieve scrape targets from AWS EC2 instances.

Template for EC2_sd_config:

```
# The information to access the EC2 API.
scrape_configs:
  - job_name: 'node' # mention job name as desired
    ec2_sd_configs:
      - region: eu-west-1 # The AWS Region.
        access_key: PUT_THE_ACCESS_KEY_HERE
        secret_key: PUT_THE_SECRET_KEY_HERE
        port: 9100

```


See [Prometheus Configuration](https://prometheus.io/docs/prometheus/latest/configuration/configuration/) for all options.
