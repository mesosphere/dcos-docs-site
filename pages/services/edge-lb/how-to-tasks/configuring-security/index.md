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
