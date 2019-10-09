---
layout: layout.pug
navigationTitle: Sending Alerts via Slack
title: Sending Alerts via Slack
menuWeight: 20
excerpt: Configuring Alertmanager to send Slack notifications
render: mustache
model: ../../../data.yml
---

# Configuring Alertmanager to alert via Slack

## Create an Alertmanager configuration file

See the [Alertmanager configuration documentation](https://prometheus.io/docs/alerting/configuration/) and the [Slack configuration section](https://prometheus.io/docs/alerting/configuration/#slack_config) for a detailed overview of how to create a configuration file with a Slack receiver.

See the following example of a basic configuration file that is set up with a Slack receiver.
The configuration file *must* be named `config.yml`.
In this example, the Slack channel is set to `#prometheus-alerts`.
You can set this to another existing Slack channel, or create the Slack channel `#prometheus-alerts`.

`config.yml`

```yaml
# The root route on which each incoming alert enters.
route:
  # The labels by which incoming alerts are grouped together. For example,
  # multiple alerts coming in for cluster=A and alertname=LatencyHigh would
  # be batched into a single group.
  #
  # To aggregate by all possible labels use '...' as the sole label name.
  # This effectively disables aggregation entirely, passing through all
  # alerts as-is. This is unlikely to be what you want, unless you have
  # a very low alert volume or your upstream notification system performs
  # its own grouping. Example: group_by: [...]
  group_by: ['alertname', 'cluster', 'service']

  # When a new group of alerts is created by an incoming alert, wait at
  # least 'group_wait' to send the initial notification.
  # This way ensures that you get multiple alerts for the same group that start
  # firing shortly after another are batched together on the first
  # notification.
  group_wait: 30s

  # When the first notification was sent, wait 'group_interval' to send a batch
  # of new alerts that started firing for that group.
  group_interval: 5m

  # If an alert has successfully been sent, wait 'repeat_interval' to
  # resend them.
  repeat_interval: 30m

  # A default receiver
  receiver: slack_general

receivers:
- name: slack_general
  slack_configs:
  - channel: '#prometheus-alerts'
```

Save `config.yml` into a Git repository, in a subfolder called `slack`.
Assume that the repository is `https://github.com/company/alertmanager-configs`.

## Create the Slack API URL secret

The service is automatically configured to add the following global default value for `slack_api_url` in the configuration file.

```yaml
global:
- slack_api_url: '<SLACK_API_URL>'
```

Create the secret `slackapiurl-secret` for the Slack API URL ([Webhook URL](https://api.slack.com/incoming-webhooks)) to use for notifications.

```bash
dcos security secrets create --value=<SLACK_API_URL> slackapiurl-secret
```

When installing the service, you must configure the `secrets` section to point to the secret `slackapiurl-secret` created.

```json
{
  "alertmanager": {
    "secrets": {
      "slack_api_url_secret": "slackapiurl-secret"
    },
    "config_repository": {
      "url": "https://github.com/company/alertmanager-configs",
      "path": "/slack"
    }
  }
}
```

If the Git repository is private, you will need to [configure the credentials](../config/#create-secrets-for-git-repository-credentials) to access the Git repository.

## Install {{ model.techName }} service

Install the service using the custom options file (`options.json`) created in the above steps:

```bash
dcos package install {{ model.serviceName }} --options=options.json
```

The Alertmanager configurations defined in the repository will be automatically loaded when the service finishes deploying.

## Triggering a reload of Alertmanager configurations

It is possible to trigger a reload of the Alertmanager configurations after the service is installed.

```bash
dcos monitoring plan start reload-alertmanager-config
```

## Testing Slack alerts

You can test that Alertmanager is configured correctly by sshing to the node on which Alertmanager is running and manually hitting the Alertmanager endpoint to trigger an alert.
Alertmanager should route the alert to the Slack channel you configured it to notify.

```sh
curl -H "Content-Type: application/json" -d '[{"labels":{"alertname":"TestAlert1"}}]' localhost:9093/api/v1/alerts
```

Check the `#prometheus-alerts` Slack channel (or whatever channel configured to receive alerts) and an alert called `TestAlert1` should show up shortly.

![Slack alert example](../../../img/alertmanager-slack-alert.png)

Navigating to `https://<CLUSTER_URL>/service/{{ model.serviceName }}/alertmanager/#/alerts` should also show the alert.