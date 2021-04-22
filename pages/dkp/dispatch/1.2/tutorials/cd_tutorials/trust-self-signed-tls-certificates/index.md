---
layout: layout.pug
title: Configure ArgoCD to trust TLS certificates issued by a custom CA
navigationTitle: Configure ArgoCD to trust TLS certificates issued by a custom CA
beta: false
menuWeight: 105
excerpt: This tutorial configures ArgoCD to trust TLS certificates issued by a custom TLS certificates authority (CA).
---

# Deploy an application to multiple environments

## Prerequisites

This tutorial assumes that you have followed the steps on the following pages:

- [Dispatch Installation](../../../install/)

## ArgoCD and TLS certificate verification

ArgoCD will refuse to download gitops repository contents over an insecure TLS connection.

If you host your own SCM provider, such as GitHub Enterprise or GitLab, and have issued your own TLS certificate for it to use, then you will need to add your root CA certificate to ArgoCD before it will trust your SCM provider and download your gitops repository contents. TLS requires your application to present its end-entity certificate as well as the certificates of all intermediate CAs and so it is only necessary to add the root CA certificate to ArgoCD.

## Add the Root CA to ArgoCD

In the following example a GitLab Enterprise instance is running on a Konvoy cluster. The traefik ingress controller terminates HTTPS connections to the GitLab Enterprise instance running in the cluster. The ingress controller presents its own end-entity certificate as well as all intermediate CA certificates to any client connecting to it over HTTPS. It does not need to present the Konvoy cluster's root CA certificate.

In order to add the cluster's root CA certificate to ArgoCD, retrieve it using kubectl:

```sh
kubectl -n cert-manager get secret kubernetes-root-ca -o template --template='{{index .data "tls.crt" | base64decode }}'
```

The output looks something like the following:

```sh
-----BEGIN CERTIFICATE-----
MIICyDCCAbCgAwIBAgIBADANBgkqhkiG9w0BAQsFADAVMRMwEQYDVQQDEwprdWJl
cm5ldGVzMB4XDTIwMDQyMDIzMzQxMloXDTMwMDQxODIzMzQxMlowFTETMBEGA1UE
AxMKa3ViZXJuZXRlczCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKku
L496RNkwhDoeTye+jf/j7pJwNeTjBRpbQ7ZnQm7gEo+XoPY6Eo2zwJP/a0S7nwAn
g5wfggIgmciW2vmQKx8PfXhOxT04HEcGeUrJuG8h7tNjlGOYHK1D/FVg/EjaIyUM
DTDqvAigLsngfzlVtOiGbSPgzTkYw9e1BSG/7jyNOD6ucnbZYHj8lXzq46p5mKLk
vW+TLERj0K7phGzKCopLhp9UKQp7557rdf1jHyAxTvFIouVQNGL+R2SkpR9wuXQT
4bjuvTgo1QdkqNyhEbGLg6H8kfE2LFtUJah+lDpWyJF5SNen0013ECCGwubP1HPW
dWnyk75QBVFYFHz6+k0CAwEAAaMjMCEwDgYDVR0PAQH/BAQDAgKkMA8GA1UdEwEB
/wQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEBAJMNPj7KgGK8NFNpqYkWUnp4p0Np
GQF67vUoeb7iln3TEIbuJh/eOYwRFyqaoDe1Pg0iKYT0JPDJZgKxZZT6Om47a9Fm
/szDkN62L/VpbxMrDJAYOxN6XGqBz8TMxub1I8Nvlisz6sd5OIRLFgcu1H+NBy5s
cbDr4R1zOcsvx+SNrlHZU2cCI/wdEvdGCTbISojpgF9RR04FK5RltTAW+v1/CTqf
qUs21WivraywpanDnhGTbf7ySP7gYYxW592K+9MLUZbQtS5D4f5W0uH8xzOFuyJP
EJKZkA+7YAjqs7Jpe6Uq76ElLBVULaYplj27Cl9xY6Gn0gkOts2/iDmC1N4=
-----END CERTIFICATE-----
```

Save that output to a file:

```sh
kubectl -n cert-manager get secret kubernetes-root-ca -o template --template='{{index .data "tls.crt" | base64decode }}' > ca.crt
```

Next, use the Dispatch CLI to add the konvoy cluster root CA's certificate to ArgoCD. The GitLab Enterprise UI is served at https://gitlab.example.com/:

```sh
dispatch gitops cert add-tls gitlab.example.com --from=ca.crt
```

After a short interval of about 10 seconds, ArgoCD refreshes its TLS certificates and now trusts the TLS certificate chain presented by the server ArgoCD connects to https://gitlab.example.com/ to download any gitops repository hosted there.
