---
layout: layout.pug
navigationTitle: Install
title: Install
menuWeight: 3
excerpt: Getting started with Kommander
---

## Prerequisites

Kommander 2 ships in a Helm chart, so prior to installing Kommander, make Helm aware of the Helm repository providing the Kommander chart:

```sh
helm repo add kommander https://mesosphere.github.io/kommander/charts
helm repo up
```

## Install on kind

Prior to installing Kommander, you must know:

- The version you'd like to install, which is provided by D2iQ.
- The Docker network that kind is using (for configuring the MetalLB load balancer). Use the command below to find this information:

```sh
docker network inspect kind -f '{{with index .IPAM.Config 0}}{{.Subnet}}{{end}}'
```

The subnet is usually 172.18.0.0/16. With that subnet, you run the following command to install Kommander:

```sh
helm install -n kommander --create-namespace kommander-bootstrap kommander/kommander-bootstrap --devel --version=v2.0.0-beta.0 --set metallb.enabled=true,metallb.addresses=172.18.255.200-172.18.255.250,metallb.existingConfigMap=metallb-dev-config
```

## Install on Konvoy 2

A Konvoy 2 cluster already has a load balancer installed, you don't need to enable MetalLB:

```sh
helm install -n kommander --create-namespace kommander-bootstrap kommander/kommander-bootstrap --devel --version=v2.0.0-beta.0
```

## Verify installation

After Helm successfully installed the chart, you need to wait for all HelmReleases to become ready. The output must look similar to this:

```sh
$ k get helmreleases -A
NAMESPACE   NAME                    READY   STATUS                             AGE
kommander   cert-manager            True    Release reconciliation succeeded   9m41s
kommander   dex                     True    Release reconciliation succeeded   7m3s
kommander   dex-k8s-authenticator   True    Release reconciliation succeeded   7m3s
kommander   kommander               True    Release reconciliation succeeded   7m3s
kommander   kommander-ui            True    Release reconciliation succeeded   7m3s
kommander   kube-oidc-proxy         True    Release reconciliation succeeded   7m3s
kommander   kube-prometheus-stack   True    Release reconciliation succeeded   7m3s
kommander   kubecost                True    Release reconciliation succeeded   7m3s
kommander   kubefed                 True    Release reconciliation succeeded   7m3s
kommander   kubernetes-dashboard    True    Release reconciliation succeeded   7m3s
kommander   metallb                 True    Release reconciliation succeeded   7m3s
kommander   prometheus-adapter      True    Release reconciliation succeeded   7m3s
kommander   reloader                True    Release reconciliation succeeded   7m3s
kommander   traefik                 True    Release reconciliation succeeded   7m3s
kommander   traefik-forward-auth    True    Release reconciliation succeeded   7m3s
```

## Access Kommander Web UI

After all HelmReleases have become ready, you retrieve the URL for accessing Kommander's Web interface using kubectl:

```sh
   kubectl -n kommander get svc kommander-traefik -o go-template='https://{{with index .status.loadBalancer.ingress 0}}{{or .hostname .ip}}{{end}}/dkp/kommander/dashboard{{ "\n"}}'
```

The username and password are stored on the cluster:

```sh
   kubectl -n kommander get secret dkp-credentials -o go-template='Username: {{.data.username|base64decode}}{{ "\n"}}Password: {{.data.password|base64decode}}{{ "\n"}}'
```
