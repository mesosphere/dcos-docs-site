---
layout: layout.pug
navigationTitle: Install GitLab Enterprise on Konvoy
title: Install GitLab Enterprise on Konvoy
menuWeight: 5
excerpt: Learn how to install GitLab Enterprise on a Konvoy cluster
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

This guide describes how to install [GitLab Enterprise](https://gitlab.com) on Konvoy via the [GitLab Helm chart](https://docs.gitlab.com/charts/), with services exposed over HTTPS, using a self-signed wildcard certificate.

This was tested on Konvoy 0.6 running on AWS, using version 2.1.2 of the GitLab Helm chart.

## Prerequisites

GitLab's services are exposed via name-based virtual servers.
You will need to choose a domain name for each of GitLab, the GitLab registry, and Minio.
This guide will use `gitlab.gitlab.local`, `registry.gitlab.local`, and `minio.gitlab.local`, respectively, and configure DNS by modifying the local `/etc/hosts` file.
You may instead use different domain names, and you may use external DNS to resolve them.
For more on configuring GitLab's domain names, see [here](https://docs.gitlab.com/charts/charts/globals.html#configure-host-settings).

This guide will deploy GitLab with services exposed over HTTPS, using a self-signed wildcard certificate.
You may instead use certmanager and LetsEncrypt to generate signed certificates, or provide your own.
For more on configuring TLS, see [here](https://docs.gitlab.com/charts/installation/tls.html).

## Install

1. Create `gitlab-rails-secret` according to <https://docs.gitlab.com/charts/installation/secrets.html#gitlab-rails-secret>.
   * This is a workaround for <https://gitlab.com/charts/gitlab/issues/1410>, which prevents the GitLab chart from creating this secret automatically.
1. Configure the cluster's internal DNS to resolve your GitLab domains to the Traefik ingress controller.
   Run `kubectl edit -n kube-system configmap/coredns` and add this to CoreDNS config:

   ```coredns
       rewrite name gitlab.gitlab.local traefik-kubeaddons.kubeaddons.svc.cluster.local
       rewrite name registry.gitlab.local traefik-kubeaddons.kubeaddons.svc.cluster.local
       rewrite name minio.gitlab.local traefik-kubeaddons.kubeaddons.svc.cluster.local
   ```

1. Configure your local environment to resolve Gitlab's domain to an external IP for the Traefik ingress controller.
   Run this command to add an entry for `gitlab.gitlab.local` to your `/etc/hosts`:

   ```bash
   echo -e "\n# GitLab on Konvoy\n$(dig +short $(kubectl --namespace=kubeaddons get service traefik-kubeaddons --template='{{(index .status.loadBalancer.ingress 0).hostname}}') | head -1)\tgitlab.gitlab.local" | sudo tee -a /etc/hosts
   ```

1. Create the file `gitlab-values.yaml` containing this chart configuration:

   ```yaml
   global:
     hosts:
       # Our chosen domain that will contain `gitlab`, `registry`, and `minio` subdomains.
       domain: gitlab.local
     ingress:
       # Don't configure certmanager, since we aren't installing it.
       configureCertmanager: false
       annotations:
         # This annotation causes Traefik to create a corresponding frontend for each ingress.
         "kubernetes.io/ingress.class": "traefik"
   gitlab-runner:
     # This secret will contain certificates for the GitLab domains.
     # The GitLab runner will not accept self-signed certificates unless they are included in this secret.
     certsSecretName: gitlab-runner-certs
   certmanager:
     # Don't install certmanager, since we're using a self-signed certificate.
     install: false
   nginx-ingress:
     # Don't install an nginx ingress controller, since we're using Traefik.
     enabled: false
   ```

1. Add the GitLab Helm repo, and install the GitLab Helm chart with your configuration values:

   ```bash
   helm repo add gitlab https://charts.gitlab.io/
   helm repo update
   helm upgrade --install gitlab gitlab/gitlab -f gitlab-values.yaml
   ```

1. Create a secret named `gitlab-runner-certs` that contains certificates for the GitLab domains.
   This is necessary for the GitLab runner to accept self-signed certificates.

   ```bash
   kubectl get secret gitlab-wildcard-tls --template='{{ index .data "tls.crt" }}' | base64 -D > gitlab.crt
   kubectl create secret generic gitlab-runner-certs --from-file=gitlab.gitlab.local.crt=gitlab.crt --from-file=registry.gitlab.local.crt=gitlab.crt --from-file=minio.gitlab.local.crt=gitlab.crt
   ```

   **NOTE:** You may skip this step if you are using valid signed certificates.
   If you skip this step, you must deploy the GitLab Helm chart without the `gitlab-runner.certsSecretName` configuration parameter.
1. Wait for GitLab to finish deploying.
1. Open <https://gitlab.gitlab.local> in a browser.

## Notes

### Admin credentials

The admin username is `root`, and the password is stored in the secret `gitlab-gitlab-initial-root-password`.
To retrieve the admin password, run:

```bash
kubectl get secret gitlab-gitlab-initial-root-password --template='{{ .data.password }}' | base64 -D
```

### Git SSL verification

By default, GitLab CI jobs will verify certificates when checking out a Git project.
Verification will fail if GitLab is using a self-signed certificate.
To disable SSL verification, add this configuration to your project's `.gitlab-ci.yml`:

```yaml
variables:
  GIT_SSL_NO_VERIFY: "1"
```
