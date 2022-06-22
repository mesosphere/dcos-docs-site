---
layout: layout.pug
navigationTitle: Custom domain and certificate
title: Configure a custom domain and certificate
menuWeight: 30
excerpt: Configure a custom domain and certificate for your Management or any Managed/Attached cluster
beta: false
enterprise: false
---

DKP supports configuring a custom domain name for accessing the DKP UI and other platform services. Additionally, you can provide a custom certificate for each domain, or one can be issued automatically by Let's Encrypt, or other certificate authorities supporting the ACME protocol.

The configuration path is different depending on the cluster for which you want to customize the domain or certificate.

[Customize a domain or certificate in the **Management Cluster**][management] (during installation).

[Customize a domain or certificate in a **Managed Cluster**][managed] (after installation).

## Why to customize domains

DKP’s default configuration supports the customization of domains to allow you to use your own domain or hostname for your services.

For example, you can set up your DKP UI to be accessible via the provided domain instead of the URL provided by default. You can also use your domain to enable your company to access back end services, or your customers to access front end services via a specific domain. Or you can configure a custom domain to make a cluster accessible with a specific domain.

## Why to customize certificates

DKP’s default CA identity supports the encryption of data exchange and traffic (between your client and your environment’s server). To configure an additional security layer that validates your environment’s server authenticity, DKP supports configuring a custom certificate by a Certificate Authority with an ACME protocol like Let’s Encrypt, or a custom certificate created specifically for your organization.

Changing the default certificate for any of your clusters by modifying the ingress via an API can be helpful. For example, you can adapt it to classify your DKP UI or any other type of service as trusted (when accessing a service via a browser).

<p class="message--note"><strong>NOTE: </strong>Let’s Encrypt and ACME do not work in air-gapped scenarios, as they require connection to the Internet for their setup. For air-gapped environments, you are able to use the certificates issued by the cluster (selfSigned, which is the default configuration), or a certificate created specifically for this purpose (which you can use so no browser warnings appear when calling up your URL).</p>

[management]: ../../install/configuration/custom-domain/
[managed]: ../custom-domain-certificate/managed/
