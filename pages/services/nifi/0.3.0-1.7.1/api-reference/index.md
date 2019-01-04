---
layout: layout.pug
navigationTitle:  API Reference
title: API Reference
menuWeight: 90
excerpt: DC/OS NiFi Service API Reference
featureMaturity:
enterprise: false
---

<!-- {% raw %} disable mustache templating in this file: retain nifid examples as-is -->
<!-- Editor: why? -->


The DC/OS NiFi Service implements a REST API that may be accessed from outside the cluster. The <dcos_url> parameter referenced below indicates the base URL of the DC/OS cluster on which the DC/OS Apache NiFfi Service is deployed.

<a name="#rest-auth"></a>
# REST API Authentication
REST API requests must be authenticated. This authentication is only applicable for interacting with the DC/OS Apache NiFi REST API directly. You do not need the token to access the Apache NiFi nodes themselves.

If you are using Enterprise DC/OS, follow these instructions to [create a service account](../security/serviceaccountdetail.md) and an [authentication token](https://docs.mesosphere.com/1.10/security/ent/service-auth/custom-service-auth/). You can then configure your service to automatically refresh the authentication token when it expires.

Once you have the authentication token, you can store it in an environment variable and reference it in your REST API calls:

```shell
export auth_token=uSeR_t0k3n
```

The `curl` examples in this document assume that an auth token has been stored in an environment variable named `auth_token`.

If you are using Enterprise DC/OS, the security mode of your installation may also require the `--ca-cert` flag when making REST calls. Refer to [Obtaining and passing the DC/OS certificate in Curl requests](https://docs.mesosphere.com/1.10/security/ent/tls-ssl/ca-trust-curl/) for information on how to use the `--cacert` flag. [If your security mode is `disabled`](https://docs.mesosphere.com/1.10/security/ent/secrets/seal-store/), do not use the `--ca-cert` flag.

# Plan API
The Plan API provides endpoints for monitoring and controlling service installation and configuration updates.


## List plans
You may list the configured plans for the service. By default, all services at least have a deploy plan and a recovery plan. Some services may have additional custom plans defined.

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/plans
```

```shell
dcos nifi --name=nifi plan list
```

## View plan
You may view the current state of a listed plan:

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/plans/<plan>
```

The CLI may be used to show a formatted tree of the plan (default), or the underlying JSON data as retrieved from the above HTTP endpoint:

```shell
dcos nifi --name=nifi plan show <plan>
```

```shell
dcos nifi --name=nifi plan show <plan> --json
```


## Pause plan

The installation will pause after completing installation of the current node and wait for user input before proceeding further.

```shell
curl -X POST -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/plans/deploy/interrupt
```

```shell
dcos nifi --name=nifi plan pause deploy
```

## Resume plan

The REST API request below will resume installation at the next pending node.

```shell
curl -X PUT <dcos_surl>/service/nifi/v1/plans/deploy/continue
```

```shell
dcos nifi --name=nifi plan continue deploy
```

# Connection API

```shell
curl -H "Authorization:token=$auth_token" dcos_url/service/nifi/v1/endpoints/<endpoint>
```

You will see a response similar to the following:

```json
{
  "address": [
    "10.0.1.120:1025",
    "10.0.1.128:1025"
  ],
  "dns": [
    "nifi-0-node.nifi.autoip.dcos.thisdcos.directory:1025",
    "nifi-1-node.nifi.autoip.dcos.thisdcos.directory:1025"
  ],
  "vip": "node.nifi.l4lb.thisdcos.directory:8080"
}
```

The contents of the endpoint response contain details sufficient for clients to connect to the service.

# Nodes API

The pod API provides endpoints for retrieving information about nodes, restarting them, and replacing them.

## List Nodes

A list of available node ids can be retrieved by sending a GET request to `/v1/pod`:

CLI Example

```shell
dcos nifi pod list
```

HTTP Example

```shell
curl  -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/pod
```

You will see a response similar to the following:

```json
[
  "nifi-0",
  "nifi-1"
]
```

## Node Info

You can retrieve node information by sending a GET request to `/v1/pod/<node-id>/info`:


CLI Example

```shell
dcos nifi pod info nifi-0
```

HTTP Example

```shell
curl  -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/pod/nifi-0/info
```

You will see a response similar to the following:

```json
[ {
  "info" : {
    "name" : "nifi-0-backup",
    "taskId" : {
      "value" : ""
    },
    "slaveId" : {
      "value" : "c1617568-e1b1-4885-a71b-2ef2607f33c2-S2"
    },
    "resources" : [ {
...
```

## Replace a Node

The replace endpoint can be used to replace a node with an instance running on another agent node.

CLI Example

```shell
dcos nifi pod replace <node-id>
```

HTTP Example

```shell
curl -X POST -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/pod/<node-id>/replace
```

If the operation succeeds, a `200 OK` is returned.

## Restart a Node

The restart endpoint can be used to restart a node in place on the same agent node.

CLI Example

```shell
dcos nifi pod restart <node-id>
```

HTTP Example

```shell
curl -X POST -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/pod/<node-id>/restart
```

If the operation succeeds a `200 OK` is returned.

## Pause a Node
The pause endpoint can be used to relaunch a node in an idle command state for debugging purposes.

CLI example

```shell
dcos nifi --name=nifi debug pod pause <node-id>
```

HTTP Example

```shell
curl -X POST -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/pod/<node-id>/pause
```


# Configuration API

The configuration API provides an endpoint to view current and previous configurations of the cluster.

## View Target Config

You can view the current target configuration by sending a GET request to `/v1/configurations/target`.

CLI Example

```shell
dcos nifi config target
```

HTTP Example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/configurations/target
```

You will see a response similar to the following:

```json
{
  "name" : "nifi",
  "role" : "nifi-role",
  "principal" : "nifi-principal",
  "web-url" : null,
  "zookeeper" : "master.mesos:2181",
  "pod-specs" : [ {
...
```

## List Configs

You can list all configuration IDs by sending a GET request to `/v1/configurations`.

CLI Example

```shell
dcos nifi config list
```

HTTP Example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/configurations
```

You will see a response similar to the following:

```json
["29bf852c-7e17-48ba-ac8e-84634fb99f86"]
```

## View Specified Config

You can view a specific configuration by sending a GET request to `/v1/configurations/<config-id>`.

CLI Example

```shell
dcos nifi config show 29bf852c-7e17-48ba-ac8e-84634fb99f86
```

HTTP Example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/configurations/29bf852c-7e17-48ba-ac8e-84634fb99f86
```

You will see a response similar to the following:

```json
{
  "name" : "nifi",
  "role" : "nifi-role",
  "principal" : "nifi-principal",
  "web-url" : null,
  "zookeeper" : "master.mesos:2181",
...
```

# Service Status Info
Send a GET request to the `/v1/state/properties/suppressed` endpoint to learn if DC/OS Apache NiFi is in a `suppressed` state and not receiving offers. If a service does not need offers, Mesos can "suppress" it so that other services are not starved for resources.
You can use this request to troubleshoot: if you think DC/OS Apache NiFi should be receiving resource offers, but is not, you can use this API call to see if DC/OS Apache NiFi is suppressed.

```shell
curl -H "Authorization: token=$auth_token" "<dcos_url>/service/nifi/v1/state/properties/suppressed"
```

# Apache NiFi Node Operations
These operations provide access to the NiFi cluster node using the available NiFi REST Api. The Rest Api provides programmatic access to command and control a NiFi instance in real time. You can see the [NiFi REST Api](https://nifi.apache.org/docs/nifi-docs/rest-api/index.html) for more about the available Api.


## List NiFi Cluster Summary

CLI Example
```shell
dcos nifi cluster summary
```

HTTP Example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/cluster/
```


## List NiFi Node

CLI Example
```shell
dcos nifi node list
```

HTTP Example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/nodes/
```

## List NiFi Node for a status

CLI Example
```shell
dcos nifi node status <nifi_node_status>
```

HTTP Example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/nodes/status/<nifi_node_status>
```

## Details of a NiFi Node

CLI Example
```shell
dcos nifi node <nifi_node_id>
```

HTTP Example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/nodes/<nifi_node_id>
```


## Remove a NiFi Node

CLI Example
```shell
dcos nifi node remove <nifi_node_id>
```

HTTP Example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/nodes/remove/<nifi_node_id>
```



## Control NiFi Node using GET endpoint
All NiFi [endpoints](https://nifi.apache.org/docs/nifi-docs/rest-api/index.html) uses GET method can be accessed from either the DC/OS CLI or HTTP.

CLI Example
```shell
dcos nifi api get <nifi_get_endpoints_uri>
```

HTTP Example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/nifi-api/get?uri=<nifi_get_endpoints_uri>
```

## Control NiFi Node using POST endpoint
All NiFi [endpoints](https://nifi.apache.org/docs/nifi-docs/rest-api/index.html) uses POST method can be accessed from either the DC/OS CLI or HTTP.

CLI Example
```shell
dcos nifi api post <nifi_post_endpoints_uri> stdin
{
  "id": "",
  "service": ""
}
```

OR

```shell
dcos nifi api post <nifi_post_endpoints_uri> <json_payload_file>
```


HTTP Example

```shell
curl -X POST -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/nifi-api/post?uri=<nifi_post_endpoints_uri>
{
  "id": "",
  "service": ""
}
```

## Control NiFi Node using PUT endpoint
All NiFi [endpoints](https://nifi.apache.org/docs/nifi-docs/rest-api/index.html) using the PUT method can be accessed from either the DC/OS CLI or HTTP.

CLI Example
```shell
dcos nifi api put <nifi_put_endpoints_uri> stdin
{
  "id": "",
  "service": ""
}
```

OR

```shell
dcos nifi api post <nifi_put_endpoints_uri> <json_payload_file>
```


HTTP Example

```shell
curl -X PUT -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/nifi-api/put?uri=<nifi_put_endpoints_uri>
{
  "id": "",
  "service": ""
}
```


## Control NiFi Node using DELETE endpoint
All NiFi [endpoints](https://nifi.apache.org/docs/nifi-docs/rest-api/index.html) using the DELETE method can be accessed from either the DC/OS CLI or HTTP.

CLI Example
```shell
dcos nifi api delete <nifi_delete_endpoints_uri>
```

HTTP Example

```shell
curl -X DELETE -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/nifi-api/delete?uri=<nifi_delete_endpoints_uri>
```
