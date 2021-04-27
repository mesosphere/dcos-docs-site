---
layout: layout.pug
navigationTitle: KUDO Kafka
render: mustache
title: KUDO Kafka
menuWeight: 3
excerpt: Day 2 Operations of KUDO Kafka
beta: false
---

<!-- markdownlint-disable MD018 -->
## KUDO Kafka

Kommander Catalog adds integration for [KUDO Kafka Operator](https://github.com/mesosphere/kudo-kafka-operator/), which simplifies day 2 operations of [Apache Kafka](https://kafka.apache.org/). 

#include /dkp/kommander/1.3/include/kudo-intro.tmpl

It is **strongly recommended** to view the [KUDO Kafka Documentation](https://kudo.dev/docs/runbooks/kafka/install.html) which covers the KUDO Kafka Operator in-depth. This document covers the integration aspects of KUDO Kafka Operator with D2iQ Kommander.

### Kommander Catalog

KUDO Kafka is located in the Kommander Catalog. To access the catalog: 
#include /dkp/kommander/1.3/include/kommander-catalog-drilldown.tmpl

### Zookeeper

Apache Kafka has a dependency on [Apache Zookeeper](https://zookeeper.apache.org/). The Kommander Catalog includes [KUDO Zookeeper](/dkp/kommander/1.3/projects/platform-services/platform-services-catalog/kudo-zookeeper/) to be used in conjunction with KUDO Kafka.

The `ZOOKEEPER_URI` parameter configures which Zookeeper cluster to use.
- KUDO Zookeeper uses the following format: `<id>-cs.<namespace>:<client_port>`
- With `zookeeper` launched in the namespace `test-project-zc6tc` we have this as the `ZOOKEEPER_URI`: `zookeeper-cs.test-project-zc6tc:2181`

The `ZOOKEEPER_PATH` parameter configures the zNode path within the Zookeeper Cluster to use.
- When unspecified the zNode defaults to the id of the current Kafka instance being launched.
- When specified a mandatory leading slash is needed i.e `/kafka`

### Installation

From the [Project Catalog](/dkp/kommander/1.3/projects/platform-services/) select the desired version of Kafka and click Deploy.

Below is an example of what should appear in the Kommander UI.  The dialog is populated with sensible defaults:

![Kafka Service Install Configuration](/dkp/kommander/1.3/img/platform-services-kafka-config-dialog.png)

- The **ID** field above is referred to as the Kafka `instance` by KUDO.
- [Detailed parameter descriptions](https://github.com/mesosphere/kudo-kafka-operator/blob/v2.5.1-1.3.3/operator/params.yaml) and defaults are available for each version of KUDO Kafka Operator, in this case version `2.5.1-1.3.3`

Select `Deploy` to install Kafka.

- Kommander will proceed to install `kudo-controller-manager` in the `kudo-system` namespace if it does not already exist. This is the equivalent of issuing `kubectl kudo init` manually on the CLI.
- KUDO will then install Kafka in the Project namespace created using Kommander.
- The deployment progression can be viewed by looking at the `deploy` plan.

### KUDO Kafka Service Status

The Operator Plan Status provides an overview of the service.

At this point, it is useful to have an understanding of [KUDO Operator Plans](https://kudo.dev/docs/what-is-kudo.html#operator-plans) and the [KUDO CLI](https://kudo.dev/docs/cli/installation.html) should be installed.

- Get the instances running in the project namespace.

#include /dkp/kommander/1.3/include/kudo-kafka-instance.tmpl

- Get the Plan status from the KUDO Kafka Operator.

#include /dkp/kommander/1.3/include/kudo-kafka-plans.tmpl

- A `deploy` plan status of `COMPLETE` indicates that KUDO Kafka has deployed successfully and is healthy.

If any issues are encountered during the above, refer to the [Troubleshooting](#Troubleshooting) section.

### Available Parameters

The complete list of KUDO Kafka Parameters can be found under [detailed parameter descriptions](https://github.com/kudobuilder/operators/blob/master/repository/kafka/operator/params.yaml).

The current parameter set can be retrieved using the kubectl command in conjunction with two additional tools:
- [jq](https://stedolan.github.io/jq)
- [yq](https://mikefarah.gitbook.io/yq)

To retrieve the current parameters, issue the following command in the terminal with appropriate `INSTANCE` value set:
```
INSTANCE=kafka;
kubectl get instances -o json | jq ".items[] | select(.metadata.name == \"$INSTANCE\") | .spec.parameters" | yq -e --yaml-output '.' > kafka-params.yml
```

The above command generates a file called `kafka-params.yml` with the current values of all the parameters in effect for the `kafka` instance.

### Updating Parameters

Parameters can be updated using arguments to the KUDO CLI.

**Example**: Increasing Kafka broker counts
- Increase the number of nodes using the KUDO CLI:
```
kubectl kudo update --instance kafka -p BROKER_COUNT=4 -n test-project-zc6tc
```
- Monitor the KUDO Cassandra deployment plan:
```
kubectl kudo plan status --instance kafka -n test-project-zc6tc
```
- Wait for the deployment plan to have a status of `COMPLETE`


When the deployment plan is `COMPLETE` there should be 4 nodes as seen by the number of pods running:
```
$ kubectl get pods -n test-project-zc6tc
NAME                    READY   STATUS    RESTARTS   AGE
kafka-kafka-0           2/2     Running   0          12m
kafka-kafka-1           2/2     Running   0          11m
kafka-kafka-2           2/2     Running   0          11m
kafka-kafka-3           2/2     Running   0          77s
zookeeper-zookeeper-0   1/1     Running   0          28m
zookeeper-zookeeper-1   1/1     Running   0          28m
zookeeper-zookeeper-2   1/1     Running   0          28m
```

**Example**: Updating multiple parameters:

To update multiple parameters at once, it is recommended to submit the updated parameters using the KUDO CLI.

See [Available Parameters](#available-parameters) to get the full list of current parameters as a file.

Apply the desired updates in `kafka-params.yml` using the KUDO CLI:
```
kubectl kudo update -n test-project-zc6tc --instance=kafka -P kafka-params.yml 
```
Wait for the deployment plan to `COMPLETE` as shown in the Kafka broker counts example.


### Upgrades

KUDO Kafka versions can be upgraded using the KUDO CLI.

**Example** Upgrade KUDO Kafka from `v2.5.0-1.3.1` to `v2.5.1-1.3.3`:
When upgrading, you should understand the mapping between Kafka versions and operator versions. For more information, see the table at the end of the [Kafka operator](https://github.com/mesosphere/kudo-kafka-operator/tree/master/docs) repository.

```
kubectl kudo upgrade kafka --instance kafka --operator-version 1.3.3
```

Wait and monitor the deployment plan to become `COMPLETE`.

### Monitoring

Kommander includes Prometheus and Grafana as part of the federated [Workspace Platform Services](/dkp/kommander/1.3/workspaces/workspace-platform-services) along with [Centralized Monitoring](/dkp/kommander/1.3/centralized-monitoring/).

KUDO Kafka operator can export metrics to Prometheus, to do so set the `METRICS_ENABLED` parameter to `true`:
```
kubectl kudo update -p METRICS_ENABLED=true --instance kafka -n test-project-zc6tc
```
- Each broker bootstraps with the JMX Exporter java agent exposing the metrics at `9094/metrics`, along with a Prometheus Node Exporter sidecar exposing container metrics at `9096/metrics`.
- Adds a port named `metrics` and `ne-metrics` to the Kafka Service.
- Adds a label `kudo.dev/servicemonitor: "true"` for the service monitor discovery.
- Mounts a config map with metrics reporter for the broker container.

Sample Grafana Dashboards can be found in the [monitoring directory](https://github.com/mesosphere/kudo-kafka-operator/blob/master/benchmarks/mwt/setup/03-dashboard-install/dashboard-cm.yaml#L12-L3046).

Grafana dashboards can be [imported](https://grafana.com/docs/grafana/latest/dashboards/export-import/) or recurring dashboards can be defined inline for Kommander to import through [adding custom dashboards](/dkp/kommander/1.3/centralized-monitoring/#adding-custom-dashboards). 

![KUDO Kafka Monitoring](/dkp/kommander/1.3/img/platform-services-kafka-monitoring.png)


### Kafka MirrorMaker

KUDO Kafka comes integrated with [MirrorMaker](https://cwiki.apache.org/confluence/pages/viewpage.action?pageId=27846330)

MirrorMaker is a tool to mirror a source Kafka cluster into a target (mirror) Kafka cluster. This tool uses a Kafka consumer and a Kafka producer. The consumer consumes messages from the source cluster. The producer re-publishes those messages to the target cluster.

MirrorMaker integration is disabled by default, details on how to enable it are found in the [Kafka Operator docs](https://github.com/kudobuilder/operators/blob/master/repository/kafka/docs/latest/mirrormaker.md).

### Kafka Connect

KUDO Kafka comes integrated with [Kafka Connect](https://kafka.apache.org/documentation/#connect).

Kafka Connect is a tool for scalably and reliably streaming data between Apache Kafka and other systems. It provides a REST API to configure and interact connectors.

Kafka Connect integration is disabled by default, details on how to enable it are found in the [Kafka Operator docs](https://github.com/kudobuilder/operators/blob/master/repository/kafka/docs/latest/kafka-connect.md).
### Cruise Control

KUDO Kafka comes integrated with [Cruise Control](https://github.com/linkedin/cruise-control).

Cruise Control is a tool to fully automate the dynamic workload rebalance and self-healing of a Kafka cluster. It provides great value to Kafka users by simplifying the operation of Kafka clusters.

Cruise Control integration is disabled by default, details on how to enable it are found in the [Kafka Operator docs](https://github.com/kudobuilder/operators/blob/master/repository/kafka/docs/latest/cruise-control.md).

### External Access

For Producers and Consumers living outside the Kubernetes cluster, KUDO supports LoadBalancer and NodePort approaches, the LoadBalancer approach is the recommended one.
The [Kafka Operator docs](https://github.com/kudobuilder/operators/blob/master/repository/kafka/docs/latest/external-access.md#external-access) detail to connect to external Producers and Consumers.

### Troubleshooting

KUDO provides the ability to collect logs and other [diagnostics data](https://kudo.dev/docs/cli/examples.html#collecting-diagnostic-data) for debugging and for bug-reports.
```
kubectl kudo diagnostics collect --instance kafka -n test-project-zc6tc
```

The diagnostics data contains the following:

KUDO Environment
- Installed Manager and its logs.
- Service account and services.

Data for the specified Operator
- The Operator, OperatorVersion and Instance resources.
- Deployed resources from the operator.
- Logs from the deployed pods.

To monitor all the events occurring in the namespace, its helpful to look at event log:
```
kubectl get events -w -n test-project-zc6tc
```
