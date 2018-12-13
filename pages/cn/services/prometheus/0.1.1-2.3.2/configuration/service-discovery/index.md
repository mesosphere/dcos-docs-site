---
layout: layout.pug
navigationTitle: 服务发现
title: 服务发现配置选项
menuWeight: 45
excerpt: 服务发现
featureMaturity:
enterprise: false
---

# Service Discovery 配置模板
Prometheus DC/OS 服务发现可以随同默认 Prometheus 配置进行配置。您可以使用以下模板通过 Prometheus yml 进行默认 Prometheus 配置。

## Consul_sd_config

Consul SD 配置允许您从 Consul 的目录 API 检索抓取目标。找到目标需要两个阶段。

1. 服务发现方法（如 Consul）用元数据返回潜在目标。
1. 重新标记允许您选择想要抓取的目标，以及如何将元数据转换为目标标签。

如果您希望监控所有具有 `prod` 标签的服务并使用 Consul 服务名称作为作业标签，您的抓取配置如下：

consul sd config 模板：

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
第一次重新标记操作，保留仅对那些具有 `prod` 标签的目标的处理。Prometheus 将 Consul 标签公开为名为 `__meta_consul_tags` 的标签中的逗号分隔列表，为方便起见，前后添加逗号。

第二次重新标记操作，将服务名称从 `__meta_consul_service` 标签复制到作业标签。此操作利用重新标记操作的默认值，因为标签之间的直接复制很常见。

## Dns_sd_condig

基于 DNS 的服务发现配置允许您指定定期查询的 DNS 域名集，以发现目标列表。此服务发现方法仅支持基本 DNS A、AAAA 和 SRV 记录查询。

`dcos prometheus` 中的默认 `dns sd` 配置：

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

EC2 SD 配置允许您从 AWS EC2 实例检索抓取目标。

EC2_sd_config 模板：

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


参见 [Prometheus 配置](https://prometheus.io/docs/prometheus/latest/configuration/configuration/) 了解所有选项。
