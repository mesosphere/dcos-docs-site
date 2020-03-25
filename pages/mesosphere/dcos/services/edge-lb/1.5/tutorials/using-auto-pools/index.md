---
layout: layout.pug
navigationTitle: Using Auto Pools to Expose Applications
title: Using Auto Pools to Expose Applications
menuWeight: 12
excerpt: Exposing applications using Auto Pools.
enterprise: true
---

This tutorial demonstrates how to set labels on Marathon&trade; applications to expose those applications using Auto Pools. In addition, it demonstrates the procedure for creating new Auto Pools and editing the template used by an Auto Pool. Auto Pools enable the operator to delegate application exposure to the developers responsible for that application.

# Before you begin
You must have:
* Edge-LB installed as described in the Edge-LB [installation instructions](/mesosphere/dcos/services/edge-lb/1.5/getting-started/installing).
* The core DC/OS command-line interface (CLI) installed and configured to communicate with the DC/OS cluster.
* The `edgelb` command-line interface (CLI) installed.
* An active and properly-configured DC/OS Enterprise cluster, with at least one DC/OS **private agent** node to run the load-balanced service and at least one DC/OS **public agent** node for exposing the load-balanced service.

# Exposing an application
An application is exposed by setting the label `edgelb.expose` to the string `true`. For example the application:

```json
{
  "id": "/auto-pool-tutorial",
  "labels": {
      "edgelb.expose": "true"
  },
  "instances": 1,
  "portDefinitions": [
    {
      "name": "id",
      "protocol": "tcp",
      "port": 0
    }
  ],
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "mesosphere/id-server:2.1.0"
    }
  },
  "cpus": 0.1,
  "requirePorts": false,
  "mem": 32,
  "cmd": "/start $PORT0 tutorial"
}
```

The application is a simple server that responds with the word `tutorial` when queried at the url path `/id`. By setting the labels to include `"edgelb.expose": "true"`, the default Edge-LB Auto Pool will start:

```bash
dcos edgelb list
  NAME  APIVERSION  COUNT  ROLE  PORTS

dcos marathon app add auto-pool-tutorial.json
Created deployment c1319ff4-1729-4b4a-a01f-c94091c29c35

dcos edgelb list
  NAME          APIVERSION  COUNT  ROLE          PORTS
  auto-default  V2          1      slave_public
```

The endpoints (external IPs) can be found as well:

```bash
dcos edgelb endpoints auto-default
  NAME                 PORT  INTERNAL IPS  EXTERNAL IPS
  frontend_0.0.0.0_80  80    10.0.4.151    34.211.12.88
  stats                9090  10.0.4.151    34.211.12.88
Public/private IPs metadata is inaccurate in case of pools that use virtual networks.
```

The `default` pool template generated a frontend and backend configuration to expose the application using `HTTP` on port `80`:

```bash
curl http://34.211.12.88/id
tutorial
```

# Label Format

Label keys are specified hierarchically under the root `edgelb` separated by `.`'s. For example:

```
edgelb.<group>.frontend.certificates
```

Some labels use a `<group>` in their name. The `<group>` value can be any ASCII string value except `expose`, `template`, `delimiter`, `item_delimiter`, `key_delimiter`, and the string cannot contain a `.`.

Groups are used for two tasks:

1. Grouping `frontend` and `backend` options, allowing a single task to be exposed in multiple frontends.
2. Grouping `backend` services, such as multiple instances on a Marathon app.
    All tasks with the same `<group>` will be listed as a separate service entry in a single `backend` named by the group. The default group if no options are provided is `__default__`.

We recommend using the `<group>` field to describe the frontend app, such as `website` or `broker`.

## Frontend Customization

Without further labels to customize the frontend, the `default` pool template will forward all URLs from `/` on to the application.

## SSL

If the application specifies a certificate, then it will be exposed out using `HTTPS` instead of `HTTP`. The certificate label can be the name of a certificate stored in a `secret`, or the special name `$AUTOCERT` to use the default Edge-LB self signed certificate:

```json
{
  "id": "/auto-pool-tutorial",
  "labels": {
      "edgelb.expose": "true",
      "edgelb.secure.frontend.certificates": "$AUTOCERT"
  },
  "instances": 1,
  "portDefinitions": [
    {
      "name": "id",
      "protocol": "tcp",
      "port": 0
    }
  ],
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "mesosphere/id-server:2.1.0"
    }
  },
  "cpus": 0.1,
  "requirePorts": false,
  "mem": 32,
  "cmd": "/start $PORT0 tutorial"
}
```

```bash
dcos marathon app update /auto-pool-tutorial < auto-pool-tutorial.json
Created deployment 569c4ec1-41f9-4345-a675-03b16ba10585

dcos edgelb endpoints auto-default
  NAME                  PORT  INTERNAL IPS  EXTERNAL IPS
  frontend_0.0.0.0_443  443   10.0.4.151    34.211.12.88
  stats                 9090  10.0.4.151    34.211.12.88
Public/private IPs metadata is inaccurate in case of pools that use virtual networks.

curl -k https://34.211.12.88/id
tutorial
```

The certificates key is a list, with list items separated by `,` by default:

```json
{
  "id": "/auto-pool-tutorial",
  "labels": {
      "edgelb.expose": "true",
      "edgelb.secure.frontend.certificates": "tutorial-secret,$AUTOCERT"
  },
  "instances": 1,
  "portDefinitions": [
    {
      "name": "id",
      "protocol": "tcp",
      "port": 0
    }
  ],
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "mesosphere/id-server:2.1.0"
    }
  },
  "cpus": 0.1,
  "requirePorts": false,
  "mem": 32,
  "cmd": "/start $PORT0 tutorial"
}
```

```bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -subj '/CN=example.com' -nodes
Generating a 4096 bit RSA private key
....................++
.........................................................++
writing new private key to 'key.pem'
-----

cat cert.pem key.pem > haproxy1.pem

dcos security secrets create -f haproxy1.pem tutorial-secret

dcos marathon app update /auto-pool-tutorial < auto-pool-tutorial.json
Created deployment dd546869-3144-4bdc-ba76-6afb4faffd25

curl -k -v https://34.211.12.88/id
*   Trying 34.211.12.88...
* TCP_NODELAY set
* Connected to 34.211.12.88 (34.211.12.88) port 443 (#0)
* ALPN, offering h2
* ALPN, offering http/1.1
* Cipher selection: ALL:!EXPORT:!EXPORT40:!EXPORT56:!aNULL:!LOW:!RC4:@STRENGTH
* successfully set certificate verify locations:
*   CAfile: /etc/ssl/cert.pem
  CApath: none
* TLSv1.2 (OUT), TLS handshake, Client hello (1):
* TLSv1.2 (IN), TLS handshake, Server hello (2):
* TLSv1.2 (IN), TLS handshake, Certificate (11):
* TLSv1.2 (IN), TLS handshake, Server key exchange (12):
* TLSv1.2 (IN), TLS handshake, Server finished (14):
* TLSv1.2 (OUT), TLS handshake, Client key exchange (16):
* TLSv1.2 (OUT), TLS change cipher, Client hello (1):
* TLSv1.2 (OUT), TLS handshake, Finished (20):
* TLSv1.2 (IN), TLS change cipher, Client hello (1):
* TLSv1.2 (IN), TLS handshake, Finished (20):
* SSL connection using TLSv1.2 / ECDHE-RSA-AES128-GCM-SHA256
* ALPN, server did not agree to a protocol
* Server certificate:
*  subject: CN=example.com
*  start date: Aug 16 15:22:43 2019 GMT
*  expire date: Aug 15 15:22:43 2020 GMT
*  issuer: CN=example.com
*  SSL certificate verify result: self signed certificate (18), continuing anyway.
> GET /id HTTP/1.1
> Host: 34.211.12.88
> User-Agent: curl/7.54.0
> Accept: */*
>
< HTTP/1.1 200 OK
< date: Fri, 16 Aug 2019 16:24:10 GMT
< content-length: 8
< content-type: text/plain; charset=utf-8
<
* Connection #0 to host 34.211.12.88 left intact
```

## VHost and URI path

You can specify the full set of Edge-LB [frontend "link"](/mesosphere/dcos/services/edge-lb/1.5/reference/pool-configuration-reference/v2-reference/#poolhaproxyfrontendlinkbackend) rules. To map only the VHost `example.com` to the application, follow this sample:

```json
{
  "id": "/auto-pool-tutorial",
  "labels": {
      "edgelb.expose": "true",
      "edgelb.secure.frontend.certificates": "tutorial-secret,$AUTOCERT",
      "edgelb.secure.frontend.rules": "hostEq:example.com|pathBeg:/id,hostEq:another.example.com"
  },
  "instances": 1,
  "portDefinitions": [
    {
      "name": "id",
      "protocol": "tcp",
      "port": 0
    }
  ],
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "mesosphere/id-server:2.1.0"
    }
  },
  "cpus": 0.1,
  "requirePorts": false,
  "mem": 32,
  "cmd": "/start $PORT0 tutorial"
}
```

```bash
dcos marathon app update /auto-pool-tutorial < auto-pool-tutorial.json
Created deployment 628c03b0-b555-40ab-99ef-8d9387f58864

curl -k https://34.211.12.88/id
<html><body><h1>503 Service Unavailable</h1>
No server is available to handle this request.
</body></html>

curl -k --resolve "example.com:443:34.211.12.88" https://example.com/id
tutorial

curl -k --resolve "another.example.com:443:34.211.12.88" https://another.example.com/id
tutorial
```

The `edgelb.<group>.frontend.rules` is a `list` of `maps`/`dicts`. The list uses the separator `|` to specify multiple items in the `map`.

## Port and Protocol Selection

The Port and Protocol can be overridden from the defaults. By default `80`/`HTTP` is used, unless a `certificate` is specified, then `443`/`HTTPS` is used. To change the port to `8443`:

```json
{
  "id": "/auto-pool-tutorial",
  "labels": {
      "edgelb.expose": "true",
      "edgelb.secure.frontend.certificates": "tutorial-secret,$AUTOCERT",
      "edgelb.secure.frontend.rules": "hostEq:example.com|pathBeg:/id,hostEq:another.example.com",
      "edgelb.secure.frontend.port": "8443",
      "edgelb.secure.frontend.protocol": "HTTPS"
  },
  "instances": 1,
  "portDefinitions": [
    {
      "name": "id",
      "protocol": "tcp",
      "port": 0
    }
  ],
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "mesosphere/id-server:2.1.0"
    }
  },
  "cpus": 0.1,
  "requirePorts": false,
  "mem": 32,
  "cmd": "/start $PORT0 tutorial"
}
```

```bash
dcos marathon app update /auto-pool-tutorial < auto-pool-tutorial.json
Created deployment 97a224e7-9f56-4c1e-8721-1106d767b422

curl -k --resolve "example.com:8443:34.211.12.88" https://example.com:8443/id
tutorial
```

You can specify any protocol supported by Edge-LB/HAProxy, such as `TCP`:

```json
{
  "id": "/auto-pool-tutorial",
  "labels": {
      "edgelb.expose": "true",
      "edgelb.secure.frontend.port": "8888",
      "edgelb.secure.frontend.protocol": "TCP"
  },
  "instances": 1,
  "portDefinitions": [
    {
      "name": "id",
      "protocol": "tcp",
      "port": 0
    }
  ],
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "mesosphere/id-server:2.1.0"
    }
  },
  "cpus": 0.1,
  "requirePorts": false,
  "mem": 32,
  "cmd": "/start $PORT0 tutorial"
}
```

```bash
dcos marathon app update /auto-pool-tutorial < auto-pool-tutorial.json
Created deployment 224b17de-c10d-48b5-8c91-45386ece78db

curl http://34.211.12.88:8888/id
tutorial
```

# Backend Customization

## Port Name Selection

To override the selection of the first `Port`, you can specify the backend `portName`:

```json
{
  "id": "/auto-pool-tutorial",
  "labels": {
      "edgelb.expose": "true",
      "edgelb.secure.frontend.certificates": "tutorial-secret,$AUTOCERT",
      "edgelb.secure.backend.portName": "id"
  },
  "instances": 1,
  "portDefinitions": [
    {
      "name": "id",
      "protocol": "tcp",
      "port": 0
    }
  ],
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "mesosphere/id-server:2.1.0"
    }
  },
  "cpus": 0.1,
  "requirePorts": false,
  "mem": 32,
  "cmd": "/start $PORT0 tutorial"
}
```

## Backend Protocol

By default the backend protocol is `HTTP` or matches the frontend protocol, if it is not `HTTP` or `HTTPS`. For example, if the frontend protocol is specified as `TCP`, the backend protocol will default to `TCP`.

You can override the backend protocol. Note that the `mesosphere/id-server:2.1.0` container image is `HTTP` only in the following example:

```json
{
  "id": "/auto-pool-tutorial",
  "labels": {
      "edgelb.expose": "true",
      "edgelb.secure.frontend.certificates": "tutorial-secret,$AUTOCERT",
      "edgelb.secure.backend.protocol": "HTTPS"
  },
  "instances": 1,
  "portDefinitions": [
    {
      "name": "id",
      "protocol": "tcp",
      "port": 0
    }
  ],
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "mesosphere/id-server:2.1.0"
    }
  },
  "cpus": 0.1,
  "requirePorts": false,
  "mem": 32,
  "cmd": "/start $PORT0 tutorial"
}
```

## Path rewriting

The path can be rewritten using `map`/`dict` with one item. The key is the path to map from, and value is the path to which to map. For example, the `mesosphere/id-server` container only responds to the URI path of `/id` to expose at the root:

```json
{
  "id": "/auto-pool-tutorial",
  "labels": {
      "edgelb.expose": "true",
      "edgelb.secure.backend.rewriteHttp.path": "/:/id"
  },
  "instances": 1,
  "portDefinitions": [
    {
      "name": "id",
      "protocol": "tcp",
      "port": 0
    }
  ],
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "mesosphere/id-server:2.1.0"
    }
  },
  "cpus": 0.1,
  "requirePorts": false,
  "mem": 32,
  "cmd": "/start $PORT0 tutorial"
}
```

```bash
dcos marathon app update /auto-pool-tutorial < auto-pool-tutorial.json
Created deployment 497cbee3-ebdc-4310-8ef3-03175aa52a66

curl http://34.211.12.88/
tutorial
```

# Template Management

## Status

You can show the template rendering status with the `pool-template` management command:

```bash
dcos edgelb pool-template list
  NAME
  default

dcos edgelb pool-template status default
  NAME     STATUS  MESSAGE
  default  OK      pool has been successfully
                   deployed
```

## Customizing the template

You can customize the template for any auto pool by downloading the template, and uploading the customized version. For example, to increase the count of pool servers:

```bash
dcos edgelb pool-template show default > template.tmpl
```

Edit the template using a text editor, and then upload it:

```bash
sed -i 's/"count": 1/"count": 2/' template.tmpl

# NOTE the update command returns the template content
dcos edgelb pool-template update default template.tmpl > /dev/null

dcos edgelb endpoints auto-default
  NAME                 PORT  INTERNAL IPS  EXTERNAL IPS
  frontend_0.0.0.0_80  80    10.0.5.197    18.237.65.131
                             10.0.7.159    54.191.168.185
  stats                9090  10.0.5.197    18.237.65.131
                             10.0.7.159    54.191.168.185

curl http://18.237.65.131/id
tutorial

curl http://54.191.168.185/id
tutorial
```

You can also reset the template back to the default at any time:

```bash
dcos edgelb pool-template reset default
Successfully reset Pool Template default. Check "dcos edgelb pool-template show default" or "dcos edgelb pool-template status default" for deployment status

dcos edgelb endpoints auto-default
  NAME                 PORT  INTERNAL IPS  EXTERNAL IPS
  frontend_0.0.0.0_80  80    10.0.7.159    54.191.168.185
  stats                9090  10.0.7.159    54.191.168.185
Public/private IPs metadata is inaccurate in case of pools that use virtual networks.
```

## Multiple Templates

You can create additional Auto Pools:

```bash
dcos edgelb pool-template create dobby
Successfully created dobby. Check "dcos edgelb pool-template show dobby" or "dcos edgelb pool-template status dobby" for deployment status

dcos edgelb pool-template list
  NAME
  default
  dobby
```

You can control the template/pool that an application exposes using the `edgelb.template` label:

```json
{
  "id": "/auto-pool-tutorial-dobby",
  "labels": {
      "edgelb.expose": "true",
      "edgelb.template": "dobby"
  },
  "instances": 1,
  "portDefinitions": [
    {
      "name": "id",
      "protocol": "tcp",
      "port": 0
    }
  ],
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "mesosphere/id-server:2.1.0"
    }
  },
  "cpus": 0.1,
  "requirePorts": false,
  "mem": 32,
  "cmd": "/start $PORT0 dobby"
}
```

```bash
dcos marathon app add auto-pool-tutorial-dobby.json
Created deployment 1968c08e-7780-4b32-af7f-fbb1f9e36198

dcos edgelb list
  NAME          APIVERSION  COUNT  ROLE          PORTS
  auto-default  V2          1      slave_public
  auto-dobby    V2          1      slave_public

dcos edgelb endpoints auto-dobby
  NAME                 PORT  INTERNAL IPS  EXTERNAL IPS
  frontend_0.0.0.0_80  80    10.0.5.197    18.237.65.131
  stats                9090  10.0.5.197    18.237.65.131
Public/private IPs metadata is inaccurate in case of pools that use virtual networks.

curl http://18.237.65.131/id
dobby
```
