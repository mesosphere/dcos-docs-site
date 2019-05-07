---
layout: layout.pug
navigationTitle: Grafana Dashboard Configurations
title: Grafana Dashboard Configurations
menuWeight: 20
excerpt: Automatically loading Grafana dashboard configurations
render: mustache
model: ../../../data.yml
---

#include /services/include/beta-software-warning.tmpl

# Automatically loading Grafana dashboard configurations

The {{ model.techName }} service can be configured to automatically load Grafana dashboard configurations from a Git repository.

## Save Grafana dashboard configurations

You should save your Grafana dashboard configurations (JSON format) in a Git repository.
Assume that the repository is `https://github.com/company/dashboard-configs`.

You can put the Grafana dashboard configurations in a subfolder in the repository.
For instance, `https://github.com/company/dashboard-configs/production`.

```json
{
  "grafana": {
    "dashboard_config_repository": {
      "url": "https://github.com/company/dashboard-configs",
      "path": "/production"
    }
  }
}
```

The Git repository can be either public or private.
If the Git repository is private, you will need to configure the credentials to access the Git repository (see below).

<p class="message--note"><strong>NOTE:</strong> If enabled, the set of default dashboards shipped with the service is from the Mesosphere-maintained Git repository `https://github.com/dcos/grafana-dashboards`.
These dashboards are updated with {{ model.techName }} service releases.
If you would like to use the most up-to-date version of these dashboards that has not yet been released, you can configure the repository url to point to `https://github.com/dcos/grafana-dashboards`.
The `grafana.default_dashboards` option should be set to `false`.
As it is a public repository, there is no need to set up the `credentials`.</p>

```json
{
  "grafana": {
    "default_dashboards": false,
    "dashboard_config_repository": {
      "url": "https://github.com/dcos/grafana-dashboards",
      "path": "/dashboards"
    }
  }
}
```

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
You can omit the `credentials` section if the Git repository is public.

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

## Install {{ model.techName }} service

Then, install the service:

```bash
dcos package install {{ model.serviceName }} --options=options.json
```

The Grafana dashboards defined in the repository will be automatically loaded when the service finishes deploying.
You can go to the Grafana UI to verify.

## Triggering a reload of Grafana dashboard configurations

It is possible to trigger a reload of the Grafana dashboard configurations after the service is installed.

```bash
dcos {{ model.serviceName }} plan start reload-grafana-dashboard-configs
```
