---
layout: layout.pug
navigationTitle: Setting up Let's Encrypt certificate
title: Setting up Let's Encrypt certificate
menuWeight: 10
excerpt: Setting up Let's Encrypt certificate for the cluster ingress
enterprise: false
---

In this section, we will walk you through how to set up a [Let's Encrypt][letsencrypt] certificate for the cluster ingress.
This would allow most browsers to validate the certificate for the cluster when the users try to log into the ops portal.

## Prerequisites

-   We assume you already have a Konvoy cluster provisioned using at least `v1.5.0`.
    If the cluster is provisioned using an older version of Konvoy (i.e., `v1.4.x`), please update `kubernetes-base-addons` to version `stable-1.16-1.4.0` or newer.
-   We assume you can setup a DNS [A record][dnsarecord] for the cluster ingress IP (or [CNAME][dnscname] for the cluster ingress load balancer hostname in the public cloud cases like AWS).

## Create DNS record for the cluster ingress

First, you need to obtain the cluster ingress IP (or the cluster ingress load balancer hostname in the public cloud case).
This information can be obtained by running the following command.

```bash
konvoy get ops-portal
```

The output will be something like the following.

```bash
Navigate to the URL below to access various services running in the cluster.
  https://ac7fa3de4d273408bbbbb4aed50b2488-476496619.us-west-2.elb.amazonaws.com/ops/landing
And login using the credentials below.
  Username: cocky_jepsen
  Password: Lh6USs6DVPdJri4RcTHE9vZ35BBejfJamHEBEH7kvRvanGfIAGcnhtjO8MiNl2F1

If the cluster was recently created, the dashboard and services may take a few minutes to be accessible.
```

In the above case, the cluster ingress load balancer hostname is `ac7fa3de4d273408bbbbb4aed50b2488-476496619.us-west-2.elb.amazonaws.com`.

Then, you need to create a DNS record for the cluster ingress load balancer hostname.
In this case, we created a DNS CNAME record `mycluster.company.com` to point to `ac7fa3de4d273408bbbbb4aed50b2488-476496619.us-west-2.elb.amazonaws.com`.
For the on premise case, the cluster ingress is an IP address, and you need to create a DNS A record.

## Setting up the cluster hostname

Modify `cluster.yaml` and configure the `konvoyconfig` Addon like the following.

```yaml
- name: konvoyconfig
  enabled: true
  values: |
    config:
      clusterHostname: mycluster.company.com
```

Then, save the configuration file and run the following command.

```bash
konvoy deploy addons
```

Once this finishes, you should be able to access the ops portal landing page using `https://mycluster.company.com/ops/landing`.
However, you will notice that the certificate is still self signed, thus cannot be validated by a typical browser.
The following steps will walk you through setting up a Let's Encrypt certificate for the cluster ingress.

## Create a Let's Encrypt certificate

Konvoy ships with `cert-manager` by default.
It has [ACME][acme] integration which would allow users to get a Let's Encrypt certificate automatically.

First, you need to create an ACME based `ClusterIssuer` by applying the following API object to the Konvoy cluster.

```bash
cat <<EOF | kubectl apply -f -
apiVersion: certmanager.k8s.io/v1alpha1
kind: ClusterIssuer
metadata:
  name: letsencrypt
spec:
  acme:
    # You must replace this email address with your own.
    # Let's Encrypt will use this to contact you about expiring
    # certificates, and issues related to your account.
    email: you-email-address@company.com
    server: https://acme-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      # Secret resource that will be used to store the account's private key.
      name: letsencrypt-private-key
    http01: {}
EOF
```

Then, ask the ACME based `ClusterIssuer` to issue a certificate for your cluster hostname.

```bash
cat <<EOF | kubectl apply -f -
apiVersion: certmanager.k8s.io/v1alpha1
kind: Certificate
metadata:
  name: acme-certs
  namespace: kubeaddons
spec:
  secretName: acme-certs
  issuerRef:
    kind: ClusterIssuer
    name: letsencrypt
  commonName: mycluster.company.com
  dnsNames:
  - mycluster.company.com
  acme:
    config:
    - http01:
        ingressClass: traefik
      domains:
      - mycluster.company.com
EOF
```

The `cert-manager` will then talk to Let's Encrypt server to get a valid certificate.
You can monitor this progress by describing the `Certificate` object like the following.

```bash
kubectl describe certificates -n kubeaddons acme-certs
```

## Update the cluster to use the Let's Encrypt certificate

Once the Let's Encrypt certificate has been issued, you need to update the cluster to use the new certificate.
This can be achieved by first modifying `cluster.yaml` like the following.

```yaml
- name: traefik
  enabled: true
  values: |
    ssl:
      caSecretName: acme-certs
- name: kube-oidc-proxy
  enabled: true
  values: |
    oidc:
      caSystemDefault: true
- name: dex-k8s-authenticator
  enabled: true
  values: |
    caCerts:
      enabled: true
      useSystemDefault: true
```

And then run the following command.

```bash
konvoy deploy addons
```

Once this finishes, access the ops portal landing page at `https://mycluster.company.com/ops/landing`.
You will notice that the certificate is trusted by your browser and is issued by Let's Encrypt.

[letsencrypt]: https://letsencrypt.org/
[acme]: https://tools.ietf.org/html/rfc8555
[dnscname]: https://en.wikipedia.org/wiki/CNAME_record
[dnsarecord]: https://en.wikipedia.org/wiki/List_of_DNS_record_types
