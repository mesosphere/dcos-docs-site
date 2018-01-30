---
layout: layout.pug
navigationTitle: V2 Pool Examples
title: V2 Pool Examples
menuWeight: 86
excerpt:

enterprise: false
---

Example Edge-LB pool configurations using the V2 API.

# V2 Pool Examples

## Marathon Apps and DC/OS Services

DC/OS services are typically run as applications on the Marathon framework. To create a pool configuration file for a Marathon application, you will need to know the Mesos `task` name and `port` name.

For example, in the following snippet of a Marathon app definition, the `task` name is `my-app` and the `port` name is `web`.

```json
{
  "id": "/my-app",
  ...
  "portDefinitions": [
    {
      "name": "web",
      "protocol": "tcp",
      "port": 0
    }
  ]
}
```

If you are not sure about the Mesos task name for your application, check the Mesos web ui at `https://<cluster-url>/mesos`

Below is a simple example of a pool configuration for load-balancing a Marathon application like the one above:

```json
{
  "apiVersion": "V2",
  "name": "app-lb",
  "count": 1,
  "haproxy": {
    "frontends": [{
      "bindPort": 80,
      "protocol": "HTTP",
      "linkBackend": {
        "defaultBackend": "app-backend"
      }
    }],
    "backends": [{
      "name": "app-backend",
      "protocol": "HTTP",
      "services": [{
        "marathon": {
          "serviceID": "/my-app"
        },
        "endpoint": {
          "portName": "web"
        }
      }]
    }]
  }
}
```

## SSL/TLS certificates

There are 3 different ways to get and use a certificate:

### Automatically generated self-signed certificate

```json
{
  "apiVersion": "V2",
  "name": "auto-certificates",
  "count": 1,
  "autoCertificate": true,
  "haproxy": {
    "frontends": [
      {
        "bindPort": 443,
        "protocol": "HTTPS",
        "certificates": [
          "$AUTOCERT"
        ],
        "linkBackend": {
          "defaultBackend": "host-httpd"
        }
      }
    ],
    "backends": [{
      "name": "host-httpd",
      "protocol": "HTTP",
      "services": [{
        "marathon": {
          "serviceID": "/host-httpd"
        },
        "endpoint": {
          "portName": "web"
        }
      }]
    }]
  }
}
```

### DC/OS Secrets

```json
{
  "apiVersion": "V2",
  "name": "secret-certificates",
  "count": 1,
  "autoCertificate": false,
  "secrets": [
    {
      "secret": "mysecret",
      "file": "mysecretfile"
    }
  ],
  "haproxy": {
    "frontends": [
      {
        "bindPort": 443,
        "protocol": "HTTPS",
        "certificates": [
          "$SECRETS/mysecretfile"
        ],
        "linkBackend": {
          "defaultBackend": "host-httpd"
        }
      }
    ],
    "backends": [{
      "name": "host-httpd",
      "protocol": "HTTP",
      "services": [{
        "marathon": {
          "serviceID": "/host-httpd"
        },
        "endpoint": {
          "portName": "web"
        }
      }]
    }]
  }
}
```

### Environment variables (Insecure)

```json
{
  "apiVersion": "V2",
  "name": "env-certificates",
  "count": 1,
  "autoCertificate": false,
  "environmentVariables": {
    "ELB_FILE_HAPROXY_CERT": "-----BEGIN CERTIFICATE-----\nfoo\n-----END CERTIFICATE-----\n-----BEGIN RSA PRIVATE KEY-----\nbar\n-----END RSA PRIVATE KEY-----\n"
  },
  "haproxy": {
    "frontends": [
      {
        "bindPort": 443,
        "protocol": "HTTPS",
        "certificates": [
          "$ENVFILE/ELB_FILE_HAPROXY_CERT"
        ],
        "linkBackend": {
          "defaultBackend": "host-httpd"
        }
      }
    ],
    "backends": [{
      "name": "host-httpd",
      "protocol": "HTTP",
      "services": [{
        "marathon": {
          "serviceID": "/host-httpd"
        },
        "endpoint": {
          "portName": "web"
        }
      }]
    }]
  }
}
```

## Virtual Networks

In this example we create a pool that will be launched on the virtual network provided by DC/OS overlay called "dcos". In general you can launch a pool on any CNI network, by setting `pool.virtualNetworks[].name` to the CNI network name.

```json
{
  "apiVersion": "V2",
  "name": "vnet-lb",
  "count": 1,
  "virtualNetworks": [
    {
      "name": "dcos",
      "labels": {
        "key0": "value0",
        "key1": "value1"
      }
    }
  ],
  "haproxy": {
    "frontends": [{
      "bindPort": 80,
      "protocol": "HTTP",
      "linkBackend": {
        "defaultBackend": "vnet-be"
      }
    }],
    "backends": [{
      "name": "vnet-be",
      "protocol": "HTTP",
      "services": [{
        "marathon": {
          "serviceID": "/my-vnet-app"
        },
        "endpoint": {
          "portName": "my-vnet-port"
        }
      }]
    }]
  }
}
```
