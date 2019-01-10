---
layout: layout.pug
navigationTitle:  API Reference
title: API Reference
menuWeight: 90
excerpt: DC/OS NiFi Service API Reference
featureMaturity:
enterprise: false
model: ../../data.yml
render: mustache
---
#include /services/include/api-reference.tmpl


# Service Status Info
Send a GET request to the `/v1/state/properties/suppressed` endpoint to learn if  DC/OS {{model.techName }} is in a `suppressed` state and not receiving offers. If a service does not need offers, Mesos can "suppress" it so that other services are not starved for resources.
You can use this request to troubleshoot: if you think  DC/OS {{model.techName }} should be receiving resource offers, but is not, you can use this API call to see if  DC/OS {{model.techName }} is suppressed.

```shell
curl -H "Authorization: token=$auth_token" "<dcos_url>/service/{{ model.serviceName }}/v1/state/properties/suppressed"
```

# DC/OS {{model.techName }} Node Operations
These operations provide access to the DC/OS {{model.techName }} cluster node using the available DC/OS {{model.techName }} REST Api. The Rest Api provides programmatic access to command and control a DC/OS {{model.techName }} instance in real time. You can see the [DC/OS {{model.techName }} REST Api](https://{{ model.serviceName }}.apache.org/docs/{{ model.serviceName }}-docs/rest-api/index.html) for more about the available Api.


## List DC/OS {{model.techName }} Cluster Summary

CLI Example
```shell
dcos {{ model.serviceName }} cluster summary
```

HTTP Example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/{{ model.serviceName }}/v1/cluster/
```

## List DC/OS {{model.techName }} Node

CLI Example
```shell
dcos {{ model.serviceName }} node list
```

HTTP Example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/{{ model.serviceName }}/v1/nodes/
```

## List DC/OS {{model.techName }} Node for a status

CLI Example
```shell
dcos {{ model.serviceName }} node status <{{ model.serviceName }}_node_status>
```

HTTP Example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/{{ model.serviceName }}/v1/nodes/status/<{{ model.serviceName }}_node_status>
```

## Details of a DC/OS {{model.techName }} Node

CLI Example
```shell
dcos {{ model.serviceName }} node <{{ model.serviceName }}_node_id>
```

HTTP Example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/{{ model.serviceName }}/v1/nodes/<{{ model.serviceName }}_node_id>
```


## Remove a DC/OS {{model.techName }} Node

CLI Example
```shell
dcos {{ model.serviceName }} node remove <{{ model.serviceName }}_node_id>
```

HTTP Example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/{{ model.serviceName }}/v1/nodes/remove/<{{ model.serviceName }}_node_id>
```

## Control DC/OS {{model.techName }} Node using GET endpoint
All DC/OS {{model.techName }} [endpoints](https://{{ model.serviceName }}.apache.org/docs/{{ model.serviceName }}-docs/rest-api/index.html) uses GET method can be accessed from either the DC/OS CLI or HTTP.

CLI Example
```shell
dcos {{ model.serviceName }} api get <{{ model.serviceName }}_get_endpoints_uri>
```

HTTP Example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/{{ model.serviceName }}/v1/{{ model.serviceName }}-api/get?uri=<{{ model.serviceName }}_get_endpoints_uri>
```

## Control DC/OS {{model.techName }} Node using POST endpoint
All DC/OS {{model.techName }} [endpoints](https://{{ model.serviceName }}.apache.org/docs/{{ model.serviceName }}-docs/rest-api/index.html) uses POST method can be accessed from either the DC/OS CLI or HTTP.

CLI Example
```shell
dcos {{ model.serviceName }} api post <{{ model.serviceName }}_post_endpoints_uri> stdin
{
  "id": "",
  "service": ""
}
```

OR

```shell
dcos {{ model.serviceName }} api post <{{ model.serviceName }}_post_endpoints_uri> <json_payload_file>
```

HTTP Example

```shell
curl -X POST -H "Authorization:token=$auth_token" <dcos_url>/service/{{ model.serviceName }}/v1/{{ model.serviceName }}-api/post?uri=<{{ model.serviceName }}_post_endpoints_uri>
{
  "id": "",
  "service": ""
}
```

## Control DC/OS {{model.techName }} Node using PUT endpoint
All DC/OS {{model.techName }} [endpoints](https://{{ model.serviceName }}.apache.org/docs/{{ model.serviceName }}-docs/rest-api/index.html) using the PUT method can be accessed from either the DC/OS CLI or HTTP.

CLI Example
```shell
dcos {{ model.serviceName }} api put <{{ model.serviceName }}_put_endpoints_uri> stdin
{
  "id": "",
  "service": ""
}
```

OR

```shell
dcos {{ model.serviceName }} api post <{{ model.serviceName }}_put_endpoints_uri> <json_payload_file>
```

HTTP Example

```shell
curl -X PUT -H "Authorization:token=$auth_token" <dcos_url>/service/{{ model.serviceName }}/v1/{{ model.serviceName }}-api/put?uri=<{{ model.serviceName }}_put_endpoints_uri>
{
  "id": "",
  "service": ""
}
```

## Control DC/OS {{model.techName }} Node using DELETE endpoint
All DC/OS {{model.techName }} [endpoints](https://{{ model.serviceName }}.apache.org/docs/{{ model.serviceName }}-docs/rest-api/index.html) using the DELETE method can be accessed from either the DC/OS CLI or HTTP.

CLI Example
```shell
dcos {{ model.serviceName }} api delete <{{ model.serviceName }}_delete_endpoints_uri>
```

HTTP Example

```shell
curl -X DELETE -H "Authorization:token=$auth_token" <dcos_url>/service/{{ model.serviceName }}/v1/{{ model.serviceName }}-api/delete?uri=<{{ model.serviceName }}_delete_endpoints_uri>
```

# Connection API

```shell
curl -H "Authorization:token=$auth_token" dcos_url/service/{{ model.serviceName }}/v1/endpoints/<endpoint>
```

You will see a response similar to the following:

```json
{
  "address": [
    "10.0.1.120:1025",
    "10.0.1.128:1025"
  ],
  "dns": [
    "{{ model.serviceName }}-0-node.{{ model.serviceName }}.autoip.dcos.thisdcos.directory:1025",
    "{{ model.serviceName }}-1-node.{{ model.serviceName }}.autoip.dcos.thisdcos.directory:1025"
  ],
  "vip": "node.{{ model.serviceName }}.l4lb.thisdcos.directory:8080"
}
```