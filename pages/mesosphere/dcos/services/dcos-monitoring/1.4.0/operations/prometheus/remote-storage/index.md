---
layout: layout.pug
navigationTitle: Prometheus Remote Storage
title: Prometheus Remote Storage
menuWeight: 20
excerpt: Prometheus Remote Storage
render: mustache
model: ../../../data.yml
---

# Configuring Prometheus Remote Storage

## Remote Storage

You can configure Prometheus to use remote storage. Prometheus's local storage is limited by single nodes in its scalability and durability. Instead of trying to solve clustered storage in Prometheus itself, Prometheus has a set of interfaces that allow integrating with remote storage systems.

The remote write and remote read features of Prometheus allow transparently sending and receiving samples. This is primarily intended for long term storage. It is recommended that you perform careful evaluation of any solution in this space to confirm it can handle your data volumes.

The following example of configuration that will deploy Prometheus with remote write feature, simillar can be done for remote read:

```json
{
  "prometheus": {
    "remote_write": {
      "url": "http://107.22.100.63:8086/api/v1/prom/write?db=prometheus",
      "remote_timeout": "30s",
      "basic_auth": {
        "username": "username",
        "password": "password"
      },
      "tls_config": {
        "enabled": true,
        "ca_file": "CA",
        "cert_file": "CERT",
        "key_file": "KEY",
        "insecure_skip_verify": "false"
      },
      "queue_config": {
        "capacity": "500",
        "max_shards": "1000",
        "min_shards": "1",
        "max_samples_per_send": "100",
        "batch_send_deadline": "5s",
        "min_backoff": "30ms",
        "max_backoff": "100ms"
      }
    }
  }
}
```

you will need to configure the secrets for files like ca_file,cert_file,key_file bearer_token_file and provide its path in above configuration.

Refer to links [remote-storage-integrations](https://prometheus.io/docs/prometheus/latest/storage/#remote-storage-integrations) [doremote-endpoints-and-storage](https://prometheus.io/docs/operating/integrations/#remote-endpoints-and-storage) [remote_write](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#remote_write) [remote_read](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#remote_read) for more details about remote storage.
