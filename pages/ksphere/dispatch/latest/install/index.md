---
layout: layout.pug
navigationTitle:  Installation
title: Dispatch Installation
menuWeight: 2
excerpt: Installation
---

# Dispatch installation

## Install Tiller

To install Dispatch, ensure you have a cluster with Tiller installed (if you are using a Konvoy cluster, you are already set):

```
kubectl create serviceaccount -n kube-system tiller
kubectl create clusterrolebinding tiller --clusterrole=cluster-admin --serviceaccount=kube-system:tiller
helm init --wait --service-account tiller
```

## Install Dispatch into a Cluster

To install Dispatch with metrics support into a kubernetes cluster, such as Konvoy, which has Prometheus installed by default, run the following command:
```bash
dispatch init --set global.prometheus.enabled=true --set global.prometheus.release=prometheus-kubeaddons
```

Set `--namespace` to install Dispatch into a namespace other than `dispatch`. If you want to restrict the namespaces that Dispatch has access to, set the `--watch-namespace` flag for each namespace Dispatch should have access to.

*NOTE : `prometheus-kubeaddons` is the default value for `release` label when creating a konvoy cluster. In a customized konvoy installation where prometheus is configured to match a different `release` label, dispatch can be configured to be installed with the same custom label.* 

To install Dispatch into a kubernetes cluster that does not have prometheus running or metrics support for Dispatch is not required, run:
```bash
dispatch init
```

This will take several minutes, but your Dispatch cluster will be fully ready for use once it is completed.

### Setup Monitoring for Dispatch

Grafana dashboards can be found in [dashboards](./dashboards) folder which can be imported in grafana UI.

In order to view the dispatch component logs from Kibana UI, query syntax can be used. For example: 

To view `event-sink` pod logs:
```json
{
  "query": {
    "match": {
      "kubernetes.labels.component": {
        "query": "event-sink",
        "type": "phrase"
      }
    }
  }
}
```

To view `repository-controller` pod logs:
```json
{
  "query": {
    "match": {
      "kubernetes.labels.component": {
        "query": "repository-controller",
        "type": "phrase"
      }
    }
  }
}
```

## Setup Github Credentials

Create a [Personal Access Token](https://github.com/settings/tokens) for your
Github account. You need to specify the following permissions:

* FULL access to `repo`: used to download your code whether public or private,
  report build status to your commits, etc.
* FULL access to `admin:repo_hook`: used to register webhooks to report events
  to the Dispatch build server.

After creating the token, remember the secret value. Replace `$YOURGITHUBTOKEN`
with token secret value in the following command:

```
dispatch login github --user $YOURGITHUBUSERNAME --token $YOURGITHUBTOKEN
```

This token is primarily used for managing Dispatch webhooks.

## Setup Git SSH credentials

During Alpha, it is necessary to manually configure SSH credentials for accessing Git. In Beta, we will automate this process using the Github token you already setup.

Generate an SSH key pair:

```
ssh-keygen -t ed25519 -f dispatch.pem
```

This generates two files:

* The SSH private key `dispatch.pem` (never copy or share this file anywhere you
  don't trust).
* The SSH public key `dispatch.pem.pub` which corresponds to the `dispatch.pem`
  private key file. This file is safe to copy or share publicly.

Add the SSH public key to your GitHub account:

* Visit https://github.com/settings/keys
* Click "New SSH key".
* Give the key an appropriate title like "Dispatch test 1".
* Run `cat ./dispatch.pem.pub` in your terminal, copy the output, and paste it in the "Key" text box on the page.
* Click "Add SSH key".

Now that we've registered our SSH public key with GitHub, we add the
corresponding SSH private key to Dispatch:

```
dispatch login git ./dispatch.pem
```

## Setup Docker Credentials

To load Docker registry credentials from `~/.docker/config.json`, run `login docker` with no arguments:

```
dispatch login docker
```

Otherwise supply the path to a Docker configuration file:

```
dispatch login docker /path/to/config.json
```

## Next steps

At this point, you've successfully configured your Dispatch installation. Next,
you will add a new application to Dispatch CI. To do so, please follow the steps
at [Setting up a repository to use Dispatch](./repo-setup.md).
