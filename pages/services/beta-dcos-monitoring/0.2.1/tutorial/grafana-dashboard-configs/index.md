---
layout: layout.pug
navigationTitle: Grafana Dashboard Configurations
title: Grafana Dashboard Configurations
menuWeight: 10
excerpt: Automatically loading Grafana dashboard configurations.
---

# Automatically loading Grafana dashboard configurations

The DC/OS Monitoring service can be configured to automatically load Grafana dashboard configurations from a Git repository.

## Save Grafana dashboard configurations

You should save your Grafana dashboard configurations (JSON format) in a Git repository.
Assume that the repository is `https://github.com/company/dashboard-configs`.

You may put the Grafana dashboard configurations in a subfolder in the repository.
For instance, `https://github.com/company/dashboard-configs/production`.

The Git repository can be either public or private.
If the Git repository is private, you will need to configure the credentials to access the Git repository (see below).

## Create secrets for Git repository credentials

If the Git repository containing the Grafana dashboard configurations is private, you will need to configure the secrets first.
Currently, the following Auth types are supported.

### HTTP Auth

```bash
dcos security secrets create --value=<GITHUB_USERNAME> githubusername
dcos security secrets create --value=<GITHUB_PASSWORD> githubpassword
```

For Github, the password can be the API token.

Create a custom option file (`options.json`) like the following.
You may omit the `credentials` section if the Git repository is public.

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

### SSH Auth

```bash
dcos security secrets create -f <PATH_TO_PRIVATE_KEY> gitsshkey
```

For Github, please make sure to add [Deployment Key](https://developer.github.com/v3/guides/managing-deploy-keys/#deploy-keys) (i.e., the public key) to the repository.

Create a custom option file (`options.json`) like the following.

```json
{
  "grafana": {
    "dashboard_config_repository": {
      "url": "git@github.com:company/dashboard-configs.git",
      "path": "/production",
      "credentials": {
        "deploy_key": "gitsshkey"
      }
    }
  }
}
```

Note that you'll have to use `git@github.com:<USER>/<REPO>.git` instead of `https` as the scheme of the URL.

## Fetching from a branch in a Git repository

By default, the service will fetch from the master branch (that is, `refs/heads/master`) of the Git repository.

If you want to fetch the Grafana dashboard configurations from another branch in a Git repository, you can set the `reference_name` field:

```json
{
  "grafana": {
    "dashboard_config_repository": {
      "url": "https://github.com/company/dashboard-configs",
      "path": "/production",
      "reference_name": "refs/heads/my_branch"
    }
  }
}

```

## Install DC/OS Monitoring service

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
