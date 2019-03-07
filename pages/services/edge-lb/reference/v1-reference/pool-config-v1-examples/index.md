---
layout: layout.pug
navigationTitle: Edge-LB pool configuration
title: Pool configuration examples (REST API V1)
menuWeight: -1
excerpt: Provides pool configuration examples for Edge-LB pool (REST API V1)
enterprise: true
---

If you are creating and managing Edge-LB pools using the Edge-LB RESTful API version 1 specification, set the top-level configuration field `apiVersion` to `v1` to indicate that you are using the older version of the API specification to create and modify Edge-LB pool configuration files. 

The code examples in this section illustrate configuration settings written in JSON to work with the [Edge-LB REST API V1](/services/edge-lb/reference/v1-reference/#api-v1) specification.

## Marathon apps and DC/OS services

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

If you are not sure about the Mesos task name for your application, check the Mesos web interface at `https://<cluster-url>/mesos`

Below is a simple example of a pool configuration for load-balancing a Marathon application like the one above:

```json
{
  "pools": [{
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
        "servers": [{
          "framework": {
            "value": "marathon"
          },
          "task": {
            "value": "my-app"
          },
          "port": {
            "name": "web"
          }
        }]
      }]
    }
  }]
}
```

## SSL/TLS certificates

There are three different ways to get and use a certificate:

### Automatically generated self-signed certificate

```json
{
  "pools": [
    {
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
        "backends": [
          {
            "name": "host-httpd",
            "protocol": "HTTP",
            "servers": [
              {
                "framework": {
                  "value": "marathon"
                },
                "task": {
                  "value": "host-httpd"
                },
                "port": {
                  "name": "web"
                }
              }
            ]
          }
        ]
      }
    }
  ]
}
```

### DC/OS Secrets

```json
{
  "pools": [
    {
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
        "backends": [
          {
            "name": "host-httpd",
            "protocol": "HTTP",
            "servers": [
              {
                "framework": {
                  "value": "marathon"
                },
                "task": {
                  "value": "host-httpd"
                },
                "port": {
                  "name": "web"
                }
              }
            ]
          }
        ]
      }
    }
  ]
}
```

### Environment variables (Insecure)

```json
{
  "pools": [
    {
      "name": "sample-certificates",
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
        "backends": [
          {
            "name": "host-httpd",
            "protocol": "HTTP",
            "servers": [
              {
                "framework": {
                  "value": "marathon"
                },
                "task": {
                  "value": "host-httpd"
                },
                "port": {
                  "name": "web"
                }
              }
            ]
          }
        ]
      }
    }
  ]
}
```

## Virtual Networks

In this example we create a pool that will be launched on the virtual network provided by a DC/OS overlay called "dcos". In general, you can launch a pool on any CNI network, by setting `pool.virtualNetworks[].name` to the CNI network name.

```json
{
  "pools": [
    {
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
        "frontends": [
          {
            "bindPort": 80,
            "protocol": "HTTP",
            "linkBackend": {
              "defaultBackend": "vnet-be"
            }
          }
        ],
        "backends": [
          {
            "name": "vnet-be",
            "protocol": "HTTP",
            "servers": [
              {
                "framework": {
                  "value": "marathon"
                },
                "task": {
                  "value": "my-vnet-app"
                },
                "port": {
                  "name": "my-vnet-port"
                }
              }
            ]
          }
        ]
      }
    }
  ]
}
```
