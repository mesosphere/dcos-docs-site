---
layout: layout.pug
navigationTitle: Prometheus Alerting Overview 
title: Prometheus Alerting Overview
menuWeight: 90
excerpt: DC/OS Prometheus Alerting Overview 
featureMaturity:
enterprise: false
---

# Alerting with Prometheus :

 Alerting with Prometheus is divided into below parts :

  1.Setup and configure the Alertmanager
  2.Configure Prometheus to talk to the Alertmanager
  3.Create alerting rules in Prometheus
  4.Send notification to slack , pager duty email.

## Setup and configure the Alertmanager

  Prometheus fires alert to Alert Manager, Alert Manager then manages those alerts and sends out notifications via methods such as slack,email and PagerDuty.

Below is the template for alert manager configuration :

global:
```
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
# The last component may use a wildcard matcher, e.g. 'templates/*.tmpl'.
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

### Configure Prometheus to talk to the Alertmanager:

 To intiate communcation between prometheus and alert manager , alert manager end points are added as target to prometheus yml under alerting at the end of below default configuration :

```
global:
 scrape_interval:     15s # Set the scrape interval to every 15 seconds. Default is every 1 minute.
 evaluation_interval: 15s # Evaluate rules every 15 seconds. The default is every 1 minute.
 # scrape_timeout is set to the global default (10s).# A scrape configuration containing exactly one endpoint to scrape:
# Here it's Prometheus itself.
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

### Create alerting rules in Prometheus
  Alerting rules allow you to define alert conditions based on Prometheus expression language expressions and to send notifications about firing alerts to an external service like slack , pager duty , email.

Below is the default alert rules , rules files are accessed in prometheus configuration yml.

```
rules :
groups:
- name: cpurule
 rules:
 - alert: highcpu
   expr: cpu_total > 2
   annotations:
     DESCRIPTION: 'it happened yeah'
     SUMMARY: 'it happened'
```
Below is the another sample of rules , which check which instance is down :

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
### Send notification to slack , pager duty email.

 Alert Manager manages sending alerts to slack , pager duty and email.

### Slack

  The Alertmanager uses the Incoming Webhooks feature of Slack.

  Below is the default configuration for sending alerts to slack to be configured under alert manager configuration yml.

```
route:
group_by: [cluster]
receiver: webh
group_interval: 1mreceivers:
- name: webh
 webhook_configs:
 - url: http://webhook.marathon.l4lb.thisdcos.directory:1234
```

### Pager Duty 
  Configuring pager duty with alert manager :
  1.First we need to create a service in PagerDuty, and obtain an integration key
  2.Go to the “Services” page in PagerDuty:
  3.Click “+ Add New Service”:
  4.Note down the Integration Key:

  Sample configuration for Pager duty setup to be added in alert manager configuration yml.

```
receivers:
- name: team-pager
  pagerduty_configs:
  - service_key: $INTEGRATION_KEY
```

### Email
  Configurating Prometheus with SMTP which is more commonly known as email.

  Below is the sample configuration required in alert manager configuration yml for sending alerts to email.
 
```
GMAIL_ACCOUNT=me@example.com # Substitute in your full gmail address here.
GMAIL_AUTH_TOKEN=XXXX        # Substitute in your app password

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

