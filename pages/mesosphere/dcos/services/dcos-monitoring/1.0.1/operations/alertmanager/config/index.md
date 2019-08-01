---
layout: layout.pug
navigationTitle: Managing Alertmanager Configurations
title: Managing Alertmanager Configurations
menuWeight: 20
excerpt: Enabling and configuring Alertmanager
render: mustache
model: ../../../data.yml
---

# Enabling Alertmanager

Alertmanager is off by default.
There is no default configuration that the Alertmanager is automatically run with.
To enable Alertmanager, the {{ model.techName }} service must be configured to load the Alertmanager configurations from a Git repository.
See the [Alertmanager documentation](https://prometheus.io/docs/alerting/configuration/) to learn how to create the configuration file.

## Save Alertmanager configurations

The Alertmanager configuration file (YAML format) must be named `config.yml`.
You should save `config.yml` as well as all template files in a Git repository.
Assume that the repository is `https://github.com/company/alertmanager-configs`.

You can put `config.yml` and template files in a subfolder in the repository.
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
If the Git repository is private, you must configure the credentials to access the Git repository.

## Create secrets for Git repository credentials

If the Git repository containing the Alertmanager configurations is private, you must configure the secrets first.
Currently, the following Auth types are supported.

<p class="message--important"><strong>IMPORTANT: </strong>If the Git repository contains submodules, all the submodules must use the same Auth type as what is used for the repository. For example, if HTTP Auth is configured for the Git repository, all of the submodules in the repository's `.gitmodules` file must use the `https` URL scheme.</p>

### HTTP Auth

```bash
dcos security secrets create --value=<GITHUB_USERNAME> githubusername-secret
dcos security secrets create --value=<GITHUB_PASSWORD> githubpassword-secret
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
        "username_secret": "githubusername-secret",
        "password_secret": "githubpassword-secret"
      }
    }
  }
}
```

### SSH Auth

```bash
dcos security secrets create -f <PATH_TO_PRIVATE_KEY> gitsshkey-secret
```

For GitHub, you must add the [Deployment Key](https://developer.github.com/v3/guides/managing-deploy-keys/#deploy-keys) (that is, the public key) to the repository.

Create a custom option file (`options.json`) like the following.

```json
{
  "alertmanager": {
    "config_repository": {
      "url": "git@github.com:company/alertmanager-configs",
      "path": "/production",
      "credentials": {
        "deploy_key_secret": "gitsshkey-secret"
      }
    }
  }
}
```

<p class="message--note"><strong>NOTE: </strong>You will have to use `git@github.com:<USER>/<REPO>.git` instead of `https` as the scheme of the URL.</p>

## Secrets in the Alertmanager configuration file

Instead of putting plain text secrets in the configuration file, you can save the secrets in the secret store, and the service will automatically configure the global default values in the Alertmanager configuration file.

The following secrets in the configuration file are supported:

### Slack API URL (Webhook URL)

The service will automatically add the following global default value for `slack_api_url` in the configuration file.

```yaml
global:
- slack_api_url: '<SLACK_API_URL>'
```

Then, you need to save the secret in the secret store.

```bash
dcos security secrets create --value=<SLACK_API_URL> slackapiurl-secret
```

When installing the service, you must configure the `secrets` section to point to the secret created.
You may omit the `credentials` section if the Git repository is public.

```json
{
  "alertmanager": {
    "secrets": {
      "slack_api_url": "slackapiurl-secret"
    },
    "config_repository": {
      "url": "https://github.com/company/alertmanager-configs",
      "path": "/production",
      "credentials": {
        "username_secret": "githubusername-secret",
        "password_secret": "githubpassword-secret"
      }
    }
  }
}
```

## Install {{ model.techName }} service

Install the service using the custom options file `options.json` that you've created:

```bash
dcos package install {{ model.serviceName }} --options=options.json
```

The Alertmanager configurations defined in the repository will be automatically loaded when the service finishes deploying.

## Triggering a reload of Alertmanager configurations

It is possible to trigger a reload of the Alertmanager configurations after the service is installed.

```bash
dcos monitoring plan start reload-alertmanager-config
```
