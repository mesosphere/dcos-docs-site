---
layout: layout.pug
navigationTitle:
title: API Reference
menuWeight: 60
excerpt: Apache ZooKeeper API reference guide
featureMaturity:
enterprise: false
---

<!-- https://github.com/mesosphere/dcos-zookeeper/ -->


<!-- {% raw %} disable mustache templating in this file: retain templated examples as-is -->

The DC/OS Apache Zookeeper Service implements a REST API that can be accessed from outside the cluster. The <dcos_url> parameter referenced below indicates the base URL of the DC/OS cluster on which the DC/OS Apache Zookeeper Service is deployed.

<a name="#rest-auth"></a>
# REST API Authentication
REST API requests must be authenticated. This authentication is only applicable for interacting with the DC/OS Apache Zookeeper REST API directly. You do not need the token to access the Apache Zookeeper nodes themselves.

If you are using Enterprise DC/OS, follow these instructions to [create a service account and an authentication token](/1.10/security/service-auth/custom-service-auth/). You can then configure your service to automatically refresh the authentication token when it expires. To get started more quickly, you can also [get the authentication token without a service account](/1.9/security/iam-api/), but you will need to manually refresh the token.

If you are using open source DC/OS, follow these instructions to [pass your HTTP API token to the DC/OS endpoint](https://dcos.io/docs/latest/security/iam-api/).

Once you have the authentication token, you can store it in an environment variable and reference it in your REST API calls:

```shell
export auth_token=uSeR_t0k3n
```

The `curl` examples in this document assume that an auth token has been stored in an environment variable named `auth_token`.

If you are using Enterprise DC/OS, the security mode of your installation may also require the `--cacert` flag when making REST calls. Refer to [Obtaining and passing the DC/OS certificate in cURL requests](/1.10/security/tls-ssl/#get-dcos-cert) for information on how to use the `--cacert` flag. If your security mode is disabled, do not use the `--ca-cert` flag.

# Plan API
The Plan API provides endpoints for monitoring and controlling service installation and configuration updates.

Use the `/plans` endpoint to list the plans configured for the service.

## List plans

### HTTP example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/kafka-zookeeper/v1/plans/
```

### CLI example

```shell
dcos beta-kafka-zookeeper plan list
```

## Plan status

Add the name of the plan to your API request to see the status of a particular plan.

### HTTP example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/kafka-zookeeper/v1/plans/deploy
```

### CLI example

```shell
dcos beta-kafka-zookeeper plan status deploy
```

**Tip:** To view the full JSON from the CLI, pass the `--json` flag.

## Start installation

Begin installing a new plan.

### HTTP example

```shell
curl -X POST -H "Authorization:token=$auth_token" <dcos_url>/service/kafka-zookeeper/v1/plans/deploy/start
```

### CLI example

```shell
dcos beta-kafka-zookeeper plan start deploy
```

## Pause installation

The installation will pause after completing installation of the current node and wait for user input.

### HTTP example

```shell
curl -X POST -H "Authorization:token=$auth_token" <dcos_url>/service/kafka-zookeeper/v1/plans/deploy/interrupt
```

### CLI example

```shell
dcos beta-kafka-zookeeper plan pause deploy
```

## Resume installation

The REST API request below will resume installation at the next pending node.

### HTTP example

```shell
curl -X PUT -H "Authorization:token=$auth_token" <dcos_surl>/service/kafka-zookeeper/v1/plans/deploy/continue
```

### CLI example

```shell
dcos beta-kafka-zookeeper plan resume deploy
```

# Connection API

## List endpoints

List all available endpoints.

### HTTP example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/kafka-zookeeper/v1/endpoints/
```

### CLI example

```shell
dcos beta-kafka-zookeeper endpoints
```

## Display endpoints

Display information about a particular endpoint. The contents of the endpoint response contain details sufficient for clients to connect to the service.

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/kafka-zookeeper/v1/endpoints/clientport
```

```shell
dcos beta-kafka-zookeeper endpoints clientport
```

# Nodes API

The pod API provides endpoints for retrieving information about nodes, restarting them, and replacing them.

## List Nodes

A list of available node ids can be retrieved by sending a GET request to `/v1/pod`:

### HTTP Example

```shell
curl  -H "Authorization:token=$auth_token" <dcos_url>/service/kafka-zookeeper/v1/pod
```

### CLI Example

```shell
dcos beta-kafka-zookeeper pod list
```

## Node Info

You can retrieve node information by sending a GET request to `/v1/pod/<node-id>/info`:

### HTTP example

```shell
curl  -H "Authorization:token=$auth_token" <dcos_url>/service/kafka-zookeeper/v1/pod/<node-id>/info
```

### CLI Example

```shell
dcos beta-kafka-zookeeper pod info zookeeper-0
```

HTTP Example

```shell
curl  -H "Authorization:token=$auth_token" <dcos_url>/service/kafka-zookeeper/v1/pod/zookeeper-0/info
```
## Replace a Node

The replace endpoint can be used to replace a node with an instance running on another agent node.

### HTTP Example

```shell
curl -X POST -H "Authorization:token=$auth_token" <dcos_url>/service/kafka-zookeeper/v1/pod/<node-id>/replace
```

### CLI Example

```shell
dcos beta-kafka-zookeeper pod replace <node-id>
```

If the operation succeeds, a `200 OK` is returned.

## Restart a Node

The restart endpoint can be used to restart a node in place on the same agent node.

### HTTP Example

```shell
curl -X POST -H "Authorization:token=$auth_token" <dcos_url>/service/kafka-zookeeper/v1/pod/<node-id>/restart
```

### CLI Example

```shell
dcos beta-kafka-zookeeper pod restart <node-id>
```

If the operation succeeds a `200 OK` is returned.

# Configuration API

The configuration API provides an endpoint to view current and previous configurations of the cluster.

## View Target Config

You can view the current target configuration by sending a GET request to `/v1/configurations/target`.

### HTTP Example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/kafka-zookeeper/v1/configurations/target
```

### CLI Example

```shell
dcos beta-kafka-zookeeper config target
```

## List Configs

You can list all configuration IDs by sending a GET request to `/v1/configurations`.

### HTTP Example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/kafka-zookeeper/v1/configurations
```

### CLI Example

```shell
dcos beta-kafka-zookeeper config list
```

## View Specified Config

You can view a specific configuration by sending a GET request to `/v1/configurations/<config-id>`.

### HTTP Example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/kafka-zookeeper/v1/configurations/9a8d4308-ab9d-4121-b460-696ec3368ad6
```

### CLI Example

```shell
dcos beta-kafka-zookeeper config show 9a8d4308-ab9d-4121-b460-696ec3368ad6
```

# Service Status Info
Send a GET request to the `/v1/state/properties/suppressed` endpoint to learn if DC/OS Apache Zookeeper is in a `suppressed` state and not receiving offers. If a service does not need offers, Mesos can "suppress" it so that other services are not starved for resources.

You can use this request to troubleshoot: if you think DC/OS Apache Zookeeper should be receiving resource offers, but is not, you can use this API call to see if DC/OS Apache Zookeeper is suppressed.

### HTTP example

```shell
curl -H "Authorization: token=$auth_token" "<dcos_url>/service/kafka-zookeeper/v1/state/properties/suppressed"
```

### CLI example

```shell
dcos beta-kafka-zookeeper debug state property suppressed
```
