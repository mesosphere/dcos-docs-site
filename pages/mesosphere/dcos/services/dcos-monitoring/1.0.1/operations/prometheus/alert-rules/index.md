---
layout: layout.pug
navigationTitle: Alert Rules
title: Alert Rules
menuWeight: 30
excerpt: Managing alert rules configurations
render: mustache
model: ../../../data.yml
---

# Overview

Alerting is supported in the {{ model.techName }} service via [Prometheus Alertmanager](https://prometheus.io/docs/alerting/alertmanager/).
The {{ model.techName }} service is automatically configured for Prometheus to talk to Alertmanager.
See the [Alertmanager documentation](../../alertmanager/) for instructions on how to configure and turn on Alertmanager.

This page explains how to load Prometheus alert rules used for alerting.
See the [Prometheus documentation](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/) for instructions on how to define these rules.

# Automatically loading Prometheus alert rules

The {{ model.techName }} service can be configured to automatically load Prometheus alert rules from a Git repository.

## Save Prometheus alert rules

You should save your Prometheus alert rules (YAML format) in a Git repository.
Assume that the repository is `https://github.com/company/alert-rules`.

You can put the alert rules in a subfolder in the repository.
For instance, `https://github.com/company/alert-rules/production`.

```json
{
  "prometheus": {
    "alert_rules_repository": {
      "config_repository": {
        "url": "https://github.com/company/alert-rules",
        "path": "/production"
      }
    }
  }
}
```

<p class="message--important"><strong>IMPORTANT: </strong>Make sure that each of the alert rule files has suffix `.yml` and is a direct child of the subfolder (i.e., not nested under another subfolder).</p>

The Git repository can be either public or private.
If the Git repository is private, you will need to configure the credentials to access the Git repository (see below).

<p class="message--note">
<strong>NOTE:</strong> Mesosphere maintains a Git repository with Prometheus alerting rule configurations at `https://github.com/dcos/prometheus-alert-rules`.
If you would like to use these preconfigured Prometheus alerting rules, you should set `prometheus.alert_rules_repository.config_repository.url` to `https://github.com/dcos/prometheus-alert-rules` and `prometheus.alert_rules_repository.config_repository.path` to `/rules`.
As it is a public repository, there is no need to set up the `credentials`.
</p>

```json
{
  "prometheus": {
    "alert_rules_repository": {
      "config_repository": {
        "url": "https://github.com/dcos/prometheus-alert-rules",
        "path": "/rules"
      }
    }
  }
}
```

## Create secrets for Git repository credentials

If the Git repository containing the alert rules is private, you will need to configure the secrets first.
Currently, the following Auth types are supported.

<p class="message--important"><strong>IMPORTANT: </strong>If the Git repository contains submodules, all the submodules must use the same Auth type as what is used for the repository. For example, if HTTP Auth is configured for the Git repository, all of the submodules in the repository's `.gitmodules` file must use the `https` URL scheme.</p>

### HTTP Auth

```bash
dcos security secrets create --value=<GITHUB_USERNAME> githubusername-secret
dcos security secrets create --value=<GITHUB_PASSWORD> githubpassword-secret
```

For GitHub, the password can be the API token.

Create a custom option file (`options.json`) like the following.
You may omit the `credentials` section if the Git repository is public.

```json
{
  "prometheus": {
    "alert_rules_repository": {
      "url": "https://github.com/company/alert-rules",
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

For GitHub, you must add the [Deployment Key](https://developer.github.com/v3/guides/managing-deploy-keys/#deploy-keys) (i.e., the public key) to the repository.

Create a custom option file (`options.json`) like the following.

```json
{
  "prometheus": {
    "alert_rules_repository": {
      "url": "git@github.com:company/alert-rules.git",
      "path": "/production",
      "credentials": {
        "deploy_key_secret": "gitsshkey-secret"
      }
    }
  }
}
```

<p class="message--note"><strong>NOTE: </strong>You will have to use `git@github.com:<USER>/<REPO>.git` instead of `https` as the scheme of the URL.</p>

## Fetching from a branch in a Git repository

By default, the service will fetch from the master branch (that is, `refs/heads/master`) of the Git repository.

If you want to fetch the alert rules from another branch in a Git repository, you can set the `reference_name` field:

```json
{
  "prometheus": {
    "alert_rules_repository": {
      "url": "https://github.com/company/alert-rules",
      "path": "/production",
      "reference_name": "refs/heads/my_branch"
    }
  }
}

```

## Install {{ model.techName }} service

Then, install the service:

```bash
dcos package install {{ model.serviceName }} --options=options.json
```

The Prometheus alert rules defined in the repository will be automatically loaded when the service finishes deploying.
You can go to the Prometheus UI to verify.

## Triggering a reload of Prometheus alert rules

It is possible to trigger a reload of the Prometheus alert rules after the service is installed.

```bash
dcos monitoring plan start reload-prometheus-alert-rules
```
