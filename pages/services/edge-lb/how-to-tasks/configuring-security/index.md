---
layout: layout.pug
navigationTitle: Security certificates and secrets
title: Security certificates and secrets
menuWeight: 24
excerpt: Provides examples for configuring security settings for Edge-LB pools
enterprise: true
---

Edge-LB runs on DC/OS Enterprise clusters with permissive or strict security. You can also use secure socket layer (SSL) certificates to secure the gateway between the external network and the DC/OS cluster. This section provides code examples that illustrate how to set security-related Edge-LB pool configuration options.

# Before you begin
Before you create Edge-LB pools and pool configuration files, you should have DC/OS Enterprise cluster nodes installed and ready to use and have previously downloaded and installed the latest Edge-LB packages. 

For information about installing Edge-LB packages, see the [installation](/services/edge-lb/getting-started/installing/) instructions.

# Using SSL/TLS certificates

There are three different ways to get and use a certificate for secure communication. You can use:
- Self-signed or trusted certificates as part of a public key infrastructure (PKI). 
- Secrets stored as encrypted files in the DC/OS vault.
- Environment variables stored as secrets in the DC/OS vault.

## Automatically generated self-signed certificate

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

## DC/OS Secrets (Enterprise Only)

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

## Environment variables (Insecure)

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

# Using host name and SNI routing with VHOSTS

To direct traffic based on the host name to multiple backends for a single port (such as 80 or 443), you can use the `pool.haproxy.frontend.linkBackend` setting.

## Before you begin
- You must have at least one secure socket layer (SSL) certificiate for the Edge-LB service account. Depending on the security requirements of the cluster, you might have additional SSL certificates that you want to use for access to the linked backend.
- You should create and store a DC/OS secret for each unique SSL certificate you are using. However, one secret is enough if the SSL certificate includes a wildcard that matches several separate websites with the same layer-2 domain namespace. For example, you only need to create and store one secret if you have a certificate to trust any website in the `*.ajuba.net` domain.

- Each secret should contain sections similar to the following:

  ```
  -----BEGIN CERTIFICATE-----
  ...certificate body here...
  -----END CERTIFICATE-----
  -----BEGIN RSA PRIVATE KEY-----
  ...private key body here...
  -----END RSA PRIVATE KEY-----
  ```

For more information about creating and storing secrets, see [Secrets](/1.13/security/ent/secrets/).

## Sample configuration
After you have created or identified the SSL certificate and stored it securely in DC/OS Secrets, you can route traffic to multiple backends using the `pool.haproxy.frontend.linkBackend` setting as illustrated in the following example:

```json
{
  "apiVersion": "V2",
  "name": "vhost-routing",
  "count": 1,
  "secrets": [
    {
      "secret": "mysslsecret1",
      "file": "mysecretfile1"
    },
    {
      "secret": "mysslsecret2",
      "file": "mysecretfile2"
    }
    ],
    "haproxy": {
      "frontends": [
        {
          "bindPort": 80,
          "protocol": "HTTP",
          "linkBackend": {
            "map": [
            {
              "hostEq": "nginx.example.com",
              "backend": "nginx"
            },
            {
              "hostReg": ".*.httpd.example.com",
              "backend": "httpd"
            }
            ]
          }
        },
        {
          "bindPort": 443,
          "protocol": "TLS",
          "certificates": [
            "$SECRETS/mysecretfile1",
            "$SECRETS/mysecretfile2"
            ],
          "linkBackend": {
            "map": [
            {
              "hostEq": "nginx.example.com",
              "backend": "nginx"
            },
            {
              "hostReg": ".*.httpd.example.com",
              "backend": "httpd"
            }
          ]
          }
        }  
      ],
        "backends": [
          {
            "name": "httpd",
            "protocol": "HTTP",
            "services": [
              {
                "marathon": {
                  "serviceID": "/host-httpd"
                  },
                "endpoint": {
                  "portName": "web"
                }
              }
            ]
          },
      {
        "name": "nginx",
        "protocol": "HTTP",
        "services": [
          {
            "mesos": {
              "frameworkName": "marathon",
              "taskName": "bridge-nginx"
              },
            "endpoint": {
              "portName": "web"
              }
          }
        ]
      }
    ]
  }
}
```
