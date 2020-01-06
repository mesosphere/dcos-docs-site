---
layout: layout.pug
navigationTitle: Edge-LB pool configuration
title: Pool configuration (REST API V2)
menuWeight: 84
excerpt: Provides reference information for Edge-LB pool configurations settings (REST API V2)
enterprise: true
---

The tables in this section describe all possible configuration options. Most configuration options have default values that are applicable and appropriate for most organizations. You can modify the default configuration values to suit your requirements, if needed. However, you should review and test any configuration changes carefully before deploying them to a production environment.

# Before you modify configuration settings
If you plan to modify the Edge-LB pool configuration options, you should keep the following guidelines in mind:
- If a configuration option does not have a default value and you do not explicitly set a value, the configuration is left as empty (unconfigured), even for objects.
- You should set default values in the object that is furthest from the root object.
- You should always set a default for arrays.
- The purpose of a "nullable" configuration option is to allow the output JSON field to be set to the Go language "zero value". Without "nullable" support, the configuration option would be removed from the resulting JSON.
- Actual validation is done in the code, not expressed in swagger.
- If the data type for a configuration option is a boolean, an empty value is interpreted as "false". For boolean configuration options, you should not set a default value.
- Use CamelCase to set configuration values.
- Swagger only validates enumerated (enum) data values if the configuration option is a top level definition.

# API version compatibility
There are two versions of the Edge-LB API specification. The top-level configuration field `apiVersion` is used to distinguish between the two versions of the API specification. The two models are almost identical, with one important difference: `pool.haproxy.backends.servers` (in `apiVersion` V1) has been replaced with `pool.haproxy.backends.services` to a more intuitive way to select services and backends for HAProxy load balancers. 

Because the specifications are nearly identical, the reference information in this section provides details for the latest version of the Edge-LB API specification (V2). If you need pool configuration information for working with the older specification, see [Edge-LB pool configuration (REST API V1)](/services/edge-lb/reference/v1-reference/).

# Configuration file input format
Edge-LB accepts configuration files in either YAML or JSON format. In most cases, however, you should use JSON and migrate any previous configuration settings from YAML format to JSON. 

Because the YAML file format is intended for deprecation in favor or JSON format, the Edge-LB command-line inteface includes a command to convert YAML files to their equivalent JSON format. 

To convert a YAML configuration file to JSON and output the results to standard output (`stdout`), run the following command:

`dcos edgelb show --convert-to-json=/path/to/yaml`

For more information about using Edge-LB commands, see the [Edge-LB command-line interface](/services/edge-lb/reference/cli-reference/) reference information.

<a name="pool"></a>

# pool
The pool contains information on resources that the pool needs. Changes made to this section will relaunch the tasks.
<table class="table" style="table-layout: fixed">
<colgroup>
    <col span="1" width="40px">
    <col span="1" width="30px">
    <col span="1" width="80px">
    <!--<col span="1" width="40px">
    <col span="1" width="80px">-->
</colgroup>
<tr>
<th style="font-weight:bold">Key</th>
<th style="font-weight:bold">Type</th>
<th style="font-weight:bold">Description and related properties</th>
<!--<th style="font-weight:bold">Nullable</th>-->
<!--<th style="font-weight:bold">Properties</th>-->
</tr>
<tbody valign="top">
<tr>
<td>apiVersion</td><td>string</td><td>Specifies the API schema version of this pool object. Should be V2 for new pools.</td>
</tr>
<tr><td>name</td><td>string</td><td>Specifies the pool name.</td>
</tr>
<tr><td>namespace</td><td>string</td><td>Specifies the DC/OS space (sometimes also referred to as a "group").
<p>
Nullable: true.</td>
</tr>
<tr><td>packageName</td><td>string</td><td>Specifies the Edge-LB package name.</td></tr>
<tr><td>packageVersion</td><td>string</td> <td>Specifies the Edge-LB package version number.</td></tr>
<tr><td>role</td><td>string</td><td>Specifies the Mesos role for load balancers. Defaults to "slave_public" so that load balancers run on public agent nodes. You can use the asterisk (*) wild card to run load balancers on private agents. For more information about working with roles, see <a href="http://mesos.apache.org/documentation/latest/roles/">Mesos roles</a>. </td></tr>
<tr><td>cpus</td><td>number</td><td>Specifies CPU requirements.</td></tr>
<tr><td>cpusAdminOverhead</td><td>number</td><td>Specifies CPU requirements for administrative overhead.</td><tr>
<tr><td>mem</td><td>int32</td><td>Specifies general memory requirements (in MB).</td></tr>
<tr><td>memAdminOverhead</td><td>int32</td><td>Specifies memory requirements for administrative overhead (in MB).</td></tr>
<tr><td>disk</td><td>int32</td><td>Specifies disk size requirements (in MB).</td></tr>
<tr><td>count</td><td>integer</td><td>Specifies the number of load balancer instances in the pool.
<br />
Nullable: true.</td></tr>
<tr><td>constraints</td><td>string</td><td>Specifies Marathon style constraints for load balancer instance placement.
<br />
Nullable: true.</td></tr>
<tr><td>ports</td><td>array</td><td>Specifies the override ports to allocate for each load balancer instance.
<ul>
<li>Defaults to `haproxy.frontend.objs[].bindPort` and `haproxy.stats.bindPort`.</li>
<li>Use this field to pre-allocate all needed ports with or without the frontends present. For example: [80, 443, 9090].</li>
<li>If the length of the ports array is not zero, only the ports specified will be allocated by the pool scheduler.</li>
</ul>
</td></tr>
<tr><td>items</td><td>int32</td><td></td></tr>
<tr><td>secrets</td><td>array</td>
<td>Specifies the DC/OS secrets stored in files or environment variables for the Edge-LB service account.
<ul>
<li><a href="#secrets-prop">secret</a></li>
<li><a href="#secrets-prop">file</a></li>
</ul>
</td></tr>
<tr><td>environmentVariables</td><td>object</td><td>Specifies the environment variables to pass to tasks. If you use the prefix `ELB_FILE_`, the variable content is written to a file. For example, the contents of `ELB_FILE_MYENV` will be written to `$ENVFILE/ELB_FILE_MYENV`.
<p>
<a href="#env-var">additionalProperties</a>
</td></tr>
<tr><td>autoCertificate</td><td>boolean</td><td>Automatically generates a self-signed SSL/TLS certificate. A self-signed certificate is not generated by default. If this option is set, the self-signed  certificate is written to `$AUTOCERT`.</td></tr>
<tr><td>virtualNetworks</td><td>array</td>
<td>Specifies the virtual networks to join.
<ul>
<li><a href="#vn-prop">name</a></li>
<li><a href="#vn-prop">labels</a></li>
</ul>
</td></tr>
<tr><td>haproxy</td><td></td><td></td></tr>
<tr><td>poolHealthcheckGracePeriod</td><td>int32</td><td>Defines the period of time after starting the pool container during which failed health checks are ignored. The default grace period is 180 seconds. Introduced in v1.2.3.</td></tr>
<tr><td>poolHealthcheckInterval</td><td>int32</td><td>Defines health check execution interval. Only one health check executes at any given time. The default execution interval is 12 seconds. Introduced in v1.2.3.</td></tr>
<tr><td>poolHealthcheckMaxFail</td><td>int32</td><td>Defines how many consecutive failures to allow before marking the task as failed and forcing Mesos to kill the task. The default is 5 consecutive failures. Introduced in v1.2.3.</td></tr>
<tr><td>poolhealthcheckTimeout</td><td>int32</td><td>Defines the timeout enforced by Mesos on the health check execution. This setting should include the time it takes for the container to perform start-up operations such as fetch, setup, and start, and the time spent by the health check command executing the test. Introduced in v1.2.3.</td></tr>
</tbody>
</table>

<a name="secrets-prop"></a>

## pool.secrets

| <b>Key</b>    | <b>Type</b> | <b>Description</b>|
| ------------- | ----------- | ----------------- |
| secret        | object      |                   |

### pool.secrets.secret

| <b>Key</b>    | <b>Type</b> | <b>Description</b>|
| ------------- | ----------- | ----------- |
| secret        | string      | Specifies the secret name. |
| file          | string      | Specifies the file name for the secret.<br>For example, the file `myfile` will be found at `$SECRETS/myfile`.|

<a name="env-var"></a>

## pool.environmentVariables

| <b>Key</b>    | <b>Type</b> | <b>Description</b>|
| ------------- | ----------- | ----------------- |
| additionalProperties  | string  | Specifies the environment variables to pass to tasks.<br>If you use the environment varaible prefix `ELB_FILE_`, the variable is written to a file with that prefix. For example, the contents of the `ELB_FILE_MYENV` environment variable will be written to the file `$ENVFILE/ELB_FILE_MYENV`. |

<a name="vn-prop"></a>

## pool.virtualNetworks

| <b>Key</b>    | <b>Type</b> | <b>Description</b>|
| ------------- | ----------- | ----------------- |
| name          | string      | The name of the virtual network to join. |
| labels        | string      | Labels to pass to the virtual network plugin. |

<a name="haproxy-prop"></a>

## pool.haproxy

| <b>Key</b> | <b>Type</b> | <b>Description</b>|
| -----------| ----------- | ----------------- |
| stats      |         |                     |
| frontends  | array   | Array of frontends. |
| backends   | array   | Array of backends.  |

<a name="stats-prop"></a>

### pool.haproxy.stats

| <b>Key</b>    | <b>Type</b> | <b>Description</b>|
| -------------- | ---------- | ------------------|
| bindAddress    | string   | Specifies the IP address for the HAProxy statistics endpoint. |
| bindPort       | int 32   | Specifies the port number for the HAProxy statistics endpoint.

<a name="frontend-prop"></a>

# pool.haproxy.frontend
<table class="table" style="table-layout: fixed">
<colgroup>
    <col span="1" width="40px">
    <col span="1" width="30px">
    <col span="1" width="80px">
    <!--<col span="1" width="40px">
    <col span="1" width="80px">-->
</colgroup>
<tr>
<th style="font-weight:bold">Key</th>
<th style="font-weight:bold">Type</th>
<th style="font-weight:bold">Description and related properties</th>
</tr>
<tbody valign="top">
<tr>
<td>name</td><td>string</td><td>Defaults to `frontend_{{bindAddress}}_{{bindPort}}`.</td></tr>
<tr><td>bindAddress</td><td>string</td><td>Only use characters that are allowed in the frontend name. Known invalid frontend name characters include `*`, `[`, and `]`.</td></tr>
<tr><td>bindPort</td><td>integer</td><td>The port that this frontend will bind to. For example, port `80` for HTTP or port `443` for HTTPS.</td></tr>
<tr><td>bindModifier</td><td>string</td><td>Additional text to put in the bind field.</td></tr>
<tr><td>certificates</td><td>array</td><td>SSL/TLS certificates in the load balancer.
<ul><li>For secrets, use `$SECRETS/my_file_name`</li>
<li>For environment files, use `$ENVFILE/my_file_name`</li>
<li>For autoCertificate, use `$AUTOCERT`.</li>
type: string
</ul></td></tr>
<tr><td>redirectToHttps</td><td>object</td><td>Setting this option to the empty object is enough to redirect all traffic from HTTP (this frontend) to HTTPS (port 443). 
<ul><li><a href="#redirect-https-prop">except</a></li>
<li><a href="#redirect-https-prop">items</a></li>
</ul>
The default is `except`.</td></tr>
<tr><td>miscStrs</td><td>array of strings</td><td>Specifies additional template lines inserted before `use_backend`</td></tr>
<tr><td>protocol</td><td></td><td>The frontend protocol is how clients/users communicate with HAProxy.</td></tr>
<tr><td>linkBackend</td><td>object</td><td>Specifies the backends to send traffic to. This can be expressed with a variety of filters such as matching on the hostname or the HTTP URL path.
<ul>
<li><a href="#backend-prop">defaultBackend</a></li>
<li><a href="#backend-prop">map</a></li>
</ul>
The default is `map`.</td></tr>
</tbody>
</table>

<a name="redirect-https-prop"></a>

## pool.haproxy.frontend.redirectToHttps
<table class="table" style="table-layout: fixed">
<colgroup>
    <col span="1" width="40px">
    <col span="1" width="30px">
    <col span="1" width="80px">
</colgroup>
<tr>
<th style="font-weight:bold">Key</th>
<th style="font-weight:bold">Type</th>
<th style="font-weight:bold">Description and related properties</th>
<tbody valign="top">
<tr><td>except</td><td>array</td><td>You can additionally set a whitelist of fields that must be matched to allow HTTP.</td></tr>
<tr><td>items</td><td>object</td><td>Boolean AND will be applied with every selected value. 
<ul>
<li><a href="#items-prop">host</a></li>
<li><a href="#items-prop">pathBeg</a></li>
</ul>
</td></tr>
</tbody>
</table>

<a name="items-prop"></a>

### pool.frontend.redirectToHttps.items

| <b>Key </b>|<b>Type</b>|<b>Description</b>|
| ---------- | --------- | ---------------- |
| host       | string  | Match on host. |
| pathBeg    | string  | Math on path.  |

<a name="backend-prop"></a>

## pool.haproxy.frontend.linkBackend
<table class="table" style="table-layout: fixed">
<colgroup>
    <col span="1" width="40px">
    <col span="1" width="30px">
    <col span="1" width="80px">
</colgroup>
<tr>
<th style="font-weight:bold">Key</th>
<th style="font-weight:bold">Type</th>
<th style="font-weight:bold">Description and related properties</th>
<tbody valign="top">
<tr><td>
defaultBackend</td><td>string</td><td>This is the default backend that is routed to if none of the other filters are matched.</td></tr>
<tr><td>map</td><td>array</td><td>This is an optional field that specifies a mapping to various backends. These rules are applied in order.<br />"Backend" and at least one of the condition fields must be filled out. If multiple conditions are filled out, they will be combined with a boolean "AND". 
<ul>
<li><a href="#map-prop">backend</a></li>
<li><a href="#map-prop">hostEq</a></li>
<li><a href="#map-prop">hostReg</a></li>
<li><a href="#map-prop">pathBeg</a></li>
<li><a href="#map-prop">pathEnd</a></li>
<li><a href="#map-prop">pathReg</a></li>
</ul>
</td></tr>
</tbody>
</table>

<a name="map-prop"></a>

### pool.frontend.linkBackend.map

|<b>Key</b>|<b>Type</b>|<b>Description</b> |
| -------- | --------- | ----------------- |
| backend  | string  |             |
| hostEq   | string  | Must be all lowercase. |
| hostReg  | string  | Must be all lowercase. It is possible for a port (for example `foo.com:80`) to be in this regular expression (regex).  |
| pathBeg  | string  |             |
| pathEnd  | string  |             |
| pathReg  | string  |             |

<a name="backend-prop"></a>

# pool.haproxy.backend
<table class="table" style="table-layout: fixed">
<colgroup>
    <col span="1" width="40px">
    <col span="1" width="30px">
    <col span="1" width="80px">
</colgroup>
<tr>
<th style="font-weight:bold">Key</th>
<th style="font-weight:bold">Type</th>
<th style="font-weight:bold">Description and related properties</th>
<tbody valign="top">
<tr><td>name</td><td>string</td><td>Defines the name the frontend refers to.</td></tr>
<tr><td>protocol</td><td>string</td><td>Determines the backend protocol used. The backend protocol is how HAProxy communicates with the servers it is load balancing.</td></tr>
<tr><td>rewriteHttp</td><td></td><td>Manipulates HTTP headers. There is no effect unless the protocol is either HTTP or HTTPS.</td></tr>
<tr><td>balance</td><td>string</td><td>Specifies the load balancing strategy. For example, `roundrobin` or `leastconn`. For more information about load balancing algorithms you can use, see `HAPROXY_BACKEND_HEAD` in <a href="/services/edge-lb/reference/haproxy-templates-labels"> HAProxy templates and labels</a>.</td></tr>
<tr><td>customCheck</td><td>object</td><td>Specifies alternate forms of healthchecks.
<ul>
<li><a href="#customCheck-prop">httpchk</a></li>
<li><a href="#customCheck-prop">httpchkMiscStr</a></li>
<li><a href="#customCheck-prop">sslHelloChk</a></li>
<li><a href="#customCheck-prop">miscStr</a></li>
</ul>
</td></tr>
<tr><td>miscStrs</td><td>array of strings</td><td>Additional template lines inserted before servers.</td></tr>
<tr><td>services</td><td>array</td><td>Array of backend service selectors.</td></tr>
</tbody>
</table>

<a name="customCheck-prop"></a>

## pool.haproxy.backend.customCheck

| <b>Key</b>     |<b>Type</b>|
| -------------  | --------  |
| httpchk        | boolean   |
| httpchkMiscStr | string    |
| sslHelloChk    | boolean   |
| miscStr        | string    |

<a name="#rewrite-prop"></a>

## pool.haproxy.backend.rewriteHttp
<table class="table" style="table-layout: fixed">
<colgroup>
    <col span="1" width="40px">
    <col span="1" width="30px">
    <col span="1" width="80px">
</colgroup>
<tr>
<th style="font-weight:bold">Key</th>
<th style="font-weight:bold">Type</th>
<th style="font-weight:bold">Description and related properties</th>
<tbody valign="top">
<tr><td>host</td><td>string</td><td>Sets the host header value.</td></tr>
<tr><td>path</td><td>object</td><td>Rewrites the HTTP URL path. All fields required. If any field is not specified the `path` object is ignored.
<ul>
<li><a href="#path-prop">fromPath</a></li>
<li><a href="#path-prop">toPath</a></li>
</ul></td></tr>
<tr><td>request</td><td>
<tr><td>response</td><td>
<tr><td>sticky</td><td>object</td><td>Sticky sessions using a cookie.
<ul>
<li><a href="#sticky-prop">enabled</a></li>
<li><a href="#sticky-prop">customStr</a></li>
</ul>
To use the default values (recommended), set this field to the empty object.</td></tr>
</tbody>
</table>

<a name="path-prop"></a>

## pool.haproxy.backend.rewriteHttp.path

| <b>Key</b>| <b>Type</b>|
| --------- | ---------- |
| fromPath  | string  |
| toPath    | string  |

<a name="sticky-prop"></a>

## pool.haproxy.backend.rewriteHttp.sticky

|<b>Key</b> |<b>Type</b>|<b>Nullable</b>|
| --------- | ------- | ---------- |
| enabled   | boolean | true       |
| customStr | string  |            |

<a name="rewrite-req-prop"></a>

## pool.haproxy.backend.rewriteHttp.request

|<b>Key </b>      |<b>Type</b>|<b>Nullable</b>|
----------------- | --------- | ---------- |
| forwardfor      | boolean   | true       |
| xForwardedPort  | boolean   | true       |
| xForwardedProtoHttpsIfTls   | boolean  | true |
| setHostHeader               | boolean  | true  |
| rewritePath                 | boolean  | true  |

<a name="rewrite-resp-prop"></a>

## pool.haproxy.backend.rewriteHttp.response

|<b>Key</b>       |<b>Type</b> |<b>Description</b>|
| --------------- | ---------- | ---------------- |
| rewriteLocation | boolean    | Enables HAProxy to rewrite the HTTP backend response location if true.<br />
Nullable = true. |

<a name="service-prop)"></a>

## pool.haproxy.backend.service

|<b>Key</b>       |<b>Type</b> |<b>Description</b>|
| --------------- | ---------- | ---------------- |
|<a href="#service-marathon-prop">marathon</a> | object | Indicates the backend service is a Marathon pod or application.
|<a href="#service-mesos-prop">mesos</a>| object | Indicates the backend service is a Mesos framework.
|<a href="#service-endpoint-prop">endpoint</a>| object | Indicates the backend service is an endpoint other than Marathon or Mesos.

<a name="service-marathon-prop"></a>

### pool.haproxy.backend.service.marathon

|<b>Key</b>  |<b>Type</b>|<b>Description</b> |
| ---------- | --------- | ------------------|
| serviceID  | string    | Specifies the Marathon pod or application ID.|
| serviceIDPattern | string    | Specifies the serviceID as a regular expression (regex) pattern.|
| containerName        | string    | Specifies the Marathon pod container name. This property is optional unless you are using Marathon pods. |
| containerNamePattern | string    | Specifies the containerName as a regular expression (regex) pattern.|

<a name="service-mesos-prop"></a>

### pool.haproxy.backend.service.mesos

|<b>Key</b>|<b>Type</b>|<b>Description</b>|
| -------- | --------- | -----------      |
| frameworkName  | string    | Specifies the Mesos framework name.|
| frameworkNamePattern | string  | Specifies the Mesos frameworkName as a regular expression (regex) pattern. |
| frameworkID  | string    | Specifies the Mesos framework ID. |
| frameworkIDPattern   | string    | Specifies the Mesos frameworkID as a regular expression (regex) pattern.   |
| taskName       | string    | Specifies the Mesos task name. |
| taskNamePattern | string    | Specifies the Mesos taskName as a regular expression (regex) pattern. |
| taskID      | string    | Specifies the Mesos task ID. |
| taskIDPattern  | string    | Specifies the Mesos taskID as a regular expression (regex) pattern.|

<a name="service-endpoint-prop"></a>

### pool.haproxy.backend.service.endpoint
<table class="table" style="table-layout: fixed">
<colgroup>
    <col span="1" width="40px">
    <col span="1" width="30px">
    <col span="1" width="80px">
</colgroup>
<tr>
<th style="font-weight:bold">Key</th>
<th style="font-weight:bold">Type</th>
<th style="font-weight:bold">Description and related properties</th>
<tbody valign="top">
<tr><td>type</td><td>string</td><td>Specifies the endpoint type. This property is an enumerated field that can be one of the following valid values:
<ul>
<li>AUTO_IP</li>
<li>AGENT_IP</li>
<li>CONTAINER_IP</li>
<li>ADDRESS</li>
</ul>
The default is <code>AUTO_IP</code>.</td></tr>
<tr><td>miscStr</td><td>string</td><td>Appends an arbitrary string that you want to add to the end of the "server" directive. </td></tr>
<tr><td>check</td><td>object</td><td>Enables health checks. By default, the referenced objects are TCP health checks. For more options, see <a href="#customCheck-prop">customCheck</a>. These properties are required for DNS resolution to function properly.</td></tr>
<tr><td>address</td><td>string</td><td>Specifies a server address override. This property can be used to specify a cluster internal address such as a virtual IP address (VIP). Only allowed when the `type` property is `ADDRESS`.</td></tr>
<tr><td>port</td><td>integer</td><td>Specifies the port number.</td></tr>
<tr><td>portName</td><td>string</td><td>Specifies the name of the port.</td></tr>
<tr><td>allPorts</td><td>boolean</td><td>Selects all ports defined in service when `true`.</td></tr>
</tbody>
</table>

<a name="service-endpoint-prop"></a>

### pool.haproxy.backend.service.endpoint.check

| <b>Key</b> |<b>Type</b>|<b>Description</b>|
| ---------- | --------- | ---------------- |
| enabled    | boolean   | Indicates whether the service endpoint check is enabled.
| customStr  | string    | Defines a custom string.

<a name="error-prop"></a>

# error

|<b>Key</b>|<b>Type</b>|<b>Description</b>|
| -------- | --------- | ---------------- |
| code     | int32     | Specifies the error result code. |
| message  | string    | Specifies the content of the error message. |
