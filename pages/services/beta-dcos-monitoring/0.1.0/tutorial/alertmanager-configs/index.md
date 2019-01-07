---
layout: layout.pug
navigationTitle: Alert Manager Configurations
title: Alert Manager Configurations
menuWeight: 10
excerpt: Automatically loading Alert Manager configurations.
---

# Automatically loading Alert Manager configurations

The DC/OS Monitoring service can be configured to automatically load Alert Manager configurations from a git repository.

## Save Alert Manager configurations

You should save your Alert Manager configuration file (YAML format), as well as all template files in a git repository.
Assume that the repository is `https://github.com/company/alertmanager-configs`.

You may put the configuration file and template files in a subfolder in the repository.
For instance, `https://github.com/company/alertmanager-configs/production`.

The git repository can be either public or private.
If the git repository is private, you will need to configure the credentials to access the git repository (see below).

## Create secrets for git repository credentials

If the git repository containing the Alert Manager configurations is private, you will need to configure the secrets first:

```bash
dcos security secrets create --value=<GITHUB_USERNAME> githubusername
dcos security secrets create --value=<GITHUB_PASSWORD> githubpassword
```

For github, the password can be the API token.

## Secrets in Alert Manager configuration file

Instead of putting plain text secrets in the configuration file, you can save the secrets in the secret store, and the service will automatically configure the global default value in the Alert Manager configuration file.

Currently, the following secrets in the configuration file are supported:

### Slack API URL

The service will automatically add the following global default value for `slack_api_url` in the configuration file.

```yaml
global:
- slack_api_url: '<SLACK_API_URL>'
```

Then, you need to save the secret in the secret store.

```bash
dcos security secrets create --value=<SLACK_API_URL> slackapiurl
```

When installing the service, you need to configure the `secrets` section to point to the secret created (see below).

## Install DC/OS Monitoring service

Now, create a custom option file (`options.json`) like the following.
You may omit the `credentials` section if the git repository is public.

```json
{
  "alertmanager": {
    "secrets": {
      "slack_api_url": "slackapiurl"
    },
    "config_repository": {
      "url": "https://github.com/company/alertmanager-configs",
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

The Alert Manager configurations defined in the repository will be automatically loaded when the service finishes deploying.
