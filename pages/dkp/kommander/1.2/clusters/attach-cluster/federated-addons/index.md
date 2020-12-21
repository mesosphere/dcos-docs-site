---
layout: layout.pug
beta: false
navigationTitle: Federated Addons
title: Federated Addons
menuWeight: 5
excerpt: How federated addons work
---

## Addons federation

When attaching a cluster, Kommander federates certain addons on the newly attached cluster. To customize the federation of the logging and monitoring stacks, operators can apply labels to the associated `KommanderCluster` resource.

On attachment, two factors impact successfully deploying an addon on the attached cluster:

1. Is the attached cluster a Konvoy cluster or not? For example, a cluster deployed using AWS EKS.
2. Does a label describing the federation of the addon exist and is it defined? If yes, what is its value?

The following tables describe the list of addons and cluster addons that get federated on attachment with their related federation label (if available). Addons that do not have a federation label are federated by default. If the addon description indicates only federated on non-Konvoy clusters, the addon will not get installed into Konvoy clusters, even if its federation label is set to `true`.

Currently, the monitoring stack is federated by default and the logging stack is not. This is why `prometheus` is the only addon federated by default with a federation label to disable it if needed.

### Set federation labels

#### Use the UI

See [attaching a cluster](/dkp/kommander/latest/clusters/attach-cluster/) for information. You can add labels at the bottom of the attachment form, use the federation labels described in the following tables as keys and the values `true` or `false` if you wish to customize the federation of the addons. The addons that do not have a related federation label cannot get their federation enabled or disabled this way.

#### Create a new KommanderCluster

If you want to federate a cluster by creating a new `KommanderCluster` object in your Kommander cluster, the federation labels should be set in the field `metadata/labels`.

## Federated addons

| Name                                 | Federated by default | Federation label                                         | Only federated on non-Konvoy clusters |
| ------------------------------------ | -------------------- | -------------------------------------------------------- | ------------------------------------- |
| dashboard-kommander-override         | True                 |                                                          | False                                 |
| elasticsearch                        | False                | `kommander.mesosphere.io/federate-elasticsearch`         | True                                  |
| elasticsearch-curator                | False                | `kommander.mesosphere.io/federate-elasticsearch-curator` | True                                  |
| elasticsearchexporter                | False                | `kommander.mesosphere.io/federate-elasticsearchexporter` | True                                  |
| fluentbit                            | False                | `kommander.mesosphere.io/federate-fluentbit`             | True                                  |
| kibana                               | False                | `kommander.mesosphere.io/federate-kibana`                | True                                  |
| kube-oidc-proxy-kommander            | True                 |                                                          | False                                 |
| opsportal-addons-kommander-overrides | True                 |                                                          | False                                 |
| prometheus                           | True                 | `kommander.mesosphere.io/federate-prometheus`            | True                                  |
| prometheusadapter                    | True                 | `kommander.mesosphere.io/federate-prometheusadapter`     | True                                  |
| reloader                             | True                 |                                                          | True                                  |
| traefik-forward-auth-kommander       | True                 |                                                          | False                                 |

## Federated cluster addons

| Name           | Federated by default | Federation label | Only federated on non-Konvoy clusters |
| -------------- | -------------------- | ---------------- | ------------------------------------- |
| - cert-manager | True                 |                  | True                                  |
| - kubecost     | True                 |                  | False                                 |
| - traefik      | True                 |                  |  True                                 |
