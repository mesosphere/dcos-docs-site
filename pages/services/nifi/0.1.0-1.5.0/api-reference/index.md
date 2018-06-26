---
layout: layout.pug
navigationTitle:  API Reference
title: API Reference
menuWeight: 90
excerpt: DC/OS Apache NiFi Service API Reference
featureMaturity:
enterprise: false
---

<!-- {% raw %} disable mustache templating in this file: retain nifid examples as-is -->

The DC/OS Apache NiFi Service implements a REST API that may be accessed from outside the cluster. The `<dcos_url>` parameter referenced below represents the base URL of the DC/OS cluster on which the DC/OS  NiFi Service is deployed.

<a name="#rest-auth"></a>
# REST API Authentication
REST API requests must be authenticated. This authentication only applies to interacting with the DC/OS  NiFi Service REST API directly. You do not need the authentication token to access the Apache NiFi nodes themselves.

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

Use the CLI to display a formatted tree of the plan (default), or the underlying JSON data as retrieved from the HTTP endpoint:

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
curl -X PUT <dcos_url>/service/nifi/v1/plans/deploy/continue
```

```shell
dcos nifi --name=nifi plan continue deploy
```

# Connection API

The contents of the endpoint response contain details sufficient for clients to connect to the service.

```shell
curl -H "Authorization:token=$auth_token" dcos_url/service/nifi/v1/endpoints/<endpoint>
```

You will see a response similar to the following:

<!-- TODO: provide endpoint <endpoint> example (default options) output -->


# Nodes API

The pod API provides endpoints for retrieving information about nodes, restarting them, and replacing them.

## List nodes

A list of available node IDs can be retrieved by sending a GET request to `/v1/pod`:

CLI Example

```shell
dcos nifi pod list
```

HTTP Example

```shell
curl  -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/pod
```

You will see a response similar to the following:

<!-- TODO: provide pod list example (default options) output -->

## Node information

You can retrieve node information by sending a GET request to `/v1/pod/<node-id>/info`:

```shell
curl  -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/pod/<node-id>/info
```

You will see a response similar to the following:

<!-- TODO: using node-0 here, but ensure that the node name matches a Apache Nifi service node type -->

CLI Example

```shell
dcos nifi pod info node-0
```

HTTP Example

```shell
curl  -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/pod/node-0/info
```

You will see a response similar to the following:

<!-- TODO: provide pod <node-id> example (default options) output -->

## Replace a node

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

## Restart a node

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

## Pause a node

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

## View target config

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

<!-- TODO: provide configurations/target example (default options) output -->

## List configurations

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

<!-- TODO: provide configurations example (default options) output -->

## View specific config

You can view a specific configuration by sending a GET request to `/v1/configurations/<config-id>`.

CLI Example

```shell
dcos nifi config show 9a8d4308-ab9d-4121-b460-696ec3368ad6
```

HTTP Example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/configurations/9a8d4308-ab9d-4121-b460-696ec3368ad6
```

You will see a response similar to the target config above.

# Service status info

Send a GET request to the `/v1/state/properties/suppressed` endpoint to learn if DC/OS NiFi Service is in a `suppressed` state and not receiving offers. If a service does not need offers, Mesos can "suppress" it so that other services are not starved for resources.

You can use this request to troubleshoot. If you think DC/OS  NiFi Service should be receiving resource offers, but is not, you can use this API call to see if DC/OS NiFi Service is suppressed.

```shell
curl -H "Authorization: token=$auth_token" "<dcos_url>/service/nifi/v1/state/properties/suppressed"
```

# Apache NiFi Service node operations
These operations provide access to the DC/OS NiFi Service cluster node using the available NiFi REST API. The REST API provides programmatic access to command and control a NiFi instance in real time. You can see the [NiFi REST API](https://nifi.apache.org/docs/nifi-docs/rest-api/index.html) for more about the available API.


## List NiFi cluster summary

CLI Example
```shell
dcos nifi cluster summary
```

HTTP Example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/cluster/
```

## List NiFi node

CLI Example
```shell
dcos nifi node list
```

HTTP Example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/nodes/
```

## List NiFi node for a status

CLI Example
```shell
dcos nifi node status <nifi_node_status>
```

HTTP Example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/nodes/status/<nifi_node_status>
```

## Details of a NiFi node

CLI Example
```shell
dcos nifi node <nifi_node_id>
```

HTTP Example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/nodes/<nifi_node_id>
```


## Remove a NiFi node

CLI Example
```shell
dcos nifi node remove <nifi_node_id>
```

HTTP Example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/nodes/remove/<nifi_node_id>
```

## Control NiFi node using GET endpoint

All Nifi [endpoints](https://nifi.apache.org/docs/nifi-docs/rest-api/index.html) using the GET method are accessible using the following DC/OS CLI and HTTP commands.

CLI Example
```shell
dcos nifi api get <nifi_get_endpoints_uri>
```

HTTP Example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/nifi-api/get?uri=<nifi_get_endpoints_uri>
```

## Control NiFi node using POST endpoint

All DC/OS NiFi Service [endpoints](https://nifi.apache.org/docs/nifi-docs/rest-api/index.html) using the POST method are accessible using the following DC/OS CLI and HTTP commands.

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

## Control NiFi node using PUT endpoint

All DC/OS NiFi Service [endpoints](https://nifi.apache.org/docs/nifi-docs/rest-api/index.html) using the PUT method are accessible using the following DC/OS CLI and HTTP commands.

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

## Control NiFi node using DELETE endpoint

All DC/OS NiFi Service [endpoints](https://nifi.apache.org/docs/nifi-docs/rest-api/index.html) using the DELETE method are accessible using the following DC/OS CLI and HTTP commands.

CLI Example
```shell
dcos nifi api delete <nifi_delete_endpoints_uri>
```

HTTP Example

```shell
curl -X DELETE -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/nifi-api/delete?uri=<nifi_delete_endpoints_uri>
```
