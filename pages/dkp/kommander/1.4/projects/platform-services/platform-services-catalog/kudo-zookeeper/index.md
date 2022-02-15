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

#include /dkp/kommander/1.4/include/kudo-intro.tmpl

It is **strongly recommended** to view the [KUDO Zookeeper Documentation](https://github.com/kudobuilder/operators/tree/master/repository/zookeeper/docs/latest) which covers the KUDO Zookeeper Operator in-depth. This document covers the integration aspects of KUDO Zookeeper Operator with D2iQ Kommander.

### Kommander Catalog

KUDO Zookeeper is located in the Kommander Catalog.
#include /dkp/kommander/1.4/include/kommander-catalog-drilldown.tmpl

### Installation

From the [Project Catalog](/dkp/kommander/1.4/projects/platform-services/), select the desired version of Zookeeper and click Deploy.

Here is an example of what should appear in the Kommander UI, the dialog is populated with appropriate defaults:

![Zookeeper Service Install Configuration](/dkp/kommander/1.4/img/platform-services-zookeeper-config-dialog.png)

- The **ID** field above is referred to as the Zookeeper `instance` by KUDO.
- [Detailed parameter descriptions](https://github.com/kudobuilder/operators/blob/master/repository/zookeeper/operator/params.yaml) and defaults are available for each version of KUDO Zookeeper Operator, in this case version `3.4.14-3`

Select `Deploy` to install Zookeeper.

- Kommander will proceed to install `kudo-controller-manager` in the `kudo-system` namespace if it does not already exist. This is the equivalent of issuing `kubectl kudo init` manually on the CLI.
- KUDO will then install Zookeeper in the Project namespace created using Kommander.
- The deployment progression can be viewed by looking at the `deploy` plan.

### KUDO Zookeeper Service Status

The Operator Plan Status provides an overview of the service.

At this point it is useful to have an understanding of [KUDO Operator Plans](https://kudo.dev/docs/what-is-kudo.html#operator-plans) and the [KUDO CLI](https://kudo.dev/docs/cli/installation.html) should be installed.

- Get the instances running in the project namespace.

#include /dkp/kommander/1.4/include/kudo-zookeeper-instance.tmpl

- Get the Plan status from the KUDO Zookeeper Operator.

#include /dkp/kommander/1.4/include/kudo-zookeeper-plans.tmpl

- A `deploy` plan status of `COMPLETE` indicates that KUDO Zookeeper has deployed successfully and is healthy.

If any issues are encountered during the above, refer to the [Troubleshooting](#troubleshooting) section.

### Available Parameters

The complete list of KUDO Zookeeper Parameters can be found under [detailed parameter descriptions](https://github.com/kudobuilder/operators/blob/master/repository/zookeeper/operator/params.yaml).

The current parameters set can be retrieved using the kubectl command with the two additional tools:

- [jq](https://stedolan.github.io/jq)
- [yq](https://mikefarah.gitbook.io/yq)

To retrieve the current parameters, use the following command in the terminal with appropriate `INSTANCE` value set:

```sh
INSTANCE=zookeeper;
kubectl -n test-project-zc6tc get instances -o json | jq ".items[] | select(.metadata.name == \"$INSTANCE\") | .spec.parameters" | yq -e --yaml-output '.' > zookeeper-params.yml
```

The above command generates a file called `zookeeper-params.yml` with the current values of all the parameters in effect for the `zookeeper` instance.

### Updating Parameters

Parameters can be updated using arguments to the KUDO CLI.

**Example**: Increasing Zookeeper node counts

- Increase the number of nodes using the KUDO CLI:

**NOTE**: As mentioned in the [ZooKeeper Getting Started Guide](), a minimum of three servers are required for a fault tolerant clustered setup, and it is strongly recommended that you have an odd number of servers.

```sh
kubectl kudo update --instance zookeeper -p NODE_COUNT=5 -n test-project-zc6tc
```

- Monitor the KUDO Zookeeper deployment plan:

```sh
kubectl kudo plan status --instance zookeeper -n test-project-zc6tc
```

- Wait for the deployment plan to have a status of `COMPLETE`

When the deployment plan is `COMPLETE`, there should be 5 nodes as seen by the number of pods running:

```sh
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

```sh
kubectl kudo update -n test-project-zc6tc --instance=zookeeper -P zookeeper-params.yml 
```

Wait for the deployment plan to `COMPLETE` as shown in the node counts example.

### Limitations

The following parameters are treated as immutable by the operator after an instance has been deployed; any modifications to them will trigger the `not-allowed` plan:

- `DISK_SIZE`
- `STORAGE_CLASS`

While modifying the KUDO Zookeeper parameter for `DISK_SIZE` is not permitted, users can resize the associated [PVC](https://kubernetes.io/blog/2018/07/12/resizing-persistent-volumes-using-kubernetes/).
Switching between persistent & ephemeral storage classes is not supported for `STORAGE_TYPE`.

### External Access

KUDO Zookeeper creates two Kubernetes Services:

- [Client Service (CS)](https://github.com/kudobuilder/operators/blob/master/repository/zookeeper/operator/templates/services.yaml#L20-L34)
    - This service is intended for clients to connect to the Zookeeper service.
    - The port used is set by the `CLIENT_PORT` parameter which defaults to `2181`
    - This service endpoint has the format `<id>-cs.<namespace>:<client_port>/<zNode>` such as `zookeeper-cs.test-project-zc6tc:2181/myZNode`
- [High Availability Services (HS)](https://github.com/kudobuilder/operators/blob/master/repository/zookeeper/operator/templates/services.yaml#L1-L18)
    - This service is intended for Zookeeper servers to communicate with their quorum in [replicated mode](https://zookeeper.apache.org/doc/current/zookeeperStarted.html)
    - The port used to listen to request from other servers in the quorum is set by the `SERVER_PORT` parameter which defaults to `2888`.
    - The port used by Zookeeper to perform a leader election is set by the `ELECTION_PORT` parameter which defaults to `3888`.
    - This service endpoint has the format `<id>-hs.<namespace>:<port>` such as `zookeeper-cs.test-project-zc6tc:2888` or `zookeeper-cs.test-project-zc6tc:3888`

Below, we demonstrate how to connect a client to KUDO Zookeeper, the reader will need to have `zkCli` installed from [Apache Zookeeper](https://zookeeper.apache.org/releases.html)

List the available services in the project namespace created by Kommander:

```sh
$ kubectl -n test-project-zc6tc get services
NAME           TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)             AGE
zookeeper-cs   ClusterIP   10.0.38.117   <none>        2181/TCP            8m52s
zookeeper-hs   ClusterIP   None          <none>        2888/TCP,3888/TCP   8m52s
```

Port-forward the `zookeeper-cs` service:

```sh
$ kubectl port-forward service/zookeeper-cs 2181:2181 -n test-project-zc6tc
Forwarding from 127.0.0.1:2181 -> 2181
Forwarding from [::1]:2181 -> 2181
```

Connect to the KUDO Zookeeper via `zkCli`

```sh
$ bin/zkCli.sh -server 127.0.0.1:2181
[...output omitted...]
Welcome to ZooKeeper!
2021-04-15 01:12:31,978 [myid:127.0.0.1:2181] - INFO  [main-SendThread(127.0.0.1:2181):ClientCnxn$SendThread@1171] - Opening socket connection to server localhost/127.0.0.1:2181.
2021-04-15 01:12:31,979 [myid:127.0.0.1:2181] - INFO  [main-SendThread(127.0.0.1:2181):ClientCnxn$SendThread@1173] - SASL config status: Will not attempt to authenticate using SASL (unknown error)
2021-04-15 01:12:31,996 [myid:127.0.0.1:2181] - INFO  [main-SendThread(127.0.0.1:2181):ClientCnxn$SendThread@1005] - Socket connection established, initiating session, client: /127.0.0.1:38166, server: localhost/127.0.0.1:2181
JLine support is enabled
2021-04-15 01:12:32,113 [myid:127.0.0.1:2181] - INFO  [main-SendThread(127.0.0.1:2181):ClientCnxn$SendThread@1438] - Session establishment complete on server localhost/127.0.0.1:2181, session id = 0x200021ea3ed0003, negotiated timeout = 30000

WATCHER::

WatchedEvent state:SyncConnected type:None path:null
[zk: 127.0.0.1:2181(CONNECTED) 0]
[zk: 127.0.0.1:2181(CONNECTED) 0] ls /
[zookeeper]
```

### Troubleshooting

KUDO provides the ability to collect logs and other [diagnostics data](https://kudo.dev/docs/cli/examples.html#collecting-diagnostic-data) for debugging and for bug-reports.

```sh
kubectl kudo diagnostics collect --instance zookeeper -n test-project-zc6tc
```

The diagnostics data contains the following:

KUDO Environment

- Installed Manager and its logs.
- Service account and services.

Data for the specified Operator

- The Operator, OperatorVersion and Instance resources.
- Deployed resources from the operator.
- Logs from deployed pods

To monitor all the events occurring in the namespace, it is helpful to look at event log:

```sh
kubectl get events -w -n test-project-zc6tc
```
