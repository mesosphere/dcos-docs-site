---
layout: layout.pug
navigationTitle: KUDO Cassandra
render: mustache
model: /dkp/kommander/1.3/data.yml
title: KUDO Cassandra
menuWeight: 3
excerpt: Day 2 Operations of KUDO Cassandra
beta: false
enterprise: false
---

<!-- markdownlint-disable MD018 -->

## Release Notes
The [Release Notes](#Release-Notes) section highlights any notable changes for each version.

## KUDO Cassandra

Kommander Catalog adds integration for [KUDO Cassandra Operator](https://github.com/kudobuilder/operators/tree/master/repository/cassandra/3.11), which simplifies day 2 operations of [Apache Cassandra](https://cassandra.apache.org/). 

#include /dkp/kommander/1.3/include/kudo-intro.tmpl

It is **strongly recommended** to view the [KUDO Cassandra Documentation](https://kudo.dev/docs/runbooks/cassandra/installing.html) which covers the KUDO Cassandra Operator in-depth. This document covers the integration aspects of KUDO Cassandra Operator with D2iQ Kommander.

### Kommander Catalog

KUDO Cassandra is located in the Kommander Catalog.
#include /dkp/kommander/1.3/include/kommander-catalog-drilldown.tmpl

### Installation

From the [Project Catalog](/dkp/kommander/1.3/projects/platform-services/) select the desired version of Cassandra and click Deploy.

Here is an example of what should appear in the Kommander UI, the dialog is populated with sensible defaults:

![Cassandra Service Install Configuration](/dkp/kommander/1.3/img/platform-services-cassandra-config-dialog.png)

- The **ID** field above is referred to as the Cassandra `instance` by KUDO.
- [Detailed parameter descriptions](https://github.com/mesosphere/kudo-cassandra-operator/blob/v3.11.7-1.0.3/operator/params.yaml) and defaults are availabe for each version of KUDO Cassandra Operator, in this case version `3.11.7-1`

Select `Deploy` to install Cassandra.

- Kommander will proceed to install `kudo-controller-manager` in the `kudo-system` namespace if it does not already exist. This is the equivalent of issuing `kubectl kudo init` manually on the CLI.
- KUDO will then install Cassandra in the Project namespace created via Kommander.
- The deployment progression can be viewed by looking at the `deploy` plan.

### KUDO Cassandra Service Status

The Operator Plan Status provides an overview of the service.

At this point its useful to have an understanding of [KUDO Operator Plans](https://kudo.dev/docs/what-is-kudo.html#operator-plans) and the [KUDO CLI](https://kudo.dev/docs/cli/installation.html) should be installed.

- Get the instances running in the project namespace.

#include /dkp/kommander/1.3/include/kudo-cassandra-instance.tmpl

- Get the Plan status from the KUDO Cassandra Operator.

#include /dkp/kommander/1.3/include/kudo-cassandra-plans.tmpl

- A `deploy` plan status of `COMPLETE` indicates that KUDO Cassandra has deployed successfully and is healthy.

If any issues are encountered during the above, the [Troubleshooting](#Troubleshooting) section has guidance.

### Available Parameters

The complete list of KUDO Cassandra Parameters can be found under [detailed parameter descriptions](https://github.com/mesosphere/kudo-cassandra-operator/blob/v3.11.6-1.0.0/operator/params.yaml).


The current set of parameters set can be reterived using the kubectl command with the two additional tools:
- [jq](https://stedolan.github.io/jq)
- [yq](https://mikefarah.gitbook.io/yq)

To retrive the current parameters, issue the following command in the terminal with appropriate `INSTANCE` value set:
```
INSTANCE=cassandra;
kubectl get instances -o json | jq ".items[] | select(.metadata.name == \"$INSTANCE\") | .spec.parameters" | yq -e --yaml-output '.' > cassandra-params.yml
```

The above command generates a file called `cassandra-params.yml` with the current values of all the parameters in effect for the `cassandra` instance.

### Updating Parameters

Parameters can be updated via aruments to the KUDO CLI.

**Example**: Increasing Cassandra node counts
- Increase the number of nodes via the KUDO CLI:
```
kubectl -n test-project-zc6tc kudo update --instance cassandra -p NODE_COUNT=4
```
- Monitor the KUDO Cassandra deployment plan:
```
kubectl kudo plan status --instance cassandra -n test-project-zc6tc
```
- Wait for the deployment plan to have a status of `COMPLETE`


When the deployment plan is `COMPLETE` there should be 4 nodes as seen by the number of pods running:
```
kubectl get pods -n test-project-zc6tc
NAME               READY   STATUS    RESTARTS   AGE
cassandra-node-0   1/1     Running   0          62m
cassandra-node-1   1/1     Running   0          62m
cassandra-node-2   1/1     Running   0          61m
cassandra-node-3   1/1     Running   0          8m13s
```

**Example**: Updating multiple parameters:

To update multiple paramters at once, its recommended to submit the updated parameters via the KUDO CLI.

See [Available Parameters](#available-parameters) to get the full list of current parameters as a file.

Apply the desired updates in `cassandra-params.yml` via the KUDO CLI:
```
kubectl kudo update --instance=cassandra -P cassandra-params.yml 
```
Wait for the deployment plan to `COMPLETE` as shown in the Cassandra node counts example.

### Upgrades

KUDO Cassandra versions can be upgraded using the KUDO CLI.

**Example** Upgrade KUDO Cassandra from `v3.11.6-1` to `v3.11.7-1`:
```
kubectl kudo upgrade cassandra --instance cassandra --operator-version 1.0.2 
```

Wait and monitor the deployment plan to become `COMPLETE`.


### Monitoring
### External Access
### Backup & Repair
### Decommissioning
### Troubleshooting