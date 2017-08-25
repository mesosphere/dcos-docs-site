---
layout: layout.pug
title: Edge-LB Examples
menuWeight: 6
excerpt: ""
featureMaturity: ""
enterprise: 'yes'
navigationTitle:  Edge-LB Examples
---

# <a name="sample-certificates"></a>SSL/TLS Certificate Usage

This example demonstrates 3 different ways to get and use a certificate:

- Automatically generated self-signed certificate.
- DC/OS Secrets.
- (Insecure) Environment variables.

```yaml
navigationTitle:  Edge-LB Examples
---
pools:
  - name: sample-certificates
    count: 1
    autoCertificate: true
    secrets:
      - secret: mysecret
        file: mysecretfile
    environmentVariables:
      ELB_FILE_HAPROXY_CERT: |
navigationTitle:  Edge-LB Examples
        -----BEGIN CERTIFICATE-----
        foo
navigationTitle:  Edge-LB Examples
        -----END CERTIFICATE-----
navigationTitle:  Edge-LB Examples
        -----BEGIN RSA PRIVATE KEY-----
        bar
navigationTitle:  Edge-LB Examples
        -----END RSA PRIVATE KEY-----
    haproxy:
      frontends:
        - bindPort: 443
          protocol: HTTPS
          certificates:
            - $AUTOCERT
          linkBackend:
            defaultBackend: host-httpd
        - bindPort: 444
          protocol: HTTPS
          certificates:
            - $SECRETS/mysecretfile
          linkBackend:
            defaultBackend: host-httpd
        - bindPort: 445
          protocol: HTTPS
          certificates:
            - $ENVFILE/ELB_FILE_HAPROXY_CERT
          linkBackend:
            defaultBackend: host-httpd
      backends:
        - name: host-httpd
          protocol: HTTP
          servers:
            - framework:
                value: marathon
              task:
                value: host-httpd
              port:
                name: web
```

# <a name="http-path"></a>HTTP/HTTPS URL Path Routing

This example sets the following HTTP/HTTPs paths:

- `http://<public-ip>/` - The `default-app` service.
- `http://<public-ip>/foo` - The `foo-app` service.
- `http://<public-ip>/bar` - The `bar-app` service.

```yaml
navigationTitle:  Edge-LB Examples
---
pools:
  - name: sample-path-routing
    count: 1
    haproxy:
      frontends:
        - bindPort: 80
          protocol: HTTP
          linkBackend:
            defaultBackend: backend-default
            map:
              - pathBeg: /foo
                backend: backend-foo
              - pathBeg: /bar
                backend: backend-bar
      backends:
        - name: backend-foo
          protocol: HTTP
          rewriteHttp:
            # The paths specified here means that "foo-app" will see
            # traffic coming in at "/" rather than at "/foo"
            path:
              fromPath: /foo
              toPath: /
          servers:
            - framework:
                value: marathon
              task:
                value: foo-app
              port:
                name: foo-port
        - name: backend-bar
          protocol: HTTP
          rewriteHttp:
            # The paths specified here means that "bar-app" will see
            # traffic coming in at "/" rather than at "/bar"
            path:
              fromPath: /bar
              toPath: /
          servers:
            - framework:
                value: marathon
              task:
                value: bar-app
              port:
                name: bar-port
        - name: backend-default
          protocol: HTTP
          servers:
            - framework:
                value: marathon
              task:
                value: default-app
              port:
                name: default-port
```

# <a name="http-vhost"></a>HTTP/HTTPS Virtual Host (VHost) Routing

This example sets the following VHost routes:

- `http://foo.example.com` - The `foo-app` service.
- `http://bar.example.com` - The `bar-app` service.

```yaml
navigationTitle:  Edge-LB Examples
---
pools:
  - name: sample-vhost-routing
    count: 1
    haproxy:
      frontends:
        - bindPort: 80
          protocol: HTTP
          linkBackend:
            map:
              - hostEq: foo.example.com
                backend: backend-foo
              - hostEq: bar.example.com
                backend: backend-bar
      backends:
        - name: backend-foo
          protocol: HTTP
          servers:
            - framework:
                value: marathon
              task:
                value: foo-app
              port:
                name: foo-port
        - name: backend-bar
          protocol: HTTP
          servers:
            - framework:
                value: marathon
              task:
                value: bar-app
              port:
                name: bar-port
```
