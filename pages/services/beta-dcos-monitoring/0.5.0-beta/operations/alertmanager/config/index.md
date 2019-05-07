---
layout: layout.pug
navigationTitle: Managing Alert Manager Configurations
title: Managing Alert Manager Configurations
menuWeight: 20
excerpt: Enabling and configuring Alert Manager
render: mustache
model: ../../../data.yml
---

#include /services/include/beta-software-warning.tmpl

# Enabling Alert Manager

Alert Manager is off by default.
There is no default configuration that the Alert Manager is automatically run with.
To enable Alert Manager, the {{ model.techName }} service must be configured to load the Alert Manager configurations from a Git repository.

## Save Alert Manager configurations

You should save your Alert Manager configuration file (YAML format), as well as all template files in a Git repository.
Assume that the repository is `https://github.com/company/alertmanager-configs`.

You can put the configuration file and template files in a subfolder in the repository.
For instance, `https://github.com/company/alertmanager-configs/production`.

```json
{
  "alertmanager": {
    "config_repository": {
      "url": "https://github.com/company/alertmanager-configs",
      "path": "/production"
    }
  }
}
```

The Git repository can be either public or private.
You can omit the `credentials` section if the Git repository is public.
If the Git repository is private, you will need to configure the credentials to access the Git repository.

## Create secrets for Git repository credentials

If the Git repository containing the Alert Manager configurations is private, you will need to configure the secrets first.
Currently, the following Auth types are supported.

### HTTP Auth

```bash
dcos security secrets create --value=<GITHUB_USERNAME> githubusername
dcos security secrets create --value=<GITHUB_PASSWORD> githubpassword
```

For GitHub, the password can be the API token.

Create a custom option file (`options.json`) like the following.

```json
{
  "alertmanager": {
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

### SSH Auth

```bash
dcos security secrets create -f <PATH_TO_PRIVATE_KEY> gitsshkey
```

For Github, please make sure to add the [Deployment Key](https://developer.github.com/v3/guides/managing-deploy-keys/#deploy-keys) (that is, the public key) to the repository.

Create a custom option file (`options.json`) like the following.

```json
{
  "alertmanager": {
    "config_repository": {
      "url": "git@github.com:company/alertmanager-configs",
      "path": "/production",
      "credentials": {
        "deploy_key": "gitsshkey"
      }
    }
  }
}
```

Note that you'll have to use `git@github.com:<USER>/<REPO>.git` instead of `https` as the scheme of the URL.

## Secrets in Alert Manager configuration file

Instead of putting plain text secrets in the configuration file, you can save the secrets in the secret store, and the service will automatically configure the global default value in the Alert Manager configuration file.

The following secrets in the configuration file are supported:

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

When installing the service, you must configure the `secrets` section to point to the secret created.

## Install {{ model.techName }} service

Create a custom option file (`options.json`) like the following.
You may omit the `credentials` section if the Git repository is public.

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
dcos package install {{ model.serviceName }} --options=options.json
```

The Alert Manager configurations defined in the repository will be automatically loaded when the service finishes deploying.

## Triggering a reload of Alert Manager configurations

It is possible to trigger a reload of the Alert Manager configurations after the service is installed.

```bash
dcos {{ model.serviceName }} plan start reload-alertmanager-config
```
