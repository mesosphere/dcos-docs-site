---
layout: layout.pug
navigationTitle: Federated Addons
title: Federated Addons
menuWeight: 7
excerpt: A description of how federated addons work
---

## Addons federation

When attaching a cluster, Kommander federates certain addons on the newly attached cluster. To customize the federation of the logging and monitoring stacks, operators can use federation labels on addons.

On attachment, two factors impact if an addon is deployed or not on the attached cluster:
1. Is the attached cluster a Konvoy cluster or not (e.g. a cluster deployed using AWS EKS)?
2. Does a label regarding the federation of the addon exist and has it been set? If yes, what is its value?

The tables below describe the list of addons and cluster addons that get federated on attachment with its related federation label (if available). Addons that do not have a federation label are federated by default. If an addon is described as only federated on non-Konvoy clusters, it will not get installed even if its federation label is set to `true`.

Currenrly, the monitoring stack will be federated by default and the logging stack will not. This is why `prometheus` is the only addon federated by default with a federation label to disable it if needed.

### Setting federation labels

#### Using the UI

Follow the documentation regarding [attaching a cluster](/ksphere/kommander/latest/clusters/attach-cluster/). You can add labels at the bottom of the attachment form, use the federation labels described in the tables below as keys and the values `true` or `false` if you wish to customize the federation of the addons. The addons that do not have a related federation label cannot get their federation enabled or disabled this way.

#### Creating a new KommanderCluster

If you want to federate a cluster by creating a new `KommanderCluster` object in your Kommander cluster, the federation labels should be set in the field `metadata/labels`.

## Federated addons

| Name | Federated by default | Federation label | Only federated on non-Konvoy clusters |
|------------|----------------|----------------|----------------|
| dashboard-kommander-override | True | | False |
| elasticsearch | False | `kommander.mesosphere.io/federate-elasticsearch` | True |
| elasticsearch-curator | False | `kommander.mesosphere.io/federate-elasticsearch-curator` | True |
| elasticsearchexporter | False | `kommander.mesosphere.io/federate-elasticsearchexporter` | True |
| fluentbit | False | `kommander.mesosphere.io/federate-fluentbit` | True |
| kibana | False | `kommander.mesosphere.io/federate-kibana` | True |
| kube-oidc-proxy-kommander | True | | False |
| opsportal-addons-kommander-overrides | True | | False |
| prometheus | True | `kommander.mesosphere.io/federate-prometheus` | True |
| reloader | True | | True |
| traefik-forward-auth-kommander | True | | False |

## Federated cluster addons

| Name | Federated by default | Federation label | Only federated on non-Konvoy clusters |
|------------|----------------|----------------|----------------|
- cert-manager | True | | True |
- kubecost | True | | False |
- traefik | True | | True |
