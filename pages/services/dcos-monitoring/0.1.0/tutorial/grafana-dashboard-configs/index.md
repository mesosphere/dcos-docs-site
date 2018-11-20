---
layout: layout.pug
navigationTitle: Grafana Dashboard Configurations
title: Grafana Dashboard Configurations
menuWeight: 10
excerpt: Automatically loading Grafana dashboard configurations.
---

# Automatically loading Grafana dashboard configurations

The DC/OS Monitoring service can be configured to automatically load Grafana dashboard configurations from a git repository.

## Save Grafana dashboard configurations

You should save your Grafana dashboard configurations (JSON format) in a git repository.
Assume that the repository is `https://github.com/company/dashboard-configs`.

You may put the Grafana dashboard configurations in a subfolder in the repository.
For instance, `https://github.com/company/dashboard-configs/production`.

The git repository can be either public or private.
If the git repository is private, you will need to configure the credentials to access the git repository (see below).

## Create secrets for git repository credentials

If the git repository containing the Grafana dashboard configurations is private, you will need to configure the secrets first:

```bash
dcos security secrets create --value=<GITHUB_USERNAME> githubusername
dcos security secrets create --value=<GITHUB_PASSWORD> githubpassword
```

For github, the password can be the API token.

## Install DC/OS Monitoring service

Now, create a custom option file (`options.json`) like the following.
You may omit the `credentials` section if the git repository is public.

```json
{
  "grafana": {
    "dashboard_config_repository": {
      "url": "https://github.com/company/dashboard-configs",
      "path": "/production",
      "credentials": {
        "username": "githubusername",
        "password": "githubpassword"
      }
    }
  }
}
```

Then, install the service:

```bash
dcos package install dcos-monitoring --options=options.json
```

The Grafana dashboards defined in the repository will be automatically loaded when the service finishes deploying.
You can go to the Grafana UI to verify.

## Triggering a reload of Grafana dashboard configurations

It is possible to trigger a reload of the Grafana dashboard configurations after the service is installed.

```bash
dcos dcos-monitoring plan start reload-grafana-dashboard-configs
```
