---
layout: layout.pug
navigationTitle: KUDO Zookeeper
render: mustache
title: KUDO Zookeeper
menuWeight: 3
excerpt: Day 2 Operations of Apache Zookeeper
beta: false
---

<!-- markdownlint-disable MD018 -->
## KUDO Zookeeper

Kommander Catalog adds integration for [KUDO Zookeeper Operator](https://github.com/kudobuilder/operators/tree/master/repository/zookeeper), which simplifies day 2 operations of [Apache Zookeeper](https://zookeeper.apache.org/). 

#include /dkp/kommander/1.3/include/kudo-intro.tmpl

It is **strongly recommended** to view the [KUDO Zookeeper Documentation](https://github.com/kudobuilder/operators/tree/master/repository/zookeeper/docs/latest) which covers the KUDO Zookeeper Operator in-depth. This document covers the integration aspects of KUDO Zookeeper Operator with D2iQ Kommander.

### Kommander Catalog

KUDO Zookeeper is located in the Kommander Catalog.
#include /dkp/kommander/1.3/include/kommander-catalog-drilldown.tmpl

### Installation
From the [Project Catalog](/dkp/kommander/1.3/projects/platform-services/) select the desired version of Zookeeper and click Deploy.

Here is an example of what should appear in the Kommander UI, the dialog is populated with sensible defaults:

![Zookeeper Service Install Configuration](/dkp/kommander/1.3/img/platform-services-zookeeper-config-dialog.png)

- The **ID** field above is referred to as the Zookeeper `instance` by KUDO.
- [Detailed parameter descriptions](https://github.com/kudobuilder/operators/blob/master/repository/zookeeper/operator/params.yaml) and defaults are availabe for each version of KUDO Zookeeper Operator, in this case version `3.4.14-3`

Select `Deploy` to install Zookeeper.

- Kommander will proceed to install `kudo-controller-manager` in the `kudo-system` namespace if it does not already exist. This is the equivalent of issuing `kubectl kudo init` manually on the CLI.
- KUDO will then install Zookeeper in the Project namespace created using Kommander.
- The deployment progression can be viewed by looking at the `deploy` plan.

### KUDO Zookeeper Service Status

The Operator Plan Status provides an overview of the service.

At this point it is useful to have an understanding of [KUDO Operator Plans](https://kudo.dev/docs/what-is-kudo.html#operator-plans) and the [KUDO CLI](https://kudo.dev/docs/cli/installation.html) should be installed.

- Get the instances running in the project namespace.

#include /dkp/kommander/1.3/include/kudo-zookeeper-instance.tmpl

- Get the Plan status from the KUDO Zookeeper Operator.

#include /dkp/kommander/1.3/include/kudo-zookeeper-plans.tmpl

 - A `deploy` plan status of `COMPLETE` indicates that KUDO Zookeeper has deployed successfully and is healthy.

If any issues are encountered during the above, refer to the [Troubleshooting](#Troubleshooting) section.

### Available Parameters

The complete list of KUDO Zookeeper Parameters can be found under [detailed parameter descriptions](https://github.com/kudobuilder/operators/blob/master/repository/zookeeper/operator/params.yaml).


The current parameters set can be reterived using the kubectl command with the two additional tools:
- [jq](https://stedolan.github.io/jq)
- [yq](https://mikefarah.gitbook.io/yq)

To retrive the current parameters, issue the following command in the terminal with appropriate `INSTANCE` value set:
```
INSTANCE=zookeeper;
kubectl -n test-project-zc6tc get instances -o json | jq ".items[] | select(.metadata.name == \"$INSTANCE\") | .spec.parameters" | yq -e --yaml-output '.' > zookeeper-params.yml
```

The above command generates a file called `zookeeper-params.yml` with the current values of all the parameters in effect for the `zookeeper` instance.

### Updating Parameters
Parameters can be updated using arguments to the KUDO CLI.

**Example**: Increasing Zookeper node counts
- Increase the number of nodes using the KUDO CLI:
```
kubectl kudo update --instance zookeeper -p NODE_COUNT=5 -n test-project-zc6tc
```
- Monitor the KUDO Cassandra deployment plan:
```
kubectl kudo plan status --instance zookeeper -n test-project-zc6tc
```
- Wait for the deployment plan to have a status of `COMPLETE`

When the deployment plan is `COMPLETE` there should be 5 nodes as seen by the number of pods running:
```
$ kubectl get pods -n test-project-zc6tc
NAME                    READY   STATUS    RESTARTS   AGE
zookeeper-zookeeper-0   1/1     Running   0          37s
zookeeper-zookeeper-1   1/1     Running   0          2m47s
zookeeper-zookeeper-2   1/1     Running   0          3m48s
zookeeper-zookeeper-3   1/1     Running   0          5m15s
zookeeper-zookeeper-4   1/1     Running   0          5m15s
```

**Example**: Updating multiple parameters:

To update multiple parameters at once, it is recommended to submit the updated parameters using the KUDO CLI.

See [Available Parameters](#available-parameters) to get the full list of current parameters as a file.

Apply the desired updates in `zookeeper-params.yml` using the KUDO CLI:
```
kubectl kudo update -n test-project-zc6tc --instance=zookeeper -P zookeeper-params.yml 
```
Wait for the deployment plan to `COMPLETE` as shown in the node counts example.

### Upgrades

KUDO Zookeeper versions can be upgraded using the KUDO CLI.

**Example** Upgrade KUDO Zookeeper from `v3.4.14-2` to `v3.4.14-3`:
```
kubectl kudo upgrade zookeeper -n test-project-zc6tc --instance zookeeper --operator-version 1.0.2 
```
Wait and monitor the deployment plan to become `COMPLETE`.


### Monitoring
### External Access
### Backup & Repair
### Decommissioning Kafka Brokers
### Troubleshooting