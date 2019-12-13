---
layout: layout.pug
navigationTitle: 警报概述
title: 警报概述
menuWeight: 25
excerpt: DC/OS Prometheus 警报概述
featureMaturity:
enterprise: false
---

# Prometheus 警报：

 Prometheus 的警报分为以下部分：

 1. 设置和配置 Alertmanager

 2. 配置 Prometheus 与 Alertmanager 对话

 3. 在 Prometheus 中创建警报规则

 4. 发送通知至 Slack、PagerDuty 或电子邮件

## 设置和配置 Alertmanager

 Prometheus 向 Alertmanager 发出警报，然后 Alertmanager 管理这些警报，然后通过 Slack、电子邮件和 PagerDuty 等方法发送通知。

Alertmanager 配置模板如下：

```
global:
  # ResolveTimeout is the time after which an alert is declared resolved
  # if it has not been updated.
  [ resolve_timeout: <duration> | default = 5m ]

  # The default SMTP From header field.
  [ smtp_from: <tmpl_string> ]
  # The default SMTP smarthost used for sending emails, including port number.
  # Port number usually is 25,
  # Example: smtp.example.org:587
  [ smtp_smarthost: <string> ]
  # The default hostname to identify to the SMTP server.
  [ smtp_hello: <string> | default = "localhost" ]
  [ smtp_auth_username: <string> ]
  # SMTP Auth using LOGIN and PLAIN.
  [ smtp_auth_password: <secret> ]
  # SMTP Auth using PLAIN.
  [ smtp_auth_identity: <string> ]
  # SMTP Auth using CRAM-MD5.
  [ smtp_auth_secret: <secret> ]
  # The default SMTP TLS requirement.
  [ smtp_require_tls: <bool> | default = true ]

  # The API URL to use for Slack notifications.
  [ slack_api_url: <string> ]

  [ pagerduty_url: <string> | default = "https://events.pagerduty.com/v2/enqueue" ]
  [ opsgenie_api_url: <string> | default = "https://api.opsgenie.com/" ]

  # The default HTTP client configuration
  [ http_config: <http_config> ]

# Files from which custom notification template definitions are read.
# The last component may use a wildcard matcher, such as 'templates/*.tmpl'.
templates:
  [ - <filepath> ... ]

# The root node of the routing tree.
route: <route>

# A list of notification receivers.
receivers:
  - <receiver> ...

# A list of inhibition rules.
inhibit_rules:
  [ - <inhibit_rule> ... ]-
```

### 配置 Prometheus 与 Alertmanager 对话：

 要初始化在 Prometheus 和 Alertmanager 之间的通信，在以下默认配置末尾，将 Alertmanager 端点作为目标添加到 Prometheus yml 中，位于`alerting`下方：

```
global:
 scrape_interval:     15s # Set the scrape interval to every 15 seconds. Default is every 1 minute.
 evaluation_interval: 15s # Evaluate rules every 15 seconds. The default is every 1 minute.
 # scrape_timeout is set to the global default (10s).# A scrape configuration containing exactly one endpoint to scrape:
# Here it is Prometheus itself.
scrape_configs:
 - job_name: 'dcos-metrics'    # All master nodes are available at master.mesos via their A record
   dns_sd_configs:
     - names: ['master.mesos']
       type: 'A'
       port: 61091    # All agent nodes are written regularly to discovery/agents.json
   file_sd_configs:
     - files: ['discovery/agents.json']

rule_files:
   # set of rule files to read alerting rules from
   -  'rules.yml'      

alerting:
 alertmanagers:
   - static_configs:
     - targets: ['alertmanager.prometheus.l4lb.thisdcos.directory:9093']
```

### 在 Prometheus 中创建警报规则
 警报规则允许您根据 Prometheus 语言表达式定义警报条件，并向外部服务（如 Slack、PagerDuty 和电子邮件）发送关于触发警报的通知。

默认警报规则如下。在 Prometheus 配置 .yml 中访问规则文件。

```
rules:
groups:
- name: cpurule
 rules:
 - alert: highcpu
   expr: cpu_total > 2
   annotations:
     DESCRIPTION: 'High CPU Utilization'
     SUMMARY: 'This is to notify for high cpu utilization'
```
以下示例检查了哪个实例是停工的：

```
alert: InstanceDown
expr: up == 0
for: 5m
labels:
  severity: page
annotations:
  summary: "Instance {{$labels.instance}} down"
  description: "{{$labels.instance}} of job {{$labels.job}} has been down for more than 5 minutes."

```
### 发送通知至 Slack、PagerDuty 和电子邮件

 Alertmanager 管理向 Slack、PagerDuty 和电子邮件发送警报。

### Slack

 要使用 Alertmanager 配置 Slack，Alertmanager 使用 Slack 的输入网钩功能。

 下面的默认配置将警报发送到 Slack，以在 Alertmanager 配置 yml 下进行配置。

```
route:
group_by: [cluster]
receiver: webh
group_interval: 1mreceivers:
- name: webh
 webhook_configs:
 - url: http://webhook.marathon.l4lb.thisdcos.directory:1234
```

### PagerDuty
要使用 Alertmanager 配置 PagerDuty：

1. 在 PagerDuty 中创建服务，并获取集成密钥。

2. 转到 PagerDuty 中的“服务”页面：

3. 单击“+ 添加新服务”：

4. 记下整合密钥。

以下是向 Alertmanager 配置 yml 添加 PagerDuty 设置的示例配置。

```
receivers:
- name: team-pager
  pagerduty_configs:
  - service_key: $INTEGRATION_KEY
```

### 电子邮件
 以下是向 Alertmanager 配置 yml 添加电子邮件警报设置的示例配置。

```
GMAIL_ACCOUNT=me@example.com # Substitute your full gmail address here.
GMAIL_AUTH_TOKEN=XXXX        # Substitute your app password

receivers:
- name: email-me
  email_configs:
  - to: $GMAIL_ACCOUNT
    from: $GMAIL_ACCOUNT
    smarthost: smtp.gmail.com:587
    auth_username: "$GMAIL_ACCOUNT"
    auth_identity: "$GMAIL_ACCOUNT"
    auth_password: "$GMAIL_AUTH_TOKEN"
```
